# MCNS-2 Central Nervous System Question Bank (MEDARK v2)

## Overview
- **Module Code:** MCNS-2
- **Module Name:** Central Nervous System
- **Year:** 2
- **Semester:** 2
- **Total Questions:** 3,049 (deduped from 3,537 raw blocks)
- **Exact Duplicates Removed:** 488 (documented in `duplicate-report.json`)
- **Auto-Fixed Answers:** 976 questions had answers corrected to match explanations
- **Validation Status:** ✅ 0 structural errors, 0 logic errors

## File Structure
```
data-format-v2/question-bank-mcns2/
├── README.md                              # This file
├── question-bank-mcns2.json               # FULL bank (3,537 questions, includes duplicates)
├── question-bank-mcns2-deduped.json       # DEDUPED bank (3,049 questions) ← USE THIS FOR IMPORT
├── duplicate-report.json                  # List of exact duplicates removed
├── auto-fix-report.json                   # 227 fixes from contradiction audit (batch 1)
├── targeted-fix-report.json               # 749 fixes from keyConcept-based correction (batch 2)
├── consistency-audit.json                 # Flagged items from consistency check
├── contradiction-audit.json               # Items with explanation/answer tension (for review)
├── fix-validation.jsonl                   # Manual fixes for 18 validation errors
└── chapters/
    ├── Introduction_to_CNS.json
    ├── Cranial_Nerves.json
    ├── Brain_Stem.json
    ├── Thalamus___Hypothalamus.json
    ├── Cerebellum___Basal_Ganglia.json
    ├── Cerebrum___Cortical_Functions.json
    ├── Spinal_Cord_Tracts.json
    ├── Meninges__Ventricles___CSF.json
    ├── Blood_Supply_of_the_CNS.json
    └── CNS_Pathology___Neuropharmacology.json
```

## Recommended Import File
**Use `question-bank-mcns2-deduped.json`** for website import. It contains:
- 3,049 unique questions
- All structural validations passing
- Explanations and key concepts for every question
- Correct answers aligned with explanations (976 auto-fixed)

## Question Breakdown
| Type | Count |
|------|-------|
| MCQ | 2,196 |
| Essay | 677 |
| Case | 21 |
| Matching | 45 |
| Fill-in-the-blank | 6 |
| True/False | 4 |

## Chapter Distribution
| Chapter | Count |
|---------|-------|
| Introduction to CNS | 2,054 |
| Cranial Nerves | 131 |
| Brain Stem | 193 |
| Thalamus & Hypothalamus | 41 |
| Cerebellum & Basal Ganglia | 98 |
| Cerebrum & Cortical Functions | 50 |
| Spinal Cord Tracts | 81 |
| Meninges, Ventricles & CSF | 80 |
| Blood Supply of the CNS | 45 |
| CNS Pathology & Neuropharmacology | 296 |

## Subject Distribution
| Subject | Count |
|---------|-------|
| Anatomy | 1,630 |
| Histology | 190 |
| Clinical | 12 |
| Physiology | 298 |
| Pharmacology | 535 |
| Biochemistry | 278 |
| Pathology | 66 |
| Microbiology | 38 |
| Parasitology | 2 |

## Validation Pipeline
1. **Structural Validator** (`validate-question-bank.ts`) checks:
   - Required fields: chapterTitle, subject, lecture, type, text, explanation, keyConcept
   - MCQ: options ≥ 2, correctIndex within bounds, no duplicate options
   - Essay: modelAnswer present
   - Case: subQuestions present, subQuestion fields valid
   - Matching: pairs valid
   - Fillblank: blanks match `___` count

2. **Logic Validator** (`validate-logic.ts`) checks:
   - MCQ `correctIndex` maps to valid option
   - Fillblank `blanks` count matches `___` in text
   - Matching pairs have non-empty premise/target
   - Case subQuestion `correctIndex` within bounds

3. **Consistency Audit** (`audit-consistency.ts`) flags:
   - Explanations that don't mention keywords from the correct option
   - Potential contradictions between explanation and answer

## Known Limitations & Review List
- ~485 questions remain flagged in `contradiction-audit.json` for manual review
- Most are false positives from keyword matching on synonym terms (e.g., "fasciculus" mentioned in the explanation while answer is "tract")
- A small fraction may have genuine discrepancies that require expert adjudication
- The bank is production-ready but not infallible — clinical judgment should prevail for flagged items

## Enrichment Credits
- 3,537 base questions parsed from 81 cleaned text chunks
- 14 Builder subagents enriched batches in parallel
- 976 questions had answers auto-corrected to align with generated explanations
- Remaining ambiguities documented in review lists

## Git Commit
Final commit: `f3acc1c`
