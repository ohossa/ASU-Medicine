import { useEffect, useState, useCallback } from "react";
import localVersion from "../generated/version.json";

export interface AppVersionInfo {
  version: string;
  commit: string;
  buildTime: string;
  timestamp: number;
}

export const CURRENT_BUILD_VERSION: AppVersionInfo = localVersion;

export async function fetchRemoteVersion(): Promise<AppVersionInfo | null> {
  try {
    const res = await fetch(`/version.json?_t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function isNewerVersion(
  remote: AppVersionInfo,
  local: AppVersionInfo = CURRENT_BUILD_VERSION,
): boolean {
  if (!remote || !local) return false;
  // If commit hashes are different (and neither is dev)
  if (
    remote.commit &&
    local.commit &&
    remote.commit !== "dev" &&
    local.commit !== "dev"
  ) {
    return remote.commit !== local.commit;
  }
  // Fallback to build timestamp comparison
  if (remote.timestamp && local.timestamp) {
    return remote.timestamp > local.timestamp;
  }
  return false;
}

export function applyAppUpdate(): void {
  // 1. Dispatch save event for any uncommitted quiz/study progress
  window.dispatchEvent(new CustomEvent("asu:save-before-refresh"));

  // 2. Clear navigation caches so fresh index.html is loaded
  if ("caches" in window) {
    caches
      .keys()
      .then((names) => {
        for (const name of names) {
          if (name.includes("asu-navigation")) {
            caches.delete(name).catch(() => {});
          }
        }
      })
      .catch(() => {});
  }

  // 3. Post skip waiting to any waiting service worker
  window.dispatchEvent(new CustomEvent("asu:apply-update"));

  // 4. Smooth reload
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

export function useVersionCheck(options?: { isQuizActive?: boolean }) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [remoteVersion, setRemoteVersion] = useState<AppVersionInfo | null>(
    null,
  );

  const checkVersion = useCallback(async () => {
    const remote = await fetchRemoteVersion();
    if (remote && isNewerVersion(remote, CURRENT_BUILD_VERSION)) {
      setRemoteVersion(remote);
      const isQuiz =
        options?.isQuizActive ??
        sessionStorage.getItem("asu:active-quiz") === "1";
      if (isQuiz) {
        // If in an active quiz, hold update and show subtle Apple HIG pill
        setUpdateAvailable(true);
      } else {
        // Not in quiz: silently perform seamless background update!
        applyAppUpdate();
      }
    }
  }, [options?.isQuizActive]);

  useEffect(() => {
    // 1. Check version on mount
    checkVersion();

    // 2. Check version on window focus and iPad visibility change
    const onFocus = () => checkVersion();
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        checkVersion();
      }
    };

    // 3. Listen to service worker update notification
    const onSwUpdate = () => {
      const isQuiz =
        options?.isQuizActive ??
        sessionStorage.getItem("asu:active-quiz") === "1";
      if (isQuiz) {
        setUpdateAvailable(true);
      } else {
        applyAppUpdate();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("asu:sw-update-available", onSwUpdate);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("asu:sw-update-available", onSwUpdate);
    };
  }, [checkVersion, options?.isQuizActive]);

  return {
    updateAvailable,
    remoteVersion,
    checkVersion,
    applyUpdate: applyAppUpdate,
  };
}
