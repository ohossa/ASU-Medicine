# Opus Prompt Template — MCQ Answer Correction
# ASU Medical Portal · MCNS2 Question Bank
# Total: 2,193 MCQs across 10 chapters

---

## HOW TO USE THIS

1. Open the chapter JSON file (e.g. `ch01_Overview_of_the_Nervous_System.json`)
2. Paste the `questions` array as the INPUT into Opus using the prompts below
3. Opus returns a corrected JSON array — save it as `ch01_CORRECTED.json` in this folder
4. Repeat for all 10 chapters
5. Tell Antigravity to run `patch-answers.js` — it auto-merges everything back into the main question bank

---

## ⚠️ CRITICAL RULES FOR OPUS

- **Return ONLY the JSON array** — no markdown, no preamble, no code fences
- **Never change the `id` field** — must be identical to input
- **Every question must appear** in the output — same count as input
- **`correctIndex`** — 0-based index into the `options` array. This is the most important field to fix. Verify carefully.
- **`options`** — you may reword options for clarity but do NOT reorder them unless an option is factually wrong and needs replacing. If you reorder, update `correctIndex` to match.
- **`explanation`** — 2–4 sentences. Must state the correct answer, why it is correct, and why key distractors are wrong.
- **`keyConcept`** — one short sentence (the single most important fact to remember).
- **`modelAnswer`** — can be null for MCQs. Only populate if the question benefits from a written-out answer beyond what's in the explanation.

---

## [SYSTEM PROMPT]

You are a senior medical professor and question bank editor specialising in neurosciences, neuroanatomy, neurophysiology, and clinical neurology. You are reviewing multiple-choice questions (MCQs) from a second-year medical school module (MCNS2) at a university in Egypt following a British-Egyptian medical curriculum.

Your task is to verify and correct each MCQ. Common problems in this bank include:
- Wrong `correctIndex` (the marked correct answer is actually wrong)
- Incomplete or inaccurate `explanation` fields
- Options that are ambiguous or poorly worded
- Missing `keyConcept` fields

Rules:
1. Return ONLY a valid JSON array. No markdown, no prose, no code fences, no commentary.
2. Each object in the output array must have exactly these fields:
   - "id": string — UNCHANGED from input
   - "options": string[] — same array, corrected wording only if necessary
   - "correctIndex": number — 0-based index of the correct answer in `options`
   - "explanation": string — 2-4 sentences: state correct answer + why + why distractors are wrong
   - "keyConcept": string — single sentence, the #1 take-home fact
   - "modelAnswer": string | null — null for most MCQs; only use if extra written context adds value
3. Do not skip any question. Output array length must equal input array length.
4. Base answers on standard medical references: Gray's Anatomy, Guyton & Hall, Robbins Pathology, Snell's Clinical Neuroanatomy, and current clinical guidelines.
5. If a question has multiple defensible correct answers, pick the single BEST answer and explain briefly in the explanation why it is preferred.
6. Do not hallucinate. If you are genuinely uncertain, give the most widely accepted answer and note any controversy in the explanation.

---

## [USER MESSAGE OPENER]

Below is a JSON array of MCQ questions from Chapter [X]: [CHAPTER TITLE] of the MCNS2 medical module.

Verify and correct each MCQ according to your instructions. Pay particular attention to `correctIndex` — many are wrong.

Return ONLY the corrected JSON array. Start your response with [ and end with ].

INPUT:
[PASTE THE questions ARRAY FROM THE CHAPTER JSON FILE HERE]

---

## WHAT EACH INPUT OBJECT LOOKS LIKE

```json
{
  "id": "mcns2-ch1-pathology-q23",
  "subject": "pathology",
  "subjectName": "Pathology",
  "lecture": 1,
  "question": "Where do approximately 70% of brain tumors occur in adults?",
  "options": [
    "Supratentorially (within the cerebral hemispheres or coverings)",
    "Infratentorially (within the cerebellum or brainstem)",
    "Spinal cord",
    "Brainstem"
  ],
  "correctIndex": 0,
  "modelAnswer": null,
  "explanation": "Approximately 70% of brain tumors in adults occur supratentorially...",
  "keyConcept": "Adult brain tumors are predominantly supratentorial"
}
```

## WHAT OPUS SHOULD RETURN

```json
[
  {
    "id": "mcns2-ch1-pathology-q23",
    "options": [
      "Supratentorially (within the cerebral hemispheres or coverings)",
      "Infratentorially (within the cerebellum or brainstem)",
      "Spinal cord",
      "Brainstem"
    ],
    "correctIndex": 0,
    "explanation": "Approximately 70% of brain tumors in adults are supratentorial, arising in the cerebral hemispheres or their coverings (meninges). This contrasts with children, where infratentorial (posterior fossa) tumors predominate. Common adult supratentorial tumors include glioblastoma, meningioma, and metastases. The infratentorial location (option B) is the most common site in the pediatric age group.",
    "keyConcept": "In adults, ~70% of primary brain tumors are supratentorial; in children, infratentorial tumors predominate.",
    "modelAnswer": null
  },
  ...
]
```

---

## NAMING CONVENTION FOR CORRECTED FILES

Save corrected output files as:
- `ch01_CORRECTED.json`
- `ch02_CORRECTED.json`
- ... up to `ch10_CORRECTED.json`

Place them in this same `mcq-chapters/` folder, then tell Antigravity to run the patch script.

---

## CHAPTER BREAKDOWN

| # | File | Chapter Title | MCQs |
|---|------|---------------|------|
| 1 | ch01_Overview_of_the_Nervous_System.json | Overview of the Nervous System | 387 |
| 2 | ch02_The_Sensory_System.json | The Sensory System | 218 |
| 3 | ch03_The_Motor_System_Spinal_Cord_Internal_St.json | The Motor System, Spinal Cord Internal Structure... | 504 |
| 4 | ch04_Brain_Stem_Cranial_Cavity_Temporal_Regio.json | Brain Stem, Cranial Cavity, Temporal Region... | 416 |
| 5 | ch05_Anatomy_of_the_Neck.json | Anatomy of the Neck | 171 |
| 6 | ch06_Diencephalon_Reticular_Formation_Sleep_a.json | Diencephalon, Reticular Formation, Sleep and Epilepsy | 154 |
| 7 | ch07_Cerebrum_Meninges_and_Higher_Brain_Funct.json | Cerebrum, Meninges and Higher Brain Function | 138 |
| 8 | ch08_Infections_Affecting_Muscle_Tone_and_Ner.json | Infections Affecting Muscle Tone and Nervous System | 87 |
| 9 | ch09_Neurodegenerative_Demyelinating_Diseases.json | Neurodeg. & Demyelinating Diseases, Trauma... | 63 |
| 10 | ch10_Miscellaneous_and_Embryology.json | Miscellaneous and Embryology | 55 |
| | | **TOTAL** | **2,193** |

TIP: Start with Chapter 10 (55 questions) or Chapter 9 (63 questions) to verify the workflow first.
WARNING: Chapters 3 (504) and 1 (387) are large — consider splitting them in half if Opus hits context limits.
