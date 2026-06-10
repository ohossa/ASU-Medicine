// src/app/components/ui/StackedCarousel.tsx
// Improvements:
//  - useCallback on handleKeyDown so the effect dep array is stable
//  - handleDragEnd typed properly (no `any` on event, Framer Motion PanInfo)
//  - lastScrollTime stored in a ref instead of state (avoids unnecessary re-render)
//  - absOffset > 2 keeps DOM lighter (was > 3, renders 5 cards unnecessarily)
//  - Keyboard listener scoped to container, not window, when possible
//  - Added aria-roledescription for screen readers

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
  disabled?: boolean;
}

interface StackedCarouselProps {
  items: CarouselItem[];
  onSelect: (id: string | number) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export function StackedCarousel({ items, onSelect, activeIndex, setActiveIndex }: StackedCarouselProps) {
  const [isHovered,       setIsHovered]       = useState(false);
  const lastScrollTimeRef = useRef(0);
  const containerRef      = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setActiveIndex(Math.max(activeIndex - 1, 0)), [activeIndex, setActiveIndex]);
  const next = useCallback(() => setActiveIndex(Math.min(activeIndex + 1, items.length - 1)), [activeIndex, items.length, setActiveIndex]);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
  }, [next, prev]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'Enter') {
      if (!items[activeIndex]?.disabled) onSelect(items[activeIndex].id);
    }
  }, [activeIndex, items, next, prev, onSelect]);

  useEffect(() => {
    const el = containerRef.current ?? window;
    el.addEventListener('keydown', handleKeyDown as EventListener);
    return () => el.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [handleKeyDown]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 15) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 350) return;
    lastScrollTimeRef.current = now;
    if (delta > 0) next(); else prev();
  }, [next, prev]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] flex items-center justify-center overflow-hidden touch-pan-y outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
      tabIndex={0}
      role="listbox"
      aria-label="Select item"
      aria-roledescription="carousel"
    >
      <div
        className="relative w-full max-w-[340px] h-[290px] flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {items.map((item, index) => {
          const offset    = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive  = offset === 0;

          if (absOffset > 2) return null; // Only render ±2 cards for DOM efficiency

          const sign    = Math.sign(offset);
          const x       = offset * 155;
          const z       = absOffset * -90;
          const rotateY = sign * -18;
          const scale   = 1 - absOffset * 0.1;
          const opacity = 1 - absOffset * 0.3;

          return (
            <motion.div
              key={item.id}
              role="option"
              aria-selected={isActive}
              aria-label={`Item ${index + 1} of ${items.length}`}
              className={`absolute inset-0 will-change-transform transform-gpu
                          ${item.disabled && isActive ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              style={{ touchAction: 'pan-y', WebkitBackfaceVisibility: 'hidden' }}
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ x, z, rotateY, scale, opacity, zIndex: items.length - absOffset }}
              transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (item.disabled) return;
                if (isActive) onSelect(item.id);
                else setActiveIndex(index);
              }}
            >
              <div
                className={`w-full h-full rounded-[30px] overflow-hidden transition-shadow duration-300
                             ${isActive
                               ? item.disabled
                                 ? 'shadow-lg border border-border'
                                 : 'shadow-2xl shadow-physiology/15 border border-physiology/25 dark:border-physiology/15'
                               : 'shadow-md border border-transparent'}`}
                style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
              >
                {item.content}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-x-3 md:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-50">
        {[
          { label: 'Previous', action: prev, show: isHovered && activeIndex > 0, translate: '-20px', icon: ChevronLeft },
          { label: 'Next',     action: next, show: isHovered && activeIndex < items.length - 1, translate: '20px', icon: ChevronRight },
        ].map(({ label, action, show, translate, icon: Icon }) => (
          <motion.button
            key={label}
            aria-label={label}
            className="w-11 h-11 rounded-full bg-black/6 dark:bg-white/6 backdrop-blur-md
                       border border-black/10 dark:border-white/10 flex items-center justify-center
                       text-foreground pointer-events-auto hover:bg-black/10 dark:hover:bg-white/10
                       transition-colors disabled:pointer-events-none"
            initial={{ opacity: 0, x: translate }}
            animate={{ opacity: show ? 1 : 0, x: show ? '0px' : translate }}
            onClick={action}
          >
            <Icon size={22} />
          </motion.button>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to item ${i + 1}`}
            className={`transition-all duration-300 rounded-full
                        ${i === activeIndex
                          ? 'w-5 h-1.5 bg-foreground shadow-sm'
                          : 'w-1.5 h-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60'}`}
          />
        ))}
      </div>
    </div>
  );
}
