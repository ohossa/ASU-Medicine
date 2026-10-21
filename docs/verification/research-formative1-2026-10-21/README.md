# Scientific Research (R-3) Formative Exam 1 Intake & Verification Report

**Date:** 21 October 2026
**Module:** R-3 (Scientific Research / Biostatistics & Research Methodology)
**Destination:** Year 3, Semester 2 (`src/imports/year-3/semester-2/R-3.json`)
**Designated Source:** Official Faculty of Medicine - Ain Shams University Online Exam: *Formative Exam 1 (Third Year, 2024 By-Law)*
**Assigned Chapter:** Chapter 8 (`bankSection: "past-exams"`)

---

## 1. Scope & Source Accounting

The source document contains 8 pages from the official faculty portal (EMP - Faculty of Medicine - Ain Shams University):
- **Page 1:** Exam header & 10-question navigation bar.
- **Pages 2–7:** Questions 1 through 10 (all single-best-answer MCQs).
- **Page 8:** Faculty footer page.

### Question Disposition
- **Total Source Questions:** 10
- **Image-Dependent Exclusions:** 0
- **Ambiguous Exclusions:** 0
- **Accepted & Verified Questions:** 10
- **Released Destination:** Chapter 8 (*Formative Exam 1*), marked with `bankSection: "past-exams"`.

---

## 2. Medical & Biostatistical Adjudication

All 10 questions were medically adjudicated against standard biostatistical literature (Daniel & Cross, *Biostatistics: A Foundation for Analysis in the Health Sciences*):
1. **Q1 (R3-FE1-CLIN-0001):** Type I error (α) $\rightarrow$ *Rejects a true null hypothesis*.
2. **Q2 (R3-FE1-CLIN-0002):** Z-score interpretation $\rightarrow$ *Two standard deviations above the mean*.
3. **Q3 (R3-FE1-CLIN-0003):** Decision rule ($p = 0.03$ vs $\alpha = 0.05$) $\rightarrow$ *Reject H0 at the 5% significance level*.
4. **Q4 (R3-FE1-CLIN-0004):** Standard error vs sample size $\rightarrow$ *Decreases* ($SE = s / \sqrt{n}$).
5. **Q5 (R3-FE1-CLIN-0005):** Empirical rule within $1\sigma$ $\rightarrow$ *68%*.
6. **Q6 (R3-FE1-CLIN-0006):** Central tendency in normal curve $\rightarrow$ *Mean = median = mode*.
7. **Q7 (R3-FE1-CLIN-0007):** Null hypothesis definition $\rightarrow$ *There is no effect, difference, or association*.
8. **Q8 (R3-FE1-CLIN-0008):** 95% Confidence level $\rightarrow$ *95% confidence that the interval contains the population parameter*.
9. **Q9 (R3-FE1-CLIN-0009):** Initial step in hypothesis testing $\rightarrow$ *State the null and alternative hypotheses*.
10. **Q10 (R3-FE1-CLIN-0010):** Central Limit Theorem utility $\rightarrow$ *When estimating a population mean from sample data*.

---

## 3. Bank State & Conservation

- **Previous Bank Total:** 53 questions across 3 active practical chapters + 4 placeholder chapters.
- **New Bank Total:** 63 questions across 4 active chapters (Chapters 1, 2, 3, and Chapter 8 Past Exam) + 4 placeholder chapters (Chapters 4, 5, 6, 7).
- **Bank Manifest Revision:** `72aabc75a95b1cd2f198ae87fac016e4279388afa635292079c54a280afc7ea8`.
- **Validation:** Strict schema validator passed with 0 errors.
- **Tests:** `src/app/research-bank.integration.test.ts` (6/6 passed).
- **Build & Types:** Typecheck and Vite production build passed with code 0.
