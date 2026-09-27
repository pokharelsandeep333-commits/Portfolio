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
if (run.status !== 0) {
  console.error(`ffmpeg failed (exit ${run.status}):
${run.stderr.trim().split('
').slice(-5).join('
')}`);
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
