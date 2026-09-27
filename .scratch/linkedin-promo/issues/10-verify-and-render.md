Status: resolved
Blocked by: 09

# 10 — Verify, get preview approval, mix to −14 LUFS, render, and deliver

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Modify: `promo/index.html` (music and SFX `data-volume`, only if the mix is off target)
- Output (gitignored): `promo/snapshots/contact-sheet.jpg`, `promo/renders/draft.mp4`, `promo/renders/video.mp4`

**Interfaces:**
- Consumes:
  - the assembled project (Task 09)
  - `npm run audit` (Task 03)
  - `npm run loudness` and `gainForTarget` (Task 07)
  - the snapped cuts recorded in Task 09's Comments
- Produces: `promo/renders/video.mp4`, the deliverable, sent to Sandeep.

- [ ] **Step 1: Inject and verify the transitions**

```bash
SKILL_DIR="C:/Users/DSU/.claude/skills/product-launch-video"
cd promo
node "$SKILL_DIR/scripts/transitions.mjs" inject --storyboard ./STORYBOARD.md --hyperframes .
node "$SKILL_DIR/scripts/transitions.mjs" verify --storyboard ./STORYBOARD.md --index ./index.html
```

Expected: both exit 0. Only two non-cut transitions exist: `whip` into frame 3 and `glitch` into frame 6.

- [ ] **Step 2: Final automated gates**

```bash
cd promo && npx hyperframes check && npm run audit && npm test
```

Expected: `check` exits 0 with 0 persistent findings. Also confirm that it reports a non-zero sample count, because a lint error silently disables the layout and contrast audits. The audit and tests exit 0.

- [ ] **Step 3: Snapshots at midpoints and around every cut**

With the snapped cuts `c1…c5` from Task 09 and total `T`, the times are: each frame's midpoint, plus `cN − 0.1` and `cN + 0.2` for every cut, plus `T − 0.5`.

```bash
cd promo && npx hyperframes snapshot --at <comma-separated times>
```

Open `snapshots/contact-sheet.jpg` and the individual frames with the Read tool. For every image, check each point below and write a one-line verdict per frame into `## Comments`:
- Nothing key sits at or below **y = 1188**.
- There is **one callout at most**.
- Text is sharp and nothing is clipped.
- The browser window is at x 48, y 262, w 984, h 655 in frames 2–5, and does not move across the 2→3, 3→4 and 4→5 cuts.
- Frame 4 shows the real answer pixels.
- Frame 6's URL is readable during the final hold.

- [ ] **Step 4: Review the animation map (multi-scene requirement)**

```bash
cd promo && node "C:/Users/DSU/.claude/skills/hyperframes-animation/scripts/animation-map.mjs" --help
```

Run it with the argument form its help prints, and review it for:
- flashes of 3 per second or more in frames 1 and 6
- any exit still running past `duration − 0.4 s`
- punch-ins not landing on beat offsets

Fix only the frame at fault, then re-run Steps 2–3.

- [ ] **Step 5: Preview and approval (user gate)**

```bash
cd promo && npx hyperframes preview --background
```

Confirm the URL returns HTTP 200, then give Sandeep the Studio project URL and the contact sheet. Follow `C:/Users/DSU/.claude/skills/hyperframes/references/review-loop.md` § 4 and ask one question: render now, or what should change? Loop on the requested changes, re-running Steps 2–3 after each one, until Sandeep says render.

- [ ] **Step 6: Draft render and measure the mix**

```bash
cd promo && npx hyperframes render --quality draft --output renders/draft.mp4 && npm run loudness -- renders/draft.mp4
```

If it reports `loudness`:
1. Multiply the music `<audio>`'s `data-volume` by the printed gain multiplier.
2. Set each SFX `<audio>`'s `data-volume` to half the music's new value (−6 dB).
3. Re-render the draft and re-measure.

Repeat until the command exits 0. If it reports `true-peak` with loudness on target, lower the SFX volumes first, since short hits cause the peaks.

- [ ] **Step 7: Delivery render**

```bash
cd promo && npx hyperframes render --help | grep -iE "quality|skill"
cd promo && npx hyperframes render --skill=product-launch-video --quality delivery --output renders/video.mp4
```

The workflow's Step 6 names `--quality high`. Use whichever top-quality value the help lists (`delivery` in the CLI reference). Read the render summary's second line and record the capture mode (`beginframe` or `screenshot`) and the GPU mode in Comments.

- [ ] **Step 8: Verify the file**

```bash
cd promo && test -s renders/video.mp4 && ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate -show_entries format=duration,size -of default=nw=1 renders/video.mp4 && npm run loudness -- renders/video.mp4
```

Expected:
- `codec_name=h264`, `width=1080`, `height=1350`, `r_frame_rate=30/1`
- `duration` between 24 and 26
- loudness exits 0

Any mismatch is a failure: report it and do not deliver.

- [ ] **Step 9: Site gates are still green**

```bash
npm run lint && npm test && npm run build
```

Run from the repo root. Expected: all exit 0.

- [ ] **Step 10: Deliver**

Send `promo/renders/video.mp4` and `promo/snapshots/contact-sheet.jpg` to Sandeep with SendUserFile. Report:
- final duration, file size, and loudness
- the music track and its license
- frame ids `01`–`06`, so revisions can target a single frame

Ask whether to send HyperFrames' post-render feedback report (`npx hyperframes feedback …`). It goes to a public channel, so only send it with Sandeep's yes. Then offer once to freeze the run as a recipe (review-loop § 4).

- [ ] **Step 11: Close out**

Set `Status: resolved` on tickets 01–10 and on `spec.md`. Commit only if Sandeep asks:

```bash
git add promo/index.html promo/compositions promo/STORYBOARD.md .scratch/linkedin-promo
git commit -m "feat(promo): final mix and verified LinkedIn render"
```

## Comments
