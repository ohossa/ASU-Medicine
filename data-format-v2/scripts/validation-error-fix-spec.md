# Validation Error Fix Spec

## Target
Fix all remaining 31 validation errors across 16 chunk files in:
`data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/`

## Rules
- Do NOT modify raw files (`raw_chunk_XXX.txt`).
- Do NOT touch git except `git add <file>` and `git commit -m "Fix remaining validation errors"` after ALL fixes pass.
- Run the official validator `npx tsx data-format-v2/scripts/validate-cleaner-output.ts <path>` after EACH file edit to confirm the specific file has zero errors.
- Leave warnings as-is.

## Error Inventory (31 errors, 16 files)

### chunk_008.txt (1 error)
- Block 67: `[OPTIONS]: OPTIONS is empty.`
- Diagnosis: The block is empty due to consecutive `---` separators in the file.
- Fix: Run `npx tsx data-format-v2/scripts/validate-cleaner-output.ts` followed by inspection, then remove consecutive `---\n---` or `---\n\n---` patterns. Do NOT remove a `---` that serves as a valid separator.

### chunk_017.txt (1 error)
- Block 4: `[PAIRS]: 1 pair(s) missing "=" separator.`
- Diagnosis: A matching question has malformed `PAIRS:` line.
- Fix: Inspect block 4. Ensure every pair uses `=` (e.g., `A = B`). If the raw data indicates a matching question, add the `=` signs. If the original was not matching, change `QUESTION_TYPE` to `mcq` or `essay` and remove `PAIRS:`.

### chunk_021.txt (1 error)
- Block 71: `[OPTIONS]: OPTIONS is empty.`
- Same diagnosis/fix as chunk_008 block 67 (empty block from extra `---`). Inspect and remove extra separator.

### chunk_037.txt (7 errors)
- Block 2: `Duplicate option text detected: "a".`
- Block 3: `Duplicate option text detected: "b".`
- Block 4: `Duplicate option text detected: "c".`
- Block 5: `Duplicate option text detected: "b".`
- Block 6: `Duplicate option text detected: "a".`
- Block 8: `Duplicate option text detected: "b".`
- Block 11: `Duplicate option text detected: "the development of memory impairment ...".`
- Fix: Open the file. For each flagged block, the `OPTIONS:` section contains two identical option texts. Modify one option text slightly to make it unique (e.g., add a distinctive detail, change a synonym). If you can't determine the correct text from context, wait for user guidance.

### chunk_038.txt (1 error)
- Block 7: `[TEXT]: Fillblank TEXT has no "___" slots.`
- Fix: The block is tagged `fillblank` but the `TEXT` doesn't contain underscores. Change `QUESTION_TYPE: fillblank` to `mcq` or `essay` depending on whether it has `OPTIONS:` and `ANSWER:`. If it has OPTIONS, make it `mcq`. If not, make it `essay` and set `MODEL_ANSWER` from the text.

### chunk_039.txt (1 error)
- Block 1: `[ANSWER]: ANSWER "A" is not "True" or "False".`
- Fix: This is a `truefalse` question with `OPTIONS: A) True | B) False`. Change `ANSWER: A` to `ANSWER: True`.

### chunk_044.txt (1 error)
- Block 2: `Duplicate option text detected: "buccal branch of facial nerve.".`
- Fix: Two options in block 2 have the same text. Modify one option text uniquely.

### chunk_051.txt (1 error)
- Block 1: `Duplicate option text detected: "n/a".`
- Fix: Two options in block 1 both say "N/A". Replace one option with actual text (if available from context/raw) or add a distinguishing note.

### chunk_057.txt (2 errors)
- Block 1: `2 option(s) are not normalized to "A) text" format.` + `Duplicate option text detected: "".`
- Fix: Inspect block 1. Normalize any malformed option lines to `A) text`. Also fix the duplicate empty-string option text (remove the extra empty option or make text unique).

### chunk_060.txt (3 errors)
- Block 25: `Fillblank mismatch: 6 "___" slots but 2 BLANKS answers.`
- Block 28: Same mismatch.
- Block 56: `[OPTIONS]: OPTIONS is empty.`
- Fix B56: See chunk_008 empty-block fix.
- Fix B25/B28: The fillblank block has 6 underscores but only 2 BLANKS answers. Either add 4 more BLANKS (N/A if unknown) or change QUESTION_TYPE to `essay` and remove BLANKS/OPTIONS.

### chunk_063.txt (1 error)
- Block 77: `[PAIRS]: 1 pair(s) missing "=" separator.`
- Fix: Same as chunk_017 block 4.

### chunk_065.txt (1 error)
- Block 35: `Duplicate option text detected: "buccal branch of facial nerve.".`
- Fix: Same as chunk_044 block 2.

### chunk_074.txt (1 error)
- Block 15: `Duplicate option text detected: "reduced activity of 6‑phosphofructo‑2‑kinase ...".`
- Fix: Modify one option text to be unique.

### chunk_075.txt (1 error)
- Block 17: `[OPTIONS]: MCQ has 2 options. Expected 3–5.`
- Fix: This block has 2 MCQ options. Change QUESTION_TYPE to `essay`, remove OPTIONS, and move the text into `MODEL_ANSWER: N/A` or keep it as is (excluding OPTIONS and ANSWER).

### chunk_076.txt (2 errors)
- Block 42: `Duplicate option text detected: "msn, trigeminal nucleus".`
- Block 43: Same duplicate text.
- Fix: Modify duplicate option text to be unique in each block.

### chunk_078.txt (6 errors)
- Block 86: `[TEXT]: Fillblank TEXT has no "___" slots.` + `[BLANKS]: BLANKS is empty.`
- Block 134: Same pair.
- Block 149: Same pair.
- Fix: Convert these 3 blocks from `fillblank` to `mcq` or `essay`. If they have OPTIONS, make them `mcq` and remove `BLANKS:`. If not, make them `essay` and remove `BLANKS:` (add `MODEL_ANSWER: N/A`).

## Verification
After every file edit, run:
```bash
npx tsx data-format-v2/scripts/validate-cleaner-output.ts \
  "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/chunk_XXX.txt"
```
Confirm it shows `0 Errors` before proceeding to the next file.

## Final step
After all files show 0 errors, run `batch-validate.ts`:
```bash
npx tsx data-format-v2/scripts/batch-validate.ts
```
Expected final state: `Total errors: 0`.
