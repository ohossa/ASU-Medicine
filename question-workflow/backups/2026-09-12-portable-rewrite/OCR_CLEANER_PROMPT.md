# ASU PDF/OCR Medical Text Cleaner — Faithful Extraction Stage

Updated 12 September 2026. Use this stage under `CONVERSION_PROMPTS_MASTER.md`, which defines the full page-reading → Pulse QC → classification → website-import workflow. This replaces the older cleaner's destructive filtering rules. The original is preserved in `question-workflow/backups/2026-09-12/`.

## Mission and source scope

Read and preserve every page and every identifiable item from the PDF(s) the user designates. Produce source-traceable normalized question blocks without fabricating, generating, medically repairing, classifying beyond the evidence, or discarding content. Question extraction, medical review and final JSON conversion are separate stages.

If supplied a PDF, render/screenshot **every physical page** and **actually open and visually read each page image** at readable resolution. OCR/embedded text assists transcription but is not a substitute for visual reading. Do not use spot checks or contact sheets as proof of individual page inspection. Inspect all columns, small print, figures, tables and answer-key grids; zoom/crop or re-render as needed. Retain page images and per-page text with a page ledger. Mark unreadable/blocked pages honestly and continue independent readable pages. Do not claim completion until every page 1..N is accounted for and all pending pages resolved.

If supplied only pasted OCR with no page images, clean what is supported and label `visual_verification: unavailable`; do not claim the source PDF was read. The unavailable evidence is a review limitation, not permission to reconstruct missing content by guessing.

## 1. Preserve source text before cleaning

Save full page-by-page transcription with 1-based physical PDF page, printed page label, document ID and filename. Include readable headings, instructions, options, answers, explanations, captions, figure labels, tables, footnotes, contents and other source text. Record blank pages as visually confirmed blank. Retain image/crop references for content that cannot be faithfully expressed as text.

Create a separate normalized question view. Page numbers/running headers/watermarks can be omitted from question text **only after their information is preserved in the source transcript/metadata**. Keep section headings that establish numbering scope, chapter or subject. Preserve instructions that change a question's meaning. Never remove a table, caption or shared case context needed to answer a question.

Register each source occurrence with a stable internal ID, its original number and section, pages spanned, and source location. Do not use a bare printed question number as a globally unique ID. Record origin/exam year only when explicitly supplied; otherwise use unknown.

## 2. Question boundaries and page continuations

Identify stems/options/answers and their boundaries from visual layout as well as text. Read all pages before finalizing unresolved answers and continuations. Carry stems, options, cases, tables and explanations across pages only when the evidence supports that connection. Do not cut off a question at a page break or attach the next column to the wrong question.

Preserve shared case text and each subquestion. If a required case subquestion is unreadable, retain it and flag the **whole case** for export review; do not delete the child and present a shortened case as complete.

## 3. OCR corrections

- Repair line wrapping and obvious word-splitting only after checking the page. Never join across option/question boundaries.
- Recover option boundaries from printed labels, indentation or unambiguous visual layout. If only raw OCR exists and boundaries are ambiguous, flag them. Do not assign A/B/C simply because three phrases look plausible.
- Normalize option labels in the cleaned view while preserving original order and their raw-label mapping. Do not change option wording, add missing options, rebalance answer letters or shuffle source questions.
- Check NOT/EXCEPT, decimal points, signs, dosages, units, gene/drug/anatomical names, formulas and subscripts carefully against the image. A plausible medical word is not enough evidence to replace a garbled one.
- Record each meaningful correction: original span, corrected span, page/region, and visual basis. Keep both raw and cleaned text.
- Preserve original language. Translation, if requested, is a separate version with its own verification.

## 4. Answer extraction and reconciliation

Read every supplied answer-key page, including end-of-file keys. Store raw key entries with page/cell references. Join using document + section/chapter + original question number and any numbering-reset information. Do not zip question order to key order or carry a prior chapter's key across a numbering reset.

Extract provided answers from explicit inline labels, verified marking conventions or separate keys. Bold/underline/highlight is not automatically an answer marker. Record ambiguous or conflicting marks rather than choosing one. Preserve exact answer text, normalized letter and source evidence separately.

For MCQs, check the selected letter corresponds to an existing option. For true/false, preserve raw True/False or marks in the source record, and normalize the clean block to A=True/B=False with `OPTIONS: A) True, B) False`. Leave missing answers as `N/A`; determining one from teaching material belongs to review, not transcription. Missing explanations/model answers/key concepts are `N/A` only when genuinely absent. **Preserve provided explanatory text and answers; never overwrite them wholesale with N/A.**

