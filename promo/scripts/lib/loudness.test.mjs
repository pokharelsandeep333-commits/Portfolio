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

test('a silent or unreadable render (-inf / NaN) is a loudness finding, not a pass', () => {
  assert.deepEqual(assessMix({ inputI: NaN, inputTp: NaN, duration: 25 }).map((f) => f.rule), ['loudness']);
  assert.deepEqual(assessMix({ inputI: -Infinity, inputTp: -Infinity, duration: 25 }).map((f) => f.rule), ['loudness']);
});

test('parseLoudnorm maps "-inf" to -Infinity rather than NaN', () => {
  const r = parseLoudnorm('{\n "input_i" : "-inf",\n "input_tp" : "-inf",\n "input_lra" : "0.00"\n}');
  assert.equal(r.inputI, -Infinity);
  assert.equal(r.inputTp, -Infinity);
});
