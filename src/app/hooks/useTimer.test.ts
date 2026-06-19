import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  it('counts down in exam mode', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 5, mode: 'exam' }));
    expect(result.current.remaining).toBe(5);
  });

  it('pauses when pause() is called', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 10, mode: 'practice' }));
    act(() => result.current.pause('grid'));
    expect(result.current.pausedBy).toBe('grid');
  });

  it('triggers onExpire at zero', () => {
    vi.useFakeTimers();
    const onExpire = vi.fn();
    renderHook(() => useTimer({ totalSeconds: 2, mode: 'exam', onExpire }));
    act(() => vi.advanceTimersByTime(3000));
    expect(onExpire).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('urgency starts at normal', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 60, mode: 'practice' }));
    expect(result.current.urgency).toBe('normal');
  });
});