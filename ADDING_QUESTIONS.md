# Adding New Question Databases to ASU Medical Portal

The ASU Medical Portal features a fully automated, dynamic architecture for importing question databases. **You do not need to write any code** to add new chapters, exams, or questions.

Simply drop a properly formatted `.json` file into the `src/imports/` directory, and the system will automatically detect, parse, and bind it to the correct university module!

## How It Works

1. **Auto-Detection**: The portal scans the `src/imports/` directory for any `.json` files.
2. **Module Binding**: The system looks at the **filename** and searches for module keywords. 
   - For example, a file named `endocrine_mcq.json` will automatically bind to the **Endocrine System & Metabolism (MEM-2)** module because "endocrine" is a registered keyword for that module.
   - Another example: `anatomy_upper_limb_mcq.json` will bind to **Introduction to Anatomy & Embryology (IAE-1)** because "anatomy" is a registered keyword.
3. **Mode Detection (MCQ vs Essay)**:
   - If your filename contains `mcq`, `practice`, or `exam`, it is registered as an **MCQ Practice** database.
   - If your filename contains `essay`, `written`, `short`, or `paper`, it is registered as an **Essay Study** database.
   - If no keywords exist in the filename, the script will scan the JSON fields to auto-detect its type.
   - If you upload both an MCQ JSON and an Essay JSON for the same module, the **Mixed Exam** mode is automatically unlocked for that module!

---

## JSON Format

The expected JSON schema is extremely simple and matches the format already being used. Here is a generic skeleton:

### MCQ JSON Skeleton

```json
{
  "chapterTitle": "Chapter 1: The Basics",
  "chapters": [
    {
      "chapterTitle": "Chapter 1",
      "topics": [
        {
          "topic": "Physiology",
          "questions": [
            {
              "id": 1,
              "type": "mcq",
              "text": "What is the powerhouse of the cell?",
              "options": [
                "A) Nucleus",
                "B) Mitochondria",
                "C) Ribosome",
                "D) Endoplasmic Reticulum"
              ],
              "correctAnswer": "B",
              "explanation": "Mitochondria produce ATP through cellular respiration.",
              "keyConcept": "Cellular Respiration"
            },
            {
              "id": 2,
              "type": "truefalse",
              "text": "The liver is the largest internal organ.",
              "options": ["True", "False"],
              "correctAnswer": "A",
              "explanation": "The skin is the largest organ overall, but the liver is the largest internal organ."
            }
          ]
        }
      ]
    }
  ]
}
```

### Essay JSON Skeleton

```json
{
  "chapterTitle": "Chapter 1: The Basics",
  "chapters": [
    {
      "chapterTitle": "Chapter 1",
      "topics": [
        {
          "topic": "Pathology",
          "questions": [
            {
              "id": 101,
              "type": "essay",
              "text": "Describe the pathophysiology of Type 2 Diabetes Mellitus.",
              "modelAnswer": "Type 2 DM is characterized by a combination of peripheral insulin resistance and inadequate insulin secretion by pancreatic beta cells.",
              "explanation": "Ensure students mention both insulin resistance and beta-cell dysfunction.",
              "keyConcept": "Insulin Resistance"
            }
          ]
        }
      ]
    }
  ]
}
```

## Tips for Organization

- While you can drop all JSON files directly into `src/imports/`, we recommend grouping them in subfolders by Year and Semester for your own sanity:
  - `src/imports/year-2/semester-2/endocrine_mcq.json`
  - `src/imports/year-2/semester-2/endocrine_essay.json`
- **Supported Question Types**:
  - `mcq`: Standard multiple choice (requires `options` and `correctAnswer`).
  - `truefalse`: True or False questions.
  - `essay`: Written response (requires `modelAnswer`).
  - `case`: Case studies with `subQuestions` arrays inside.
- **Auto-Coloring**: The `topic` string (e.g., "Physiology", "Anatomy", "Pharma") automatically sets the UI's accent colors and icons!

Once you add your JSON files, just run `npm run dev` and see your questions magically appear in the portal!
