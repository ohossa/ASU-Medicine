import { useEffect, useRef } from 'react';
import { useProgress } from '../hooks/useProgress';

export function SoundManagerComponent() {
  const { lastLevelUp } = useProgress();
  const prevLevelUp = useRef(lastLevelUp);

  useEffect(() => {
    if (lastLevelUp > prevLevelUp.current) {
      import('../lib/sound').then(({ sound }) => {
        sound.levelUp();
      });
    }
    prevLevelUp.current = lastLevelUp;
  }, [lastLevelUp]);

  return null;
}
