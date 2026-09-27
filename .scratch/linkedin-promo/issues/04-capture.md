Status: resolved
Blocked by: 02

# 04 — Capture the live site: brand tokens plus interactive states

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Create: `promo/scripts/lib/capture-helpers.mjs`
- Test: `promo/scripts/lib/capture-helpers.test.mjs`
- Create: `promo/scripts/capture-states.mjs`
- Modify: `promo/package.json` (devDependency `playwright-core`; `capture:states` script)
- Output (gitignored): `promo/capture/**`, `promo/assets/states/*.png`, `promo/assets/states/chat-answer.json`

**Interfaces:**
- Consumes: the live site `https://portfolio.sandeeppokharel.com.np/`. Selectors verified against the source when this plan was written:
  - `#projects` (Projects.jsx:51)
  - `button[aria-label="Toggle AI chat"]` (Navbar.jsx:152)
  - `.chat-drawer.is-open` (Terminal.jsx; index.css:1051)
  - starter button text `What have you built with AWS?` (Terminal.jsx:9)
  - `button[aria-label="Close chat"]`
  - `#nav-resume-link` (Navbar.jsx:140)
  - `#resume-overlay` and `#resume-print-area` (ResumeView.jsx:42, 67)
- Produces (named in BRIEF.md `## Assets`; consumed by Tasks 06, 08, 09):
  - `hero.png`, `projects-view.png`, `projects-full.png`, `chat-empty.png`, `chat-answer.png`, `resume-view.png`, `resume-paper.png`. All are 2× captures of a 1440 px viewport, so every PNG is **2880 px wide**.
  - `chat-answer.json`: `{ question, answer, status, capturedAt, url }`
  - `classifyChatResponse({status: number, body: unknown}) → {ok: true, answer: string} | {ok: false, reason: string}`
  - `pngSize(buf: Buffer) → {width, height}`

- [ ] **Step 1: Brand capture with the workflow's own command**

```bash
cd promo && npx hyperframes capture "https://portfolio.sandeeppokharel.com.np/" -o ./capture --json > ../.scratch/linkedin-promo/capture-result.json; echo "exit=$?"
node -e "const r=require('../.scratch/linkedin-promo/capture-result.json'); console.log('ok=',r.ok,'lastPhase=',r.lastPhase); process.exit(r.ok?0:1)"
test ! -e capture/BLOCKED.md && ls capture/extracted/tokens.json capture/extracted/visible-text.txt capture/extracted/asset-descriptions.md && test -d capture/assets && echo CAPTURE-GATE-OK
```

Expected: `ok= true` and `CAPTURE-GATE-OK`. A non-zero exit, `ok: false`, or a `BLOCKED.md` is a **hard stop**: report `lastPhase` and do not use partial files. Retries go into a fresh directory (`-o ./capture-2`).

This project has a `GEMINI_API_KEY` only in Vercel, not locally, so vision captions will be skipped. That is expected.

- [ ] **Step 2: Install Playwright core (it drives system Chrome and downloads no browser) and add the script**

```bash
cd promo && npm install -D -E playwright-core && npm pkg set scripts.capture:states="node scripts/capture-states.mjs"
```

- [ ] **Step 3: Write the failing tests** in `promo/scripts/lib/capture-helpers.test.mjs`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyChatResponse, pngSize } from './capture-helpers.mjs';

test('a 200 with a non-empty response is a usable answer', () => {
  assert.deepEqual(
    classifyChatResponse({ status: 200, body: { response: '  I built SandeepCloud on AWS.  ' } }),
    { ok: true, answer: 'I built SandeepCloud on AWS.' },
  );
});

test('Gemini outage (502 generic body) is rejected', () => {
  const r = classifyChatResponse({ status: 502, body: { error: 'The assistant is unavailable right now. Please try again in a moment.' } });
  assert.equal(r.ok, false);
  assert.match(r.reason, /502/);
});

test('rate limit, validation error, and server error are rejected', () => {
  for (const [status, error] of [[429, 'Too many requests'], [400, 'Invalid request'], [500, 'Internal Server Error']]) {
    assert.equal(classifyChatResponse({ status, body: { error } }).ok, false, `status ${status}`);
  }
});

test('a 200 with an empty or missing response is rejected', () => {
  assert.equal(classifyChatResponse({ status: 200, body: { response: '   ' } }).ok, false);
  assert.equal(classifyChatResponse({ status: 200, body: {} }).ok, false);
  assert.equal(classifyChatResponse({ status: 200, body: null }).ok, false);
});

