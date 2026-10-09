/** A failed load remains retryable; readiness is set only after the full registration succeeds. */
export function createResourceLoader(load: (key: string) => Promise<void>) {
  const pending = new Map<string, Promise<void>>(),
    loaded = new Set<string>();
  return {
    ready: (key: string) => loaded.has(key),
    ensure(key: string): Promise<void> {
      if (loaded.has(key)) return Promise.resolve();
      const existing = pending.get(key);
      if (existing) return existing;
      const promise = Promise.resolve()
        .then(() => load(key))
        .then(() => {
          loaded.add(key);
        })
        .finally(() => pending.delete(key));
      pending.set(key, promise);
      return promise;
    },
  };
}
