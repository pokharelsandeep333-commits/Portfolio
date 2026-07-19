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
    
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'test message' })
    }));
    
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });
});
