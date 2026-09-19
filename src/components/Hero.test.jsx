import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Hero from './Hero'

function mockMediaQueries({ mobile = false, reduceMotion = false } = {}) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === '(max-width: 767px)' ? mobile : reduceMotion,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('Hero media', () => {
  beforeEach(() => mockMediaQueries())

  it('mounts the approved silent loop on desktop', () => {
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)
    const video = container.querySelector('video')

    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('poster', '/hero-video-poster.webp')
    expect(video.querySelector('source')).toHaveAttribute('src', '/hero-video-gold.mp4')
    expect(video.muted).toBe(true)
  })

  it('uses the static portrait on phones without mounting the video', () => {
    mockMediaQueries({ mobile: true })
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)

    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/hero-portrait.webp"]')).toBeInTheDocument()
  })

  it('keeps the approved video on desktop when reduced motion is requested', () => {
    mockMediaQueries({ reduceMotion: true })
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)

    expect(container.querySelector('video')).toBeInTheDocument()
    expect(container.querySelector('img[src="/hero-portrait.webp"]')).not.toBeInTheDocument()
  })

  it('falls back to the portrait when the video cannot load', () => {
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)
    fireEvent.error(container.querySelector('video'))

    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/hero-portrait.webp"]')).toBeInTheDocument()
  })
})