test('a 200 whose text is an error string the UI shows is rejected', () => {
  for (const response of ['Error', 'Network Error', 'Too many requests. Please slow down and try again in a minute.']) {
    assert.equal(classifyChatResponse({ status: 200, body: { response } }).ok, false, response);
  }
});

test('pngSize reads IHDR width and height', () => {
  const buf = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(2880, 16);
  buf.writeUInt32BE(1800, 20);
  assert.deepEqual(pngSize(buf), { width: 2880, height: 1800 });
});

test('pngSize rejects a non-PNG', () => {
  assert.throws(() => pngSize(Buffer.from('not a png at all, definitely')), /not a PNG/);
});
```

- [ ] **Step 4: Run and see them fail**

```bash
cd promo && npm test
```

Expected: FAIL with `Cannot find module ... capture-helpers.mjs`. The Task 03 tests still pass.

- [ ] **Step 5: Implement** `promo/scripts/lib/capture-helpers.mjs`

```js
// Strings Terminal.jsx renders when a request fails (Terminal.jsx:112-120). A
// 200 carrying one of these is still a failure for the promo.
const UI_ERROR_TEXT = new Set([
  'Error',
  'Network Error',
  'Too many requests. Please slow down and try again in a minute.',
]);

export function classifyChatResponse({ status, body }) {
  if (status !== 200) {
    const msg = body && typeof body === 'object' && body.error ? `: ${body.error}` : '';
    return { ok: false, reason: `HTTP ${status}${msg}` };
  }
  const answer = body && typeof body === 'object' && typeof body.response === 'string' ? body.response.trim() : '';
  if (!answer) return { ok: false, reason: 'HTTP 200 with an empty response' };
  if (UI_ERROR_TEXT.has(answer)) return { ok: false, reason: `HTTP 200 carrying UI error text "${answer}"` };
  return { ok: true, answer };
}

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function pngSize(buf) {
  if (buf.length < 24 || !buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('not a PNG');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}
```

- [ ] **Step 6: Run and see them pass**

```bash
cd promo && npm test
```

Expected: all tests pass (Task 03 and Task 04).

- [ ] **Step 7: Write the capture script** `promo/scripts/capture-states.mjs`

```js
// Captures the interactive states `hyperframes capture` cannot reach (chat
// drawer with a real answer, resume modal). Re-run after any site change.
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { classifyChatResponse, pngSize } from './lib/capture-helpers.mjs';

const SITE = process.env.PROMO_SITE_URL ?? 'https://portfolio.sandeeppokharel.com.np/';
const QUESTION = 'What have you built with AWS?';
const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 2;
const out = (name) => fileURLToPath(new URL(`../assets/states/${name}`, import.meta.url));

mkdirSync(out(''), { recursive: true });
rmSync(out('BLOCKED-chat.md'), { force: true });

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE, reducedMotion: 'no-preference' });
const page = await context.newPage();

async function requireVisible(selector, what) {
  try {
    await page.locator(selector).first().waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    throw new Error(`capture-states: ${what} not found (selector ${selector}). Did the site change?`);
  }
}

async function shoot(name, locator) {
  const path = out(name);
  if (locator) await locator.screenshot({ path });
  else await page.screenshot({ path });
  const { width, height } = pngSize(readFileSync(path));
  if (width < VIEWPORT.width * SCALE) throw new Error(`${name} is ${width}px wide, expected ${VIEWPORT.width * SCALE}`);
  console.log(`captured ${name} ${width}x${height}`);
}

