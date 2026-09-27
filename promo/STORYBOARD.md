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

## Locked

- 2026-09-27: Sandeep confirmed storyboard.html v1. Layouts locked as sketched, including frame 4's enlarged chat pop-out (drawer crop CSS x 1120–1440, y 180–740, shown ~1.6×) and frame 5's resume paper standing out of the window. Frames build by dressing these layouts (storyboard.html#frame-NN), never redrawing them.

## Video direction

- **Palette (frame.md, by role):** ground `cream` #050E1F on every frame; panels and the browser window `cream-muted` #0A1628; text `ink-black` #E8EDF5, secondary `cream-hint` #8899B4; `fire-orange` #FFC72C (the site's gold) is the one accent: callout pills, the power line, glows, the "Pokharel" surname. Never a full-frame gold or white ground.
- **Type (frame.md, by role):** display ramp Outfit 800 title case (names, pills, project tags); body Inter 400/500 (subtitle, URL). No lowercase headings.
- **Canvas and seams (numeric, shared by every worker):** 1080x1350. Key content above y 1188 (LinkedIn action strip; spec-binding, captions off). Browser window, identical in frames 2-5: x 48, y 262, w 984, h 655, radius 18, fill #0A1628, 1 px border rgba(255,255,255,0.08), shadow 0 30px 80px rgba(0,0,0,0.55); chrome bar 40 px with three 10 px dots (#ff5f57, #febc2e, #28c840) and a URL pill "portfolio.sandeeppokharel.com.np" in Inter 500 18 px #8899B4; content viewport x 48, y 302, w 984, h 615 (the 1440x900 captures scaled 0.6833, cover from top-left, overflow hidden). Callout slot: one gold pill centred on x 540, box y 162-218 (Outfit 800 26 px, #050E1F text); one callout at a time. Locked layouts: storyboard.html#frame-01 ... #frame-06; dress them, never redraw.
- **Motion grammar:** long-tail eases: power3.out entrances, power2.in exits, expo.out punch-ins; camera moves animate an inner wrapper, never a timed .clip. Callouts enter with `scramble-reveal` (a slide from the left, text resolving left to right) and exit by fading. Seeded PRNG (mulberry32, seed 20260927) for all noise and glitch; static and glitch flashes stay under 3 per second, never a full-frame white. The film is silent-safe: reveals are cued to the music's beat grid (Task 09 snaps cuts and frame 3's punch-ins), not to a voiceover.
- **Rhythm and held frames:** 01 hook (fast), 02 settle, 03 the busiest frame (pan plus three punch-ins), 04 slows so the answer can be read, 05 short, **06 is the held frame** (a 1.5 s still read of the URL). Frame 04's last second is a second, shorter held read.
- **Negative list:** no fake UI (every screen is a real capture); no retyped or paraphrased bot answer; no stock or decorative shapes standing in for the site; no purple/blue "AI" gradients or bokeh; no cursor. Both failure modes are banned: the slideshow (a frame dumps everything then freezes) and the screensaver (elements drifting with no reason).

## Frame 1 — Cold open

- scene: Black with seeded static flicker; the gold power line draws in and the name decodes
- voiceover: ""
- duration: 3s
- poster: 2.6s
- transition_in: cut
- status: animated
- src: compositions/frames/01-cold-open.html
- type: hook
- persuasion: Pattern interrupt: an electric flicker in a feed of static photos
- beat: curiosity
- blueprint: titlecard-reveal (Adapt)
- asset_candidates: none — typographic open; the static texture comes from a registry block chosen in Task 08
- sfx: glitch-1
- copy: name "Sandeep Pokharel" (data-text); subtitle "IT Support Desk Technician · CS @ Dakota State", where "IT Support Desk Technician" is its own span with data-fact="title"
- focal: typographic lock-up (name + title); registry `grain-overlay` for the static, `svg-stroke-trace` for the power line, `scramble-reveal` for the name
- roles: none (typographic frame); grain-overlay = background (dim ~20%)

