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
    render(<Terminal isOpen={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: 'test message' } });
    expect(input.value).toBe('test message');
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/chat'), expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        messages: [
          { role: 'bot', content: "Hi, I'm Digital Sandeep, an AI version of Sandeep. Ask me anything about my work, projects, or experience." },
          { role: 'user', content: 'test message' }
        ] 
      })
    }));
    
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('keeps a long transcript visible and sends only recent, size-limited messages', async () => {
    const transcript = Array.from({ length: 54 }, (_, i) => ({
      role: i % 2 ? 'bot' : 'user', content: `Stored message ${i}`,
    }));
    transcript[53].content = 'x'.repeat(2100);
    localStorage.setItem('chatHistory', JSON.stringify(transcript));
    render(<Terminal isOpen={true} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'How did you build it?' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await screen.findByText('Hello');
    const { messages } = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(messages).toHaveLength(16);
    expect(messages[0]).toEqual(transcript[39]);
    expect(messages[14].content).toHaveLength(2000);
    expect(messages[15].content).toBe('How did you build it?');
    expect(screen.getByText('Stored message 0')).toBeInTheDocument();
    expect(screen.getByText(transcript[53].content)).toBeInTheDocument();
  });

  it('displays rate limit error on 429 response', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        status: 429,
        json: () => Promise.resolve({ error: 'Too many requests' }),
      })
    );

    render(<Terminal isOpen={true} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'rate limit test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Too many requests. Please slow down and try again in a minute.')).toBeInTheDocument();
    });
  });

  it('hides the drawer from assistive tech and keyboard focus while closed', () => {
    const { container } = render(<Terminal isOpen={false} />);
    const panel = container.querySelector('[aria-label="Digital Sandeep AI chat"]');

    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveAttribute('inert');
    // getByRole skips the a11y-hidden subtree, so nothing inside should surface
    expect(screen.queryByRole('textbox')).toBeNull();
  });
});
