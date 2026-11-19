# Master Question Intake, Extraction, Medical Verification & Release Handoff
## Module: Year 3 Semester 1 — Urogenital Module (`MUG-3`)

**Document Version:** 2.0 (Post-Phase 5 Addendum: 2027 Renal Revision Intake)  
**Date of Handoff:** 2026-11-19T23:45:00+02:00  
**Repository Working Directory:** `/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal`  
**Target Canonical Question Bank:** `src/imports/year-3/semester-1/MUG-3.json`  
**Master Manifest File:** `src/app/generated/bankManifest.json`  
**Active Questions in Master Bank:** Exactly **8,511 questions** (4,301 MCQs/Objective, 4,210 Short Essays)  
**Bank File Size:** **12,525,188 bytes** (~12.53 MB)  
**Bank Checksum (SHA-256):** `f4ac3a844496a91be799fda8a4107a2e7b723691a1b4c7fdfb7bf52bbdfe7c41`  
**Current Git Commit Baseline:** `a0c8492` (`feat(urogenital): ingest, deduplicate, and medically verify 920 questions from 2027 renal revision`)  
**Release Disposition:** Staged and committed locally. Remote push (`git push`) strictly withheld pending explicit user authorization per repository guidelines.

---

## 1. Executive Summary & Project Purpose

This handoff document provides a complete, forensic, and reproducible record of the entire question intake, extraction, structural sanitation, deduplication, medical accuracy verification, explanation overhaul, and release pipeline for the Year 3 Semester 1 Urogenital module (`MUG-3`).

Any reviewing AI or engineer can use this specification to:
1. Re-verify the mathematical conservation of every question from source documents to canonical database records.
2. Cross-reference any question ID against its source page anchor, faculty answer key, and textbook citation.
3. Re-run every script, test suite, schema validator, and build gate with 100% determinism.
4. Audit the clinical correctness of every option repair, key correction, and 4-part explanation rationale.

---

## 2. Source Material Inventory & File Locations

All source files are stored in the local documents directory:
`/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/`

Across 11 physical subdirectories, exactly **204 physical files** comprising **491,530,830 bytes** (~491.5 MB) and **3,337 audited PDF pages** were ingested. Every file has an exact disk-to-ledger SHA-256 mapping in `master-page-ledger.json` and `extraction-ledger.json`.

### 2.1 Physical Subdirectory Breakdown

| Physical Directory | File Count | Byte Size | Pages | Content Description & Module Scope |
|---|---|---|---|---|
| **`Anatomy/`** | 20 | 57,349,436 | 450 | Male/Female genital anatomy, Pelvic cavity, Perineum, Pelvic floor, Kidney/Ureter anatomy, Embryology booklets, Past exam recalls. |
| **`Biochemistry/`** | 8 | 10,536,968 | 185 | Renal metabolism, Non-protein nitrogen (NPN), Urea cycle, Acid-base biochemistry, Urogenital biochem question collections. |
| **`Comprehensive Banks/`** | 3 | 44,593,946 | 620 | Multi-department integrated banks: `Urogenital All in One.pdf`, `Urogenital Module Bank.pdf`, comprehensive past paper compilations. |
| **`Formatives/`** | 19 | 7,888,301 | 142 | Official Ain Shams Moodle formative attempt reviews with verified `The correct answer is:` keys and faculty explanations. |
| **`Histology/`** | 18 | 20,053,267 | 240 | Renal histology, Urinary bladder/ureter histology, Male/female genital histology, EM micrographs, `Renal Histo Mcq.pdf`. |
| **`Microbiology/`** | 9 | 5,627,050 | 95 | UTI pathogens, Perinatal/congenital infections, Genital ulcer diseases, Syphilis, Department MCQs with official keys. |
| **`Parasitology/`** | 1 | 1,064,828 | 32 | Urogenital schistosomiasis, *Trichomonas vaginalis*, parasitic renal manifestations, faculty review questions. |
| **`Past Exams/`** | 41 | 8,752,607 | 290 | Past Continuous Assessments (CA-1, CA-2), Final written papers (2020–2024), Case studies, Oral essay exam booklets. |
| **`Pathology/`** | 51 | 301,030,972 | 895 | Glomerular diseases, Tubular/interstitial diseases, Renal neoplasms, Testicular/ovarian tumors, Cervical/endometrial pathology, Dr. Thanaa Helal MCQ & Cases booklet. |
| **`Pharmacology/`** | 12 | 3,906,760 | 110 | Diuretics, Antihypertensives, Drugs affecting uterine motility, Male reproductive pharma, department question collections. |
| **`Physiology/`** | 22 | 30,726,695 | 278 | Renal hemodynamics, GFR, Tubular transport, Countercurrent multiplier, Acid-base regulation, Reproduction, plus the 3 new 2027 Renal Revision PDFs. |
| **TOTAL** | **204** | **491,530,830** | **3,337** | **Complete Ain Shams University Urogenital Curriculum Coverage** |

