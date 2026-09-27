# LinkedIn Portfolio Promo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Each task lives in its own file under `issues/` (repo convention: one file per ticket, `Status:` line at the top).

**Goal:** Produce a ~25 s, 1080×1350 H.264 MP4 promo of the live portfolio site, built with HyperFrames in an isolated `promo/` project, ready for Sandeep to upload to LinkedIn.

**Architecture:** `promo/` is a HyperFrames project driven by the installed `product-launch-video` workflow (show-it-as-is brief). That workflow owns capture, design system, storyboard, audio, frame building, and render. This plan adds only what the workflow does not have:
- repo isolation
- a Playwright script that captures the site's interactive states (chat drawer with a real answer, resume view)
- a content-audit script that holds on-screen copy to `src/data/`
- a loudness gate

Scene HTML is authored by the workflow's frame workers from the `STORYBOARD.md` this plan specifies in full. It is not hand-written in this plan.

**Tech Stack:**
- HyperFrames CLI (`npx hyperframes`, pinned by `init` in `promo/package.json`) and GSAP
- `playwright-core` driving the system Chrome (`channel: 'chrome'`)
- `linkedom`
- Node 24 `node:test` (run with a glob: `node --test scripts/lib/*.test.mjs`; a bare directory argument does not expand on Node 24)
- FFmpeg

**Spec:** `.scratch/linkedin-promo/spec.md` (read it alongside this plan; the storyboard, audio, and verification numbers come from there).

## Global Constraints

- Canvas **1080×1350**, **30 fps**, final duration **24–26 s**, H.264 MP4.
- Palette:
  - canvas `#050e1f` (`--clr-bg`)
  - surface `#0a1628`
  - gold `#FFC72C`
  - text `#e8edf5`
  - muted `#8899b4`
- Fonts:
  - Outfit 800 for display (the site loads Outfit up to 800; do not use 900)
  - Inter 400/500 for body
  - Both are in HyperFrames' pre-bundled font set, so no font files or `@font-face` are needed.
- Safe zone: no callout or key content below **y = 1188 px** (bottom 12%).
- Only one callout on screen at a time. Callout text is ≤ **42 characters**.
- Motion:
  - Eases are `power3.out` for entrances, `power2.in` for exits, `expo.out` for punch-ins.
  - Two signature transitions only: whip (frame 2→3) and glitch (frame 5→6).
  - Static and glitch flashes stay below **3 per second**, with no full-frame white flash.
- Determinism: one paused GSAP timeline per composition, no `Math.random` (use a seeded PRNG), no clocks, no `repeat: -1`.
- Audio:
  - Music is dark electronic/synth, 120–128 BPM, no vocals, fading in over 0.5 s and out over 1.5 s.
  - Five SFX, each about 6 dB under the music peaks.
  - Mix target: **−14 LUFS ±1** integrated, true peak **≤ −1 dBTP**.
  - Audio carries no information.
- Copy rules (`.agents/AGENTS.md`):
  - The title is exactly `IT Support Desk Technician`.
  - Only shipped projects appear, and the project count equals `projects.length` in `src/data/projects.js` (7).
  - Banned stems: *leverag, seamless, foster, delv, synergiz, tapestr, unlock, spearhead*.
- The chat answer in frame 4 must come from a real `200` response from the live bot. It is never fabricated.
- Repo isolation:
  - No changes to the root `package.json` or `package-lock.json`.
  - `promo/` is ignored by ESLint, Vitest, the Vite watcher, and the Docker build context.
  - Captures, audio, fonts, node_modules, snapshots, and renders are gitignored.
- **Commit only when Sandeep asks.** Commit steps below are written out but must be confirmed first.
- Authentication (HeyGen sign-in) and installing system software (FFmpeg) are Sandeep's to do. The agent asks and waits.

## Review Focus

1. **The live bot returns an error body** (503 → "The assistant is unavailable…", 429, 400, network failure). Capture must stop with a `BLOCKED-chat.md` and never screenshot an error bubble as if it were an answer. Pinned by `classifyChatResponse` tests in Task 04.
2. **A site redeploy changes selectors** (`#projects`, `#nav-resume-link`, starter-question text). Capture must fail loudly, naming the missing selector, rather than save a wrong state. Pinned by the PNG-size gate and `requireVisible` in Task 04.
3. **Copy drifts from `src/data/`** (a new project makes it 8; a banned stem appears in a workflow-generated caption, such as "seamlessly"; the title is inflated). The audit must fail. Pinned by `auditStrings` tests in Task 03, run again as a gate in Task 10.
4. **Callout overflow or text in LinkedIn's bottom strip at 1080 px width.** Pinned by the 42-character rule (Task 03 tests) and the y ≤ 1188 snapshot inspection (Task 10).
5. **The music track is too short, has a quiet intro, or the mix misses −14 LUFS.** Pinned by `assessMix`/`gainForTarget` tests (Task 07) and the loudness gate (Task 10).

