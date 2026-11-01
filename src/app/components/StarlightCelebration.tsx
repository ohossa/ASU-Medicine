import { useEffect, useState, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../hooks/useTheme';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  rotation: number;
  rotSpeed: number;
  kind: 'heart' | 'star';
  color: string;
  alpha: number;
}

export function triggerStarlightBurst(x?: number, y?: number) {
  if (typeof window === 'undefined') return;
  const originX = x ?? window.innerWidth / 2;
  const originY = y ?? window.innerHeight / 2;
  window.dispatchEvent(
    new CustomEvent('starlight:celebrate', {
      detail: { x: originX, y: originY },
    }),
  );
}

export function StarlightCelebration() {
  const { isStarlight } = useTheme();
  const reducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  const spawnBurst = useCallback((originX: number, originY: number) => {
    if (reducedMotion) return;

    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#c084fc', '#fdf4ff'];
    const count = 18;
    const newParticles: SparkleParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 4.5;
      newParticles.push({
        id: Date.now() + Math.random(),
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        scale: 0.6 + Math.random() * 0.8,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        kind: Math.random() > 0.45 ? 'heart' : 'star',
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }

    setParticles((prev) => [...prev.slice(-40), ...newParticles]);
  }, [reducedMotion]);

  useEffect(() => {
    if (!isStarlight) return;

    const onCelebrate = (e: Event) => {
      const custom = e as CustomEvent<{ x: number; y: number }>;
      spawnBurst(custom.detail?.x, custom.detail?.y);
    };

    window.addEventListener('starlight:celebrate', onCelebrate);
    return () => window.removeEventListener('starlight:celebrate', onCelebrate);
  }, [isStarlight, spawnBurst]);

  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.14, // Gravity
            rotation: p.rotation + p.rotSpeed,
            alpha: p.alpha - 0.035, // Smooth fade
          }))
          .filter((p) => p.alpha > 0.05),
      );
    }, 25);

    return () => clearInterval(timer);
  }, [particles.length]);

  if (!isStarlight || particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`,
            opacity: p.alpha,
            color: p.color,
            fontSize: p.kind === 'heart' ? '18px' : '15px',
            lineHeight: 1,
            userSelect: 'none',
            filter: `drop-shadow(0 0 6px ${p.color})`,
          }}
        >
          {p.kind === 'heart' ? '💖' : '✨'}
        </span>
      ))}
    </div>
  );
}
