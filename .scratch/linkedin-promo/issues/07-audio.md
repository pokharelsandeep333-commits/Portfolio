Status: resolved
Blocked by: 06

# 07 — Audio: loudness tooling, music bed, license confirmation

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Create: `promo/scripts/lib/loudness.mjs`
- Test: `promo/scripts/lib/loudness.test.mjs`
- Create: `promo/scripts/measure-loudness.mjs` (CLI)
- Modify: `promo/package.json` (`loudness` script)
- Create (by workflow): `promo/audio_meta.json`, `promo/.media/manifest.jsonl` (tracked), and the BGM file under `.media/` (gitignored)

**Interfaces:**
- Consumes:
  - `STORYBOARD.md`: the `music:` mood and per-frame `sfx:` cues (Task 06)
  - the sign-in choice recorded in Task 02
- Produces:
  - `parseLoudnorm(stderr: string) → {inputI: number, inputTp: number, inputLra: number}`
  - `parseDuration(stderr: string) → number` (seconds)
  - `assessMix({inputI, inputTp, duration}, {targetI=-14, tolI=1, maxTp=-1, minDuration=24, maxDuration=26}) → {rule, detail}[]`
  - `gainForTarget(measuredI: number, targetI: number) → number` (a linear multiplier for `data-volume`)
  - `npm run loudness -- <file>` prints the measurements and exits 1 on any finding (Tasks 09, 10)
  - `audio_meta.json` with a resolved BGM (Task 09 assembles it)

- [ ] **Step 1: Write the failing tests** in `promo/scripts/lib/loudness.test.mjs`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLoudnorm, parseDuration, assessMix, gainForTarget } from './loudness.mjs';

const STDERR = `Input #0, mov,mp4, from 'renders/video.mp4':
  Duration: 00:00:25.03, start: 0.000000, bitrate: 4000 kb/s
[Parsed_loudnorm_0 @ 0000021a] 
{
	"input_i" : "-14.32",
	"input_tp" : "-1.45",
	"input_lra" : "5.10",
	"input_thresh" : "-24.60",
	"output_i" : "-14.01",
	"output_tp" : "-1.00",
	"output_lra" : "4.90",
	"output_thresh" : "-24.30",
	"normalization_type" : "dynamic",
	"target_offset" : "0.01"
}
`;

test('parseLoudnorm reads the input_* block', () => {
  assert.deepEqual(parseLoudnorm(STDERR), { inputI: -14.32, inputTp: -1.45, inputLra: 5.1 });
});

test('parseLoudnorm throws when ffmpeg printed no JSON block', () => {
  assert.throws(() => parseLoudnorm('Invalid data found when processing input'), /no loudnorm/);
});

test('parseDuration reads the container duration', () => {
  assert.equal(parseDuration(STDERR), 25.03);
});

test('a mix on target passes', () => {
  assert.deepEqual(assessMix({ inputI: -14.32, inputTp: -1.45, duration: 25.03 }), []);
});

test('too quiet, too hot, and clipping are each reported', () => {
  assert.deepEqual(assessMix({ inputI: -18, inputTp: -3, duration: 25 }).map((f) => f.rule), ['loudness']);
  assert.deepEqual(assessMix({ inputI: -12.5, inputTp: -3, duration: 25 }).map((f) => f.rule), ['loudness']);
  assert.deepEqual(assessMix({ inputI: -14, inputTp: -0.2, duration: 25 }).map((f) => f.rule), ['true-peak']);
});

test('a duration outside 24–26 s is reported (music ended early or ran long)', () => {
  assert.deepEqual(assessMix({ inputI: -14, inputTp: -2, duration: 21.4 }).map((f) => f.rule), ['duration']);
});

test('gainForTarget converts the dB shortfall to a linear multiplier', () => {
  assert.equal(gainForTarget(-14, -14), 1);
  assert.ok(Math.abs(gainForTarget(-20, -14) - 1.9953) < 1e-3);  // +6 dB
  assert.ok(Math.abs(gainForTarget(-8, -14) - 0.5012) < 1e-3);   // -6 dB
});
```

- [ ] **Step 2: Run and see them fail**

```bash
cd promo && npm test
```

Expected: FAIL with `Cannot find module ... loudness.mjs`. The earlier suites still pass.

- [ ] **Step 3: Implement** `promo/scripts/lib/loudness.mjs`

```js
export function parseLoudnorm(stderr) {
  const start = stderr.lastIndexOf('{');
  const end = stderr.lastIndexOf('}');
  if (start === -1 || end < start) throw new Error('no loudnorm JSON block in ffmpeg output');
  const j = JSON.parse(stderr.slice(start, end + 1));
  return { inputI: Number(j.input_i), inputTp: Number(j.input_tp), inputLra: Number(j.input_lra) };
}

export function parseDuration(stderr) {
  const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) throw new Error('no Duration line in ffmpeg output');
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

