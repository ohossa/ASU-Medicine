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
import { getCachedSession } from "../auth/cachedSession";
import type { LearningXpHint } from "./learningAnswerGrade";
import type {
  LearningDashboard,
  LearningDashboardResponse,
  LearningSubmission,
  LearningProfile,
} from "./contracts";
import { XPAwardBubble } from "./XPAwardBubble";
interface Context {
  data: LearningDashboard | null;
  loading: boolean;
  syncing: boolean;
  error: string;
  pending: number;
  period: string;
  setPeriod: (p: string) => void;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  discard: () => void;
  submit: (s: LearningSubmission, options?: { defer?: boolean; xp?: LearningXpHint[] }) => boolean;
  settings: (patch: Partial<LearningProfile>) => Promise<void>;
}
const LearningContext = createContext<Context | null>(null);
export const queueKey = (id: string) => `asu_learning_pending:${id}`;
interface Pending {
  id: string;
  submission: LearningSubmission;
  xpNoticeIds?: string[];
}
function readQueue(id: string): Pending[] {
  try {
    const data = JSON.parse(localStorage.getItem(queueKey(id)) ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
const xpNoticeKey = (id: string) => `asu_learning_xp_notices:${id}`;

function readXpNoticeIds(id: string): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(xpNoticeKey(id)) ?? "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

const cacheKey = (id: string, period: string) => `asu_learning_snapshot:${id}:${period}`;

function readSnapshot(key: string): LearningDashboard | null {
  try {
    const data = JSON.parse(localStorage.getItem(key) ?? "null");
    if (Array.isArray(data?.entries) && Array.isArray(data?.leaderboard) &&
      typeof data.profile?.xp === "number") {
      return data;
    }
  } catch {
    // A missing or invalid cache requires a full load.
  }
  return null;
}

function applyLearningResponse(
  base: LearningDashboard | null,
  { deletedEntryIds, ...response }: LearningDashboardResponse,
): LearningDashboard {
  if (!deletedEntryIds) return response;
  if (!base?.entriesCursor || !response.entriesCursor) {
    throw new Error("Learning history could not be synchronized.");
  }

  if (response.entries.length === 0 && deletedEntryIds.length === 0) {
    return { ...response, entries: base.entries };
  }
  const entries = new Map(base.entries.map((entry) => [entry.entryId, entry]));
  for (const entryId of deletedEntryIds) entries.delete(entryId);
  for (const entry of response.entries) entries.set(entry.entryId, entry);
  return { ...response, entries: [...entries.values()] };
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const { userId: authenticatedId, getToken, isLoaded } = useAuth();
  const userId = authenticatedId ?? (!isLoaded && typeof navigator !== "undefined" && navigator.onLine === false
    ? getCachedSession()?.userId
    : null);
  const authId = useRef(authenticatedId);
  authId.current = authenticatedId;
  const token = useRef(getToken);
  token.current = getToken;
  const activeId = useRef(userId);
  activeId.current = userId;
  const [snapshot, setSnapshot] = useState<{
      id: string;
      data: LearningDashboard;
    } | null>(null),
    [loading, setLoading] = useState(false),
    [syncing, setSyncing] = useState(false),
    [error, setError] = useState(""),
    [pending, setPending] = useState(0),
    [period, setPeriod] = useState("weekly");
  const [awardNotice, setAwardNotice] = useState<{ id: number; account: string; amount: number } | null>(null);
  const noticeSequence = useRef(0);
  useEffect(()=>{if(!awardNotice)return;const timeout=setTimeout(()=>setAwardNotice(null),2200);return()=>clearTimeout(timeout);},[awardNotice]);
  const scope = userId ? cacheKey(userId, period) : null;
  const activeScope = useRef(scope);
  activeScope.current = scope;
  const history = useRef<{ key: string; data: LearningDashboard } | null>(null);
  const refreshGeneration = useRef(0);
  const busy = useRef(new Set<string>());
  const request = useCallback(
    async <T,>(method = "GET", body?: unknown, entriesCursor = "full"): Promise<T> => {
      const requestId = activeId.current;
      if (!requestId || authId.current !== requestId) throw new Error("Your answers are saved on this device.");
      const t = await token.current();
      if (activeId.current !== requestId) throw new Error("Account changed.");
      if (!t) throw new Error("Sign in to sync your learning.");
      const response = await fetch(
        "/api/learning" + (method === "GET" ? `?${new URLSearchParams({ period, entriesCursor })}` : ""),
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
  const refresh = useCallback(async () => {
    const id = userId;
    const key = scope;
    if (!id || !key) return;
    const generation = ++refreshGeneration.current;
    const isCurrent = () => activeScope.current === key && generation === refreshGeneration.current;
    const cached = history.current?.key === key ? history.current.data : readSnapshot(key);
    const base = cached?.entriesCursor && cached.entries.every((entry) => typeof entry?.entryId === "string")
      ? cached
      : null;
    setLoading(true);
    try {
      const response = await request<LearningDashboardResponse>("GET", undefined, base?.entriesCursor);
      if (isCurrent()) {
        const data = applyLearningResponse(base, response);
        history.current = { key, data };
        setSnapshot({ id, data });
        try {
          localStorage.setItem(key, JSON.stringify(data));
          const acknowledged = readXpNoticeIds(id);
          if (acknowledged.length) {
            const stored = new Set(data.entries.filter((entry) => entry.everCorrect || entry.correct).map((entry) => entry.questionId));
            localStorage.setItem(xpNoticeKey(id), JSON.stringify(acknowledged.filter((entryId) => !stored.has(entryId))));
          }
        } catch { /* Keep the in-memory copy. */ }
        setError("");
      }
    } catch (e) {
      if (isCurrent()) setError(e instanceof Error ? e.message : "Learning sync failed.");
    } finally {
      if (isCurrent()) setLoading(false);
    }
  }, [userId, scope, request]);
  const retry = useCallback(async () => {
    const id = userId;
    if (!id || authId.current !== id || busy.current.has(id) || navigator.onLine === false) return;
    const initialQueue = readQueue(id);
    if (initialQueue.length === 0) return;
    busy.current.add(id);
    setSyncing(true);
    let flushed = false;
    let failure: unknown;
    const blockedModules = new Set<string>();
    try {
      let queue = initialQueue;
      while (queue.length && activeId.current === id) {
        const moduleCode = queue[0].submission.moduleCode;
        const batch: typeof queue = [];
        const uniqueItems = new Map<string, LearningSubmission["items"][number]>();
        for (const item of queue) {
          if (item.submission.moduleCode !== moduleCode) break;
          const items = item.submission.items.filter((answer) => answer?.questionId);
          if (batch.length && (uniqueItems.size + items.length > 50 || items.some((answer) => {
            const previous = uniqueItems.get(answer.questionId);
            return previous && JSON.stringify(previous.answer) !== JSON.stringify(answer.answer);
          }))) break;

          // The server accepts one answer per question in a batch. Keep changed answers in order.
          for (const answer of items) uniqueItems.set(answer.questionId, answer);
          batch.push(item);
        }

        const batchIds = new Set(batch.map((b) => b.id));

        if (uniqueItems.size === 0) {
          const latest = readQueue(id).filter((item) => !batchIds.has(item.id));
          localStorage.setItem(queueKey(id), JSON.stringify(latest));
          queue = latest.filter((item) => !blockedModules.has(item.submission.moduleCode));
          flushed = true;
          if (activeId.current === id) setPending(latest.length);
          continue;
        }

        const mergedSubmission: LearningSubmission = {
          moduleCode,
          items: Array.from(uniqueItems.values()),
        };

        try {
          await request("POST", mergedSubmission);
          const acknowledged = batch.flatMap((item) => item.xpNoticeIds ?? []);
          if (acknowledged.length) {
            localStorage.setItem(xpNoticeKey(id), JSON.stringify([...new Set([...readXpNoticeIds(id), ...acknowledged])]));
          }
          const latest = readQueue(id).filter((item) => !batchIds.has(item.id));
          localStorage.setItem(queueKey(id), JSON.stringify(latest));
          queue = latest.filter((item) => !blockedModules.has(item.submission.moduleCode));
          flushed = true;
          if (activeId.current === id) setPending(latest.length);
        } catch (itemErr: any) {
          if (itemErr?.status === 409) {
            failure = itemErr;
            blockedModules.add(moduleCode);
            queue = readQueue(id).filter((item) => !blockedModules.has(item.submission.moduleCode));
            continue;
          }
          if (itemErr?.status === 400) {
            const latest = readQueue(id).filter((item) => !batchIds.has(item.id));
            localStorage.setItem(queueKey(id), JSON.stringify(latest));
            queue = latest.filter((item) => !blockedModules.has(item.submission.moduleCode));
            flushed = true;
            if (activeId.current === id) setPending(latest.length);
            continue;
          }
          // Keep queued answers after a network or server error.
          throw itemErr;
        }
      }
    } catch (e) {
      failure = e;
    } finally {
      busy.current.delete(id);
      if (activeId.current === id) {
        setSyncing(false);
        if (flushed) await refresh();
        if (failure && activeId.current === id) {
          setError(failure instanceof Error ? failure.message : "Your attempt is pending sync.");
        }
      }
    }
  }, [userId, request, refresh]);
  useEffect(() => {
    setError("");
    const cached = scope ? readSnapshot(scope) : null;
    setSnapshot(userId&&cached?{id:userId,data:cached}:null);
    setPending(userId ? readQueue(userId).length : 0);
    setSyncing(Boolean(userId && busy.current.has(userId)));
    if (isLoaded && userId) {
      void refresh();
      if (readQueue(userId).length) void retry();
    }
  }, [userId, scope, isLoaded, refresh, retry]);
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
    (submission: LearningSubmission, { defer = false, xp = [] }: { defer?: boolean; xp?: LearningXpHint[] } = {}) => {
      if (!userId || submission.items.length === 0) return false;
      const queue = readQueue(userId);
      try {
        const seen = new Set<string>();
        if (xp.length) {
          const current = history.current?.key === scope ? history.current.data : scope ? readSnapshot(scope) : null;
          const confirmed = current ?? readSnapshot(cacheKey(userId, period === "weekly" ? "all" : "weekly"));
          for (const entry of confirmed?.entries ?? []) {
            if (entry.correct || entry.everCorrect) seen.add(entry.questionId);
          }
          for (const id of readXpNoticeIds(userId)) seen.add(id);
          for (const item of queue) {
            for (const id of item.xpNoticeIds ?? []) seen.add(id);
          }
        }
        let amount = 0;
        let chunk: LearningSubmission["items"] = [];
        const putChunk = () => {
          const ids = chunk.map((item) => item.questionId);
          const xpNoticeIds: string[] = [];
          for (const hint of xp) {
            if (seen.has(hint.questionId) || !ids.some((id) => hint.questionId === id || hint.questionId.startsWith(id + "/"))) continue;
            xpNoticeIds.push(hint.questionId);
            seen.add(hint.questionId);
            amount += hint.points;
          }
          queue.push({
            id: crypto.randomUUID(),
            submission: { moduleCode: submission.moduleCode, items: chunk },
            ...(xpNoticeIds.length ? { xpNoticeIds } : {}),
          });
        };
        for (const item of submission.items) {
          if (chunk.length === 25 || chunk.some((previous) => previous.questionId === item.questionId)) {
            putChunk();
            chunk = [];
          }
          chunk.push(item);
        }
        if (chunk.length) putChunk();

        localStorage.setItem(queueKey(userId), JSON.stringify(queue));
        setPending(queue.length);
        if (amount > 0) setAwardNotice({ id: ++noticeSequence.current, account: userId, amount });
        if (!defer) void retry();
        return true;
      } catch {
        setError("Device storage is full. This attempt could not be queued for XP.");
        return false;
      }
    },
    [userId, scope, period, retry],
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
        syncing,
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
