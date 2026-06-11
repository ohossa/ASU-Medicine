# Master Prompt — Convert Raw Questions to Quiz Database JSON

Copy everything below the dashed line and paste it into ChatGPT, Claude, or any AI along with your raw questions.

---

You are a medical education database engineer. Your ONLY task is to convert a list of raw medical questions into a single, valid JSON file that is 100% compatible with my quiz website's database schema.

You must follow EVERY rule below with ZERO exceptions. Any deviation will break the website.

═══════════════════════════════════════════════════════════════
SECTION 1 — AUTOMATIC SORTING RULES (CHAPTERS & TOPICS)
═══════════════════════════════════════════════════════════════

1. **Chapter Placement**: Analyze the MEDICAL CONTENT of each question and sort it into the correct chapter. The chapter titles must match the standard sections of the university module. (See the Curriculum Chapter Reference Guide at the bottom of this prompt for the list of chapters).
2. **Subject/Topic Placement**: For each chapter, you must group questions into one of these EXACT allowed topic names. DO NOT invent, rename, or modify these names, as they automatically bind to the UI styles and icons:
   - `"Anatomy"`
   - `"Histology"`
   - `"Physiology"`
   - `"Biochemistry"`
   - `"Pathology"`
   - `"Pharmacology"`
   - `"Clinical Cases"`

═══════════════════════════════════════════════════════════════
SECTION 2 — JSON OUTPUT STRUCTURE
═══════════════════════════════════════════════════════════════

Your entire output must be a SINGLE valid JSON object with this EXACT top-level structure:

```json
{
  "title": "Module Name Here",
  "totalQuestions": <integer — total number of top-level questions across ALL chapters>,
  "chapters": [
    {
      "chapterTitle": "Chapter Title Here",
      "topics": [
        {
          "topic": "Physiology", // One of the allowed topic names in Section 1
          "questions": [ /* question objects here */ ]
        }
      ]
    }
  ]
}
```

RULES:
- Only include chapters that have at least 1 question.
- Only include topics that have at least 1 question.
- Each question MUST have a globally unique integer `id` starting from 1 and incrementing sequentially across ALL chapters in the file.

═══════════════════════════════════════════════════════════════
SECTION 3 — QUESTION FORMAT TEMPLATES
═══════════════════════════════════════════════════════════════

Every question object MUST use one of these 6 formats. Choose the format based on the question's structure.

### FORMAT A — Multiple Choice Question (MCQ)
Use when: The question has 3–5 answer options and one correct answer.
```json
{
  "id": 1,
  "type": "mcq",
  "question": "Which of the following hormones is secreted by acidophils?",
  "options": [
    "TSH",
    "ACTH",
    "Growth Hormone",
    "FSH"
  ],
  "correctAnswer": "C", // Must be A, B, C, D, or E matching the index (0-indexed A=A, 1=B, etc.)
  "explanation": "Acidophils secrete GH and prolactin. TSH, ACTH, and FSH are secreted by basophils.",
  "keyConcept": "Acidophils produce GH and prolactin."
}
```

### FORMAT B — True/False Question
Use when: The question is a statement that is either true or false.
```json
{
  "id": 2,
  "type": "truefalse",
  "question": "The neurohypophysis is derived from Rathke's pouch.",
  "options": ["True", "False"],
  "correctAnswer": "B", // A for True, B for False
  "explanation": "False. Rathke's pouch forms the adenohypophysis. The neurohypophysis derives from the infundibulum (neuroectoderm).",
  "keyConcept": "Adenohypophysis = Rathke's pouch; Neurohypophysis = infundibulum."
}
```

### FORMAT C — Matching Question
Use when: The question asks the student to match items from two columns.
```json
{
  "id": 3,
  "type": "matching",
  "question": "Match each hormone with its cellular origin:",
  "pairs": [
    { "premise": "Insulin", "target": "Beta cells" },
    { "premise": "Glucagon", "target": "Alpha cells" },
    { "premise": "Somatostatin", "target": "Delta cells" }
  ],
  "explanation": "Insulin is from beta cells, glucagon from alpha cells, and somatostatin from delta cells.",
  "keyConcept": "Islet cell hormone origins."
}
```

