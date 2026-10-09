# Unified Learning Hub: progress, performance, activity and rewards

Status: implemented and verified locally, 9 October 2026. No publication. See [implementation and verification report](STUDENT_EXPERIENCE_IMPLEMENTATION.md). The original design and acceptance plan follows.

## Product outcome

One place answers: What have I studied? How well am I doing? What should I revise next? What have I earned? The dashboard should lead to useful practice, not just display decorative totals.

Use `/learning` as the canonical hub. Home Tools has one Learning Hub entry. Account navigation uses the same destination. Preserve legacy `/analytics` and `/study-tracker` links with redirects to the relevant hub view. History can remain a direct shortcut to the Activity view after result deep links are migrated; never break old View Results actions.

## Proposed navigation

| View | Content | Primary action |
| --- | --- | --- |
| Overview | Continue attempt; weekly activity; coverage and accuracy; revision priorities; compact XP summary | Continue or revise a weak chapter |
| Progress | Current-year modules → subjects → chapters; unique-question coverage; first/latest/ever-correct metrics | Practice chapter or missed questions |
| Activity | Attempt history, dates, duration, mode, scores and filters; stored results | View results / retry missed |
| Rewards | Personal XP, level, streak, earned titles/banners and optional yearly rankings | Equip a reward or opt into rankings |

Current year comes from the existing confirmed account preference. Semester 1 is the initial filter, with Semester 2 available explicitly. Year totals include both semesters and are labelled accordingly. Unreleased modules are marked unavailable, with no fabricated denominator or 0% achievement claim. An optional other-year selector is explicit; it must never silently mix years.

## Current implementation evidence

`src/pages/LearningHub.tsx` already uses academic-year preference, current-year module catalogues, the learning service, XP and reward views. `src/app/components/AnalyticsDashboard.tsx` separately computes historical totals and weak areas. It falls back to `MEM-2` for records without a module, slices seven sessions rather than seven calendar days, and contains placeholder module rows when data is absent. These assumptions must be removed during consolidation.

Reuse `src/app/learning/contracts.ts` and existing server learning policy/store. Do not introduce a second XP ledger or calculate authoritative points in the browser. Existing attempt history and the learning ledger are different records: reconcile them through documented selectors rather than treating them as interchangeable.

## Definitions students can trust

| Metric | Definition / limitation |
| --- | --- |
| Coverage | Unique attempted eligible questions / currently published eligible questions in selected scope |
| Accuracy | Correct automatically graded responses / graded responses; show whether first attempt or latest attempt |
| Mastered | Explicit configured rule, such as latest correct; never imply exam readiness solely from one correct response |
| Missed | Latest graded response incorrect; separate unanswered from incorrect |
| Essay progress | Completed/self-reviewed essays; separate from automatically graded accuracy |
| Study time | Active tracked attempt time; separate legacy elapsed duration and avoid treating idle time as learning |
| Streak | Existing server policy and one declared calendar/time-zone rule; no browser-time loopholes |
| Weekly chart | Calendar-day buckets with dates, including zero-activity days, not seven arbitrary sessions |
| XP | Server-authorized personal rewards; displayed separately from competitive points |

Every statistic displays its scope and relevant denominator. Unknown legacy module/year records appear under Unclassified history until resolved from reliable metadata; never assign them to MEM-2 by default. Low-sample weak areas show insufficient data rather than confident conclusions. Suggested minimum five graded responses for a weak-area ranking is configurable and must be labelled as a heuristic.

## Shared data model and reconciliation

Use module + stable question ID (+ case child anchor when independently scored) as identity. Track first response, latest response, ever correct and timestamps, plus question type and content revision. Attempt IDs identify sessions; question IDs identify coverage. Repeated questions can create multiple activity events but count once in unique coverage.

Chapter movement changes presentation mapping, not identity or XP. Retired questions remain in history but leave the current published denominator. New questions increase the denominator explicitly. Historical scores retain their original attempt key/version; do not silently regrade old results when a key changes.

Reconcile local queued events and cloud events idempotently. Mark pending sync honestly. Account switches clear visible prior-user data immediately. Derive current-year facts once in shared selectors consumed by all hub views. Keep bank counts derived from published eligibility, not hardcoded card totals.

Calendar grouping should use a declared zone, initially Africa/Cairo. Align presentation with the existing server XP/streak policy; if that policy differs, make a versioned migration rather than silently changing accrued streaks.

## XP, fairness and privacy

Retain existing versioned server policy. Automatically graded eligible questions can earn competitive points. Self-graded essays earn personal XP and cosmetics only. Keep replay caps, idempotent awards and anti-farming rules enforced on the server. Donations never purchase rank, XP or learning access.

Rankings are opt-in, scoped to year and defined period, with public alias only. Emails, report identities and private student histories remain out of public rankings. Personal XP, competitive XP and rank require distinct labels. Explain scoring rules and refresh times, handle ties consistently, and offer opt-out.

Reward equipping is reversible and independent of academic progress. Reduced-motion users receive the same rewards without forced confetti. No shame messaging for broken streaks or low scores.

## Design specification

A single compact header; four accessible view controls; restrained solid cards; one clear next action. Overview begins with Continue / Recommended revision, then a small set of meaningful metrics. Module cards use existing subject colours sparingly. Mobile stacks cards naturally; filters become a labelled sheet; charts have readable summaries and accessible data tables. Arabic is fully mirrored where directional layout requires it.

Prefer an honest empty state with Start studying over sample scores. Show cached statistics with sync status rather than blocking the entire hub. Errors preserve last reliable data and provide retry. Separate no activity from failed loading.

## Delivery phases

1. Inventory existing contracts, historical records, XP rules and routes. Define the metric specification and fixtures before changing UI.
2. Build shared year-scoped selectors with exact reconciliation tests. Remove guessed-module fallback and demo data from the new hub.
3. Implement Overview and Progress using existing learning APIs. Add scoped counts, weakness actions and continuing attempts.
4. Move historical performance and View Results into Activity; preserve retry/history semantics and old links.
5. Consolidate reward/ranking views; retain personal-versus-competitive XP fairness.
6. Redirect duplicate destinations, update Tools/account labels and document migration. No deletion or reset of existing student data.
7. Test accessibility, responsive layout, offline queues and cloud/account transitions; review local preview before publication.

## Required acceptance tests

- Exact totals for current year, both semesters and selected module; no mixing Year 1/2/3 data.
- Duplicate answers, repeated attempts, shuffled order and missed-question retries do not duplicate coverage or XP.
- True/false, MCQ and essays retain grading semantics; essays excluded from auto accuracy and competitive XP.
- New/retired/moved questions and corrected answer keys preserve historical results while updating current denominators.
- Missing legacy module metadata remains unclassified; charts group dates correctly across midnight/time-zone boundaries.
- Queue retries, multiple devices, idempotency and account switching preserve isolation.
- View Results and Continue open the right attempt; module/chapter deep links remain stable.
- Empty, loading, partial sync, server error, locked module, opt-out leaderboard and reward state are honest.
- 320px mobile, iPad landscape/portrait, desktop, both themes, Arabic, keyboard, reduced motion and enlarged text.

Apple skill basis: `references/hig/layout.md`, `typography.md`, `color.md`, `accessibility.md`, `motion.md` and `loading.md`. Clarity and accurate state take priority over decorative dashboard effects.
