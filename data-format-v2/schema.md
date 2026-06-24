# ASU Portal Question Bank Format v2

Canonical module files live at `src/imports/year-{year}/semester-{semester}/{moduleCode}.json`, for example `src/imports/year-2/semester-2/MEM-2.json`.

Each file contains one complete module question bank across all supported question modes. The format supports years 1 through 5, semesters 1 through 2, any number of chapters, and any number of subjects per chapter.

## Root object

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `schemaVersion` | `1` | Yes | Must be exactly `1`. Parsers should warn when the value differs. |
| `meta` | `ModuleMeta` | Yes | Describes the module independently of its path. |
| `chapters` | `Chapter[]` | Yes | Present even for inactive modules. Use an empty array only when the module has no chapter outline; otherwise use chapters with empty `subjects` arrays. |

`totalQuestions` is intentionally absent and must be computed at parse time by summing all top-level questions across all subjects. Case sub-questions do not increase the top-level question count.

## ModuleMeta

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `moduleCode` | `string` | Yes | Stable syllabus code, such as `MEM-2`. |
| `moduleName` | `string` | Yes | Human-readable module name. |
| `year` | `1 | 2 | 3 | 4 | 5` | Yes | Medical program year. |
| `semester` | `1 | 2` | Yes | Semester within the year. |
| `creditPoints` | `number` | Yes | Positive module credit points. |
| `totalMarks` | `number` | Yes | Positive integer module marks. |
| `keywords` | `string[]` | Yes | Search and module matching keywords. |

## Chapter

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | `number` | Yes | 1-based, sequential within the module. |
| `title` | `string` | Yes | Main chapter title. |
| `subtitle` | `string` | Yes | Secondary chapter description. |
| `emoji` | `string` | Yes | Display emoji. |
| `page` | `number` | Yes | 1-based page reference. |
| `lectureRange` | `string` | Yes | Human-readable lecture range. |
| `subjects` | `Subject[]` | Yes | Present for every chapter. Use `[]` for locked or inactive chapters. |
| `keywords` | `string[]` | Optional | Keyword list for keyword-based chapter fallback routing. When smart routing and content routing both fail, the importer matches question text against these keywords to resolve the target chapter. |

## Subject

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | `SubjectColor` | Yes | Must be one of `anatomy`, `histology`, `physiology`, `biochem`, `microbiology`, `pathology`, `pharma`, `clinical`, `parasitology`, `psychiatry`, `ophthalmology`, `ent`. This is the source for `subjectColor`. |
| `name` | `string` | Yes | Display name. |
| `iconName` | `string` | Yes | Lucide icon component name used by the UI. |
| `lectures` | `string` | Yes | Human-readable lecture labels. |
| `lectureCount` | `number` | Yes | Non-negative integer count. |
| `lectureNames` | `string[]` | Yes | List of official lecture names in syllabus/textbook order. Used for smart auto-routing. |
| `questions` | `Question[]` | Yes | Questions for this subject. Use `[]` when none exist yet. |

### Smart Routing with `lectureNames`

The `lectureNames` array serves as the module's official syllabus index. When importing questions, the system automatically checks if the incoming question's `topic` (or `subject` or `chapterTitle`) matches any of the entries in `lectureNames` (performing case-insensitive exact and substring matches, guarded against generic subject titles). If a match is found, the question is routed directly to that chapter and subject, and its `lecture` number is automatically set to the 1-based index of the matching lecture in `lectureNames`. If no match is found, the system falls back to content-based routing.

> [!NOTE]
> **Explicit Subject Constraint**: Both smart routing and content-based routing respect the incoming question's explicit `subject` field, if specified. If a subject is provided (e.g., "Anatomy"), the routing logic will only match against `lectureNames` under subjects matching that specific subject ID, preventing cross-subject misrouting (such as routing an anatomy question to a physiology lecture of the same name).

**Content-Based Routing Fallback**: When `resolveSmartRouting` fails (no `topic`/`subject`/`chapterTitle` metadata matched any lecture name), the importer scans the question text itself against all `lectureNames` in the bank. It tokenizes the question text and each lecture name into significant words (length > 2, excluding generic terms like "anatomy", "physiology", etc.), then scores each lecture by counting how many of its significant words appear in the question. A match requires ≥50% of the lecture's significant words to be found AND at least 2 hits (or 1 hit if the lecture name has only 1 significant word that is ≥6 characters long). The highest-scoring lecture wins. If content-based routing also fails, the importer falls back to `resolveChapter` + `inferSubject`, and finally marks the question as `needsReview`.

