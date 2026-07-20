import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from './MagneticButton'

// ─── Volume Icons ─────────────────────────────────────────────────────────────
const VolumeOnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
  </svg>
)
const VolumeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
)

export default function Hero({ onOpenResume, onOpenTerminal }) {
  const sectionRef   = useRef(null)
  const videoRef     = useRef(null)
  const contentRef   = useRef(null)
  const scrollIndRef = useRef(null)
  const volumeRef    = useRef(null)
  const hintRef      = useRef(null)

  const [isMuted, setIsMuted] = useState(true)

  // Track whether the hero section is currently in the viewport.
  // ScrollTrigger writes to this ref; the resume event handler reads it.
  const heroInViewRef = useRef(true)

  // ─── Video control — strictly scoped, no prop dependency ─────────────────────
  useEffect(() => {
    const onPause = () => {
      videoRef.current?.pause()
    }
    const onResume = () => {
      // Only restart if the hero is in-viewport
      if (heroInViewRef.current) {
        videoRef.current?.play().catch(() => {})
      }
    }

    document.addEventListener('hero-video:pause',  onPause)
    document.addEventListener('hero-video:resume', onResume)
    return () => {
      document.removeEventListener('hero-video:pause',  onPause)
      document.removeEventListener('hero-video:resume', onResume)
    }
  }, [])

  // ─── GSAP entrance + ScrollTrigger ───────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Entrance: stagger content children up
      gsap.fromTo(
        contentRef.current.children,
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: 'power3.out', delay: 0.5 }
      )
      gsap.fromTo(
        scrollIndRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1.6, ease: 'power2.out' }
      )
      gsap.fromTo(
        volumeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 2.0, ease: 'power2.out' }
      )

      // Audio hint: fade in after 0.8s, then auto-fade out at 4.5s
      gsap.fromTo(
        hintRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' }
      )
      gsap.to(hintRef.current, {
        opacity: 0,
        duration: 0.9,
        delay: 4.5,
        ease: 'power2.inOut',
        onComplete: () => {
          if (hintRef.current) hintRef.current.style.pointerEvents = 'none'
        },
      })

      // ScrollTrigger: pause when hero exits viewport; resume when back.
      // Also keeps heroInViewRef accurate so the resume handler knows the state.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          heroInViewRef.current = false
          videoRef.current?.pause()
        },
        onEnterBack: () => {
          heroInViewRef.current = true
          if (videoRef.current) {
            videoRef.current.currentTime = 0
            videoRef.current.play().catch(() => {})
          }
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ─── Click to toggle mute ────────────────────────────────────────────────────
  const handleVideoClick = () => {
    const vid = videoRef.current
    if (!vid) return

    // Always immediately dismiss the audio hint on any click
    if (hintRef.current) {
      gsap.killTweensOf(hintRef.current)
      gsap.to(hintRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out', onComplete: () => {
        if (hintRef.current) hintRef.current.style.pointerEvents = 'none'
      }})
    }

    if (vid.muted) {
      vid.muted  = false
      vid.volume = 0.55
      setIsMuted(false)
    } else {
      vid.muted = true
      setIsMuted(true)
    }

    gsap.fromTo(volumeRef.current, { scale: 1.35 }, { scale: 1, duration: 0.35, ease: 'power3.out' })
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onClick={handleVideoClick}
      onKeyDown={(e) => { if (e.key === ' ' && e.target === sectionRef.current) { e.preventDefault(); handleVideoClick() } }}
      tabIndex={-1}
      aria-label="Hero section — click anywhere or press Space to toggle sound"
    >
      {/* ── Full-screen cinematic video — auto-plays immediately ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        fetchPriority="low"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* ── Dark cinematic overlay ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(135deg, rgba(0,15,40,0.80) 0%, rgba(0,0,8,0.62) 50%, rgba(0,35,80,0.58) 100%)',
        }}
      />

      {/* ── Bottom fade to page background ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-52 pointer-events-none"
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
      <div
        ref={contentRef}
        className="relative flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
        style={{ zIndex: 5 }}
      >
        {/* Eyebrow */}
        <p className="section-label justify-center mb-4">
          IT Support Desk · CS @ DSU · Madison, SD
        </p>

        {/* Name */}
        <h1
          className="font-outfit font-black text-white leading-none mb-2"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
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

        {/* Tagline */}
        <p
          className="font-inter text-white/65 mt-5 mb-10 max-w-2xl leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)' }}
        >
          IT Support Technician by day, building web apps and cloud infrastructure by night.
        </p>

        {/* CTA Buttons — stopPropagation so clicking buttons doesn't toggle mute */}
        <div className="flex flex-wrap gap-3 justify-center" onClick={(e) => e.stopPropagation()}>
          <MagneticButton as="button" onClick={() => scrollTo('projects')} className="btn-gold" id="hero-cta-projects">
            View My Work
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </MagneticButton>

          <MagneticButton as="button" onClick={() => scrollTo('contact')} className="btn-outline" id="hero-cta-contact">
            Contact Me
          </MagneticButton>

          <MagneticButton as="button" onClick={onOpenResume} id="hero-cta-resume" className="btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            View Resume
          </MagneticButton>

          {/* Force new row for Chat button */}
          <div className="w-full h-1"></div>

          <MagneticButton 
            as="button" 
            onClick={onOpenTerminal} 
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
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            Chat with Digital Sandeep
          </MagneticButton>
        </div>

        {/* ── Audio hint — fades in at 0.8s, auto-fades out at 4.5s, instant on click ── */}
        <div
          ref={hintRef}
          aria-hidden="true"
          className="mt-8 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full font-inter text-white/55 select-none"
            style={{
              fontSize: 12,
              background: 'rgba(0,0,0,0.42)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.10)',
              whiteSpace: 'nowrap',
            }}
          >
            <VolumeOffIcon />
            Click anywhere on screen to enable audio
          </div>
        </div>
      </div>


      {/* ── Volume indicator — bottom-right ──────────────────────────────────── */}
      <div
        ref={volumeRef}
        aria-hidden="true"
        className="absolute bottom-10 right-8 z-10 flex items-center gap-2 px-3 py-2 rounded-full text-white/50 text-xs font-inter select-none pointer-events-none"
        style={{
          opacity: 0,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
        <span style={{ fontSize: 11 }}>{isMuted ? 'Sound off' : 'Sound on'}</span>
      </div>

      {/* ── Scroll indicator — bottom-center ─────────────────────────────────── */}
      <div
        ref={scrollIndRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
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
    </section>
  )
}
