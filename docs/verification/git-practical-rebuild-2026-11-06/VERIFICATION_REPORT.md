# Verification Report: Year 3 GIT Practical Exam (`MGL-3`) Complete Rebuild

**Module:** `MGL-3` (Gastrointestinal & Liver System, Year 3 Semester 1)  
**Date:** 6 November 2026  
**Intake Sources:**
1. **Google Forms (10 Forms):**
   - Parasitology Practical Spotters Form (84 questions)
   - Physiology Practical Exam Form (Q8–Q55 retained = 48 clinical gastroenterology questions; 7 manometry/pressure recording questions excluded per user specification)
   - Histology Practical Parts 1 & 2 Forms (183 questions)
   - Pathology Museum Gross Jars Form (95 questions)
   - Pathology Lab Microscopic Slides Form (50 questions)
   - Anatomy Practical Modules 1–4 Forms (315 questions)
2. **Microbiology Practical Mock Exam PDF (Dr. Muhammad Ashraf, 51 questions)**

---

## 1. Master Compilation & Structure

| Chapter | Title | Subject | Questions Extracted | Questions Medically Accepted | Total Images (WebP) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **301** | Practical — Anatomy | Anatomy | 315 | 315 | 315 |
| **302** | Practical — Histology | Histology | 183 | 183 | 183 |
| **303** | Practical — Pathology (Museum Jars) | Pathology | 95 | 95 | 95 |
| **304** | Practical — Pathology (Microscopic Slides) | Pathology | 50 | 50 | 50 |
| **305** | Practical — Parasitology | Parasitology | 84 | 84 | 84 |
| **306** | Practical — Microbiology | Microbiology | 51 | 51 | 18 |
| **307** | Practical — Physiology | Physiology | 48 | 48 | 0 (Clinical Scenarios) |
| **Total** | **7 Practical Chapters** | **7 Subjects** | **826** | **826** | **746** |

---

## 2. On-Demand Lazy Loading Architecture

- **Bundle Size Optimization:** Previously, static importing bundled practical questions directly into main chunks.
- **Dynamic Chunking:** `mgl-3-practical.json` (836 KB raw JSON) is now dynamically imported on demand via `ensurePracticalDataLoaded('MGL-3')` in `src/app/data.ts` and gated by `RouteDataGate.tsx`.
- **Zero-Byte Overhead:** When students browse general theory MCQs, Mixed exam mode, or visit the home screen, `mgl-3-practical-g08TEslm.js` is **never downloaded** (saving 623.63 KB gzipped JavaScript over the network).
- **Instant Display:** `getModuleQuestionCounts('MGL-3')` statically provides `practicalCount = 826`, allowing the mode selector card to display the full count immediately.

---

## 3. High-Efficiency Image Optimization

- **Format:** Pure WebP (`quality=80`, max width 1100px).
- **Directory Structure:**
  - `public/images/practical/mgl-3/anatomy/` (315 images)
  - `public/images/practical/mgl-3/histology/` (183 images)
  - `public/images/practical/mgl-3/pathology/museum/` (95 images)
  - `public/images/practical/mgl-3/pathology/lab/` (50 images)
  - `public/images/practical/mgl-3/parasitology/` (84 images)
  - `public/images/practical/mgl-3/microbiology/` (18 images)
- **Asset Integrity:** 746/746 images verified on disk with 0 missing files.

---

## 4. Test Verification & Gate Audit

1. **Dedicated Practical Test Suite:** `src/test/practical/git-practical.test.ts`
   - Chapter count: 7/7 passing.
   - Question count: 826/826 passing.
   - Options integrity: $\ge 2$ options per question, verified `correctIndex`.
   - Explanations & Key Concepts: 100% present with comprehensive criteria of identification.
   - Image assets on disk: 746/746 verified.
   - Accent colors & mode isolation: 100% green.
2. **Microbiology Practical Test Suite:** `src/test/mgl-practical-micro.test.ts`
   - 4/4 assertions passing (100% green).
3. **Repository-wide Vitest Run:** `npm test`
   - **175 test files passed, 1,023 individual tests passed (100% green, 0 failures).**
4. **Bank Schema Validator:** `npx tsx data-format-v2/scripts/validate-banks.ts`
   - **42/42 canonical module files valid.**
5. **TypeScript Compilation:** `npm run typecheck`
   - **Exit code 0 (0 errors).**
6. **Production Bundle:** `npm run build`
   - Built cleanly with isolated chunk `dist/assets/mgl-3-practical-g08TEslm.js` (623.63 kB).
