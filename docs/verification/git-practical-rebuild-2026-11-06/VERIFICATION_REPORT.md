# Verification Report: Year 3 GIT Practical Exam (`MGL-3`) Complete Rebuild & Topic Architecture

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

## 1. Master Compilation & Topic Architecture

Every practical chapter is engineered with explicit `lectureNames` so that clicking on any chapter in the portal immediately displays its selectable topic sub-sections:

| Chapter | Title | Subject | Questions | Topics Exposed | Topic Breakdown |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **301** | Practical — Anatomy | Anatomy | **315** | 4 Topics | • Module 1: Oral Cavity, Pharynx & Anterior Abdominal Wall (78 Qs)<br>• Module 2: Posterior Abdominal Wall, Nerves & Lumbar Spine (88 Qs)<br>• Module 3: Liver, Gallbladder, Spleen & Celiac Vasculature (80 Qs)<br>• Module 4: Major Retroperitoneal Vessels, Mesenteries & Anomalies (69 Qs) |
| **302** | Practical — Histology | Histology | **183** | 2 Topics | • Part 1: Oral Cavity, Lip, Tongue & Salivary Glands (86 Qs)<br>• Part 2: GI Tract, Liver, Gallbladder & Pancreas (97 Qs) |
| **303** | Practical — Pathology | Pathology | **145** | 2 Topics | • **Pathology Museum (Gross Jars)** (95 Qs, `lecture: 1`)<br>• **Pathology Lab (Microscopic Slides)** (50 Qs, `lecture: 2`) |
| **304** | Practical — Parasitology | Parasitology | **84** | 1 Topic | • Parasitology Practical Spotters (84 Qs) |
| **305** | Practical — Microbiology | Microbiology | **51** | 1 Topic | • Microbiology Practical Mock Exam (51 Qs) |
| **306** | Practical — Physiology | Physiology | **48** | 1 Topic | • Clinical Motility, Secretions & Digestion (48 Qs) |
| **Total** | **6 Chapters** | **6 Subjects** | **826** | **11 Topics** | **826 Fully Functional Questions (746 with WebP images)** |

---

## 2. Topic Resolution & Navigation Fix

- **Root Cause of "No Topics Available":** `toGitTopicChapter` in `src/app/lib/gitBank.ts` was designed for theory iNerd lectures and assumed `subject.lectureNames` would be mapped into sub-subjects. When encountering chapters without `lectureNames` or practical mode chapters, it stripped the subjects into an empty array `[]`.
- **The Permanent Fix:**
  1. Updated `toGitTopicChapter` and `transformedChapter` in `App.tsx` to preserve `chapter.bankSection === 'practical'` chapters directly with their complete questions and subject definitions.
  2. Defined explicit, descriptive `lectureNames` on every subject so `practiceTopics(chapter, 'MGL-3')` resolves the exact child topics and questions.
  3. Merged Pathology Museum and Lab into unified Chapter 303, perfectly matching the user's requirement: clicking **Practical — Pathology** displays **Pathology Museum (Gross Jars)** (95 Qs) and **Pathology Lab (Microscopic Slides)** (50 Qs) as selectable topics.

---

## 3. On-Demand Lazy Loading Architecture

- **Dynamic Chunking:** `mgl-3-practical.json` (836 KB raw JSON) is dynamically imported on demand via `ensurePracticalDataLoaded('MGL-3')` in `src/app/data.ts` and gated by `RouteDataGate.tsx`.
- **Zero-Byte Overhead:** Theory MCQ and Mixed exam modes download 0 bytes of practical data.
- **Isolated Chunk:** Built as `dist/assets/mgl-3-practical-CS0g4Q4B.js` (624 kB).

---

## 4. Verification & Quality Gates

1. **Practical Test Suite:** `src/test/practical/git-practical.test.ts` (9/9 tests passing).
   - Chapter count: 6/6 passing.
   - Question count: 826/826 passing.
   - Pathology topic splitting: verified 2 topics (95 museum + 50 lab).
   - Anatomy topic splitting: verified 4 topics (78 + 88 + 80 + 69).
   - Histology topic splitting: verified 2 topics (86 + 97).
   - All 746 images verified on disk.
2. **Microbiology Practical Test Suite:** `src/test/mgl-practical-micro.test.ts` (4/4 tests passing).
3. **Repository-wide Vitest Run:** 175 test files passed, 1,023 individual tests passed (100% green).
4. **Bank Schema Validator:** 42/42 canonical module files valid.
5. **TypeScript & Production Build:** Clean compilation with 0 errors (`npm run typecheck` & `npm run build`).
