export async function flushMicrotasks(times = 1) {
  for (let i = 0; i < times; i += 1) {
    await Promise.resolve();
  }
}

export function flushTimers(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export async function flushAll() {
  await flushMicrotasks(2);
  await flushTimers(0);
}
