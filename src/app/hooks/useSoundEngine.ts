import { useState, useCallback, useEffect, useRef } from 'react';
import { play, preloadSounds } from '../lib/soundEngine';

export type SoundKey = 'correct' | 'wrong' | 'combo' | 'timer' | 'perfect';

function getInitialMuted(): boolean {
  try {
    const stored = localStorage.getItem('asu_sound_muted');
    return stored === 'true';
  } catch { /* no-op */ }
  return false;
}

export function useSoundEngine() {
  const [muted, setMuted] = useState(getInitialMuted);
  const isFirstRender = useRef(true);

  useEffect(() => {
    preloadSounds();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try { localStorage.setItem('asu_sound_muted', String(muted)); } catch { /* no-op */ }
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