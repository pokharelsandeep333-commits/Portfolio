import { about } from '../data/skills'

export default function Footer() {
  return (
    <footer
      className="relative py-10 px-6 border-t border-white/5"
      style={{ background: '#030c18' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-outfit font-bold text-white">
            Sandeep<span className="text-dsuGold">.</span>
          </span>
          <span className="text-white/20 text-xs font-inter">
            · Built with Vite · React · GSAP · Tailwind CSS
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href={`mailto:${about.contact.email}`}
            className="text-white/30 hover:text-dsuGold transition-colors"
            aria-label="Email Sandeep"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
          <a
            href={about.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-dsuGold transition-colors"
            aria-label="Sandeep on LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
          </a>
          <a
            href={about.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-dsuGold transition-colors"
            aria-label="Sandeep on GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>

        <p className="text-white/20 text-xs font-inter">
          © {new Date().getFullYear()} Sandeep Pokharel
        </p>
      </div>
    </footer>
  )
}
