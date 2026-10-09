// A new opt-in avoids carrying forward the old default-on preference.
const SOUND_PREFERENCE = 'asu_feedback_sound_enabled';
let enabledInMemory: boolean | undefined;
export function feedbackSoundEnabled(): boolean {
  try { return localStorage.getItem(SOUND_PREFERENCE) === 'true'; }
  catch { return enabledInMemory === true; }
}
export function setFeedbackSoundEnabled(enabled: boolean) {
  enabledInMemory = enabled;
  try { localStorage.setItem(SOUND_PREFERENCE, String(enabled)); } catch { /* session preference still works */ }
}

export function prepareMixableAudio(): boolean {
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) {
      session.type = 'ambient';
      return session.type === 'ambient';
    }
    // Older iPhone/iPad Safari cannot promise mixing. Keep studying silent there.
    const appleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return !appleMobile;
  } catch { return false; }
}
