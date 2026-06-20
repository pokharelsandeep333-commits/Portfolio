import { useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { label: 'About',          id: 'about'          },
  { label: 'Experience',     id: 'experience'     },
  { label: 'Skills',         id: 'skills'         },
  { label: 'Projects',       id: 'projects'       },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Contact',        id: 'contact'        },
]

export default function Navbar({ onOpenResume }) {
  const navRef = useRef(null)
  const [activeSection, setActiveSection] = useState('')

  // Show/hide pill after hero scrolls past
  useEffect(() => {
    const hero = document.getElementById('hero')

    const showHide = () => {
      if (!hero || !navRef.current) return
      if (hero.getBoundingClientRect().bottom < 80) {
        navRef.current.classList.add('visible')
      } else {
        navRef.current.classList.remove('visible')
      }
    }

    window.addEventListener('scroll', showHide, { passive: true })
    return () => window.removeEventListener('scroll', showHide)
  }, [])

  // Active section: reliable scroll-position approach
  // Uses a "reading line" at 35% down the viewport — whichever section
  // has its top <= that line is considered active.
  useEffect(() => {
    const getActive = () => {
      const readingLine = window.scrollY + window.innerHeight * 0.35

      let current = ''
      for (const { id } of NAV_LINKS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= readingLine) {
          current = id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', getActive, { passive: true })
    getActive() // set immediately on mount
    return () => window.removeEventListener('scroll', getActive)
  }, [])

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav ref={navRef} className="navbar-pill" aria-label="Main navigation">
      {/* Logo mark */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="font-outfit font-bold text-white text-sm tracking-wider mr-2 hover:text-dsuGold transition-colors shrink-0"
        aria-label="Scroll to top"
      >
        SP<span className="text-dsuGold">.</span>
      </button>

      <div className="w-px h-4 bg-white/10 shrink-0" />

      {NAV_LINKS.map(({ label, id }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`font-outfit text-sm font-medium transition-colors relative group shrink-0 ${
            activeSection === id ? 'text-dsuGold' : 'text-white/70 hover:text-white'
          }`}
        >
          {label}
          {/* Gold underline indicator */}
          <span
            className={`absolute -bottom-1 left-0 h-0.5 bg-dsuGold rounded transition-all duration-300 ${
              activeSection === id ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </button>
      ))}

      <div className="w-px h-4 bg-white/10" />

      {/* Resume — opens dynamic modal */}
      <button
        onClick={onOpenResume}
        id="nav-resume-link"
        className="flex items-center gap-1.5 text-xs font-outfit font-medium text-white/60 hover:text-dsuGold transition-colors shrink-0"
        aria-label="View resume"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        Resume
      </button>

      {/* Hire Me CTA */}
      <a
        href="#contact"
        onClick={(e) => { e.preventDefault(); scrollTo('contact') }}
        className="text-xs font-outfit font-bold text-dsuBlue bg-dsuGold px-4 py-1.5 rounded-full hover:bg-yellow-300 transition-colors shrink-0"
      >
        Hire Me
      </a>
    </nav>
  )
}
