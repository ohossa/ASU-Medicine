import { it, expect, vi, afterEach } from "vitest";
import { renderHook, act, waitFor, cleanup } from "@testing-library/react";
import { useSearchIndex } from "./useSearchIndex";
import { buildSearchEntries, type SearchSource } from "./engine";
const sources = [
  {
    year: 3,
    semester: 1,
    moduleCode: "M",
    moduleName: "Module",
    chapters: [
      {
        id: 1,
        title: "C",
        subjects: [
          {
            id: "s",
            name: "S",
            questions: [
              {
                id: "q",
                type: "mcq",
                text: "New",
                options: ["A", "B"],
                correctIndex: 0,
              },
            ],
          },
        ],
      },
    ],
  },
] as unknown as SearchSource[];
const filters = {},
  flags = new Set<string>();
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("ignores superseded worker replies and terminates index work on scope change", async () => {
  const instances: any[] = [];
  class FakeWorker {
    onmessage: any;
    onerror: any;
    posts: any[] = [];
    terminate = vi.fn();
    constructor() {
      instances.push(this);
    }
    postMessage(m: any) {
      this.posts.push(m);
    }
  }
  vi.stubGlobal("Worker", FakeWorker);
  const { result, rerender } = renderHook(
    ({ query, source }) =>
      useSearchIndex(source, true, query, filters, flags, flags, flags),
    { initialProps: { query: "old", source: sources } },
  );
  const w = instances[0];
  act(() =>
    w.onmessage({
      data: { kind: "index", entries: buildSearchEntries(sources) },
    }),
  );
  await waitFor(() =>
    expect(w.posts.some((m: any) => m.kind === "query")).toBe(true),
  );
  const old = w.posts.at(-1).sequence;
  rerender({ query: "new", source: sources });
  const latest = w.posts.at(-1).sequence;
  expect(latest).toBeGreaterThan(old);
  act(() =>
    w.onmessage({ data: { kind: "query", sequence: old, positions: [0] } }),
  );
  expect(result.current.results).toEqual([]);
  act(() =>
    w.onmessage({ data: { kind: "query", sequence: latest, positions: [0] } }),
  );
  expect(result.current.results).toHaveLength(1);
  rerender({ query: "new", source: [...sources] });
  expect(w.terminate).toHaveBeenCalledOnce();
  act(() =>
    w.onmessage({ data: { kind: "query", sequence: latest, positions: [0] } }),
  );
  expect(result.current.results).toEqual([]);
});
