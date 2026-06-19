import { useState, useCallback, useEffect } from 'react';
import { play, preloadSounds } from '../lib/soundEngine';

export type SoundKey = 'correct' | 'wrong' | 'combo' | 'timer' | 'perfect';

export function useSoundEngine() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    preloadSounds();
    try { setMuted(localStorage.getItem('asu_sound_muted') === 'true'); } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('asu_sound_muted', String(muted)); } catch {}
  }, [muted]);

  const trigger = useCallback(
    (key: SoundKey, volume = 0.35) => {
      if (muted) return;
      play(key, volume);
    },
    [muted]
  );

  const toggleMute = useCallback(() => setMuted(m => !m), []);

  return { trigger, muted, toggleMute };
}