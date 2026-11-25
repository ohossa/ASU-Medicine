import { useCallback, useEffect, useRef, useState } from "react";
import { applyAppUpdate, useVersionCheck } from "../hooks/useVersionCheck";

const AUTO_UPDATE_DELAY_MS = 1500;
const AUTO_UPDATE_COOLDOWN_MS = 30_000;
const AUTO_UPDATE_KEY = "asu:last-auto-update";

function readStoredQuizActive(): boolean {
  try {
    return sessionStorage.getItem("asu:active-quiz") === "1";
  } catch {
    return false;
  }
}

/**
 * Apple HIG Liquid Glass floating update notice.
 * Auto-applies fresh deployments when idle outside a quiz, and safeguards active
 * quizzes with an accessible, non-disruptive floating capsule.
 */
export function SiteUpdateNotice({
  reload = () => applyAppUpdate(),
  isQuizActive,
}: {
  reload?: () => void;
  isQuizActive?: boolean;
}) {
  const [swAvailable, setSwAvailable] = useState(false);
  const [trackedQuizActive, setTrackedQuizActive] = useState<boolean>(readStoredQuizActive);
  const effectiveQuizActive = isQuizActive ?? trackedQuizActive;
  const { updateAvailable: versionAvailable } = useVersionCheck({ isQuizActive: effectiveQuizActive });
  const reloadedRef = useRef(false);

  useEffect(() => {
    const onQuizState = (event: Event) => {
      const detail = (event as CustomEvent<{ active?: boolean }>).detail;
      if (typeof detail?.active === "boolean") {
        setTrackedQuizActive(detail.active);
      } else {
        setTrackedQuizActive(readStoredQuizActive());
      }
    };
    window.addEventListener("asu:quiz-state", onQuizState);
    return () => window.removeEventListener("asu:quiz-state", onQuizState);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const worker = navigator.serviceWorker;
    let hadController = Boolean(worker.controller);
    const changed = () => {
      if (hadController) setSwAvailable(true);
      hadController = true;
    };
    worker.addEventListener("controllerchange", changed);
    return () => worker.removeEventListener("controllerchange", changed);
  }, []);

  const triggerReload = useCallback(() => {
    if (reloadedRef.current) return;
    reloadedRef.current = true;
    window.dispatchEvent(new Event("asu:save-before-refresh"));
    reload();
  }, [reload]);

  const isVisible = swAvailable || versionAvailable;

  useEffect(() => {
    if (!isVisible || effectiveQuizActive) return;
    try {
      const last = Number(sessionStorage.getItem(AUTO_UPDATE_KEY) || 0);
      if (Date.now() - last < AUTO_UPDATE_COOLDOWN_MS) return;
    } catch {
      // ignore storage failures
    }
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(AUTO_UPDATE_KEY, String(Date.now()));
      } catch {
        // ignore storage failures
      }
      triggerReload();
    }, AUTO_UPDATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isVisible, effectiveQuizActive, triggerReload]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-label="Application update available"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] mx-auto flex items-center justify-between gap-3 sm:gap-4 rounded-full border border-stone-200/80 bg-white/90 px-4 py-2 shadow-2xl backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-center gap-2.5 pl-1">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs sm:text-sm font-medium tracking-tight text-stone-800 dark:text-stone-200 whitespace-nowrap">
          {effectiveQuizActive ? "Update ready" : "Updating app…"}
        </span>
      </div>

      <button
        type="button"
        className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-stone-950"
        onClick={triggerReload}
      >
        Save and refresh
      </button>
    </div>
  );
}
