# Student experience implementation

Completed locally on 9 October 2026. Branch: `local/student-experience-hub-search-loading`. No commit or push was made. The existing support-page and question-bank work in this checkout was preserved.

## 1. Unified Learning Hub

`/learning` is the canonical destination. Overview, Progress, Activity and Rewards are views of the same hub. `/analytics`, `/study-tracker` and `/history` redirect to the corresponding view. Home Tools and the account menu use one Learning Hub entry.

- Scope follows the account's academic year. Progress starts with Semester 1, with explicit Semester 2 and All semesters controls. Summary totals cover both semesters; partial downloads are labelled when a bank cannot load.
- Modules drill down through subjects and actual published lecture/topic titles. GIT keeps its Inerd lecture grouping and past-exam collection. Topic practice and missed-question links resolve current question identities.
- Coverage counts distinct published parent questions answered, not opened quizzes or repeated submissions. Latest objective accuracy excludes essay self-grades. First-answer accuracy is shown only for entries that genuinely recorded a first answer; it is not reconstructed from old latest-answer records. Ever-correct is distinct from latest-correct. Weak-area recommendations require at least five objective answers.
- Activity uses completed sessions, deduplicated by session ID. The seven-day chart includes zero-activity calendar dates in Cairo time and an accessible table. Legacy duration includes idle time and is labelled honestly. Unknown module histories can be inspected without assigning them to an arbitrary year.
- Continue restores a saved account-scoped draft only when its question subset and assessment version match. A changed or withdrawn question produces a recoverable notice and preserves the original draft.
- New result histories freeze a compressed question/key snapshot and retain the original score. Old histories retain their stored score with a clear notice that detailed cards use the current bank. Retake and Retry Missed always use currently published questions and omit withdrawn IDs.
- Personal XP, level, streak, titles, profile banners and optional weekly/all-time year rankings remain server-authoritative. Essays earn personal XP only. Competitive scoring retains idempotency, caps and opt-in aliases.

### Account and cache boundaries

Browser history is stored at `asu_history:<account>`. The historical cloud wire key is retained for backward compatibility. Unattributed global browser history is preserved, not silently assigned to whichever student signs in next. Learning read caches are keyed by account and ranking period and contain only server-confirmed snapshots. Account/period generation guards reject stale responses. Pending awards remain account-scoped; no client-side XP is invented when offline.

The local preview has no configured learning backend. It therefore shows a specific cloud-unavailable notice and unknown cloud metrics rather than fabricated zero scores. API authentication and owner-only administration are not bypassed, and no secret keys are added locally.

## 2. Question Search

Search defaults to the account's selected year and saves filters per account. All years is an explicit choice. Index construction and ranking run in a Web Worker; superseded responses are ignored and obsolete workers terminate.

Search includes stems, answer options, explanations, model answers, published chapter/topic metadata and individual case children. Stems rank ahead of supporting fields. Unicode and Arabic diacritics are normalized, and a small reviewed spelling-equivalence list supports terms such as esophagus/oesophagus. Broad fuzzy clinical matching is deliberately disabled because false-positive safety has not been established.

Filters include year, module, subject, chapter/topic, collection, question type and study status. Chapter keys include module, chapter, subject and lecture to prevent cross-module collisions. Reveal state and result identity distinguish module, parent and child. Unavailable saved filters remain visible and resettable rather than displaying a misleading All selection. Results use 60-item pages with Load more; there is no unreachable 100-result cutoff.

Answers stay concealed until revealed. True/false display uses the shared answer representation. Stable question/child links resolve after chapter moves, open the matching question, and focus the requested case child. Opening a single search result does not overwrite a normal chapter draft.

### Performance evidence

The recorded benchmark uses the actual catalog (25,948 searchable entries, including case parts), Happy DOM and Node CPU time. It is not a network, physical-phone or field p95 measurement.

- Baseline index construction: 2,293 ms. Baseline broad queries: roughly 234–272 ms.
- Optimized initial sample: 450 ms construction and 8.5–25.5 ms queries.
- Final sample, collected alongside the production build: 1,032 ms construction and 24.9–144.7 ms queries. This variation reflects machine contention and the final expanded normalized field coverage.
- Browser verification confirmed an actual worker query for lipase produced 59 Year 3 matches and opened the intended current lecture.