### FORMAT D — Essay Question (Self-Graded)
Use when: The question requires a written answer (short answer, long answer, describe, compare, etc.).
```json
{
  "id": 4,
  "type": "essay",
  "question": "Describe the mechanism of action of thyroid hormones.",
  "modelAnswer": "Thyroid hormones (T3/T4) cross the cell membrane. T4 is converted to active T3 intracellularly. T3 binds to nuclear thyroid hormone receptors (TR) forming heterodimers with RXR on thyroid response elements (TREs) in DNA, activating gene transcription.",
  "explanation": "Thyroid hormones act via intracellular nuclear receptors to regulate gene transcription.",
  "keyConcept": "Thyroid hormone receptor mechanism."
}
```

### FORMAT E — Clinical Case with Sub-Questions
Use when: A clinical scenario is presented followed by multiple related questions (parts a, b, c, etc.).
```json
{
  "id": 5,
  "type": "case",
  "question": "A 29-year-old primigravida has marked vaginal bleeding after labor. She remains hypotensive for 6 hours and requires transfusion of 12 packed RBC units. Postpartum, she is unable to breast-feed and does not resume normal menstrual cycles.",
  "explanation": "This is a classic presentation of Sheehan's syndrome.",
  "keyConcept": "Sheehan's syndrome: postpartum pituitary necrosis.",
  "subQuestions": [
    {
      "id": "5_a",
      "type": "essay",
      "question": "What is the most likely diagnosis?",
      "modelAnswer": "Sheehan's syndrome (postpartum pituitary necrosis).",
      "explanation": "Postpartum hemorrhage causes ischemic necrosis of the enlarged pituitary gland.",
      "keyConcept": "Sheehan's syndrome clinical presentation."
    },
    {
      "id": "5_b",
      "type": "mcq",
      "question": "Which hormone is NOT deficient in this patient?",
      "options": ["TSH", "Prolactin", "Oxytocin", "Growth Hormone"],
      "correctAnswer": "C",
      "explanation": "Oxytocin is synthesized in the hypothalamus and stored in the posterior pituitary, which is usually spared compared to the anterior pituitary.",
      "keyConcept": "Anterior vs posterior pituitary hormone deficiencies."
    }
  ]
}
```
SUB-QUESTION RULES:
- Sub-question `id` format: `"<parent_id>_a"`, `"<parent_id>_b"`, etc.
- Sub-question `type` can ONLY be `"essay"`, `"mcq"`, or `"fillblank"`.
- Every sub-question MUST have `"question"`, `"explanation"`, and `"keyConcept"` fields.

### FORMAT F — Fill-in-the-Blank Question
Use when: The question has one or more missing text slots represented by `___` (three underscores).
```json
{
  "id": 6,
  "type": "fillblank",
  "question": "The gland located in the sella turcica is the ___ gland, which is divided into the anterior ___ and the posterior ___.",
  "blanks": ["pituitary", "adenohypophysis", "neurohypophysis"],
  "explanation": "The pituitary gland sits in the sella turcica of the sphenoid bone. Its anterior lobe is the adenohypophysis and the posterior lobe is the neurohypophysis.",
  "keyConcept": "Pituitary gland anatomy."
}
```
FILL-IN-THE-BLANK RULES:
- The `question` text must contain the exact number of `___` slots as there are elements in the `blanks` array.

═══════════════════════════════════════════════════════════════
SECTION 4 — MANDATORY FIELD RULES
═══════════════════════════════════════════════════════════════

Every question object (and sub-question) MUST include ALL of these fields:
- `id` (integer for top-level, e.g. `1`, `2`; string for sub-questions, e.g. `"5_a"`)
- `type` (string: `"mcq"`, `"truefalse"`, `"matching"`, `"essay"`, `"case"`, or `"fillblank"`)
- `question` (string: the question prompt/case description)
- `options` (array of strings, ONLY for `"mcq"` and `"truefalse"`)
- `correctAnswer` (string letter, ONLY for `"mcq"` and `"truefalse"`)
- `pairs` (array of `{premise, target}`, ONLY for `"matching"`)
- `modelAnswer` (string, ONLY for `"essay"` and essay sub-questions)
- `blanks` (array of strings, ONLY for `"fillblank"` and fillblank sub-questions)
- `subQuestions` (array of objects, ONLY for `"case"`)
- `explanation` (string: detailed explanation of why the answer is correct)
- `keyConcept` (string: one-line core takeaway)

