import { useCallback, useEffect, useRef, useState } from 'react'
import { certifications } from '../data/skills'
import { useMediaQuery, MOBILE_QUERY } from '../hooks/useMediaQuery'

const NAV_LINKS = [
  { label: 'About',          id: 'about'          },
  { label: 'Experience',     id: 'experience'     },
  { label: 'Skills',         id: 'skills'         },
  { label: 'Projects',       id: 'projects'       },
  ...(certifications && certifications.length > 0 ? [{ label: 'Credentials', id: 'certifications' }] : []),
  { label: 'Contact',        id: 'contact'        },
]

const ResumeIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const SparkIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2.5 L14.4 9.6 L21.5 12 L14.4 14.4 L12 21.5 L9.6 14.4 L2.5 12 L9.6 9.6 Z"/>
  </svg>
)

export default function Navbar({ onOpenResume, onToggleTerminal }) {
  const navRef = useRef(null)
  const linkRefs = useRef({})
  const [activeSection, setActiveSection] = useState('')
  const isMobile = useMediaQuery(MOBILE_QUERY)

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

    document.body.addEventListener('scroll', showHide, { passive: true })
    return () => document.body.removeEventListener('scroll', showHide)
  }, [])

  // Active section: reliable scroll-position approach
  // Uses a "reading line" at 35% down the viewport — whichever section
  // has its top <= that line is considered active.
  useEffect(() => {
    const getActive = () => {
      const readingLine = document.body.scrollTop + window.innerHeight * 0.35

      let current = ''
      for (const { id } of NAV_LINKS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= readingLine) {
          current = id
        }
      }
      setActiveSection(current)
    }

    document.body.addEventListener('scroll', getActive, { passive: true })
    getActive() // set immediately on mount
    return () => document.body.removeEventListener('scroll', getActive)
  }, [])

  // Phones only, and deliberately so. The pill only ever outruns its own
  // `max-width` at phone widths, so this is the only place the sideways scroll
  // exists to be corrected. Gating it also keeps it out of the way of the chat
  // drawer: opening the drawer animates `body`'s margin for 700ms, the page
  // reflows on every frame of that, `getActive` fires on the resulting scroll
  // events, and this effect would then read `scrollWidth` — forcing a
  // synchronous layout in the middle of the animation — only to find nothing
  // to scroll. On a laptop that is pure cost the deployed build never pays.
  useEffect(() => {
    if (!isMobile) return

    const nav = navRef.current
    const link = linkRefs.current[activeSection]
    if (!nav || !link) return

    const overflow = nav.scrollWidth - nav.clientWidth
    if (overflow <= 0) return

    const target = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2
    nav.scrollTo({
      left: Math.max(0, Math.min(target, overflow)),
      behavior: 'smooth',
    })
  }, [activeSection, isMobile])

  const scrollTo = useCallback(
    (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
    [],
  )

  return (
    <nav ref={navRef} className="navbar-pill" aria-label="Main navigation">
      {/* Logo mark — doubles as scroll-to-top */}
      <button
        onClick={() => document.body.scrollTo({ top: 0, behavior: 'smooth' })}
        className="font-outfit font-bold text-white text-sm tracking-wider mr-2 hover:text-dsuGold transition-colors shrink-0"
        aria-label="Scroll to top"
      >
        SP<span className="text-dsuGold">.</span>
      </button>

      <div className="w-px h-4 bg-white/10 shrink-0" />

      {NAV_LINKS.map(({ label, id }) => (
        <button
          key={id}
          ref={(el) => { linkRefs.current[id] = el }}
          onClick={() => scrollTo(id)}
          aria-current={activeSection === id ? 'true' : undefined}
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

      <div className="w-px h-4 bg-white/10 shrink-0" />

      {/* Resume — opens dynamic modal */}
      <button
        onClick={onOpenResume}
        id="nav-resume-link"
        className="flex items-center gap-1.5 text-xs font-outfit font-medium text-white/60 hover:text-dsuGold transition-colors shrink-0"
        aria-label="View resume"
      >
        <ResumeIcon />
        Resume
      </button>

      {/* Chat Terminal CTA */}
      <button
        onClick={onToggleTerminal}
        className="text-xs font-outfit font-medium text-white/60 hover:text-dsuGold transition-colors shrink-0 flex items-center gap-1.5"
        aria-label="Toggle AI chat"
      >
        <SparkIcon />
        Ask AI
      </button>

      <div className="w-px h-4 bg-white/10 shrink-0" />

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
