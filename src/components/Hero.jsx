import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import MagneticButton from './MagneticButton'
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export default function Hero({ onToggleTerminal }) {
  const sectionRef = useRef(null)
  const mediaRef = useRef(null)
  const videoRef = useRef(null)
  const veilRef = useRef(null)
  const powerlineRef = useRef(null)
  const contentRef = useRef(null)
  const scrollIndRef = useRef(null)

  const isMobile = useMediaQuery(MOBILE_QUERY)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const useVideo = !isMobile && !videoFailed

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const copy = contentRef.current.children

      gsap.to(mediaRef.current, {
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

      if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
        gsap.set(veilRef.current, { display: 'none' })
        gsap.set(copy, { y: 0, opacity: 1 })
        gsap.set(scrollIndRef.current, { opacity: 1 })
        return
      }

      const boot = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => gsap.set(veilRef.current, { display: 'none' }),
      })

      boot
        .set(veilRef.current, { autoAlpha: 1, display: 'block' })
        .set(copy, { y: 45, opacity: 0 })
        .set(scrollIndRef.current, { opacity: 0 })
        .fromTo(
          powerlineRef.current,
          { scaleX: 0, scaleY: 1, opacity: 1 },
          { scaleX: 1, duration: 0.55, ease: 'power3.inOut' },
          0.1,
        )
        .to(powerlineRef.current, { scaleY: 60, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.6)
        .to(veilRef.current, { autoAlpha: 0, duration: 0.55 }, 0.7)
        .to(copy, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' }, 0.9)
        .to(scrollIndRef.current, { opacity: 1, duration: 0.7 }, 1.5)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!useVideo || !video || typeof IntersectionObserver === 'undefined') return

    let heroInView = true

    const play = () => {
      const result = video.play()
      result?.catch?.(() => setVideoFailed(true))
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroInView = entry.isIntersecting
        if (heroInView && !document.hidden) play()
        else video.pause()
      },
      { threshold: 0.05 },
    )

    const onVisibilityChange = () => {
      if (document.hidden || !heroInView) video.pause()
      else play()
    }

    observer.observe(sectionRef.current)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      video.pause()
    }
  }, [useVideo])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero-section relative flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      <div className="hero-scene" aria-hidden="true">
        <div className="hero-gradient" />

        <div ref={mediaRef} className="hero-media">
          <div className={`hero-portrait hero-portrait--static${useVideo && videoReady ? ' hero-portrait--hidden' : ''}`}>
            <img
              className="hero-layer"
              src="/hero-portrait.webp"
              srcSet="/hero-portrait-sm.webp 750w, /hero-portrait.webp 1166w"
              sizes="(max-width: 767px) 74vw, 42vw"
              width="1166"
              height="1400"
              alt=""
              decoding="async"
              fetchPriority="high"
              draggable="false"
            />
          </div>

          {useVideo && (
            <video
              ref={videoRef}
              className={`hero-video${videoReady ? ' hero-video--ready' : ''}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/hero-video-poster.webp"
              onLoadStart={() => setVideoReady(false)}
              onPlaying={() => setVideoReady(true)}
              onError={() => {
                setVideoReady(false)
                setVideoFailed(true)
              }}
            >
              <source src="/hero-video-gold.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      </div>

      <div aria-hidden="true" className="hero-ramp absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 sm:h-52 pointer-events-none"
        style={{ zIndex: 2, background: 'linear-gradient(to bottom, transparent, #050e1f)' }}
      />

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
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,199,44,0.1)] to-transparent group-hover:translate-x-full duration-1000 -translate-x-full transition-transform" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="drop-shadow-[0_0_8px_rgba(255,199,44,0.8)]">
              <path d="M12 2.5 L14.4 9.6 L21.5 12 L14.4 14.4 L12 21.5 L9.6 14.4 L2.5 12 L9.6 9.6 Z" />
            </svg>
            Chat with Digital Sandeep
          </MagneticButton>
        </div>
      </div>

      <div
        ref={scrollIndRef}
        className="hero-scroll-hint absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
        style={{ opacity: 0 }}
        onClick={(event) => { event.stopPropagation(); scrollTo('about') }}
        role="button"
        aria-label="Scroll to about section"
        tabIndex={0}
        onKeyDown={(event) => event.key === 'Enter' && scrollTo('about')}
      >
        <span className="font-outfit text-white/25 text-xs tracking-widest uppercase">Scroll</span>
        {[0, 0.15, 0.3].map((delay, index) => (
          <svg
            key={index}
            className="animate-scroll-bounce"
            style={{ animationDelay: `${delay}s`, opacity: 1 - index * 0.3, marginTop: index === 0 ? 0 : -5 }}
            width="13"
            height="7"
            viewBox="0 0 14 8"
            fill="none"
            aria-hidden="true"
          >
            <path d="M1 1l6 6 6-6" stroke="#FFC72C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </div>

      <div ref={veilRef} className="hero-veil" aria-hidden="true">
        <div ref={powerlineRef} className="hero-powerline" />
      </div>
    </section>
  )
}