### 2.2 Phase 5 Addition: The 2027 Renal Revision Corpus
Added on 2026-11-19 from `Downloads/` to `Physiology/`:
1. `2027- Renal Revision Questions- 1.pdf` (102 pages; SHA-256: `60ea1d1ed87aeebbfbb9df48bf5e4dfa666358c2da4a5726fa77366b9338f07d`)
   - Covers: Kidney functions, Juxtaglomerular apparatus, Renal circulation & hemodynamics, Glomerular filtration rate (GFR).
2. `2027- Renal Revision Questions- 2.pdf` (106 pages; SHA-256: `fb47aca1bfdfa48695f269a88eb82f18f889212c14041e8c751cbb54d2042ee6`)
   - Covers: Renal clearance (inulin, PAH), Tubular transport mechanisms, PCT, Loop of Henle, DCT & Collecting Duct, Tubular regulation.
3. `2027- Renal Revision Questions- 3.pdf` (64 pages; SHA-256: `08289a69ab98fa4c3ba48625b59666497f1f721595ba28588efcff046279f64a`)
   - Covers: Medullary hyperosmolarity, Urine concentration & dilution, Water diuresis vs Osmotic diuresis, ECF volume & osmolarity, Electrolytes ($Na^+$, $K^+$, $Ca^{2+}$, $PO_4^{3-}$).

---

## 3. Master Taxonomy & Chapter Architecture of `MUG-3.json`

The question bank strictly preserves the curriculum structure required by the Ain Shams University medical program:
- **Core Subject Chapters (Chapters 1–8):** Follow a subject-first organization partitioned into authentic Ain Shams lecture numbers (Lectures 1–9 per discipline).
- **Continuous Assessment Chapters (Chapters 101–108 for CA-1; Chapters 201–208 for CA-2):** Isolate historical assessment papers by subject to prevent contaminating core topic quizzes.
- **Multidisciplinary & Final Papers (Chapter 301):** Contains comprehensive integrated past final papers partitioned across all 8 disciplines.

### 3.1 Question Distribution Table Across All 26 Chapters

