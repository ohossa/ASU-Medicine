import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StackedCarouselProps {
  items: {
    id: string | number;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  onSelect: (id: string | number) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export function StackedCarousel({ items, onSelect, activeIndex, setActiveIndex }: StackedCarouselProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipeThreshold = 40;
    if (offset.x < -swipeThreshold) {
      setActiveIndex(Math.min(activeIndex + 1, items.length - 1));
    } else if (offset.x > swipeThreshold) {
      setActiveIndex(Math.max(activeIndex - 1, 0));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setActiveIndex(Math.min(activeIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowLeft') {
      setActiveIndex(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter') {
      if (!items[activeIndex].disabled) {
        onSelect(items[activeIndex].id);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items]);

  const handleWheel = (e: React.WheelEvent) => {
    // Prefer horizontal scrolling but allow vertical if they have a standard mouse wheel
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    
    // Ignore tiny accidental scrolls
    if (Math.abs(delta) < 15) return;

    const now = Date.now();
    // 350ms cooldown so a single fast swipe doesn't skip 3 cards
    if (now - lastScrollTime < 350) return;

    if (delta > 0) {
      setActiveIndex(Math.min(activeIndex + 1, items.length - 1));
      setLastScrollTime(now);
    } else {
      setActiveIndex(Math.max(activeIndex - 1, 0));
      setLastScrollTime(now);
    }
  };

  return (
    <div 
      className="relative w-full h-[450px] flex items-center justify-center overflow-hidden touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
    >
      <div className="relative w-full max-w-[320px] h-[340px] flex items-center justify-center" style={{ perspective: '1200px' }}>
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;

          if (absOffset > 3) return null;

          // Apple Music Style Cover Flow Math
          const sign = Math.sign(offset);
          const x = offset * 140; // Distance between cards
          const z = absOffset * -100; // Push back
          const rotateY = sign * -20; // Tilt towards center
          const scale = 1 - (absOffset * 0.1);
          const opacity = 1 - (absOffset * 0.3);

          return (
            <motion.div
              key={item.id}
              className={`absolute inset-0 cursor-pointer will-change-transform transform-gpu ${
                item.disabled && isActive ? 'cursor-not-allowed' : ''
              }`}
              style={{ touchAction: 'pan-y', WebkitBackfaceVisibility: 'hidden' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                x,
                z,
                rotateY,
                scale,
                opacity,
                zIndex: items.length - absOffset,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 1
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (isActive && !item.disabled) {
                  onSelect(item.id);
                } else if (!isActive) {
                  setActiveIndex(index);
                }
              }}
            >
              <div 
                className={`w-full h-full rounded-[32px] overflow-hidden transition-shadow duration-300 ${
                  isActive 
                    ? (item.disabled ? 'shadow-lg border border-gray-200 dark:border-gray-800' : 'shadow-2xl shadow-physiology/20 border border-physiology/30 dark:border-physiology/20') 
                    : 'shadow-md border border-transparent'
                }`}
                style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
              >
                {item.content}
              </div>
              
              {/* Active Selection Indicator */}
              {isActive && !item.disabled && (
                 <motion.div 
                   className="absolute -bottom-8 left-1/2 -translate-x-1/2"
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                 >
                   <div className="w-1.5 h-1.5 rounded-full bg-physiology dark:bg-physiology-light shadow-[0_0_8px_rgba(255,255,255,0.8)] shadow-physiology" />
                 </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-4 md:inset-x-10 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-50">
        <motion.button
          className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-800 dark:text-white pointer-events-auto hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isHovered && activeIndex > 0 ? 1 : 0, x: isHovered && activeIndex > 0 ? 0 : -20 }}
          onClick={() => setActiveIndex(Math.max(activeIndex - 1, 0))}
          disabled={activeIndex === 0}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <motion.button
          className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-800 dark:text-white pointer-events-auto hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered && activeIndex < items.length - 1 ? 1 : 0, x: isHovered && activeIndex < items.length - 1 ? 0 : 20 }}
          onClick={() => setActiveIndex(Math.min(activeIndex + 1, items.length - 1))}
          disabled={activeIndex === items.length - 1}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
}
