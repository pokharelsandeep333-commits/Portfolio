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
        <span className="resume-ctrl-title">{about.name} | Resume</span>
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
            <a href={about.contact.linkedin} className="resume-contact-link" target="_blank" rel="noopener noreferrer">
              {displayUrl(about.contact.linkedin)}
            </a>
            {' | '}
            <a href={about.contact.github} className="resume-contact-link" target="_blank" rel="noopener noreferrer">
              {displayUrl(about.contact.github)}
            </a>
            {' | '}
            <a href={about.contact.portfolio} className="resume-contact-link" target="_blank" rel="noopener noreferrer">
              {displayUrl(about.contact.portfolio)}
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
                  {job.orgLink ? (
                    <a href={job.orgLink} className="resume-contact-link" target="_blank" rel="noopener noreferrer">{job.org}</a>
                  ) : (
                    job.org
                  )} &nbsp;|&nbsp; {job.location}
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

            {projects.filter(p => !p.hideOnResume).map((p) => {
              // Use resumeHighlights for concise ATS bullets; fall back to first 2 highlights
              const bullets = p.resumeHighlights ?? p.highlights?.slice(0, 2)
              return (
                <div key={p.title} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="resume-entry-role">
                      {p.title}
                      {p.demo && (
                        <a href={p.demo} className="resume-contact-link" style={{ display: 'inline-block', marginLeft: '4px' }} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-1.5px' }}>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}
                    </span>
                    {p.github && (
                      <span className="resume-entry-date resume-badge-text">
                        <a href={p.github} className="resume-contact-link" style={{ display: 'inline-block' }} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: '-2px' }}>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
                          </svg>
                        </a>
                      </span>
                    )}
                  </div>
                  {(p.resumeDescription || p.description) && (
                    <p className="resume-entry-desc">{p.resumeDescription || p.description}</p>
                  )}
                  {bullets && bullets.length > 0 && (
                    <ul className="resume-bullets">
                      {bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                  <p className="resume-stack">
                    <strong>Stack:</strong> {(p.resumeStack || p.stack.slice(0, 5)).join(' | ')}
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
                        {cert.issuer}, {cert.date}
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
