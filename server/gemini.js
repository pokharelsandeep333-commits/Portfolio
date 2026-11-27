import { systemPrompt } from './facts.js';

const models = ['gemini-4-hydrogen', 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite'];
const retryableStatuses = new Set([404, 408, 429, 500, 502, 503, 504]);

export async function generateReply(client, messages, signal, reserve) {
  const input = messages.map(({ role, content }) => ({
    type: role === 'user' ? 'user_input' : 'model_output',
    content: [{ type: 'text', text: content }],
  }));
  for (const model of models) {
    signal.throwIfAborted();
    const retryAfter = await reserve();
    if (retryAfter) return { retryAfter };
    signal.throwIfAborted();
    const attempt = AbortSignal.timeout(12_000);
    try {
      const result = await client.interactions.create({
        model, input, system_instruction: systemPrompt, store: false,
        automatic_continuation: false,
        generation_config: { max_output_tokens: 800 },
      }, { signal: AbortSignal.any([signal, attempt]), retries: { strategy: 'none' } });
      if (!result.output_text?.trim()) throw new Error('Empty model response');
      return { response: result.output_text };
    } catch (error) {
      signal.throwIfAborted();
      const status = error.statusCode ?? error.status;
      const transient = attempt.aborted || retryableStatuses.has(status)
        || error.name === 'APIConnectionError' || error.name === 'ConnectionError';
      console.warn('Gemini request failed', { model, status: status ?? error.name });
      if (!transient || model === models.at(-1)) throw error;
    }
  }
}
