# IBM-1 biochemistry intake — 9 October 2026

## Outcome

Imported **1,678 unique questions** locally into **Year 1 → Semester 1 → Introduction to Medical Biochemistry (IBM-1)**: **1,215 MCQs** and **463 written-response questions**, in two chapters and 20 named topics.

Full source scope was reviewed, including advanced metabolism and molecular biology. No current course textbook was designated; this import does not claim alignment with the current lecture syllabus.

## Accounting

| Measure | Count |
|---|---:|
| Source question records | 2,137 |
| Unlinked historical-answer records | 15 |
| Released source occurrences | 1,724 |
| Duplicates consolidated | 46 |
| Unique released questions | 1,678 |
| Missing-answer occurrences resolved | 1,243 |
| Recorded-key mismatches corrected | 17 |
| Excluded question records | 413 |
| Unlinked answers archived | 15 |
| Pending review | 0 |

The 223 `correct` dispositions include source-boundary and wording repairs. They do not mean 223 wrong historical keys. All 2,152 original IDs remain in `source-accounting.json`, with original anchors, content hashes, individual reasons and destination IDs. Full decisions and opened evidence are preserved in `medical-decisions.json` and the job REVIEW directory.

## Chapters and topics

| Chapter | Topic | Questions |
|---|---|---:|
| Cell Chemistry & Biophysics | Amino acids and protein structure | 463 |
| Cell Chemistry & Biophysics | Hemoglobin and heme | 13 |
| Cell Chemistry & Biophysics | Iron metabolism | 4 |
| Cell Chemistry & Biophysics | Carbohydrate chemistry | 129 |
| Cell Chemistry & Biophysics | Lipid chemistry and membranes | 146 |
| Cell Chemistry & Biophysics | Vitamins and coenzymes | 72 |
| Cell Chemistry & Biophysics | Nucleotides and nucleic acids | 53 |
| Cell Chemistry & Biophysics | DNA replication | 26 |
| Cell Chemistry & Biophysics | Transcription | 34 |
| Cell Chemistry & Biophysics | Translation | 55 |
| Cell Chemistry & Biophysics | Regulation of gene expression | 21 |
| Enzymes, Bioenergetics & Metabolism | Enzymes and regulation | 242 |
| Enzymes, Bioenergetics & Metabolism | Clinical enzyme markers | 21 |
| Enzymes, Bioenergetics & Metabolism | Glycolysis and pyruvate metabolism | 32 |
| Enzymes, Bioenergetics & Metabolism | Carbohydrate metabolism and glucose homeostasis | 106 |
| Enzymes, Bioenergetics & Metabolism | Glycogen metabolism | 7 |
| Enzymes, Bioenergetics & Metabolism | Pentose phosphate pathway | 4 |
| Enzymes, Bioenergetics & Metabolism | TCA cycle and bioenergetics | 90 |
| Enzymes, Bioenergetics & Metabolism | Amino acid and nitrogen metabolism | 108 |
| Enzymes, Bioenergetics & Metabolism | Lipid metabolism | 52 |

## Review method

Each record was reviewed with its complete supplied alternatives or open-response task. Missing keys were derived using opened university textbooks, NIH/NLM sources and relevant full-text research. The review is **NONBLIND_SELF_REVIEW**: historical keys were available, and there was no independent clinician certification.

The designated TXT includes all 493 page transcripts. Source repairs used those transcripts with exact source/page anchors; the original PDFs were not visually inspected in this intake. No new OCR or page-image completeness claim is made. Image-dependent questions, genuinely multiple-valid-answer MCQs, incomplete tasks and remaining unsupported claims were individually excluded. Examples include chromosome-order choices without a valid answer, undefined ATP-yield assumptions, obsolete unqualified conventions, missing images and merged questions whose boundaries could not be safely recovered.

Written responses use model answers and distinct required points; matching/blank source tasks are represented as faithful written responses where the actual task and answer were recoverable. No invented distractors or silently defaulted answer indices were used. This bank has no new true/false format, so no boolean/index conversion is introduced.

Every released question has a short explanation. Evidence and full historical review metadata stay in the audit files rather than the student download, reducing the IBM-1 production chunk from approximately 2.2 MB to 1.1 MB.

## Verification

- Nine Python regression tests passed: source boundaries, unusual letter ranges, missing/out-of-range keys, duplicate IDs, stale reviews, essay rubrics, patch traceability, and preservation of plus/minus signs and decimal values.
- All 450 website tests passed in a clean snapshot of published HEAD plus this intake (63 files). This excludes the unrelated local XP work.
- Production build and all three TypeScript configurations passed on Node 24.16.0. The existing large-bank chunk warning remains advisory; the build completed.
- Four dedicated integration tests account for every source record, verify topic placement, load all MCQs/essays and grade every imported answer through the website scoring helper.
- Original source and preserved INPUT copy hashes match; canonical file matches the tested release candidate.

## Files and reproduction

- Original: `Biochemistry_COMPLETE_All_Questions_and_Answers.txt`
- Immutable job: `QUESTION_IMPORT_JOB`
- Canonical bank: `./src/imports/year-1/semester-1/IBM-1.json`
- Source SHA256: `456557174a900246edb4da227a6cc195c19177a8f6a44d60e11f70cd2ec76b8c`
- Bank SHA256: `196ed7d62d7ae703f81cee61731e677d569e3c779baeca94c33fed2e15acbe2e`

```sh
python3 scripts/test_biochemistry_txt_intake.py
python3 scripts/build_biochemistry_bank.py "QUESTION_IMPORT_JOB" src/imports/year-1/semester-1/IBM-1.json /tmp/ibm-regenerated
npm test
npm run build
```

## Local browser check

The main local route `/year-1/ibm-1/mcq` renders IBM-1 with 1,215 MCQs (746 in chapter 1 and 469 in chapter 2), the expected chapter names and existing shuffle/navigation controls. Local cloud settings are unavailable, so the academic-year confirmation dialog blocks a full interactive quiz walkthrough. No account year was changed and no server secret was copied. The actual data-loader/grading integration was independently exercised by the automated suite. This limitation is not represented as a successful end-to-end browser check.

## Publication

Local import is complete. No commit, GitHub push or production deployment was performed for this intake. Existing local XP and other uncommitted work were preserved. The clean release snapshot and exact logs are ready for a scoped publication.
