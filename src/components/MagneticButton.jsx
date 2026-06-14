import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * MagneticButton
 * Wraps any content and makes it gently pull toward the cursor when hovered.
 *
 * Props:
 *   as        – the HTML tag or component to render (default: 'div')
 *   strength  – magnetic pull factor 0–1 (default: 0.38)
 *   className – forwarded className
 *   ...rest   – all other props forwarded to the rendered element
 */
export default function MagneticButton({
  children,
  as: Tag = 'div',
  strength = 0.38,
  className = '',
  ...rest
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    // Check for touch device — skip on mobile
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    // quickTo gives an elastic spring-back feel with almost no overhead
    const xTo = gsap.quickTo(el, 'x', { duration: 0.65, ease: 'elastic.out(1.1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.65, ease: 'elastic.out(1.1, 0.4)' })

    const handleMove = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect()
      const x = e.clientX - (left + width  / 2)
      const y = e.clientY - (top  + height / 2)
      xTo(x * strength)
      yTo(y * strength)
    }

    const handleLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove',  handleMove,  { passive: true })
    el.addEventListener('mouseleave', handleLeave, { passive: true })

    return () => {
      el.removeEventListener('mousemove',  handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      // Reset position on unmount
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [strength])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
