# Learning hub and XP — local review build

Status: implemented locally, not committed, pushed or deployed. Existing production credentials were not downloaded. The AI report triage addition remains a proposal in `REPORT_AI_TRIAGE_PLAN.md`.

## Student experience

`/learning` replaces the multi-year tracker selector with the student's saved academic year. Module cards show current-bank question coverage, latest objective accuracy, missed objective parts and weak topics (at least three attempts and below 70% accuracy). Modules without released content stay unavailable. Case coverage counts parents once while accuracy measures graded parts. Checklist completion is explicitly self-reported and does not award XP.

The hub includes progress, same-year weekly/lifetime leaderboards, earned banners and titles. Clerk's profile menu links to the hub and shows the earned learning profile. Responsive grids and focus states support small viewports; physical-device/authenticated live-backend checks have not yet been performed.

## XP rules

| Question type | Personal XP | Competitive points |
|---|---:|---:|
| Correct MCQ | 10 | 10 |
| Correct true/false | 5 | 5 |
| Correct matching/blanks | 10 | 10 |
| Self-graded correct essay | 15 | 0 |
| Case | Sum of graded parts | Objective parts only |

Rewards occur once per normalized canonical content per account, across question IDs. No parent case bonus. Incorrect submissions update progress without XP. A later correct response can earn the first reward. Competitive points are capped at 500 per Cairo calendar day; personal XP continues. Every 500 personal XP increases the level. Weekly leaderboards reset on Monday in Cairo. Rankings require explicit consent and show an alias, points, level and banner; never email or account identifiers. Withdrawing consent removes current public rankings and readers suppress withdrawn entries in earlier periods.

## Integrity and storage

The authenticated `/api/learning` service retrieves canonical question content and saved cloud year. It rejects wrong-year modules, missing questions, malformed submissions and invalid answers. Client-supplied points/correctness cannot award XP. A Redis Lua transaction atomically records progress, duplicate prevention, daily cap, streak and ranking updates. Personal state is separate from generic client cloud-sync writes. Cosmetics require an earned level; aliases cannot be emails.

Pending completions are persisted per account and retried after reconnect or manually. Results never wait on XP sync. Only server-confirmed balances appear in the UI. Duplicate retries cannot earn twice. Errors and pending counts remain visible; students can discard pending XP submissions after confirmation without deleting quiz history.

Old local XP is retained but does not enter competitive balances. Old shared checklists require an explicit confirmation before importing into an account-specific key. New checklist keys persist in cloud storage without the general sync expiry and are filtered by account on upload/download. This feature does not claim that all older site history storage has been migrated.

## Verification and local limits

The final local preview passed 461 tests across 68 files, including the subsequent startup and History imports; strict TypeScript and production build passed. Six additional tests executed the actual reward Lua in a Redis-compatible emulator, covering retries, wrong-then-correct, essay isolation, cap, consent and levels/streak. The emulator is not hosted Redis. Do not claim a live integration test until authenticated production-equivalent credentials are available on the hosted preview.

New tests cover canonical bank loading, reward policy, year restriction, malformed inputs, settings, progress calculations, durable retries, account queues and hub availability/reward locks. Existing source-bank and true/false tests remain intact.

No additional private key is required by this design beyond the existing hosted Clerk and Redis configuration. Local development without these hosted credentials may display a sync error; it must not invent XP or silently grant admin privileges.
