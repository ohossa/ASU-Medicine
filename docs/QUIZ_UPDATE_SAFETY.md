# Quiz feedback and open-tab updates

## Reported issue and evidence

A student reported correct true/false buttons with wrong sounds, red pulse feedback, and incorrect results. The current production bundle uses the same boolean/index-aware grading helper for feedback and results. A fresh component regression test exercises both True and False, submits the attempt, and verifies sound, pulse, persisted answer, and result counts. The exact reported vermilion-border question was also exercised from the real GIT bank. These checks passed before changing grading code. The reporter confirmed that closing and reopening the website resolved the issue.

The existing service worker checked for new deployments, but an already-open tab continued executing its previously loaded JavaScript without an update notice. This change adds a notice when an existing service-worker controller is replaced and checks for updates when the window regains focus. First-time installation does not show the notice.

## Safe refresh

The student chooses **Save and refresh**. Before reloading, the notice emits `asu:save-before-refresh`; an active quiz synchronously persists its current snapshot through the existing account-scoped session mechanism. Tests verify persistence and that the save event happens before the reload callback. No automatic reload interrupts an active attempt.

An old tab opened before this release needs one manual refresh to load the new notice. Previous activity-history summary scores are not retroactively rewritten by this change. The grading helper and historical question answers are unchanged.

## Verification

430 tests passed across 60 files; the production TypeScript and Vite build passed. Added regression coverage includes both correct boolean choices, the reported real bank question, correct sound and pulse, results with zero wrong answers, save-before-refresh, update notification, and first-install behavior.
