import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { experience, education } from '../data/skills'

export default function Experience() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const timelineRef = useRef(null)

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
        timelineRef.current.children,
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.85,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: timelineRef.current, start: 'top 80%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-28 px-6"
      style={{ background: 'linear-gradient(180deg, #081525 0%, #050e1f 100%)' }}
    >
      <div className="section-divider mb-16" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="mb-14">
          <p className="section-label">Background</p>
          <h2 className="section-heading">
            Experience &amp; <span>Education</span>
          </h2>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative space-y-0">
          {/* Vertical line */}
          <div
            className="absolute left-[15px] top-2 bottom-2 w-px pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #FFC72C55, #FFC72C22, transparent)' }}
            aria-hidden="true"
          />

          {/* Work experience entries */}
          {experience.map((job, i) => (
            <TimelineEntry
              key={i}
              dot="work"
              period={job.period}
              title={job.role}
              subtitle={`${job.org} · ${job.location}`}
              badge={job.type}
              bullets={job.bullets}
              isLast={i === experience.length - 1 && education.length === 0}
            />
          ))}

          {/* Education entries */}
          {education.map((edu, i) => (
            <TimelineEntry
              key={`edu-${i}`}
              dot="edu"
              period={edu.period}
              title={edu.degree}
              subtitle={`${edu.school} · ${edu.location}`}
              bullets={edu.bullets}
              note={edu.note}
              isLast={i === education.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Reusable timeline entry ──────────────────────────────────────────────────
function TimelineEntry({ dot, period, title, subtitle, badge, bullets, note, isLast }) {
  return (
    <div className={`relative pl-10 ${isLast ? 'pb-0' : 'pb-10'}`}>
      {/* Dot */}
      <div
        className="absolute left-0 top-1 w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center flex-shrink-0"
        style={{
          borderColor: '#FFC72C',
          background: dot === 'work' ? 'rgba(255,199,44,0.15)' : 'rgba(255,255,255,0.06)',
        }}
        aria-hidden="true"
      >
        {dot === 'work' ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        )}
      </div>

      {/* Card */}
      <div className="glass-card p-6">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-outfit font-bold text-white text-lg leading-snug">{title}</h3>
            <p className="text-white/45 text-sm font-inter mt-0.5">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {badge && (
              <span className="text-xs font-inter font-medium px-2.5 py-1 rounded-full bg-dsuGold/10 border border-dsuGold/25 text-dsuGold">
                {badge}
              </span>
            )}
            <span className="text-white/35 text-xs font-inter font-medium whitespace-nowrap">
              {period}
            </span>
          </div>
        </div>

        {/* Gold rule */}
        <div className="h-px bg-gradient-to-r from-dsuGold/30 to-transparent mb-4" />

        {/* Bullets */}
        {bullets && (
          <ul className="space-y-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-sm font-inter text-white/60 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dsuGold flex-shrink-0" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Note (for education) */}
        {note && (
          <p className="text-white/40 text-xs font-inter italic mt-1">{note}</p>
        )}
      </div>
    </div>
  )
}
