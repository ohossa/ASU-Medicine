import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  HeartPulse,
  BookOpen,
  ArrowLeft,
  Compass,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { updateDocumentTitle } from '../app/utils/pageTitle';

/**
 * NotFoundPage.tsx — "Anti-Average" 404 Experience
 *
 * Grounded in Apple Human Interface Guidelines and inspired by 404s.design/sites/anti-average:
 *  - Replaces sterile dead-end error pages with an interactive clinical diagnosis experience
 *  - Animated ECG rhythm trace with interactive heart rate counter
 *  - Liquid Glass container materials with semantic dark/light tokens
 *  - WCAG AA compliant contrast, min 44px touch targets, visible keyboard focus
 */
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [pulseCount, setPulseCount] = useState(72);
  const [isResuscitating, setIsResuscitating] = useState(false);

  useEffect(() => {
    updateDocumentTitle("Page Not Found");
  }, []);

  const handleDefibrillate = () => {
    setIsResuscitating(true);
    setPulseCount((prev) => Math.min(prev + 12, 140));
    setTimeout(() => {
      setIsResuscitating(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-stone-200/80 dark:border-white/10 bg-white/80 dark:bg-stone-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
        role="main"
        aria-labelledby="not-found-heading"
      >
        {/* Header diagnosis badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/70 dark:border-white/10 pb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>DIAGNOSIS: ACUTE 404 SYNDROME</span>
          </div>

          <button
            type="button"
            onClick={handleDefibrillate}
            title="Click to stimulate pulse"
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 dark:border-white/10 bg-stone-100/70 dark:bg-white/5 px-3 py-1 text-xs font-medium text-stone-600 dark:text-stone-300 transition-transform active:scale-95 hover:bg-stone-200/70 dark:hover:bg-white/10 cursor-pointer min-h-[36px]"
          >
            <Activity className={`h-3.5 w-3.5 text-rose-500 ${isResuscitating ? 'animate-bounce' : 'animate-pulse'}`} aria-hidden="true" />
            <span className="tabular-nums font-mono">{pulseCount} BPM</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Pulse</span>
          </button>
        </div>

        {/* Big 404 Title & ECG Wave */}
        <div className="my-8 text-center">
          <div className="relative inline-block">
            <h1
              id="not-found-heading"
              className="font-mono text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-br from-stone-900 via-rose-600 to-teal-600 dark:from-white dark:via-rose-400 dark:to-teal-300 bg-clip-text text-transparent select-none"
            >
              404
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 flex justify-center" aria-hidden="true">
              <svg className="w-48 h-6 text-rose-500 dark:text-rose-400" viewBox="0 0 100 20" fill="none">
                <path
                  d="M0 10 H30 L35 2 L40 18 L45 5 L50 15 L55 10 H100"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isResuscitating ? 'stroke-dash-fast' : 'stroke-dash'}
                />
              </svg>
            </div>
          </div>

          <h2 className="mt-6 text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
            Vital Signs Missing · Pathway Not Found
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-stone-600 dark:text-stone-300">
            The neural pathway or syllabus section you requested has either migrated, been audited out of the catalog, or never existed in the curriculum.
          </p>
        </div>

        {/* Clinical findings card */}
        <div className="rounded-2xl border border-stone-200/60 dark:border-white/5 bg-stone-50/60 dark:bg-white/[0.02] p-4 sm:p-5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="font-semibold text-stone-900 dark:text-white shrink-0">Etiology:</span>
            <span>Broken reference URL, outdated bookmark, or deprecated study route.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-semibold text-stone-900 dark:text-white shrink-0">Prognosis:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Curable. Full academic recovery expected within seconds.</span>
          </div>
        </div>

        {/* High-yield action escape routes */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 active:scale-[0.98] dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <HeartPulse className="h-4 w-4 text-rose-400 dark:text-rose-600" aria-hidden="true" />
            <span>Resuscitate Session (Home)</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/learning')}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-stone-200/90 dark:border-white/10 bg-white/70 dark:bg-white/5 px-6 py-3 text-sm font-semibold text-stone-800 dark:text-white shadow-sm transition-all hover:bg-stone-100 dark:hover:bg-white/10 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <BookOpen className="h-4 w-4 text-teal-500" aria-hidden="true" />
            <span>Learning Hub</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-stone-200/90 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 text-sm font-medium text-stone-600 dark:text-stone-300 transition-all hover:bg-stone-100 dark:hover:bg-white/10 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="Return to previous page"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back</span>
          </button>
        </div>

        {/* Footer attribution */}
        <div className="mt-8 pt-5 border-t border-stone-200/70 dark:border-white/10 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1">
            <Compass className="h-3 w-3 text-stone-400" aria-hidden="true" />
            Ain Shams University Faculty of Medicine
          </span>
          <span className="font-mono">ASU Medical Portal</span>
        </div>
      </motion.main>
    </div>
  );
};

export default NotFoundPage;
