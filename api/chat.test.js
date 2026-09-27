/* global process */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import handler from './chat.js';

export const getGenerativeModelMock = vi.fn();
// Receives (modelName, message) so a test can make one model fail and another answer.
export const sendMessageMock = vi.fn();

vi.mock('@google/generative-ai', () => {
  class GoogleGenerativeAI {
    constructor() {}
    getGenerativeModel(args) {
      getGenerativeModelMock(args);
      return {
        startChat: vi.fn(() => ({ sendMessage: (message) => sendMessageMock(args.model, message) })),
      };
    }
  }

  return { GoogleGenerativeAI };
});

const reply = (text) => ({ response: { text: () => text } });
// Shaped like GoogleGenerativeAIFetchError: the SDK puts the HTTP status on `.status`.
const upstreamError = (status, message = 'upstream failure') =>
  Object.assign(new Error(`[GoogleGenerativeAI Error]: ${message}`), { status });

export const ratelimitLimitMock = vi.fn();

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: vi.fn(),
  }
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class RatelimitMock {
    static slidingWindow() {
      return vi.fn();
    }
    limit(ip) {
      return ratelimitLimitMock(ip);
    }
  }
}));

describe('API Route /api/chat', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: { messages: [{ role: 'user', content: 'Tell me about Sandeep' }] },
      headers: {
        'x-forwarded-for': '127.0.0.1'
      }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
      end: vi.fn()
    };
    process.env.GEMINI_API_KEY = 'test_key';
    delete process.env.GEMINI_FALLBACK_MODEL;

    // Default mock behavior for rate limiting (success)
    ratelimitLimitMock.mockResolvedValue({ success: true });
    sendMessageMock.mockReset();
    sendMessageMock.mockResolvedValue(reply('Mocked Gemini Response'));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should return 405 if method is not POST or OPTIONS', async () => {
    req.method = 'GET';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });
  
  it('should handle OPTIONS preflight', async () => {
    req.method = 'OPTIONS';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'POST, OPTIONS');
  });

  it('should handle missing message in body', async () => {
    req.body = {};
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input: expected array, received undefined' });
  });
  
  it('should return 429 if rate limit is exceeded', async () => {
    ratelimitLimitMock.mockResolvedValueOnce({ success: false });
    await handler(req, res);
    expect(ratelimitLimitMock).toHaveBeenCalledWith('127.0.0.1');
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ error: 'Too many requests' });
  });

  it('should parse x-forwarded-for header and use the first IP', async () => {
    req.headers['x-forwarded-for'] = '192.168.1.1, 10.0.0.1';
    await handler(req, res);
    expect(ratelimitLimitMock).toHaveBeenCalledWith('192.168.1.1');
  });

  it('should call Gemini API and return response', async () => {
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ response: 'Mocked Gemini Response' });
    
    expect(getGenerativeModelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        systemInstruction: expect.any(String),
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.35,
        }
      })
    );
  });

  describe('model fallback', () => {
    const GENERIC_502 = { error: 'The assistant is unavailable right now. Please try again in a moment.' };

    beforeEach(() => {
      // Silence the handler's own diagnostics so test output stays readable.
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('answers from the primary model alone when it succeeds', async () => {
      await handler(req, res);
      expect(sendMessageMock).toHaveBeenCalledTimes(1);
      expect(sendMessageMock).toHaveBeenCalledWith('gemini-3.5-flash', 'Tell me about Sandeep');
    });

    it.each([
      ['overloaded (503)', 503],
      ['rate limited (429)', 429],
      ['erroring (500)', 500],
      ['timing out (504)', 504],
      ['retired (404)', 404],
      ['unreachable (network error, no status)', undefined],
    ])('falls back to gemini-2.5-flash when the primary is %s', async (_label, status) => {
      sendMessageMock.mockImplementation((model) =>
        model === 'gemini-3.5-flash'
          ? Promise.reject(upstreamError(status))
          : Promise.resolve(reply('Fallback answer'))
      );

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ response: 'Fallback answer' });
      expect(getGenerativeModelMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ model: 'gemini-2.5-flash' })
      );
      expect(sendMessageMock).toHaveBeenCalledTimes(2);
    });

    it('gives the fallback the same system prompt and generation limits', async () => {
      sendMessageMock.mockImplementation((model) =>
        model === 'gemini-3.5-flash' ? Promise.reject(upstreamError(503)) : Promise.resolve(reply('ok'))
      );

      await handler(req, res);

      const [primaryArgs, fallbackArgs] = getGenerativeModelMock.mock.calls.map(([args]) => args);
      expect(fallbackArgs.systemInstruction).toBe(primaryArgs.systemInstruction);
      expect(fallbackArgs.generationConfig).toEqual(primaryArgs.generationConfig);
    });

    it('returns the generic 502 without upstream detail when both models fail', async () => {
      sendMessageMock.mockRejectedValue(upstreamError(503, 'models/gemini-2.5-flash quota key=AIzaSECRET'));

      await handler(req, res);

      expect(sendMessageMock).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.json).toHaveBeenCalledWith(GENERIC_502);
    });

    it.each([
      ['bad request (400)', 400],
      ['unauthenticated (401)', 401],
      ['forbidden key (403)', 403],
    ])('does not fall back when the primary reports a %s', async (_label, status) => {
      sendMessageMock.mockRejectedValue(upstreamError(status));

      await handler(req, res);

      expect(sendMessageMock).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.json).toHaveBeenCalledWith(GENERIC_502);
    });

    it('uses GEMINI_FALLBACK_MODEL when it is set', async () => {
      process.env.GEMINI_FALLBACK_MODEL = ' gemini-2.5-flash-lite ';
      sendMessageMock.mockImplementation((model) =>
        model === 'gemini-3.5-flash' ? Promise.reject(upstreamError(503)) : Promise.resolve(reply('Lite answer'))
      );

      await handler(req, res);

      expect(sendMessageMock).toHaveBeenLastCalledWith('gemini-2.5-flash-lite', 'Tell me about Sandeep');
      expect(res.json).toHaveBeenCalledWith({ response: 'Lite answer' });
    });

    it('does not call the same model twice when the fallback is set to the primary', async () => {
      process.env.GEMINI_FALLBACK_MODEL = 'gemini-3.5-flash';
      sendMessageMock.mockRejectedValue(upstreamError(503));

      await handler(req, res);

      expect(sendMessageMock).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(502);
    });

    it('logs which model failed and which one answered', async () => {
      sendMessageMock.mockImplementation((model) =>
        model === 'gemini-3.5-flash' ? Promise.reject(upstreamError(503)) : Promise.resolve(reply('ok'))
      );

      await handler(req, res);

      const logged = console.warn.mock.calls.map((args) => args.join(' ')).join('\n');
      expect(logged).toMatch(/gemini-3\.5-flash.*503.*gemini-2\.5-flash/);
    });
  });
});
