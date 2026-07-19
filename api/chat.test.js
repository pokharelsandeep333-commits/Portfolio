/* global process */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import handler from './chat.js';

vi.mock('@google/generative-ai', () => {
  const generateContentMock = vi.fn().mockResolvedValue({
    response: {
      text: () => 'Mocked Gemini Response',
    },
  });

  class GoogleGenerativeAI {
    constructor() {}
    getGenerativeModel() {
      return { generateContent: generateContentMock };
    }
  }

  return { GoogleGenerativeAI };
});

describe('API Route /api/chat', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: { message: 'Tell me about Sandeep' },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    process.env.GEMINI_API_KEY = 'test_key';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 405 if method is not POST', async () => {
    req.method = 'GET';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('should handle missing message in body', async () => {
    req.body = {};
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
  });

  it('should call Gemini API and return response', async () => {
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ response: 'Mocked Gemini Response' });
  });
});
