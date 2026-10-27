# Quiz UI cleanup — 2026-10-11

Implemented the three requested browser comments locally:
- Removed the sound button and sound props from TimerSettingsPanel.
- Made the shared header SoundToggle icon-only with a 44 x 44 pixel touch target; retained English/Arabic accessible labels, pressed state, help description, focus styling and sound persistence.
- Removed the shared ChapterSelect Subject Color Guide and its unused icon, legend entries, dot colors and English/Arabic translations. Source search found no remaining guide references across src.

Validation:
- Full suite: 112 files, 642 tests passed using `npm test -- --maxWorkers=2`.
- `npm run build` passed, including all three TypeScript projects and PWA generation. Existing large-bank chunk warnings remain.
- `git diff --check` passed.
- Browser verification at 954 x 724 and 390 x 844: icon-only header control; mute/unmute changes accessible state correctly; shortcuts panel contains timer settings and no sound button; chapter overview has no guide. Mobile sound target measured 44 x 44; document scroll width 384 versus viewport 390.
- Existing quiz was resumed, not reset. Sound preference restored to its original enabled state.
- Ethics bank SHA-256 unchanged: cca56187e7701daaf2021d22e7529d300dda35255577a27da63d9d5c37a47105.

The initial unrestricted full-suite attempt was interrupted after timeouts in data.test.ts (case/casestudy routing), QuizTrueFalse.feedback.test.tsx (real vermilion-bank item), catalog-benchmark.test.ts (catalog indexing), and git-bank.integration.test.ts (GIT true/false grading) while build/typecheck ran concurrently. The sequential two-worker rerun passed every test.

Screenshots: header.jpg, shortcuts.jpg, mobile.jpg, chapters.jpg.
Changes have not been pushed or published.
