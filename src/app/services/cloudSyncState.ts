export type CloudSyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

export interface CloudSyncInfo {
  status: CloudSyncStatus;
  lastSyncedAt: Date | null;
  error: string | null;
}

let currentInfo: CloudSyncInfo = {
  status: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced',
  lastSyncedAt: null,
  error: null,
};

const listeners = new Set<(info: CloudSyncInfo) => void>();
let triggerSyncHandler: (() => Promise<boolean>) | null = null;

export function getCloudSyncInfo(): CloudSyncInfo {
  return currentInfo;
}

export function registerSyncTrigger(handler: () => Promise<boolean>) {
  triggerSyncHandler = handler;
  return () => {
    if (triggerSyncHandler === handler) {
      triggerSyncHandler = null;
    }
  };
}

export async function triggerManualSync(): Promise<boolean> {
  if (triggerSyncHandler) {
    return triggerSyncHandler();
  }
  return false;
}

export function updateCloudSyncInfo(patch: Partial<CloudSyncInfo>) {
  currentInfo = { ...currentInfo, ...patch };
  listeners.forEach((listener) => {
    try {
      listener(currentInfo);
    } catch (e) {
      console.error('Error notifying sync listener', e);
    }
  });
}

export function subscribeCloudSync(listener: (info: CloudSyncInfo) => void): () => void {
  listeners.add(listener);
  listener(currentInfo);
  return () => {
    listeners.delete(listener);
  };
}
