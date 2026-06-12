import { useEffect, useRef } from 'react';
import { pulse } from '../lib/pulseEngine';

/** A live heart-rate line. Speeds up + reddens as the quiz timer runs down. */
export function ECGMonitor({ height = 48 }: { height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let W = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      W = canvas.clientWidth;
      canvas.width = W * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Classic PQRST beat shape sampled as normalized [x, y] (y: 0 top .. 1 bottom)
    const beat = (p: number) => {
      if (p < 0.15) return 0.5;
      if (p < 0.20) return 0.5 - (p - 0.15) * 4;      // P
      if (p < 0.30) return 0.5;
      if (p < 0.34) return 0.5 + (p - 0.30) * 6;      // Q dip
      if (p < 0.38) return 0.74 - (p - 0.34) * 16;    // R spike up
      if (p < 0.42) return 0.10 + (p - 0.38) * 14;    // back down (S)
      if (p < 0.55) return 0.5;
      if (p < 0.70) return 0.5 - Math.sin(((p - 0.55) / 0.15) * Math.PI) * 0.18; // T
      return 0.5;
    };

    let phase = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const urgency = pulse.timerUrgency;
      const speed = reduced ? 0.0 : 0.006 + urgency * 0.02;
      phase = (phase + speed) % 1;
      ctx.clearRect(0, 0, W, height);
      const isDark = document.documentElement.classList.contains('dark');
      const calm = isDark ? '#2dd4bf' : '#10b981';
      const color = urgency > 0.6 ? '#f43f5e' : calm;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.beginPath();
      const cycles = 2;
      for (let px = 0; px <= W; px++) {
        const p = ((px / W) * cycles + phase) % 1;
        const y = beat(p) * height;
        px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
      ctx.stroke();
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [height]);

  return <canvas ref={ref} style={{ width: '100%', height, display: 'block' }} />;
}
