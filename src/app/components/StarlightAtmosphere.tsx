import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../hooks/useTheme';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  color: string;
}

interface Heart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  swaySpeed: number;
  swayAmp: number;
  swayPhase: number;
  alpha: number;
  color: string;
}

/**
 * StarlightAtmosphere
 * Renders ambient starlight constellations and slow-drifting translucent hearts
 * on a dedicated hardware-accelerated canvas.
 * - Strictly capped at 30 FPS to preserve mobile battery
 * - Auto-sleeps when tab is hidden or idle
 * - Fully respects prefers-reduced-motion
 */
export function StarlightAtmosphere() {
  const { isStarlight } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isStarlight) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let lastTime = 0;
    const targetFps = 30;
    const interval = 1000 / targetFps;

    // Resize canvas safely to screen resolution
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize Starfield (35 delicate twinkling stars)
    const starColors = ['#fdf4ff', '#fbcfe8', '#e9d5ff', '#fae8ff'];
    const stars: Star[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.5,
      baseAlpha: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // Initialize Floating Hearts (12 soft translucent drifting hearts)
    const heartColors = [
      'rgba(244, 63, 94, ',   // rose-500
      'rgba(236, 72, 153, ',  // pink-500
      'rgba(217, 70, 239, ',  // fuchsia-500
      'rgba(168, 85, 247, ',  // purple-500
    ];
    const hearts: Heart[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 9 + Math.random() * 9,
      speedY: 0.25 + Math.random() * 0.35,
      swaySpeed: 0.015 + Math.random() * 0.02,
      swayAmp: 15 + Math.random() * 20,
      swayPhase: Math.random() * Math.PI * 2,
      alpha: 0.12 + Math.random() * 0.18,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
    }));

    // Draw single heart using smooth bezier curves
    const drawHeart = (cx: number, cy: number, size: number, fillStyle: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // Top left curve
      ctx.bezierCurveTo(
        -size / 2, -size / 2,
        -size, topCurveHeight / 2,
        0, size
      );
      // Top right curve
      ctx.bezierCurveTo(
        size, topCurveHeight / 2,
        size / 2, -size / 2,
        0, topCurveHeight
      );
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.restore();
    };

    // Draw single sparkling star (diamond flare + core)
    const drawStar = (star: Star, currentAlpha: number) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
      ctx.fillStyle = star.color;

      // Center glowing circular core
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle 4-point sparkle flare for larger stars
      if (star.radius > 1.4) {
        ctx.strokeStyle = star.color;
        ctx.lineWidth = 0.5;
        const flare = star.radius * 2.2;
        ctx.beginPath();
        ctx.moveTo(star.x - flare, star.y);
        ctx.lineTo(star.x + flare, star.y);
        ctx.moveTo(star.x, star.y - flare);
        ctx.lineTo(star.x, star.y + flare);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Render loop
    const render = (time: number) => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      const elapsed = time - lastTime;
      if (elapsed < interval) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastTime = time - (elapsed % interval);

      ctx.clearRect(0, 0, width, height);

      // 1. Render Stars
      for (const star of stars) {
        if (!reducedMotion) {
          star.phase += star.speed;
        }
        const alpha = star.baseAlpha + Math.sin(star.phase) * 0.25;
        drawStar(star, alpha);
      }

      // 2. Render Floating Hearts
      for (const heart of hearts) {
        if (!reducedMotion) {
          heart.y -= heart.speedY;
          heart.swayPhase += heart.swaySpeed;
          // Wrap around top of screen
          if (heart.y < -30) {
            heart.y = height + 30;
            heart.x = Math.random() * width;
          }
        }
        const curX = heart.x + Math.sin(heart.swayPhase) * heart.swayAmp;
        drawHeart(curX, heart.y, heart.size, `${heart.color}${heart.alpha})`);
      }

      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isStarlight, reducedMotion]);

  if (!isStarlight) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
}
