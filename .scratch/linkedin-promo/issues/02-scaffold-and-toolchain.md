Status: resolved
Blocked by: 01

# 02 — Scaffold the HyperFrames project, verify the toolchain, lock the brief

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Create (by CLI): `promo/hyperframes.json`, `promo/package.json`, `promo/index.html`, and other scaffold files
- Create: `promo/BRIEF.md`

**Interfaces:**
- Consumes: Task 01's ignore rules; `promo/` must not exist or must be empty.
- Produces:
  - `promo/` is a HyperFrames project root. In later tasks, `.` means `promo/` for every `npx hyperframes` command, so run them with `promo/` as the working directory.
  - `MEDIA_DIR=C:/Users/DSU/.claude/skills/media-use` and `SKILL_DIR=C:/Users/DSU/.claude/skills/product-launch-video` are used by Tasks 05–10.

- [ ] **Step 1: Check the CLI's prerequisites**

```bash
node --version            # needs >= 22 (have 24.16.0)
where ffmpeg ffprobe      # PowerShell: Get-Command ffmpeg, ffprobe
```

When this plan was written, FFmpeg was **not on PATH**. If it is still missing, stop and ask Sandeep to install it. Suggested command, for Sandeep to run:

```powershell
winget install --id Gyan.FFmpeg -e
```

Then Sandeep opens a new shell. Do not install system software without an explicit yes from Sandeep.

- [ ] **Step 2: Refresh the workflow skills (ask first)**

The workflow asks for confirmation before this runs, because it rewrites `~/.claude/skills`:

```bash
npx hyperframes skills update product-launch-video
```

Expected: exit 0 (a no-op when current). If it fails, surface stderr and stop. Do not continue from stale skill text.

- [ ] **Step 3: Scaffold**

```bash
npx hyperframes init "promo" --non-interactive --example=blank --skill=product-launch-video
```

Expected: `promo/hyperframes.json` and `promo/package.json` exist. `promo/package.json` pins `hyperframes@<version>`. Record that version in the task's Comments.

- [ ] **Step 4: Doctor**

```bash
cd promo && npx hyperframes doctor --json > ../.scratch/linkedin-promo/doctor.json; node -e "const d=require('../.scratch/linkedin-promo/doctor.json'); console.log('ok=',d.ok); if(!d.ok){console.log(JSON.stringify(d,null,2)); process.exit(1)}"
```

Expected: `ok= true`. `doctor --json` always exits 0, so gate on the payload. If Chrome is missing: `npx hyperframes browser ensure`.

- [ ] **Step 5: Write the failing format probe**

Set the scaffold's root to the promo canvas. In `promo/index.html`, change the root element's `data-width` to `1080` and `data-height` to `1350`, and the `<meta name="viewport">` content to `width=1080, height=1350`. Then:

```bash
cd promo && npx hyperframes snapshot --at 0.5
```

Before the edit, the snapshot shows the scaffold's default canvas. After it, the snapshot must be 1080×1350. Check it:

```bash
node -e "const b=require('fs').readFileSync(process.argv[1]); console.log(b.readUInt32BE(16)+'x'+b.readUInt32BE(20))" "$(ls -t promo/snapshots/*.png | head -1)"
```

Expected: `1080x1350`. If snapshots are JPEG only, run `ffprobe -v error -show_entries stream=width,height -of csv=p=0 <file>` instead.

- [ ] **Step 6: Run the check on the probe**

```bash
cd promo && npx hyperframes check
```

Expected: exit 0. If a finding says 1080×1350 is unsupported, stop and report. The spec's 4:5 decision needs Sandeep's call. The workflow's own options are 1080×1080 and 1080×1920.

- [ ] **Step 7: Show the sign-in status (user gate)**

```bash
cd promo && npx hyperframes auth status; echo "exit=$?"
```

Relay the output **verbatim** to Sandeep. Exit 1 means signed out, which is normal and not an error. BGM comes from HeyGen's music library, so ask Sandeep to choose one:
- (a) sign in (Sandeep does this, not the agent), then say "go"
- (b) continue offline: SFX from the bundled library, and Sandeep supplies a licensed music file to adopt in Task 07

Never authenticate on Sandeep's behalf.

- [ ] **Step 8: Write `promo/BRIEF.md`**

```markdown
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
```

- [ ] **Step 9: Record the preference-backed fields**

```bash
MEDIA_DIR="C:/Users/DSU/.claude/skills/media-use"
node "$MEDIA_DIR/scripts/prefs.mjs" --help
```

Use the syntax the help prints to record exactly these keys from the brief: `destination`, `aspect`, `language`, `flow`, `storyboard`. The store rejects any other key. Do not guess flags. If `--help` is not supported, read the top of `prefs.mjs` for its usage.

- [ ] **Step 10: Gate**

`hyperframes.json` and `BRIEF.md` exist, doctor is `ok`, the 1080×1350 probe passed `check`, sign-in status was shown, and Sandeep chose sign-in or offline. Record the choice under `## Comments` below.

- [ ] **Step 11: Commit (only after Sandeep confirms)**

```bash
git add promo/hyperframes.json promo/package.json promo/package-lock.json promo/index.html promo/BRIEF.md
git status --short promo   # confirm no media or node_modules are staged
git commit -m "feat(promo): scaffold HyperFrames project and brief"
```

## Comments
- 2026-09-27: hyperframes pinned at 0.8.80. doctor: required checks pass (Chrome, FFmpeg 9.0.2 via winget, Node 24); optional whisper/Kokoro/MusicGen/Docker absent. Music: HeyGen library, Sandeep signs in before Task 07.
