Status: resolved

## Problem Statement

The portfolio only reaches people who already open the URL. Recruiters and LinkedIn contacts scroll a feed where a link card gets skipped. There is no short piece of motion content that shows, in the first seconds of autoplay, that Sandeep designed and shipped a working site with real projects, an AI assistant, and a print-ready resume.

## Solution

A ~25-second, 4:5 portrait promo video (1080×1350, 30 fps, H.264 MP4) built with HyperFrames from screenshots of the live site at `https://portfolio.sandeeppokharel.com.np`. It matches the site's identity (near-black, gold `#FFC72C`, Outfit Black + Inter, electric static). The video uses beat-synced royalty-free music and five sound effects, and it works fully muted. Sandeep uploads the rendered MP4 to LinkedIn manually; the video is not embedded in the site.

The HyperFrames project lives in a self-contained `promo/` folder at the repo root and never touches `src/`, the Vite bundle, the root `package.json`, or the Docker image.

## User Stories

1. As a recruiter scrolling LinkedIn with sound off, I want to understand who Sandeep is and what they built from on-screen text alone, so that muted autoplay is enough.
2. As a recruiter, I want to see the real site rather than abstract graphics, so that I trust the work exists.
3. As Sandeep, I want every on-screen claim to match `src/data/` and the AGENTS.md content rules, so that the video never inflates my title or invents work.
4. As Sandeep, I want the screenshots produced by a re-runnable script, so that I can re-render the video after the site changes.
5. As Sandeep, I want the music's source and license recorded, so that I can prove the rights if LinkedIn flags the audio.
6. As Sandeep, I want the promo tooling isolated from the site, so that CI gates, `npm audit`, and the Docker build are unaffected.

## Storyboard

Timings are targets; the final cut points snap to detected beats (see Audio).

| # | Time | Shot | Motion | Callout |
|---|------|------|--------|---------|
| 1 | 0–3s | Cold open: black with static flicker | Gold power line draws in; "Sandeep Pokharel" scramble-decodes; subtitle types in | *IT Support Desk Technician · CS @ Dakota State* |
| 2 | 3–7s | Hero: browser frame rises with the live hero (lightning poster) | Slow 1.0→1.08 push toward the portrait | *Designed and built by me* |
| 3 | 7–13s | Projects: whip transition into the Projects section | Vertical pan down the cards; beat-synced punch-ins on SandeepCloud, ShiftSentry, Private RAG Search Engine | *7 shipped projects* |
| 4 | 13–18s | AI chat: drawer slides in over the page | A real question types in; the real answer fades in line by line | *AI assistant built on the site's own data* |
| 5 | 18–21s | Resume: resume view open | Pull back from a close-up to the full page | *One-page resume, print-ready* |
| 6 | 21–25s | End card: glitch cut to black | Name and URL settle in gold; power line redraws; 1.5 s hold | *portfolio.sandeeppokharel.com.np* |

Callout copy is a draft. It is validated against `src/data/` and the banned-word list before render (see Verification). "7 shipped projects" counts the portfolio itself, matching the 7 entries in `src/data/projects.js`.

## Implementation Decisions

### Layout and safe zones

