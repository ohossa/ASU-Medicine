import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { formatTime } from '../types';

interface QuizResumeCardProps {
  open: boolean;
  current: number;
  total: number;
  elapsedSeconds: number;
  answeredCount: number;
  onResume: () => void;
  onRestart: () => void;
}

export default function QuizResumeCard({
  open,
  current,
  total,
  elapsedSeconds,
  answeredCount,
  onResume,
  onRestart,
}: QuizResumeCardProps) {
  const remaining = total - answeredCount;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onRestart();
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-full max-w-sm rounded-[28px] border border-white/[0.08] bg-white/90 dark:bg-[#161618]/95 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle size={18} className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Resume Session</h3>
                <p className="text-[11px] text-gray-500 dark:text-white/50">You have an unfinished quiz</p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.03] p-3 text-center">
                <div className="text-lg font-bold tabular-nums text-gray-900 dark:text-white">{current + 1}</div>
                <div className="text-[10px] font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Question</div>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.03] p-3 text-center">
                <div className="text-lg font-bold tabular-nums text-gray-900 dark:text-white">{answeredCount}</div>
                <div className="text-[10px] font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Answered</div>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.03] p-3 text-center">
                <div className="text-lg font-bold tabular-nums text-amber-500">{remaining}</div>
                <div className="text-[10px] font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Remaining</div>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.03] px-3 py-2.5">
              <Clock size={14} className="text-gray-500 dark:text-white/50" />
              <span className="text-xs font-semibold text-gray-700 dark:text-white/70 tabular-nums">{formatTime(elapsedSeconds)} elapsed</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={onResume}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors active:scale-[0.98]"
              >
                <Play size={16} /> Resume from Q{current + 1}
              </button>
              <button
                onClick={onRestart}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-5 py-3 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors active:scale-[0.98]"
              >
                <RotateCcw size={15} /> Start Fresh
              </button>
            </div>

            <p className="mt-3 text-center text-[10px] text-gray-400 dark:text-white/30">
              Your session is saved to the cloud — resume on any device
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
