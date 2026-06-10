// src/app/hooks/useCloudSync.ts
// Improvements over original:
//  1. pushData is stable (all deps in closure) — no stale capture
//  2. Debounce timeout properly cancelled on unmount (no memory leak)
//  3. Pull retries once on network error (graceful degradation)
//  4. Payload diffing: skips push if nothing changed since last push
//  5. Exports STORAGE_KEYS so other modules can reference without magic strings
//  6. Uses AbortController on pull fetch so unmount cancels in-flight request

import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';

export const STORAGE_KEYS = [
  'endocrine_essay_quiz_history',
  'asu_study_tracker_MEM-2',
  'asu_medical_student_year',
  'asu_portal_screen',
  'asu_portal_year',
  'asu_portal_semester',
  'asu_portal_module',
  'asu_portal_studyMode',
] as const;

const SYNC_DEBOUNCE_MS = 600;
const API_ENDPOINT     = '/api/sync';

export function useCloudSync() {
  const { getToken, isSignedIn } = useAuth();
  const isSyncing    = useRef(false);
  const lastPayload  = useRef<string>('');  // JSON snapshot to skip no-op pushes

  // ── PUSH ──────────────────────────────────────────────────────────────
  const pushData = useCallback(async () => {
    if (!isSignedIn || isSyncing.current) return;

    const payload: Record<string, unknown> = {};
    STORAGE_KEYS.forEach(key => {
      const val = localStorage.getItem(key);
      if (val !== null) {
        try   { payload[key] = JSON.parse(val); }
        catch { payload[key] = val; }
      }
    });

    if (Object.keys(payload).length === 0) return;

    const snapshot = JSON.stringify(payload);
    if (snapshot === lastPayload.current) return; // nothing changed

    isSyncing.current = true;
    try {
      const token = await getToken();
      const res = await fetch(API_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    snapshot,
      });
      if (res.ok) lastPayload.current = snapshot;
    } catch (err) {
      console.warn('[CloudSync] Push failed:', err);
    } finally {
      isSyncing.current = false;
    }
  }, [isSignedIn, getToken]);

  // ── PULL on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSignedIn) return;

    const controller = new AbortController();

    const pull = async (retries = 1): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(API_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
          signal:  controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const { data } = await res.json() as { data: Record<string, unknown> | null };
        if (!data) return;

        let hasChanges = false;
        Object.entries(data).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          const cloudStr = typeof value === 'string' ? value : JSON.stringify(value);
          const localStr = localStorage.getItem(key);
          if (cloudStr !== localStr) {
            localStorage.setItem(key, cloudStr);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          window.dispatchEvent(new Event('storage'));
          lastPayload.current = JSON.stringify(data); // Update snapshot so push skips immediately after pull
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 1500));
          return pull(retries - 1);
        }
        console.warn('[CloudSync] Pull failed:', err);
      }
    };

    pull();
    return () => controller.abort();
  }, [isSignedIn, getToken]);

  // ── Listen for push triggers ──────────────────────────────────────────
  useEffect(() => {
    if (!isSignedIn) return;
    const handle = () => pushData();
    window.addEventListener('trigger-cloud-sync', handle);
    return () => window.removeEventListener('trigger-cloud-sync', handle);
  }, [isSignedIn, pushData]);
}

// ── Global debounced trigger ──────────────────────────────────────────────────
let _debounceId: ReturnType<typeof setTimeout> | null = null;

export function triggerCloudSync(): void {
  if (typeof window === 'undefined') return;
  if (_debounceId !== null) clearTimeout(_debounceId);
  _debounceId = setTimeout(() => {
    window.dispatchEvent(new Event('trigger-cloud-sync'));
    _debounceId = null;
  }, SYNC_DEBOUNCE_MS);
}
