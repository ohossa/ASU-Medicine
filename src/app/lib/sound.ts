import { FX } from './fx.config';

// Tiny WebAudio synth — no asset files. Respects a persisted mute pref.
class SoundManager {
  private ctx: AudioContext | null = null;
  muted = localStorage.getItem('fx.muted') === '1';

  private ac() {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    return this.ctx;
  }
  setMuted(m: boolean) { this.muted = m; localStorage.setItem('fx.muted', m ? '1' : '0'); }

  private tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.06) {
    if (!FX.sound || this.muted) return;
    try {
      const ac = this.ac();
      if (ac.state === 'suspended') {
        ac.resume();
      }
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(gain, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      osc.connect(g).connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + dur);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  correct() { this.tone(660, 0.12); setTimeout(() => this.tone(880, 0.15), 90); }
  wrong() { this.tone(180, 0.25, 'sawtooth', 0.05); }
  levelUp() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.18), i * 90)); }
  tick() { this.tone(1200, 0.04, 'square', 0.03); }
}

export const sound = new SoundManager();
