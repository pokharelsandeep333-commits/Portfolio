import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { projects } from '../data/projects'

const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
)

export default function Projects() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardsRef   = useRef(null)

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
        cardsRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-28 px-6"
      style={{ background: 'linear-gradient(180deg, #050e1f 0%, #081525 100%)' }}
    >
      <div className="section-divider mb-16" />

      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="mb-14">
          <p className="section-label">Projects</p>
          <h2 className="section-heading">Things I've <span>built</span></h2>
        </div>

        <div ref={cardsRef} className="space-y-6">
          {projects.map((p) => (
            <article
              key={p.title}
              className="glass-card project-card p-8"
              aria-label={`Project: ${p.title}`}
            >
              {/* Top row */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-outfit font-bold text-white text-xl">{p.title}</h3>
                    <span className={`badge ${p.badge}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {p.github && p.github !== '#' && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-white/45 hover:text-dsuGold transition-colors text-sm font-inter"
                      aria-label={`${p.title} on GitHub`}
                    >
                      <GitHubIcon />
                      GitHub
                    </a>
                  )}
                  {p.demo && p.demo !== '#' && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-white/45 hover:text-dsuGold transition-colors text-sm font-inter"
                      aria-label={`${p.title} live demo`}
                    >
                      <ExternalIcon />
                      Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Description or highlights */}
              {p.description && (
                <p className="font-inter text-white/60 leading-relaxed text-sm mb-5">{p.description}</p>
              )}

              {p.highlights && (
                <ul className="space-y-2.5 mb-6">
                  {p.highlights.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm font-inter text-white/60 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dsuGold flex-shrink-0" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {p.stack.map((s) => (
                  <span key={s} className="tech-chip">{s}</span>
                ))}
              </div>

            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
