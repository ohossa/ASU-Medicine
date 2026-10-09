import { useEffect, useRef, useState } from "react";
import {
  buildSearchEntries,
  searchEntries,
  type SearchSource,
  type SearchEntry,
  type SearchFilters,
} from "./engine";
export function useSearchIndex(
  sources: SearchSource[],
  enabled: boolean,
  query: string,
  filters: SearchFilters,
  flagged: Set<string>,
  missed: Set<string>,
  attempted: Set<string>,
) {
  const [entries, setEntries] = useState<SearchEntry[]>([]),
    [results, setResults] = useState<SearchEntry[]>([]),
    [indexing, setIndexing] = useState(false),
    [searching, setSearching] = useState(false),
    [error, setError] = useState("");
  const worker = useRef<Worker | null>(null),
    sequence = useRef(0),
    currentEntries = useRef(entries);
  currentEntries.current = entries;
  useEffect(() => {
    let live = true;
    sequence.current++;
    setError("");
    setEntries([]);
    setResults([]);
    setIndexing(enabled);
    if (!enabled) return;
    if (typeof Worker === "undefined") {
      setEntries(buildSearchEntries(sources));
      setIndexing(false);
      return;
    }
    let w: Worker;
    try {
      w = new Worker(new URL("./index.worker.ts", import.meta.url), {
        type: "module",
      });
    } catch {
      setError("The search worker could not start. Retry loading.");
      setIndexing(false);
      return;
    }
    worker.current = w;
    w.onmessage = (e) => {
      if (!live) return;
      const m = e.data;
      if (m.kind === "index") {
        setEntries(m.entries);
        setIndexing(false);
      } else if (m.kind === "query" && m.sequence === sequence.current) {
        setResults(
          m.positions
            .map((n: number) => currentEntries.current[n])
            .filter(Boolean),
        );
        setSearching(false);
      } else if (m.kind === "error") {
        setError("The search index could not be prepared. Retry loading.");
        setIndexing(false);
        setSearching(false);
      }
    };
    w.onerror = () => {
      if (live) {
        setError("Search is unavailable. Retry loading.");
        setIndexing(false);
        setSearching(false);
      }
    };
    w.postMessage({ kind: "index", sources });
    return () => {
      live = false;
      worker.current = null;
      w.terminate();
    };
  }, [sources, enabled]);
  useEffect(() => {
    if (!enabled || indexing || !entries.length) return;
    const id = ++sequence.current;
    if (worker.current) {
      setSearching(true);
      worker.current.postMessage({
        kind: "query",
        sequence: id,
        query,
        filters,
        flagged: [...flagged],
        missed: [...missed],
        attempted: [...attempted],
      });
    } else {
      setResults(
        searchEntries(entries, query, filters, flagged, missed, attempted),
      );
      setSearching(false);
    }
  }, [entries, indexing, enabled, query, filters, flagged, missed, attempted]);
  return { entries, results, indexing, searching, error };
}
