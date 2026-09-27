---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Sandeep Pokharel designs, builds, and ships real software — this site is the proof."
destination: linkedin-feed
aspect: 1080x1350
language: en
audience: recruiters and hiring managers on LinkedIn
length: 25s
angle: show-it-as-is site tour
---

## Intent

A ~25 s show-it-as-is tour of https://portfolio.sandeeppokharel.com.np for the LinkedIn feed. It is
built to be understood muted: every fact is on screen. Tone matches the site: near-black, gold
#FFC72C, electric static, confident and quick, never gimmicky.

## Assets

- assets/states/hero.png — live hero at 1440×900 @2x; frame 2 base.
- assets/states/projects-view.png — Projects section in view @2x; frame 3 opening plate.
- assets/states/projects-full.png — the whole Projects section @2x; frame 3 vertical pan and punch-ins.
- assets/states/chat-empty.png — chat drawer open with starter questions; frame 4 start state.
- assets/states/chat-answer.png — chat drawer with the real question and answer; frame 4 end state.
- assets/states/chat-answer.json — the real answer text and HTTP status; provenance for frame 4.
- assets/states/resume-view.png — resume modal in viewport; frame 5 close-up start.
- assets/states/resume-paper.png — the full one-page resume @2x; frame 5 pull-back.

## Customizations

- Feature the site's own captured screens as the video's assets (show it as is; never rebuild the site in HTML).
- Persistent browser-window frame (URL bar reads portfolio.sandeeppokharel.com.np) from frame 2 through frame 5.
- Beat-synced cuts and three beat-synced punch-ins in frame 3 (SandeepCloud, ShiftSentry, Private RAG Search Engine).
- Five SFX: zap (name lock), whoosh (2→3 whip), soft UI slide (drawer), glitch burst (5→6), final zap (line redraw).
- Loudness −14 LUFS integrated, true peak ≤ −1 dBTP.

## Notes

- Title must read exactly "IT Support Desk Technician". Never "Full Stack Developer", "Cloud Engineer", or similar.
- Banned words anywhere on screen: leveraging, seamlessly, fostering, delving, synergizing, tapestry, unlocking, spearheading.
- The frame 4 answer must be the real bot output captured in assets/states/chat-answer.json. Never write or paraphrase a bot answer.
- No captions and no voiceover. `SCRIPT.md` must not exist.
- Keep all key content above y = 1188 (LinkedIn's bottom action strip).
- Static and glitch flashes < 3/s; no full-frame white flashes.
