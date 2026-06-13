// Central feature flags. Flip anything off instantly.
export const FX = {
  DEFERRED_FX: true,        // master flag to defer FX loading for LCP/FCP optimizations
  reactiveBackground: true, // bg responds to quiz state
  ecgMonitor: true,         // heartbeat line under timer
  confetti: true,           // celebration on completion / perfect score
  sound: true,              // synth tones (respects user mute pref)
  gamification: true,       // XP, streaks, levels
  pageTransitions: true,    // framer-motion screen morphs
  subjectThemes: true,      // per-subject palette re-skin
} as const;

export type FxKey = keyof typeof FX;