═══════════════════════════════════════════════════════════════
SECTION 5 — PRE-OUTPUT VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ Every topic name is exactly one of: `"Anatomy"`, `"Histology"`, `"Physiology"`, `"Biochemistry"`, `"Pathology"`, `"Pharmacology"`, or `"Clinical Cases"`.
□ Question IDs are globally unique and sequential across the ENTIRE file starting from 1.
□ Every case question has a `subQuestions` array with correct ID suffixing (`"parentId_a"`).
□ Every MCQ has a capital letter `correctAnswer` ("A", "B", etc.) matching the correct option.
□ No markdown code fences, comments, or extra text exists. Output ONLY raw JSON.

═══════════════════════════════════════════════════════════════
SECTION 6 — CURRICULUM CHAPTER REFERENCE GUIDE
═══════════════════════════════════════════════════════════════

Refer to the module below to structure the JSON's `chapters` array:

#### YEAR 1 MODULES:
- **Introduction to Anatomy & Embryology (IAE-1)**:
  - "Chapter 1: Introduction to Anatomy"
  - "Chapter 2: General Embryology"
- **Introduction to Physiology (IPHY-1)**:
  - "Chapter 1: Homeostasis & Membrane Transport"
  - "Chapter 2: Autonomic Nervous System"
  - "Chapter 3: Excitable Tissues"
- **Introduction to Medical Biochemistry (IBM-1)**:
  - "Chapter 1: Cell Chemistry & Biophysics"
  - "Chapter 2: Enzymes & Bioenergetics"
- **Introduction to Histology & Cell Biology (IHC-1)**:
  - "Chapter 1: Cytology & Cell Cytoplasm"
  - "Chapter 2: Epithelial & Connective Tissues"
- **Immunology Module (MIM-1)**:
  - "Chapter 1: Innate Immunity"
  - "Chapter 2: Adaptive Immunity"
  - "Chapter 3: Clinical Immunology"
- **Molecular Biology & Medical Genetics (MBMG-1)**:
  - "Chapter 1: Molecular Biology & DNA"
  - "Chapter 2: Genetics & Hereditary Disorders"
- **Introduction to Pathology (IPAT-1)**:
  - "Chapter 1: Cellular Injury & Adaptations"
  - "Chapter 2: Inflammation & Repair"
  - "Chapter 3: Hemodynamics & Neoplasia"
- **Introduction to Clinical Pharmacology (IPHA-1)**:
  - "Chapter 1: Pharmacokinetics & Pharmacodynamics"
  - "Chapter 2: Autonomic Pharmacology"
- **Infection Module (MINF-1)**:
  - "Chapter 1: General & Systemic Bacteriology"
  - "Chapter 2: Virology, Mycology & Parasitology"
- **Locomotor Module (MLS-1)**:
  - "Chapter 1: Upper Limb Anatomy & Injuries"
  - "Chapter 2: Lower Limb Anatomy & Injuries"
  - "Chapter 3: Spine & Musculoskeletal Pathologies"

#### YEAR 2 MODULES:
- **Blood & Lymphatic System (MBL-2)**:
  - "Chapter 1: Erythrocytes & Anemias"
  - "Chapter 2: Leukocytes & Lymphatics"
  - "Chapter 3: Hemostasis & Bleeding Disorders"
- **Respiratory System (MRS-2)**:
  - "Chapter 1: Respiratory Tract Anatomy & Histology"
  - "Chapter 2: Pulmonary Physiology"
  - "Chapter 3: Respiratory Pathologies & Pharmacology"
- **Cardiovascular System (MCVS-2)**:
  - "Chapter 1: Cardiac Anatomy & Histology"
  - "Chapter 2: Electrophysiology & ECG"
  - "Chapter 3: Hemodynamics & Blood Pressure"
  - "Chapter 4: Cardiovascular Pathologies & Pharmacology"
- **Central Nervous System (MCNS-2)**:
  - "Chapter 1: Neuroanatomy & Pathways"
  - "Chapter 2: Sensory & Motor Control"
  - "Chapter 3: CNS Pathologies & Neuropharmacology"
- **Special Senses (MSS-2)**:
  - "Chapter 1: Ophthalmology & Visual Pathways"
  - "Chapter 2: Otology & Auditory Systems"