---

## File Map

| Path | Responsibility | Task |
|---|---|---|
| `.gitignore`, `.dockerignore`, `eslint.config.js`, `vite.config.js` | Keep `promo/` out of git bloat, the Docker context, lint, Vitest, and the watcher | 01 |
| `promo/` (scaffold: `hyperframes.json`, `package.json`, `index.html`) | HyperFrames project root, created by `init` | 02 |
| `promo/BRIEF.md` | Locked brief; workflow routing token | 02 |
| `promo/scripts/lib/audit-copy.mjs` (+ `.test.mjs`) | Pure copy rules against `src/data/` | 03 |
| `promo/scripts/audit-copy.mjs` | CLI: extract on-screen text from compositions, run the rules | 03 |
| `promo/scripts/lib/capture-helpers.mjs` (+ `.test.mjs`) | `classifyChatResponse`, `pngSize` | 04 |
| `promo/scripts/capture-states.mjs` | Playwright capture of hero, projects, chat, resume | 04 |
| `promo/capture/` | `hyperframes capture` output (brand tokens, full-page plate) | 04 |
| `promo/frame.md` | Design system on the site's tokens | 05 |
| `promo/STORYBOARD.md` | Frame-by-frame plan (full content in Task 06) | 06 |
| `promo/scripts/lib/loudness.mjs` (+ `.test.mjs`), `promo/scripts/measure-loudness.mjs` | Loudness parse, assess, and gain | 07 |
| `promo/audio_meta.json`, `promo/.media/manifest.jsonl` | Workflow audio metadata and media provenance | 07 |
| `promo/storyboard.html` | Sketch sheet for layout review | 08 |
| `promo/compositions/frames/01-…06-*.html`, `promo/index.html` | Frames built by workflow workers, assembled index | 09 |
| `promo/renders/video.mp4` | Deliverable | 10 |

## Tasks

| # | File | Deliverable | User gate |
|---|---|---|---|
| 01 | [issues/01-repo-isolation.md](issues/01-repo-isolation.md) | `promo/` isolated; site gates green | none |
| 02 | [issues/02-scaffold-and-toolchain.md](issues/02-scaffold-and-toolchain.md) | Project scaffolded, BRIEF written, doctor green, 1080×1350 probe passes `check` | FFmpeg install; HeyGen sign-in or offline |
| 03 | [issues/03-copy-audit.md](issues/03-copy-audit.md) | `audit-copy` rules with passing tests | none |
| 04 | [issues/04-capture.md](issues/04-capture.md) | Brand capture plus 7 state PNGs plus the real chat answer | stop if the bot errors |
| 05 | [issues/05-design-system.md](issues/05-design-system.md) | `frame.md` on site tokens, fonts local | none |
| 06 | [issues/06-storyboard.md](issues/06-storyboard.md) | `STORYBOARD.md` approved | plan approval |
| 07 | [issues/07-audio.md](issues/07-audio.md) | BGM, SFX, beats, and loudness tooling | licensing is visible to Sandeep |
| 08 | [issues/08-visual-design.md](issues/08-visual-design.md) | Sketch sheet confirmed; shot sequences written; assets staged | sketch approval |
| 09 | [issues/09-build-frames.md](issues/09-build-frames.md) | 6 frames animated; `index.html` assembled; cuts on beats | none |
| 10 | [issues/10-verify-and-render.md](issues/10-verify-and-render.md) | All gates pass; preview approved; MP4 delivered | preview approval |

Order is strict: 01 → 10. Task 03 does not depend on 02's toolchain and can run any time after 02 creates `promo/`.

## Deviations from the spec (recorded back into spec.md)

- **Layout follows the `product-launch-video` directory contract.** Frames live at `promo/compositions/frames/NN-*.html`. HyperFrames' own capture goes to `promo/capture/`. The state-capture script lives at `promo/scripts/capture-states.mjs` and writes to `promo/assets/states/`. The spec's `media-ledger.json` is the workflow's `.media/manifest.jsonl`.
- **Vitest and the Vite watcher also need `promo/` excluded.** Vitest's default glob would collect `promo/**/*.test.mjs`, and the watcher would hit OneDrive `EBUSY` on renders. The spec listed only ESLint, git, and Docker.
- **Scene HTML is produced by the workflow's frame workers from `STORYBOARD.md`.** It is not hand-written. `/hyperframes` forbids reconstructing a workflow from memory.
