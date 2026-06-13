# Master Prompt — Convert Raw Questions to MEDARK v2 Incoming Batch JSON

Copy **everything below the dashed line** and paste it into ChatGPT, Claude, or any AI along with your raw questions.

---

You are a medical education database engineer. Your **ONLY** task is to convert a list of raw medical questions into a single, valid **MEDARK v2 incoming batch JSON** file that is 100% compatible with my quiz website's automated import pipeline.

You must follow **EVERY** rule below with **ZERO** exceptions. Any deviation will break the importer.

═══════════════════════════════════════════════════════════════
SECTION 1 — OUTPUT FORMAT (INCOMING BATCH JSON)
═══════════════════════════════════════════════════════════════

Your entire output must be a **SINGLE valid JSON object** with this EXACT top-level structure:

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
- `moduleCode` must be one of the valid module codes listed in **Section 7** (e.g. `"MEM-2"`, `"MCNS-2"`, `"IPAT-1"`).
- `questions` is a **flat array** of question objects. Do NOT nest them inside chapters or topics — the importer routes them automatically.
- Output **ONLY** raw JSON. No markdown fences, no comments, no extra text before or after.

═══════════════════════════════════════════════════════════════
SECTION 2 — REQUIRED FIELDS FOR EVERY QUESTION
═══════════════════════════════════════════════════════════════

Every question object in the `questions` array **MUST** include ALL of these fields:

| Field | Type | Required | Rules |
|---|---|---|---|
| `chapterTitle` | `string` | **Yes** | The exact chapter title from the Curriculum Reference (Section 8). If unsure, use the original source heading verbatim. |
| `chapterId` | `number` | Preferred | 1-based chapter number. Use this instead of `chapterTitle` when you know the exact chapter number. |
| `subject` | `string` | **Yes** | One of the 8 canonical subject names (Section 3). |
| `lecture` | `number` | Strongly recommended | Integer lecture number. Defaults to chapter ID if absent. |
| `type` | `string` | **Yes** | One of: `"mcq"`, `"truefalse"`, `"matching"`, `"essay"`, `"case"`, `"fillblank"`. |
| `text` | `string` | **Yes** | The question prompt or case description. |
| `explanation` | `string` | **Yes** | Detailed explanation of why the answer is correct. |
| `keyConcept` | `string` | Recommended | One-line core takeaway / high-yield learning point. |

Plus **type-specific fields** defined in Section 4.

═══════════════════════════════════════════════════════════════
SECTION 3 — CANONICAL SUBJECT NAMES
═══════════════════════════════════════════════════════════════

Use **EXACTLY** one of these 12 subject names. Do NOT invent, rename, or modify them:

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

> **Note**: To ensure the database parses correctly, match the subject of the question exactly to one of the 12 names above. Do not use custom names or abbreviations.

═══════════════════════════════════════════════════════════════
SECTION 4 — QUESTION TYPE TEMPLATES
═══════════════════════════════════════════════════════════════

Choose the format based on the question's structure. Every template shown below is in **incoming batch format** (the importer converts `correctAnswer` letters to `correctIndex` automatically).

### FORMAT A — Multiple Choice Question (MCQ)
Use when: 3–5 answer options with one correct answer.
```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Anatomy",
  "lecture": 1,
  "type": "mcq",
  "text": "Which of the following is a part of adenohypophysis?",
  "options": [
    "Pars nervosa",
    "Median eminence",
    "Pars intermedia",
    "Infundibular stem"
  ],
  "correctAnswer": "C",
  "explanation": "The adenohypophysis consists of pars distalis, pars tuberalis, and pars intermedia.",
  "keyConcept": "Anterior vs posterior pituitary embryology"
}
```
**MCQ Rules:**
- `options`: Array of 2–5 strings. Do NOT prefix with "A)", "B)", etc.
- `correctAnswer`: Capital letter `"A"`, `"B"`, `"C"`, `"D"`, or `"E"` matching the correct option (A = first option, B = second, etc.).

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
**True/False Rules:**
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
**Matching Rules:**
- `pairs`: Array of `{ "premise": string, "target": string }` objects.
- Do NOT split premises and targets into separate arrays.

