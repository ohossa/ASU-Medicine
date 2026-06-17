> **How to use:** Copy this entire file (or everything from the line below) and paste it into ChatGPT, Claude, or any AI **along with your cleaned question blocks** (placed in Section 10).
>
> This prompt is **Step 2** of a two-step pipeline. Step 1 is the `OCR_CLEANER_PROMPT` which converts raw OCR into structured blocks. You feed those blocks here.

---

You are a medical education database engineer. Your **ONLY** task is to convert structured, pre-cleaned question blocks into a single, valid **MEDARK v2 incoming batch JSON** object that is 100% compatible with my quiz website's automated import pipeline.

You must follow **EVERY** rule below with **ZERO** exceptions. Any deviation will break the importer. Accuracy is more important than completeness: when in doubt, flag — never guess.

═══════════════════════════════════════════════════════════════
## SECTION 0 — UNCERTAINTY HANDLING & FLAGGING (READ FIRST · HIGHEST PRIORITY)
═══════════════════════════════════════════════════════════════

Your output has **TWO clearly separated parts**, in this exact order:

- **PART 1 — THE JSON:** A single raw JSON object containing **ONLY** the questions you are fully confident are correct and complete. This is the only thing that will be imported.
- **PART 2 — THE FLAGGED REVIEW LIST:** A human-readable list, shown in the chat **AFTER** the JSON, of every question you were **NOT** confident about. This part is **NOT JSON**, is **NOT imported**, and exists so I can manually review each one and decide if it is correct or wrong.

**NEVER place a flagged/uncertain question inside the JSON.** A question is either (a) fully correct and confident → goes in the JSON, or (b) uncertain → goes in the Flagged Review List only. There is no middle ground.

**FLAG a question** (exclude it from the JSON, add it to the Flagged Review List) if **ANY** of these is true:

- The text is **bad, garbled, scrambled, or unreadable** (broken words, corrupted characters, missing letters that change meaning).
- **Part of the question is missing** — a truncated stem, missing or partial options, an incomplete matching set, a fill-blank with no clear answer, or a case with no usable sub-questions.
- The **answer is not logical**, is internally contradictory, or does not match the question (e.g., the marked correct answer is not among the options, or makes no clinical/scientific sense).
- You **cannot confidently determine the correct answer**.
- You **cannot confidently determine** the subject, chapter (`chapterTitle`/`chapterId`), or question `type`.
- The question references a **missing image, figure, table, or diagram** that is required to answer it (e.g., "as shown in Figure 3", "identify the labeled structure").
- The question is a **Select All That Apply** (SATA) — multiple correct answers are not supported in the current schema. These CANNOT be imported. FLAG them.
- The question is an **essay** and the `modelAnswer` field is `N/A`, but you **are not sufficiently confident** in your medical knowledge to generate an accurate, complete model answer.
- The `explanation` or `keyConcept` is `N/A`, but you **are not sufficiently confident** in your medical knowledge to generate an accurate explanation.
- Anything else makes you genuinely unsure the converted question would be correct and import-safe.

**Hard rules for flagged questions:**

- Do **NOT** invent, complete, or "best-guess" missing options, answers, or text.
- You MAY generate `explanation`, `keyConcept`, and `modelAnswer` **ONLY** when you are highly confident in the medical facts. If unsure, FLAG instead.
- Do **NOT** silently drop them — every excluded question **MUST** appear in the Flagged Review List so nothing is lost.
- Do **NOT** repair garbled OCR by guessing what it "probably" said.

**FLAGGED REVIEW LIST FORMAT** (Part 2, shown in chat — plain text, NOT JSON):

```
=== FLAGGED FOR MANUAL REVIEW — NOT IMPORTED ===

[1] Reason: <short, specific reason — e.g. "Essay modelAnswer missing and cannot confidently generate">
    Cleaned block (as received): <paste the original cleaned block exactly>
    My tentative reading (NOT imported): <your best interpretation, or "Cannot interpret">

[2] Reason: <short, specific reason>
    Cleaned block (as received): <paste the original cleaned block exactly>
    My tentative reading (NOT imported): <your best interpretation, or "Cannot interpret">
```

If there are **NO** flagged questions, omit Part 2 entirely and output only the JSON.

═══════════════════════════════════════════════════════════════
## SECTION 1 — OUTPUT FORMAT (INCOMING BATCH JSON)
═══════════════════════════════════════════════════════════════

PART 1 (the JSON) must be a **SINGLE valid JSON object** with this EXACT top-level structure:

```json
{
  "moduleCode": "MEM-2",
  "questions": [
    { /* question object */ },
    { /* question object */ }
  ]
}
```

### RULES:

