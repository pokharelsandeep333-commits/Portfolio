Status: resolved
Blocked by: 03, 05

# 06 — Storyboard (workflow Step 3) and plan approval

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Create: `promo/STORYBOARD.md`
- `SCRIPT.md` must **not** be created (no narration).

**Interfaces:**
- Consumes:
  - `BRIEF.md` (Task 02)
  - `capture/extracted/asset-descriptions.md` (Task 04), the canonical inventory
  - `assets/states/*` (Task 04)
  - the audit's markup contract (Task 03)
- Produces: `STORYBOARD.md`, parsed by `@hyperframes/core/storyboard`. Frame ids `01`…`06` and `src` paths `compositions/frames/01-cold-open.html` … `06-end-card.html` are fixed from here on. Tasks 07–10 refer to them.

Before writing, read the workflow's required references, as its Step 3 demands:
- `C:/Users/DSU/.claude/skills/hyperframes-creative/references/story-spine.md`
- `C:/Users/DSU/.claude/skills/product-launch-video/references/story-design.md`
- `C:/Users/DSU/.claude/skills/hyperframes-animation/blueprints-index.md`
- `C:/Users/DSU/.claude/skills/hyperframes/references/storyboard-format.md`

If one of them requires a field that is missing below, add it. Do not change the beats, copy, durations, or assets.

- [ ] **Step 1: Write the failing check**

```bash
cd promo && node -e "
const fs=require('fs'); if(!fs.existsSync('STORYBOARD.md')){console.log('NO STORYBOARD');process.exit(1)}
const s=fs.readFileSync('STORYBOARD.md','utf8'); const frames=(s.match(/^## Frame \d+/gm)||[]).length;
const assets=(s.match(/^- asset_candidates:/gm)||[]).length; const total=[...s.matchAll(/^- duration: (\d+(?:\.\d+)?)s/gm)].reduce((a,m)=>a+Number(m[1]),0);
console.log({frames,assets,total, script: fs.existsSync('SCRIPT.md')}); process.exit(frames===6&&assets===6&&total>=24&&total<=26&&!fs.existsSync('SCRIPT.md')?0:1)"
```

Expected: `NO STORYBOARD`, exit 1.

- [ ] **Step 2: Write `promo/STORYBOARD.md`**