For essays preserve all model-answer paragraphs and lists. For blanks preserve slot order, answers and supplied alternatives. For matching preserve both columns, labels, distractor choices and key associations in the raw record; only form pairs when their mapping is supported. Flag any format whose meaning would be lost by reducing it to pairs.

## 5. Images, SATA and duplicates

**Visual-dependent questions:** Transcribe the question, labels and related captions; retain the required image/crop and its page association. Do not delete a question merely because it references a figure. If the visual is missing/unreadable, flag that. If readable but website support is not verified, mark it for media/export review; do not replace it with an invented description or mark it import-ready.

**SATA:** Preserve all text and marked choices. The website currently expects one best answer for MCQs, so true multiple-selection items are flagged for format review, not silently converted. A combined-response option such as “I and II only,” “A and C,” “All of the above,” or “None of the above” is still a single selectable option when that is how the source is written. Do not label it SATA solely for that wording, and do not rewrite it to satisfy new-generation style rules.

**Duplicates:** Keep every occurrence and record `possible_duplicate_of`. Do not discard repeated questions, identical keys or duplicate printed numbers. Curation happens later with complete provenance; even an exact duplicate can carry a distinct source/year or conflicting answer.

## 6. Normalized block format

One block per top-level question, plus a record for every unresolved occurrence. Internal IDs and provenance live here/sidecars and are omitted from the website's incoming question objects. Use only applicable type-specific fields; do not add MCQ fields to essays.

```text
---
INTERNAL_ID: <stable occurrence ID>
DOCUMENT_ID: <registered document>
SOURCE_FILE: <filename>
PDF_PAGES: <1-based physical page(s)>
PRINTED_PAGE_LABELS: <labels, if present>
ORIGINAL_SECTION: <source heading>
ORIGINAL_NUMBER: <printed number, or unnumbered>
VISUAL_VERIFICATION: <read / blocked / unavailable>
QUESTION_TYPE: <mcq / truefalse / essay / fillblank / matching / case / unresolved>
SUBJECT: <source-supported heading or UNKNOWN>
CHAPTER: <original book chapter heading or UNKNOWN>
LECTURE: <source label if present, otherwise UNKNOWN>

TEXT:
<complete cleaned stem or case context>

OPTIONS:
A) <original option A>
B) <original option B>
<continue only for actual options; retain original count/order>
ANSWER: <letter, or N/A>
RAW_ANSWER: <exact source answer/mark, or N/A>
ANSWER_SOURCE: <file, section, page/cell or inline location>

MODEL_ANSWER:
<provided essay answer, or N/A>

BLANKS:
1) <provided answer for slot 1>
ACCEPTED_ANSWERS:
<provided alternatives by slot, or N/A>

PAIRS:
1) <premise> = <source-supported target>

SUB_QUESTIONS:
1) [TYPE: mcq/essay/fillblank/unresolved] <full text>
   [OPTIONS / ANSWER / MODEL_ANSWER / BLANKS as applicable]
   [SOURCE LOCATION and supplied explanation if any]

EXPLANATION:
<provided explanation, or N/A>
KEY_CONCEPT:
<provided key concept, or N/A>
MEDIA_REFERENCES:
<associated page/crop and labels, or none>
FLAGS:
<specific unresolved issues, or none>
---
```

The original book heading and lecture label are provenance, not necessarily the website chapter/lecture index. The later verified crosswalk supplies canonical destinations. Never invent those destinations at extraction time from incidental keywords.

## 7. Review records and accounting

After the blocks, provide a separate review list keyed by internal ID with reason, affected field, source pages/region, preserved raw text, and action needed. Distinguish unreadable content, missing/conflicting answers, media requirements, unsupported formats, unresolved metadata and possible duplicates. Do not treat a tentative reading as accepted text.

Persist a page ledger and item registry so long jobs can resume. Per-page records state read/pending/blocked, content type, item IDs and continuations. Check that every physical page is listed exactly once, every identifiable item is registered, all key entries are matched or explicitly unresolved, and each source occurrence has a recorded downstream disposition. Count top-level cases separately from their children. Preserve unnumbered questions as well as numbered questions.

“Every page read” is different from “every question correct.” Report source-reading completeness and medical-review status separately. Do not claim all questions were extracted if unresolved regions might contain additional questions.

## 8. Handoff

Output clean blocks, review records and page/item accounting as separate artifacts. When chat-only, output blocks followed by the review/accounting sections without presenting them as import JSON. Save all provenance, page images and raw text outside `_ready` folders. Resume from pending pages if the job exceeds one processing batch.

Next stages: source-grounded independent QC → frozen taxonomy classification → verified website crosswalk → `CONVERSION_PROMPTS_MASTER.md` Sections 0–12 JSON conversion → strict import preview and validation. This cleaner never performs an import or deployment.
