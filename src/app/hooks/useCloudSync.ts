import { useEffect, useCallback, useRef, useState } from 'react';
import {setHistoryAccount,historyStorageKey,HISTORY_WIRE_KEY} from '../learning/historyScope';
import {mergeHistory} from '../../../shared/cloud-merge';
import { useAuth } from '@clerk/clerk-react';
import {
  updateCloudSyncInfo,
  registerSyncTrigger,
  subscribeCloudSync,
  triggerManualSync,
  type CloudSyncInfo,
} from '../services/cloudSyncState';

const STORAGE_KEYS = [
  'theme',
  'language',
  'endocrine_essay_quiz_history',
  'asu_portal_screen',
  'asu_portal_year',
  'asu_portal_semester',
  'asu_portal_module',
  'asu_portal_studyMode',
  'asu_flagged_questions',
  'asu_marks_calculator_selected_preset',
  'asu_marks_calculator_scores',
  'asu_marks_calculator_custom_name',
  'asu_marks_calculator_custom_sections',
  'asu_marks_calculator_year_tab',
  'asu_marks_calculator_semester_tab'
];

export function useCloudSync() {
  const { getToken, isSignedIn, userId } = useAuth();
  const activeUser=useRef(userId);activeUser.current=userId;
  setHistoryAccount(userId??null);
  const isSyncing = useRef(false);
  const isDirtyRef = useRef(false);
  // Track the last-synced value of each key to compute deltas
  const lastSyncedRef = useRef<Record<string, string>>({});
  const getTokenRef = useRef(getToken);

  useEffect(() => {
    lastSyncedRef.current = {};
    isDirtyRef.current = false;
  }, [userId]);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const isAccountKey = (key:string) => key===HISTORY_WIRE_KEY ||
    key.startsWith(`asu_study_tracker:${userId}:`) || key.startsWith(`asu_quiz_session:${userId}:`) || key===`asu_preferences:${userId}:shuffle`;
  const pushData = useCallback(async (accountOnly=false) => {
    if (!isSignedIn) return;
    if (isSyncing.current) {
      isDirtyRef.current = true;
      return;
    }
    isSyncing.current = true;
    updateCloudSyncInfo({ status: 'syncing' });
    try {
      const payload: Record<string, unknown> = {};
      const currentKeys = new Set<string>();

      // Collect standard keys
      STORAGE_KEYS.forEach(key => {
        if(accountOnly && !isAccountKey(key)) return;
        const val = localStorage.getItem(key===HISTORY_WIRE_KEY?historyStorageKey(userId):key);
        if (val) {
          currentKeys.add(key);
          const serialized = typeof val === 'string' ? val : JSON.stringify(val);
          // Only include keys that are new or changed
          if (lastSyncedRef.current[key] !== serialized) {
            try {
              payload[key] = JSON.parse(val);
            } catch {
              payload[key] = val;
            }
          }
        }
      });

      // Also dynamically collect any keys starting with asu_study_tracker_ or asu_quiz_session:
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && ((userId && key.startsWith(`asu_study_tracker:${userId}:`)) || (userId ? key.startsWith(`asu_quiz_session:${userId}:`) : key.startsWith('asu_quiz_session:')) || (userId && key === `asu_preferences:${userId}:shuffle`))) {
            const val = localStorage.getItem(key);
            if (val) {
              currentKeys.add(key);
              const serialized = typeof val === 'string' ? val : JSON.stringify(val);
              if (lastSyncedRef.current[key] !== serialized) {
                try {
                  payload[key] = JSON.parse(val);
                } catch {
                  payload[key] = val;
                }
              }
            }
          }
        }
      }

      // Detect keys that were in lastSyncedRef but are now absent from localStorage
      // These should be deleted from cloud (send them as null/undefined markers)
      for (const prevKey of Object.keys(lastSyncedRef.current)) {
        if(accountOnly && !isAccountKey(prevKey)) continue;
        if (!currentKeys.has(prevKey)) {
          // Key was deleted locally — include it with null to signal deletion
          // (The API will handle deleting it from Redis)
          payload[prevKey] = null;
        }
      }

      if (Object.keys(payload).length === 0) return;

      // 2MB limit check per-key for payloads that might be large
      const payloadStr = JSON.stringify(payload);
      if (payloadStr.length > 1024 * 1024 * 2) {
        console.warn('Cloud push payload exceeds 2MB, skipping push');
        return;
      }

      const token = await getTokenRef.current();
      if(activeUser.current!==userId)return;
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: payloadStr,
        signal: AbortSignal.timeout(30000)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API push failed: ${res.status} - ${errText}`);
      }

      if(activeUser.current!==userId)return;
      // After successful push, update lastSyncedRef with the values that were actually pushed (from payload)
      Object.entries(payload).forEach(([key, val]) => {
        if (val === null) {
          delete lastSyncedRef.current[key];
        } else {
          lastSyncedRef.current[key] = typeof val === 'string' ? val : JSON.stringify(val);
        }
      });
      updateCloudSyncInfo({ status: 'synced', lastSyncedAt: new Date(), error: null });
    } catch (err) {
      console.error("Cloud push failed:", err);
      updateCloudSyncInfo({ status: 'error', error: err instanceof Error ? err.message : 'Push failed' });
    } finally {
      isSyncing.current = false;
      if (isDirtyRef.current) {
        isDirtyRef.current = false;
        pushData();
      }
    }
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (!isSignedIn) return;

    let isMounted = true;
    let pulling = false;
    const IDLE_INTERVAL_MS = 600_000; // 10 minutes background interval (halves background Redis sync traffic)

    const pullData = async () => {
      if (pulling || isSyncing.current || (typeof document !== 'undefined' && document.hidden)) return;
      pulling = true;
      updateCloudSyncInfo({ status: 'syncing' });
      const before = new Map<string,string|null>();
      for(let i=0;i<localStorage.length;i++) { const key=localStorage.key(i);if(key)before.set(key,localStorage.getItem(key)); }
      try {
        const token = await getTokenRef.current();
        const res = await fetch('/api/sync', {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(30000)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`API sync failed: ${res.status} - ${errText}`);
        }

        const { data } = await res.json();

        if (data && isMounted && activeUser.current===userId) {
          let hasChanges = false;
          let hasLocalDrafts = Boolean(isDirtyRef.current);
          Object.entries(data).forEach(([key, cloudValAny]) => {
            if (key.startsWith('asu_study_tracker:') && !key.startsWith(`asu_study_tracker:${userId}:`)) return;
            if (key === 'asu_medical_student_year') return; // Academic year now has its own account-scoped cloud preference.
            if (key.startsWith('asu_preferences:') && key !== `asu_preferences:${userId}:shuffle`) return;
            if (userId && key.startsWith('asu_quiz_session:') && !key.startsWith(`asu_quiz_session:${userId}:`)) return;
            if (cloudValAny !== undefined && cloudValAny !== null) {
              let cloudVal = typeof cloudValAny === 'string' ? cloudValAny : JSON.stringify(cloudValAny);
              const localKey=key===HISTORY_WIRE_KEY?historyStorageKey(userId):key;
              const localVal = localStorage.getItem(localKey);

              let shouldOverwrite = false;
              let hasOfflineHistoryForKey = false;
              if (key===HISTORY_WIRE_KEY && localVal===null && lastSyncedRef.current[key]!==undefined) {
                // Keep an explicit pending history clear until its deletion is sent.
                shouldOverwrite=false;
                hasLocalDrafts = true;
              } else if (key===HISTORY_WIRE_KEY) {
                const merged = mergeHistory(cloudValAny, localVal??[]);
                cloudVal = JSON.stringify(merged);
                shouldOverwrite = true;
                if (localVal) {
                  try {
                    const localRows = JSON.parse(localVal);
                    if (Array.isArray(localRows) && localRows.length > 0) {
                      const cloudRows = Array.isArray(cloudValAny)
                        ? cloudValAny
                        : (typeof cloudValAny === 'string' ? JSON.parse(cloudValAny) : []);
                      if (Array.isArray(cloudRows)) {
                        const cloudIds = new Set(cloudRows.map((r: any) => r?.id));
                        if (localRows.some((r: any) => r?.id && !cloudIds.has(r.id))) {
                          hasOfflineHistoryForKey = true;
                          hasLocalDrafts = true;
                        }
                      }
                    }
                  } catch { /* ignore parse error */ }
                }
              } else
              if (key.startsWith('asu_quiz_session:') || key === `asu_preferences:${userId}:shuffle`) {
                try {
                  const cloudObj = typeof cloudValAny === 'string' ? JSON.parse(cloudValAny) : cloudValAny;
                  const localObj = localVal ? JSON.parse(localVal) : null;
                  const cloudTime = cloudObj?.timestamp ?? 0;
                  const localTime = localObj?.timestamp ?? 0;
                  if (cloudTime > localTime) {
                    shouldOverwrite = true;
                  } else if (localTime > cloudTime) {
                    hasLocalDrafts = true;
                  }
                } catch {
                  shouldOverwrite = true;
                }
              } else {
                // A pending local edit must survive a background pull.
                shouldOverwrite = lastSyncedRef.current[key]===undefined
                  ? localVal===(before.get(localKey)??null)
                  : localVal===lastSyncedRef.current[key];
              }

              if (shouldOverwrite && cloudVal !== localVal) {
                localStorage.setItem(localKey, cloudVal);
                hasChanges = true;
              }

              // Populate lastSyncedRef so future pushes know what's in the cloud
              if (key === HISTORY_WIRE_KEY && !hasOfflineHistoryForKey) {
                lastSyncedRef.current[key] = cloudVal;
              } else {
                lastSyncedRef.current[key] = typeof cloudValAny==='string'?cloudValAny:JSON.stringify(cloudValAny);
              }
            }
          });

          // Check if there are local account keys in localStorage that are absent from cloud
          const cloudKeySet = new Set(Object.keys(data));
          if (typeof window !== 'undefined' && !hasLocalDrafts) {
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (k && ((userId && k.startsWith(`asu_study_tracker:${userId}:`)) || (userId && k.startsWith(`asu_quiz_session:${userId}:`)) || (userId && k === `asu_preferences:${userId}:shuffle`))) {
                if (!cloudKeySet.has(k)) {
                  hasLocalDrafts = true;
                  break;
                }
              }
            }
          }

          if (hasChanges) {
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('asu-history-updated'));
          }
          // Reconcile only this account's history/drafts if un-synced offline drafts exist.
          if (hasLocalDrafts) {
            await pushData(true);
          }
          updateCloudSyncInfo({ status: 'synced', lastSyncedAt: new Date(), error: null });
        }
      } catch (err) {
        console.error("Cloud pull failed:", err);
        updateCloudSyncInfo({ status: 'error', error: err instanceof Error ? err.message : 'Sync failed' });
      } finally { pulling = false; }
    };

    const handleOnline = () => {
      updateCloudSyncInfo({ status: 'synced', error: null });
      void pullData();
    };
    const handleOffline = () => {
      updateCloudSyncInfo({ status: 'offline' });
    };

    void pullData();
    const resume = () => { void pullData(); };
    window.addEventListener('focus', resume);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', resume);
    const interval = setInterval(resume, IDLE_INTERVAL_MS);
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', resume);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [isSignedIn, userId, pushData]);

  useEffect(() => {
    if (!isSignedIn) return;

    const unregister = registerSyncTrigger(async () => {
      try {
        await pushData();
        return true;
      } catch {
        return false;
      }
    });

    const handleSync = () => pushData();
    window.addEventListener('trigger-cloud-sync', handleSync);

    return () => {
      unregister();
      window.removeEventListener('trigger-cloud-sync', handleSync);
    };
  }, [isSignedIn, pushData]);
}

export function useCloudSyncStatus(): CloudSyncInfo & { syncNow: () => Promise<boolean> } {
  const [info, setInfo] = useState<CloudSyncInfo>(() => {
    return {
      status: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced',
      lastSyncedAt: null,
      error: null,
    };
  });

  useEffect(() => {
    return subscribeCloudSync(setInfo);
  }, []);

  return {
    ...info,
    syncNow: triggerManualSync,
  };
}

// Global helper to trigger push after local storage mutations
let syncTimeoutId: ReturnType<typeof setTimeout> | null = null;
const SYNC_DEBOUNCE_MS = 5000; // 5 seconds coalescing window: slashes Supabase write IOPS and egress by >90%

export const flushPendingCloudSync = () => {
  if (typeof window !== 'undefined' && syncTimeoutId) {
    clearTimeout(syncTimeoutId);
    syncTimeoutId = null;
    window.dispatchEvent(new Event('trigger-cloud-sync'));
  }
};

export const triggerCloudSync = (immediate = false) => {
  if (typeof window !== 'undefined') {
    if (syncTimeoutId) {
      clearTimeout(syncTimeoutId);
      syncTimeoutId = null;
    }
    if (immediate) {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
      return;
    }
    syncTimeoutId = setTimeout(() => {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
      syncTimeoutId = null;
    }, SYNC_DEBOUNCE_MS);
  }
};

// Immediate flush on tab hide or unload so zero user progress is ever lost
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => flushPendingCloudSync(), { capture: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPendingCloudSync();
  }, { capture: true });
}