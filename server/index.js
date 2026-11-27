import process from 'node:process';
import { createClient } from '@redis/client';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { createApp } from './app.js';
import { createLimits } from './limits.js';

const positiveInteger = z.coerce.number().int().positive().max(1_000_000);
const config = z.object({
  GEMINI_API_KEY: z.string().trim().min(1),
  REDIS_URL: z.string().url().default('redis://127.0.0.1:6379'),
  CHAT_DAILY_PER_IP: positiveInteger.default(30),
  CHAT_DAILY_TOTAL: positiveInteger.default(300),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
}).parse(process.env);
const production = process.env.NODE_ENV === 'production';
const redis = createClient({ url: config.REDIS_URL, disableOfflineQueue: true, socket: { connectTimeout: 2000 } });
redis.on('error', (error) => console.error('Redis connection unavailable', { type: error.name }));
void redis.connect().catch(() => console.error('Redis connection failed'));
const app = createApp({
  client: new GoogleGenAI({ apiKey: config.GEMINI_API_KEY }),
  limits: createLimits(redis, config.CHAT_DAILY_PER_IP, config.CHAT_DAILY_TOTAL),
  origin: production ? 'https://portfolio.sandeeppokharel.com.np' : 'http://localhost:5173',
  behindProxy: production,
});
const server = app.listen(config.PORT, production ? '0.0.0.0' : '127.0.0.1');
server.requestTimeout = 40_000;
server.headersTimeout = 10_000;
function shutdown() {
  server.close(() => { if (redis.isOpen) redis.destroy(); });
}
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
