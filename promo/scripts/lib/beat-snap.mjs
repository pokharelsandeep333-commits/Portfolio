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
