import { useEffect, useRef } from 'react'

// Live holographic code stream behind and around the portrait — the same
// idea as the text baked into the artwork, but actually moving. Columns of
// short tokens scroll upward at their own speeds, occasionally mutate a
// character, and a few flare bright for a frame. Drawn on a canvas at a
// capped 20 fps and DPR ≤ 1.5, and stopped entirely while the hero is
// off-screen, so the whole thing costs roughly nothing at idle.

const GLYPHS = '0123456789ABCDEF<>[]{}/=+*#$%&:;.'
const TOKENS = [
  '0x3F9A', '0x00C8', '0xFF1D', '0x7E42', 'sys.init()', 'auth: ok', 'GET /api/chat',
  '200 OK', 'ssh -i dsu.pem', 'docker pull', 'watchtower ↻', 'ec2.run()', 'redis: PONG',
  'gsap.to()', 'ScrollTrigger', 'intune.enroll', 'vmix://live', 'obs.stream', 'nginx -s reload',
  'gemini.chat', 'npm run build', 'vitest ✓ 11', 'ttl=60s', 'zod.parse', 'cors: allow',
  '[ok] deploy', 'uptime 99.9%', 'ping 2ms', 'PS1> ', 'kubectl get', 'SELECT *', 'hash: 6bd41cf',
  'render 16ms', 'tick', 'idle', '[]', '{}', '=>', '::', '//', '01101100', '11010010', '10001011',
]

const rand = (n) => Math.floor(Math.random() * n)
const pick = (arr) => arr[rand(arr.length)]

export default function HeroCodeCanvas({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    // jsdom has no 2D context and no observers; render nothing there.
    if (!ctx || typeof ResizeObserver === 'undefined' || typeof IntersectionObserver === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cols = []
    let width = 0, height = 0, dpr = 1
    let raf = 0, last = 0, running = false
    const FRAME = 1000 / 20
    const FONT_PX = 12
    const LINE_H = 18

    const makeColumn = (x) => {
      const items = []
      const count = Math.ceil(height / LINE_H) + 6
      for (let i = 0; i < count; i++) {
        items.push({ text: Math.random() < 0.55 ? pick(TOKENS) : '', bright: 0 })
      }
      return {
        x,
        y: Math.random() * height,
        speed: 6 + Math.random() * 14,           // px per second — slow drift
        alpha: (width < 600 ? 0.10 : 0.18) + Math.random() * 0.20,
        gold: Math.random() < 0.35,
        items,
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${FONT_PX}px ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace`
      ctx.textBaseline = 'top'

      // Longest token is ~15 glyphs ≈ 108px at 12px mono; pitch must clear it.
      const gap = 118
      const n = Math.max(3, Math.floor(width / gap))
      cols = Array.from({ length: n }, (_, i) => makeColumn(i * gap + (gap * 0.25) + Math.random() * gap * 0.5))
    }

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (now - last < FRAME) return
      const dt = Math.min(now - last, 100) / 1000
      last = now

      ctx.clearRect(0, 0, width, height)

      for (const col of cols) {
        col.y -= col.speed * dt
        const span = col.items.length * LINE_H
        if (col.y < -span) col.y += span

        // Occasional character mutation and a one-frame flare.
        if (Math.random() < 0.08) {
          const it = pick(col.items)
          if (it.text) {
            const i = rand(it.text.length)
            it.text = it.text.slice(0, i) + pick(GLYPHS) + it.text.slice(i + 1)
          }
        }
        if (Math.random() < 0.03) pick(col.items).bright = 1

        for (let i = 0; i < col.items.length; i++) {
          const it = col.items[i]
          if (!it.text) continue
          let y = col.y + i * LINE_H
          if (y < -LINE_H) y += span
          if (y > height) continue
          const a = it.bright ? 0.95 : col.alpha
          ctx.fillStyle = col.gold
            ? `rgba(255, 199, 44, ${a})`
            : `rgba(120, 200, 255, ${a})`
          ctx.fillText(it.text, col.x, y)
          if (it.bright) it.bright = 0
        }
      }
    }

    const start = () => {
      if (running || reduce) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Reduced motion: one static frame per size — still on-brand, no motion.
    const drawStatic = () => {
      last = -Infinity
      draw(performance.now())
      cancelAnimationFrame(raf)
    }

    resize()
    if (reduce) drawStatic()

    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) drawStatic()
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.05 }
    )
    io.observe(canvas)

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
