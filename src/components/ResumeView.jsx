import { useEffect, useState, useCallback } from 'react'
import { about, skills, experience, education, certifications } from '../data/skills'
import { projects } from '../data/projects'

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// Helper: extract display hostname from a URL for cleaner resume links
const displayUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export default function ResumeView({ onClose }) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(onClose, 280) // matches CSS exit animation duration
  }, [onClose])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleClose])

  return (
    <div
      id="resume-overlay"
      className={`resume-overlay ${isClosing ? 'resume-overlay--exit' : 'resume-overlay--enter'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
      onClick={(e) => { if (e.target.id === 'resume-overlay') handleClose() }}
    >
      {/* ── Control bar (hidden in print) ─────────────────────────────────────── */}
      <div className="resume-controls no-print">
        <button onClick={handleClose} className="resume-ctrl-btn" aria-label="Back to Portfolio">
          <CloseIcon /> Back to Portfolio
        </button>
        <span className="resume-ctrl-title">{about.name} — Resume</span>
        <button onClick={() => window.print()} className="resume-ctrl-btn resume-ctrl-btn--primary" aria-label="Download PDF">
          <DownloadIcon /> Download PDF
        </button>
      </div>

      {/* ── Scrollable resume container ─────────────────────────────────────────── */}
      <div className="resume-scroll">
        {/*
          id="resume-print-area" is the root element targeted by @media print.
          The DOM order is strictly linear (no multi-column grids) so the PDF
          text layer is perfectly sequential for ATS parsers.
        */}
        <div id="resume-print-area" className="resume-paper">

          {/* ═══════════════════════════════════════════════════════════════════
              HEADER — dynamic from about{}
          ═══════════════════════════════════════════════════════════════════ */}
          <h1 className="resume-name">{about.name}</h1>
          <p className="resume-title-line">
            {about.title} &nbsp;|&nbsp; {about.subtitle}
          </p>
          {/* Contact info — plain text, no icons, ATS-safe */}
          <p className="resume-contact-row">
            <a href={`mailto:${about.contact.email}`} className="resume-contact-link">
              {about.contact.email}
            </a>
            {' | '}
            <a href={about.contact.linkedin} className="resume-contact-link">
              {displayUrl(about.contact.linkedin)}
            </a>
            {' | '}
            <a href={about.contact.github} className="resume-contact-link">
              {displayUrl(about.contact.github)}
            </a>
            {' | '}
            {about.contact.location}
          </p>

          <div className="resume-rule" />

          {/* ═══════════════════════════════════════════════════════════════════
              EXPERIENCE — dynamic from experience[]
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="resume-section">
            <h2 className="resume-section-title">Experience</h2>

            {experience.map((job) => (
              <div key={job.role + job.period} className="resume-entry">
                <div className="resume-entry-header">
                  <span className="resume-entry-role">{job.role}</span>
                  <span className="resume-entry-date">{job.period}</span>
                </div>
                <p className="resume-entry-org">
                  {job.org} &nbsp;|&nbsp; {job.location}
                </p>
                {job.bullets && (
                  <ul className="resume-bullets">
                    {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>

          <div className="resume-rule" />

          {/* ═══════════════════════════════════════════════════════════════════
              PROJECTS — dynamic from projects[]
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="resume-section">
            <h2 className="resume-section-title">Projects</h2>

            {projects.map((p) => {
              // Use resumeHighlights for concise ATS bullets; fall back to first 2 highlights
              const bullets = p.resumeHighlights ?? p.highlights?.slice(0, 2)
              return (
                <div key={p.title} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="resume-entry-role">{p.title}</span>
                    <span className="resume-entry-date resume-badge-text">{p.status}</span>
                  </div>
                  {p.description && (
                    <p className="resume-entry-desc">{p.description}</p>
                  )}
                  {bullets && bullets.length > 0 && (
                    <ul className="resume-bullets">
                      {bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                  <p className="resume-stack">
                    <strong>Stack:</strong> {p.stack.join(' | ')}
                  </p>
                </div>
              )
            })}
          </section>

          <div className="resume-rule" />

          {/* ═══════════════════════════════════════════════════════════════════
              EDUCATION — dynamic from education[]
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="resume-section">
            <h2 className="resume-section-title">Education</h2>

            {education.map((edu) => (
              <div key={edu.degree + edu.period} className="resume-entry">
                <div className="resume-entry-header">
                  <span className="resume-entry-role">{edu.degree}</span>
                  <span className="resume-entry-date">{edu.period}</span>
                </div>
                <p className="resume-entry-org">
                  {edu.school} &nbsp;|&nbsp; {edu.location}
                </p>
                {edu.bullets && (
                  <ul className="resume-bullets">
                    {edu.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>

          <div className="resume-rule" />

          {/* ═══════════════════════════════════════════════════════════════════
              CERTIFICATIONS — dynamic from certifications[]
          ═══════════════════════════════════════════════════════════════════ */}
          {certifications.length > 0 && (
            <>
              <section className="resume-section">
                <h2 className="resume-section-title">Certifications & Courses</h2>
                <div className="resume-skills-grid">
                  {certifications.map((cert) => (
                    <p key={cert.name} className="resume-skill-row">
                      <strong className="resume-skill-label">{cert.name}</strong>
                      {' '}
                      <span className="resume-skill-items">
                        {cert.issuer} — {cert.date}
                      </span>
                    </p>
                  ))}
                </div>
              </section>

              <div className="resume-rule" />
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SKILLS — dynamic from skills[]
              Plain-text rows only — no icons, bars, or SVGs (ATS-safe).
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="resume-section">
            <h2 className="resume-section-title">Skills</h2>
            <div className="resume-skills-grid">
              {skills.map((group) => (
                <p key={group.category} className="resume-skill-row">
                  <strong className="resume-skill-label">{group.category}:</strong>
                  {' '}
                  <span className="resume-skill-items">
                    {group.items.join(', ')}
                  </span>
                </p>
              ))}
            </div>
          </section>

        </div>{/* end resume-print-area */}
      </div>
    </div>
  )
}
