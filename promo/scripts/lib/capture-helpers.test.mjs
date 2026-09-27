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

// ---- runChatExchange: the one live request, with every failure made explicit ----
import { runChatExchange } from './capture-helpers.mjs';

function fakePage({ visible = true, response, fail, onClick } = {}) {
  const handlers = {};
  return {
    on(evt, h) { handlers[evt] = h; },
    waitForResponse() { return response ?? new Promise(() => {}); },
    getByRole(_role, { name }) {
      return {
        waitFor: async () => { if (!visible) throw new Error(`locator timeout: ${name}`); },
        click: async () => {
          onClick?.();
          if (fail) handlers.requestfailed?.({ url: () => 'https://x/api/chat', failure: () => ({ errorText: fail }) });
        },
      };
    },
  };
}
const fakeResponse = (status, body) => ({ status: () => status, url: () => 'https://x/api/chat', json: async () => body, request: () => ({ method: () => 'POST' }) });

test('a missing starter button throws an error naming it, with no unhandled rejection', async () => {
  const unhandled = [];
  const onUnhandled = (e) => unhandled.push(e);
  process.on('unhandledRejection', onUnhandled);
  const rejecting = Promise.reject(new Error('Target page, context or browser has been closed'));
  await assert.rejects(
    runChatExchange(fakePage({ visible: false, response: rejecting }), { question: 'What have you built with AWS?' }),
    /starter question "What have you built with AWS\?" not found/,
  );
  await new Promise((r) => setTimeout(r, 20));
  process.off('unhandledRejection', onUnhandled);
  assert.deepEqual(unhandled, []);
});

test('a transport failure is reported as a blocked network verdict', async () => {
  const v = await runChatExchange(fakePage({ fail: 'net::ERR_NAME_NOT_RESOLVED' }), { question: 'Q' });
  assert.equal(v.ok, false);
  assert.match(v.reason, /^network: net::ERR_NAME_NOT_RESOLVED/);
});

test('no response before the timeout is reported as a blocked network verdict', async () => {
  const late = new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout 50ms exceeded')), 10));
  const v = await runChatExchange(fakePage({ response: late }), { question: 'Q', timeout: 50 });
  assert.equal(v.ok, false);
  assert.match(v.reason, /^network: no response within 50 ms/);
});

test('a 200 with a real answer is classified as usable', async () => {
  const v = await runChatExchange(fakePage({ response: Promise.resolve(fakeResponse(200, { response: 'I built SandeepCloud.' })) }), { question: 'Q' });
  assert.equal(v.ok, true);
  assert.equal(v.answer, 'I built SandeepCloud.');
  assert.equal(v.status, 200);
});

test('a 502 body is classified as blocked with its status', async () => {
  const v = await runChatExchange(fakePage({ response: Promise.resolve(fakeResponse(502, { error: 'The assistant is unavailable right now.' })) }), { question: 'Q' });
  assert.equal(v.ok, false);
  assert.match(v.reason, /HTTP 502/);
});
