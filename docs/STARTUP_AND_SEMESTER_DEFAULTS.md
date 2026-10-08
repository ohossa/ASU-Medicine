# Startup and semester defaults

Years 1, 2 and 3 open on Semester 1. The same default is used for other years. Explicit `?semester=2` navigation remains valid; students can still switch semesters manually.

The academic-year cloud read begins during the existing vitals animation, alongside question-bank loading. That animation waits for first-device preference loading instead of giving way to a second saved-year screen. Dashboard and year-selection views are warmed while it runs.

Returning users immediately see their own account-scoped cached year. Cloud refresh runs in the background; simultaneous hooks share a request and a recently confirmed identical preference avoids repeated reads for 60 seconds. Legacy shared year data is not trusted. A new cloud preference replaces the cache; a deleted preference triggers reconfirmation. Late replies cannot undo a year saved while they were in flight. Cloud errors preserve this account's cached year and expose retry; new-device failures also leave the loader and expose recovery rather than waiting forever.

Verification: 443 Vitest tests across 61 files; strict application/Node/API TypeScript checks and production Vite/PWA build passed. New tests cover all three year defaults, explicit Semester 2, cache-first rendering, concurrent reads, account isolation and save/read races. No claimed timing benchmark or physical-device validation. XP/progress feature changes are excluded from this release.
