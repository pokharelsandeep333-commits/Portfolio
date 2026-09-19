import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Hero from './Hero'

let observerCallback

function mockMediaQueries({ mobile = false, reduceMotion = false } = {}) {
  const queries = new Map()
  window.matchMedia = vi.fn().mockImplementation((query) => {
    if (queries.has(query)) return queries.get(query)
    const listeners = new Set()
    const media = {
      matches: query === '(max-width: 767px)' ? mobile : reduceMotion,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_, listener) => listeners.add(listener)),
      removeEventListener: vi.fn((_, listener) => listeners.delete(listener)),
      dispatchEvent: vi.fn(),
      setMatches(matches) {
        this.matches = matches
        listeners.forEach((listener) => listener())
      },
    }
    queries.set(query, media)
    return media
  })
}

describe('Hero media', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMediaQueries()
    observerCallback = undefined
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback) {
        observerCallback = callback
      }

      observe() {}
      disconnect() {}
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('mounts the approved silent loop on desktop', () => {
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)
    const video = container.querySelector('video')

    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('poster', '/hero-static-lightning-poster.webp')
    expect(video.querySelector('source')).toHaveAttribute('src', '/hero-static-lightning.mp4')
    expect(video.muted).toBe(true)
  })

  it('uses the static portrait on phones without mounting the video', () => {
    mockMediaQueries({ mobile: true })
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)

    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/hero-portrait.webp"]')).toBeInTheDocument()
  })

  it('uses the static portrait without mounting video when reduced motion is requested', () => {
    mockMediaQueries({ reduceMotion: true })
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)

    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/hero-portrait.webp"]')).toBeInTheDocument()
  })

  it('responds to motion preference changes and restores the loading fallback', () => {
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)
    fireEvent.playing(container.querySelector('video'))
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')

    act(() => preference.setMatches(true))
    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(container.querySelector('.hero-portrait')).not.toHaveClass('hero-portrait--hidden')
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled()

    act(() => preference.setMatches(false))
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    fireEvent.loadStart(video)
    expect(container.querySelector('.hero-portrait')).not.toHaveClass('hero-portrait--hidden')
    fireEvent.playing(video)
    expect(container.querySelector('.hero-portrait')).toHaveClass('hero-portrait--hidden')
  })

  it('does not mark playback failed when pausing interrupts a play request', async () => {
    vi.mocked(window.HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException('Playback interrupted', 'AbortError'),
    )
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)
    await act(async () => observerCallback([{ isIntersecting: true }]))
    expect(container.querySelector('video')).toBeInTheDocument()
  })

  it('keeps the portrait visible until video playback starts', () => {
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)
    const video = container.querySelector('video')
    const portrait = container.querySelector('.hero-portrait')

    expect(video).not.toHaveClass('hero-video--ready')
    expect(portrait).not.toHaveClass('hero-portrait--hidden')

    fireEvent.playing(video)

    expect(video).toHaveClass('hero-video--ready')
    expect(portrait).toHaveClass('hero-portrait--hidden')
  })

  it('falls back to the portrait when the video cannot load', () => {
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)
    fireEvent.error(container.querySelector('video'))

    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/hero-portrait.webp"]')).toBeInTheDocument()
  })

  it('pauses offscreen and resumes when the hero returns', async () => {
    const play = vi.mocked(window.HTMLMediaElement.prototype.play)
    const pause = vi.mocked(window.HTMLMediaElement.prototype.pause)
    render(<Hero onToggleTerminal={vi.fn()} />)

    await waitFor(() => expect(observerCallback).toBeTypeOf('function'))

    act(() => observerCallback([{ isIntersecting: false }]))
    expect(pause).toHaveBeenCalled()

    act(() => observerCallback([{ isIntersecting: true }]))
    expect(play).toHaveBeenCalled()

    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(pause).toHaveBeenCalledTimes(2)

    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(play).toHaveBeenCalledTimes(2)
  })

  it('falls back when autoplay is rejected', async () => {
    vi.mocked(window.HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('blocked'))
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)

    await waitFor(() => expect(observerCallback).toBeTypeOf('function'))
    act(() => observerCallback([{ isIntersecting: true }]))

    await waitFor(() => expect(container.querySelector('video')).not.toBeInTheDocument())
    expect(container.querySelector('img[src="/hero-portrait.webp"]')).toBeInTheDocument()
  })
})
