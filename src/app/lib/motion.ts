import type { Variants, Transition } from 'motion/react';

export const spring: Transition = { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 };

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  enter: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { ...spring, when: 'beforeChildren' } },
  exit: { opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.2 } },
};

export const stagger: Variants = {
  enter: { transition: { staggerChildren: 0.05 } },
};

export const item: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: spring },
};

export const press = { whileTap: { scale: 0.96 }, whileHover: { scale: 1.03 }, transition: spring };
