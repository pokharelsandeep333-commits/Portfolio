import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from './MagneticButton'
import HeroCodeCanvas from './HeroCodeCanvas'

// Twelve drifting gold motes. Fixed seeds rather than Math.random so a
// re-render never reshuffles the field mid-flight. [left %, size px, dur s, delay s]
const PARTICLES = [
  [6, 3, 14, 0], [14, 2, 18, -6], [23, 4, 12, -3], [31, 2, 20, -11],
  [42, 3, 16, -8], [51, 2, 22, -2], [58, 3, 13, -9], [66, 4, 17, -5],
  [74, 2, 19, -13], [81, 3, 15, -1], [89, 2, 21, -7], [95, 3, 14, -10],
]

// The three portrait layers share one frame (same trim box, same size), so
// they stack pixel-for-pixel and only separate when the rig tilts.
const LAYER = {
  base:  { src: '/hero-portrait.webp', srcSet: '/hero-portrait-sm.webp 750w, /hero-portrait.webp 1166w' },
  shirt: { src: '/hero-shirt.webp',    srcSet: '/hero-shirt-sm.webp 750w, /hero-shirt.webp 1166w' },
  hair:  { src: '/hero-hair.webp',     srcSet: '/hero-hair-sm.webp 750w, /hero-hair.webp 1166w' },
}
const SIZES = '(max-width: 767px) 74vw, 42vw'

// The boot sequence plays in full on the first hero view of a tab and at
// 2.6× on every later mount (route-less SPA, so that means reloads). It
// stays a single timeline either way — just a different timeScale.
const BOOT_KEY = 'hero-booted'

function Layer({ which, className = '', imgRef, priority }) {
  const l = LAYER[which]
  return (
    <img
      ref={imgRef}
      className={`hero-layer ${className}`}
      src={l.src}
      srcSet={l.srcSet}
      sizes={SIZES}
      width="1166"
      height="1400"
      alt=""
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      draggable="false"
    />
  )
}

