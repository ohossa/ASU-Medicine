# Adding New Question Databases to ASU Medical Portal

The ASU Medical Portal features a fully automated, dynamic architecture for importing question databases. **You do not need to write any code** to add new chapters, exams, or questions.

## Quick Start (3 Steps)

1. **Convert your raw questions** — Copy the prompt from [`CONVERSION_PROMPTS_MASTER.md`](./CONVERSION_PROMPTS_MASTER.md) into any AI (ChatGPT, Claude, etc.), paste your raw questions after it, and get a valid incoming batch JSON.

2. **Save the batch file** — Place the output JSON into the module's `_ready` folder:
   ```
   data-format-v2/question-intake/year-{N}/semester-{N}/{moduleCode} [{moduleName}]/_ready/{moduleCode}_batch_{YYYY-MM-DD}_{source}_{count}.json
   ```

3. **Run the importer** — Execute one command:
   ```bash
   npx tsx data-format-v2/scripts/import-ready.ts
   ```

That's it! Questions are automatically routed to the correct module, chapter, and subject.

---

## How It Works

### Auto-Detection
- The portal scans `src/imports/` for `.json` files at build time.
- Files with `schemaVersion: 1` (v2 format) are consumed directly.
- Legacy files (old MCQ/essay split format) are matched by filename keywords.

### Module Binding
- v2 files use `meta.moduleCode` for direct binding (e.g. `"MEM-2"`).
- Legacy files match by keyword search in filenames (e.g. `endocrine_mcq.json` → MEM-2).

### Mode Detection
- v2 files contain all question types in one file — MCQ Practice, Essay Study, and Mixed Exam modes are derived dynamically based on available question types.
- Legacy mode: MCQ vs Essay is detected from filename keywords or JSON content.

---

## Incoming Batch JSON Format (v2)

This is the format produced by the master conversion prompt:

```json
{
  "moduleCode": "MCNS-2",
  "questions": [
    {
      "chapterTitle": "Brain Stem",
      "subject": "Anatomy",
      "lecture": 4,
      "type": "mcq",
      "text": "Which cranial nerve exits from the pontomedullary junction?",
      "options": ["III", "V", "VI", "XI"],
      "correctAnswer": "C",
      "explanation": "The abducens nerve (CN VI) exits at the pontomedullary junction.",
      "keyConcept": "Cranial nerve VI exits at the pontomedullary junction."
    }
  ]
}
```

### Supported Question Types

| Type | Key Fields | Description |
|---|---|---|
| `mcq` | `options`, `correctAnswer` | Multiple choice (3–5 options, one correct) |
| `truefalse` | `options: ["True","False"]`, `correctAnswer` | True/False statements |
| `matching` | `pairs: [{premise, target}]` | Match items from two columns |
| `essay` | `modelAnswer` | Written response with model answer |
| `case` | `subQuestions: [mcq or essay]` | Clinical case with sub-questions |
| `fillblank` | `blanks`, optional `acceptedAnswers` | Fill-in-the-blank with `___` slots |

### Canonical Subject Names

Use exactly one of:
`Anatomy`, `Histology`, `Physiology`, `Biochemistry`, `Microbiology`, `Pathology`, `Pharmacology`, `Clinical`

---

## What the Importer Does Automatically

- ✅ Routes questions to the correct chapter (by `chapterId` or fuzzy `chapterTitle` match)
- ✅ Routes questions to the correct subject
- ✅ Creates missing subjects inside existing chapters
- ✅ Converts `correctAnswer` letters (A/B/C/D) to `correctIndex` (0-based)
- ✅ Generates canonical IDs (e.g. `MCNS2-CH4-ANAT-0501`)
- ✅ Deduplicates by normalized question text + options
- ✅ Writes a JSON import report

---

## File Organization

### Canonical Module Files (used by the website)
```
src/imports/year-{N}/semester-{N}/{moduleCode}.json
```

### Question Intake Folders (for batch imports)
```
data-format-v2/question-intake/
  year-{N}/
    semester-{N}/
      {moduleCode} [{moduleName}]/
        _raw/        ← Original files as received
        _ready/      ← Clean batch JSON files ready for import
        _imported/   ← Successfully imported batches
        _reports/    ← Import reports
        _rejected/   ← Files needing manual correction
```

