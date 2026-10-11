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
    expect(res.setHeader).toHaveBeenCalledWith('Retry-After', '60');
    expect(sendMessageMock).not.toHaveBeenCalled();
  });

  it('blocks the installed limiter default timeout before calling either Gemini model', async () => {
    const { Ratelimit } = await vi.importActual('@upstash/ratelimit');
    let finishRedisCheck;
    const pendingRedisCheck = new Promise((resolve) => { finishRedisCheck = resolve; });
    const limiter = new Ratelimit({
      redis: {},
      limiter: () => ({ limit: () => pendingRedisCheck }),
    });
    ratelimitLimitMock.mockImplementationOnce((ip) => limiter.limit(ip));

    vi.useFakeTimers();
    try {
      const request = handler(req, res);
      await vi.advanceTimersByTimeAsync(5000);
      await request;

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.setHeader).toHaveBeenCalledWith('Retry-After', '60');
      expect(res.json).toHaveBeenCalledWith({
        error: 'The assistant is unavailable right now. Please try again in a moment.',
      });
      expect(getGenerativeModelMock).not.toHaveBeenCalled();
      expect(sendMessageMock).not.toHaveBeenCalled();
    } finally {
      finishRedisCheck({ success: true, pending: Promise.resolve() });
      vi.useRealTimers();
    }
  });

  it('keeps timeout responses blocked even when success is false', async () => {
    ratelimitLimitMock.mockResolvedValueOnce({ success: false, reason: 'timeout' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(getGenerativeModelMock).not.toHaveBeenCalled();
    expect(sendMessageMock).not.toHaveBeenCalled();
  });

  it('keeps rejected Redis checks blocked with the existing 500 response', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    ratelimitLimitMock.mockRejectedValueOnce(new Error('Redis unavailable'));
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(getGenerativeModelMock).not.toHaveBeenCalled();
    expect(sendMessageMock).not.toHaveBeenCalled();
  });

  it('should parse x-forwarded-for header and use the first IP', async () => {
    req.headers['x-forwarded-for'] = '192.168.1.1, 10.0.0.1';
    await handler(req, res);
    expect(ratelimitLimitMock).toHaveBeenCalledWith('192.168.1.1');
  });

  it('should call Gemini API and return response', async () => {
    // A confirmed allowance can consume the last token in the window.
    ratelimitLimitMock.mockResolvedValueOnce({ success: true, remaining: 0 });
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
      expect(sendMessageMock).toHaveBeenCalledWith('gemini-3.8-flash', 'Tell me about Sandeep');
    });

    it.each([
      ['overloaded (503)', 503],
      ['rate limited (429)', 429],
      ['erroring (500)', 500],
      ['timing out (504)', 504],
      ['retired (404)', 404],
      ['unreachable (network error, no status)', undefined],
    ])('falls back to gemini-3.5-flash-lite when the primary is %s', async (_label, status) => {
      sendMessageMock.mockImplementation((model) =>
        model === 'gemini-3.8-flash'
          ? Promise.reject(upstreamError(status))
          : Promise.resolve(reply('Fallback answer'))
      );

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ response: 'Fallback answer' });
      expect(getGenerativeModelMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ model: 'gemini-3.5-flash-lite' })
      );
      expect(sendMessageMock).toHaveBeenCalledTimes(2);
    });

    it('gives the fallback the same system prompt and generation limits', async () => {
      sendMessageMock.mockImplementation((model) =>
        model === 'gemini-3.8-flash' ? Promise.reject(upstreamError(503)) : Promise.resolve(reply('ok'))
      );

      await handler(req, res);

      const [primaryArgs, fallbackArgs] = getGenerativeModelMock.mock.calls.map(([args]) => args);
      expect(fallbackArgs.systemInstruction).toBe(primaryArgs.systemInstruction);
      expect(fallbackArgs.generationConfig).toEqual(primaryArgs.generationConfig);
    });

    it('returns the generic 502 without upstream detail when both models fail', async () => {
      sendMessageMock.mockRejectedValue(upstreamError(503, 'models/gemini-3.5-flash-lite quota key=AIzaSECRET'));

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
      process.env.GEMINI_FALLBACK_MODEL = ' gemini-3.6-flash ';
      sendMessageMock.mockImplementation((model) =>
        model === 'gemini-3.8-flash' ? Promise.reject(upstreamError(503)) : Promise.resolve(reply('Lite answer'))
      );

      await handler(req, res);

      expect(sendMessageMock).toHaveBeenLastCalledWith('gemini-3.6-flash', 'Tell me about Sandeep');
      expect(res.json).toHaveBeenCalledWith({ response: 'Lite answer' });
    });

    it('does not call the same model twice when the fallback is set to the primary', async () => {
      process.env.GEMINI_FALLBACK_MODEL = 'gemini-3.8-flash';
      sendMessageMock.mockRejectedValue(upstreamError(503));

      await handler(req, res);

      expect(sendMessageMock).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(502);
    });

    it('logs which model failed and which one answered', async () => {
      sendMessageMock.mockImplementation((model) =>
        model === 'gemini-3.8-flash' ? Promise.reject(upstreamError(503)) : Promise.resolve(reply('ok'))
      );

      await handler(req, res);

      const logged = console.warn.mock.calls.map((args) => args.join(' ')).join('\n');
      expect(logged).toMatch(/gemini-3\.8-flash.*503.*gemini-3\.5-flash-lite/);
    });
  });
});