- Canvas 1080×1350. Callouts and key content stay out of the bottom ~12% (LinkedIn's action strip).
- A persistent browser-window frame (dark, rounded, three dots, URL bar reading `portfolio.sandeeppokharel.com.np`) enters in shot 2 and stays through shot 5, so the site reads as one continuous place.
- Callouts are gold pill tags. Only one is on screen at a time.

### Animation

- One paused GSAP timeline, seek-safe and deterministic per HyperFrames rules. No `Math.random()` at render time and no wall-clock timers; static and glitch noise use a fixed seed.
- Eases: `power3.out` for entrances, `power2.in` for exits, `expo.out` for punch-ins.
- Callout entrance: 0.4 s side slide plus scramble-to-text.
- Shot techniques:
  - Shot 1: registry static texture (search the registry before hand-building), SVG line draw, scramble decode, typewriter.
  - Shot 2: frame rise, slow push.
  - Shot 3: whip pan with motion blur, vertical pan, three punch-ins with a brief gold glow around the card.
  - Shot 4: drawer slide timed to match the site's `--drawer-*` feel, typed question, line-by-line answer.
  - Shot 5: pull-back with a light paper edge.
  - Shot 6: glitch cut with a brief chromatic split, then the lock-up.
- Transition budget: hard cuts on beats everywhere except two signature transitions, a whip (2→3) and a glitch (5→6).
- Flicker safety: static and glitch flashes stay below 3 per second, with no full-frame white flashes.
- Each shot is its own sub-composition under `promo/compositions/`, wired from `promo/index.html`.

### Audio

- **Music:** one royalty-free instrumental resolved through the HyperFrames media library.
  - Style: dark electronic/synth, 120–128 BPM, no vocals.
  - License must permit commercial social posting without attribution. If nothing fits, the fallback is a generated track.
  - Source and license are recorded in `promo/media-ledger.json`.
- **Beat sync:** `hyperframes beats` produces the beat grid. Cut points and the three shot-3 punch-ins snap to it.
- **Fades:** music fades in over 0.5 s and out over 1.5 s across the end-card hold.
- **SFX (five):** zap (shot 1, name lock), whoosh (2→3 whip), soft UI slide/click (shot 4, drawer), glitch burst (5→6), final zap (shot 6, line redraw; slightly louder than the first). SFX sit ~6 dB under music peaks.
- **Loudness:** −14 LUFS integrated, true peak ≤ −1 dBTP.
- **Muted-first rule:** audio carries no information; everything a viewer needs is on screen.

### Capture

- `npx hyperframes capture` writes brand tokens and a full-page plate to `promo/capture/`. A Playwright script, `promo/scripts/capture-states.mjs`, screenshots the interactive states into `promo/assets/states/`. It captures the live site at 1440 px viewport width and 2× device scale, so punch-ins up to ~1.3× stay sharp.
- States captured:
  - hero
  - Projects section in view
  - chat drawer open with one question and its real answer
  - resume view open
- The chat capture sends one real question to the live bot, which costs one Gemini call. If the bot returns an error (a Gemini 503 outage was observed 2026-09-26), stop and ask Sandeep whether to wait, fix the bot first, or cut shot 4 and give its time to shot 3. Never fabricate a bot answer.

### Repo isolation

- Branch: `feat/linkedin-promo`, cut from `origin/main`.
- Layout:
  ```
  promo/                          product-launch-video directory contract
    BRIEF.md  STORYBOARD.md  frame.md
    index.html                    assembled root timeline, sequences the 6 frames
    compositions/frames/          01-cold-open … 06-end-card
    scripts/                      capture-states, audit-copy, measure-loudness (+ lib/ tests)
    .media/manifest.jsonl         music and SFX sources and licenses (tracked)
    capture/  assets/             gitignored: hyperframes capture output, state PNGs, audio
    renders/  snapshots/          gitignored: MP4s, contact sheets
  ```
- HyperFrames is run through its own CLI within `promo/`. No dependencies are added to the root `package.json`.
- One-line edits:
  - `.gitignore`: add `promo/node_modules/`, `promo/assets/`, `promo/capture/`, `promo/snapshots/`, `promo/renders/`, `promo/.hyperframes/`, and `promo/.media/*` except `manifest.jsonl`.
  - `.dockerignore`: add `promo/`, because the Dockerfile's `COPY . .` would otherwise send it to the build context.
  - `eslint.config.js`: add `promo` to `globalIgnores`, so composition JS does not hit CI gate 1.
  - `vite.config.js`: exclude `promo/**` from Vitest (its default glob would collect `promo/**/*.test.mjs`) and from the dev-server watcher (OneDrive `EBUSY` on renders).

## Verification

1. `hyperframes check` passes: layout, timing, and determinism.
2. Snapshot each shot at its midpoint and inspect every frame for sharp text, nothing in the bottom LinkedIn strip, and nothing clipped.
3. Content audit: extract all on-screen strings. Confirm none contain banned vocabulary (*leveraging, seamlessly, fostering, delving, synergizing, tapestry, unlocking, spearheading*). Confirm the title, project count, and project names match `src/data/skills.js` and `src/data/projects.js` exactly.
4. Audio: an ffmpeg loudness analysis reports about −14 LUFS integrated and true peak ≤ −1 dBTP. Cut points line up with the `hyperframes beats` output.
5. Final render: H.264 MP4 at 1080×1350, 30 fps, 24–26 s. Report the file size and duration, then send the file to Sandeep.
6. Site gates still pass after the isolation edits: `npm run lint`, `npm test`, `npm run build`.

## Out of Scope

- Embedding the video on the portfolio site.
- Automated posting to LinkedIn or any other platform.
- A 16:9 or 9:16 variant (possible follow-up).
- Voiceover or captions.
- Fixing the chat bot's Gemini 503 handling (deferred to a separate fix; only relevant here if it blocks the shot 4 capture).

## Further Notes

- The video's content is bound by the same rules as the site (`.agents/AGENTS.md`). The title is IT Support Desk Technician; only shipped projects appear.
- Commits happen only when Sandeep asks.

## Revisions

- 2026-09-27 (planning): The layout now follows the installed `product-launch-video` workflow's directory contract. The state-capture script moved to `promo/scripts/`. The ledger is the workflow's `.media/manifest.jsonl`. The Vitest and watcher exclusions were added. Scene HTML is authored by the workflow's frame workers from `STORYBOARD.md`. Outfit and Inter are pre-bundled by HyperFrames, so no font files are shipped. See `plan.md` § Deviations.