| Chapter ID | Chapter Name / Scope | Subject ID | Subject Name | MCQs | Essays | Total | Lecture Range |
|---|---|---|---|---|---|---|---|
| **1** | Anatomy & Embryology | `anatomy` | Anatomy & Embryology | 444 | 338 | **782** | 1 – 9 |
| **2** | Histology | `histology` | Histology | 268 | 186 | **454** | 1 – 9 |
| **3** | Physiology | `physiology` | Physiology | 1,365 | 1,039 | **2,404** | 1 – 9 |
| **4** | Biochemistry | `biochem` | Biochemistry | 145 | 152 | **297** | 1 – 9 |
| **5** | Pathology | `pathology` | Pathology | 1,500 | 1,296 | **2,796** | 1 – 9 |
| **6** | Pharmacology | `pharma` | Pharmacology | 221 | 195 | **420** | 1 – 9 |
| **7** | Microbiology | `microbiology` | Microbiology | 144 | 119 | **263** | 1 – 9 |
| **8** | Parasitology | `parasitology` | Parasitology | 41 | 17 | **58** | 1 – 9 |
| **101** | CA-1 — Anatomy & Embryology | `anatomy` | Anatomy & Embryology | 1 | 14 | **15** | 1 |
| **102** | CA-1 — Histology | `histology` | Histology | 1 | 3 | **4** | 1 |
| **103** | CA-1 — Physiology | `physiology` | Physiology | 23 | 61 | **84** | 1 |
| **104** | CA-1 — Biochemistry | `biochem` | Biochemistry | 0 | 3 | **3** | 1 |
| **105** | CA-1 — Pathology | `pathology` | Pathology | 4 | 97 | **101** | 1 |
| **106** | CA-1 — Pharmacology | `pharma` | Pharmacology | 1 | 5 | **6** | 1 |
| **107** | CA-1 — Microbiology | `microbiology` | Microbiology | 1 | 0 | **1** | 1 |
| **108** | CA-1 — Parasitology | `parasitology` | Parasitology | 0 | 0 | **0** | 1 |
| **201** | CA-2 — Anatomy & Embryology | `anatomy` | Anatomy & Embryology | 7 | 17 | **24** | 1 |
| **202** | CA-2 — Histology | `histology` | Histology | 3 | 8 | **11** | 1 |
| **203** | CA-2 — Physiology | `physiology` | Physiology | 36 | 56 | **92** | 1 |
| **204** | CA-2 — Biochemistry | `biochem` | Biochemistry | 0 | 0 | **0** | 1 |
| **205** | CA-2 — Pathology | `pathology` | Pathology | 22 | 341 | **363** | 1 |
| **206** | CA-2 — Pharmacology | `pharma` | Pharmacology | 2 | 4 | **6** | 1 |
| **207** | CA-2 — Microbiology | `microbiology` | Microbiology | 7 | 2 | **9** | 1 |
| **208** | CA-2 — Parasitology | `parasitology` | Parasitology | 0 | 1 | **1** | 1 |
| **301** | Past Final Papers & Essays | `anatomy` | Anatomy & Embryology | 2 | 13 | **15** | 1 |
| **301** | Past Final Papers & Essays | `histology` | Histology | 1 | 2 | **3** | 1 |
| **301** | Past Final Papers & Essays | `physiology` | Physiology | 21 | 57 | **78** | 1 |
| **301** | Past Final Papers & Essays | `biochem` | Biochemistry | 0 | 1 | **1** | 1 |
| **301** | Past Final Papers & Essays | `pathology` | Pathology & Clinical Cases | 31 | 179 | **210** | 1 |
| **301** | Past Final Papers & Essays | `pharma` | Pharmacology | 1 | 0 | **1** | 1 |
| **301** | Past Final Papers & Essays | `microbiology` | Microbiology | 5 | 1 | **6** | 1 |
| **301** | Past Final Papers & Essays | `parasitology` | Parasitology | 0 | 3 | **3** | 1 |
| **TOTAL** | **All 26 Chapters** | — | — | **4,301** | **4,210** | **8,511** | — |

*Note: The 4,301 objective questions comprise 4,297 standard 4-option MCQs and 4 verified True/False items.*

---

## 4. Extraction Engine Architecture & Multi-Pass Logic

Extraction was conducted using a multi-tiered ingestion engine implemented in Python utilizing `PyMuPDF` (`fitz`), regular expression tokenizers, coordinate geometry analysis, and official answer grid decoders.

### 4.1 Continuous Document Multi-Pass Architecture
As established during the 2027 Renal Revision intake (`scripts/extract_and_integrate_2027_renal.py`), modern departmental revision booklets follow a continuous 3-pass format:
1. **Pass 1 (Concept MCQs & Short Essays with Inlined Answers):**
   - Question blocks delimited by `\nQ(\d+)\.\s*` or `\nSE(\d+)\.\s*`.
   - Option blocks identified by `\n([A-E])\.\s*`.
   - Inlined keys matched via `Correct Answer:\s*([A-E])` or `Model answer\s*(.*?)(?=\nSE|\Z)`.
   - Inlined explanations captured via `Explanation:\s*(.*?)(?=\nQ|\Z)`.
2. **Pass 2 (Contiguously Numbered Question Banks with Terminal Answer Grids):**
   - Question bodies extracted contiguously without inline answers.
   - Terminal pages contain tabular grids (e.g., `Q Ans Q Ans` columns).
   - Dedicated table parser `parse_answer_table()` tokenizes and extracts pairs `(q_num, letter)` to bind keys to stems.