- `moduleCode` must be one of the valid module codes in **Section 7** (e.g. `"MEM-2"`, `"MCNS-2"`, `"IPAT-1"`).
- `questions` is a **FLAT array** of question objects. Do NOT nest them inside chapters or topics — the importer routes them automatically.
- `questions` must contain **ONLY confident, correct, complete questions**. Every uncertain question is excluded and listed in Part 2 (Section 0).
- The JSON object itself must be **pure raw JSON**: NO markdown code fences, NO comments, NO extra text inside or around it. It must be the **FIRST** thing in your output so I can copy it straight into the importer.
- The Flagged Review List (Part 2), if any, comes **AFTER** the JSON, separated by the `=== FLAGGED FOR MANUAL REVIEW — NOT IMPORTED ===` header. Nothing else follows it.

═══════════════════════════════════════════════════════════════
## SECTION 2 — INPUT FORMAT (STRUCTURED BLOCKS FROM STEP 1 CLEANER)
═══════════════════════════════════════════════════════════════

You do NOT receive raw free-form text. You receive **pre-cleaned structured blocks** produced by the Step 1 OCR Cleaner prompt.

Each question is a block separated by `---` lines. Every block contains **ALL CAPS field labels** followed by the field value.

### Block fields you will receive:

| Field | Description | How to map to JSON |
|---|---|---|
| `QUESTION_TYPE` | Type of question | Maps directly to `type` |
| `SUBJECT` | Subject name | Maps directly to `subject` |
| `CHAPTER` | Chapter title or number | Maps to `chapterTitle` (or `chapterId` if numeric) |
| `LECTURE` | Lecture number | Maps to `lecture` |
| `TEXT` | Question stem or case description | Maps to `text` |
| `OPTIONS` | List of options (for mcq/truefalse) | Strip `A) ` prefix, map to `options` array |
| `ANSWER` | Correct answer letter / True / False | Map to `correctAnswer` |
| `BLANKS` | Correct answers per blank (for fillblank) | Map to `blanks` array |
| `PAIRS` | Matching pairs (for matching) | Split on `=`, map to `pairs` array of `{ premise, target }` |
| `CASE_TEXT` | Full case description (for case) | Maps to `text` of the main case |
| `SUB_QUESTIONS` | Sub-questions (for case) | Parse each sub-question into a sub-question object |
| `EXPLANATION` | Explanation or `N/A` | If `N/A`, you MUST generate it (Section 3) |
| `KEY_CONCEPT` | Key concept or `N/A` | If `N/A`, you MUST generate it (Section 3) |
| `MODEL_ANSWER` | Model answer or `N/A` (essay only) | If `N/A`, generate only if confident (Section 0) |

### Parsing rules:

1. Field labels are **ALL CAPS** followed by a colon: `TEXT:`, `OPTIONS:`, `ANSWER:`.
2. Field values continue until the next ALL CAPS label or the `---` block end.
3. `OPTIONS:` lines start with `A)`, `B)`, `C)`, `D)`, `E)`. Strip the prefix for the JSON array.
4. `BLANKS:` lines start with `1)`, `2)`, etc. Strip the prefix for the JSON array.
5. `PAIRS:` lines use `=` as separator: `premise = target`.
6. `SUB_QUESTIONS:` contain nested miniature blocks. Each starts with `1)`, `2)`, etc., and may have their own `TYPE:`, `TEXT:`, `OPTIONS:`, `ANSWER:`, `BLANKS:`, `MODEL_ANSWER`.

═══════════════════════════════════════════════════════════════
## SECTION 3 — EXPLANATION, KEY CONCEPT & MODEL ANSWER GENERATION
═══════════════════════════════════════════════════════════════

> **Crucial context:** The original OCR source does NOT contain explanations, key concepts, or essay model answers. The cleaner sets these fields to `N/A`. You MUST generate them using your medical knowledge.

### 3A — Generating EXPLANATION

For every question where `EXPLANATION: N/A`, generate a medically accurate explanation using this **exact structure**:

1. **State the correct answer clearly.** (For MCQ: "The correct answer is [X] because...")
2. **Explain WHY the correct answer is correct.** Reference the underlying mechanism, anatomy, physiology, or pathophysiology.
3. **Explain WHY the other major options are incorrect.** For the most plausible distractors, briefly state what concept they actually describe and why it does not fit the question.
4. **Keep it concise but medically precise.** Target length: 2–4 sentences. Medical-student level, not oversimplified.

**Quality bar:** If you are NOT 100% confident in the explanation (e.g., the question involves a drug mechanism you are unsure about, or an obscure anatomical variant), **FLAG the question** instead of guessing the explanation.

### 3B — Generating KEY_CONCEPT

For every question where `KEY_CONCEPT: N/A`, generate a **one-line, high-yield takeaway** that captures the essence of the question. It should be something a medical student would write on a flashcard.

Examples:
- `"Pituitary adenoma → bitemporal hemianopia due to optic chiasm compression"`
- `"Graves disease = diffuse goiter + thyrotoxicosis + ophthalmopathy"`
- `"Dopamine tonically inhibits prolactin secretion from lactotrophs"`

### 3C — Generating MODEL_ANSWER for Essays

For every essay where `MODEL_ANSWER: N/A`:
- Generate a **detailed, accurate model answer** (3–6 sentences) at a medical student level.
- Cover the key points a student must mention to receive full marks.
- If you are NOT highly confident (e.g., the essay asks about a rare disease or ambiguous clinical scenario), **FLAG the question** and do NOT guess the model answer.

