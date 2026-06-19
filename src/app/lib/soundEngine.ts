const SOUND_PATHS = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  combo: '/sounds/combo.mp3',
  timer: '/sounds/timer.mp3',
  perfect: '/sounds/perfect.mp3',
} as const;

type SoundKey = keyof typeof SOUND_PATHS;

const preloaded = new Map<SoundKey, HTMLAudioElement>();

export function preloadSounds() {
  (Object.keys(SOUND_PATHS) as SoundKey[]).forEach(key => {
    const audio = new Audio(SOUND_PATHS[key]);
    audio.preload = 'auto';
    preloaded.set(key, audio);
  });
}

export function play(key: SoundKey, volume = 0.35) {
  const stored = preloaded.get(key);
  if (!stored) return;
  const audio = stored.cloneNode() as HTMLAudioElement;
  audio.volume = volume;
  audio.play().catch(() => {});
}