# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # Production build to dist/
npm run lint     # ESLint (flat config, run before pushing — CI gate 1)
npm test         # vitest run (single pass, not watch)
```

Single test file / single case:

```bash
npx vitest run src/components/Terminal.test.jsx
npx vitest run -t "displays rate limit error"
```

There is no separate vitest config — test settings live in the `test` block of `vite.config.js` (jsdom, globals, `src/test/setup.js`).

## Architecture

### Split deployment — this drives most of the odd wiring

The frontend and the AI backend deploy to **different hosts**:

- **Frontend**: multi-stage Docker build (`Dockerfile`) → Nginx image → Docker Hub → pulled onto AWS EC2 by Watchtower. Pushed by `.github/workflows/deploy.yml` after lint / npm audit / Gitleaks / vitest all pass.
- **Backend**: `api/chat.js` is a **Vercel serverless function**, deployed separately from this pipeline. See `docs/adr/0001-vercel-serverless-for-ai-agent.md`.

Because the EC2 bundle is static, `VITE_API_URL` is **baked in at build time**: GitHub Actions passes it as a Docker `--build-arg`, the Dockerfile promotes it to an env var before `npm run build`. `Terminal.jsx` falls back to a relative `/api/chat` when it is unset, which is what makes the Vercel-hosted copy of the site work same-origin. Changing the API URL means rebuilding the image, not editing a config on the server.

### Single-page app, no router

`App.jsx` composes every section in order and owns the two overlays as state: the resume modal (`ResumeView`, mounted on demand) and the AI chat drawer (`Terminal`, always mounted, translated off-canvas). The drawer toggles on `Ctrl+\` and on a `body.chat-open` class that shifts the page with a `margin-right` transition (`src/index.css`).

`Hero` pauses/resumes its background video through `hero-video:pause` / `hero-video:resume` `CustomEvent`s dispatched on `document` from `App.jsx` — the resume modal uses this instead of prop drilling.

### The scroll container is `<body>`, not the window

`src/index.css` sets `html { overflow: hidden }` and `body { height: 100vh; overflow-y: auto }`, so `main.jsx` calls `ScrollTrigger.defaults({ scroller: document.body })`. Consequences to respect:

- Any new ScrollTrigger inherits that scroller — do not pass `scroller: window`.
- `App.jsx` forwards `body` scroll events to `ScrollTrigger.update()` and fires a delayed `ScrollTrigger.refresh()`, working around triggers that miss programmatic `scrollIntoView`.
- GSAP plugins are registered exactly once in `main.jsx`; components import `gsap` and use `gsap.context()` inside `useLayoutEffect`/`useEffect` with a `ctx.revert()` cleanup. Follow that pattern rather than registering plugins locally.

### Content lives in `src/data/`, not in JSX

Every component reads from two modules — edit these to change site content:

- `src/data/skills.js` exports more than skills: `skills`, `resumeSkills`, `about`, `experience`, `education`, `certifications`.
- `src/data/projects.js` exports `projects`, where each entry carries **two parallel representations**: the rich web copy (`description`, `highlights`, `stack`) and the ATS variant (`resumeDescription`, `resumeHighlights`, `resumeStack`). `Projects.jsx` reads the first set, `ResumeView.jsx` the second. Adding a project means filling in both.

### AI chat contract

`api/chat.js` validates with Zod: `messages[]`, each `{ role: 'user' | 'bot', content: string 1–2000 }`. Note the role is `'bot'`, not `'assistant'` — the handler maps it to Gemini's `'model'` and strips leading model turns, since the Gemini history must start with a user message.

`Terminal.jsx` persists the whole array to `localStorage.chatHistory` and migrates a legacy `{ isBot, text }` shape on read. If you change the message schema, update the Zod schema, the migration, **and** `src/components/Terminal.test.jsx`, which asserts the exact serialized request body.

Server-side guards: 10 req/min per IP via Upstash Redis sliding window, `maxOutputTokens: 800`, `temperature: 0.35`, a `MAX_MESSAGES` cap on the submitted array with server-side trimming to the last `FORWARDED_TURNS`, and a CORS allowlist from `ALLOWED_ORIGINS` (comma-separated) falling back to a hardcoded list of production origins plus `localhost:5173`. Upstream failures return a generic 502 — never the Gemini error text.

**The system prompt is generated, not written.** `api/chat.js` imports `src/data/skills.js` and `src/data/projects.js` and builds the prompt at module load, so the assistant always matches what the site renders — adding a project or a job in `src/data/` updates the site, the resume, and the AI together. Two consequences: the data modules must stay importable from Node (no JSX, no browser globals, no imports of their own), and nothing may exclude `src/` from the Vercel function bundle.

### Test environment

`src/test/setup.js` mocks `gsap` and `gsap/ScrollTrigger` wholesale, plus `matchMedia` and `scrollIntoView`. **If a component starts using a GSAP method not in that mock, tests fail with an unhelpful "not a function".** Add the method to the mock object.

## Content and tone rules

`.agents/AGENTS.md` (gitignored, present locally) is the source of truth for what this portfolio may claim. The rules that most often matter:

- Sandeep is an **IT Support Desk Technician** at DSU ITS and a CS sophomore. Do not inflate the title to "Full Stack Developer" or "Cloud Engineer" anywhere in the bio or resume.
- Only shipped, production-grade personal projects. No planned work, no academic group projects.
- Banned AI-fluff vocabulary — *leveraging, seamlessly, fostering, delving, synergizing, tapestry, unlocking, spearheading*. Use direct action verbs (Built, Deployed, Architected, Configured, Engineered) and name concrete tools. The same ban is encoded in the system prompt in `api/chat.js`.
- Skills listed must be ones actually used in those projects; no "learning" labels.

## Resume printing is a hard constraint

`ResumeView.jsx` renders to PDF through `window.print()`, and **must fit exactly one page** while staying ATS-parseable. The `@media print` block at the bottom of `src/index.css` does the heavy lifting: hides everything except `.resume-overlay`, flattens the modal to static flow, and resets all GSAP inline transforms/opacity. Anything added to the resume that causes overflow must be compressed in that print block. Keep links as plain `<a href>` text so parsers read them.

## Project docs conventions

- Architecture decisions: `docs/adr/NNNN-<slug>.md`.
- Specs and issues are local markdown, not GitHub issues: `.scratch/<feature-slug>/spec.md` and `.scratch/<feature-slug>/issues/NN-<slug>.md`, with a `Status:` line near the top. Full conventions in `docs/agents/issue-tracker.md` and `docs/agents/domain.md`.

## Environment variables

Client (must be `VITE_`-prefixed, baked into the bundle — never secret):

- `VITE_API_URL` — absolute URL of the Vercel `/api/chat` endpoint. Omit for same-origin.
- `VITE_FORMSPREE_URL` — contact form endpoint.

Server-only, set in Vercel (needed locally only when running the function):

- `GEMINI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ALLOWED_ORIGINS`.

## Local gotchas

- The repo lives in a OneDrive-synced path with spaces. `vite.config.js` excludes `public/**/*.{mp4,webm,mov,avi}` from the file watcher because OneDrive locks syncing media and crashes the dev server with `EBUSY`. Keep new large media out of the watcher.
- `src/components/CustomCursor.jsx` and `src/components/DQASimulator.jsx` are not imported anywhere — they are unmounted leftovers, not part of the render tree.
