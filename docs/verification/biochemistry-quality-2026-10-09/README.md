# Dedicated Biochemistry OCR and content audit — 9 October 2026

This follow-up targets **IBM-1: Year 1 Semester 1 Introduction to Medical Biochemistry**, following the user's clarification that Biochemistry and OCR quality are the priority. It changes no other canonical question bank. It builds on the earlier Semester 1 audit rather than relabelling that broad audit as full original-page reconciliation.

## Result

All **1,460 retained questions** were read in full by topic, including alternatives, existing keys, explanations, essay model answers and required points. **109 unique original PDF pages** were visually inspected for suspected OCR damage. All **27 source PDF names** were resolved locally, with immutable file hashes.

This pass records **169 corrections**, removes **33 additional duplicate questions**, excludes **six unrepairable/ambiguous questions**, and restores **one six-pair source matching exercise** from six fragmented essay prompts. Five fragment records are archived and linked to the matching question; all six tested protein/description pairs survive. The bank now has **1,416 questions: 971 MCQs, 444 essays and one matching exercise**. Across both cleanup passes, IBM has had 236 true duplicates removed and 14 ambiguous questions excluded, plus the five fragments consolidated into the original matching format.

Examples of corrected OCR include swallowed first alternatives, merged alternatives, Greek alpha/beta/omega symbols, scientific subscripts, polymerase numerals, 5′→3′ notation, duplicated headings and page-number/academy footers. Restoring options changed three answer indices solely to preserve the same correct answer content. The UTP question's broad high-energy wording was clarified to ask which reactant forms UDP-glucose, grounded in the opened [IUBMB EC2.7.7.9 reaction](https://iubmb.qmul.ac.uk/enzyme/EC2/7/7/9.html). The original matching table and printed key are recorded in [matching-original-page24.png](matching-original-page24.png).

## Verification

**15 Python behavioral tests passed. All 525 application tests in 86 files passed, and typechecking/production build passed in the actual working tree.** Focused tests cover the restored first alternatives and answer positions, complete per-original accounting, duplicate archives, real loader modes, all six matching answers, actual matching-widget rendering, precise UTP wording, and saved-session invalidation after changed content.

The single-bank replay rejects stale question hashes, missing/incomplete review coverage and changed source PDFs. It writes the canonical bank atomically and recovers if the bank write succeeds but receipt writing fails. Applying the release a second time changes no canonical bytes. Before/after SHA256 comparisons prove every other canonical JSON bank remained unchanged. No published IBM owner overlays existed at inspection time.

## Artifacts and reproduction

- `before.json`: immutable current bank at the start of this focused pass.
- `source-map.json`: exact question-PDF paths, hashes, source pages and occurrence anchors.
- `decisions-*.jsonl`, `coverage-*.jsonl`: hash-bound decisions and complete actual review coverage.
- `reviewed-duplicates.json` and disposition reports: adjudicated complete questions, all 35 duplicate candidate groups, all 161 similar-essay pairs and nine same-stem groups.
- `duplicates.json`, `exclusions.json`, `consolidations.json`: complete removed originals, reasons and surviving canonical links.
- `summary.json`, `verification.json`, test/build logs, scope and idempotence checks: release accounting and verification evidence.

Run `python3 -m unittest discover -s scripts -p 'test_*quality.py'`, `python3 scripts/ibm_quality.py --prepare`, inspect the ledgers, then `python3 scripts/ibm_quality.py --apply`. Run `npm test` and `npm run build`. The earlier year1-quality replay is a predecessor audit and must not be used to overwrite this newer IBM release; its hash guard rejects that state.

## Review boundaries and publication

The review was AI-assisted and nonblind: saved keys were visible. The 109-page visual review was targeted, not complete visual reconciliation of every occurrence in all PDFs. Unchanged answers were screened for plausibility and contradictions, not all freshly sourced or independently adjudicated. References and actual page-inspection methods are recorded per decision; no structural test is called medical certification.

**Applied and tested locally. No Git push or production deployment occurred.** Unrelated workspace development was preserved.