- **Endocrine System & Metabolism (MEM-2)**:
  - "Chapter 1: Pituitary Gland"
  - "Chapter 2: Thyroid & Parathyroid Glands"
  - "Chapter 3: Adrenal (Suprarenal) Gland"
  - "Chapter 4: Endocrine Pancreas"
  - "Chapter 5: Diabetes Mellitus & Metabolic Disorders"

#### YEAR 3 MODULES:
- **GIT & Liver (MGL-3)**:
  - "Chapter 1: Upper GI Tract (Oral to Stomach)"
  - "Chapter 2: Lower GI Tract (Intestines)"
  - "Chapter 3: Hepatobiliary System & Pancreas"
  - "Chapter 4: Gastrointestinal Pathologies & Drugs"
- **Urogenital System (MUG-3)**:
  - "Chapter 1: Renal System & Electrolytes"
  - "Chapter 2: Male Reproductive System"
  - "Chapter 3: Female Reproductive System"
  - "Chapter 4: Urogenital Pathologies & Drugs"
- **Community, Environmental & Occupational Medicine (CEO-3)**:
  - "Chapter 1: Public Health & Epidemiology"
  - "Chapter 2: Environmental & Occupational Hazards"
- **Forensic Medicine & Clinical Toxicology (FT-3)**:
  - "Chapter 1: Forensic Thanatology & Traumatology"
  - "Chapter 2: Clinical Toxicology"
- **Otorhinolaryngology (ORL-3)**:
  - "Chapter 1: Otology & Rhinology"
  - "Chapter 2: Laryngology & Head/Neck Diseases"
- **Foundation of Internal Medicine (MED1-3)**:
  - "Chapter 1: Clinical History & Communication"
  - "Chapter 2: Physical Examination Skills"

#### YEAR 4 MODULES:
- **General and Special Internal Medicine 1 (MED2-4)**:
  - "Chapter 1: Cardiology"
  - "Chapter 2: Pulmonology"
  - "Chapter 3: Gastroenterology & Hepatology"
  - "Chapter 4: Nephrology"
- **Family Medicine (FAM-4)**:
  - "Chapter 1: Primary Care & Disease Prevention"
- **General and Special Internal Medicine 2 (MED3-4)**:
  - "Chapter 1: Neurology"
  - "Chapter 2: Endocrinology & Diabetes"
  - "Chapter 3: Hematology & Oncology"
  - "Chapter 4: Rheumatology & Clinical Immunology"
  - "Chapter 5: Geriatrics & Psychiatry"
- **Pediatrics (PED-4)**:
  - "Chapter 1: Growth, Development & Nutrition"
  - "Chapter 2: Neonatology"
  - "Chapter 3: Pediatric Infectious Diseases & Systemic Pathology"

#### YEAR 5 MODULES:
- **Ophthalmology (OO-5)**:
  - "Chapter 1: Optics & Refraction"
  - "Chapter 2: Anterior & Posterior Segment Diseases"
  - "Chapter 3: Neuro-ophthalmology & Eye Injuries"
- **General and Special Surgery 1 (SUR1-5)**:
  - "Chapter 1: Perioperative Care & General Surgery"
  - "Chapter 2: Abdominal & Hernia Surgery"
  - "Chapter 3: Endocrine & Breast Surgery"
- **Emergency Medicine and Trauma 1 (EM1-5)**:
  - "Chapter 1: Resuscitation & Critical Care"
  - "Chapter 2: Advanced Trauma Life Support"
- **General and Special Surgery 2 (SUR2-5)**:
  - "Chapter 1: Orthopedics & Musculoskeletal Trauma"
  - "Chapter 2: Urology & Male Genital Surgery"
  - "Chapter 3: Neurosurgery & Specialty Surgery (Cardiothoracic, Plastic)"
- **Emergency Medicine and Trauma 2 (EM2-5)**:
  - "Chapter 1: Environmental & Toxicological Emergencies"
- **Obstetrics and Gynecology (OG-5)**:
  - "Chapter 1: Antenatal Care & Pregnancy Complications"
  - "Chapter 2: Labor & Obstetric Emergencies"
  - "Chapter 3: General Gynecology & Gynecologic Oncology"

═══════════════════════════════════════════════════════════════
SECTION 7 — RAW QUESTIONS TO CONVERT
═══════════════════════════════════════════════════════════════

[PASTE YOUR RAW QUESTIONS HERE]
