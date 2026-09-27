// Strings Terminal.jsx renders when a request fails (Terminal.jsx:112-120). A
// 200 carrying one of these is still a failure for the promo.
const UI_ERROR_TEXT = new Set([
  'Error',
  'Network Error',
  'Too many requests. Please slow down and try again in a minute.',
]);

export function classifyChatResponse({ status, body }) {
  if (status !== 200) {
    const msg = body && typeof body === 'object' && body.error ? `: ${body.error}` : '';
    return { ok: false, reason: `HTTP ${status}${msg}` };
  }
  const answer = body && typeof body === 'object' && typeof body.response === 'string' ? body.response.trim() : '';
  if (!answer) return { ok: false, reason: 'HTTP 200 with an empty response' };
  if (UI_ERROR_TEXT.has(answer)) return { ok: false, reason: `HTTP 200 carrying UI error text "${answer}"` };
  return { ok: true, answer };
}

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function pngSize(buf) {
  if (buf.length < 24 || !buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('not a PNG');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// One live chat request, with every failure turned into an explicit verdict.
// The response wait is armed before the click (so a fast reply is not missed)
// and gets a no-op catch, so a failed click cannot leave it as an unhandled
// rejection that would hide the real error.
export async function runChatExchange(page, { question, urlPart = '/api/chat', timeout = 60000 }) {
  const failed = new Promise((resolve) => {
    page.on('requestfailed', (req) => { if (req.url().includes(urlPart)) resolve(req); });
  });
  const responseP = page.waitForResponse(
    (r) => r.url().includes(urlPart) && r.request().method() === 'POST',
    { timeout },
  );
  responseP.catch(() => {});

  const button = page.getByRole('button', { name: question });
  try {
    await button.waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    throw new Error(`capture-states: starter question "${question}" not found. Did the site change?`);
  }
  await button.click();

  const outcome = await Promise.race([
    responseP.then((r) => ({ type: 'response', r }), () => ({ type: 'timeout' })),
    failed.then((req) => ({ type: 'failed', req })),
  ]);
  if (outcome.type === 'failed') {
    return { ok: false, reason: `network: ${outcome.req.failure()?.errorText ?? 'request failed'}`, url: outcome.req.url() };
  }
  if (outcome.type === 'timeout') return { ok: false, reason: `network: no response within ${timeout} ms` };
  const body = await outcome.r.json().catch(() => null);
  return { ...classifyChatResponse({ status: outcome.r.status(), body }), status: outcome.r.status(), url: outcome.r.url() };
}