export function assessMix(
  { inputI, inputTp, duration },
  { targetI = -14, tolI = 1, maxTp = -1, minDuration = 24, maxDuration = 26 } = {},
) {
  const findings = [];
  if (Math.abs(inputI - targetI) > tolI) {
    findings.push({ rule: 'loudness', detail: `${inputI} LUFS, target ${targetI} ±${tolI}` });
  }
  if (inputTp > maxTp) findings.push({ rule: 'true-peak', detail: `${inputTp} dBTP > ${maxTp}` });
  if (duration < minDuration || duration > maxDuration) {
    findings.push({ rule: 'duration', detail: `${duration}s outside ${minDuration}–${maxDuration}s` });
  }
  return findings;
}

export function gainForTarget(measuredI, targetI) {
  return 10 ** ((targetI - measuredI) / 20);
}
```

- [ ] **Step 4: Run and see them pass**

```bash
cd promo && npm test
```

Expected: all suites pass.

- [ ] **Step 5: Write the CLI** `promo/scripts/measure-loudness.mjs` and wire it up

```js
import { spawnSync } from 'node:child_process';
import { parseLoudnorm, parseDuration, assessMix, gainForTarget } from './lib/loudness.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: npm run loudness -- <media file>');
  process.exit(2);
}
const run = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
if (run.error) {
  console.error(`ffmpeg not runnable: ${run.error.message}`);
  process.exit(2);
}
const { inputI, inputTp, inputLra } = parseLoudnorm(run.stderr);
const duration = parseDuration(run.stderr);
const findings = assessMix({ inputI, inputTp, duration });
console.log(`${file}: ${inputI} LUFS, ${inputTp} dBTP, LRA ${inputLra}, ${duration}s`);
for (const f of findings) console.error(`  ${f.rule}: ${f.detail}`);
if (findings.some((f) => f.rule === 'loudness')) {
  console.error(`  suggested music gain multiplier: ${gainForTarget(inputI, -14).toFixed(3)} (apply to data-volume)`);
}
process.exit(findings.length ? 1 : 0);
```

```bash
cd promo && npm pkg set scripts.loudness="node scripts/measure-loudness.mjs"
```

- [ ] **Step 6: Start the music bed (workflow Step 3.1; branch on the Task 02 sign-in choice)**

First confirm the flags for a no-narration run:

```bash
SKILL_DIR="C:/Users/DSU/.claude/skills/product-launch-video"
cd promo && node "$SKILL_DIR/scripts/audio.mjs" --help
```

- **Signed in:** run the BGM retrieval with no `--script`, since there is no `SCRIPT.md` and no voice. Use the argument form the help prints, expected to be `node "$SKILL_DIR/scripts/audio.mjs" --storyboard ./STORYBOARD.md --hyperframes . --out ./audio_meta.json`. Run it in the background and continue with Step 7 when it finishes.
- **Offline, with Sandeep supplying a licensed track:** ingest the file Sandeep names:

  ```bash
  npx hyperframes media-use resolve --type bgm --from "<path Sandeep gives>" --intent "dark electronic synth pulse 120-128 BPM" --project .
  ```

  Then re-run `audio.mjs` as above so `audio_meta.json` points at it.

Expected: `audio_meta.json` exists with a non-null BGM entry, and `.media/manifest.jsonl` has a `bgm` line.

- [ ] **Step 7: Licensing confirmation (user gate)**

```bash
cd promo && grep '"bgm"' .media/manifest.jsonl
```

Show Sandeep the track's title, source, and license fields exactly as recorded. The spec requires a license that allows commercial social posting with no attribution. If the record does not state that, or Sandeep is not satisfied, re-resolve with a different intent or switch to a track Sandeep supplies. Record the final track id and license in `## Comments`.

- [ ] **Step 8: Check the track itself**

```bash
cd promo
BGM="$(node -e "const b=require('./audio_meta.json').bgm; console.log(typeof b==='string'?b:(b?.path??b?.file??b?.src??''))")"
test -f "$BGM" || { echo "BGM path not found in audio_meta.json: '$BGM'"; exit 1; }
npm run loudness -- "$BGM"
```

If the path lookup fails, read `audio_meta.json`, set `BGM` to the music file it names, and record the field name in Comments.

This measures the source track. Only one finding matters here: the track must be at least 26 s long. Loudness findings are expected and get fixed at the mix in Task 09. If the track is under 26 s, re-resolve. The music must not end before the end card.

- [ ] **Step 9: Commit (only after Sandeep confirms)**

```bash
git add promo/package.json promo/scripts/lib/loudness.mjs promo/scripts/lib/loudness.test.mjs promo/scripts/measure-loudness.mjs promo/.media/manifest.jsonl promo/audio_meta.json
git commit -m "feat(promo): loudness gate and licensed music bed"
```

## Comments
- 2026-09-27: HeyGen track set aside (commercial rights need a paid plan; no id/license recorded). Final: Pixabay 'Dark Synthwave | Black Neon' by TurtleBeats (251690), Pixabay Content License, no attribution; bgm_001.
