export function parseLoudnorm(stderr) {
  const start = stderr.lastIndexOf('{');
  const end = stderr.lastIndexOf('}');
  if (start === -1 || end < start) throw new Error('no loudnorm JSON block in ffmpeg output');
  const j = JSON.parse(stderr.slice(start, end + 1));
  // ffmpeg prints "-inf" for digital silence; Number("-inf") would be NaN.
  const num = (v) => (String(v).trim() === '-inf' ? -Infinity : Number(v));
  return { inputI: num(j.input_i), inputTp: num(j.input_tp), inputLra: num(j.input_lra) };
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
  if (!Number.isFinite(inputI)) {
    // Silence or an unreadable measurement: every comparison below would be false.
    findings.push({ rule: 'loudness', detail: `no measurable programme loudness (${inputI}); the mix is silent or unreadable` });
  } else if (Math.abs(inputI - targetI) > tolI) {
    findings.push({ rule: 'loudness', detail: `${inputI} LUFS, target ${targetI} ±${tolI}` });
  }
  if (Number.isFinite(inputTp) && inputTp > maxTp) findings.push({ rule: 'true-peak', detail: `${inputTp} dBTP > ${maxTp}` });
  if (duration < minDuration || duration > maxDuration) {
    findings.push({ rule: 'duration', detail: `${duration}s outside ${minDuration}–${maxDuration}s` });
  }
  return findings;
}

export function gainForTarget(measuredI, targetI) {
  return 10 ** ((targetI - measuredI) / 20);
}
