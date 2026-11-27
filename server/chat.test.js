// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { GoogleGenAI } from '@google/genai';
import { createApp } from './app.js';
import { generateReply } from './gemini.js';

const origin = 'https://portfolio.sandeeppokharel.com.np';
const user = (content) => ({ role: 'user', content });
let server, create, limits, url;
function post(messages, headers = {}) {
  return fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Real-IP': '192.0.2.1', ...headers },
    body: JSON.stringify({ messages }),
  });
}
beforeEach(async () => {
  create = vi.fn().mockResolvedValue({ output_text: 'Generated answer' });
  limits = {
    ready: vi.fn().mockResolvedValue(true), admit: vi.fn().mockResolvedValue(true),
    reserve: vi.fn().mockResolvedValue(0),
  };
  server = createApp({ client: { interactions: { create } }, limits, origin, behindProxy: true }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  url = `http://127.0.0.1:${server.address().port}/api/chat`;
});
afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
  vi.restoreAllMocks();
});

describe('SandeepCloud chat API', () => {
  it('sends stateless conversation steps through the installed SDK and reads its answer', async () => {
    const received = [];
    const provider = createServer(async (req, res) => {
      let body = '';
      for await (const chunk of req) body += chunk;
      received.push(JSON.parse(body));
      res.setHeader('Content-Type', 'application/json');
      if (received.length === 1) {
        res.writeHead(503).end(JSON.stringify({ error: { code: 503, message: 'Unavailable', status: 'UNAVAILABLE' } }));
        return;
      }
      res.end(JSON.stringify({
        id: 'local-test', object: 'interaction', status: 'completed',
        steps: [{ type: 'model_output', content: [{ type: 'text', text: 'Fixture reply' }] }],
      }));
    }).listen(0, '127.0.0.1');
    await once(provider, 'listening');
    try {
      const client = new GoogleGenAI({ apiKey: 'fixture', httpOptions: { baseUrl: `http://127.0.0.1:${provider.address().port}` } });
      const result = await generateReply(client, [user('What did you build?')], AbortSignal.timeout(4000), () => 0);
      expect(result).toEqual({ response: 'Fixture reply' });
      expect(received.map((body) => body.model)).toEqual(['gemini-4-hydrogen', 'gemini-3.8-flash']);
      expect(received[1]).toMatchObject({ store: false, input: [{ type: 'user_input', content: [{ type: 'text', text: 'What did you build?' }] }] });
    } finally {
      await new Promise((resolve) => provider.close(resolve));
    }
  });
  it('falls back when the provider leaves its promise pending after cancellation', async () => {
    vi.useFakeTimers();
    try {
      create.mockImplementationOnce(() => new Promise(() => {}));
      const result = generateReply({ interactions: { create } }, [user('Projects?')], new AbortController().signal, () => 0);
      await vi.advanceTimersByTimeAsync(10_001);
      expect(await result).toEqual({ response: 'Generated answer' });
      expect(create.mock.calls[0][1].signal.aborted).toBe(true);
      expect(create.mock.calls[1][0].model).toBe('gemini-3.8-flash');
    } finally {
      vi.useRealTimers();
    }
  });
  it('stops on disconnect even while a budget reservation is pending', async () => {
    const controller = new AbortController();
    const result = generateReply({ interactions: { create } }, [user('Projects?')], controller.signal, () => new Promise(() => {}));
    controller.abort(new Error('Disconnected'));
    await expect(result).rejects.toThrow('Disconnected');
    expect(create).not.toHaveBeenCalled();
  });
  it('serves readiness without contacting Google', async () => {
    const response = await fetch(new URL('/readyz', url));
    expect(await response.json()).toEqual({ ready: true });
    expect(create).not.toHaveBeenCalled();
  });
  it.each(['Tell me about ShiftSentry', 'What do you do at DSU?', 'Are you open to internships?'])('answers %s locally', async (q) => {
    expect((await (await post([user(q)])).json()).response.length).toBeGreaterThan(10);
    expect(limits.admit).toHaveBeenCalledOnce();
    expect(limits.reserve).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
  it('keeps recent turn roles and caps output without storing the interaction', async () => {
    const history = Array.from({ length: 24 }, (_, i) => i % 2 ? { role: 'bot', content: 'Answer' } : user('Old question'));
    const response = await post([...history, user('How did you secure it?')], { Origin: origin, 'X-Forwarded-For': '192.0.2.99' });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ response: 'Generated answer' });
    expect(limits.admit).toHaveBeenCalledWith('192.0.2.1');
    const [args, options] = create.mock.calls[0];
    expect(args).toMatchObject({ model: 'gemini-4-hydrogen', store: false, automatic_continuation: false, generation_config: { max_output_tokens: 800 } });
    expect(args.system_instruction).toContain('ShiftSentry');
    expect(args.input.length).toBeLessThanOrEqual(16);
    expect(args.input[0].type).toBe('user_input');
    expect(args.input.at(-2).type).toBe('model_output');
    expect(args.input.at(-1).content[0].text).toBe('How did you secure it?');
    expect(options.retries.strategy).toBe('none');
  });
  it.each([400, 401, 403])('stops on upstream %i and returns a generic response', async (statusCode) => {
    create.mockRejectedValue(Object.assign(new Error('private provider error'), { statusCode }));
    const response = await post([user('My projects?')]);
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('private provider error');
    expect(create).toHaveBeenCalledTimes(1);
  });
  it.each([404, 408, 429, 500, 502, 503, 504])('falls back on upstream %i and charges each attempt', async (status) => {
    create.mockRejectedValueOnce(Object.assign(new Error(), { status }));
    expect((await post([user('My projects?')])).status).toBe(200);
    expect(create.mock.calls.map(([args]) => args.model)).toEqual(['gemini-4-hydrogen', 'gemini-3.8-flash']);
    expect(limits.reserve).toHaveBeenCalledTimes(2);
  });
  it('stops after the configured fallback chain', async () => {
    create.mockRejectedValue(Object.assign(new Error(), { status: 503 }));
    expect((await post([user('My projects?')])).status).toBe(503);
    expect(create.mock.calls.map(([args]) => args.model)).toEqual([
      'gemini-4-hydrogen', 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite',
    ]);
  });
  it('stops before the next model when a daily budget runs out', async () => {
    limits.reserve.mockResolvedValueOnce(0).mockResolvedValueOnce(120);
    create.mockRejectedValueOnce(Object.assign(new Error(), { status: 429 }));
    const response = await post([user('My projects?')]);
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('120');
    expect(create).toHaveBeenCalledTimes(1);
  });
  it('blocks rate-limited requests and fails closed if Redis is unavailable', async () => {
    limits.admit.mockResolvedValueOnce(false).mockRejectedValueOnce(new Error());
    expect((await post([user('My projects?')])).status).toBe(429);
    expect((await post([user('My projects?')])).status).toBe(503);
    expect(create).not.toHaveBeenCalled();
  });
  it('rejects cross-origin requests and missing proxy identity', async () => {
    expect((await post([user('x')], { Origin: 'https://example.com' })).status).toBe(403);
    expect((await post([user('x')], { 'X-Real-IP': '' })).status).toBe(503);
    expect(limits.admit).not.toHaveBeenCalled();
  });
  it('rejects invalid methods, malformed or oversized bodies and invalid turns', async () => {
    expect((await fetch(url)).status).toBe(405);
    for (const [body, status] of [['{', 400], ['x'.repeat(270000), 413]]) {
      expect((await fetch(url, { method: 'POST', headers: { 'X-Real-IP': '::1', 'Content-Type': 'application/json' }, body })).status).toBe(status);
    }
    for (const msgs of [[], [user(' ')], [user('x'.repeat(2001))], [{role:'bot',content:'hello'}], Array(51).fill(user('x'))]) {
      expect((await post(msgs)).status).toBe(400);
    }
    expect(create).not.toHaveBeenCalled();
  });
});
