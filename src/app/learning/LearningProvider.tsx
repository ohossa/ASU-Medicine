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
        throw new Error(localPreview && response.status === 503
          ? "Cloud learning is unavailable in this local preview. Your saved activity remains available."
          : result.error ?? "Learning sync failed.");
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
    busy.current.add(id);
    try {
      let queue = readQueue(id);
      while (queue.length && activeId.current === id) {
        const sent = queue[0];
        const result = await request<{personal?:number}>("POST", sent.submission);
        if(activeId.current===id && Number.isSafeInteger(result.personal) && result.personal!>0 && !document.hidden)
          setAwardNotice({id:Date.now(),account:id,amount:result.personal!});
        const latest = readQueue(id).filter((item) => item.id !== sent.id);
        localStorage.setItem(queueKey(id), JSON.stringify(latest));
        queue = latest;
        if (activeId.current === id) setPending(queue.length);
      }
      if (activeId.current === id) await refresh();
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
    const sync = () => { if (!document.hidden) void retry(); };
    window.addEventListener("online", sync);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    const interval = setInterval(sync, 60000);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
      clearInterval(interval);
    };
  }, [retry, isLoaded, userId]);
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
