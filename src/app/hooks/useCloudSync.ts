import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';

const STORAGE_KEYS = [
  'theme',
  'language',
  'endocrine_essay_quiz_history',
  'asu_medical_student_year',
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
  const { getToken, isSignedIn } = useAuth();
  const isSyncing = useRef(false);
  // Track the last-synced value of each key to compute deltas
  const lastSyncedRef = useRef<Record<string, string>>({});

  const pushData = useCallback(async () => {
    if (!isSignedIn || isSyncing.current) return;
    isSyncing.current = true;
    try {
      const payload: Record<string, unknown> = {};
      const currentKeys = new Set<string>();

      // Collect standard keys
      STORAGE_KEYS.forEach(key => {
        const val = localStorage.getItem(key);
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
          if (key && (key.startsWith('asu_study_tracker_') || key.startsWith('asu_quiz_session:'))) {
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

      const token = await getToken();
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: payloadStr
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API push failed: ${res.status} - ${errText}`);
      }

      // After successful push, update lastSyncedRef with current values
      // (but remove entries for deleted keys)
      for (const key of currentKeys) {
        const val = localStorage.getItem(key);
        lastSyncedRef.current[key] = typeof val === 'string' ? val : JSON.stringify(val ?? null);
      }
      // Remove entries for deleted keys
      for (const prevKey of Object.keys(lastSyncedRef.current)) {
        if (!currentKeys.has(prevKey)) {
          delete lastSyncedRef.current[prevKey];
        }
      }
    } catch (err) {
      console.error("Cloud push failed:", err);
    } finally {
      isSyncing.current = false;
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (!isSignedIn) return;

    let isMounted = true;
    const pullData = async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/sync', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`API sync failed: ${res.status} - ${errText}`);
        }

        const { data } = await res.json();

        if (data && isMounted) {
          let hasChanges = false;
          Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
              const cloudVal = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
              const localVal = localStorage.getItem(key);

              if (cloudVal !== localVal) {
                localStorage.setItem(key, cloudVal);
                hasChanges = true;
              }

              // Populate lastSyncedRef so future pushes know what's in the cloud
              lastSyncedRef.current[key] = cloudVal;
            }
          });

          if (hasChanges) {
            window.dispatchEvent(new Event('storage'));
          }
        }
      } catch (err) {
        console.error("Cloud pull failed:", err);
      }
    };

    pullData();

    return () => {
      isMounted = false;
    };
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (!isSignedIn) return;

    const handleSync = () => pushData();
    window.addEventListener('trigger-cloud-sync', handleSync);

    return () => {
      window.removeEventListener('trigger-cloud-sync', handleSync);
    };
  }, [isSignedIn, pushData]);
}

// Global helper to trigger push after local storage mutations
let syncTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const triggerCloudSync = () => {
  if (typeof window !== 'undefined') {
    if (syncTimeoutId) {
      clearTimeout(syncTimeoutId);
    }
    syncTimeoutId = setTimeout(() => {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
      syncTimeoutId = null;
    }, 500);
  }
};