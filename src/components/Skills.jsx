import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { skills } from '../data/skills'

export default function Skills() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const gridRef    = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading fade-up
      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        }
      )

      // Cards stagger fade-up
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
      id="skills"
      ref={sectionRef}
      className="relative py-28 px-6"
      style={{ background: 'linear-gradient(180deg, #081525 0%, #050e1f 100%)' }}
    >
      <div className="section-divider mb-16" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="mb-14">
          <p className="section-label">Technical Skills</p>
          <h2 className="section-heading">
            What I <span>work with</span>
          </h2>
        </div>

        {/* 2 × 2 grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {skills.map((group) => (
            <div key={group.category} className="glass-card p-8">
              {/* Icon + category header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl" aria-hidden="true">{group.icon}</span>
                <div>
                  <p className="font-outfit font-bold text-white text-base leading-tight">
                    {group.category}
                  </p>
                  <p className="text-white/30 text-xs font-inter mt-0.5">
                    {group.items.length} skills
                  </p>
                </div>
              </div>

              {/* Gold rule */}
              <div className="h-px bg-gradient-to-r from-dsuGold/40 to-transparent mb-5" />

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className={`skill-chip ${group.highlight.includes(item) ? 'highlighted' : ''}`}
                  >
                    {group.highlight.includes(item) && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-dsuGold mr-1.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {item}
                  </span>
                ))}
              </div>

              {/* Core proficiency note */}
              {group.highlight.length > 0 && (
                <p className="text-white/25 text-xs font-inter mt-5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-dsuGold inline-block" aria-hidden="true" />
                  Core proficiency highlighted
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
