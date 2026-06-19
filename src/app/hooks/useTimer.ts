import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'off' | 'practice' | 'exam';

interface UseTimerOptions {
  totalSeconds: number;
  mode: TimerMode;
  onExpire?: () => void;
}

export function useTimer({ totalSeconds, mode, onExpire }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [urgency, setUrgency] = useState<'normal' | 'amber' | 'red' | 'critical'>('normal');
  const [pausedBy, setPausedBy] = useState<'grid' | 'shortcuts' | 'settings' | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const isActive = mode !== 'off' && !pausedBy;
  const pct = Math.max(0, (remaining / totalSeconds) * 100);

  useEffect(() => {
    if (!isActive) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); onExpire?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isActive, onExpire]);

  useEffect(() => {
    const ratio = remaining / totalSeconds;
    if (remaining <= 10) setUrgency('critical');
    else if (ratio < 0.3) setUrgency('red');
    else if (ratio < 0.6) setUrgency('amber');
    else setUrgency('normal');
  }, [remaining, totalSeconds]);

  const pause = useCallback((reason: 'grid' | 'shortcuts' | 'settings') => setPausedBy(reason), []);
  const resume = useCallback(() => setPausedBy(null), []);
  const reset = useCallback((newTotal: number) => { setRemaining(newTotal); setPausedBy(null); }, []);

  return { remaining, pct, urgency, pausedBy, pause, resume, reset, isActive };
}