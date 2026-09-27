Status: resolved
Blocked by: 08

# 09 — Build the frames (workflow Step 5), assemble, snap cuts to the beat

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Create: `promo/scripts/lib/beat-snap.mjs`
- Test: `promo/scripts/lib/beat-snap.test.mjs`
- Create (by frame workers): `promo/compositions/frames/01-cold-open.html`, `02-hero.html`, `03-projects.html`, `04-chat.html`, `05-resume.html`, `06-end-card.html`
- Create (by script): `promo/index.html` (assembled), `promo/beats/**.json`
- Modify: `promo/STORYBOARD.md` (`status: animated`, and durations after the beat snap)

**Interfaces:**
- Consumes:
  - the enriched `STORYBOARD.md` (Task 08) and `frame.md` (Task 05)
  - `audio_meta.json` (Task 07)
  - the audit markup contract (Task 03)
- Produces:
  - `snapCuts(cuts: number[], beats: number[], opts?: {maxShift=0.35, minGap=2.5}) → number[]`
  - `durationsFromCuts(cuts: number[], total: number) → number[]`
  - `beatsInWindow(beats: number[], start: number, end: number) → number[]` (offsets relative to `start`)
  - an assembled, lint-clean `index.html` whose music `<audio>` carries `data-timeline-role="music"`

- [ ] **Step 1: Write the failing tests** in `promo/scripts/lib/beat-snap.test.mjs`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { snapCuts, durationsFromCuts, beatsInWindow } from './beat-snap.mjs';

// 124 BPM grid: a beat every 0.4839 s, starting at 0.12 s
const beats = Array.from({ length: 60 }, (_, i) => +(0.12 + i * (60 / 124)).toFixed(4));

test('each cut moves to the nearest beat within maxShift', () => {
  const snapped = snapCuts([3, 7, 13, 18, 21], beats);
  snapped.forEach((c, i) => {
    assert.ok(beats.includes(c), `cut ${i} (${c}) is on a beat`);
    assert.ok(Math.abs(c - [3, 7, 13, 18, 21][i]) <= 0.35);
  });
});

test('a cut with no beat inside maxShift stays where it was', () => {
  assert.deepEqual(snapCuts([5], [1, 2, 9], { maxShift: 0.35 }), [5]);
});

test('snapping never makes a frame shorter than minGap', () => {
  // Snapping both would leave 5.7 - 3.3 = 2.4 s; the second cut keeps its authored time.
  assert.deepEqual(snapCuts([3, 6], [3.3, 5.7], { minGap: 2.5, maxShift: 0.35 }), [3.3, 6]);
});

test('durationsFromCuts rebuilds frame lengths including the tail', () => {
  assert.deepEqual(durationsFromCuts([3, 7, 13, 18, 21], 25), [3, 4, 6, 5, 3, 4]);
});

test('beatsInWindow returns offsets relative to the window start', () => {
  assert.deepEqual(beatsInWindow([1, 7.2, 8.1, 13.5], 7, 13), [0.2, 1.1]);
});
```

- [ ] **Step 2: Run and see them fail**

```bash
cd promo && npm test
```

Expected: FAIL with `Cannot find module ... beat-snap.mjs`.

- [ ] **Step 3: Implement** `promo/scripts/lib/beat-snap.mjs`

```js
const round = (n) => Math.round(n * 1000) / 1000;

export function snapCuts(cuts, beats, { maxShift = 0.35, minGap = 2.5 } = {}) {
  const out = [];
  for (const cut of cuts) {
    let best = cut;
    let bestDist = Infinity;
    for (const b of beats) {
      const d = Math.abs(b - cut);
      if (d <= maxShift && d < bestDist) {
        best = b;
        bestDist = d;
      }
    }
    // Authored cuts are >= 3 s apart and a snap moves at most maxShift, so the
    // authored time is always a safe fallback when the snapped one is too close.
    const prev = out.length ? out[out.length - 1] : 0;
    out.push(best - prev >= minGap ? best : cut);
  }
  return out;
}

export function durationsFromCuts(cuts, total) {
  const edges = [0, ...cuts, total];
  return edges.slice(1).map((e, i) => round(e - edges[i]));
}

