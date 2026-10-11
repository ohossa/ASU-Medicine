import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    localStorage.clear();
  });

  afterEach(()=>vi.restoreAllMocks());

  it('starts muted on iPhone Safari without explicit opt-in', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('iPhone Version/18 Safari');
    const { result } = renderHook(() => useSoundEngine());
    expect(result.current.muted).toBe(true);
  });

  it('toggles mute', () => {
    localStorage.setItem('asu_feedback_sound_enabled','false');
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(false);
  });

  it('does not call play when muted', () => {
    localStorage.setItem('asu_feedback_sound_enabled','false');
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.trigger('correct'));
    expect(play).not.toHaveBeenCalled();
  });

  it('calls play when not muted', () => {
    localStorage.setItem('asu_feedback_sound_enabled','false');
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.toggleMute());
    act(() => result.current.trigger('correct'));
    expect(play).toHaveBeenCalledWith('correct', 0.35);
  });

  it('respects custom volume', () => {
    localStorage.setItem('asu_feedback_sound_enabled','false');
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.toggleMute());
    act(() => result.current.trigger('wrong', 0.5));
    expect(play).toHaveBeenCalledWith('wrong', 0.5);
  });

  it('persists mute state to localStorage', () => {
    localStorage.setItem('asu_feedback_sound_enabled','false');
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.toggleMute());
    expect(localStorage.getItem('asu_feedback_sound_enabled')).toBe('true');
    act(() => result.current.toggleMute());
    expect(localStorage.getItem('asu_feedback_sound_enabled')).toBe('false');
  });
});
it('synchronizes multiple mounted sound controls immediately',()=>{localStorage.setItem('asu_feedback_sound_enabled','false');const a=renderHook(()=>useSoundEngine());const b=renderHook(()=>useSoundEngine());act(()=>a.result.current.toggleMute());expect(a.result.current.muted).toBe(false);expect(b.result.current.muted).toBe(false);});
