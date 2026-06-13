import React, { useEffect, useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { FX } from "../lib/fx.config";
import { useDeferredMount } from "../hooks/useDeferredMount";
import { ECGMonitor as EagerECGMonitor } from "./ECGMonitor";

const LazyECGMonitor = lazy(() => import("./ECGMonitor").then(m => ({ default: m.ECGMonitor })));

interface LoadingScreenProps {
  isLoading?: boolean;
  progress?: number;
  onComplete?: () => void;
  duration?: number;
}

/**
 * Apple-style minimalist preloader.
 */
export default function LoadingScreen({
  isLoading: controlledLoading,
  progress: controlledProgress,
  onComplete,
  duration = 2400, // simulated load time (ms) when uncontrolled
}: LoadingScreenProps) {
  const deferredMounted = useDeferredMount();
  const isControlled = controlledLoading !== undefined;
  const [internalProgress, setInternalProgress] = useState(0);
  const [internalLoading, setInternalLoading] = useState(true);

  const progress = controlledProgress ?? internalProgress;
  const isLoading = isControlled ? controlledLoading : internalLoading;

  // Simulated progress: fast start, gentle ease toward 100
  useEffect(() => {
    if (isControlled) return;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setInternalProgress(eased * 100);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setInternalLoading(false), 250); // brief hold at 100%
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isControlled, duration]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isLoading && (
        <motion.div
          key="loading-screen"
          role="status"
          aria-label="Loading ASU Medical Portal"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground"
        >
          {/* Breathing logo mark / ECG Monitor */}
          <div className="w-56 mb-8 h-16 flex items-center justify-center">
            {FX.DEFERRED_FX ? (
              deferredMounted && FX.ecgMonitor ? (
                <Suspense fallback={null}>
                  <LazyECGMonitor height={64} />
                </Suspense>
              ) : null
            ) : (
              FX.ecgMonitor && <EagerECGMonitor height={64} />
            )}
          </div>

          {/* Wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="text-sm font-extralight uppercase text-foreground text-center"
            style={{ letterSpacing: "0.45em", textIndent: "0.45em" }}
          >
            Loading vitals…
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-3 text-[11px] font-light text-muted-foreground"
            style={{ letterSpacing: "0.3em", textIndent: "0.3em" }}
          >
            Ain Shams University
          </motion.p>

          {/* Hairline progress track */}
          <div
            className="mt-12 w-44 overflow-hidden bg-muted"
            style={{ height: 1 }}
            aria-hidden="true"
          >
            <motion.div
              className="h-full bg-physiology"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
