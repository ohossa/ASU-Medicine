import { useEffect, useRef } from 'react';

export function InteractiveBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const updateMousePosition = (ev: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (spotlightRef.current) {
          const maskStr = `radial-gradient(600px circle at ${ev.clientX}px ${ev.clientY}px, black 0%, rgba(0,0,0,0) 80%)`;
          spotlightRef.current.style.WebkitMaskImage = maskStr;
          spotlightRef.current.style.maskImage = maskStr;
        }
      });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base faint dots */}
      <div className="absolute inset-0 dot-pattern opacity-80 dark:opacity-60" />
      
      {/* Interactive cursor spotlight */}
      <div 
        ref={spotlightRef}
        className="absolute inset-0 dot-pattern opacity-100"
        style={{
          WebkitMaskImage: `radial-gradient(600px circle at 0px 0px, black 0%, rgba(0,0,0,0) 80%)`,
          maskImage: `radial-gradient(600px circle at 0px 0px, black 0%, rgba(0,0,0,0) 80%)`,
        }}
      />
    </div>
  );
}
