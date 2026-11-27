// A transport can keep its promise pending after cancellation. End our wait
// immediately and still pass the same signal to the underlying operation.
export async function untilAborted(signal, operation) {
  signal.throwIfAborted();
  let onAbort;
  const cancelled = new Promise((_, reject) => {
    onAbort = () => reject(signal.reason);
    signal.addEventListener('abort', onAbort, { once: true });
  });
  try {
    return await Promise.race([cancelled, operation()]);
  } finally {
    signal.removeEventListener('abort', onAbort);
  }
}
