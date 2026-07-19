import '@testing-library/jest-dom'
import { vi } from 'vitest'

window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock GSAP to prevent ScrollTrigger/Context errors in JSDOM
vi.mock('gsap', () => {
  const gsapMock = {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() })),
    matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() })),
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    })),
  };
  return {
    default: gsapMock,
    gsap: gsapMock,
  };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    register: vi.fn(),
    create: vi.fn(),
    refresh: vi.fn(),
  }
}))