---

## Import Commands

```bash
# Preview all pending imports (dry run)
npx tsx data-format-v2/scripts/import-ready.ts --dry-run

# Import all ready batches
npx tsx data-format-v2/scripts/import-ready.ts

# Import a single batch
npx tsx data-format-v2/scripts/import-batch.ts \
  "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_ready/batch.json" \
  src/imports/year-2/semester-2/MCNS-2.json

# Validate all canonical files
npx tsx data-format-v2/scripts/validate-banks.ts

# Build the website
npm run build
```

---

## Valid Module Codes

| Year | Sem | Code | Module |
|---|---|---|---|
| 1 | 1 | `IAE-1` | Introduction to Anatomy & Embryology |
| 1 | 1 | `IPHY-1` | Introduction to Physiology |
| 1 | 1 | `IBM-1` | Introduction to Medical Biochemistry |
| 1 | 1 | `IHC-1` | Introduction to Histology & Cell Biology |
| 1 | 1 | `MIM-1` | Immunology Module |
| 1 | 1 | `MBMG-1` | Molecular Biology and Medical Genetics |
| 1 | 1 | `P1-1` | Introduction to ICT and Medical Terminology |
| 1 | 2 | `IPAT-1` | Introduction to Pathology |
| 1 | 2 | `IPHA-1` | Introduction to Clinical Pharmacology |
| 1 | 2 | `MINF-1` | Infection Module |
| 1 | 2 | `MLS-1` | Locomotor Module |
| 1 | 2 | `BLS-HE-1` | Basic Life Support + History Taking & Clinical Examination |
| 1 | 2 | `P2-1` | Presentation Skills - Learning Skills - Time Management |
| 2 | 1 | `MBL-2` | Blood & Lymphatic System |
| 2 | 1 | `MRS-2` | Respiratory System |
| 2 | 1 | `MCVS-2` | Cardiovascular System |
| 2 | 2 | `MCNS-2` | Central Nervous System |
| 2 | 2 | `MSS-2` | Special Senses |
| 2 | 2 | `MEM-2` | Endocrine System & Metabolism |
| 2 | 2 | `P3-2` | Behavioral science |
| 2 | 2 | `R-2` | Fundamentals of Research |
| 3 | 1 | `MGL-3` | GIT & Liver |
| 3 | 1 | `MUG-3` | Urogenital System |
| 3 | 1 | `P4-3` | Medical Ethics |
| 3 | 1 | `P5-3` | Doctor-Patient Communication |
| 3 | 2 | `CEO-3` | Community, Environmental & Occupational Medicine |
| 3 | 2 | `FT-3` | Forensic Medicine & Clinical Toxicology |
| 3 | 2 | `ORL-3` | Otorhinolaryngology |
| 3 | 2 | `MED1-3` | Foundation of Internal Medicine |
| 3 | 2 | `P6-3` | Leadership skills & Management skills |
| 3 | 2 | `R-3` | Scientific Research |
| 4 | 1 | `MED2-4` | General & Special Internal Medicine 1 |
| 4 | 1 | `FAM-4` | Family Medicine |
| 4 | 1 | `P7-4` | Communication within a Medical Team |
| 4 | 2 | `MED3-4` | General & Special Internal Medicine 2 |
| 4 | 2 | `PED-4` | Pediatrics |
| 5 | 1 | `OO-5` | Ophthalmology |
| 5 | 1 | `SUR1-5` | General & Special Surgery 1 |
| 5 | 1 | `EM1-5` | Emergency Medicine & Trauma 1 |
| 5 | 2 | `SUR2-5` | General & Special Surgery 2 |
| 5 | 2 | `EM2-5` | Emergency Medicine & Trauma 2 |
| 5 | 2 | `OG-5` | Obstetrics & Gynecology |

---

## Tips

- **Auto-Coloring**: The `subject` string automatically maps to UI accent colors and icons.
- **Mixed Mode Unlock**: If a module has both MCQ-type and essay-type questions, Mixed Exam mode is automatically available.
- Once you add your JSON files, just run `npm run dev` and see your questions appear in the portal!
