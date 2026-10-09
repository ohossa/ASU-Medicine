import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { feedbackSoundEnabled, prepareMixableAudio, setFeedbackSoundEnabled } from './audioPolicy';

describe('background audio protection', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it('does not inherit the legacy default-on quiz or reward preferences', () => {
    localStorage.setItem('asu_sound_muted', 'false'); localStorage.setItem('fx.muted', '0');
    expect(feedbackSoundEnabled()).toBe(false);
  });
  it('persists explicit opt-in and mute for both sound engines', () => {
    setFeedbackSoundEnabled(true); expect(feedbackSoundEnabled()).toBe(true);
    setFeedbackSoundEnabled(false); expect(feedbackSoundEnabled()).toBe(false);
  });
  it('requests mixing before audio starts on Safari', () => {
    const session = { type: 'auto' };
    vi.stubGlobal('navigator', { audioSession: session });
    expect(prepareMixableAudio()).toBe(true); expect(session.type).toBe('ambient');
  });
  it('keeps old iPhone Safari silent when mixing cannot be requested', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('iPhone Safari');
    expect(prepareMixableAudio()).toBe(false);
  });
});
