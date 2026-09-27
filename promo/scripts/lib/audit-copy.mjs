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

// On-screen copy must live in the markup the audit reads. A script that also
// carries the same string as a literal can render its own copy, so fixing the
// audited attribute would no longer change what the video shows.
export function findScriptCopyLiterals(html) {
  const unwrapped = html.replace(/<\/?template[^>]*>/gi, '');
  // Comments cannot render copy, so drop them first. A line comment needs `//` at
  // line start or after whitespace/punctuation, so "https://…" in a string survives.
  const stripComments = (js) => js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[\s;{}(),])\/\/.*$/gm, '$1');
  const scripts = [...unwrapped.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => stripComments(m[1]));
  if (!scripts.length) return [];
  const { document } = parseHTML(unwrapped.replace(/<script\b[\s\S]*?<\/script>/gi, ''));
  const copy = new Set();
  document.querySelectorAll('[data-text]').forEach((el) => copy.add(norm(el.getAttribute('data-text'))));
  document.querySelectorAll('[data-callout]').forEach((el) => copy.add(norm(el.textContent ?? '')));
  const findings = [];
  for (const text of copy) {
    if (text.length < 6) continue;
    const quoted = [`"${text}"`, `'${text}'`, `\`${text}\``];
    if (scripts.some((js) => quoted.some((q) => js.includes(q)))) {
      findings.push({ rule: 'script-literal-copy', text, detail: 'read it from data-text at runtime instead of repeating it in the script' });
    }
  }
  return findings;
}

// Frames 03-05 bake card positions, bubble bands and paper size measured on
// one specific capture. The lock records what they were built against, so a
// re-capture fails loudly until the frames are re-measured and the lock renewed.
export function compareCaptureLock(lock, current) {
  const findings = [];
  for (const [file, hash] of Object.entries(lock)) {
    if (!(file in current)) findings.push({ rule: 'capture-missing', text: file, detail: 'locked capture file is gone' });
    else if (current[file] !== hash) findings.push({ rule: 'capture-changed', text: file, detail: 'differs from the capture the frames were measured on; re-measure frames 03-05, then run npm run capture:lock' });
  }
  for (const file of Object.keys(current)) {
    if (!(file in lock)) findings.push({ rule: 'capture-unlocked', text: file, detail: 'not in capture-lock.json' });
  }
  return findings;
}