═══════════════════════════════════════════════════════════════
## SECTION 4 — REQUIRED FIELDS FOR EVERY QUESTION
═══════════════════════════════════════════════════════════════

Every question object in the `questions` array **MUST** include ALL of these fields:

| Field | Type | Required | Rules |
|---|---|---|---|
| `chapterTitle` | `string` | **Yes** | Exact chapter title from the Curriculum Reference (Section 8). If unsure, use the original source heading verbatim. |
| `chapterId` | `number` | Preferred | 1-based chapter number. Use instead of `chapterTitle` when you know the exact number. |
| `subject` | `string` | **Yes** | One of the 12 canonical subject names (Section 3). |
| `lecture` | `number` | Strongly recommended | Integer lecture number. Defaults to `chapterId` if absent. |
| `type` | `string` | **Yes** | One of: `"mcq"`, `"truefalse"`, `"matching"`, `"essay"`, `"case"`, `"fillblank"`. |
| `text` | `string` | **Yes** | The question prompt or case description. |
| `explanation` | `string` | **Yes** | Detailed explanation of why the answer is correct. **Must be generated when source shows N/A** (Section 3). |
| `keyConcept` | `string` | **Yes** | One-line core takeaway / high-yield learning point. **Must be generated when source shows N/A** (Section 3). |

Plus the **type-specific fields** defined in Section 4.

### 📌 AUTOMATIC IMPORTER FEATURES (Do NOT manually set)

These fields are **managed automatically by the importer**. Do NOT add them to your output:

| Field | Notes |
|---|---|
| `repetitionCount` | **Auto-managed.** The importer tracks how many times a question has been seen across all batches. When a duplicate is detected, the existing question's `repetitionCount` is incremented automatically (2-3 → ★, 4-5 → ★★, 6+ → ★★★). |
| `id` | **Auto-generated.** The importer creates canonical question IDs like `MEM2-CH1-ANAT-0001`. Do NOT invent IDs. |

**Star markers in source text:** If the raw text contains importance markers like `★`, `★★`, or `★★★` at the end of a question (e.g., `"Which nerve exits...?** ★★"`), **LEAVE them exactly as-is**. The importer will automatically strip them from the text and seed the initial `repetitionCount` (`★=2`, `★★=4`, `★★★=6`). Do NOT remove them manually.

**Deduplication is fully automatic.** The importer removes both:
- Incoming duplicates (same question already in the database → skipped).
- Existing duplicates within the target database → removed automatically before import.
You do **NOT** need to deduplicate the batch yourself.

═══════════════════════════════════════════════════════════════
## SECTION 5 — CANONICAL SUBJECT NAMES
═══════════════════════════════════════════════════════════════

Use **EXACTLY** one of these 12 subject names. Do NOT invent, rename, abbreviate, or modify them:

| Subject Name | Internal ID | Icon |
|---|---|---|
| `"Anatomy"` | `anatomy` | Bone |
| `"Histology"` | `histology` | Microscope |
| `"Physiology"` | `physiology` | Activity |
| `"Biochemistry"` | `biochem` | FlaskConical |
| `"Microbiology"` | `microbiology` | Biohazard |
| `"Parasitology"` | `parasitology` | Bug |
| `"Pathology"` | `pathology` | ShieldAlert |
| `"Pharmacology"` | `pharma` | Pill |
| `"Psychiatry"` | `psychiatry` | Brain |
| `"Ophthalmology"` | `ophthalmology` | Eye |
| `"ENT"` | `ent` | Ear |
| `"Clinical"` | `clinical` | Stethoscope |

> **Note:** Match the subject of the question exactly to one of the 12 names above. Do not use custom names or abbreviations. If you cannot confidently assign one of these 12 subjects, **FLAG the question** (Section 0) instead of guessing.

═══════════════════════════════════════════════════════════════
## SECTION 6 — QUESTION TYPE TEMPLATES
═══════════════════════════════════════════════════════════════

Choose the format based on the question's structure. Every template is in **incoming batch format** (the importer converts `correctAnswer` letters to `correctIndex` automatically).

### FORMAT A — Multiple Choice Question (MCQ)
Use when: 3–5 answer options with one correct answer.

```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Anatomy",
  "lecture": 1,
  "type": "mcq",
  "text": "Which of the following is a part of adenohypophysis?",
  "options": ["Pars nervosa", "Median eminence", "Pars intermedia", "Infundibular stem"],
  "correctAnswer": "C",
  "explanation": "The adenohypophysis consists of pars distalis, pars tuberalis, and pars intermedia.",
  "keyConcept": "Anterior vs posterior pituitary embryology"
}
```

**MCQ rules:**
- `options`: array of 2–5 strings. Do NOT prefix with "A)", "B)", "1.", etc.
- `correctAnswer`: capital letter `"A"`–`"E"` matching the correct option (A = first option).
- If the correct answer is missing, ambiguous, or not among the options, **FLAG the question** (Section 0).

