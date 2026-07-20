import { useState } from 'react'
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

  const openResume = () => {
    setIsResumeOpen(true)
    document.dispatchEvent(new CustomEvent('hero-video:pause'))
  }
  const closeResume = () => {
    setIsResumeOpen(false)
    document.dispatchEvent(new CustomEvent('hero-video:resume'))
  }

  return (
    <div className="min-h-screen bg-[#050e1f] text-white font-inter overflow-x-hidden">
      
      {/* Main Content Wrapper - shrinks when terminal is open */}
      <div className={`transition-all duration-300 ease-in-out ${isTerminalOpen ? 'lg:pr-[28rem]' : ''}`}>
        {/* Floating pill nav */}
      <Navbar onOpenResume={openResume} onOpenTerminal={() => setIsTerminalOpen(true)} />

      {/* Page sections */}
      <Hero onOpenResume={openResume} onOpenTerminal={() => setIsTerminalOpen(true)} />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />

      {/* Dynamic resume modal — rendered on demand */}
      {isResumeOpen && <ResumeView onClose={closeResume} />}
      </div>
      
      {/* Terminal Sidebar Modal */}
      <Terminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </div>
  )
}
