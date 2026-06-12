# MEDARK Batch Import Workflow

This workflow solves the recurring update case: an existing module bank already has hundreds of mixed questions, then a new batch arrives and should be added with minimal manual work.

## Recommended folder layout

Place incoming batches in each module's organized intake folder:

```text
data-format-v2/question-intake/year-{N}/semester-{N}/{moduleCode} [{moduleName}]/_ready/{moduleCode}_batch_{YYYY-MM-DD}_{source}_{questionCount}.json
```

Example:

```text
data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_ready/MCNS-2_batch_2026-06-11_neuro-final-revision_200.json
```

Run:

```bash
npx tsx data-format-v2/scripts/import-batch.ts "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_ready/MCNS-2_batch_2026-06-11_neuro-final-revision_200.json" src/imports/year-2/semester-2/MCNS-2.json
```

The script appends questions to the canonical module file and writes a review report beside the incoming batch.

## Accepted incoming batch format

The batch can contain mixed question types. It does not need canonical IDs.

```json
{
  "moduleCode": "MCNS-2",
  "defaultChapterTitle": "Brain Stem",
  "questions": [
    {
      "chapterTitle": "Brain Stem",
      "subject": "Anatomy",
      "lecture": 4,
      "type": "mcq",
      "text": "Which cranial nerve exits from the pontomedullary junction?",
      "options": ["III", "V", "VI", "XI"],
      "correctAnswer": "C",
      "explanation": "The abducens nerve exits at the pontomedullary junction."
    }
  ]
}
```

## What the importer does automatically

- Finds the target module from the destination file.
- Routes each question to the correct chapter by `chapterId` or fuzzy `chapterTitle` match.
- Routes each question to the correct subject from `subject` or `topic`.
- Creates a missing subject inside an existing chapter when needed.
- Converts `correctAnswer` letters to 0-indexed `correctIndex`.
- Generates canonical IDs using the next available sequence:
  - `MCNS2-CH3-ANAT-0501`
  - `MCNS2-CH3-MICR-0001`
- Preserves all six question types: `mcq`, `truefalse`, `matching`, `essay`, `case`, `fillblank`.
- Deduplicates by normalized question text and options.
- Skips exact duplicates and reports them.
- Writes a JSON report with added, skipped, and review-needed items.

## Review-needed cases

The script does not guess dangerously. It marks a question for review when:

- No chapter can be matched.
- No subject can be inferred.
- MCQ/truefalse options are missing.
- `correctAnswer` is invalid for the option count.
- Essay `modelAnswer` is missing.
- Fillblank `blanks` are missing.

## Best practice for zero-hassle imports

For every new batch, ask the AI that generates it to include these fields per question:

- `chapterTitle` or `chapterId`
- `subject`
- `lecture`
- `type`
- `text`
- Type-specific answer fields
- `explanation`
- `keyConcept` when available

With those fields, imports should be nearly automatic.
