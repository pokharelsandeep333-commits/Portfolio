import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'

// Register GSAP plugins globally — must happen before any component mounts
gsap.registerPlugin(ScrollTrigger)

// Global GSAP defaults for performance
gsap.defaults({ ease: 'power3.out' })

// ScrollTrigger global settings
ScrollTrigger.config({
  // Prevents jitter/flicker on some browsers
  ignoreMobileResize: true,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