export default function Hero({ onToggleTerminal }) {
  const sectionRef   = useRef(null)
  const portraitRef  = useRef(null)   // clip-path reveal + scroll-out target
  const rigRef       = useRef(null)   // 3D tilt
  const hairRef      = useRef(null)
  const shirtRef     = useRef(null)
  const haloRef      = useRef(null)
  const orbGoldRef   = useRef(null)
  const orbBlueRef   = useRef(null)
  const codeWrapRef  = useRef(null)
  const scanbarRef   = useRef(null)
  const veilRef      = useRef(null)
  const powerlineRef = useRef(null)
  const flashRef     = useRef(null)
  const contentRef   = useRef(null)
  const scrollIndRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const orbs   = [orbGoldRef.current, orbBlueRef.current, haloRef.current]
      const copy   = contentRef.current.children

      // Depth: hair sits in front of the base, shirt behind it. Set through
      // GSAP (not CSS) so the later x/y tweens compose with z instead of
      // clobbering it.
      gsap.set(hairRef.current,  { z: 48 })
      gsap.set(shirtRef.current, { z: -36 })

      // ── Boot sequence ─────────────────────────────────────────────────────
      const rig = rigRef.current

      if (reduce) {
        // No sequence: land on the final frame.
        gsap.set(veilRef.current, { autoAlpha: 0 })
        gsap.set(scanbarRef.current, { autoAlpha: 0 })
        gsap.set(codeWrapRef.current, { opacity: 1 })
        gsap.set(orbs, { opacity: 1, scale: 1 })
      } else {
        let seen = false
        try { seen = sessionStorage.getItem(BOOT_KEY) === '1' } catch { /* private mode */ }

        const boot = gsap.timeline({
          defaults: { ease: 'power2.out' },
          onComplete: () => {
            try { sessionStorage.setItem(BOOT_KEY, '1') } catch { /* ignore */ }
            gsap.set(portraitRef.current, { clearProps: 'clipPath' })
            gsap.set(veilRef.current, { display: 'none' })
          },
        })
        boot.timeScale(seen ? 2.6 : 1)

        boot
          // Initial state
          .set(veilRef.current,      { autoAlpha: 1 })
          .set(portraitRef.current,  { clipPath: 'inset(100% 0 0 0)' })
          .set(scanbarRef.current,   { top: '100%', autoAlpha: 0 })
          .set(orbs,                 { opacity: 0, scale: 0.5 })
          .set(codeWrapRef.current,  { opacity: 0 })
          .set(flashRef.current,     { opacity: 0 })
          .set(copy,                 { y: 45, opacity: 0 })
          .set(scrollIndRef.current, { opacity: 0 })

          // Power line: a gold hairline draws across, then bursts open.
          .fromTo(powerlineRef.current,
            { scaleX: 0, scaleY: 1, opacity: 1 },
            { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, 0.1)
          .to(powerlineRef.current, { scaleY: 60, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.6)
          .to(veilRef.current, { autoAlpha: 0, duration: 0.55 }, 0.7)

          // Scan reveal: the portrait prints from the bottom up behind a
          // glowing bar.
          .to(scanbarRef.current, { autoAlpha: 1, duration: 0.2 }, 0.85)
          .to(portraitRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power2.inOut' }, 0.9)
          .to(scanbarRef.current,  { top: '0%', duration: 1.5, ease: 'power2.inOut' }, 0.9)
          .to(scanbarRef.current,  { autoAlpha: 0, duration: 0.25 }, 2.35)

          // Code stream fades up under the scan.
          .to(codeWrapRef.current, { opacity: 1, duration: 1.1 }, 1.3)

          // Glitch burst, then the rim light ignites.
          .call(() => rig.classList.add('is-glitching'), null, 2.4)
          .call(() => rig.classList.remove('is-glitching'), null, 2.8)
          .fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.85, duration: 0.12, ease: 'power4.in' }, 2.62)
          .to(flashRef.current, { opacity: 0, duration: 0.8, ease: 'power2.out' }, 2.74)
          .to(orbs, { opacity: 1, scale: 1, duration: 1.3, stagger: 0.1, ease: 'power2.out' }, 2.66)

          // Copy.
          .to(copy, { y: 0, opacity: 1, duration: 1.0, stagger: 0.12, ease: 'power3.out' }, 2.8)
          .to(scrollIndRef.current, { opacity: 1, duration: 0.7 }, 3.5)
      }

      // ── Idle + pointer motion (desktop pointers only for the tilt) ────────
      const mm = gsap.matchMedia()
      mm.add(
        {
          motionOk: '(prefers-reduced-motion: no-preference)',
          fine:     '(hover: hover) and (pointer: fine)',
        },
        (context) => {
          const { motionOk, fine } = context.conditions
          if (!motionOk) return

          const idle = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
          idle
            .to(portraitRef.current, { y: -14, duration: 4.2 }, 0)
            .to(orbGoldRef.current,  { y: 22, x: -10, duration: 5.5 }, 0)
            .to(orbBlueRef.current,  { y: -18, x: 14, duration: 6.5 }, 0)

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => idle.paused(!self.isActive),
          })

          if (!fine) return

          // 2.5D tilt. The rig rotates toward the cursor; because the hair
          // and shirt sit at different z, perspective alone separates them.
          // The extra x/y on those two layers exaggerates it a touch.
          const q = (t, p, d) => gsap.quickTo(t, p, { duration: d, ease: 'power2.out' })
          const rx = q(rig, 'rotationX', 1.0), ry = q(rig, 'rotationY', 1.0)
          const hx = q(hairRef.current, 'x', 1.1),  hy = q(hairRef.current, 'y', 1.1)
          const sx = q(shirtRef.current, 'x', 1.3), sy = q(shirtRef.current, 'y', 1.3)
          const gx = q(orbGoldRef.current, 'xPercent', 1.6), gy = q(orbGoldRef.current, 'yPercent', 1.6)
          const bx = q(orbBlueRef.current, 'xPercent', 2.0), by = q(orbBlueRef.current, 'yPercent', 2.0)

          const onMove = (e) => {
            const r = sectionRef.current.getBoundingClientRect()
            const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2   // -1 … 1
            const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2
            ry(nx * 7);   rx(ny * -5)
            hx(nx * 10);  hy(ny * 6)
            sx(nx * -5);  sy(ny * -3)
            gx(nx * -6);  gy(ny * -4)
            bx(nx * 4);   by(ny * 3)
          }
          const onLeave = () => {
            ry(0); rx(0); hx(0); hy(0); sx(0); sy(0); gx(0); gy(0); bx(0); by(0)
          }

          const el = sectionRef.current
          el.addEventListener('mousemove', onMove, { passive: true })
          el.addEventListener('mouseleave', onLeave)
          return () => {
            el.removeEventListener('mousemove', onMove)
            el.removeEventListener('mouseleave', onLeave)
          }
        }
      )

      // ── Scroll-out parallax ───────────────────────────────────────────────
      gsap.to(portraitRef.current, {
        yPercent: 12,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero-section relative flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Layered scene: gradient → orbs → code → portrait rig → motes ──── */}
      <div className="hero-scene" aria-hidden="true">
        <div className="hero-gradient" />

        <div ref={orbBlueRef} className="hero-orb hero-orb--blue" />
        <div ref={orbGoldRef} className="hero-orb hero-orb--gold" />
        <div ref={haloRef}    className="hero-halo" />

        <div ref={codeWrapRef} className="hero-code">
          <HeroCodeCanvas className="hero-code__canvas" />
        </div>

        <div ref={portraitRef} className="hero-portrait">
          <div ref={rigRef} className="hero-rig">
            <Layer which="base"  priority />
            <Layer which="shirt" imgRef={shirtRef} className="hero-layer--shirt" />
            <Layer which="hair"  imgRef={hairRef}  className="hero-layer--hair" />
            {/* Same bytes as the base, clipped and offset for the glitch passes. */}
            <Layer which="base"  className="hero-layer--glitch" />
          </div>
          <div ref={scanbarRef} className="hero-scanbar" />
          <div ref={flashRef}   className="hero-flash" />
        </div>

        <div className="hero-particles">
          {PARTICLES.map(([left, size, dur, delay], i) => (
            <span
              key={i}
              style={{
                left: `${left}%`,
                width: size,
                height: size,
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>

        <div className="hero-scanlines" />
      </div>

      {/* ── Legibility ramp — dark over the text column, clear over the face ── */}
      <div aria-hidden="true" className="hero-ramp absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      {/* ── Bottom fade to page background ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 sm:h-52 pointer-events-none"
        style={{ zIndex: 2, background: 'linear-gradient(to bottom, transparent, #050e1f)' }}
      />

      {/* ── Subtle gold grid texture ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          zIndex: 2,
          backgroundImage:
            'linear-gradient(rgba(255,199,44,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,199,44,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div ref={contentRef} className="hero-content flex flex-col items-start text-left">
        <p className="section-label justify-start mb-3 sm:mb-4">
          IT Support Desk · CS @ DSU · Madison, SD
        </p>

        <h1 className="hero-name font-outfit font-black text-white leading-none mb-2">
          Sandeep{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #FFC72C 0%, #ffe27a 50%, #FFC72C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Pokharel
          </span>
        </h1>

        <p className="hero-tagline font-inter text-white/65 mt-4 mb-8 sm:mt-5 sm:mb-10 max-w-xl leading-relaxed">
          IT Support Technician by day, building web apps and cloud infrastructure by night.
        </p>

        <div className="hero-ctas flex flex-wrap gap-3 sm:gap-4 mt-2 justify-start">
          <MagneticButton as="button" onClick={() => scrollTo('projects')} className="btn-gold" id="hero-cta-projects">
            View My Work
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </MagneticButton>

          <MagneticButton
            as="button"
            onClick={onToggleTerminal}
            id="hero-cta-chat"
            className="btn-outline group relative overflow-hidden"
            style={{
              borderColor: 'rgba(255,199,44,0.5)',
              color: 'var(--clr-gold)',
              boxShadow: '0 0 20px rgba(255,199,44,0.15)',
              background: 'rgba(10,25,47,0.4)',
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,199,44,0.1)] to-transparent group-hover:translate-x-full duration-1000 -translate-x-full transition-transform"></span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="drop-shadow-[0_0_8px_rgba(255,199,44,0.8)]">
              <path d="M12 2.5 L14.4 9.6 L21.5 12 L14.4 14.4 L12 21.5 L9.6 14.4 L2.5 12 L9.6 9.6 Z"></path>
            </svg>
            Chat with Digital Sandeep
          </MagneticButton>
        </div>
      </div>

      {/* ── Scroll indicator — bottom-center ─────────────────────────────────── */}
      <div
        ref={scrollIndRef}
        className="hero-scroll-hint absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
        style={{ opacity: 0 }}
        onClick={(e) => { e.stopPropagation(); scrollTo('about') }}
        role="button"
        aria-label="Scroll to about section"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && scrollTo('about')}
      >
        <span className="font-outfit text-white/25 text-xs tracking-widest uppercase">Scroll</span>
        {[0, 0.15, 0.3].map((delay, i) => (
          <svg
            key={i}
            className="animate-scroll-bounce"
            style={{ animationDelay: `${delay}s`, opacity: 1 - i * 0.3, marginTop: i === 0 ? 0 : -5 }}
            width="13" height="7" viewBox="0 0 14 8" fill="none"
            aria-hidden="true"
          >
            <path d="M1 1l6 6 6-6" stroke="#FFC72C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ))}
      </div>

      {/* ── Boot veil — above everything, gone after the sequence ───────────── */}
      <div ref={veilRef} className="hero-veil" aria-hidden="true">
        <div ref={powerlineRef} className="hero-powerline" />
      </div>
    </section>
  )
}
