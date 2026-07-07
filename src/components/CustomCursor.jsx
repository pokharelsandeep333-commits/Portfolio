import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

// ─── Selectors that expand the cursor ring on hover ───────────────────────────
const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], label'

export default function CustomCursor() {
  const ringRef = useRef(null)
  const dotRef  = useRef(null)
  const [, setIsVisible] = useState(false)

  useEffect(() => {
    // Don't render on touch-only devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const ring = ringRef.current
    const dot  = dotRef.current
    if (!ring || !dot) return

    // Ensure GSAP knows we want the elements centered.
    // While we use Tailwind's -translate-x-1/2, GSAP x/y animations overwrite inline transforms.
    // This gsap.set preserves the centering natively within GSAP's transform matrix.
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 })

    // Ring follows with physics-style lag — quickTo is the most performant approach
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })

    // Dot is nearly instant — feels like the real cursor
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.05 })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.05 })

    let hasMoved = false

    const onMove = (e) => {
      // Hide-on-load fix: fade in only after the first mouse movement
      if (!hasMoved) {
        hasMoved = true
        setIsVisible(true)
        gsap.to([ring, dot], { opacity: 1, duration: 0.3 })
      }
      
      ringX(e.clientX)
      ringY(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)
    }

    // Expand ring when hovering interactive elements (event delegation)
    const onOver = (e) => {
      if (e.target.closest(INTERACTIVE)) {
        gsap.to(ring, { scale: 1.8, borderColor: 'rgba(255,199,44,1)', duration: 0.25, ease: 'power2.out' })
        gsap.to(dot, { scale: 0, duration: 0.2 })
      }
    }

    const onOut = (e) => {
      if (e.target.closest(INTERACTIVE)) {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255,199,44,0.6)', duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { scale: 1, duration: 0.2 })
      }
    }

    // Hide when cursor leaves the window
    const onLeave  = () => {
      if (hasMoved) gsap.to([ring, dot], { opacity: 0, duration: 0.25 })
    }
    const onEnter  = () => {
      if (hasMoved) gsap.to([ring, dot], { opacity: 1, duration: 0.25 })
    }

    window.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mouseover', onOver,  { passive: true })
    document.addEventListener('mouseout',  onOut,   { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })
    document.addEventListener('mouseenter', onEnter, { passive: true })

    return () => {
      window.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,199,44,0.6)',
          opacity: 0, // Hidden on load
          willChange: 'transform',
        }}
      />
      {/* Precise dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#FFC72C',
          opacity: 0, // Hidden on load
          willChange: 'transform',
        }}
      />
    </>
  )
}