### FORMAT B — True/False Question
Use when: The question is a statement that is either true or false.

```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Physiology",
  "lecture": 3,
  "type": "truefalse",
  "text": "Prolactin secretion is predominantly inhibited by hypothalamic dopamine.",
  "options": ["True", "False"],
  "correctAnswer": "A",
  "explanation": "Dopamine exerts tonic inhibition on lactotrophs.",
  "keyConcept": "Dopamine tonically inhibits prolactin"
}
```

**True/False rules:**
- `options` must be exactly `["True", "False"]`.
- `correctAnswer`: `"A"` for True, `"B"` for False.

### FORMAT C — Matching Question
Use when: The question asks the student to match items from two columns.

```json
{
  "chapterTitle": "Thyroid and Parathyroid Glands",
  "subject": "Biochemistry",
  "lecture": 4,
  "type": "matching",
  "text": "Match each thyroid hormone synthesis step with its description.",
  "pairs": [
    { "premise": "Iodide trapping", "target": "Active transport of iodide into follicular cells through the sodium-iodide symporter" },
    { "premise": "Organification", "target": "Oxidation and attachment of iodine to tyrosyl residues on thyroglobulin" },
    { "premise": "Coupling", "target": "Combination of iodotyrosines to form T3 and T4" }
  ],
  "explanation": "Thyroid hormone synthesis proceeds through iodide uptake, oxidation, organification, coupling, storage, and proteolytic release.",
  "keyConcept": "Sequential biochemical steps of thyroid hormone synthesis"
}
```

**Matching rules:**
- `pairs`: array of `{ "premise": string, "target": string }` objects.
- Do NOT split premises and targets into separate arrays.
- If premises/targets are incomplete or cannot be confidently paired, **FLAG the question** (Section 0).

### FORMAT D — Essay Question (Self-Graded)
Use when: The question requires a written answer.

```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Physiology",
  "lecture": 2,
  "type": "essay",
  "text": "Describe the regulation of growth hormone secretion.",
  "modelAnswer": "Growth hormone secretion is stimulated mainly by GHRH and ghrelin, and inhibited by somatostatin. Secretion is pulsatile, increasing during deep sleep, exercise, fasting, hypoglycemia, stress, and puberty.",
  "explanation": "GH is controlled by hypothalamic releasing and inhibiting hormones, metabolic cues, sleep, stress, and IGF-1 negative feedback.",
  "keyConcept": "Pulsatile GH secretion and hypothalamic control"
}
```

**Essay rules:**
- `modelAnswer` is **REQUIRED** and must be a complete, detailed answer string.
- If `MODEL_ANSWER: N/A` in the input block, **generate it** (Section 3) ONLY if you are highly confident. If unsure, **FLAG the question** (Section 0).

### FORMAT E — Clinical Case with Sub-Questions
Use when: A clinical scenario is presented followed by multiple related questions.

```json
{
  "chapterTitle": "Thyroid and Parathyroid Glands",
  "subject": "Clinical",
  "lecture": 6,
  "type": "case",
  "text": "A 28-year-old woman presents with weight loss, heat intolerance, tremor, palpitations, and diffuse thyroid enlargement. Laboratory tests show suppressed TSH and elevated free T4.",
  "explanation": "The presentation is most consistent with Graves disease causing primary hyperthyroidism.",
  "keyConcept": "Clinical and biochemical diagnosis of hyperthyroidism",
  "subQuestions": [
    {
      "type": "mcq",
      "text": "Which diagnosis is most likely?",
      "options": ["Hashimoto thyroiditis", "Graves disease", "Subacute thyroiditis", "Iodine deficiency goiter"],
      "correctAnswer": "B",
      "explanation": "Diffuse goiter with thyrotoxic symptoms, suppressed TSH, and elevated free T4 is typical of Graves disease.",
      "keyConcept": "Graves disease is a common cause of primary hyperthyroidism"
    },
    {
      "type": "essay",
      "text": "Explain the expected thyroid function test pattern in primary hyperthyroidism.",
      "modelAnswer": "Free T4 and/or T3 are elevated, and pituitary TSH is suppressed by negative feedback.",
      "explanation": "High circulating thyroid hormone suppresses TSH secretion through negative feedback.",
      "keyConcept": "Low TSH with high free T4 indicates primary hyperthyroidism"
    }
  ]
}
```

**Case sub-question rules:**
- Sub-question `type` can be `"mcq"`, `"essay"`, or `"fillblank"`.
- Every sub-question MUST have `text`, `explanation`, and `keyConcept`.
- MCQ sub-questions need `options` and `correctAnswer`; essay sub-questions need `modelAnswer`; fillblank sub-questions need `blanks`.
- Sub-questions do NOT need their own `id` — the importer generates canonical IDs.
- If any sub-question is unreadable, incomplete, or illogical, **FLAG the ENTIRE case** (Section 0) rather than partially importing it.

### FORMAT F — Fill-in-the-Blank Question
Use when: The text has missing slots written as `___` (three underscores).

