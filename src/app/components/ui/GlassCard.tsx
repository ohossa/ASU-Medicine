import { motion } from 'framer-motion';
import { cn } from './utils';
import { spring } from '../../lib/motion';
import type { ReactNode } from 'react';

export function GlassCard({ children, className, interactive = true }: {
  children: ReactNode; className?: string; interactive?: boolean
}) {
  return (
    <motion.div
      {...(interactive ? { whileHover: { y: -4 }, transition: spring } : {})}
      className={cn(
        'rounded-3xl border p-6 bg-white/80 dark:bg-[#141414]/80 backdrop-blur-sm',
        'border-zinc-200/80 dark:border-white/[0.07]',
        'transition-all duration-300 hover:-translate-y-1',
        'hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
