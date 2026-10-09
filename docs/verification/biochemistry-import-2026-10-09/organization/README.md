# IBM-1 book-aligned organization

All 1,671 questions are retained: 1,208 MCQs and 463 essays. Stable IDs, stems, choices, answers, explanations and provenance are unchanged. Only chapter placement and the within-section lecture index changed.

The five book chapters contain 16 lecture topics, exposed as selectable sections in table-of-contents order. Fourteen additional topics preserve material beyond the supplied guide.

## Chapter counts

| Topic | MCQ | Essay | Total |
|---|---:|---:|---:|
| Introduction to Medical Biochemistry & Protein Chemistry | 51 | 5 | 56 |
| Classification of Amino Acids | 138 | 25 | 163 |
| Basic Protein Structure | 71 | 8 | 79 |
| Protein Conformation | 77 | 12 | 89 |
| Protein Folding & Misfolding | 17 | 3 | 20 |
| Protein Classification & Denaturation | 39 | 19 | 58 |
| Carbohydrate Chemistry | 102 | 29 | 131 |
| Lipid Chemistry | 88 | 33 | 121 |
| Chemistry of Biological Membrane | 15 | 3 | 18 |
| Introduction to Medical Enzymology | 53 | 5 | 58 |
| Enzyme Kinetics | 31 | 5 | 36 |
| Enzyme Inhibition | 44 | 13 | 57 |
| Regulation of Enzyme Activity | 70 | 7 | 77 |
| Clinical Importance of Enzymes and Isozymes | 37 | 9 | 46 |
| Introduction to Metabolism | 10 | 0 | 10 |
| Glycolysis | 62 | 7 | 69 |
| Hemoglobin and Heme (additional) | 4 | 8 | 12 |
| Iron Metabolism (additional) | 2 | 2 | 4 |
| Vitamins and Coenzymes (additional) | 33 | 43 | 76 |
| Nucleotides and Nucleic Acids (additional) | 35 | 14 | 49 |
| DNA Replication (additional) | 23 | 22 | 45 |
| Transcription (additional) | 21 | 14 | 35 |
| Translation (additional) | 23 | 13 | 36 |
| Regulation of Gene Expression (additional) | 4 | 18 | 22 |
| Carbohydrate Metabolism and Glucose Homeostasis (additional) | 16 | 13 | 29 |
| Glycogen Metabolism (additional) | 10 | 6 | 16 |
| Pentose Phosphate Pathway (additional) | 6 | 8 | 14 |
| TCA Cycle and Bioenergetics (additional) | 61 | 25 | 86 |
| Amino Acid and Nitrogen Metabolism (additional) | 42 | 60 | 102 |
| Lipid Metabolism (additional) | 23 | 34 | 57 |

## Source and scope

The supplied OCR PDF is 59 pages and ends during regulation of enzyme activity. Clinical enzymes, introduction to metabolism and glycolysis appear in the contents but their body pages are absent. Placement uses their topic definitions; it does not claim absent pages were reviewed.

Every placement has an ID and rationale in `placements.jsonl`. `topics.json` records book chapter, printed page and evidence coverage. `bank-before.json` is an immutable baseline. `summary.json` contains checksums and counts.

## Reproduce safely

Run from the repository root, after the intake and polish layers. The checksum guard prevents applying this ledger to an unrelated baseline.

```sh
python3 scripts/biochemistry_organization.py docs/verification/biochemistry-import-2026-10-09/organization/bank-before.json docs/verification/biochemistry-import-2026-10-09/organization/placements.jsonl docs/verification/biochemistry-import-2026-10-09/organization/topics.json src/imports/year-1/semester-1/IBM-1.json --expected-sha256 14d2214d7dda4e2feac521cbb14d616ba48bcc33938220924b57e2ad630453ef
python3 -m unittest discover -s scripts -p "test_biochemistry*.py"
npm test
npm run build
```

The base intake/polish builder still produces the earlier two source groups; replay this organization layer last. New questions require a new reviewed complete placement ledger, not automatic keyword guesses.

## Saved results

The history resolver restores original question order, answers and flags by stable question IDs across the entire module if a chapter has been reorganized. Old chapter IDs 1/2 do not alias the new sections 101–116 and 201–214. Saved results remain reviewable without assigning old answers to different questions.

## Publication

These changes are local. No push or deployment is included. Donation and XP work remain separate.
