import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <motion.div
      className="relative flex h-8 w-16 cursor-pointer items-center rounded-full p-0.5 shadow-inner ring-1 ring-black/5 dark:ring-white/10"
      onClick={handleToggle}
      // Track Background Color Animation
      animate={{
        backgroundColor: isDark ? 'rgba(30, 30, 35, 1)' : 'rgba(220, 220, 225, 1)',
        boxShadow: isDark 
          ? 'inset 0px 2px 4px rgba(0,0,0,0.5)' 
          : 'inset 0px 2px 4px rgba(0,0,0,0.1)',
      }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      role="switch"
      aria-checked={!isDark}
      aria-label="Toggle Dark Mode"
    >
      {/* Sliding Thumb */}
      <motion.div
        className="relative flex h-7 w-7 items-center justify-center rounded-full shadow-lg"
        // Thumb Position: In LTR, right is 32.
        animate={{
          x: isDark ? 0 : 32,
          backgroundColor: isDark ? '#2c2c2c' : '#ffffff',
          boxShadow: isDark 
            ? '0px 2px 6px rgba(0,0,0,0.6), 0 0 4px rgba(100, 100, 255, 0.1)' // Cool glow in dark
            : '0px 2px 6px rgba(0,0,0,0.2), 0 0 6px rgba(255, 200, 0, 0.3)', // Warm glow in light
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Icon Container with Rotation/Scale Animation */}
        <div className="relative h-4.5 w-4.5">
          <AnimatePresence mode="wait">
            {!isDark ? (
              <motion.div
                key="sun"
                className="absolute inset-0 flex items-center justify-center text-amber-500"
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Sun className="h-full w-full fill-current" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                className="absolute inset-0 flex items-center justify-center text-blue-200"
                initial={{ scale: 0, rotate: 90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Moon className="h-full w-full fill-current" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
