# Cross-device progress and support cleanup

## Root causes

- Subject and chapter cards hydrated history once, before the asynchronous cloud pull could finish.
- Generic cloud sync fetched only at sign-in; the learning ledger refreshed only on startup, submission and reconnect. Returning to an already-open computer tab left phone progress stale.
- Generic history uploads replaced the complete history array. Concurrent phone and computer uploads could erase each other's completed sessions. A stale resume upload could overwrite a newer draft.

## Changes

- Topic cards now subscribe to history hydration/save events and display individual question coverage from the authenticated learning ledger, including unfinished sessions. Module cards also include server entries. Syllabus indicators use the current account/module storage key instead of scanning legacy shared keys.
- Learning and generic sync refresh when the page regains focus, becomes visible or reconnects, and every 60 seconds while visible. Hidden tabs skip background polling; listeners and timers are cleaned up on account changes.
- Account history and resume reconciliation retries account-owned pending saves after pulls. Unrelated browser preferences are not uploaded by this background reconciliation. Requests time out after 30 seconds and preserve local data on failure.
- History is merged by immutable attempt ID, newest first, retaining the existing 50-result window. Per-question ledger coverage remains independent of that window. History and saved sessions now persist without the former 30-day expiry after their next upload.
- A Redis compare-and-set Lua transaction guards compressed history/resume writes. Contending writers re-read and merge up to 12 times; failure is reported rather than silently replacing another device's data. Resume timestamps cannot regress. Explicit null still deletes a generic sync key; clearing history never clears XP or the learning ledger.
- Suggested donation amounts and custom-amount fields were removed, including their state/styles. The transfer panel says: “Choose any amount in your payment app. Every contribution helps.” Arabic copy is included. Payment links and recipient/copy instructions remain functional; card checkout remains unavailable.

## XP integrity

Rewards were already server-authoritative and atomic. The once-only Redis set is keyed by authenticated account and normalized canonical question content, not browser, session or device. No client-side award bypass was added. Wrong answers update coverage without points; a later first correct response can earn the reward. Essays remain personal XP only. Revisiting a previously rewarded question returns zero points and no new XP bubble.

The actual production reward Lua was run against an isolated Redis-compatible emulator with 16 concurrent submissions for one account/question: total personal XP 10, competitive XP 10, one awarded identity and one progress entry. This does not modify hosted accounts or leaderboards.

## Verification

Regression tests reproduced the late card hydration, missing focus refresh and history overwrite before fixes. Tests cover merged phone/computer histories, atomic contention retries, preserving newer resumes, pending resume reconciliation without uploading unrelated preferences, live card updates, partial-session coverage, account queues and removed support amount controls.

The full suite and strict build are required before publishing. Browser inspection verifies both InstaPay and Vodafone Cash panels, including the payment note and recipient details. Existing data is migrated lazily through the compatible compressed storage format; no credentials were downloaded and no production study records were fabricated.

Authenticated two-physical-device production verification still requires a real account on both devices. Unit/component tests and the isolated concurrent Redis check validate the implementation; they are not a claim that the student's actual phone session was inspected.

### Final local results

- `npm test`: 591 tests passed across 104 files.
- `npm run build`: all three strict TypeScript projects and Vite/PWA build passed. The existing large question-bank chunk warning remains informational.
- `verify-learning-ledger.py`: seven isolated Lua tests passed, including the 16-request race.
- Browser: InstaPay and Vodafone Cash show the payment-app note without amount selectors. At a 390 px requested viewport, document width and scroll width both measured 384 px (no horizontal overflow). Screenshots are stored alongside this report.
- An initial parallel test/build run timed out in the catalog benchmark and exposed outdated storage mocks in navigation tests. The mocks were updated to the new history subscription API; the final complete suite passed after the build finished.
