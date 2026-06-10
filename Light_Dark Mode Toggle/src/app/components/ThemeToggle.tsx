import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggleTheme }) => {
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
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      } else {
        // Switching to Dark (lower pitch)
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      }

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const handleToggle = () => {
    playClickSound();
    toggleTheme();
  };

  return (
    <motion.div
      className="relative flex h-[60px] w-[120px] cursor-pointer items-center rounded-full p-1 shadow-inner ring-1 ring-black/5 dark:ring-white/10"
      onClick={handleToggle}
      // Track Background Color Animation
      animate={{
        backgroundColor: isDark ? "rgba(30, 30, 35, 1)" : "rgba(220, 220, 225, 1)",
        boxShadow: isDark 
          ? "inset 0px 4px 8px rgba(0,0,0,0.5)" 
          : "inset 0px 4px 8px rgba(0,0,0,0.1)",
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      role="switch"
      aria-checked={!isDark}
      aria-label="Toggle Dark Mode"
    >
      {/* Background Icons (Decorative indicators on the track) */}
      <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold">
        <span className="opacity-0"></span> {/* Spacer */}
      </div>

      {/* Sliding Thumb */}
      <motion.div
        className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full shadow-lg"
        // Thumb Position: Left for Dark, Right for Light
        animate={{
          x: isDark ? 0 : 60,
          backgroundColor: isDark ? "#2c2c2c" : "#ffffff",
          boxShadow: isDark 
            ? "0px 4px 12px rgba(0,0,0,0.6), 0 0 10px rgba(100, 100, 255, 0.1)" // Cool glow in dark
            : "0px 4px 12px rgba(0,0,0,0.2), 0 0 15px rgba(255, 200, 0, 0.3)", // Warm glow in light
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        {/* Icon Container with Rotation/Scale Animation */}
        <div className="relative h-6 w-6">
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
                <Sun className="h-full w-full fill-current" strokeWidth={2} />
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
                <Moon className="h-full w-full fill-current" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
