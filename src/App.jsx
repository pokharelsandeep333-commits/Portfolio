import { useState, useEffect } from 'react'
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

  const openResume = () => {
    setIsResumeOpen(true)
    document.dispatchEvent(new CustomEvent('hero-video:pause'))
  }
  const closeResume = () => {
    setIsResumeOpen(false)
    document.dispatchEvent(new CustomEvent('hero-video:resume'))
  }

  const closeTerminal = () => {
    if (isTerminalOpen) setIsTerminalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#050e1f] text-white font-inter overflow-x-hidden">
      
      {/* Main Content Wrapper */}
      <div className="w-full" onClick={closeTerminal}>
        {/* Floating pill nav */}
        <Navbar onOpenResume={openResume} onOpenTerminal={() => setIsTerminalOpen(true)} isChatOpen={isTerminalOpen} />

        {/* Page sections */}
        <Hero onOpenResume={openResume} onOpenTerminal={() => setIsTerminalOpen(true)} />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
        <Footer />

      </div>
      
      {/* Terminal Sidebar Modal */}
      <Terminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* Dynamic resume modal — rendered on demand */}
      {isResumeOpen && <ResumeView onClose={closeResume} />}
    </div>
  )
}