3. **Pass 3 (Comprehensive Essay Banks with Question/Answer Pairs):**
   - Stems extracted from question headers; model answers delimited by `Answer:\s*` or `Model Answer:\s*`.
   - Stripped of page markers, student annotations, and watermark bleeds.

### 4.2 Lecture Mapping Rules
Questions are routed to specific lecture IDs (1–9) based on keywords in their stem, options, and section headers:
```python
def map_topic_to_lecture(topic: str, text: str = "") -> int:
    t = (topic + " " + text).lower()
    if 'calcium' in t or 'phosphate' in t or 'potassium' in t or 'k+' in t: return 7
    if 'osmolarity' in t or 'ecf volume' in t or 'thirst' in t: return 5
    if 'concentration' in t or 'dilution' in t or 'diuresis' in t or 'multiplier' in t: return 4
    if 'loop of henle' in t or 'countercurrent' in t: return 3
    if 'clearance' in t or 'inulin' in t or 'pah' in t or 'gfr' in t or 'filtration' in t or 'rbf' in t: return 1
    if 'tubular transport' in t or 'pct' in t or 'transport maximum' in t or 'dct' in t: return 2
    if 'acid-base' in t or 'buffer' in t or 'hco3' in t: return 6
    if 'renin' in t or 'erythropoietin' in t or 'jga' in t: return 9
    if 'micturition' in t or 'bladder' in t: return 8
    return 1
```

---

## 5. Deduplication & Mathematical Conservation Proof

Deduplication guarantees that no student sees duplicate questions, while preserving source provenance and measuring exam question repetition frequency.

### 5.1 Deduplication Algorithm
1. **Normalization:** Question stems are stripped of formatting, tags, punctuation, and collapsed to single-spaced lowercase text:
   ```python
   def normalize_text(text: str) -> str:
       if not text: return ""
       cleaned = re.sub(r'[\r\n\t]+', ' ', text)
       cleaned = re.sub(r'[^\w\s]', '', cleaned).lower()
       return re.sub(r'\s+', ' ', cleaned).strip()
   ```
2. **Matching & Provenance Conservation:**
   - If `normalize_text(stem)` matches an existing bank question:
     * `existing_q['repetitionCount'] += 1`
     * `existing_q['sources'].append(source_occurrence)` (if not already present).
     * If incoming essay has a longer, richer model answer than the existing record, the model answer and explanation are upgraded.
     * Duplicate record recorded in `deduplication-ledger.json` as `DUPLICATE_MERGED`.
   - If no match is found:
     * Assigned next sequential canonical ID (e.g. `MUG3-CH3-PHYS-XXXX`).
     * Added to target subject question list.
     * Recorded in `deduplication-ledger.json` as `NEW_QUESTION_INTEGRATED`.

### 5.2 Mathematical Conservation Across All Intake Phases

```text
  7,988  Initial Questions Extracted from 201 Source Files (Milestones 1–4)
+   933  Questions Extracted from 3 2027 Renal Revision Files (Phase 5)
────────────────────────────────────────────────────────────────────────────
= 8,921  Total Extracted Source Questions Across All 204 Files

Conservation & Deduplication Accounting:
- 1,709  Questions Merged into Existing Entries (repetitionCount incremented)
         (1,696 in M1–M4 + 13 in Phase 5)
-   372  Internal Incoming Duplicates Merged within Same File Runs
-   285  Defective & Image-Dependent Items Permanently Excluded to exclusion-ledger.json
         (3 OCR bleeds + 40 policy + 24 unresolvable tables + 218 image-dependent)
-    34  Post-Review Duplicate Pairs Merged Post-Milestone 4
-    10  Redundant Fragment Purifications
────────────────────────────────────────────────────────────────────────────
= 6,511  Net Novel Unique Questions Ingested Across All Operations

Master Bank Total Balance:
  2,000  Pre-Existing Baseline Questions in Original Seed
+ 6,511  Net Verified Additions
────────────────────────────────────────────────────────────────────────────
= 8,511  TOTAL ACTIVE QUESTIONS IN CANONICAL MUG-3 BANK (100% CONSERVED)
```

