import { useEffect } from 'react';
import { pulse } from '../lib/pulseEngine';

export function ConfettiManager() {
  useEffect(() => {
    const unsubscribe = pulse.subscribe(() => {
      const snapshot = pulse.getSnapshot();
      const [mood] = snapshot.split(':');
      if (mood === 'celebrate' || mood === 'correct' || mood === 'streak') {
        import('../lib/celebrate').then(({ celebrate }) => {
          celebrate();
        });
      }
    });
    return unsubscribe;
  }, []);

  return null;
}
