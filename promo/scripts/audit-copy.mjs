import { readFileSync, globSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { auditStrings, extractItems, loadFacts, findScriptCopyLiterals, compareCaptureLock } from './lib/audit-copy.mjs';
import { hashCaptures, LOCK_FILE, STATES_DIR } from './capture-lock.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = ['index.html', ...globSync('compositions/**/*.html', { cwd: root })];
const facts = await loadFacts();

let checked = 0;
let failed = 0;
const report = (where, f) => {
  failed++;
  console.error(`${where}: ${f.rule} — "${f.text.slice(0, 80)}" (${f.detail})`);
};

for (const file of files) {
  const html = readFileSync(new URL(`../${file.replaceAll('\\', '/')}`, import.meta.url), 'utf8');
  const items = extractItems(html);
  checked += items.length;
  for (const f of auditStrings(items, facts)) report(file, f);
  for (const f of findScriptCopyLiterals(html)) report(file, f);
}

// The bot's answer is on-screen copy too (frame 04 shows its real pixels).
const answerFile = fileURLToPath(new URL('../assets/states/chat-answer.json', import.meta.url));
if (existsSync(answerFile)) {
  const { answer } = JSON.parse(readFileSync(answerFile, 'utf8'));
  checked++;
  for (const f of auditStrings([{ text: answer, kind: 'text' }], facts)) report('assets/states/chat-answer.json', f);
}

// Frames 03-05 bake geometry measured on one capture; a re-capture must not
// slip through unnoticed.
if (existsSync(STATES_DIR)) {
  if (!existsSync(LOCK_FILE)) {
    report('scripts/capture-lock.json', { rule: 'capture-unlocked', text: 'capture-lock.json', detail: 'missing; run npm run capture:lock once the frames match the captures' });
  } else {
    const lock = JSON.parse(readFileSync(LOCK_FILE, 'utf8')).files;
    for (const f of compareCaptureLock(lock, hashCaptures())) report('assets/states', f);
  }
}

console.log(`audit-copy: ${files.length} file(s), ${checked} string(s), ${failed} finding(s)`);
process.exit(failed ? 1 : 0);