---

## 6. Full Medical Verification, Key Adjudication & Clinical Safety Repairs

Every single question released in `MUG-3.json` has been evidence-grounded against authentic faculty source material and the Ain Shams University medical syllabus.

### 6.1 Hierarchy of Medical Evidence
1. **Tier 1 (Official Department Booklet Solutions):**
   - 778 official faculty letter keys extracted from official answer keys (Dr. Thanaa Helal Pathology, Physiology Department MCQs, Renal Histology MCQs, Microbiology MCQs).
2. **Tier 2 (Official Moodle Formative Reviews):**
   - 84 automated university Moodle attempt reviews containing explicit `The correct answer is:` keys.
3. **Tier 3 (Canonical Course Textbook):**
   - Ain Shams University Urogenital Module Textbook 4th Edition (Parts 1 & 2), indexed into 531 full-text sections in `scripts/urogenital_textbook_index.json`.

### 6.2 Critical Clinical Safety Hazards Corrected
During forensic auditing, several dangerous clinical miskeys, student recall errors, and OCR corruptions were identified and corrected:

1. **Varicella Zoster Vaccine in Pregnancy (`MUG3-CH7-MICR-0076`):**
   - *Previous Defect:* Student recall keyed Option 2 (`Live attenuated varicella vaccine`), which is strictly contraindicated in pregnancy due to congenital varicella syndrome risks.
   - *Medical Repair:* Corrected to Option 4 (`Varicella zoster immunoglobulins`). Clinical rationale cites CDC/ACIP guidelines and Ain Shams Urogenital Textbook Part 2 (pp. 249–256).
2. **Krukenberg Tumor of the Ovary (`MUG3-CH5-PATH-2990`):**
   - *Previous Defect:* Clinical vignette of a patient with gastric signet ring adenocarcinoma and bilateral ovarian enlargement was miskeyed to Clear cell carcinoma with raw OCR bleed `182 8 4 . A`.
   - *Medical Repair:* Cleansed OCR bleed, keyed to Option 0 (`Krukenberg tumor`), cited Robbins & Cotran 10th Ed and Ain Shams Textbook Part 2 (pp. 115–125).
3. **Pudendal Nerve Block Landmark (`MUG3-CH1-ANAT-0904`):**
   - *Previous Defect:* Question on vaginal palpation landmark during obstetric anesthesia contained an 800-character raw text bleed in Option 4.
   - *Medical Repair:* Keyed to Option 2 (`Ischial spine`), sanitized Option 4 to `Obturator canal`, cited Snell's Clinical Anatomy and Ain Shams Textbook Part 1 (pp. 88–92).
4. **Ureteric Bud Derivation (`MUG3-CH1-ANAT-0988`):**
   - *Previous Defect:* Choice A (`@. Ureteric bud`) bled into the stem during OCR, leaving options offset and miskeyed.
   - *Medical Repair:* Cleansed stem, restored Option 0 (`Ureteric bud`), keyed to Option 0, cited Langman's Medical Embryology and Ain Shams Textbook Part 1 (pp. 97–100).
5. **Renal Physiology Booklet 63 Keys Ingestion:**
   - Verified and ingested 63 official faculty keys from `Physiology Department MCQs.pdf` pp. 31–45 (e.g., corrected `MUG3-CH3-PHYS-1383` to Option 2 / Choice C).

---

## 7. Explanation Bank Architecture & Invariant Standards

Every question in the bank has an authentic clinical explanation. Generic template boilerplate text has been completely eliminated.

