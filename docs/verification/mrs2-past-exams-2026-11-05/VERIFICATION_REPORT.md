# Verification Report: Year 2 Respiratory System (MRS-2) Past Exams & Formative Assessments Intake

**Module:** `MRS-2` (Respiratory System, Year 2 Semester 1)  
**Date:** 5 November 2026  
**Source Document:** `MCQ for assessment - Old Exams - Formative exam - Omar Hisham` (149-slide PDF)  
**Ingestion Pipeline:** PDFParse spectral text & color operator extraction, medical adjudication against Guyton/West/Amboss, and canonical bank integration.

---

## 1. Intake Summary

| Section | Questions Extracted | Questions Medically Accepted | Questions Released | Format |
| :--- | :---: | :---: | :---: | :---: |
| **Microbiology (Old Exams)** | 9 | 9 | 9 | MCQ (5 options) |
| **Microbiology (Formative Exam)** | 9 | 9 | 9 | 7 MCQs + 2 Essays |
| **Physiology (Old Exams)** | 44 | 44 | 44 | MCQ (5 options) |
| **Physiology (Formative Exam)** | 8 | 8 | 8 | MCQ (5 options) |
| **Total** | **70** | **70** | **70** | **68 MCQs + 2 Essays** |

- **Chapter Added:** Chapter 4: `Past Exams & Assessments` (`id: 4`)
- **Subjects Added:**
  - `microbiology`: 18 questions (`MRS2-PE-MIC-001` through `MRS2-PE-MIC-018`)
  - `physiology`: 52 questions (`MRS2-PE-PHY-001` through `MRS2-PE-PHY-052`)
- **Previous Module Total:** 2,353 questions
- **New Module Total:** 2,423 questions

---

## 2. Key Medical Adjudications & Source Key Corrections

### 1. Physiology Q42 (Slide 131) — Intrapleural Pressure Becoming Positive
- **Source Slide Marked:** `b. During quiet expiration`
- **Medical Audit:** **MEDICALLY FALSE.** During normal quiet expiration, intrapleural pressure returns from $-6\text{ to }-8\text{ cmH}_2\text{O}$ to $-3\text{ to }-5\text{ cmH}_2\text{O}$ (remains strictly subatmospheric). Intrapleural pressure becomes positive ($>0\text{ mmHg}$, up to $+20\text{ to }+50\text{ mmHg}$) **strictly during active forced expiration**, coughing, or Valsalva maneuver via vigorous abdominal wall and internal intercostal muscle contraction.
- **Action Taken:** Adjudicated to `c. At the end of forced expiration`. Detailed explanation explicitly documents the physiological mechanics and warns students about the flawed source key.

### 2. Physiology Q33 (Slide 113) — Site of Maximum Airway Resistance
- **Medical Check:** Verified that medium-sized bronchi (generations 4–8) exhibit the highest resistance in the tracheobronchial tree. In small terminal bronchioles, the exponential multiplication of parallel pathways expands total cross-sectional area to $>10,000\text{ cm}^2$, dropping aggregate peripheral resistance to $<20\%$ of total.

### 3. Physiology Q36 (Slide 119) — Alveolar Ventilation Calculation
- **Given:** $\text{RR} = 15\text{ bpm}$, $V_T = 650\text{ mL}$, $V_D = 150\text{ mL}$.
- **Formula:** $\dot{V}_A = \text{RR} \times (V_T - V_D) = 15 \times (650 - 150) = 7,500\text{ mL/min} = 7.5\text{ L/min}$. Verified exact match with option `c`.

### 4. Microbiology Q15 (Slide 35) — Rhinocerebral Fungal Morphology
- **Source Description:** Broad hyphae with uneven thickness and wide branching at nearly right angles ($\sim 90^\circ$).
- **Diagnosis:** Pathognomonic for Mucorales (*Mucor spp.*, *Rhizopus*). Distinct from *Aspergillus* (narrow, septate, $45^\circ$ branching).

---

## 3. Automated Test Verification & Schema Compliance

- **Bank Schema Validator:** `npx tsx data-format-v2/scripts/validate-banks.ts` $\rightarrow$ **42/42 files passed** (0 warnings, 0 errors).
- **Vitest Suites:** `npm test` $\rightarrow$ **174 test files passed, 1,017 individual tests passed (100% green)**.
- **Dedicated Regression Test:** `src/test/respiratory-past-exams.test.ts` passing with 4 comprehensive assertions.
- **Production Build:** `npm run build` completed cleanly in 3.47s with PWA and assets bundled.
