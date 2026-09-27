Status: resolved
Blocked by: 06, 07

# 08 — Visual design (workflow Step 4): sketches, shot sequences, seams, staged assets

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Create (sketch pass, if Sandeep chose sketches in Task 06): `promo/storyboard.html`
- Modify: `promo/STORYBOARD.md` (add shot sequences, `focal`, `handoff_*`, and a `## Video direction` block; never change story, copy, `asset_candidates`, or `transition_in`)
- Create (by script): `promo/assets/*` (staged)

**Interfaces:**
- Consumes: `STORYBOARD.md` (Task 06), `frame.md` (Task 05), `assets/states/*` (Task 04).
- Produces: the enriched `STORYBOARD.md`, the only input the Task 09 frame workers see besides `frame.md`. The geometry below is the **single source of truth** for the persistent browser window, so parallel workers cannot draw it two different ways.

Read before writing, as workflow Step 4 requires:
- `C:/Users/DSU/.claude/skills/product-launch-video/references/visual-design.md`
- `C:/Users/DSU/.claude/skills/product-launch-video/references/motion-language.md`
- `C:/Users/DSU/.claude/skills/hyperframes-animation/blueprints-index.md`
- `C:/Users/DSU/.claude/skills/hyperframes-animation/rules-index.md`

Motion names must come from those indexes. Do not invent them.

- [ ] **Step 1: Sketch pass (only if Sandeep chose sketches in Task 06)**

Follow `C:/Users/DSU/.claude/skills/hyperframes/references/review-loop.md` § 2 and `hyperframes-creative/references/storyboard-recipe.md` § 3:
1. Wireframe all six frames as cells of `storyboard.html`, using the geometry in Step 3, with labeled blocks standing in for the screenshots.
2. Mark each frame `status: built`.
3. Ask the one layout question.
4. Revise only the frames Sandeep names until the sheet is confirmed.

Record the confirmation in `## Comments`.

- [ ] **Step 2: Search the registry before designing any named look**

Run each of these queries and read the top results. Record under `## Comments` the block chosen for each, or "none fits, hand-author".

```bash
cd promo
npx hyperframes catalog --query "analog tv static noise flicker overlay" --json
npx hyperframes catalog --query "text scramble decode reveal" --json
npx hyperframes catalog --query "whip pan transition with motion blur" --json
npx hyperframes catalog --query "glitch transition chromatic aberration rgb split" --json
npx hyperframes catalog --query "browser window frame mockup with url bar" --json
npx hyperframes catalog --query "animated line draw stroke" --json
```

A chosen block becomes that frame's `focal:` in Step 4. A candidate is only acceptable if it can run seeded and deterministic, and its flashes can be held under 3 per second with no full-frame white. Reject any candidate that cannot meet those.

- [ ] **Step 3: Write the shared geometry and `## Video direction` block**

Append this block to `STORYBOARD.md`, after the frontmatter and before Frame 1:

```markdown
## Video direction

- Canvas 1080×1350 on #050e1f. All key content stays above y = 1188 (LinkedIn action strip).
- Browser window (frames 2–5, identical in every frame): outer box x 48, y 262, w 984, h 655,
  radius 18, fill #0a1628, 1px border rgba(255,255,255,0.08), shadow 0 30px 80px rgba(0,0,0,0.55).
  Chrome bar 40 px tall: three 10 px dots (#ff5f57, #febc2e, #28c840) at x 68/88/108, and the URL pill
  "portfolio.sandeeppokharel.com.np" in Inter 500 18 px, #8899b4. Content viewport x 48, y 302,
  w 984, h 615 (1440×900 scaled by 0.6833); screenshots are drawn into it with object-fit: cover
  from the top-left, overflow hidden.
- Callout pill: a single slot centered at y 190 (above the window), height 56, padding 0 26 px,
  radius 999, fill #FFC72C, text #050e1f, Outfit 800 26 px, letter-spacing 0.01em. Enter: 0.4 s
  x from −40 to 0 with the text scramble, power3.out. Exit: 0.25 s opacity to 0, power2.in.
  Only one callout visible at any instant.
- Eases: power3.out entrances, power2.in exits, expo.out punch-ins. Camera moves animate an inner
  wrapper, never the timed .clip.
- Punch-ins: at most 1.3× inside the content viewport, anchored on the target card's center.
- Static and glitch: seeded PRNG (mulberry32, seed 20260927), < 3 flashes per second, no frame
  brighter than 60% luminance across the full canvas.
- Seams: frames 2→3, 3→4 and 4→5 keep the window fixed (see handoffs); only the content inside
  changes. The window exits in frame 5 (0.35 s, y +40, opacity 0, power2.in).
```

- [ ] **Step 4: Enrich each frame block**

Edit in place. Under each frame's existing bullets, add:
- `focal:` (the Step 2 block or the named asset)
- the time-coded shot sequence per `visual-design.md` (Scenes with start–end seconds, layout, and motion rule names)
- the handoffs below, verbatim

State every field, even constant ones.

Frame 2 (`handoff_out`) and Frame 3 (`handoff_in`):
```
- handoff_out: browser window — x 48, y 262, w 984, h 655, scale 1, opacity 1, static (no motion at the cut)
```
```
- handoff_in: browser window — x 48, y 262, w 984, h 655, scale 1, opacity 1, static (no motion at the cut)
```

Use the same pair for Frame 3→4 and Frame 4→5.

Frame 4's shot sequence must encode this mechanism (it is how the drawer "slides in" using only real pixels):
- 0.0–0.5 s: `projects-view.png` fills the content viewport. A second layer shows **only the drawer region** of `chat-empty.png`, which is the right 22.2% of the image (the drawer is 320 px of the 1440 px viewport). Its wrapper translates x from 100% of that region's width to 0, ease-out 0.5 s.
- 0.6–1.6 s: the user-question bubble region of `chat-answer.png` reveals with a left-to-right mask (the typed look).
- 1.8–4.0 s: the answer region of `chat-answer.png` reveals top-to-bottom in 3–4 line steps, crossfading from `chat-empty.png` inside the drawer region only.
- Callout from 0.8 s.

Frame 3's three punch-ins get `beat_sync: true`. Task 09 snaps them to the beat grid.

- [ ] **Step 5: Stage the named assets**

```bash
SKILL_DIR="C:/Users/DSU/.claude/skills/product-launch-video"
cd promo && node "$SKILL_DIR/scripts/stage-assets.mjs" --storyboard ./STORYBOARD.md --hyperframes .
```

Expected: exit 0, and every `assets/states/*.png` named in `asset_candidates` exists under `assets/`.

- [ ] **Step 6: Gate**

```bash
cd promo && node -e "
const s=require('fs').readFileSync('STORYBOARD.md','utf8');
const ok=/## Video direction/.test(s) && (s.match(/^- handoff_out:/gm)||[]).length===3 && (s.match(/^- handoff_in:/gm)||[]).length===3 && (s.match(/^- focal:/gm)||[]).length===6;
console.log(ok?'VISUAL-DESIGN-OK':'INCOMPLETE'); process.exit(ok?0:1)"
```

Expected: `VISUAL-DESIGN-OK`. In the collaborative flow, the sketch sheet must also have been confirmed.

- [ ] **Step 7: Commit (only after Sandeep confirms)**

```bash
git add promo/STORYBOARD.md promo/storyboard.html
git commit -m "feat(promo): visual design, seams and shot sequences"
```

## Comments
- 2026-09-27: sketches locked (v1). Registry picks: grain-overlay, scramble-reveal, whip-pan-cut, chromatic-aberration-wipe, rgb-glitch-text, browser-device-stage, svg-stroke-trace.
