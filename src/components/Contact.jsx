import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about } from '../data/skills'
import MagneticButton from './MagneticButton'

// ─── Social / location link cards (email card removed per design update) ──────
const LINKS = [
  {
    id: 'linkedin-link',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/>
      </svg>
    ),
    label: 'LinkedIn',
    sub: 'Connect with me',
    href: about.contact.linkedin,
  },
  {
    id: 'github-link',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    label: 'GitHub',
    sub: 'View my repositories',
    href: about.contact.github,
  },
  {
    id: 'location-info',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: about.contact.location,
    sub: 'Open to remote opportunities',
    href: null,
  },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)

  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [isCopied, setIsCopied] = useState(false)

  const handleEmailCopy = () => {
    navigator.clipboard.writeText('pokharelsandeep333@gmail.com').catch(() => {})
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

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
        leftRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 82%', once: true },
        }
      )

      gsap.fromTo(
        rightRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: rightRef.current, start: 'top 82%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
      if (res.ok) setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-28 px-6"
      style={{ background: 'linear-gradient(180deg, #081525 0%, #050e1f 100%)' }}
    >
      <div className="section-divider mb-16" />

      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-14">
          <p className="section-label">Contact</p>
          <h2 className="section-heading">Let's <span>connect</span></h2>
          <p className="font-inter text-white/45 text-base mt-3 max-w-lg">
            I am actively looking for summer internships in Software Engineering and ML/AI
            research. If you're working on something interesting, I'd love to hear about it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Social / location links */}
          <div ref={leftRef} className="space-y-3">
            {LINKS.map((l) => {
              const inner = (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-dsuBlue/50 border border-dsuGold/20 flex items-center justify-center text-dsuGold flex-shrink-0">
                    {l.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-outfit font-semibold text-white text-sm truncate">{l.label}</p>
                    <p className="text-white/40 text-xs font-inter">{l.sub}</p>
                  </div>
                  {l.href && (
                    <svg className="ml-auto text-white/25 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  )}
                </div>
              )

              return l.href ? (
                <a
                  key={l.id}
                  id={l.id}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="glass-card px-5 py-4 block hover:border-dsuGold/30 transition-all"
                >
                  {inner}
                </a>
              ) : (
                <div key={l.id} id={l.id} className="glass-card px-5 py-4">
                  {inner}
                </div>
              )
            })}


          </div>

          {/* Contact form */}
          <div ref={rightRef}>
            {status === 'sent' ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[320px]">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-label="Message sent">
                  <circle cx="28" cy="28" r="26" stroke="#FFC72C" strokeWidth="2" fill="rgba(255,199,44,0.08)" />
                  <path d="M18 28l7 7 13-14" stroke="#FFC72C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-outfit font-bold text-white text-xl mt-5 mb-2">Message sent!</p>
                <p className="text-white/45 font-inter text-sm">I'll get back to you soon.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-dsuGold text-xs font-inter hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5" noValidate>
                <div>
                  <label htmlFor="contact-name" className="block text-white/50 text-xs font-inter font-medium uppercase tracking-widest mb-2">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-white/50 text-xs font-inter font-medium uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-white/50 text-xs font-inter font-medium uppercase tracking-widest mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder="Hi Sandeep, I came across your portfolio and..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="form-input resize-none"
                    required
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-xs font-inter">
                    Something went wrong. Please email me at{' '}
                    <a href={`mailto:${about.contact.email}`} className="underline">{about.contact.email}</a>
                  </p>
                )}

                <MagneticButton as="button" type="submit" disabled={status === 'sending'} id="contact-submit" className="btn-gold w-full justify-center" strength={0.2}>
                  {status === 'sending' ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </>
                  )}
                </MagneticButton>

                {/* Inline email fallback — below the submit button */}
                <p className="text-white/35 text-xs font-inter text-left">
                  Or email directly:{' '}
                  <a
                    href="mailto:pokharelsandeep333@gmail.com"
                    onClick={handleEmailCopy}
                    className={`font-medium transition-colors ${
                      isCopied ? 'text-white/70' : 'text-dsuGold hover:text-yellow-300'
                    }`}
                  >
                    {isCopied ? '✓ Copied!' : 'pokharelsandeep333@gmail.com'}
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
