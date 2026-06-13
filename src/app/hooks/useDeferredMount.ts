import { useState, useEffect } from 'react';

interface IdleWindow extends Window {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
}

export function useDeferredMount(timeoutMs = 2000): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;
    const w = window as unknown as IdleWindow;

    const trigger = () => {
      if (active) {
        setMounted(true);
        cleanup();
      }
    };

    const cleanup = () => {
      active = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (idleId !== null) {
        if (w.cancelIdleCallback) {
          w.cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
        idleId = null;
      }
    };

    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(() => {
        trigger();
      });
    } else {
      idleId = window.setTimeout(() => {
        trigger();
      }, 1);
    }

    timeoutId = setTimeout(trigger, timeoutMs);

    return cleanup;
  }, [timeoutMs]);

  return mounted;
}
