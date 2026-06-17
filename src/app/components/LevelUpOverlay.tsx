import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useProgress } from '../store/progress';
import { spring } from '../lib/motion';

export function LevelUpOverlay() {
  const { level, lastLevelUp } = useProgress();
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (!lastLevelUp) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, [lastLevelUp]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.6, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={spring}
            className="rounded-3xl px-10 py-6 text-center backdrop-blur-2xl bg-white/10 border border-white/20 shadow-lg"
          >
            <div className="text-5xl mb-2">🧬</div>
            <div className="text-2xl font-bold text-teal-300">Level {level}</div>
            <div className="text-sm opacity-70">Vitals rising — keep going!</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