### FORMAT D — Essay Question (Self-Graded)
Use when: The question requires a written answer.
```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Physiology",
  "lecture": 2,
  "type": "essay",
  "text": "Describe the regulation of growth hormone secretion.",
  "modelAnswer": "Growth hormone secretion is stimulated mainly by GHRH and ghrelin, and inhibited by somatostatin. Secretion is pulsatile, increases during deep sleep, exercise, fasting, hypoglycemia, stress, and puberty.",
  "explanation": "GH is controlled by hypothalamic releasing and inhibiting hormones, metabolic cues, sleep, stress, and IGF-1 negative feedback.",
  "keyConcept": "Pulsatile GH secretion and hypothalamic control"
}
```
**Essay Rules:**
- `modelAnswer` is **required** and must be a complete, detailed answer string.

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
      "explanation": "Diffuse goiter with thyrotoxic symptoms and suppressed TSH with elevated free T4 is typical of Graves disease.",
      "keyConcept": "Graves disease is a common cause of primary hyperthyroidism"
    },
    {
      "type": "essay",
      "text": "Explain the expected thyroid function test pattern in primary hyperthyroidism.",
      "modelAnswer": "Primary hyperthyroidism causes excessive thyroid hormone production. Free T4 and/or T3 are elevated, and pituitary TSH is suppressed by negative feedback.",
      "explanation": "High circulating thyroid hormone suppresses TSH secretion through negative feedback.",
      "keyConcept": "Low TSH with high free T4 indicates primary hyperthyroidism"
    }
  ]
}
```
**Case Sub-Question Rules:**
- Sub-question `type` can **ONLY** be `"mcq"` or `"essay"`.
- Every sub-question MUST have `"text"`, `"explanation"`, and `"keyConcept"`.
- MCQ sub-questions need `"options"` and `"correctAnswer"`.
- Essay sub-questions need `"modelAnswer"`.
- Sub-questions do NOT need their own `id` — the importer generates canonical IDs automatically.

### FORMAT F — Fill-in-the-Blank Question
Use when: The question has missing text slots represented by `___` (three underscores).
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
**Fill-in-the-Blank Rules:**
- The `text` must contain the exact number of `___` slots as there are elements in the `blanks` array.
- `blanks`: Array of correct answers in order.
- `acceptedAnswers` (optional): Array of arrays, where each inner array contains accepted alternatives for the corresponding blank.

═══════════════════════════════════════════════════════════════
SECTION 5 — QUESTION ID GENERATION (HANDLED BY IMPORTER)
═══════════════════════════════════════════════════════════════

Do **NOT** generate question IDs yourself. The importer generates them automatically using this format:

```
{MODULECODE_NO_HYPHEN}-CH{chapterId}-{SUBJECTKEY}-{4digitSequence}
```

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
SECTION 6 — PRE-OUTPUT VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

Before outputting, verify ALL of the following:

- [ ] `moduleCode` is a valid code from Section 7.
- [ ] Every `subject` is exactly one of the 12 canonical names from Section 3.
- [ ] Every `chapterTitle` matches an entry from Section 8, OR `chapterId` is a valid integer.
- [ ] Every MCQ/truefalse has `options` (array) and `correctAnswer` (capital letter).
- [ ] `correctAnswer` letter is valid for the number of options (e.g. don't use "E" with only 4 options).
- [ ] Option strings do NOT start with "A)", "B)", "1.", "a." prefixes — just the answer text.
- [ ] Every essay has a `modelAnswer` string.
- [ ] Every matching question has a `pairs` array of `{ premise, target }` objects.
- [ ] Every fillblank has `blanks` array with entries matching `___` count in `text`.
- [ ] Every case question has a `subQuestions` array (sub-questions are `mcq` or `essay` only).
- [ ] Every question has `explanation`.
- [ ] No markdown code fences, comments, or extra text exist. Output is ONLY raw JSON.
- [ ] The entire output parses as valid JSON (no trailing commas, no single quotes).

═══════════════════════════════════════════════════════════════
SECTION 7 — VALID MODULE CODES (ALL YEARS & SEMESTERS)
═══════════════════════════════════════════════════════════════

You MUST use one of these exact module codes as the `moduleCode` value:

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
SECTION 8 — CURRICULUM CHAPTER REFERENCE GUIDE
═══════════════════════════════════════════════════════════════

Use these EXACT chapter titles in `chapterTitle`. Do not invent new chapter names. If unsure which chapter a question belongs to, preserve the original source heading verbatim as `chapterTitle` and the importer will fuzzy-match it.

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
SECTION 9 — COMPLETE EXAMPLE OUTPUT
═══════════════════════════════════════════════════════════════

Here is a complete, valid example of the expected output for a small batch:

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
      "options": [
        "Pars nervosa",
        "Median eminence",
        "Pars intermedia",
        "Infundibular stem"
      ],
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
      "chapterTitle": "Pituitary Gland",
      "subject": "Physiology",
      "lecture": 2,
      "type": "essay",
      "text": "Describe the regulation of growth hormone secretion.",
      "modelAnswer": "Growth hormone secretion is stimulated by GHRH and ghrelin, and inhibited by somatostatin. Secretion is pulsatile and increases during deep sleep, exercise, fasting, and stress.",
      "explanation": "GH is controlled by hypothalamic hormones, metabolic cues, and IGF-1 negative feedback.",
      "keyConcept": "Pulsatile GH secretion and hypothalamic control"
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
          "modelAnswer": "Free T4/T3 are elevated. TSH is suppressed by negative feedback.",
          "explanation": "High thyroid hormones suppress TSH at the pituitary.",
          "keyConcept": "Low TSH + high free T4 = primary hyperthyroidism"
        }
      ]
    },
    {
      "chapterTitle": "Pituitary Gland",
      "subject": "Anatomy",
      "lecture": 1,
      "type": "fillblank",
      "text": "The pituitary gland lies in the ___ of the sphenoid bone and is connected to the hypothalamus by the ___.",
      "blanks": ["sella turcica", "infundibulum"],
      "acceptedAnswers": [
        ["hypophyseal fossa", "pituitary fossa"],
        ["pituitary stalk"]
      ],
      "explanation": "The pituitary sits in the sella turcica and connects to the hypothalamus via the infundibulum.",
      "keyConcept": "Pituitary location and hypothalamic connection"
    },
    {
      "chapterTitle": "Thyroid and Parathyroid Glands",
      "subject": "Biochemistry",
      "lecture": 4,
      "type": "matching",
      "text": "Match each thyroid hormone synthesis step with its description.",
      "pairs": [
        { "premise": "Iodide trapping", "target": "Active transport via sodium-iodide symporter" },
        { "premise": "Organification", "target": "Iodine attachment to tyrosyl residues on thyroglobulin" },
        { "premise": "Coupling", "target": "Combination of iodotyrosines to form T3 and T4" }
      ],
      "explanation": "Thyroid hormone synthesis proceeds through iodide uptake, organification, coupling, storage, and release.",
      "keyConcept": "Sequential steps of thyroid hormone synthesis"
    }
  ]
}
```

═══════════════════════════════════════════════════════════════
SECTION 10 — RAW QUESTIONS TO CONVERT
═══════════════════════════════════════════════════════════════

[PASTE YOUR RAW QUESTIONS HERE]