export function beatsInWindow(beats, start, end) {
  return beats.filter((b) => b >= start && b < end).map((b) => round(b - start));
}
```

- [ ] **Step 4: Run and see them pass**

```bash
cd promo && npm test
```

Expected: all suites pass.

- [ ] **Step 5: Sync durations and fetch the SFX**

```bash
SKILL_DIR="C:/Users/DSU/.claude/skills/product-launch-video"
cd promo
node "$SKILL_DIR/scripts/audio.mjs" sync-durations --audio-meta ./audio_meta.json --storyboard ./STORYBOARD.md
node "$SKILL_DIR/scripts/audio.mjs" fetch-sfx --storyboard ./STORYBOARD.md --hyperframes .
```

Expected: both exit 0, and `audio_meta.json` lists SFX for frames 01, 03, 04, and 06. If `electric-zap` did not resolve (the bundled offline library has no "zap"), change that cue to `glitch-1` in frames 01 and 06, re-run `fetch-sfx`, and note it in Comments.

- [ ] **Step 6: Check the music's opening (workflow Step 5)**

Listen-free check: measure the first 5 s against a later 5 s window:

```bash
cd promo
BGM="$(node -e "const b=require('./audio_meta.json').bgm; console.log(typeof b==='string'?b:(b?.path??b?.file??b?.src??''))")"
test -f "$BGM" || { echo "BGM path not found in audio_meta.json: '$BGM'"; exit 1; }
for ss in 0 20 40; do ffmpeg -hide_banner -ss $ss -t 5 -i "$BGM" -af volumedetect -f null - 2>&1 | grep mean_volume; done
```

If the path lookup fails, read `audio_meta.json`, set `BGM` to the music file it names, and record the field name in Comments.

If the opening's `mean_volume` is more than 6 dB below the loudest later window, trim the music start to that window. Use `data-media-start` on the music clip per `hyperframes-core/references/creator-editing-recipes.md`. Keep the 0.5 s fade-in and 1.5 s fade-out.

- [ ] **Step 7: Build the frame packets**

Read `C:/Users/DSU/.claude/skills/hyperframes/references/subagent-dispatch.md`, then:

```bash
cd promo && node "$SKILL_DIR/scripts/frame-packets.mjs" --project "$(pwd)" --storyboard "$(pwd)/STORYBOARD.md"
ls .hyperframes/frame-packets/
```

Expected: six packets plus `_role.md`.

- [ ] **Step 8: Dispatch one frame worker per frame (all six in one wave)**

Each worker's prompt contains `_role.md` and its one packet (paste them or give their paths), plus this dispatch context, filled in per frame:

```
PROJECT_DIR: <absolute path to promo/>
frame_id: <01..06>
confirmed_sketch: <yes if storyboard.html was confirmed in Task 08, else no>
canvas: 1080x1350
captions: disabled
keep_out_band: y >= 1188 (LinkedIn action strip) — no key content there
copy_contract: callout pills carry data-callout; project names carry data-fact="project";
  the title span carries data-fact="title"; any scrambled/typed text keeps its final string
  in data-text. Copy must match the packet exactly — do not add or reword text.
timing: finish every exit animation by (frame duration - 0.4 s); the frame may be trimmed up
  to 0.35 s when cuts are snapped to the beat.
determinism: seeded PRNG (mulberry32, seed 20260927) for any noise; no Math.random, no clocks,
  no repeat: -1.
frame 04 only: never retype or paraphrase the bot answer; reveal the real pixels of
  assets/states/chat-answer.png.
```

Each worker writes only `compositions/frames/<frame_id>-*.html`. As each one returns:
1. Mark that frame `status: animated` in `STORYBOARD.md`.
2. Run `npx hyperframes lint`.
3. Run `npm run audit`.

Fix only the frame that failed.

- [ ] **Step 9: Assemble**

```bash
cd promo && node "$SKILL_DIR/scripts/assemble-index.mjs" --storyboard ./STORYBOARD.md --hyperframes .
grep -n 'data-timeline-role="music"' index.html || echo "MUSIC NOT TAGGED"
```

If the music `<audio>` is not tagged, add `data-timeline-role="music"` to it. It must also keep its `id`, because an id-less audio is silently dropped.

- [ ] **Step 10: Beat grid and snap**

```bash
cd promo && npx hyperframes beats . --json
```

The command writes `beats/<audio-relative-path>.json`. Snap against it:

```bash
cd promo && node -e "
const j=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
const raw=Array.isArray(j)?j:(j.beats??j.data?.beats);
if(!Array.isArray(raw)) throw new Error('unknown beats shape, keys: '+Object.keys(j).join(','));
const beats=raw.map(b=>typeof b==='number'?b:(b.time??b.t??b.seconds));
if(beats.some(b=>typeof b!=='number')) throw new Error('beat entries without a time field');
import('./scripts/lib/beat-snap.mjs').then(m=>{
  const cuts=m.snapCuts([3,7,13,18,21], beats); console.log('cuts', cuts);
  console.log('durations', m.durationsFromCuts(cuts, 25));
  console.log('frame 3 beats', m.beatsInWindow(beats, cuts[1], cuts[2]));})" "$(ls beats/**/*.json beats/*.json 2>/dev/null | head -1)"
```

If it throws `unknown beats shape`, open the JSON, find the array of beat times, and adjust the `raw` line to point at it. Record the shape in Comments.

1. Write the new durations into `STORYBOARD.md` (frames 1–6).
2. In `compositions/frames/03-projects.html`, move the three punch-in tween positions onto the first three `frame 3 beats` offsets at or after 1.0 s (after the whip lands).
3. Re-run `assemble-index.mjs`.

- [ ] **Step 10b: Place the fades**

Apply the music's 0.5 s fade-in and 1.5 s fade-out as a `data-automation` volume lane on the music clip, copying the form in `hyperframes-core/references/creator-editing-recipes.md`. Do not use a timeline volume tween: it is ignored when a lane exists.

- [ ] **Step 11: Gate**

```bash
cd promo && npx hyperframes lint && npm run audit && npm test
```

Expected: all exit 0. All six frames are `status: animated`, and `index.html` exists.

- [ ] **Step 12: Commit (only after Sandeep confirms)**

```bash
git add promo/scripts/lib/beat-snap.mjs promo/scripts/lib/beat-snap.test.mjs promo/compositions promo/index.html promo/STORYBOARD.md promo/audio_meta.json promo/beats
git commit -m "feat(promo): build and assemble the six frames on the beat grid"
```

## Comments
