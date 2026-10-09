import { useState, useCallback, useEffect } from 'react';
import { play, preloadSounds } from '../lib/soundEngine';
import { feedbackSoundEnabled, setFeedbackSoundEnabled } from '../lib/audioPolicy';

export type SoundKey = 'correct' | 'wrong' | 'combo' | 'timer' | 'perfect';

export function useSoundEngine() {
  const [muted, setMuted] = useState(() => !feedbackSoundEnabled());

  useEffect(() => { if (!muted) preloadSounds(); }, [muted]);

  const trigger = useCallback(
    (key: SoundKey, volume = 0.35) => {
      if (muted) return;
      play(key, volume);
    },
    [muted]
  );

  const toggleMute = useCallback(() => {
    const next = !feedbackSoundEnabled();
    setFeedbackSoundEnabled(next);
    setMuted(!next);
  }, []);

  return { trigger, muted, toggleMute };
}