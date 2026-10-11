// Explicit choices override the device default. Never persist a default as a choice.
const SOUND_PREFERENCE = 'asu_feedback_sound_enabled';
let enabledInMemory: boolean | undefined;
const listeners = new Set<() => void>();
export function isIPhoneSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent ?? '';
  return /iPhone/i.test(ua) && /Safari/i.test(ua)
    && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|GSA|Brave/i.test(ua);
}
export function feedbackSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem(SOUND_PREFERENCE);
    if (saved === 'true' || saved === 'false') return saved === 'true';
    return !isIPhoneSafari();
  } catch { return enabledInMemory ?? !isIPhoneSafari(); }
}
export function subscribeFeedbackSound(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === SOUND_PREFERENCE || event.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage); };
}
export function setFeedbackSoundEnabled(enabled: boolean) {
  enabledInMemory = enabled;
  try { localStorage.setItem(SOUND_PREFERENCE, String(enabled)); } catch { /* Session choice still works. */ }
  listeners.forEach(listener => listener());
}
export function prepareMixableAudio(): boolean {
  if (!feedbackSoundEnabled()) return false;
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = 'ambient';
  } catch { /* Experimental API failure must not override explicit opt-in. */ }
  // Older iPhone Safari may interrupt other audio after explicit unmute.
  // Its default stays silent; the visible sound control explains the choice.
  return true;
}
