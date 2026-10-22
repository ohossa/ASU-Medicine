# Scientific Research (R-3) Intake Verification: Dr. Maged Adel (2026) Part 1

**Module:** Scientific Research (`R-3`), Year 3, Semester 2  
**Source Document:** `Research Methodology MCQs Part 1 - Dr. Maged Adel 2026`  
**File SHA-256:** `24f214da60bb3515e591e9c7616d43d90b714f1ac2dc9bb63fc72e7eca621957`  
**Total Pages:** 46  
**Intake Date:** 22 October 2026  

---

## 1. Scope & Audit Summary

The designated source PDF contains 120 multiple-choice questions across 3 parts matching the existing syllabus chapters:

| Part / Section | Title | PDF Pages | Answer Key Page | Total Items | Excluded Duplicates | Accepted Items | Destination Chapter |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Part 1** | Normal Distribution Curve | 2–15 | 16 | 40 | 2 | 38 | Chapter 1 (`R3-CH1-CLIN-0015` – `0052`) |
| **Part 2** | Inferential Statistics I: Estimation | 17–30 | 31 | 40 | 0 | 40 | Chapter 2 (`R3-CH2-CLIN-0016` – `0055`) |
| **Part 3** | Inferential Statistics II: Hypothesis Testing | 32–45 | 46 | 40 | 4 | 36 | Chapter 3 (`R3-CH3-CLIN-0025` – `0060`) |
| **Total** | | | | **120** | **6** | **114** | |

---

## 2. Strict De-duplication Ledger

Under the repository policy and explicit user alignment, questions testing identical single-fact definitions with near-identical stems already in the chapter were excluded to protect students from redundant prompts:

1. **`MA2026-CH1-Q03`** (Excluded): Duplicate of `R3-CH1-CLIN-0002` (Mean, median, and mode equality in normal distribution).
2. **`MA2026-CH1-Q06`** (Excluded): Duplicate of `R3-CH1-CLIN-0003` (Total area under normal distribution curve equals 1).
3. **`MA2026-CH3-Q18`** (Excluded): Duplicate of `R3-CH3-CLIN-0004` (Type I error definition: rejecting true null hypothesis).
4. **`MA2026-CH3-Q19`** (Excluded): Duplicate of `R3-CH3-CLIN-0003` (Probability of Type I error denoted by alpha).
5. **`MA2026-CH3-Q23`** (Excluded): Duplicate of `R3-CH3-CLIN-0005` (Type II error definition: failing to reject false null hypothesis).
6. **`MA2026-CH3-Q28`** (Excluded): Stem duplicate of `R3-CH3-CLIN-0012` (Power of statistical test definition), and tested verbally in `MA2026-CH3-Q40`.

Full records and rationales are preserved in [`exclusion-ledger.json`](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/docs/verification/research-maged-adel-2026-10-22/exclusion-ledger.json).

---

## 3. Bank Growth & Distribution

- **Chapter 1 ("Normal Distribution Curve")**: 14 prior + 38 new = **52 questions**
- **Chapter 2 ("Inferential Statistics I: Estimation")**: 15 prior + 40 new = **55 questions**
- **Chapter 3 ("Inferential Statistics II: Hypothesis Testing")**: 24 prior + 36 new = **60 questions**
- **Chapter 8 ("Formative Exam 1")**: Preserved = **10 questions** (`past-exams`)
- **Total `R-3` Bank Size**: 63 prior + 114 new = **177 questions**

---

## 4. Quality & Gate Checklist

- [x] **Extraction Ledger**: 120 items accounted for with page anchors.
- [x] **Medical Review**: 114 accepted items reviewed with comprehensive distractor analysis and KaTeX formulas.
- [x] **Schema Validation**: Passed `validate-banks.ts` with 0 errors.
- [x] **Integration Tests**: `research-bank.integration.test.ts` (6/6 tests passing).
- [x] **Module & Routing Tests**: `import-routing.test.ts` (27/27 passing), `special-senses.test.ts` (12/12 passing).
- [x] **TypeScript Typecheck**: Passed with exit code 0.
- [x] **Production Build**: Successful build (`R-3-Dk0FbZvq.js`).
