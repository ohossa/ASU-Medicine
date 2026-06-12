import { useSyncExternalStore } from 'react';
import { pulse } from './pulseEngine';

export function usePulseState() {
  useSyncExternalStore(pulse.subscribe, pulse.getSnapshot, pulse.getSnapshot);
  return { mood: pulse.mood, streak: pulse.streak };
}
