/* global process */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import handler from './chat.js';

export const getGenerativeModelMock = vi.fn();

vi.mock('@google/generative-ai', () => {
  const sendMessageMock = vi.fn().mockResolvedValue({
    response: {
      text: () => 'Mocked Gemini Response',
    },
  });

  class GoogleGenerativeAI {
    constructor() {}
    getGenerativeModel(args) {
      getGenerativeModelMock(args);
      return { 
        startChat: vi.fn(() => ({ sendMessage: sendMessageMock })) 
      };
    }
  }

  return { GoogleGenerativeAI };
});

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
    
    // Default mock behavior for rate limiting (success)
    ratelimitLimitMock.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
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
        }
      })
    );
  });
});
