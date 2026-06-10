import { useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

const STORAGE_KEYS = [
  'endocrine_essay_quiz_history',
  'asu_study_tracker_MEM-2',
  'asu_medical_student_year'
];

export function useCloudSync() {
  const { getToken, isSignedIn } = useAuth();

  const pushData = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const payload: Record<string, any> = {};
      STORAGE_KEYS.forEach(key => {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            payload[key] = JSON.parse(val);
          } catch {
            payload[key] = val;
          }
        }
      });

      if (Object.keys(payload).length === 0) return;

      const token = await getToken();
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Cloud push failed:", err);
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
        
        if (!res.ok) throw new Error("API sync failed");
        
        const { data } = await res.json();
        
        if (data && isMounted) {
          let hasChanges = false;
          Object.keys(data).forEach(key => {
            if (data[key]) {
              const cloudVal = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
              const localVal = localStorage.getItem(key);
              
              if (cloudVal !== localVal) {
                localStorage.setItem(key, cloudVal);
                hasChanges = true;
              }
            }
          });
          
          if (hasChanges) {
            // Dispatch a generic storage event to update React components
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
    
    // Listen for custom trigger to push data to cloud
    const handleSync = () => pushData();
    window.addEventListener('trigger-cloud-sync', handleSync);
    
    return () => {
      window.removeEventListener('trigger-cloud-sync', handleSync);
    };
  }, [isSignedIn, pushData]);
}

// Global helper to trigger push after local storage mutations
export const triggerCloudSync = () => {
  if (typeof window !== 'undefined') {
    // Small debounce to let synchronous state finish
    setTimeout(() => {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
    }, 500);
  }
};
