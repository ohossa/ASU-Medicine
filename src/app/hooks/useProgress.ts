import { useContext } from 'react';
import { ProgressContext } from '../store/progress';

export const useProgress = () => {
  const c = useContext(ProgressContext);
  if (!c) throw new Error('useProgress must be used within ProgressProvider');
  return c;
};