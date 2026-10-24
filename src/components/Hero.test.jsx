import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Hero from './Hero'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

  it('mounts the video even when reduced motion is requested', () => {
    mockMediaQueries({ reduceMotion: true })
    const { container } = render(<Hero onToggleTerminal={vi.fn()} />)

    expect(container.querySelector('video')).toBeInTheDocument()
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

describe('Hero startup scheduling', () => {
  let frames
  let fontsReady
  let resolveFonts
  let fontsDescriptor

  beforeEach(() => {
    mockMediaQueries({ mobile: true })
    frames = new Map()
    let nextFrame = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => frames.delete(id))
    fontsReady = new Promise(resolve => { resolveFonts = resolve })
    fontsDescriptor = Object.getOwnPropertyDescriptor(document, 'fonts')
    Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: fontsReady } })
    vi.mocked(gsap.context).mockImplementationOnce(callback => {
      callback()
      return { revert: vi.fn() }
    })
    vi.mocked(ScrollTrigger.refresh).mockClear()
  })

  afterEach(() => {
    if (fontsDescriptor) Object.defineProperty(document, 'fonts', fontsDescriptor)
    else delete document.fonts
    vi.restoreAllMocks()
  })

  function nextFrame() {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach(callback => callback())
  }

  it('settles fonts and refreshes layout before playing the intro on the next frame', async () => {
    render(<Hero />)
    const boot = vi.mocked(gsap.timeline).mock.results.at(-1).value
    expect(gsap.timeline).toHaveBeenLastCalledWith(expect.objectContaining({ paused: true }))
    expect(boot.play).not.toHaveBeenCalled()
    expect(frames.size).toBe(0)

    await act(async () => resolveFonts())
    act(nextFrame)
    expect(ScrollTrigger.refresh).toHaveBeenCalledOnce()
    expect(boot.play).not.toHaveBeenCalled()

    act(nextFrame)
    expect(boot.play).toHaveBeenCalledWith(0)
  })

  it('does not start an intro after unmounting while fonts load', async () => {
    const { unmount } = render(<Hero />)
    const boot = vi.mocked(gsap.timeline).mock.results.at(-1).value
    unmount()
    await act(async () => resolveFonts())
    act(nextFrame)
    expect(boot.play).not.toHaveBeenCalled()
    expect(ScrollTrigger.refresh).not.toHaveBeenCalled()
  })

  it('cancels a queued intro frame when unmounted', async () => {
    const { unmount } = render(<Hero />)
    const boot = vi.mocked(gsap.timeline).mock.results.at(-1).value
    await act(async () => resolveFonts())
    act(nextFrame)
    unmount()
    act(nextFrame)
    expect(boot.play).not.toHaveBeenCalled()
  })

  it('signals analytics only after the intro finishes', () => {
    const ready = vi.fn()
    window.addEventListener('portfolio:hero-ready', ready, { once: true })
    render(<Hero />)
    expect(ready).not.toHaveBeenCalled()
    const options = vi.mocked(gsap.timeline).mock.calls.at(-1)[0]
    act(() => options.onComplete())
    expect(ready).toHaveBeenCalledOnce()
  })
})