try {
  // Hero, after the GSAP boot sequence (veil, gold line, copy) settles.
  await page.goto(SITE, { waitUntil: 'load' }); // not networkidle: the hero MP4 keeps streaming
  await requireVisible('#hero', 'hero section');
  await page.waitForTimeout(3500);
  await shoot('hero.png');

  // Projects. body is the scroll container (index.css), so scrollIntoView on the
  // section scrolls body. Cards reveal once (ScrollTrigger once: true).
  await requireVisible('#projects', 'Projects section');
  await page.evaluate(() => document.getElementById('projects').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(2000);
  await shoot('projects-view.png');
  const projectsHeight = await page.evaluate(() => Math.ceil(document.getElementById('projects').getBoundingClientRect().height));
  await page.setViewportSize({ width: VIEWPORT.width, height: projectsHeight });
  await page.evaluate(() => document.getElementById('projects').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(800);
  await shoot('projects-full.png', page.locator('#projects'));
  await page.setViewportSize(VIEWPORT);
  await page.evaluate(() => document.getElementById('projects').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(800);

  // Chat drawer: empty state, then one real exchange with the live bot.
  await page.locator('button[aria-label="Toggle AI chat"]').click();
  await requireVisible('.chat-drawer.is-open', 'open chat drawer');
  await page.waitForTimeout(900);
  await shoot('chat-empty.png');

  const responsePromise = page.waitForResponse((r) => r.url().includes('/api/chat') && r.request().method() === 'POST', { timeout: 60000 });
  await page.getByRole('button', { name: QUESTION }).click();
  const response = await responsePromise;
  const body = await response.json().catch(() => null);
  const verdict = classifyChatResponse({ status: response.status(), body });
  if (!verdict.ok) {
    writeFileSync(out('BLOCKED-chat.md'), `# Chat capture blocked\n\n- when: ${new Date().toISOString()}\n- url: ${response.url()}\n- reason: ${verdict.reason}\n\nDo not fabricate an answer. Ask Sandeep: wait and retry, fix the bot first, or cut frame 4.\n`);
    throw new Error(`capture-states: chat blocked (${verdict.reason}). See assets/states/BLOCKED-chat.md`);
  }
  await page.waitForTimeout(1500); // let the bubble render and scroll into view
  await shoot('chat-answer.png');
  writeFileSync(out('chat-answer.json'), JSON.stringify({
    question: QUESTION, answer: verdict.answer, status: response.status(), capturedAt: new Date().toISOString(), url: SITE,
  }, null, 2));

  // Resume: close chat, open the modal, then the whole paper at a tall viewport.
  await page.locator('button[aria-label="Close chat"]').click();
  await page.waitForTimeout(600);
  await page.locator('#nav-resume-link').click();
  await requireVisible('#resume-overlay', 'resume overlay');
  await page.waitForTimeout(1200);
  await shoot('resume-view.png');
  const paperHeight = await page.evaluate(() => Math.ceil(document.getElementById('resume-print-area').getBoundingClientRect().height));
  await page.setViewportSize({ width: VIEWPORT.width, height: paperHeight + 200 });
  await page.waitForTimeout(800);
  await shoot('resume-paper.png', page.locator('#resume-print-area'));
} finally {
  await browser.close();
}
```

Note: `resume-paper.png` is the width of the paper element, not the viewport. If it is narrower than 2880, change the width check for that one file to `>= 1600` (paper at 2× stays sharp at the 1080-wide canvas). Record the measured width in Comments.

- [ ] **Step 8: Run the capture (this sends one real chat request, which costs one Gemini call)**

```bash
cd promo && npm run capture:states; echo "exit=$?"
```

Expected: seven `captured …` lines, `chat-answer.json` written, exit 0.

If it exits with `chat blocked`, **stop**. Show Sandeep `assets/states/BLOCKED-chat.md` and ask Sandeep to choose:
- wait and re-run
- fix the bot first (the deferred Gemini-503 retry work)
- cut frame 4 and give its 5 s to frame 3

Record the choice in Comments. Do not edit `chat-answer.json` by hand, ever.

- [ ] **Step 9: Inspect the captures**

Open each PNG with the Read tool and confirm:
- the hero shows the name and portrait/lightning
- `projects-full` shows all 7 cards revealed (none at opacity 0)
- `chat-answer` shows the question bubble and a real answer
- `resume-paper` shows the full one-page resume

Also confirm the answer in `chat-answer.json` contains no banned stems:

```bash
cd promo && node -e "import('./scripts/lib/audit-copy.mjs').then(async m=>{const a=JSON.parse(require('fs').readFileSync('assets/states/chat-answer.json','utf8')).answer; const f=m.auditStrings([{text:a,kind:'text'}], await m.loadFacts()); console.log(f.length?f:'answer clean'); process.exit(f.length?1:0)})"
```

If the real answer contains a banned word or an inflated claim, that is a bot bug. Report it to Sandeep rather than cropping or retouching the answer.

- [ ] **Step 10: Commit the scripts only (only after Sandeep confirms). The captures are gitignored.**

```bash
git add promo/package.json promo/package-lock.json promo/scripts/lib/capture-helpers.mjs promo/scripts/lib/capture-helpers.test.mjs promo/scripts/capture-states.mjs
git commit -m "feat(promo): capture live-site states for the promo"
```

## Comments
- 2026-09-27: brand capture ok (warnings: lazy-scroll budget, animation catalog timeout, 1 asset cap-reached). State capture blocked at chat: HTTP 502 'The assistant is unavailable right now…'. Sandeep chose to fix the bot first, then re-run.
- 2026-09-27: captured all 7 states; resume-paper is 1640x2644 (paper 820 CSS px), min width lowered to 1600. Real answer captured 13:49:05Z (HTTP 200). A later run hit 502 again (both models failed).
