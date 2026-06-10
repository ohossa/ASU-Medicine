// src/app/components/ui/InteractiveBackground.tsx
// Improvements:
//  - Respects prefers-reduced-motion (skips mousemove listener entirely)
//  - Uses requestAnimationFrame for smooth 60fps updates instead of direct DOM style writes
//  - Cleans up both listener and rAF frame on unmount
//  - No React state — pure DOM mutation for perf
//  - dot-pattern defined in theme.css so color automatically follows theme

import { useEffect, useRef } from 'react';

export function InteractiveBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | null>(null);
  const posRef       = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Don't add listener if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = spotlightRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (rafRef.current !== null) return; // already scheduled
      rafRef.current = requestAnimationFrame(() => {
        if (el) {
          const { x, y } = posRef.current;
          el.style.webkitMaskImage = `radial-gradient(600px circle at ${x}px ${y}px, black 0%, transparent 80%)`;
          el.style.maskImage       = `radial-gradient(600px circle at ${x}px ${y}px, black 0%, transparent 80%)`;
        }
        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base dot grid — low opacity */}
      <div className="absolute inset-0 dot-pattern text-gray-400/30 dark:text-gray-600/20 opacity-100" />

      {/* Spotlight overlay — follows cursor */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 dot-pattern text-gray-500/50 dark:text-gray-400/30"
        style={{
          // Start with mask at an invisible position; updated via JS
          WebkitMaskImage: 'radial-gradient(600px circle at -9999px -9999px, black 0%, transparent 80%)',
          maskImage:        'radial-gradient(600px circle at -9999px -9999px, black 0%, transparent 80%)',
          willChange:       'mask-image',
        }}
      />
    </div>
  );
}
