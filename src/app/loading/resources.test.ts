import { it, expect, vi } from "vitest";
import { createResourceLoader } from "./resources";
it("deduplicates concurrent loads, retries failures and never marks a failed resource ready", async () => {
  let finish!: (x: void) => void;
  let fail = true;
  const load = vi.fn(() =>
    fail
      ? Promise.reject(new Error("network"))
      : new Promise<void>((r) => (finish = r)),
  );
  const cache = createResourceLoader(load);
  await expect(cache.ensure("GIT")).rejects.toThrow("network");
  expect(cache.ready("GIT")).toBe(false);
  fail = false;
  const a = cache.ensure("GIT"),
    b = cache.ensure("GIT");
  expect(a).toBe(b);
  await Promise.resolve();
  finish();
  await a;
  expect(cache.ready("GIT")).toBe(true);
  await cache.ensure("GIT");
  expect(load).toHaveBeenCalledTimes(2);
});
