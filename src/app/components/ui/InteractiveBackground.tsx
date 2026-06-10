import { useEffect, useState } from 'react';

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      // Use requestAnimationFrame for smooth 60fps updates
      requestAnimationFrame(() => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
      });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base faint dots */}
      <div className="absolute inset-0 dot-pattern opacity-60 dark:opacity-40" />
      
      {/* Interactive cursor spotlight */}
      <div 
        className="absolute inset-0 dot-pattern opacity-100"
        style={{
          WebkitMaskImage: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 80%)`,
          maskImage: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 80%)`,
        }}
      />
    </div>
  );
}
