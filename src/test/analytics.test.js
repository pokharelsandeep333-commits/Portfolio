import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

describe('analytics startup', () => {
  it.each([true, false])('loads after the hero finishes (idle callback available: %s)', idleAvailable => {
    const html = readFileSync('index.html', 'utf8')
    const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
    const appendChild = vi.fn()
    const listeners = new Map()
    const schedule = vi.fn()
    const context = {
      document: { createElement: () => ({}), head: { appendChild } },
      addEventListener: vi.fn((event, callback) => listeners.set(event, callback)),
      setTimeout: schedule,
      ...(idleAvailable ? { requestIdleCallback: schedule } : {}),
    }
    context.window = context
    runInNewContext(script, context)
    expect(appendChild).not.toHaveBeenCalled()
    expect(context.dataLayer[1][0]).toBe('config')
    listeners.get('portfolio:hero-ready')()
    expect(appendChild).not.toHaveBeenCalled()
    schedule.mock.calls[0][0]()
    expect(appendChild).toHaveBeenCalledWith(expect.objectContaining({
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=G-TR2YHSDHBN',
    }))
    expect(context.addEventListener).toHaveBeenCalledWith('portfolio:hero-ready', expect.any(Function), { once: true })
  })
})
