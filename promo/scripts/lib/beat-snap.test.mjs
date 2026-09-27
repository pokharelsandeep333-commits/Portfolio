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
