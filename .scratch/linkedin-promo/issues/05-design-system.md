Status: resolved
Blocked by: 04

# 05 — Design system: `frame.md` remixed onto the site's tokens

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Modify (gitignored, local only): `promo/capture/extracted/tokens.json`
- Create (by script): `promo/frame.md`, `promo/.hyperframes/caption-skin.html`

**Interfaces:**
- Consumes: `capture/extracted/tokens.json` from Task 04.
- Produces: `promo/frame.md`, the brand truth that every frame worker reads (Task 09). Its palette must resolve to:
  - canvas `#050e1f`
  - surface `#0a1628`
  - ink/text `#e8edf5`
  - muted `#8899b4`
  - accent `#FFC72C`
  - display font `Outfit`, body font `Inter`

Both fonts are in HyperFrames' pre-bundled set (`hyperframes-creative/references/typography.md`), so no `@font-face` or font files are needed. The typography reference lists both as "generic". We keep them deliberately so the video matches the site.

- [ ] **Step 1: Write the failing check**

```bash
cd promo && node -e "
const fs=require('fs'); const f=fs.existsSync('frame.md')?fs.readFileSync('frame.md','utf8'):'';
const need=['#050e1f','#FFC72C','Outfit','Inter']; const miss=need.filter(n=>!f.toLowerCase().includes(n.toLowerCase()));
console.log(miss.length?'MISSING '+miss.join(', '):'FRAME-OK'); process.exit(miss.length?1:0)"
```

Expected: `MISSING #050e1f, #FFC72C, Outfit, Inter` (frame.md does not exist yet).

- [ ] **Step 2: Make sure the brand tokens are complete before the remix**

Read `capture/extracted/tokens.json`. The capture reads computed styles, so the site's CSS variables may or may not appear. Ensure `colors` contains (add any missing, keeping existing entries):

```json
["#050e1f", "#0a1628", "#e8edf5", "#8899b4", "#FFC72C"]
```

Ensure `fonts` contains `"Outfit"` and `"Inter"`. Leave `title` and `description` as captured.

- [ ] **Step 3: Pick the preset and run the remix**

Preset: **`broadside`**. It is the only shipped preset built on a dark ink-black ground with a single hot accent, which is the closest structure to the site's near-black and gold. Every other preset is a cream or pastel ground.

```bash
SKILL_DIR="C:/Users/DSU/.claude/skills/product-launch-video"
cd promo && node "$SKILL_DIR/scripts/build-frame.mjs" --preset broadside --hyperframes .
```

Expected: exit 0. `frame.md` and `.hyperframes/caption-skin.html` exist. Exit 1 means a broken mapping: surface stderr and stop.

- [ ] **Step 4: Re-run the Step 1 check**

Expected: `FRAME-OK`. If the remix assigned roles differently (for example, gold as canvas), hand-correct only the color-role keys in `frame.md` so that canvas → `#050e1f` and accent → `#FFC72C`. Keep all keys and structure. Re-run until it prints `FRAME-OK`.

- [ ] **Step 5: Record the preset preference**

```bash
MEDIA_DIR="C:/Users/DSU/.claude/skills/media-use"
node "$MEDIA_DIR/scripts/prefs.mjs" --help
```

Record `style_preset=broadside` with `--workflow product-launch-video`, using the syntax the help prints. The store refuses `style_preset` without a workflow.

- [ ] **Step 6: Commit (only after Sandeep confirms)**

```bash
git add promo/frame.md
git commit -m "feat(promo): design system on site tokens (broadside preset)"
```
