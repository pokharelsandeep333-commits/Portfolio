Status: resolved
Blocked by: 02

# 03 — Copy audit: hold on-screen text to `src/data/` and AGENTS.md

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Create: `promo/scripts/lib/audit-copy.mjs`
- Test: `promo/scripts/lib/audit-copy.test.mjs`
- Create: `promo/scripts/audit-copy.mjs` (CLI)
- Modify: `promo/package.json` (devDependency `linkedom`; `test` and `audit` scripts)

**Interfaces:**
- Consumes: `src/data/skills.js` → `about.title`; `src/data/projects.js` → `projects[].title`. Both modules are plain ESM with no imports, so Node can import them (CLAUDE.md guarantees this).
- Produces (used by Tasks 06, 09, 10):
  - `auditStrings(items: {text: string, kind: 'text'|'callout'|'project'|'title'}[], facts: {title: string, projectTitles: string[], projectCount: number}) → {rule: string, text: string, detail: string}[]`
  - `extractItems(html: string) → {text, kind}[]`
  - `loadFacts() → Promise<facts>`
  - `npm run audit` (in `promo/`) exits 1 on any finding.
  - **Markup contract for frame workers:** every callout pill carries `data-callout`. A project name shown on screen carries `data-fact="project"`. The title span carries `data-fact="title"`. Text written by a scramble or type effect puts its final string in `data-text` on the element.

- [ ] **Step 1: Install the parser and wire the scripts**

```bash
cd promo && npm install -D -E linkedom && npm pkg set scripts.test="node --test scripts/lib/*.test.mjs" scripts.audit="node scripts/audit-copy.mjs"
```

Expected: `promo/package.json` has an exact `linkedom` version, and `test` and `audit` scripts. The root `package.json` is unchanged (`git diff --quiet package.json` exits 0).

- [ ] **Step 2: Write the failing tests** in `promo/scripts/lib/audit-copy.test.mjs`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { auditStrings, extractItems, loadFacts, MAX_CALLOUT_CHARS } from './audit-copy.mjs';

const facts = {
  title: 'IT Support Desk Technician',
  projectTitles: ['SandeepCloud', 'ShiftSentry', 'Private RAG Search Engine'],
  projectCount: 7,
};
const rules = (items) => auditStrings(items, facts).map((f) => f.rule);

test('clean copy passes', () => {
  assert.deepEqual(rules([
    { text: '7 shipped projects', kind: 'callout' },
    { text: 'IT Support Desk Technician', kind: 'title' },
    { text: 'ShiftSentry', kind: 'project' },
  ]), []);
});

test('banned stems are caught in any casing and inflection', () => {
  assert.deepEqual(rules([{ text: 'Seamlessly deployed to AWS', kind: 'text' }]), ['banned-word']);
  assert.deepEqual(rules([{ text: 'Leveraged Docker', kind: 'callout' }]), ['banned-word']);
  assert.deepEqual(rules([{ text: 'unlocking insights', kind: 'text' }]), ['banned-word']);
});

test('"delivered" is not mistaken for the "delv" stem', () => {
  assert.deepEqual(rules([{ text: 'Delivered on time', kind: 'text' }]), []);
});

test('project count must equal projects.length', () => {
  assert.deepEqual(rules([{ text: '8 shipped projects', kind: 'callout' }]), ['project-count']);
});

test('inflated titles are rejected anywhere', () => {
  assert.deepEqual(rules([{ text: 'Full Stack Developer', kind: 'text' }]), ['inflated-title']);
  assert.deepEqual(rules([{ text: 'Cloud Engineer · DSU', kind: 'text' }]), ['inflated-title']);
});

test('a title-tagged span must match about.title exactly', () => {
  assert.deepEqual(rules([{ text: 'IT Support Technician', kind: 'title' }]), ['title-mismatch']);
});

test('a project-tagged name must be a real project title', () => {
  assert.deepEqual(rules([{ text: 'Sandeep Cloud', kind: 'project' }]), ['unknown-project']);
});

test('callouts longer than the limit are rejected', () => {
  const long = 'x'.repeat(MAX_CALLOUT_CHARS + 1);
  assert.deepEqual(rules([{ text: long, kind: 'callout' }]), ['callout-too-long']);
  assert.deepEqual(rules([{ text: 'x'.repeat(MAX_CALLOUT_CHARS), kind: 'callout' }]), []);
});

test('extractItems reads template-wrapped sub-compositions, data-text, and skips scripts', () => {
  const html = `<!doctype html><html><head><style>.a{}</style></head><body><template>
    <style>#root{color:#fff}</style>
    <div id="root" data-composition-id="f1">
      <span class="pill" data-callout>7 shipped   projects</span>
      <h1 data-text="Sandeep Pokharel">S#nd@@p</h1>
      <span data-fact="title">IT Support Desk Technician</span>
      <b data-fact="project">ShiftSentry</b>
    </div>
    <script>const t = "seamlessly hidden in script";</script>
  </template></body></html>`;
  const items = extractItems(html);
  const has = (text, kind) => items.some((i) => i.text === text && i.kind === kind);
  assert.ok(has('7 shipped projects', 'callout'), 'callout text normalized');
  assert.ok(has('Sandeep Pokharel', 'text'), 'data-text captured');
  assert.ok(has('IT Support Desk Technician', 'title'));
  assert.ok(has('ShiftSentry', 'project'));
  assert.ok(!items.some((i) => /seamlessly/.test(i.text)), 'script text ignored');
});

