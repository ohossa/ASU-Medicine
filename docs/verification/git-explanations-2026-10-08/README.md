# GIT explanations — local release, 8 October 2026

## Result

- 6,179 retained parent questions, with 301 case subquestions.
- 6,480 short explanations: one for every retained parent and child.
- Median length: 18 words; maximum: 54 words.
- Regular practice: 5,508; separate past exams/recalls: 671.
- 123 additional parent questions withheld because a key, wording, or answer context could not be explained reliably. Originals are preserved in the local exclusion ledger. Cases are withheld as a whole when any child is unresolved.

## Scope and method

The frozen input contained 6,302 parents and 306 case children (6,608 individual targets). Three GPT-6 Luna authoring passes created question-specific explanations in sidecars. Separate reviewers read every corresponding question and explanation, including options, polarity, matching pairs, blanks, and case context. ID and hash checks alone were insufficient: displaced draft explanations were caught, corrected, and independently audited before application. Semantic audits are bound to the exact reviewed text or full decision hash. Coordinator overrides document resolved false flags and targeted source checks.

Explanations focus on a mechanism, relationship, discriminator, or useful contrast rather than merely restating the selected answer. Case children reveal their own explanation when answered or when their reference answer is revealed. No explanations appear before answering objective questions.

Historical answer keys remain permitted. This is an explanation/content audit with targeted book and authoritative online checks, **not** independent medical verification of every answer. Source URLs are recorded only for references actually consulted. No claim of zero medical errors is made.

Retained question text, options, answer keys, model answers, matching pairs, accepted blanks, IDs, topic assignments, collection boundaries, and order were preserved. Only explanation fields changed; uncertain parents were removed from the active local bank. The exact 104 Inerd topics remain in each collection. No question images were added.

## Verification

- Website suite: 44 test files, 304 tests passed, including explanation coverage for every parent and child, exact question/answer fidelity, navigation, collection separation, grading, and case explanation reveal behavior.
- Production build: passed under Node 24.
- Explanation gate: seven tests passed (empty/placeholder/overlong/copy-only prevention).
- Independent candidate verification: passed; every original parent is either retained unchanged apart from explanation or recorded with its original in the exclusion ledger.
- Strict application TypeScript check still reports the existing baseline diagnostics (120 distinct diagnostics); this change introduced zero new diagnostics. This check is not reported as passing.

## Counts by parent format

| Format | Questions |
| --- | ---: |
| case | 87 |
| essay | 904 |
| fillblank | 97 |
| matching | 8 |
| mcq | 4,758 |
| truefalse | 325 |

## Audit and recovery files

Full working directory: `/Users/omarhossa/Documents/asu.codes questions/GIT_LOCAL_PREPARATION/EXPLANATIONS_2026_10_08/`

- `ORIGINAL_BANK.json`, `ORIGINAL_MANIFEST.json`: immutable pre-release snapshots.
- `ALL_INPUT.jsonl`, `INPUT_1.jsonl`–`INPUT_3.jsonl`: source targets and original hashes.
- `OUTPUT_1.jsonl`–`OUTPUT_3.jsonl`: author decisions.
- `SEMANTIC_AUDIT_1.jsonl`–`SEMANTIC_AUDIT_3.jsonl`: full independent coverage, {'PASS': 6280, 'FIX': 233, 'FLAG': 95}.
- `COORDINATOR_OVERRIDES.jsonl`, `STYLE_PATCHES.jsonl`: explicit final resolutions and editorial changes.
- `EXPLANATIONS.jsonl`: final retained explanations with provenance.
- `FINAL_LEDGER.jsonl`, `EXCLUSIONS.jsonl`: every parent accounted for, with originals and reasons.
- `CANDIDATE_BANK.json`, `COUNTS.json`, `CHAPTER_COUNTS.csv`: final bank and all 208 collection/topic counts.
- `finalize_explanations.py`, `verify_candidate.py`, `explanation_gate.py`: guarded merge and independent fidelity checks.
- `GATE_TESTS.log`, `FIDELITY_CHECK.log`, `WEBSITE_TESTS.log`, `BUILD.log`: reproducible verification evidence.
- `SHA256SUMS.json`: artifact checksums.

The website copy is local at `src/imports/year-3/semester-1/MGL-3.json`. It has not been pushed or deployed in this task. Preview: http://127.0.0.1:5183/
