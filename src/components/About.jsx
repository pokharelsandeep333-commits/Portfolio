import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about } from '../data/skills'

// Reusable scroll-triggered fade-up helper
function fadeUp(targets, trigger, stagger = 0) {
  gsap.fromTo(
    targets,
    { y: 30, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 0.85,
      stagger,
      ease: 'power3.out',
      scrollTrigger: { trigger, start: 'top 82%', once: true },
    }
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const bioRef     = useRef(null)
  const cardsRef   = useRef(null)
  const tagsRef    = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      fadeUp(headingRef.current, headingRef.current)
      fadeUp(bioRef.current.children, bioRef.current, 0.13)
      fadeUp(cardsRef.current.children, cardsRef.current, 0.09)
      fadeUp(tagsRef.current.children, tagsRef.current, 0.06)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 px-6"
      style={{ background: 'linear-gradient(180deg, #050e1f 0%, #081525 100%)' }}
    >
      <div className="section-divider mb-16" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="mb-14">
          <p className="section-label">About Me</p>
          <h2 className="section-heading">
            A little <span>background</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Left — Bio + Tags */}
          <div>
            <div ref={bioRef} className="space-y-5">
              {about.bio.map((para, i) => (
                <p key={i} className="font-inter text-white/65 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>

            <div ref={tagsRef} className="flex flex-wrap gap-2.5 mt-8">
              {about.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-inter font-medium px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 hover:border-dsuGold/30 hover:text-white/90 transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Detail cards */}
          <div ref={cardsRef} className="space-y-3">
            {about.details.map((d) => (
              <div key={d.label} className="glass-card px-5 py-4 flex items-center gap-5">
                <div className="w-1 h-10 rounded-full bg-dsuGold flex-shrink-0 opacity-70" />
                <div className="min-w-0">
                  <p className="text-white/35 text-xs font-inter uppercase tracking-widest mb-0.5">{d.label}</p>
                  <p className="text-white font-outfit font-semibold text-sm truncate">{d.val}</p>
                  <p className="text-white/45 text-xs font-inter mt-0.5">{d.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
