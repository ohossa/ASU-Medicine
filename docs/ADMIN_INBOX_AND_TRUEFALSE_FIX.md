# Report triage and true/false grading — 8 October 2026

## Owner inbox

- Server-authorized keyword search covers question text/ID, report notes, reporter name, username, email and account ID across the whole inbox.
- Module, subject, chapter, lecture/topic and status filters combine. “Unresolved” includes New and Reviewing.
- Question grouping uses module + chapter + parent question ID, avoiding collisions across modules. Reports about case parts remain individually reviewable inside the parent group.
- Counts show matching reports, distinct reporters and unresolved reports under the current filters. Groups sort by their newest matching report and paginate as whole groups; individual-report view remains available.
- Parent-filter changes clear dependent filters and reset pagination. Filters and groups use existing responsive panel styles. Failed requests show an error, not a fabricated empty inbox.
- Topic names are captured from canonical lecture routing on new reports. Older snapshots without a topic retain their original data and still support other filters; no guessed topic or identity is added.
- Advanced queries read existing Redis reports in 500-record batches, including legacy records, and reject rather than truncate inboxes above 10,000 records. Larger inboxes require an indexed query implementation. Existing unfiltered overview pagination remains available.
- No changes to reports, notes, statuses, questions, email recipients or permissions happen automatically. No Redis migration or secret download is required.

## True/false correction

The UI stored booleans but the grading helper compared them directly to integer option indexes. A correct `true` or `false` therefore failed scoring even when the correct option was highlighted.

The shared choice-index helper maps true to 0 and false to 1 exclusively for true/false questions. Numeric saved selections remain supported; malformed values are not coerced. Practice scoring, accessible announcements, question-grid states, results, restored result review and missed-question filtering now use consistent grading. Review also shows the selected-answer badge and incorrect-selection highlight for boolean answers. The practice UI can display both saved formats.

All 325 canonical GIT true/false items are checked with correct and incorrect boolean selections and correct indexed selections. Bank prompts, answer keys, IDs and source hashes are unchanged. Persisted historical summary scores are not rewritten; reopening saved results uses corrected grading, and new attempts save correct totals.

## Verification

50 suites / 376 tests pass in the isolated release tree. Strict app/tooling/NodeNext API checks and production build pass. Tests include search beyond the first 500 reports, owner-only query access, query encoding, filter combinations, grouping collisions, unique reporter counts, group pagination, selected-report access, boolean/indexed grading, practice announcements and saved boolean answers. Live signed-in owner/student workflows and physical-device testing remain separate acceptance checks.
