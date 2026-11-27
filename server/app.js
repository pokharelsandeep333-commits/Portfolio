import express from 'express';
import { isIP } from 'node:net';
import { z } from 'zod';
import { CHAT_CONTEXT_MESSAGES, CHAT_MESSAGE_CHARACTERS } from '../src/data/chatLimits.js';
import { directReply } from './facts.js';
import { generateReply } from './gemini.js';

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string().trim().min(1).max(CHAT_MESSAGE_CHARACTERS),
  })).min(1).max(50),
});
const unavailable = { error: 'The assistant is unavailable right now. Please try again in a moment.' };

export function createApp({ client, limits, origin, behindProxy }) {
  const app = express();
  app.disable('x-powered-by');
  app.disable('etag');
  app.use((_req, res, next) => {
    res.set({
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    });
    next();
  });
  app.get('/readyz', async (_req, res) => {
    const ready = await limits.ready();
    res.status(ready ? 200 : 503).json({ ready });
  });
  app.all('/api/chat', async (req, res, next) => {
    if (req.method !== 'POST') return res.set('Allow', 'POST').status(405).json({ error: 'Method not allowed' });
    if (req.headers.origin && req.headers.origin !== origin) return res.status(403).json({ error: 'Origin not allowed' });
    // Production Nginx overwrites X-Real-IP on a network shared only with the API.
    const ip = behindProxy ? req.get('X-Real-IP') : req.socket.remoteAddress;
    if (!ip || !isIP(ip)) return res.status(503).json(unavailable);
    if (!await limits.admit(ip)) return res.set('Retry-After', '60').status(429).json({ error: 'Too many requests' });
    if (!req.is('application/json')) return res.status(415).json({ error: 'Expected JSON' });
    res.locals.ip = ip;
    next();
  });
  app.post('/api/chat', express.json({ limit: '256kb', inflate: false }), async (req, res) => {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success || parsed.data.messages.at(-1).role !== 'user') {
      return res.status(400).json({ error: 'Send a conversation ending with a user question.' });
    }
    const recent = parsed.data.messages.slice(-CHAT_CONTEXT_MESSAGES);
    const direct = directReply(recent.at(-1).content);
    if (direct) return res.json({ response: direct });

    const disconnect = new AbortController();
    res.once('close', () => disconnect.abort());
    const signal = AbortSignal.any([disconnect.signal, AbortSignal.timeout(35_000)]);
    const messages = recent.slice(recent.findIndex((msg) => msg.role === 'user'));
    try {
      const result = await generateReply(client, messages, signal, () => limits.reserve(res.locals.ip));
      if (result.retryAfter) {
        return res.set('Retry-After', String(result.retryAfter)).status(429)
          .json({ error: 'The daily AI request limit has been reached. Try again after midnight UTC.' });
      }
      res.json(result);
    } catch {
      if (!disconnect.signal.aborted) res.status(503).json(unavailable);
    }
  });
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  // Express identifies error middleware by its four-argument signature.
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Message body is too large' });
    if (error.status === 415) return res.status(415).json({ error: 'Unsupported encoding' });
    if (error.status === 400) return res.status(400).json({ error: 'Invalid JSON' });
    console.error('Chat service unavailable', { type: error.name });
    res.status(503).json(unavailable);
  });
  return app;
}
