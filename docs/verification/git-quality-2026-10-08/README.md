# GIT release quality screen — 8 October 2026

## Scope and policy
This is a conservative quality and consistency screen, not individual medical verification. Historical answer keys remain permitted. No references were invented, no answer keys were changed, and no website push or deployment was performed.

Original bank: 6,663 parent questions. The historical-key cohort of 4,948 questions was screened with GPT-6 Luna, high reasoning, using isolated inputs. The 100-question pilot covered 61 historical questions and 39 prior-reviewed questions. Three bulk files contain 1,629 historical questions each. Every returned ID and question hash was checked. Earlier reviewed answers were reused with structural checks rather than repeating costly source research.

The pilot detected reviewer schema mistakes: three keyed case MCQs were incorrectly treated as missing essay answers. The coordinator inspected their options/correctIndex and overrode those flags. One additional bulk-review schema mistake treated a four-option MCQ as matching; that flag was also overridden. All remaining content uncertainty was excluded conservatively, not asserted to be a medically proven error. A coordinator sample of 20 KEEP questions added two uncertainty exclusions. A pilot/sample is not a statistical guarantee of medical accuracy.

## Result
- 6,302 retained parents; 361 archived exclusions.
- Regular practice: 5,623; past exams/recalls: 679.
- MCQ 4,863; case 89; essay 911; matching 8; true/false 334; fill-in-the-blank 97.
- Historical-key answers retained: 4,587. Other answer evidence categories: 1,715.
- 129 retained questions had an exact trailing `Source underlined option label: <letter>` extraction annotation stripped from an option. Option order, answer indices, substantive prompts, answers, routing and IDs were preserved. The other flagged items were not reconstructed or medically corrected.
- No conflicting answer indices among exact normalized retained objective stems/options.
- GIT metadata corrected to 13 credits/260 marks.

The bank preserves both collections, eight subjects in each, and the exact ordered 104 topics in each collection, including empty topics. Individual multiple-answer MCQs, missing context, malformed options, suspected key conflicts and other uncertainty are excluded. Valid essay rubrics, cases, matching pairs and combination-option MCQs are not automatically multi-select questions. No image-based GIT questions were added.

## Artifacts
- ORIGINAL_BANK.json and ORIGINAL_RELEASE_MANIFEST.json: pre-screen snapshots.
- INPUT_WITH_PROVENANCE.jsonl / ALL_INPUT.jsonl: exact source questions, hashes and evidence classes.
- PILOT_INPUT.jsonl and PILOT_DECISIONS.jsonl: 100-question pilot.
- REVIEW_1–3.jsonl and REVIEW_1–3_DECISIONS.jsonl: bulk screen inputs/outputs.
- COORDINATOR_SAMPLE_INPUT.jsonl: deterministic 20-question KEEP audit sample.
- STRUCTURAL_FINDINGS.jsonl: final native-schema structural findings.
- FINAL_LEDGER.jsonl: all 6,663 IDs, retained/excluded, provenance, override and patch indicators.
- EXCLUSIONS.jsonl: full original withdrawn questions with reasons and hashes.
- PATCHES.jsonl: exact before/after option annotation patches.
- CANDIDATE_BANK.json: final local website bank.
- COUNTS.json / CHAPTER_COUNTS.csv: totals and all 208 collection/topic rows.
- DUPLICATE_KEY_CONFLICTS.json: retained normalized objective conflict audit (empty).

## Reproducibility and limits
`python3 -m unittest discover -s <this directory> -p test_screen.py` checks structure policy. `screen.py` regenerates structural findings; `finalize.py` validates review coverage and regenerates the candidate and reports. `apply_candidate.py` only replaces a bank still byte-identical to the original snapshot; its refusal after application is intentional, preventing accidental overwrites. Local reviews may be false positives or false negatives; historical-key permission remains explicit. No new independent online/book medical certification was added.

Website regression protection remaps historical answers/flags using original saved question IDs after withdrawals. Deleted IDs never shift answers onto another question, and an all-withdrawn history does not substitute new questions or earn a perfect-score celebration. Existing incomplete sessions fail order/ID compatibility checks after withdrawals.

Production release still requires the separately documented hosted owner-admin/Redis configuration and authenticated end-to-end test. No private keys were read or placed in Git. Physical Safari/iPad validation is distinct from earlier browser viewport checks. The unrelated working-tree changes and missing package-lock.json require release reconciliation before a Git push.
