// Records the sha256 of every state capture the frames were measured on.
// Run it only after re-measuring frames 03-05 against a new capture:
//   npm run capture:lock
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const STATES_DIR = fileURLToPath(new URL('../assets/states/', import.meta.url));
export const LOCK_FILE = fileURLToPath(new URL('./capture-lock.json', import.meta.url));

// BLOCKED-chat.md is a failure note, not a capture the frames depend on.
const isCapture = (name) => /\.(png|json)$/i.test(name);

export function hashCaptures(dir = STATES_DIR) {
  const out = {};
  for (const name of readdirSync(dir).filter(isCapture).sort()) {
    out[name] = createHash('sha256').update(readFileSync(dir + name)).digest('hex');
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const files = hashCaptures();
  writeFileSync(LOCK_FILE, JSON.stringify({ note: 'Captures that frames 03-05 were measured on. Regenerate only after re-measuring those frames.', files }, null, 2) + '\n');
  console.log(`capture-lock: ${Object.keys(files).length} file(s) locked`);
}
