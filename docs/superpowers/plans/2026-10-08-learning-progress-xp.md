# Learning Progress and XP Implementation Plan

**Goal:** Build a current-year study hub, account-scoped syllabus tracking, server-recorded XP, opt-in same-year rankings, and earned profile cosmetics; keep this work local and unpublished.

**Architecture:** An authenticated learning endpoint stores atomic rewards and question progress separately from general cloud sync. Canonical questions and current academic-year preferences determine valid submissions. A shared client context handles pending submissions, cloud state, and local failure/retry indicators. The learning hub uses the existing portal design and year preference.

**Approved rules:** MCQ 10 XP, true/false 5 XP, matching/blanks 10 XP, essay 15 personal XP. Case parts are scored separately without an extra parent reward. Rewards are granted once per canonical question content and account. Essays never affect competitive scores. Historical/local XP never enters the competitive ledger. Public rankings require opt-in and expose aliases only.

## Tasks

- [x] Test reward policy: canonical grading, duplicate prevention identities, essay restrictions, year matching and malformed submissions.
- [x] Implement authenticated learning endpoint and atomic Redis store; test privacy, settings validation, race-safe reward Lua, and account isolation.
- [x] Add account-bound learning context with durable pending quiz submissions, retries, and visible errors; integrate completion without blocking results.
- [x] Build current-year hub: available modules, coverage, accuracy, weak topics, next study actions, XP, leaderboards, cosmetics.
- [x] Scope syllabus storage to account, update cloud-sync key filters, remove checklist XP farming, and restrict tracker navigation to selected year.
- [x] Add navigation/profile entry points and responsive styles.
- [x] Run full tests and strict build; document reward limits, local preview limitations, and data migrations.

## Constraints and checks

No push/deployment. No local secret downloads. Preserve unrelated bank/editor changes. No invented syllabus topics or fake activity. No client-provided XP amounts or correctness flags. Current-year modules without content remain clearly unavailable. Legacy shared tracker data requires explicit import instead of automatic cross-account migration. Replay/retries must never duplicate rewards. Ranking consent withdrawal must remove public entries. Account switching must not reuse another account's learning state or pending queue. Automated checks do not substitute for authenticated live Redis/device verification.
