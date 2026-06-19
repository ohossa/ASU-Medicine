import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSoundEngine } from './useSoundEngine';

// Mock the soundEngine module to track play calls
vi.mock('../lib/soundEngine', () => ({
  preloadSounds: vi.fn(),
  play: vi.fn(),
}));

import { play } from '../lib/soundEngine';

describe('useSoundEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts unmuted', () => {
    const { result } = renderHook(() => useSoundEngine());
    expect(result.current.muted).toBe(false);
  });

  it('toggles mute', () => {
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(true);
  });

  it('does not call play when muted', () => {
    const { result } = renderHook(() => useSoundEngine());
    // Toggle mute first - must be in same act as trigger to ensure proper batching
    act(() => {
      result.current.toggleMute();
      result.current.trigger('correct');
    });
    expect(play).not.toHaveBeenCalled();
  });

  it('calls play when not muted', () => {
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.trigger('correct'));
    expect(play).toHaveBeenCalledWith('correct', 0.35);
  });

  it('respects custom volume', () => {
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.trigger('wrong', 0.5));
    expect(play).toHaveBeenCalledWith('wrong', 0.5);
  });

  it('persists mute state to localStorage', () => {
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.toggleMute());
    expect(localStorage.getItem('asu_sound_muted')).toBe('true');
    act(() => result.current.toggleMute());
    expect(localStorage.getItem('asu_sound_muted')).toBe('false');
  });
});