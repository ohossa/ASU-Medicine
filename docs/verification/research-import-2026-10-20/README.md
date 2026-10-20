# Scientific Research (R-3) Intake & Verification Report

**Date:** 20 October 2026
**Module:** R-3 (Scientific Research / Biostatistics & Research Methodology)
**Destination:** Year 3, Semester 2 (`src/imports/year-3/semester-2/R-3.json`)
**Designated Source:** Department Practical Exercise Book (`media_1792437454418_e9c171f6.pdf`, 14 pages)
**Catalog Metadata:** 1.5 Credit Points, 30 Total Marks

---

## 1. Scope & Source Accounting

The designated source file contains 14 high-resolution scanned pages from the official department practical book for Third Year (2025–2026):
- **Page 1 (Book p. 56):** Cover and Practical Course Overview.
- **Page 2 (Book p. 57):** Table of Contents listing 7 practical exercise topics.
- **Pages 3–7 (Book pp. 58–62):** Practical 1 — Normal distribution curve (skewness and kurtosis).
- **Pages 8–11 (Book pp. 63–65):** Practical 2 — Inferential statistics I (Estimation - Central Limit Theorem).
  *Note: PDF page 9 is an identical duplicate scan of Book page 63 (already captured from PDF page 8).*
- **Pages 12–14 (Book pp. 66–68):** Practical 3 — Inferential statistics II (Hypothesis Testing).

### Syllabus Table of Contents & Chapter Structure
The textbook Table of Contents (PDF p. 2 / Book p. 57) lists 7 practical topics:
1. Practical 1: Normal distribution curve (skewness and kurtosis) [Book p. 58] — **Populated (14 questions)**
2. Practical 2: Inferential statistics I (Estimation - Central Limit Theorem) [Book p. 63] — **Populated (15 questions)**
3. Practical 3: Inferential statistics II (Hypothesis Testing) [Book p. 66] — **Populated (24 questions)**
4. Practical 4: Hypothesis testing (quantitative and qualitative data) [Book p. 70] — **Placeholder (Book pp. 70+ pending)**
5. Practical 5: Systematic review and Meta-analysis [Book p. 74] — **Placeholder (Book pp. 74+ pending)**
6. Practical 6: Evidence based medicine [Book p. 88] — **Placeholder (Book pp. 88+ pending)**
7. Practical 7: Critical appraisal [Book p. 90] — **Placeholder (Book pp. 90+ pending)**

Because the uploaded document excerpt terminates at Book page 68, Chapters 4 through 7 are preserved as empty placeholder chapters (`subjects: []`) adhering to the official syllabus taxonomy, ready for intake when the remaining pages are provided.

---

## 2. Occurrence Conservation & Disposition

- **Total Page Scans:** 14
- **Total Question Occurrences:** 56
- **Duplicate Scans:** 1 (PDF p. 9 duplicate of Book p. 63)
- **Image-Dependent Exclusions:** 3
  - PDF p. 5 / Book p. 60: Curve identification item requiring hand-drawn/visual distribution plots.
  - PDF p. 6 / Book p. 61: Two curve identification items requiring visual skewness graphs.
- **Medically Accepted & Released Questions:** 53

### Distribution by Question Type
- **MCQ:** 34
- **True / False:** 5
- **Fill in the Blank:** 5
- **Matching:** 1
- **Essay / Case Study:** 8
- **Total:** 53

---

## 3. Medical Adjudication & Rationale

Every single released question was derived from biostatistics and epidemiological first principles, verified against standard medical biostatistics literature (Daniel & Cross, *Biostatistics: A Foundation for Analysis in the Health Sciences*):
1. **Normal Distribution & Empirical Rule:** Clarified ±1σ (68.27%), ±2σ (95.45%), and ±3σ (99.73%), differentiating theoretical 95% coverage (±1.96σ) from integer standard deviation rules.
2. **Central Limit Theorem & Standard Error:** Validated calculations for $SE = \sigma / \sqrt{n}$ and properties of sampling distributions as $n \ge 30$.
3. **Hypothesis Testing & Error Probabilities:** Rigorously formulated Null ($H_0$) and Alternative ($H_1$) hypotheses, Type I error ($\alpha$), Type II error ($\beta$), and Statistical Power ($1 - \beta$).
4. **P-value Interpretations:** Provided structured essay model answers distinguishing rejection thresholds ($p \le \alpha$) and failure to reject ($p > \alpha$) along with associated error risks.

---

## 4. Verification & Testing Gates

- **Bank Schema Validator:** `npx tsx data-format-v2/scripts/validate-banks.ts src/imports/year-3/semester-2/R-3.json` $\rightarrow$ **Passed (0 errors)**.
- **Manifest Synchronization:** Regenerated via `scripts/generate-bank-manifest.mjs`, establishing `R-3` with 45 MCQ-like questions and 8 Essay questions (53 total).
- **TypeScript Typecheck:** `npm run typecheck` $\rightarrow$ **Passed (Code 0)**.
- **Integration Tests:** `src/app/research-bank.integration.test.ts` $\rightarrow$ **6/6 passed**:
  - Schema conformity.
  - Metadata matching (`creditPoints: 1.5`, `totalMarks: 30`, `comingSoon: false`).
  - Question count and chapter distribution.
  - Question type breakdown.
  - MCQ and True/False grading accuracy with `checkAnswerCorrect`.
  - Essay model answers and fillblank validation.
- **Existing Test Suites:** Vitest routing tests (`import-routing.test.ts` & `special-senses.test.ts`) $\rightarrow$ **39/39 passed**.
