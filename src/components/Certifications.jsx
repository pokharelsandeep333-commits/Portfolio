import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { certifications } from '../data/skills'

// Status config
const STATUS = {
  earned:      { label: 'Earned',      cls: 'badge-production' },
  'in-progress': { label: 'In Progress', cls: 'badge-progress'   },
  planned:     { label: 'Planned',     cls: 'badge-planned'     },
}

export default function Certifications() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const gridRef    = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        }
      )
      gsap.fromTo(
        gridRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative py-28 px-6"
      style={{ background: 'linear-gradient(180deg, #050e1f 0%, #081525 100%)' }}
    >
      <div className="section-divider mb-16" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="mb-14">
          <p className="section-label">Credentials</p>
          <h2 className="section-heading">
            Certifications &amp; <span>Courses</span>
          </h2>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {certifications.map((cert) => {
            const s = STATUS[cert.status] ?? STATUS.planned
            return (
              <div
                key={cert.name}
                className="glass-card p-6 flex flex-col gap-4 group hover:border-dsuGold/25 transition-all"
              >
                {/* Top: icon + status */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">{cert.icon}</span>
                  <span className={`badge ${s.cls} text-xs`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {s.label}
                  </span>
                </div>

                {/* Gold rule */}
                <div className="h-px bg-gradient-to-r from-dsuGold/30 to-transparent" />

                {/* Content */}
                <div className="flex-1">
                  <p className="font-outfit font-bold text-white text-base leading-snug mb-1">
                    {cert.name}
                  </p>
                  <p className="text-white/45 text-xs font-inter">{cert.issuer}</p>
                </div>

                {/* Date + optional link */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <span className="text-white/35 text-xs font-inter">{cert.date}</span>
                  {cert.href ? (
                    <a
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dsuGold text-xs font-inter font-medium hover:underline flex items-center gap-1"
                      aria-label={`View ${cert.name} certificate`}
                    >
                      View
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                    </a>
                  ) : (
                    <span className="text-white/20 text-xs font-inter italic">
                      {cert.status === 'in-progress' ? 'In progress' : ''}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
