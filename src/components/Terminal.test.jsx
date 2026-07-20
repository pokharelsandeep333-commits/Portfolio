import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Terminal from './Terminal';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Terminal UI', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ response: 'Hello' }),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly and accepts input', async () => {
    render(<Terminal />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: 'test message' } });
    expect(input.value).toBe('test message');
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(globalThis.fetch).toHaveBeenCalledWith('https://portfolio-phi-pearl-16.vercel.app/api/chat', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        messages: [
          { role: 'bot', content: 'Hi there! I am Digital Sandeep. Ask me anything about Sandeep\'s skills, projects, or experience.' },
          { role: 'user', content: 'test message' }
        ] 
      })
    }));
    
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('displays rate limit error on 429 response', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        status: 429,
        json: () => Promise.resolve({ error: 'Too many requests' }),
      })
    );

    render(<Terminal />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'rate limit test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Too many requests. Please slow down and try again in a minute.')).toBeInTheDocument();
    });
  });
});
