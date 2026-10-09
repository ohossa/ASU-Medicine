# Year 1 question quality implementation plan

Goal: audit all Year 1 Semester 1 banks, repair corrupted display text and answer problems, exclude unresolved ambiguity, and remove duplicate questions with a reversible ledger.

Scope: User initially designated the entire Year 1 database and three screenshots, then narrowed the active release to Semester 1 only to save usage. Semester 2 work is paused; its saved audit artifacts are not applied. Existing student-experience/XP changes are unrelated. Prepare locally; publication requires explicit authorization under QUESTION_IMPORT_WORKFLOW.md.

Architecture: immutable bank snapshots, hash-bound reviewed decisions, conservative answer-aware deduplication, canonical bank corrections, and regression gates over every question and case child. No paid review provider. Independent module audits use the dispatching-parallel-agents skill; merge decisions centrally.

- [x] Capture every bank and parent/child ID, content hash and placement.
- [x] Read module question batches; inspect suspicious text, ambiguity, explanation/key consistency, and duplicate candidates. Open medical evidence for substantive decisions; record actual review coverage.
- [x] Add failing tests for the screenshot corruption, duplicate normalization, contradictory keys, option-order semantics, clinical numeric/charge preservation, and safe replay.
- [x] Implement quality audit/replay script; archive removed questions and duplicate aliases with exact originals and reasons. Prevent stale decisions and partial writes.
- [x] Apply reviewed text corrections; deduplicate complete equivalent questions across Year 1 Semester 1 while keeping questions with genuinely distinct alternatives and unresolved conflicts out of the merge.
- [x] Add a release gate and tests over all retained parents/children; integrate importer rejection of corrupt/missing/out-of-range answers without defaulting.
- [x] Verify real runtime loading and grading, responsive wrapping, full test suite, typecheck/build, conservation counts, repeat-run idempotence, and unchanged unrelated files.
- [x] Document corrections, exclusions, duplicate relationships, medical-review limits, tests and local publication status.

Review focus: negative stems; shuffled letter-dependent alternatives; overlapping choices but changed correct answer; protein charge/pH and numeric values; stale owner overlays and saved attempts after a correction.

Final verification: 4635 parents +25 children reviewed; 4122 retained,219excluded,294duplicates removed. 11Python tests and470/68Vitest checks +build passed in isolated baseline overlay. Shared workingtree failures documented separately; no publication.
