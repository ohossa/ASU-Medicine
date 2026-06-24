# ASU Portal Batch Import Workflow

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

### Bulk Import Pipeline (`import-ready.ts`)

Instead of importing individual files one by one, you can run the bulk importer to automatically process all pending batches in all module `_ready` folders:

```bash
npx tsx data-format-v2/scripts/import-ready.ts [flags]
```

**Supported Flags:**
- `--dry-run`: Runs the full pipeline, validation, and reports without writing any changes to the canonical JSON files.
- `--strict`: Fails the run and rolls back if any imported files fail schema or data validation.
- `--move-rejected`: Automatically moves files that failed parsing or routing validation from `_ready/` to a sibling `_rejected/` directory for manual troubleshooting.

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

- **Smart Auto-Routing**: If the target module JSON file includes a `lectureNames` array under its subjects (e.g. `MSS-2.json` for Special Senses), the importer automatically matches the incoming question's `topic` field against it (exact match first, then substring match). It places the question in the correct chapter and subject, and assigns the correct 1-based lecture number.
  - *Note: If an explicit `subject` is specified in the question, routing logic restricts the search to that subject ID to avoid cross-subject misrouting.*
- **Content-Based Routing Fallback**: If the `topic` is missing or doesn't match, the importer scans the question text itself against all `lectureNames`. It tokenizes the question, scores each lecture by significant word matches, and requires ≥50% match with ≥2 hits (or 1 hit for single-word lecture names ≥6 characters).
  - *Note: Like smart routing, content routing respects the explicit `subject` constraint if provided.*
- **Chapter & Subject Fallback**: If content-based routing fails, the system falls back to matching by explicit `chapterId` or fuzzy `chapterTitle`, then infers the subject (e.g. from the `subject` field, falling back to chapter keywords matching).
- **Review Needed**: If all of the above fail, the question is routed to a `needsReview` queue in the import report and is not imported.

**Full Routing Chain:** `resolveSmartRouting` → `resolveContentRouting` → `resolveChapter` + `inferSubject` → `needsReview`
- Finds the target module from the destination file.
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
