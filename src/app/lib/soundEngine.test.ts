import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { setFeedbackSoundEnabled } from './audioPolicy';
import { sound } from './sound';
import { play, preloadSounds } from './soundEngine';
beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());
it('quiz and level-up create no audio or requests by default', () => {
  const audio = vi.fn(); const fetcher = vi.fn();
  vi.stubGlobal('AudioContext', audio); vi.stubGlobal('Audio', audio); vi.stubGlobal('fetch', fetcher);
  play('correct'); preloadSounds(); sound.wrong();
  expect(audio).not.toHaveBeenCalled(); expect(fetcher).not.toHaveBeenCalled();
});
it('plays opted-in feedback through mixable WebAudio and releases it after ending', async () => {
  const session = { type: 'auto' }; vi.stubGlobal('navigator', { audioSession: session });
  setFeedbackSoundEnabled(true);
  const disconnect = vi.fn();
  const source = { buffer: null, onended: null as null | (() => void), connect: vi.fn(), disconnect, start: vi.fn(() => source.onended?.()) };
  const gain = { gain: { value: 0 }, connect: vi.fn(), disconnect };
  source.connect.mockReturnValue(gain);
  const suspend = vi.fn().mockResolvedValue(undefined);
  const constructor = vi.fn(function () {
    expect(session.type).toBe('ambient');
    return { resume: vi.fn().mockResolvedValue(undefined), decodeAudioData: vi.fn().mockResolvedValue({}), createBufferSource: () => source, createGain: () => gain, destination: {}, suspend };
  });
  vi.stubGlobal('AudioContext', constructor);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) }));
  play('correct');
  await vi.waitFor(() => expect(suspend).toHaveBeenCalled());
  expect(source.start).toHaveBeenCalledOnce(); expect(disconnect).toHaveBeenCalledTimes(2);
});
