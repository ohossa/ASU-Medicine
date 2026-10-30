import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/clerk-react";
import type {
  LearningDashboard,
  LearningSubmission,
  LearningProfile,
} from "./contracts";
import { XPAwardBubble } from "./XPAwardBubble";
interface Context {
  data: LearningDashboard | null;
  loading: boolean;
  error: string;
  pending: number;
  period: string;
  setPeriod: (p: string) => void;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  discard: () => void;
  submit: (s: LearningSubmission) => void;
  settings: (patch: Partial<LearningProfile>) => Promise<void>;
}
const LearningContext = createContext<Context | null>(null);
export const queueKey = (id: string) => `asu_learning_pending:${id}`;
interface Pending {
  id: string;
  submission: LearningSubmission;
}
function readQueue(id: string): Pending[] {
  try {
    const data = JSON.parse(localStorage.getItem(queueKey(id)) ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
export function LearningProvider({ children }: { children: ReactNode }) {
  const { userId, getToken, isLoaded } = useAuth();
  const token = useRef(getToken);
  token.current = getToken;
  const activeId = useRef(userId);
  activeId.current = userId;
  const [snapshot, setSnapshot] = useState<{
      id: string;
      data: LearningDashboard;
    } | null>(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [pending, setPending] = useState(0),
    [period, setPeriod] = useState("weekly");
  const [awardNotice,setAwardNotice]=useState<{id:number;account:string;amount:number}|null>(null);
  useEffect(()=>{if(!awardNotice)return;const timeout=setTimeout(()=>setAwardNotice(null),2200);return()=>clearTimeout(timeout);},[awardNotice]);
  const refreshGeneration=useRef(0);
  const busy = useRef(new Set<string>());
  const request = useCallback(
    async <T,>(method = "GET", body?: unknown): Promise<T> => {
      const requestId = activeId.current;
      const t = await token.current();
      if (activeId.current !== requestId) throw new Error("Account changed.");
      if (!t) throw new Error("Sign in to sync your learning.");
      const response = await fetch(
        "/api/learning" + (method === "GET" ? `?period=${period}` : ""),
        {
          method,
          headers: {
            Authorization: `Bearer ${t}`,
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: AbortSignal.timeout(30000),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        const localPreview = import.meta.env.DEV &&
          ["localhost", "127.0.0.1"].includes(window.location.hostname);
        const err = new Error(localPreview && response.status === 503
          ? "Cloud learning is unavailable in this local preview. Your saved activity remains available."
          : result.error ?? "Learning sync failed.");
        (err as any).status = response.status;
        throw err;
      }
      return result;
    },
    [period],
  );
  const cacheKey=(id:string,p:string)=>`asu_learning_snapshot:${id}:${p}`;
  const refresh = useCallback(async () => {
    const id = userId;
    if (!id) return;
    const generation=++refreshGeneration.current;
    setLoading(true);
    try {
      const data = await request<LearningDashboard>();
      if (activeId.current === id&&generation===refreshGeneration.current) {
        setSnapshot({ id, data });
        try{localStorage.setItem(cacheKey(id,period),JSON.stringify(data));}catch{/* Optional read cache; awards remain server-only. */}
        setError("");
      }
    } catch (e) {
      if (activeId.current === id&&generation===refreshGeneration.current)
        setError(e instanceof Error ? e.message : "Learning sync failed.");
    } finally {
      if (activeId.current === id&&generation===refreshGeneration.current) setLoading(false);
    }
  }, [userId, request]);
  const retry = useCallback(async () => {
    const id = userId;
    if (!id || busy.current.has(id)) return;
    const initialQueue = readQueue(id);
    if (initialQueue.length === 0) return;
    busy.current.add(id);
    try {
      let queue = initialQueue;
      let flushed = false;
      while (queue.length && activeId.current === id) {
        const first = queue[0];
        // Coalesce contiguous items for the same module (up to 50 questions per batch)
        const batch: typeof queue = [];
        let totalQuestions = 0;
        for (const item of queue) {
          if (item.submission.moduleCode === first.submission.moduleCode) {
            const count = item.submission.items?.length || 0;
            if (totalQuestions + count <= 50) {
              batch.push(item);
              totalQuestions += count;
              continue;
            }
          }
          break;
        }

        const mergedSubmission: LearningSubmission = {
          moduleCode: first.submission.moduleCode,
          items: batch.flatMap((b) => b.submission.items || []),
        };
        const batchIds = new Set(batch.map((b) => b.id));

        try {
          const result = await request<{ personal?: number }>("POST", mergedSubmission);
          if (activeId.current === id && Number.isSafeInteger(result.personal) && result.personal! > 0 && !document.hidden)
            setAwardNotice({ id: Date.now(), account: id, amount: result.personal! });
          const latest = readQueue(id).filter((item) => !batchIds.has(item.id));
          localStorage.setItem(queueKey(id), JSON.stringify(latest));
          queue = latest;
          flushed = true;
          if (activeId.current === id) setPending(queue.length);
        } catch (itemErr: any) {
          // If server rejected item permanently (400 Bad Request, 409 Conflict), drop the first item to isolate bad input
          if (itemErr && (itemErr.status === 400 || itemErr.status === 409)) {
            const latest = readQueue(id).filter((item) => item.id !== first.id);
            localStorage.setItem(queueKey(id), JSON.stringify(latest));
            queue = latest;
            flushed = true;
            if (activeId.current === id) setPending(queue.length);
            continue;
          }
          // For network or server errors (503, 500, etc.), halt and keep for next retry
          throw itemErr;
        }
      }
      if (flushed && activeId.current === id) await refresh();
    } catch (e) {
      if (activeId.current === id)
        setError(
          e instanceof Error ? e.message : "Your attempt is pending sync.",
        );
    } finally {
      busy.current.delete(id);
    }
  }, [userId, request, refresh]);
  useEffect(() => {
    setError("");
    let cached:LearningDashboard|null=null;
    try{const raw=userId?JSON.parse(localStorage.getItem(cacheKey(userId,period))??'null'):null;if(raw&&Array.isArray(raw.entries)&&Array.isArray(raw.leaderboard)&&typeof raw.profile?.xp==='number')cached=raw;}catch{/* Corrupt cache is ignored. */}
    setSnapshot(userId&&cached?{id:userId,data:cached}:null);
    setPending(userId ? readQueue(userId).length : 0);
    if (isLoaded && userId) {
      void refresh();
      if (readQueue(userId).length) void retry();
    }
  }, [userId, isLoaded, refresh, retry]);
  useEffect(() => {
    if (!isLoaded || !userId) return;
    let lastFocusRefresh = 0;
    const onFocus = () => {
      if (document.hidden) return;
      if (readQueue(userId).length) {
        void retry();
      } else {
        const now = Date.now();
        if (now - lastFocusRefresh > 15000) {
          lastFocusRefresh = now;
          void refresh();
        }
      }
    };
    const onOnline = () => {
      if (!document.hidden) {
        if (readQueue(userId).length) void retry();
        else void refresh();
      }
    };
    const onVisibility = () => {
      if (!document.hidden && readQueue(userId).length) {
        void retry();
      }
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    const interval = setInterval(() => {
      if (!document.hidden && readQueue(userId).length) {
        void retry();
      }
    }, 60000);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(interval);
    };
  }, [retry, refresh, isLoaded, userId]);
  const submit = useCallback(
    (submission: LearningSubmission) => {
      if (!userId) return;
      const queue = readQueue(userId);
      try {
        for (let i = 0; i < submission.items.length; i += 25)
          queue.push({
            id: crypto.randomUUID(),
            submission: {
              ...submission,
              items: submission.items.slice(i, i + 25),
            },
          });
        localStorage.setItem(queueKey(userId), JSON.stringify(queue));
        setPending(queue.length);
        void retry();
      } catch {
        setError(
          "Device storage is full. This attempt could not be queued for XP.",
        );
      }
    },
    [userId, retry],
  );
  const settings = useCallback(
    async (patch: Partial<LearningProfile>) => {
      const id = userId;
      await request("PATCH", patch);
      if (activeId.current === id) await refresh();
    },
    [userId, request, refresh],
  );
  const discard = () => {
    if (userId) {
      localStorage.removeItem(queueKey(userId));
      setPending(0);
      setError("");
    }
  };
  return (
    <LearningContext.Provider
      value={{
        data: snapshot && snapshot.id === userId ? snapshot.data : null,
        loading,
        error,
        pending,
        period,
        setPeriod,
        refresh,
        retry,
        discard,
        submit,
        settings,
      }}
    >
      {children}
      {awardNotice && awardNotice.account===userId && <XPAwardBubble key={awardNotice.id} amount={awardNotice.amount}/>}
    </LearningContext.Provider>
  );
}
export function useLearning() {
  const c = useContext(LearningContext);
  if (!c) throw new Error("LearningProvider missing");
  return c;
}

export function useOptionalLearning() { return useContext(LearningContext); }
