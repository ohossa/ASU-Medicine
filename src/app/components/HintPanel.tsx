/**
 * HintPanel.tsx
 *
 * A premium hint display that slides in below a question when a student
 * has answered incorrectly twice. Uses Framer Motion for entrance/exit.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Loader2, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Hint } from '../hooks/useHintSystem';

interface Props {
  hint: Hint | null;
  loading: boolean;
  error: string | null;
  visible: boolean;
  onDismiss?: () => void;
}

const t = {
  en: {
    title: 'Need a hint?',
    aiHint: 'AI Tutor Hint',
    staticHint: 'Study Hint',
    error: 'Could not load hint',
    dismiss: 'Dismiss',
  },
  ar: {
    title: 'هل تحتاج تلميح؟',
    aiHint: 'تلميح من AI',
    staticHint: 'تلميح دراسي',
    error: 'تعذر تحميل التلميح',
    dismiss: 'إخفاء',
  },
};

export function HintPanel({ hint, loading, error, visible, onDismiss }: Props) {
  const { language } = useLanguage();
  const txt = t[language] || t.en;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 12, height: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="mt-5 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/[0.04] p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-amber-500" />
                ) : error ? (
                  <AlertCircle size={18} className="text-rose-500" />
                ) : (
                  <Lightbulb size={18} className="text-amber-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    {hint?.source === 'static' ? txt.staticHint : txt.aiHint}
                  </p>
                  {onDismiss && !loading && (
                    <button
                      type="button"
                      onClick={onDismiss}
                      className="p-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                      aria-label={txt.dismiss}
                    >
                      <X size={14} className="text-amber-600 dark:text-amber-300" />
                    </button>
                  )}
                </div>

                {loading && (
                  <p className="text-sm text-amber-800 dark:text-amber-200/80 animate-pulse">
                    {txt.title}…
                  </p>
                )}

                {error && !loading && (
                  <p className="text-sm text-rose-700 dark:text-rose-300">{txt.error}: {error}</p>
                )}

                {hint && !loading && !error && (
                  <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100/80">
                    {hint.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
