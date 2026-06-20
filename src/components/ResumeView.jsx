import { useEffect, useState, useCallback } from 'react'
import { about, skills } from '../data/skills'
import { projects } from '../data/projects'

const PrintIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
)

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
        <span className="resume-ctrl-title">Sandeep Pokharel — Resume</span>
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
              HEADER
          ═══════════════════════════════════════════════════════════════════ */}
          <h1 className="resume-name">Sandeep Pokharel</h1>
          <p className="resume-title-line">
            IT Support Desk Technician &nbsp;|&nbsp; Computer Science, Dakota State University
          </p>
          {/* Contact info — plain text, no icons, ATS-safe */}
          <p className="resume-contact-row">
            <a href="mailto:pokharelsandeep333@gmail.com" className="resume-contact-link">
              pokharelsandeep333@gmail.com
            </a>
            {' | '}
            <a href="https://www.linkedin.com/in/sandeeppokharel333" className="resume-contact-link">
              linkedin.com/in/sandeeppokharel333
            </a>
            {' | '}
            <a href="https://github.com/pokharelsandeep333-commits" className="resume-contact-link">
              github.com/pokharelsandeep333-commits
            </a>
            {' | '}
            Madison, SD
          </p>

          <div className="resume-rule" />

          {/* ═══════════════════════════════════════════════════════════════════
              EXPERIENCE
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="resume-section">
            <h2 className="resume-section-title">Experience</h2>

            <div className="resume-entry">
              <div className="resume-entry-header">
                <span className="resume-entry-role">IT Support Desk Technician</span>
                <span className="resume-entry-date">May 2026 – Present</span>
              </div>
              <p className="resume-entry-org">
                DSU Information Technology Services &nbsp;|&nbsp; Madison, South Dakota
              </p>
              <ul className="resume-bullets">
                <li>Provide front-line IT support including hardware deployment, OS configuration, network troubleshooting, and device imaging for students and faculty.</li>
                <li>Manage MDM enrollment and maintain the TDNext ticketing system to track and resolve support requests across the university.</li>
              </ul>
            </div>
          </section>

          <div className="resume-rule" />

          {/* ═══════════════════════════════════════════════════════════════════
              PROJECTS
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
              EDUCATION
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="resume-section">
            <h2 className="resume-section-title">Education</h2>
            <div className="resume-entry">
              <div className="resume-entry-header">
                <span className="resume-entry-role">Bachelor of Science, Computer Science</span>
                <span className="resume-entry-date">Fall 2025 – Present</span>
              </div>
              <p className="resume-entry-org">
                Dakota State University &nbsp;|&nbsp; Madison, South Dakota
              </p>
              <ul className="resume-bullets text-gray-400 break-words whitespace-normal">
                <li>Sophomore pursuing a B.S. in Computer Science with a minor in Mathematics, maintaining a 4.0 GPA.</li>
                <li>Focused on foundational software engineering, algorithmic problem-solving, and system optimization.</li>
              </ul>
            </div>
          </section>

          <div className="resume-rule" />

          {/* ═══════════════════════════════════════════════════════════════════
              SKILLS
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
