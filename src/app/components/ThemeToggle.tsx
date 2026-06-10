import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  // Sound effect using Web Audio API for a crisp, low-latency click
  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Create a short, premium "thock" or "tick" sound
      // Varies slightly based on direction for realism
      if (isDark) {
        // Switching to Light (higher pitch)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      } else {
        // Switching to Dark (lower pitch)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      }

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.error('Audio play failed', e);
    }
  };

  const handleToggle = () => {
    playClickSound();
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
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      role="switch"
      aria-checked={!isDark}
      aria-label="Toggle Dark Mode"
    >
      {/* Sliding Thumb */}
      <motion.div
        className="relative flex h-7 w-7 items-center justify-center rounded-full shadow-lg"
        // Thumb Position: Left for Dark (0px), Right for Light (32px)
        animate={{
          x: isDark ? 0 : 32,
          backgroundColor: isDark ? '#2c2c2c' : '#ffffff',
          boxShadow: isDark 
            ? '0px 2px 6px rgba(0,0,0,0.6), 0 0 4px rgba(100, 100, 255, 0.1)' // Cool glow in dark
            : '0px 2px 6px rgba(0,0,0,0.2), 0 0 6px rgba(255, 200, 0, 0.3)', // Warm glow in light
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
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
                transition={{ duration: 0.2 }}
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
                transition={{ duration: 0.2 }}
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