All three benchmark JSON files are saved under the verification directory. The worker keeps construction/ranking off the UI thread; serialization and result rendering still have a cost. No claim of zero latency is made.

## 3. Loading architecture

The entry/auth loading surface uses actual readiness, not a fixed animation deadline or fake percentage. The home page uses a small generated catalog and does not download all question banks. Study routes request the selected module; Search and Hub request only their chosen year. Explicit all-year consumers can still load the full catalog.

Resource requests are shared while in flight, success is cached, and failures remain retryable. Registration and published-correction overlays are serialized. A bank must actually be registered before a quiz route is considered ready. Correction refresh is background work and does not block entry; the bundled-bank notice remains honest if it fails. Current quiz question snapshots are not silently changed by a background correction.

`predev` and `prebuild` regenerate `src/app/generated/bankManifest.json` from the source files, with counts, bytes and revision hashes. Assessment-only hashes preserve resumability across chapter/provenance moves and detect changes to question/key content. The original raw questions are not mutated to add these runtime hashes.

Bank chunks are excluded from initial PWA precaching. Visited immutable bank chunks are runtime-cached, with a 60-entry, 90-day limit. APIs and authenticated responses are not added to that cache. The final build precaches 115 entries, approximately 7,077.58 KiB. Existing attempt-save/update safeguards remain.

## Design and accessibility

This is a React web portal. Apple's principles are adapted to responsive web controls, rather than claiming native HIG certification. The approved direction uses clear hierarchy, solid readable content surfaces, generous spacing, progressive disclosure, visible labels and at least 44px principal touch controls. Hub views wrap into a two-by-two arrangement on narrow screens; Search keeps its scope visible and does not force the mobile keyboard open. Charts have textual equivalents, state is labelled beyond colour, and loading honours reduced motion.

Relevant local Apple references: `accessibility.md` › Mobility and Cognitive; `layout.md` › Visual hierarchy; `search-fields.md` › Best practices and Platform considerations; `loading.md` › Best practices and Showing progress; `cross-platform.md` › Vocabulary.

The obsolete Star Legend was removed from the keyboard-shortcuts popup as requested. Keyboard commands, timer modes and mute controls remain.

## Verification and practical limits

- `npm test`: **89 files, 529 tests passed**. Test workers are capped at four to avoid concurrent full-bank JSON-import contention. An unrestricted run produced four 5-second fixture-load timeouts; the ordinary configured command now passes without increasing test timeouts or skipping assertions.
- `npm run build`: **passed**, including all three application/Node/API TypeScript checks, Vite production bundling and PWA generation.
- A fresh final read-only review found no remaining significant correctness, security or data-loss issues in the reviewed changes.
- Browser checks covered actual search ranking, an opened stable study link, current-year/semester hub selection, and the shortcuts popup without Star Legend. Search had no horizontal document overflow at 320 and 768px; Hub had none at 320px. Phone and tablet screenshots are saved.
- Automated checks cover full child IDs, account isolation, first/ever/latest answer facts, immutable historical review and current-key retakes, draft subset/version preservation, calendar activity, stable study links, worker cancellation, failed-load retry and actual loading readiness.

Responsive emulation does not prove every physical Safari/iPad/browser configuration. Production network timing and authenticated live-cloud awards need verification after an explicitly authorised deployment. No physical-device, field p75/p95, universal screen-reader or full Arabic translation certification is claimed. Remaining existing English explanatory copy is not presented as a completed translation project.

## Maintenance

1. Use the existing question-intake workflow before changing bank content. This experience work does not adjudicate historical medical keys.
2. Regenerate the manifest after imports (`npm run dev` and `npm run build` do this automatically).
3. Run `npm test` and `npm run build` before publication.
4. Check `/learning`, `/learning?view=progress`, `/learning?view=activity`, `/learning?view=rewards` and `/question-search` with the intended account/year.
5. Keep historical review separate from a new scored attempt. Never replay a withdrawn snapshot to claim new XP.
6. Preserve account keys and server award guards when extending offline support.
7. Publish only when the user approves this local release. The support-page publication hold remains in force.
