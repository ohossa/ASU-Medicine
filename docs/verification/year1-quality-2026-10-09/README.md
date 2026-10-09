# Year 1 Semester 1 quality release — 9 October 2026

The latest user scope is **Year 1 Semester 1 only**. Semester 2 audit artifacts were saved before that scope change but are not part of this release. Its canonical banks must remain identical to the `before` snapshots.

## Reproducible release

Run `python3 -m unittest discover -s scripts -p test_year1_quality.py`, then `python3 scripts/year1_quality.py --prepare`. Inspect `summary.json`, `release-errors.json`, the module coverage ledgers, `exclusions.json` and `duplicates.json`. Apply with `python3 scripts/year1_quality.py --apply` only when all errors are resolved and the content decisions are complete. The script rejects stale original hashes and preflights every bank before writing; it restores original bytes if writing fails. Run `--apply` again to verify repeatability.

`before/` contains immutable original banks; `decisions-*.jsonl` records exact original question hashes, reasons, reviewed patches, and evidence where opened. Exclusions and duplicates archive complete originals. `duplicateAliases` and merged source occurrences link removed repeats to surviving questions. Exact deduplication compares complete stems, options, correct answer content and special-format payloads; it handles reordered options while preserving letter-dependent order, negatives, charges and decimal values. Additional similar-wording merges require explicit reviewed decisions and fresh hashes. Conflicting answers are adjudicated as content issues rather than silently merged.

`contentVersion` changes with reviewed content, including case children, so index-based saved answers cannot resume against different question content. Old attempt snapshots are retained by the existing history system.

## Rendering and future intake

A pipe inside scientific notation or prose no longer causes the quiz to discard the question as a table. Only valid Markdown tables render as tables, and surrounding prose remains visible. Long stems and options wrap. Explicit answer positions are required; missing, fractional, conflicting or out-of-range answers cannot silently become answer A. Strict intake blocks unresolved review rows. Shared validators reject known OCR/footer corruption and duplicated alternatives.

## Review limits

Every in-scope question and child receives a content review of its stem, alternatives or special-format payload, key and explanation. Review is AI-assisted and targeted authoritative sources support selected substantive corrections. This is not independent clinician certification, and an opened reference is not evidence for every item in a topic. Coverage ledgers report what was actually read; no automated integrity check is described as medical adjudication. Unrecoverable ambiguity, missing context and multiple defensible answers in a single-answer format are excluded with reasons.

The student screenshot regressions cover protamine/insulin charge interactions, the polypeptide backbone sequence and the complete glutathione stem. Runtime integration checks validate retained questions and grading, source accounting, no exact duplicates, per-original dispositions and unchanged Semester 2 content. Published owner overlays were checked before application; none existed at inspection time.

## Publication

Prepared and tested locally. No Git push or production publication is implied by these artifacts. Unrelated active workspace changes are excluded from this work's scope.

## Completed verification

Reviewed all **4,635 original Semester 1 questions and 25 case children**. The release retains **4,122 parent questions**, records **1,436 corrections**, excludes **219 ambiguous/unrecoverable questions**, and removes **294 duplicates**. Empty IHC/MIM banks remain empty. Every original parent has exactly one disposition, and retained questions pass the structural/content release gate. All Semester 2 banks equal their original snapshots.

**11 Python behavioral tests passed; 470 tests across 68 files passed in a clean baseline checkout with only this release overlaid. Typechecking and production build passed there.** Screenshot, merged-alternative, runtime grading/routing, table-rendering, complete source accounting, duplicate and saved-session regressions pass. A second application changes no canonical bytes.

The shared working tree contains concurrent unfinished Learning Hub and loading changes. Its full run had 510 passing tests with three Clerk-provider failures and a missing continuation module; its build was blocked by new App.tsx references. Those unrelated files were preserved. `isolated-verification.json` lists the baseline commit and exact reviewed file overlay; `isolated-full-tests.txt`, `isolated-build.txt` and `verification.json` record the release result. A one-line cache-initialization fix in the shared runtime was also verified by its existing loading tests; it is separate from the clean baseline overlay.

> Follow-up: IBM-1 was subsequently audited against original PDF pages in `../biochemistry-quality-2026-10-09/README.md`. This document records the earlier broad pass; the dedicated Biochemistry report records the latest IBM count and verification. Do not replay this older release over the newer IBM bank.

## Authorized publication follow-up

The user authorized pushing and deployment after the local review. The isolated release combines the two audited passes, retains **4,078 Semester 1 parent questions** (including **1,416 IBM-1 questions**), and excludes unrelated workspace development. Historical test results above refer to their respective review stages. Fresh isolated-release verification is recorded in `../question-quality-release-2026-10-09/`; deployment must be verified for the exact pushed commit.
