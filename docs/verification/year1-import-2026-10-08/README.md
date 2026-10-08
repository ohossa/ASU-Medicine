# Year 1 Semester 1 source-bank import

Imported the four explicitly designated source files. Original source stems, options, answer keys, explanations and chapter/topic order were preserved. No answers were inferred or medically re-adjudicated.

| Module | Groups | Chapters | Types |
|---|---:|---:|---|
| MBMG-1 | 1,002 | 12 | 999 MCQs, 3 short answers presented as essays |
| IAE-1 | 1,107 | 9 | 939 MCQs, 52 matching, 70 blanks, 40 essays, 6 cases |
| IPHY-1 | 769 | 13 | 763 MCQs, 6 true/false |
| P1-1 | 86 | 4 | 69 MCQs, 17 true/false |
| Total | 2,964 | 38 | Case children are additional parts, not parent groups |

All four banks have `comingSoon: false` and nonempty content; the existing module activation logic unlocks them. Module credits/marks agree with the existing Semester 1 catalog (IAE 5/100; IPHY 4/80; MBMG 3/60; P1 1.5/30).

`source-mapping.json` records every source row and its destination question ID, chapter and topic index, plus source file hashes. Genetics provenance and publication flags are retained in the canonical bank. ICT was already present locally; the source was converted once, preserving existing question IDs by stem/type/options instead of appending a second copy. Source-internal repetitions remain exactly as supplied.

The deterministic converter `scripts/import-year1-release.py` validates all four inputs before writing any target. It rejects unmapped/out-of-range answers, missing stems/options/essay answers, conflicting chapter titles, invalid blank counts and duplicate IDs. It supplies the required question types and case child IDs without guessing answers.

Verification performed against clean published source plus only this import:

- Full Vitest suite: 435 tests across 61 files passed.
- Strict application, Node and API TypeScript checks passed.
- Production Vite/PWA build passed.
- Import regression checks: source/destination counts, schema, unique IDs, module activation, MCQ/essay routing, every MCQ and boolean true/false key, and complete case child answers.

This release excludes unfinished learning/XP/progress work and the proposed AI report-triage plan. These remain local. Automated checks establish import and grading integrity, not independent medical accuracy of supplied keys.
