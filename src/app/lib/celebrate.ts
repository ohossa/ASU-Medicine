import confetti from 'canvas-confetti';
import { FX } from './fx.config';
import { getConfettiColors } from './confettiConfig';

export function celebrate(opts?: { perfect?: boolean; moduleCode?: string }) {
  if (!FX.confetti) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const moduleCode = opts?.moduleCode ?? 'default';
  const isPerfect = opts?.perfect ?? false;
  const colors = getConfettiColors(moduleCode, isPerfect);
  const burst = (particleRatio: number, o: confetti.Options) =>
    confetti({ origin: { y: 0.7 }, colors, ...o, particleCount: Math.floor(200 * particleRatio) });
  
  burst(0.25, { spread: 26, startVelocity: 55 });
  burst(0.2, { spread: 60 });
  burst(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  
  if (opts?.perfect) {
    burst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    burst(0.1, { spread: 120, startVelocity: 45 });
  }
}