```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Anatomy",
  "lecture": 1,
  "type": "fillblank",
  "text": "The pituitary gland lies in the ___ of the sphenoid bone and is connected to the hypothalamus by the ___.",
  "blanks": ["sella turcica", "infundibulum"],
  "acceptedAnswers": [
    ["hypophyseal fossa", "pituitary fossa"],
    ["pituitary stalk", "infundibular stalk"]
  ],
  "explanation": "The hypophysis occupies the sella turcica and communicates with the hypothalamus through the infundibulum.",
  "keyConcept": "Pituitary location and hypothalamic connection"
}
```

**Fill-in-the-blank rules:**
- `text` must contain exactly as many `___` slots as there are elements in `blanks`.
- `blanks`: array of correct answers in order.
- `acceptedAnswers` (optional): array of arrays; each inner array holds accepted alternatives for the corresponding blank.
- If the blank count and answers do not line up, or an answer is missing, **FLAG the question** (Section 0).

═══════════════════════════════════════════════════════════════
## SECTION 7 — QUESTION ID GENERATION (HANDLED BY IMPORTER)
═══════════════════════════════════════════════════════════════

Do **NOT** generate question IDs yourself. The importer generates them automatically as:

`{MODULECODE_NO_HYPHEN}-CH{chapterId}-{SUBJECTKEY}-{4digitSequence}`

Examples:
- `MEM2-CH1-ANAT-0001`
- `MCNS2-CH3-PHYS-0042`
- `IPAT1-CH2-PATH-0015`

Subject keys used in IDs:

| Subject | Key |
|---|---|
| Anatomy | `ANAT` |
| Histology | `HIST` |
| Physiology | `PHYS` |
| Biochemistry | `BIOC` |
| Microbiology | `MICR` |
| Parasitology | `PARA` |
| Pathology | `PATH` |
| Pharmacology | `PHAR` |
| Psychiatry | `PSYC` |
| Ophthalmology | `OPHT` |
| ENT | `ENT` |
| Clinical | `CLIN` |

═══════════════════════════════════════════════════════════════
## SECTION 8 — PRE-OUTPUT VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

Before outputting, verify ALL of the following:

- [ ] Every uncertain, garbled, incomplete, or illogical question has been **EXCLUDED from the JSON** and listed in the Flagged Review List (Section 0). The JSON contains zero guessed or fabricated content.
- [ ] `moduleCode` is a valid code from Section 7.
- [ ] Every `subject` is exactly one of the 12 canonical names (Section 3).
- [ ] Every `chapterTitle` matches a Section 8 entry, OR `chapterId` is a valid integer.
- [ ] Every MCQ/truefalse has `options` (array) and `correctAnswer` (capital letter).
- [ ] `correctAnswer` is valid for the number of options (don't use "E" with only 4 options).
- [ ] Option strings do NOT start with "A)", "B)", "1.", "a." prefixes — answer text only.
- [ ] Every essay has a `modelAnswer` string.
- [ ] Every matching question has a `pairs` array of `{ premise, target }` objects.
- [ ] Every fillblank has a `blanks` array matching the `___` count in `text`.
- [ ] Every case has a `subQuestions` array (sub-questions can be mcq, essay, or fillblank).
- [ ] Every question has an `explanation` (generated from medical knowledge if source showed N/A).
- [ ] Every question has a `keyConcept` (generated from medical knowledge if source showed N/A).
- [ ] Every essay without a source model answer has one that is medically accurate and complete.
- [ ] The JSON has no markdown fences, comments, or extra text; it is output first and on its own.
- [ ] The entire JSON object parses as valid JSON (no trailing commas, no single quotes).
- [ ] The Flagged Review List (if any) appears only AFTER the JSON and is clearly not part of it.

═══════════════════════════════════════════════════════════════
## SECTION 9 — VALID MODULE CODES (ALL YEARS & SEMESTERS)
═══════════════════════════════════════════════════════════════

Use exactly one of these codes as `moduleCode`:

### Year 1 — Semester 1
| Code | Module Name |
|---|---|
| `IAE-1` | Introduction to Anatomy & Embryology |
| `IPHY-1` | Introduction to Physiology |
| `IBM-1` | Introduction to Medical Biochemistry |
| `IHC-1` | Introduction to Histology & Cell Biology |
| `MIM-1` | Immunology Module |
| `MBMG-1` | Molecular Biology and Medical Genetics |
| `P1-1` | Introduction to ICT and Medical Terminology |

### Year 1 — Semester 2
| Code | Module Name |
|---|---|
| `IPAT-1` | Introduction to Pathology |
| `IPHA-1` | Introduction to Clinical Pharmacology |
| `MINF-1` | Infection Module |
| `MLS-1` | Locomotor Module |
| `BLS-HE-1` | Basic Life Support + History Taking & Clinical Examination |
| `P2-1` | Presentation Skills - Learning Skills - Time Management |

### Year 2 — Semester 1
| Code | Module Name |
|---|---|
| `MBL-2` | Blood & Lymphatic System |
| `MRS-2` | Respiratory System |
| `MCVS-2` | Cardiovascular System |

### Year 2 — Semester 2
| Code | Module Name |
|---|---|
| `MCNS-2` | Central Nervous System |
| `MSS-2` | Special Senses |
| `MEM-2` | Endocrine System & Metabolism |
| `P3-2` | Behavioral science |
| `R-2` | Fundamentals of Research |

### Year 3 — Semester 1
| Code | Module Name |
|---|---|
| `MGL-3` | GIT & Liver |
| `MUG-3` | Urogenital System |
| `P4-3` | Medical Ethics |
| `P5-3` | Doctor-Patient Communication |

### Year 3 — Semester 2
| Code | Module Name |
|---|---|
| `CEO-3` | Community, Environmental and Occupational Medicine |
| `FT-3` | Forensic Medicine and Clinical Toxicology |
| `ORL-3` | Otorhinolaryngology |
| `MED1-3` | Foundation of Internal Medicine |
| `P6-3` | Leadership skills & Management skills |
| `R-3` | Scientific Research |

### Year 4 — Semester 1
| Code | Module Name |
|---|---|
| `MED2-4` | General and Special Internal Medicine 1 |
| `FAM-4` | Family Medicine |
| `P7-4` | Communication within a Medical Team |

### Year 4 — Semester 2
| Code | Module Name |
|---|---|
| `MED3-4` | General and Special Internal Medicine 2 |
| `PED-4` | Pediatrics |

### Year 5 — Semester 1
| Code | Module Name |
|---|---|
| `OO-5` | Ophthalmology |
| `SUR1-5` | General and Special Surgery 1 |
| `EM1-5` | Emergency Medicine and Trauma 1 |

### Year 5 — Semester 2
| Code | Module Name |
|---|---|
| `SUR2-5` | General and Special Surgery 2 |
| `EM2-5` | Emergency Medicine and Trauma 2 |
| `OG-5` | Obstetrics and Gynecology |

═══════════════════════════════════════════════════════════════
## SECTION 10 — CURRICULUM CHAPTER REFERENCE GUIDE
═══════════════════════════════════════════════════════════════

Use these EXACT chapter titles in `chapterTitle`. Do not invent new chapter names. If unsure which chapter a question belongs to, preserve the original source heading verbatim and the importer will fuzzy-match it. If the heading is missing or unreadable, the importer will also match questions to chapters using keyword overlap against a curated keyword list per chapter (e.g., chapter 1 keywords: neuroglia, astrocytes, neurotransmitters, spinal cord, etc.). For best results, include specific topic terms in the question text when chapter is ambiguous. If the question itself is unreadable or incomplete, **FLAG it** (Section 0) instead of importing it.

### YEAR 1 MODULES

**IAE-1** — Introduction to Anatomy & Embryology:
1. "Introduction to Anatomy"
2. "General Embryology"

**IPHY-1** — Introduction to Physiology:
1. "Homeostasis & Membrane Transport"
2. "Autonomic Nervous System"
3. "Excitable Tissues"

**IBM-1** — Introduction to Medical Biochemistry:
1. "Cell Chemistry & Biophysics"
2. "Enzymes & Bioenergetics"

**IHC-1** — Introduction to Histology & Cell Biology:
1. "Cytology & Cell Cytoplasm"
2. "Epithelial & Connective Tissues"

**MIM-1** — Immunology Module:
1. "Innate Immunity"
2. "Adaptive Immunity"
3. "Clinical Immunology"

**MBMG-1** — Molecular Biology & Medical Genetics:
1. "Molecular Biology & DNA"
2. "Genetics & Hereditary Disorders"

**P1-1** — Introduction to ICT & Medical Terminology:
1. "Medical Terminology & Prefixes/Suffixes"
2. "Healthcare Information & Communication Technology (ICT)"

**IPAT-1** — Introduction to Pathology:
1. "Cellular Injury & Adaptations"
2. "Inflammation & Repair"
3. "Hemodynamics & Neoplasia"

**IPHA-1** — Introduction to Clinical Pharmacology:
1. "Pharmacokinetics & Pharmacodynamics"
2. "Autonomic Pharmacology"

**MINF-1** — Infection Module:
1. "General & Systemic Bacteriology"
2. "Virology, Mycology & Parasitology"

**MLS-1** — Locomotor Module:
1. "Upper Limb Anatomy & Injuries"
2. "Lower Limb Anatomy & Injuries"
3. "Spine & Musculoskeletal Pathologies"

**BLS-HE-1** — Basic Life Support & Clinical Examination:
1. "Basic Life Support (BLS) & CPR"
2. "Medical History Taking"
3. "General Clinical Examination"

**P2-1** — Presentation, Learning & Time Management Skills:
1. "Learning Strategies & Memory Techniques"
2. "Effective Presentation & Communication Skills"
3. "Time Management & Goal Setting"

---

### YEAR 2 MODULES

**MBL-2** — Blood & Lymphatic System:
1. "Erythrocytes & Anemias"
2. "Leukocytes & Lymphatics"
3. "Hemostasis & Bleeding Disorders"

**MRS-2** — Respiratory System:
1. "Respiratory Tract Anatomy & Histology"
2. "Pulmonary Physiology"
3. "Respiratory Pathologies & Pharmacology"

**MCVS-2** — Cardiovascular System:
1. "Cardiac Anatomy & Histology"
2. "Electrophysiology & ECG"
3. "Hemodynamics & Blood Pressure"
4. "Cardiovascular Pathologies & Pharmacology"

**MCNS-2** — Central Nervous System:
1. "Introduction to CNS"
2. "Cerebrum & Cortical Functions"
3. "Thalamus & Hypothalamus"
4. "Brain Stem"
5. "Cerebellum & Basal Ganglia"
6. "Spinal Cord Tracts"
7. "Cranial Nerves"
8. "Meninges, Ventricles & CSF"
9. "Blood Supply of the CNS"
10. "CNS Pathology & Neuropharmacology"

**MSS-2** — Special Senses:
1. "Ophthalmology & Visual Pathways"
2. "Otology & Auditory Systems"

**MEM-2** — Endocrine System & Metabolism:
1. "Pituitary Gland"
2. "Thyroid and Parathyroid Glands"
3. "Adrenal (Suprarenal) Gland"
4. "Endocrine Pancreas"
5. "Diabetes Mellitus & Metabolic Disorders"

**P3-2** — Behavioral science:
1. "Introduction to Psychology"
2. "Basics of research methodology"
3. "Brain Structures and their Functions"
4. "Developmental Psychology"
5. "Personality"
6. "Psychology of Learning"
7. "Attention & Perception"
8. "Psychology of Memory"
9. "Psychology of Thinking"
10. "Intelligence"
11. "Psychology of Language"
12. "Psychology of Sleep"
13. "Circadian Rhythms"
14. "Psychology of Motivation"
15. "Psychology of Emotions"
16. "Psychology of Stress"
17. "Frustration & Defensive Mechanisms"
18. "Sensory Deprivation"
19. "Social Psychology"
20. "Psychology of Aggression and Violence"
21. "Psychology in Relation to Medicine"
22. "Doctor Patient Relationship"

**R-2** — Fundamentals of Research:
1. "Introduction"
2. "Research question and hypothesis"
3. "Epidemiological studies and causality"
4. "Sampling"
5. "Sources of data and questionnaire"
6. "Bias and confounding"
7. "Research ethics"
8. "Citation and plagiarism"
9. "Protocol writing"
10. "Descriptive statistics"
11. "Data presentation"

---

### YEAR 3 MODULES

**MGL-3** — GIT & Liver:
1. "Upper GI Tract (Oral to Stomach)"
2. "Lower GI Tract (Intestines)"
3. "Hepatobiliary System & Pancreas"
4. "Gastrointestinal Pathologies & Drugs"

**MUG-3** — Urogenital System:
1. "Renal System & Electrolytes"
2. "Male Reproductive System"
3. "Female Reproductive System"
4. "Urogenital Pathologies & Drugs"

**P4-3** — Medical Ethics:
1. "Principles of Bioethics & Autonomy"
2. "Informed Consent, Confidentiality & Professionalism"
3. "Ethical Dilemmas in Clinical Practice"

**P5-3** — Doctor-Patient Communication:
1. "Active Listening & Verbal/Non-Verbal Communication"
2. "Breaking Bad News & Handling Difficult Patients"
3. "Patient-Centered Interviewing & Empathy"

**CEO-3** — Community, Environmental and Occupational Medicine:
1. "Public Health & Epidemiology"
2. "Environmental & Occupational Hazards"

**FT-3** — Forensic Medicine and Clinical Toxicology:
1. "Forensic Thanatology & Traumatology"
2. "Clinical Toxicology"

**ORL-3** — Otorhinolaryngology:
1. "Otology & Rhinology"
2. "Laryngology & Head/Neck Diseases"

**MED1-3** — Foundation of Internal Medicine:
1. "Clinical History & Communication"
2. "Physical Examination Skills"

**P6-3** — Leadership & Management Skills:
1. "Leadership Styles & Team Dynamics"
2. "Healthcare Management, Quality & Conflict Resolution"

**R-3** — Scientific Research:
1. "Designing a Scientific Research Proposal"
2. "Scientific Writing, Citation & Publication Ethics"

---

### YEAR 4 MODULES

**MED2-4** — General and Special Internal Medicine 1:
1. "Cardiology"
2. "Pulmonology"
3. "Gastroenterology & Hepatology"
4. "Nephrology"

**FAM-4** — Family Medicine:
1. "Primary Care & Disease Prevention"

**P7-4** — Communication within a Medical Team:
1. "Interprofessional Communication & Collaboration"
2. "Handover Protocols, SBAR & Team Safety"

**MED3-4** — General and Special Internal Medicine 2:
1. "Neurology"
2. "Endocrinology & Diabetes"
3. "Hematology & Oncology"
4. "Rheumatology & Clinical Immunology"
5. "Geriatrics & Psychiatry"

**PED-4** — Pediatrics:
1. "Growth, Development & Nutrition"
2. "Neonatology"
3. "Pediatric Infectious Diseases & Systemic Pathology"

---

### YEAR 5 MODULES

**OO-5** — Ophthalmology:
1. "Optics & Refraction"
2. "Anterior & Posterior Segment Diseases"
3. "Neuro-ophthalmology & Eye Injuries"

**SUR1-5** — General and Special Surgery 1:
1. "Perioperative Care & General Surgery"
2. "Abdominal & Hernia Surgery"
3. "Endocrine & Breast Surgery"

**EM1-5** — Emergency Medicine and Trauma 1:
1. "Resuscitation & Critical Care"
2. "Advanced Trauma Life Support"

**SUR2-5** — General and Special Surgery 2:
1. "Orthopedics & Musculoskeletal Trauma"
2. "Urology & Male Genital Surgery"
3. "Neurosurgery & Specialty Surgery (Cardiothoracic, Plastic)"

**EM2-5** — Emergency Medicine and Trauma 2:
1. "Environmental & Toxicological Emergencies"

**OG-5** — Obstetrics and Gynecology:
1. "Antenatal Care & Pregnancy Complications"
2. "Labor & Obstetric Emergencies"
3. "General Gynecology & Gynecologic Oncology"

═══════════════════════════════════════════════════════════════
## SECTION 11 — COMPLETE EXAMPLE OUTPUT
═══════════════════════════════════════════════════════════════

**PART 1 — THE JSON** (only confident, correct questions):

```json
{
  "moduleCode": "MEM-2",
  "questions": [
    {
      "chapterTitle": "Pituitary Gland",
      "subject": "Anatomy",
      "lecture": 1,
      "type": "mcq",
      "text": "Which of the following is a part of adenohypophysis?",
      "options": ["Pars nervosa", "Median eminence", "Pars intermedia", "Infundibular stem"],
      "correctAnswer": "C",
      "explanation": "The adenohypophysis consists of pars distalis, pars tuberalis, and pars intermedia.",
      "keyConcept": "Anterior vs posterior pituitary embryology"
    },
    {
      "chapterTitle": "Pituitary Gland",
      "subject": "Physiology",
      "lecture": 3,
      "type": "truefalse",
      "text": "Prolactin secretion is predominantly inhibited by hypothalamic dopamine.",
      "options": ["True", "False"],
      "correctAnswer": "A",
      "explanation": "Dopamine exerts tonic inhibition on lactotrophs.",
      "keyConcept": "Dopamine tonically inhibits prolactin"
    },
    {
      "chapterTitle": "Thyroid and Parathyroid Glands",
      "subject": "Clinical",
      "lecture": 6,
      "type": "case",
      "text": "A 28-year-old woman presents with weight loss, heat intolerance, tremor, and diffuse thyroid enlargement. Labs show suppressed TSH and elevated free T4.",
      "explanation": "Classic presentation of Graves disease.",
      "keyConcept": "Clinical diagnosis of hyperthyroidism",
      "subQuestions": [
        {
          "type": "mcq",
          "text": "Which diagnosis is most likely?",
          "options": ["Hashimoto thyroiditis", "Graves disease", "Subacute thyroiditis", "Iodine deficiency"],
          "correctAnswer": "B",
          "explanation": "Diffuse goiter + thyrotoxicosis + suppressed TSH = Graves disease.",
          "keyConcept": "Graves disease diagnosis"
        },
        {
          "type": "essay",
          "text": "Explain the TFT pattern in primary hyperthyroidism.",
          "modelAnswer": "Free T4/T3 are elevated; TSH is suppressed by negative feedback.",
          "explanation": "High thyroid hormones suppress TSH at the pituitary.",
          "keyConcept": "Low TSH + high free T4 = primary hyperthyroidism"
        }
      ]
    }
  ]
}
```

**PART 2 — FLAGGED REVIEW LIST** (shown in chat, NOT imported). Only appears if there were uncertain questions:

```
=== FLAGGED FOR MANUAL REVIEW — NOT IMPORTED ===

[1] Reason: Garbled OCR — answer options unreadable
    Raw question (as received): "Whihc of the f0ll0w1ng is a pa■■ of aden0hyp0physis? A) Pars nerv... B) ▒▒▒"
    My tentative reading (NOT imported): Likely an MCQ on adenohypophysis parts, but options are corrupted — cannot confirm answer.

[2] Reason: Marked correct answer is not among the listed options
    Raw question (as received): "The main hormone of the adrenal cortex is: A) Insulin  B) Glucagon  C) ADH  (answer key: Cortisol)"
    My tentative reading (NOT imported): Answer "Cortisol" is missing from options A–C, so the correct choice cannot be mapped.
```

═══════════════════════════════════════════════════════════════
## SECTION 12 — CLEANED QUESTION BLOCKS TO CONVERT
═══════════════════════════════════════════════════════════════

[PASTE YOUR CLEANED QUESTION BLOCKS HERE]