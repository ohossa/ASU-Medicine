# Account academic year

Students reconfirm their academic year once after this release. Existing shared browser values do not count as confirmation. The new version-1 record is saved through authenticated `/api/sync` under `asu_preferences:<Clerk user id>:academic-year` with `{year, version, timestamp}`.

The server permits only the authenticated account's preference, validates integer years 1–5, and persists it without expiry. Cloud saving must succeed before the prompt closes. Guests retain a separate guest browser preference, never automatically copied into a signed-in account.

On each visit the cloud preference loads first. Previously confirmed account-local data is an offline fallback. Account switches never show another account's year, and late responses cannot update the new account. Failed loads/saves present retry feedback. Old shared year data is ignored by general cloud sync; a compatibility browser value is mirrored for older study tools.

Home centers the selected year in the carousel. Marks calculator opens that year's Semester 1 module selector, with saved scores retained. Browsing other years remains available and does not change the account preference. Change Academic Year in the profile updates the same cloud record. Years 4–5 can be selected as a preference; their existing content availability remains unchanged.

Tests cover old-value reconfirmation, new-device restoration, failed saves, account isolation, invalid values, server persistence, home carousel updates, calculator defaults/score retention and modal focus/error behavior. Run `npm test` and `npm run build`. Signed-in cross-device confirmation still requires live user sessions; do not equate mocked tests with that manual check.
