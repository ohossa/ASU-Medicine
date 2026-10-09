import { feedbackSoundEnabled, prepareMixableAudio } from './audioPolicy';

const SOUND_PATHS = {
  correct: '/sounds/correct.mp3', wrong: '/sounds/wrong.mp3',
  combo: '/sounds/combo.mp3', timer: '/sounds/timer.mp3', perfect: '/sounds/perfect.mp3',
} as const;
type SoundKey = keyof typeof SOUND_PATHS;
const downloads = new Map<SoundKey, Promise<ArrayBuffer>>();
const buffers = new Map<SoundKey, AudioBuffer>();
let context: AudioContext | undefined;
let activeSources = 0;
function download(key: SoundKey) {
  let pending = downloads.get(key);
  if (!pending) {
    pending = fetch(SOUND_PATHS[key]).then(response => {
      if (!response.ok) throw new Error('Sound unavailable');
      return response.arrayBuffer();
    }).catch(error => { downloads.delete(key); throw error; });
    downloads.set(key, pending);
  }
  return pending;
}
export function preloadSounds() {
  if (!feedbackSoundEnabled()) return;
  for (const key of Object.keys(SOUND_PATHS) as SoundKey[]) void download(key).catch(() => {});
}
export function play(key: SoundKey, volume = 0.35) {
  if (!feedbackSoundEnabled() || !prepareMixableAudio()) return;
  try {
    const Constructor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Constructor) return;
    context ??= new Constructor();
    const ac = context;
    // Resume during the answer click, before asynchronous asset decoding.
    const ready = ac.resume();
    activeSources++;
    void (async () => {
      let source: AudioBufferSourceNode | undefined;
      let gain: GainNode | undefined;
      try {
        await ready;
        let buffer = buffers.get(key);
        if (!buffer) {
          buffer = await ac.decodeAudioData((await download(key)).slice(0));
          buffers.set(key, buffer);
        }
        if (!feedbackSoundEnabled()) return;
        source = ac.createBufferSource(); gain = ac.createGain();
        source.buffer = buffer; gain.gain.value = Math.max(0, Math.min(1, volume));
        source.connect(gain).connect(ac.destination);
        await new Promise<void>(resolve => { source!.onended = () => resolve(); source!.start(); });
      } catch { /* Optional feedback must never interrupt studying. */ }
      finally {
        source?.disconnect(); gain?.disconnect();
        activeSources--;
        if (!activeSources) void ac.suspend().catch(() => {});
      }
    })();
  } catch { /* Unsupported audio stays silent. */ }
}