```markdown
---
format: 1080x1350
duration: 25s
message: "Sandeep Pokharel designs, builds, and ships real software — this site is the proof."
arc: Hook → Proof (the site) → Proof (the projects) → Proof (the AI) → Proof (the resume) → CTA
audience: recruiters and hiring managers on LinkedIn
mode: collaborative
music: dark electronic synth pulse, 120–128 BPM, driving and confident, no vocals
---

<!-- Copy contract for every frame (the audit in scripts/audit-copy.mjs enforces it):
     callout pills carry data-callout; project names carry data-fact="project";
     the title span carries data-fact="title"; text drawn by a scramble or type effect
     keeps its final string in data-text. Key content stays above y = 1188. -->

## Frame 1 — Cold open

- scene: Black with seeded static flicker; the gold power line draws in and the name decodes
- voiceover: ""
- duration: 3s
- poster: 2.6s
- transition_in: cut
- status: outline
- src: compositions/frames/01-cold-open.html
- type: hook
- persuasion: Pattern interrupt: an electric flicker in a feed of static photos
- beat: curiosity
- blueprint: titlecard-reveal
- asset_candidates: none — typographic open; the static texture comes from a registry block chosen in Task 08
- sfx: electric-zap
- copy: name "Sandeep Pokharel" (data-text); subtitle "IT Support Desk Technician · CS @ Dakota State", where "IT Support Desk Technician" is its own span with data-fact="title"

A vertical gold (#FFC72C) line draws from center, static flickers at < 3 flashes/s, then "Sandeep
Pokharel" scramble-decodes in Outfit 800 and locks on a beat (zap). The subtitle types in beneath
it in Inter 500, muted (#8899b4) except the title.

narrativeRole: stop the scroll and name the person.
keyMessage: a real person with a real job title.

## Frame 2 — The site

- scene: A dark browser window rises into frame showing the live hero; slow push toward the portrait
- voiceover: ""
- duration: 4s
- poster: 2.5s
- transition_in: cut
- status: outline
- src: compositions/frames/02-hero.html
- type: proof
- persuasion: Show-don't-tell proof
- beat: intrigue
- blueprint: device-surface-showcase
- asset_candidates: assets/states/hero.png — live hero at 1440×900 @2x: name, tagline, lightning portrait, gold CTA buttons
- copy: callout "Designed and built by me" (data-callout)

Browser chrome: rounded dark window (#0a1628), three dots, URL bar reading
portfolio.sandeeppokharel.com.np. It rises with power3.out and stays for frames 2–5. The screenshot
inside pushes 1.0 → 1.08 toward the portrait. One gold pill callout slides in with a scramble.

narrativeRole: prove the site exists and is Sandeep's own work.
keyMessage: Sandeep made this.

## Frame 3 — The projects

- scene: Whip into the Projects section; pan down the cards; three beat-synced punch-ins
- voiceover: ""
- duration: 6s
- poster: 3s
- transition_in: whip
- status: outline
- src: compositions/frames/03-projects.html
- type: proof
- persuasion: Rule of three, backed by a count
- beat: confidence
- blueprint: spatial-pan-stations
- asset_candidates: assets/states/projects-full.png — the whole Projects section @2x with all seven cards; assets/states/projects-view.png — Projects in viewport, opening plate
- sfx: whoosh-short
- copy: callout "7 shipped projects" (data-callout); punch-in labels "SandeepCloud", "ShiftSentry", "Private RAG Search Engine", each with data-fact="project"

The whip lands on projects-view, then the viewport pans down projects-full. On three consecutive
beats the camera punches in (expo.out, ≤ 1.3× so the 2× capture stays sharp) on the SandeepCloud,
ShiftSentry, and Private RAG Search Engine cards. Each card gets a brief gold glow and its name label.
The count callout holds across the pan.

narrativeRole: breadth of shipped work.
keyMessage: seven real, shipped projects.

## Frame 4 — The AI assistant

- scene: The chat drawer slides in over the page; the real question and the real answer reveal
- voiceover: ""
- duration: 5s
- poster: 4s
- transition_in: cut
- status: outline
- src: compositions/frames/04-chat.html
- type: proof
- persuasion: Show-don't-tell proof (a live system answering)
- beat: intrigue + trust
- blueprint: prompt-type-submit-generate
- asset_candidates: assets/states/chat-empty.png — drawer open with starter questions; assets/states/chat-answer.png — drawer with the real question and answer; assets/states/chat-answer.json — the verbatim answer text and HTTP 200 provenance
- sfx: click-soft
- copy: callout "AI assistant built on the site's own data" (data-callout)

The drawer slides in from the right using the site's own open feel (a quick ease-out, ~0.5 s).
Starting from chat-empty, the question bubble appears as a typed reveal. The answer then reveals
line by line with a top-to-bottom mask over the **real chat-answer.png pixels**. Never retype or
rewrite the answer; if the answer is shown as live text, it must be byte-identical to
chat-answer.json.

narrativeRole: the differentiator: a working AI feature.
keyMessage: the site talks back, grounded in Sandeep's own data.

## Frame 5 — The resume

- scene: The resume view opens; the camera pulls back from a close-up to the full page
- voiceover: ""
- duration: 3s
- poster: 2.4s
- transition_in: cut
- status: outline
- src: compositions/frames/05-resume.html
- type: proof
- persuasion: Friction reduction (everything a recruiter needs, on one page)
- beat: clarity
- blueprint: zoom-out-workspace-reveal
- asset_candidates: assets/states/resume-view.png — resume modal in viewport; assets/states/resume-paper.png — the full one-page resume @2x
- copy: callout "One-page resume, print-ready" (data-callout)

Open tight on the resume header, then pull back (power3.out) to the whole paper with a light
paper-edge shadow. The browser frame exits at the end of this frame.

narrativeRole: the handoff to a recruiter's workflow.
keyMessage: one page, ready to print.

## Frame 6 — End card

- scene: A glitch cut to black; name and URL lock up in gold; the power line redraws; hold
- voiceover: ""
- duration: 4s
- poster: 3.5s
- transition_in: glitch
- status: outline
- src: compositions/frames/06-end-card.html
- type: cta
- persuasion: Clear next step
- beat: motivation
- blueprint: titlecard-reveal
- asset_candidates: none — typographic lock-up
- sfx: glitch-2, electric-zap
- copy: name "Sandeep Pokharel"; URL "portfolio.sandeeppokharel.com.np" (data-callout)

A brief chromatic-split glitch with no white flash. The name (Outfit 800) and the URL (Inter 500,
gold) settle in. The gold line redraws under the lock-up with the final, slightly louder zap. Hold
still for the last 1.5 s so the URL can be read.

narrativeRole: tell the viewer where to go.
keyMessage: portfolio.sandeeppokharel.com.np
```

- [ ] **Step 3: Run the Step 1 check again**

Expected: `{ frames: 6, assets: 6, total: 25, script: false }`, exit 0.

- [ ] **Step 4: Audit the planned copy before anyone builds it**

```bash
cd promo && node -e "
import('./scripts/lib/audit-copy.mjs').then(async m=>{
  const items=[['Designed and built by me','callout'],['7 shipped projects','callout'],['AI assistant built on the site\'s own data','callout'],['One-page resume, print-ready','callout'],['portfolio.sandeeppokharel.com.np','callout'],['IT Support Desk Technician','title'],['SandeepCloud','project'],['ShiftSentry','project'],['Private RAG Search Engine','project']].map(([text,kind])=>({text,kind}));
  const f=m.auditStrings(items, await m.loadFacts()); console.log(f.length?f:'planned copy clean'); process.exit(f.length?1:0)})"
```

Expected: `planned copy clean`.

- [ ] **Step 5: Plan-pass review (user gate)**

Read `C:/Users/DSU/.claude/skills/hyperframes/references/review-loop.md` § 1 and follow it. Present the six frames to Sandeep as a proposal, showing each frame's scene, duration, callout, and asset. Ask the two questions:
1. Approve, or what should change?
2. Sketches first (recommended) or skip?

Loop until Sandeep approves. Record the sketch choice in `## Comments`. It decides whether Task 08 runs the sketch pass.

- [ ] **Step 6: Commit (only after Sandeep confirms)**

```bash
git add promo/STORYBOARD.md
git commit -m "feat(promo): storyboard for the 25s LinkedIn promo"
```

## Comments
- 2026-09-27: Sandeep approved as is; sketches first. transition_in all 'cut' (whip/glitch built in-frame); types mapped to the workflow vocabulary.
