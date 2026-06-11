import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = language === 'ar';

  const handleToggle = () => {
    toggleLanguage();
  };

  return (
    <motion.div
      className="relative flex h-8 w-16 cursor-pointer items-center rounded-full p-0.5 shadow-inner ring-1 ring-black/5 dark:ring-white/10"
      onClick={handleToggle}
      // Track Background Color Animation follows the theme mode
      animate={{
        backgroundColor: isDark ? 'rgba(30, 30, 35, 1)' : 'rgba(220, 220, 225, 1)',
        boxShadow: isDark 
          ? 'inset 0px 2px 4px rgba(0,0,0,0.5)' 
          : 'inset 0px 2px 4px rgba(0,0,0,0.1)',
      }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      role="switch"
      aria-checked={isArabic}
      aria-label="Toggle Language"
    >
      {/* Sliding Thumb */}
      <motion.div
        className="relative flex h-7 w-7 items-center justify-center rounded-full shadow-lg"
        animate={{
          x: isArabic ? 32 : 0,
          backgroundColor: isDark ? '#2c2c2c' : '#ffffff',
          boxShadow: isDark 
            ? '0px 2px 6px rgba(0,0,0,0.6), 0 0 4px rgba(100, 100, 255, 0.1)'
            : '0px 2px 6px rgba(0,0,0,0.2), 0 0 6px rgba(100, 100, 255, 0.15)',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Character Text inside Thumb with Rotation/Scale Animation */}
        <div className="relative h-5 w-5 flex items-center justify-center select-none">
          <AnimatePresence mode="wait">
            {!isArabic ? (
              <motion.span
                key="en"
                className="absolute inset-0 flex items-center justify-center text-sm font-bold text-physiology font-manrope"
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                A
              </motion.span>
            ) : (
              <motion.span
                key="ar"
                className="absolute inset-0 flex items-center justify-center text-base font-black text-anatomy font-archivo"
                initial={{ scale: 0, rotate: 90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                ع
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
