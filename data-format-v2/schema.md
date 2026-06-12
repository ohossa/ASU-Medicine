# MEDARK Question Bank Format v2

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

## Subject

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | `SubjectColor` | Yes | Must be one of `anatomy`, `histology`, `physiology`, `biochem`, `microbiology`, `pathology`, `pharma`, `clinical`. This is the source for `subjectColor`. |
| `name` | `string` | Yes | Display name. |
| `iconName` | `string` | Yes | Lucide icon component name used by the UI. |
| `lectures` | `string` | Yes | Human-readable lecture labels. |
| `lectureCount` | `number` | Yes | Non-negative integer count. |
| `questions` | `Question[]` | Yes | Questions for this subject. Use `[]` when none exist yet. |

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

Case sub-question types can be `mcq` or `essay` only. Each sub-question has:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Unique within the parent case, commonly `{parentId}-SQ1`. |
| `type` | `mcq | essay` | Yes | Only these two values. |
| `text` | `string` | Yes | Sub-question prompt. |
| `options` | `string[]` | Required for `mcq` | MCQ answer options. |
| `correctIndex` | `number` | Required for `mcq` | 0-indexed answer. |
| `modelAnswer` | `string` | Required for `essay` | Essay answer. |
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
- Every subject `id` is one of the eight canonical subject IDs.
- Every top-level question has `lecture` as an integer.
- Every top-level question has `explanation`.
- MCQ and true/false questions use numeric `correctIndex` only.
- Matching questions use `pairs` only.
- Essay questions always include `modelAnswer`.
- Case sub-questions are only `mcq` or `essay`.
- Fillblank questions include ordered `blanks`.
- No duplicate top-level question IDs exist in the file.