test('loadFacts reads the live data modules', async () => {
  const f = await loadFacts();
  assert.equal(f.title, 'IT Support Desk Technician');
  assert.equal(f.projectCount, f.projectTitles.length);
  assert.ok(f.projectTitles.includes('ShiftSentry'));
});
```

- [ ] **Step 3: Run them and see them fail**

```bash
cd promo && npm test
```

Expected: FAIL with `Cannot find module ... audit-copy.mjs`.

- [ ] **Step 4: Implement** `promo/scripts/lib/audit-copy.mjs`

```js
import { parseHTML } from 'linkedom';

// Mirrors the banned vocabulary in .agents/AGENTS.md and api/chat.js, as stems
// so inflections (leveraged, seamless, fostered) are caught too.
export const BANNED_STEMS = ['leverag', 'seamless', 'foster', 'delv', 'synergiz', 'tapestr', 'unlock', 'spearhead'];
export const INFLATED_TITLES = [/full[\s-]?stack\s+developer/i, /cloud\s+engineer/i, /software\s+engineer/i, /devops\s+engineer/i];
export const MAX_CALLOUT_CHARS = 42;

const BANNED_RE = new RegExp(`\\b(${BANNED_STEMS.join('|')})`, 'i');
const COUNT_RE = /(\d+)\s+shipped\s+projects?/i;
const norm = (s) => s.replace(/\s+/g, ' ').trim();

export function auditStrings(items, facts) {
  const findings = [];
  const flag = (rule, text, detail) => findings.push({ rule, text, detail });

  for (const { text, kind } of items) {
    if (!text) continue;
    const banned = text.match(BANNED_RE);
    if (banned) flag('banned-word', text, `contains banned stem "${banned[1]}"`);
    if (INFLATED_TITLES.some((re) => re.test(text))) flag('inflated-title', text, `title must be "${facts.title}"`);
    const count = text.match(COUNT_RE);
    if (count && Number(count[1]) !== facts.projectCount) {
      flag('project-count', text, `src/data/projects.js has ${facts.projectCount}`);
    }
    if (kind === 'callout' && text.length > MAX_CALLOUT_CHARS) {
      flag('callout-too-long', text, `${text.length} > ${MAX_CALLOUT_CHARS} chars`);
    }
    if (kind === 'title' && text !== facts.title) flag('title-mismatch', text, `expected "${facts.title}"`);
    if (kind === 'project' && !facts.projectTitles.includes(text)) {
      flag('unknown-project', text, 'not a title in src/data/projects.js');
    }
  }
  return findings;
}

export function extractItems(html) {
  // Sub-compositions wrap everything in <template>; unwrap so the parser sees it as DOM.
  const unwrapped = html.replace(/<\/?template[^>]*>/gi, '');
  const { document } = parseHTML(unwrapped);
  document.querySelectorAll('script, style').forEach((el) => el.remove());

  const items = [];
  const textOf = (el) => norm(el.getAttribute('data-text') ?? el.textContent ?? '');
  document.querySelectorAll('[data-callout]').forEach((el) => items.push({ text: textOf(el), kind: 'callout' }));
  document.querySelectorAll('[data-fact="project"]').forEach((el) => items.push({ text: textOf(el), kind: 'project' }));
  document.querySelectorAll('[data-fact="title"]').forEach((el) => items.push({ text: textOf(el), kind: 'title' }));
  document.querySelectorAll('[data-text]').forEach((el) => items.push({ text: norm(el.getAttribute('data-text')), kind: 'text' }));
  const body = norm(document.body?.textContent ?? '');
  if (body) items.push({ text: body, kind: 'text' });
  return items;
}

export async function loadFacts() {
  const { about } = await import(new URL('../../../src/data/skills.js', import.meta.url).href);
  const { projects } = await import(new URL('../../../src/data/projects.js', import.meta.url).href);
  const projectTitles = projects.map((p) => p.title);
  return { title: about.title, projectTitles, projectCount: projectTitles.length };
}
```

- [ ] **Step 5: Run the tests and see them pass**

```bash
cd promo && npm test
```

Expected: all 10 tests pass.

- [ ] **Step 6: Write the CLI** `promo/scripts/audit-copy.mjs`

```js
import { readFileSync, globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { auditStrings, extractItems, loadFacts } from './lib/audit-copy.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = ['index.html', ...globSync('compositions/**/*.html', { cwd: root })];
const facts = await loadFacts();

let checked = 0;
let failed = 0;
for (const file of files) {
  const items = extractItems(readFileSync(new URL(`../${file.replaceAll('\\', '/')}`, import.meta.url), 'utf8'));
  checked += items.length;
  for (const f of auditStrings(items, facts)) {
    failed++;
    console.error(`${file}: ${f.rule} — "${f.text.slice(0, 80)}" (${f.detail})`);
  }
}
console.log(`audit-copy: ${files.length} file(s), ${checked} string(s), ${failed} finding(s)`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 7: Run the CLI on the scaffold**

```bash
cd promo && npm run audit
```

Expected: `audit-copy: 1 file(s), N string(s), 0 finding(s)`, exit 0.

- [ ] **Step 8: Root gates are still unaffected**

```bash
npm test && npm run lint
```

Expected: exit 0, with the same test count as before. Vitest must not list `promo/scripts/lib/audit-copy.test.mjs`.

- [ ] **Step 9: Commit (only after Sandeep confirms)**

```bash
git add promo/package.json promo/package-lock.json promo/scripts/lib/audit-copy.mjs promo/scripts/lib/audit-copy.test.mjs promo/scripts/audit-copy.mjs
git commit -m "feat(promo): add copy audit against src/data and banned vocabulary"
```
