// Framework-agnostic singleton. The canvas reads fields directly each frame;
// React UI subscribes for discrete state (streak, level-up).
export type Mood = 'idle' | 'correct' | 'wrong' | 'streak' | 'focus' | 'celebrate';

export interface Burst {
  x: number;
  y: number;
  kind: 'correct' | 'wrong' | 'levelup';
  t: number; // 0..1 life, advanced by the canvas
}

class PulseEngine {
  /** Ambient intensity 0..1 — drives node density, glow, flow speed. */
  energy = 0.35;
  /** Current emotional state of the field. */
  mood: Mood = 'idle';
  /** Live answer streak. */
  streak = 0;
  /** 0..1 — how close the question timer is to expiring. Drives ECG + red tint. */
  timerUrgency = 0;
  /** Transient ripples the canvas renders and consumes. */
  bursts: Burst[] = [];

  private moodTimeout: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<() => void>();

  setMood(m: Mood, ttlMs = 1200) {
    this.mood = m;
    if (this.moodTimeout) clearTimeout(this.moodTimeout);
    if (m !== 'idle' && m !== 'focus') {
      this.moodTimeout = setTimeout(() => {
        this.mood = this.streak >= 3 ? 'streak' : 'idle';
        this.notify();
      }, ttlMs);
    }
    this.notify();
  }

  setEnergy(e: number) { this.energy = Math.max(0, Math.min(1, e)); }
  setUrgency(u: number) { this.timerUrgency = Math.max(0, Math.min(1, u)); }

  setStreak(s: number) {
    this.streak = s;
    // Energy ramps with streak: a hot run lights the whole field up.
    this.setEnergy(0.35 + Math.min(s, 12) * 0.05);
    this.notify();
  }

  burst(x: number, y: number, kind: Burst['kind']) {
    this.bursts.push({ x, y, kind, t: 0 });
    if (this.bursts.length > 24) this.bursts.shift();
  }

  // --- React store interface (useSyncExternalStore) ---
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getSnapshot = () => `${this.mood}:${this.streak}`; // cheap stable snapshot
  private notify() { this.listeners.forEach((l) => l()); }
}

export const pulse = new PulseEngine();

// Convenience emitters for quiz logic — import these, not the canvas.
export const fx = {
  correct(x: number, y: number, streak: number) {
    pulse.setStreak(streak);
    pulse.setMood(streak >= 3 ? 'streak' : 'correct');
    pulse.burst(x, y, 'correct');
  },
  wrong(x: number, y: number) {
    pulse.setStreak(0);
    pulse.setMood('wrong');
    pulse.burst(x, y, 'wrong');
  },
  timer(remaining: number, total: number) {
    pulse.setUrgency(total > 0 ? 1 - remaining / total : 0);
  },
  focus(on: boolean) { pulse.setMood(on ? 'focus' : 'idle', 0); },
  complete() { pulse.setMood('celebrate', 3000); },
};