The full routing fallback chain is: `resolveSmartRouting` → `resolveContentRouting` → `resolveChapter` + `inferSubject` → `needsReview`.


## Question ID format

Every top-level question ID must be globally unique in its module file and follow:

```text
{MODULECODE_NO_HYPHEN}-CH{chapterId}-{SUBJECTKEY}-{sequence4Digits}
```

Example: `MEM2-CH1-ANAT-0001`.

`SUBJECTKEY` values are:

| Subject ID | Subject key |
| --- | --- |
| `anatomy` | `ANAT` |
| `histology` | `HIST` |
| `physiology` | `PHYS` |
| `biochem` | `BIOC` |
| `microbiology` | `MICR` |
| `pathology` | `PATH` |
| `pharma` | `PHAR` |
| `clinical` | `CLIN` |
| `parasitology` | `PARA` |
| `psychiatry` | `PSYC` |
| `ophthalmology` | `OPHT` |
| `ent` | `ENT` |

Question IDs must not duplicate within a file. A validator must reject duplicates.

## Shared Question fields

All top-level question objects include these fields:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Globally unique canonical ID. |
| `type` | `mcq | truefalse | matching | essay | case | fillblank` | Yes | Exactly one of the six canonical values. |
| `lecture` | `number` | Yes | Integer lecture number. |
| `text` | `string` | Yes | The question prompt. |
| `explanation` | `string` | Yes | Always present. Use a concise rationale when no extended explanation exists. |
| `keyConcept` | `string` | Optional | High-yield learning point. |
| `repetitionCount` | `number` | Optional | Auto-managed by the importer. Tracks how many times a question has been seen across batches. When a duplicate is detected during import, the existing question's `repetitionCount` is incremented automatically. Do not set manually. |

## MCQ question

Required fields: `options`, `correctIndex`.

`correctIndex` is a 0-indexed integer. A=0, B=1, C=2, D=3. Letter strings are never stored in canonical data.

Optional fields: `modelAnswer`, `keyConcept`.

## True/False question

Required fields: `options`, `correctIndex`.

Use `options: ["True", "False"]` unless the question wording requires more specific labels. `correctIndex` is 0-indexed.

## Matching question

Required field: `pairs`.

`pairs` is an array of `{ "premise": string, "target": string }` objects. Do not split premises and targets into separate arrays.

## Essay question

Required fields: `modelAnswer`, `explanation`.

`modelAnswer` is always a string and may be long. `keyConcept` is optional.

## Case question

Required field: `subQuestions`.

Case sub-question types can be `mcq`, `essay`, or `fillblank`. Each sub-question has:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Unique within the parent case, commonly `{parentId}-SQ1`. |
| `type` | `mcq | essay | fillblank` | Yes | Only these three values. |
| `text` | `string` | Yes | Sub-question prompt. |
| `options` | `string[]` | Required for `mcq` | MCQ answer options. |
| `correctIndex` | `number` | Required for `mcq` | 0-indexed answer. |
| `modelAnswer` | `string` | Required for `essay` | Essay answer. |
| `blanks` | `string[]` | Required for `fillblank` | Correct answers in order. |
| `acceptedAnswers` | `string[][]` | Optional | For `fillblank` sub-questions: each inner array holds accepted alternatives for the corresponding blank. |
| `explanation` | `string` | Yes | Always present. |
| `keyConcept` | `string` | Optional | High-yield learning point. |

## Fillblank question

Required fields: `blanks`.

`blanks` contains correct words in order. `acceptedAnswers` is optional and, when present, is an array of arrays where each inner array contains accepted alternatives for the corresponding blank slot.

## Validation checklist

A valid file satisfies all of the following:

- `schemaVersion` is exactly `1`.
- `meta.year` is between 1 and 5.
- `meta.semester` is 1 or 2.
- `chapters` is present.
- `chapter.id` values are 1-based and sequential within the module.
- Every subject `id` is one of the twelve canonical subject IDs.
- Every top-level question has `lecture` as an integer.
- Every top-level question has `explanation`.
- MCQ and true/false questions use numeric `correctIndex` only.
- Matching questions use `pairs` only.
- Essay questions always include `modelAnswer`.
- Case sub-questions are only `mcq`, `essay`, or `fillblank`.
- Fillblank questions include ordered `blanks`.
- No duplicate top-level question IDs exist in the file.