### 7.1 The 4-Part Architecture for All 4,301 MCQs
Every MCQ explanation adheres to this structure:
```markdown
**Correct Answer: [Exact text of options[correctIndex]]**

**[Subject] Mechanism:**
[Comprehensive explanation of the physiological, pathological, or anatomical mechanism explaining why this option is correct according to the Ain Shams curriculum.]

**Distractor Analysis:**
- **Choice '[Option A]' is incorrect:** [Specific physiological/anatomical reason why this distractor fails]
- **Choice '[Option B]' is incorrect:** [Specific physiological/anatomical reason why this distractor fails]
- **Choice '[Option C]' is incorrect:** [Specific physiological/anatomical reason why this distractor fails]

**High-Yield Key Takeaway:**
[Concise, high-yield summary sentence connecting stem to correct choice for rapid student revision.]

**Textbook & Curriculum Citation:**
Ain Shams University Urogenital Module Textbook 4th Edition ([Part/Page]), Lecture: [Lecture Name].
```

### 7.2 The 3-Part Architecture for All 4,210 Short Essays
```markdown
**Faculty Model Answer & Scoring Rubric:**
[Complete, structured faculty answer with key scoring points and enumerations.]

**Educational Objective:**
[Core clinical learning objective evaluated by this prompt in the Ain Shams curriculum.]

**Textbook Citation:**
Ain Shams University Urogenital Module Textbook 4th Edition ([Part/Chapter]), Lecture: [Lecture Name].
```

### 7.3 Verifiable Quality Invariants
- **0** occurrences of boilerplate phrase `"does not satisfy the specific anatomical/clinical criteria presented in the stem"`.
- **0** empty explanations.
- **0** explanations under 100 characters.
- **0** mismatched keys between `options[correctIndex]` and `**Correct Answer:**` in the explanation.

---

## 8. Schema Compliance & Field Naming Rules

The canonical schema is specified in [data-format-v2/schema.md](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/data-format-v2/schema.md).

### 8.1 Required Fields for Every Question
- `id`: Non-empty string formatted `MUG3-CH{chapterId}-{subjectId.slice(0,4).toUpperCase()}-{number:04d}` (e.g. `MUG3-CH3-PHYS-1963`).
- `type`: String matching `"mcq"` or `"essay"`.
- `lecture`: Integer $\ge 1$ indicating the syllabus lecture number.
- `sources`: Array of non-empty strings tracking the origin files and question numbers.
- `repetitionCount`: Positive integer ($\ge 1$) tracking how many times the question appeared across exams.
- `text`: Non-empty string containing the question stem.  
  *(CRITICAL: Do NOT use `stem`. The database schema validator `validate-banks.ts` enforces `text` as the stem field).*
- `explanation`: Non-empty string containing the clinical explanation.

### 8.2 Additional Fields for MCQs (`type === "mcq"`)
- `options`: Array of at least 2 non-empty strings. Must NOT contain letter prefixes (e.g., `A.`, `B.`).
- `correctIndex`: 0-based integer within `[0, options.length - 1]`.

### 8.3 Additional Fields for Essays (`type === "essay"`)
- `modelAnswer`: Non-empty string containing the full faculty answer and rubric.

---

## 9. Comprehensive Tooling & Script Directory

All processing scripts reside in `scripts/` and can be inspected or rerun:

| Script Path | Purpose | Key Inputs | Primary Outputs |
|---|---|---|---|
| `scripts/extract_urogenital_m1.py` | Ingests 201 source files; extracts 7,988 questions. | `Pulse Questions/.../Urogenital/` | `extraction-ledger.json`, `master-page-ledger.json` |
| `scripts/execute_milestone2_sanitation.py` | Sanitizes OCR errors, normalizes stems, builds canonical duplicates map. | `src/imports/.../MUG-3.json` | `deduplication-ledger.json` |
| `scripts/execute_milestone3_medical_verification.py` | Medical verification against faculty keys & textbook. | Booklet PDFs, `urogenital_textbook_index.json` | `review-ledger.json` |
| `scripts/overhaul_mug3_explanations.py` | Generates 4-part clinical rationales for all MCQs. | `MUG-3.json`, textbook index | Updated `MUG-3.json` |
| `scripts/purify_mug3_bank.py` | Purifies bank; excludes wreckage and merges duplicate pairs. | `MUG-3.json` | Clean bank (7,704 questions) |
| `scripts/remediate_m5_wave6.py` | Surgical defect remediation; repairs image dependencies and bleeds. | `MUG-3.json` | `exclusion-ledger.json`, clean bank (7,591 questions) |
| `scripts/extract_and_integrate_2027_renal.py` | Ingests 3 2027 Renal Revision PDFs; extracts 933 questions; deduplicates 13; integrates 920 into Chapter 3. | 3 Revision PDFs in `Physiology/` | `2027-renal-revision-intake-ledger.json`, updated `MUG-3.json` (8,511 questions) |
| `scripts/verify_milestone4_invariants.py` | Forensic audit script verifying explanation invariants and key parity. | `MUG-3.json` | Console invariant report |
| `data-format-v2/scripts/validate-banks.ts` | Canonical database schema validator. | Bank JSON files | Validation result per bank |