A vertical gold (#FFC72C) line draws from center, static flickers at < 3 flashes/s, then "Sandeep
Pokharel" scramble-decodes in Outfit 800 and locks on a beat (zap). The subtitle types in beneath
it in Inter 500, muted (#8899b4) except the title.

narrativeRole: stop the scroll and name the person.
keyMessage: a real person with a real job title.

Adapt: keep the title-card signature (one name locking up as the frame's single display moment); the reveal is a scramble-decode instead of a fade, and a vertical gold power line replaces the underline.
Scene 1 (0.0-0.8s): ground with seeded static (grain-overlay, under 3 flashes/s); the gold power line self-draws top to bottom at the left third -> `svg-path-draw`. Rule-of-thirds, the line is the left edge anchor.
Scene 2 (0.8-2.0s): "Sandeep" then "Pokharel" (gold) scramble-decode beside the line and lock on a beat; the zap lands on the lock -> `hacker-flip-3d`. Name about 55% of frame width, the dominant element.
Scene 3 (2.0-3.0s): the subtitle types in under the name, the title span in ink and the rest in cream-hint -> `discrete-text-sequence`; then hold still.

## Frame 2 — The site

- scene: A dark browser window rises into frame showing the live hero; slow push toward the portrait
- voiceover: ""
- duration: 4.2s
- poster: 2.5s
- transition_in: cut
- status: animated
- src: compositions/frames/02-hero.html
- type: product_intro
- persuasion: Show-don't-tell proof
- beat: intrigue
- blueprint: device-surface-showcase (Adapt)
- asset_candidates: assets/states/hero.png — live hero at 1440×900 @2x: name, tagline, lightning portrait, gold CTA buttons
- copy: callout "Designed and built by me" (data-callout)
- focal: assets/states/hero.png
- roles: hero.png = cutout (the only screen in the window); window = supporting
- handoff_out: browser window: x 48, y 262, w 984, h 655, scale 1, opacity 1, static (no motion at the cut)

Browser chrome: rounded dark window (#0a1628), three dots, URL bar reading
portfolio.sandeeppokharel.com.np. It rises with power3.out and stays for frames 2–5. The screenshot
inside pushes 1.0 → 1.08 toward the portrait. One gold pill callout slides in with a scramble.

narrativeRole: prove the site exists and is Sandeep's own work.
keyMessage: Sandeep made this.

Adapt: keep the device-surface signature (a real screen presented inside device chrome, then a slow push); the device is registry `browser-device-stage` fitted to the Video direction geometry, not a phone.
Scene 1 (0.0-1.0s): the browser window rises from below into its fixed slot with the live hero already inside -> `multi-phase-camera` (entrance only). Centered, window about 45% of the canvas.
Scene 2 (1.0-3.2s): inside the window the hero pushes slowly toward the portrait -> `coordinate-target-zoom`; at 1.2s the callout "Designed and built by me" slides in with a scramble.
Scene 3 (3.2-4.0s): the push has settled; the window is still and exactly at its handoff state for the cut.

## Frame 3 — The projects

- scene: Whip into the Projects section; pan down the cards; three beat-synced punch-ins
- voiceover: ""
- duration: 6s
- poster: 3s
- transition_in: cut
- status: animated
- src: compositions/frames/03-projects.html
- type: feature_showcase
- persuasion: Rule of three, backed by a count
- beat: confidence
- blueprint: spatial-pan-stations (Adapt)
- asset_candidates: assets/states/hero.png — last state of frame 2, whips out at the open; assets/states/projects-full.png — the whole Projects section @2x with all seven cards; assets/states/projects-view.png — Projects in viewport, opening plate
- sfx: whoosh-short
- copy: callout "7 shipped projects" (data-callout); punch-in labels "SandeepCloud", "ShiftSentry", "Private RAG Search Engine", each with data-fact="project"
- focal: assets/states/projects-full.png
- roles: projects-full.png = cutout (the world the camera pans); projects-view.png = supporting (first station); hero.png = supporting (whips out at the open)
- handoff_in: browser window: x 48, y 262, w 984, h 655, scale 1, opacity 1, static (no motion at the cut)
- handoff_out: browser window: x 48, y 262, w 984, h 655, scale 1, opacity 1, static (no motion at the cut)
- beat_sync: true

The browser window does not move at the cut. Inside its content viewport, the hero whips out to the left
(0.35 s, motion blur) as projects-view whips in from the right; the whip lands on projects-view, then the viewport pans down projects-full. On three consecutive
beats the camera punches in (expo.out, ≤ 1.3× so the 2× capture stays sharp) on the SandeepCloud,
ShiftSentry, and Private RAG Search Engine cards. Each card gets a brief gold glow and its name label.
The count callout holds across the pan.

narrativeRole: breadth of shipped work.
keyMessage: seven real, shipped projects.

Adapt: keep the station-to-station pan signature; the stations are three project cards on one tall capture, and the travel is vertical inside the fixed window.
Scene 1 (0.0-0.5s): inside the window only, the hero whips out left as projects-view whips in from the right, motion-blurred: registry `whip-pan-cut`, scoped to the content viewport; the window itself does not move.
Scene 2 (0.5-1.2s): the callout "7 shipped projects" scrambles in; the view settles on the Projects heading.
Scene 3 (1.2-5.2s): the camera pans down projects-full and punches in (at most 1.3x) on three beats: SandeepCloud, ShiftSentry, Private RAG Search Engine. Each station gets a gold glow on the card and a gold name tag (Outfit 800, data-fact="project") -> `viewport-change` + `coordinate-target-zoom`.
Scene 4 (5.2-6.0s): the camera eases back to 1.0x framing the third card, still; window at its handoff state.

## Frame 4 — The AI assistant

- scene: The chat drawer slides in over the page; the real question and the real answer reveal
- voiceover: ""
- duration: 4.8s
- poster: 4s
- transition_in: cut
- status: animated
- src: compositions/frames/04-chat.html
- type: feature_showcase
- persuasion: Show-don't-tell proof (a live system answering)
- beat: intrigue + trust
- blueprint: prompt-type-submit-generate (Adapt)
- asset_candidates: assets/states/chat-empty.png — drawer open with starter questions; assets/states/chat-answer.png — drawer with the real question and answer; assets/states/chat-answer.json — the verbatim answer text and HTTP 200 provenance
- sfx: click-soft
- copy: callout "AI assistant built on the site's own data" (data-callout)
- focal: assets/states/chat-answer.png
- roles: chat-answer.png = cutout (the real exchange, shown enlarged in the pop-out); chat-empty.png = supporting (the drawer before the question); projects-view.png = background (behind the drawer, dims about 55% during the pop-out); chat-answer.json = provenance only, never re-typed
- handoff_in: browser window: x 48, y 262, w 984, h 655, scale 1, opacity 1, static (no motion at the cut)
- handoff_out: browser window: x 48, y 262, w 984, h 655, scale 1, opacity 1, static (no motion at the cut)

The drawer slides in from the right using the site's own open feel (a quick ease-out, ~0.5 s).
Starting from chat-empty, the question bubble appears as a typed reveal. The answer then reveals
line by line with a top-to-bottom mask over the **real chat-answer.png pixels**. Never retype or
rewrite the answer; if the answer is shown as live text, it must be byte-identical to
chat-answer.json.

narrativeRole: the differentiator: a working AI feature.
keyMessage: the site talks back, grounded in Sandeep's own data.

Adapt: keep the prompt, submit, generate signature, but every pixel is the real capture: the "typing" and "generating" are mask reveals over chat-answer.png, never new text.
Scene 1 (0.0-0.6s): projects-view fills the window; the drawer region of chat-empty (right 22.2%) slides in from the right edge of the content viewport -> `viewport-change`.
Scene 2 (0.6-1.4s): the drawer lifts out of the window into the locked pop-out panel (about 1.6x; crop CSS x 1120-1440, y 180-740 of the capture) while the window dims -> `card-morph-anchor`; the callout "AI assistant built on the site's own data" scrambles in.
Scene 3 (1.4-2.2s): inside the panel, the gold question bubble reveals left to right (the typed look), a mask over real pixels.
Scene 4 (2.2-4.0s): the answer reveals top to bottom in four steps, one per bullet group, crossfading from chat-empty inside the panel only.
Scene 5 (4.0-4.6s): held read of the full answer, still.
Scene 6 (4.6-5.0s): the panel settles back into the drawer slot and the dim lifts; window at its handoff state.

## Frame 5 — The resume

- scene: The resume view opens; the camera pulls back from a close-up to the full page
- voiceover: ""
- duration: 3s
- poster: 2.0s
- transition_in: cut
- status: animated
- src: compositions/frames/05-resume.html
- type: benefit_highlight
- persuasion: Friction reduction (everything a recruiter needs, on one page)
- beat: clarity
- blueprint: zoom-out-workspace-reveal (Adapt)
- asset_candidates: assets/states/resume-view.png — resume modal in viewport; assets/states/resume-paper.png — the full one-page resume @2x
- copy: callout "One-page resume, print-ready" (data-callout)
- focal: assets/states/resume-paper.png
- roles: resume-paper.png = cutout (stands out of the window at full height); resume-view.png = background (inside the window, dims then exits)
- handoff_in: browser window: x 48, y 262, w 984, h 655, scale 1, opacity 1, static (no motion at the cut)

Open tight on the resume header, then pull back (power3.out) to the whole paper with a light
paper-edge shadow. The browser frame exits near the end of this frame, and the last 0.3 s is a glitch-out:
seeded RGB split and slice displacement, no white flash.

narrativeRole: the handoff to a recruiter's workflow.
keyMessage: one page, ready to print.

Adapt: keep the zoom-out reveal signature (tight detail, then the whole artifact); the artifact is the one-page paper, which leaves the window instead of shrinking inside it.
Scene 1 (0.0-0.6s): inside the window, resume-view shows the modal; the callout "One-page resume, print-ready" scrambles in.
Scene 2 (0.6-2.1s): open tight on the paper's header, then pull back until the whole page stands out of the window at the locked size; the window dims behind it and drops away -> `multi-phase-camera` (pull-back).
Scene 3 (2.1-2.7s): held read of the full page, still.
Scene 4 (2.7-3.0s): glitch-out: seeded RGB split and slice displacement across the paper, no white flash; registry `chromatic-aberration-wipe`.

## Frame 6 — End card

- scene: A glitch cut to black; name and URL lock up in gold; the power line redraws; hold
- voiceover: ""
- duration: 4s
- poster: 3.5s
- transition_in: cut
- status: animated
- src: compositions/frames/06-end-card.html
- type: cta
- persuasion: Clear next step
- beat: motivation
- blueprint: titlecard-reveal (Reproduce)
- asset_candidates: none — typographic lock-up
- sfx: glitch-2, glitch-1
- copy: name "Sandeep Pokharel"; URL "portfolio.sandeeppokharel.com.np" (data-callout)
- focal: typographic lock-up (name, line, URL); registry `rgb-glitch-text`, `svg-stroke-trace`, `grain-overlay`
- roles: none (typographic frame); grain-overlay = background (dim ~12%)

Opens with the glitch settling: 0.3 s of chromatic split on the lock-up that resolves to clean, no white
flash. The name (Outfit 800) and the URL (Inter 500,
gold) settle in. The gold line redraws under the lock-up with the final, slightly louder zap. Hold
still for the last 1.5 s so the URL can be read.

narrativeRole: tell the viewer where to go.
keyMessage: portfolio.sandeeppokharel.com.np

Reproduce: the lock-up is the single display moment; the URL is the payoff.
Scene 1 (0.0-0.3s): the glitch settles: "Sandeep Pokharel" resolves from a chromatic split to clean -> `rgb-glitch-text`. Centered.
Scene 2 (0.3-1.6s): the gold line self-draws under the name on the final, louder zap -> `svg-path-draw`; the URL fades up in gold beneath it.
Scene 3 (1.6-2.5s): everything settles.
Scene 4 (2.5-4.0s): held frame: 1.5 s of stillness so the URL can be read.
