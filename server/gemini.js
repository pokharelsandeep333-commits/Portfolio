import { systemPrompt } from './facts.js';
import { untilAborted } from './abort.js';

const models = ['gemini-4-hydrogen', 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite'];
const retryableStatuses = new Set([404, 408, 429, 500, 502, 503, 504]);

export async function generateReply(client, messages, signal, reserve) {
  const input = messages.map(({ role, content }) => ({
    type: role === 'user' ? 'user_input' : 'model_output',
    content: [{ type: 'text', text: content }],
  }));
  for (const model of models) {
    signal.throwIfAborted();
    const retryAfter = await untilAborted(signal, reserve);
    if (retryAfter) return { retryAfter };
    signal.throwIfAborted();
    const started = Date.now();
    const deadline = new AbortController();
    const timer = setTimeout(() => deadline.abort(new Error('Attempt timed out')), 10_000);
    const attempt = AbortSignal.any([signal, deadline.signal]);
    try {
      const result = await untilAborted(attempt, () => client.interactions.create({
        model, input, system_instruction: systemPrompt, store: false,
        automatic_continuation: false,
        generation_config: { max_output_tokens: 800 },
      }, { signal: attempt, timeout_ms: 10_000, retries: { strategy: 'none' } }));
      if (!result.output_text?.trim()) throw new Error('Empty model response');
      if (model !== models[0]) console.info('Gemini fallback answered', { model, ms: Date.now() - started });
      return { response: result.output_text };
    } catch (error) {
      signal.throwIfAborted();
      const status = error.statusCode ?? error.status;
      const transient = attempt.aborted || retryableStatuses.has(status)
        || error.name === 'APIConnectionError' || error.name === 'ConnectionError';
      console.warn('Gemini request failed', { model, ms: Date.now() - started, status: attempt.aborted ? 'timeout' : status ?? error.name });
      if (!transient || model === models.at(-1)) throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}
