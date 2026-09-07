import { useCallback, useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ResumeView from './components/ResumeView'
import Terminal from './components/Terminal'

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  useEffect(() => {
    if (isTerminalOpen) {
      document.body.classList.add('chat-open')
    } else {
      document.body.classList.remove('chat-open')
    }
  }, [isTerminalOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault()
        setIsTerminalOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Fix for ScrollTrigger not firing on programmatic scrollIntoView
  useEffect(() => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      // Force a refresh once layout is fully painted
      setTimeout(() => ScrollTrigger.refresh(), 500)
      
      // Ensure ScrollTrigger gets body scroll events (fixes smooth scroll missed updates)
      const handleScroll = () => ScrollTrigger.update()
      document.body.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => document.body.removeEventListener('scroll', handleScroll)
    })
  }, [])

  const openResume = useCallback(() => {
    setIsResumeOpen(true)
    document.dispatchEvent(new CustomEvent('hero-video:pause'))
  }, [])
  const closeResume = useCallback(() => {
    setIsResumeOpen(false)
    document.dispatchEvent(new CustomEvent('hero-video:resume'))
  }, [])

  const closeTerminal = useCallback(() => setIsTerminalOpen(false), [])

  // Toggle, not open. The hero's CTA row calls `stopPropagation` so that
  // clicking a button does not also toggle the video's mute — which means its
  // clicks never reach the click-outside handler below either. A button that
  // only ever set `true` therefore had no way to close what it had opened.
  // Stopping propagation here as well keeps that click-outside handler from
  // firing in the same batch and immediately undoing the toggle.
  const toggleTerminal = useCallback((e) => {
    e?.stopPropagation?.()
    setIsTerminalOpen((open) => !open)
  }, [])

  // Opening the chat animates `body`'s margin for 700ms. Re-rendering all eight
  // sections on that first frame measured ~66ms of script — a visible stutter
  // right where the slide should be smoothest. Nothing in here reads the chat
  // state, so freeze the element tree and let only the drawer re-render.
  const page = useMemo(() => (
    <>
      {/* Floating pill nav */}
      <Navbar onOpenResume={openResume} onToggleTerminal={toggleTerminal} />

      {/* Page sections */}
      <Hero onOpenResume={openResume} onToggleTerminal={toggleTerminal} />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
    </>
  ), [openResume, toggleTerminal])

  return (
    <div className="min-h-screen bg-[#050e1f] text-white font-inter overflow-x-hidden">

      {/* Main Content Wrapper — a click anywhere that is not a chat control
          dismisses the drawer.

          The drawer makes room by padding THIS wrapper, never by setting a
          margin on `body`. `body` is the page's scroll container and the
          scroller every ScrollTrigger is bound to, so animating its width made
          the whole scroll system recalculate on every frame. Padding a child
          keeps the scroll container a fixed size. It is also only applied from
          `lg` up: below that the drawer simply slides over the page, so there
          is no reflow at all on phones and small tablets.

          `pr-80` is 20rem — it MUST equal the drawer's `sm:w-80`. An earlier
          version padded 28rem against a 20rem drawer, which left a 128px strip
          of bare page background between the content and the panel. */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${isTerminalOpen ? 'lg:pr-80' : ''}`}
        onClick={closeTerminal}
      >
        {page}
      </div>

      {/* Terminal Sidebar Modal */}
      <Terminal isOpen={isTerminalOpen} onClose={closeTerminal} />

      {/* Dynamic resume modal — rendered on demand */}
      {isResumeOpen && <ResumeView onClose={closeResume} />}
    </div>
  )
}
