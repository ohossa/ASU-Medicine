import {
  buildSearchEntries,
  searchEntries,
  type SearchSource,
  type SearchFilters,
} from "./engine";
let entries: ReturnType<typeof buildSearchEntries> = [];
self.onmessage = (event: MessageEvent) => {
  const m = event.data;
  try {
    if (m.kind === "index") {
      entries = buildSearchEntries(m.sources as SearchSource[]);
      self.postMessage({ kind: "index", entries });
    } else if (m.kind === "query") {
      const results = searchEntries(
        entries,
        m.query,
        m.filters as SearchFilters,
        new Set<string>(m.flagged),
        new Set<string>(m.missed),
        new Set<string>(m.attempted),
      );
      self.postMessage({
        kind: "query",
        sequence: m.sequence,
        positions: results.map((e) => e.order),
      });
    }
  } catch {
    self.postMessage({ kind: "error" });
  }
};
