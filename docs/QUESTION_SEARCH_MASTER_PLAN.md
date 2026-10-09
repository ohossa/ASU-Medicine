# Question Search: implementation master plan

Status: implemented and verified locally, 9 October 2026. No publication. See [implementation and verification report](STUDENT_EXPERIENCE_IMPLEMENTATION.md). The original design and acceptance plan follows.

## Intended experience

Open Search and immediately search the student's year. Change to another year or all years explicitly. Find a question using its stem, an option, a concept or an explanation; see where it belongs; open the correct chapter/question without losing study progress. Answers remain concealed until requested.

## Current limitations confirmed in source

`src/app/components/QuestionSearch.tsx` builds an index across active modules and performs synchronous lowercase substring matching. Entries do not carry year/semester/collection scope. Matching omits options, explanations and case child questions. The index memo does not refresh on bank revisions. Results are capped with `slice(0,100)` and cannot be paged beyond that limit. Reveal state uses question ID alone. Answer formatting has separate true/false logic instead of the shared grading representation. These need a structural improvement, not an AI search API.

## Information and controls

- Main search field with keyboard shortcut advertised only when available; clear action; Escape clears an open overlay before leaving the page.
- Scope: current year by default, semester, module, subject, chapter, study bank/past exams and question type. An explicit All years option remains available.
- Flags filter retained. Add missed/unattempted filters only after the learning hub exposes reliable unique-question facts.
- Show active filter chips and a single Reset filters action. Mobile uses an accessible filter sheet; desktop uses a compact panel.
- Result rows: stem excerpt, module → subject → chapter, type and collection. Do not show correct answer or explanation in the collapsed preview.
- Reveal answer/explanation on demand; Open question opens a stable anchor in study mode. Never silently submits an answer or creates an attempt.
- Genuine empty, loading, partial-index, offline and retry states. State why no results match restrictive filters.

## Data contract and integrity

Each entry has a composite key: module code + stable question ID + optional case child anchor, plus year, semester, subject/chapter identifiers, collection, bank revision, type, stem, options, explanation and answer fields.

Use shared question/answer normalization and grading helpers. Preserve boolean, numeric and text true/false representations. Test both True and False, including numeric option indices; never infer correctness from truthiness. Preserve all published IDs and existing attempt records.

Rebuild or incrementally replace entries when the published bank/corrections revision changes. Old searches must not overwrite newer query/filter results. Resolve deep links against the current chapter map, including moved questions; missing/retired questions show an honest unavailable state.

## Matching and ordering

1. Normalize whitespace, case and Unicode consistently; Arabic diacritics/tatweel can be ignored for search while displayed text remains original.
2. Token matches and exact phrases outrank broad substring hits. Weight stem highest, followed by options, then explanation/answer and taxonomy. Define weights in one tested configuration.
3. Add a small, reviewed medical alias dictionary. Do not use uncontrolled spelling expansion that changes meaning.
4. Introduce bounded typo matching only after measuring false positives. Exact matches always rank first.
5. Tie-break by source chapter order then stable ID for predictable results.
6. Highlight escaped text safely with the same normalization mapping used for search. Render text as React content, never inject source HTML.

## Performance architecture

Use a lightweight catalogue and load current-year index first. Precompute normalized fields once per revision. Move expensive ranking to a worker when a real-bank benchmark shows main-thread delays. Cancel superseded jobs and return only the latest sequence number. Avoid shipping a second giant copy of every bank in the initial page bundle.

Replace the hard 100-result cutoff with accessible pagination or Load more. Virtualize only if measured necessary and preserve focus, keyboard navigation and result counts. Warm typing-to-results p95 target: under 100ms on a representative midrange device; this is an acceptance target requiring measurement, not a current performance claim.

## Privacy and persistence

Save filters per account, not shared across users. Clear account state on logout/switch. Do not log student query text, answers or identifiers to analytics. Shareable URL filters may be supported; query inclusion should be deliberate because searches can contain sensitive text. No paid AI dependency is needed.

## Delivery sequence

1. Shared normalization/answer formatter and composite IDs; fixture tests for every question type.
2. Taxonomy metadata, current-year default and filter state.
3. Ranked matching across all relevant fields and complete paged results.
4. Stable chapter/question deep links and revision invalidation.
5. Profile on the actual bank; introduce worker and lazy indexing where measured useful.
6. Mobile/Arabic/keyboard review and measured performance evidence.

## Required tests

- Stem, options, explanations, answer, chapter aliases and case-child search.
- Boolean/index/text true/false answers and cross-module duplicate legacy IDs.
- Current-year default; All years; unavailable modules; collection/type intersections; account switches.
- More than 100 matches remain reachable; stable ties; stale worker responses ignored.
- Bank revision updates results; moved/retired deep links recover safely.
- Regex characters, Arabic normalization, empty input, long stems and narrow screens.
- Filter dialog focus trap/return, result count live announcement, keyboard paging and concealed answers.

Apple skill basis: `references/hig/layout.md`, `typography.md`, `buttons.md`, `accessibility.md` and `loading.md` (Best practices). Use solid result cards and restrained navigation materials, following `materials.md`.