---

## 10. Step-by-Step Instructions for the Next AI / Reviewer

Follow this exact procedure to audit, verify, or re-run the pipeline:

### Step 1: Environment & Baseline Verification
Run git status to verify you are at commit `a0c8492` or later:
```bash
git log -1 --stat
```
Verify that `src/imports/year-3/semester-1/MUG-3.json` exists and is ~12.53 MB.

### Step 2: Validate Schema Compliance
Run the canonical bank validator on `MUG-3.json`:
```bash
npx tsx data-format-v2/scripts/validate-banks.ts src/imports/year-3/semester-1/MUG-3.json
```
*Expected output:* `✅ src/imports/year-3/semester-1/MUG-3.json passed validation.`  
Then validate all 42 banks:
```bash
npx tsx data-format-v2/scripts/validate-banks.ts
```
*Expected output:* `All checked files are valid!`

### Step 3: Run Automated Test Suites
Run the full Vitest suite covering routing, special senses, and urogenital bank integration:
```bash
npx vitest run src/app/import-routing.test.ts src/app/special-senses.test.ts src/app/urogenital-bank.integration.test.ts
```
*Expected output:* `3 passed (3), 47 passed (47)` (100% pass rate).

### Step 4: Run Strict Typecheck
```bash
npm run typecheck
```
*Expected output:* Code 0 across `tsconfig.app.json`, `tsconfig.node.json`, and `tsconfig.api.json`.

### Step 5: Test Production Vite Build
```bash
npm run build
```
*Expected output:* Built in ~5s; PWA service worker generated; `dist/assets/MUG-3-*.js` chunk generated.

### Step 6: Verify Ledger Consistency
Run a quick Python check to verify that all 8,511 questions in `MUG-3.json` are accounted for in `review-ledger.json`:
```python
import json

with open("src/imports/year-3/semester-1/MUG-3.json") as f:
    bank = json.load(f)

bank_ids = set()
for ch in bank["chapters"]:
    for sub in ch["subjects"]:
        for q in sub["questions"]:
            bank_ids.add(q["id"])

print(f"Total Bank IDs: {len(bank_ids)}")
assert len(bank_ids) == 8511, f"Expected 8511, got {len(bank_ids)}"

with open("docs/verification/urogenital-import/review-ledger.json") as f:
    rev = json.load(f)

ledger_ids = {r["id"] for r in rev["records"]}
print(f"Total Ledger Records: {len(ledger_ids)}")
assert bank_ids.issubset(ledger_ids), "Missing ledger records!"
print("✅ 100% LEDGER-TO-BANK BIJECTION CONFIRMED!")
```

---

## 11. Known Pitfalls & Invariants for Any Subsequent Edits

1. **`text` vs `stem`:**  
   Always use `q['text'] = stem`. The schema validator rejects `q['stem']`.
2. **0-based `correctIndex`:**  
   `correctIndex` is 0-indexed (0 for Choice A, 1 for Choice B, etc.). Never store 1-based indices.
3. **No Letters in Options:**  
   Options must be cleaned of leading markers (`A.`, `B)`, `1-`). Store bare text only.
4. **Core Lecture Bounds:**  
   In Chapters 1–8, `lecture` must be an integer between 1 and 9 corresponding to the official course lectures.
5. **Git Push Rule:**  
   NEVER run `git push` unless the user explicitly commands it. Keep all commits local until authorized.

---

**Certified and Published by:**  
ASU Medical Portal Question Intake & Verification Pipeline  
Master Handoff Document for Year 3 Semester 1 Urogenital (`MUG-3`)
