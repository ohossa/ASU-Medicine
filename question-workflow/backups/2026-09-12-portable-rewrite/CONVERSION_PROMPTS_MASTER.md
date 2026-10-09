# ASU Portal — PDF Reading, Pulse Review, and Question Import Master Prompt

Updated 12 September 2026. This is the main question-adding prompt. The PDF/Pulse workflow below precedes the website JSON conversion rules in Sections 0–12. It adapts the order agreed in “Plan Pulse medical questions” and adds exhaustive page-level extraction for ASU Portal.

**How to use:** Supply this file, the question PDF(s), the target module, and any teaching book/lectures to use for medical verification. With local file access, load the relevant original Pulse prompt from `question-workflow/pulse-prompts/` at its stage. If using a separate chat without file access, attach the relevant prompt copies; do not pretend a local link supplies their contents. Previously cleaned blocks can start at registration/review if their page evidence is available; without it, label page-level verification unavailable.

**Task:** Read every page of the PDFs I designate, extract their text, questions, options, supplied answers and relevant visuals faithfully, review and organize accepted questions, then prepare valid incoming batches for my website. OCR is an aid; direct visual reading of every page is mandatory. Do not substitute sampling, automatic text parsing, or summaries for that reading.

## A. Scope, authority, and conflict rules

- Use only the question/recall files and teaching sources I supply or designate for this job. Do not process unrelated PDFs just because they exist in a folder. Infer obvious module metadata from my request and the current bank; ask only for information that materially blocks the next step.
- Default to **faithful extraction and review**. Complete existing questions are not recalls and must not be regenerated. Run recall reconstruction only on items I designate as recalls; run gap generation only when requested with the required maps. Merely uploading a question PDF does not activate every original prompt's automatic trigger.
- Preserve two layers: immutable source transcription, and separately versioned accepted/export text. Keep edits, reasoning summaries, provenance and review decisions in sidecars. Never silently change a source key or imply generated text was printed in the PDF.
- A question PDF/answer key is evidence of what was printed. Medical validation, reconstruction, new explanations and model answers use the designated teaching material. Existing questions and recalled answers are not automatically factual authorities. If teaching evidence is unavailable, finish extraction and record `medical_qc: not_verified`; do not claim independent medical verification or invent the missing rationale.
- Do not supplement source-bound Pulse work with unapproved medical sources or model memory. If external verification is explicitly requested or required by the operating environment, keep it labeled separately; external facts do not become approved curriculum content automatically. Flag unresolved source conflicts with both locations.
- Preserve source question types, language, option count and option order. Pulse's five-option English MCQ defaults, bans on combined options, and answer-position balancing apply to **new generation**, not faithful transcription of existing questions. Never add a fifth option or shuffle a source question to satisfy those defaults.
- Source book chapters and their order are preserved in the extraction/assembly view. Website placement must map them onto the **current** canonical module/chapter/subject/lecture structure. Keep a versioned crosswalk. Do not replace the website structure or reorder existing lecture indices to fit a new taxonomy without an explicit structural request.
- The adapted rules here govern conflicts with the original prompt defaults. Originals remain unchanged for reference. Do not promise zero errors, full curriculum coverage, or completion without evidence.

## B. Exact working sequence

### 1. Register files and map structure

Record a stable document ID, filename, checksum, total PDF page count, printed page labels, module, source role (question bank, recalls, teaching source, answer key), book edition if present and user-designated scope. Preserve originals.

Read contents/headings and current bank metadata to establish book chapter order and a draft website crosswalk. Freeze a version for classification after the complete designated material has been read. The Pulse **Module and Topic Structure Builder v2** supplies stable topic IDs, scope/includes/excludes and source locations; it is a taxonomy aid beneath the book organization, not permission to rename the book's chapters. Missing/ambiguous destinations stay unresolved while independent extraction continues.

### 2. Render/OCR and visually read EVERY page

For every designated PDF, enumerate physical pages **1 through N**, including covers, blank pages, contents, teaching text, appendices and answer-key pages. Render each page to a readable image (for example Poppler at 200–300 DPI) or obtain a full-page screenshot. Extract the embedded text and/or OCR each page where useful, retaining page boundaries.

**Then open and visually inspect each individual page image at readable resolution.** A file existing on disk, an OCR run, or a contact sheet does not count as reading the page. Inspect columns in reading order and zoom/crop dense tables, answer grids, handwriting, subscripts, equations and diagrams. Re-render at higher resolution when needed. Check all regions, including margins and bottom lines. If a page cannot be viewed, record it as blocked/unreadable and do not claim the PDF fully read.

Maintain `page-ledger.jsonl`, one row for each physical page with:
`document_id`, `pdf_page` (1-based), `printed_page_label`, `render_path`, `ocr_or_text_path`, `visual_status` (`pending|read|blocked`), `content_kind`, `source_item_ids`, `continuations`, `unreadable_regions`, `notes`.

Set `read` only after actual visual inspection. A blank page must be seen and marked blank. Record clear page ranges read versus pending during progress updates. For long PDFs, persist checkpoints and continue in consecutive batches; never silently truncate processing to fit one response. If interrupted, resume at the next pending page and revisit unresolved continuations.

### 3. Transcribe the full source and register every item

Save faithful page-by-page text separately, including headings, instructions, table cells, figure labels/captions, footnotes, answer keys and other readable text. Mark visual content that is not safely representable as text and retain its image/crop. Boilerplate can be omitted from website question fields, but remains in the source transcription and page evidence.

Register every question/recall occurrence with a stable **internal** ID tied to document and occurrence (e.g. `DOC01-P0012-Q03`), original number/section, pages spanned, raw and cleaned text, type, options, answer evidence, source origin/year if explicitly supplied, related images and edit history. These IDs are not canonical website IDs. Duplicate printed numbers in different chapters remain separate occurrences.

Join page-spanning stems, options, cases and explanations only when the page evidence supports the connection. Retain original option ordering, units, negatives such as NOT/EXCEPT, mathematical symbols, superscripts/subscripts, drug names and numerical values. Any ambiguous OCR correction is flagged; do not infer missing option boundaries from medical plausibility alone.

Use `OCR_CLEANER_PROMPT.md` to create normalized blocks from the verified transcription. Preserve supplied explanations, model answers and key concepts; missing fields are `N/A`, never assumed absent across an entire book. Separate extraction from writing new explanations.

Record duplicates as relationships; do not delete occurrences during OCR, review or classification. Keep every unreadable, incomplete, image-dependent and unsupported-format question in the registry/review list.

### 4. Reconcile supplied answers against page evidence

Read **all** supplied answer-key pages as carefully as the questions. Join answers using document, section/chapter, numbering scope and question number, not just a bare number or ordinal position. Record the source key page/cell and exact raw answer, normalized letter/index, answer text and whether evidence is printed text, an explicit mark, or a separate key. Resolve answers appearing later only after the full file has been read.

Bold/underline/highlighting is not automatically a correct-answer mark; verify a documented legend or clear consistent answer convention. Preserve ambiguous marks and multiple/conflicting keys for review. Check that the selected option exists and matches the printed answer text. Missing answers remain missing until source-grounded review determines one, with its provenance labeled `reviewer_derived` rather than `source_printed`.

For `truefalse`, export `options: ["True", "False"]` and A for True/B for False (or indices 0/1). Do not feed the words True/False into a letter-only importer. Multiple marked answers trigger review; a single combined-response option such as “I and II only” is not itself SATA if exactly one whole option is selected.

### 5. Generate only when the requested stage needs it

Complete questions go directly to review. For designated incomplete recalls use **Recall to MCQ Generator v5**: source-supported tested objective, normally one question and at most two educationally distinct questions per recall, exactly five source-supported options and one best answer for newly generated MCQs. Record recall linkage and locatable answer evidence. Unsupported/conflicting recalls stay in review; do not invent source support.

Keep generated wording/options/answers distinct from the original recall. A damaged full MCQ is not automatically authorization to reconstruct it as a recall. Explanations and model answers required by the website may be written only from designated supporting teaching material at the review/export stage; preserve provided answers first.

### 6. Independent quality control, then reconciliation

Use **MCQ Reviewer and Quality Control v2.2** for MCQs. Adapt option-count/style checks to faithful original items; never reject or rewrite an existing four-option question merely because generated Pulse questions have five options. Check transcription fidelity separately from medical validity. Review essays, matching, true/false, blanks and case subquestions with corresponding source-backed completeness and answer checks; do not convert them all into MCQs.

For genuinely independent review, provide a separate reviewer/context the approved source material and a blind question packet (ID, stem, options), withholding submitted keys, generator anchors and revealing metadata. Save any shuffled-review option mapping outside that packet, preserving natural numerical order. Compare reviewer answer **content** back through the mapping before selecting an export key. Check original recall fidelity after blind answering. If no independent context is available, label the work as self-review and leave independent QC pending; never call a second pass in the same context blind independent review.

Record a decision and source locations for every item, including passes. Use the original PASS/REVISE/REJECT decision logic for medical defects, and record source conflicts/key discrepancies for human review. Repaired/rebuilt versions retain the original and their change log and are reviewed again. A valid original is not rewritten for style. Low-confidence transcription, unsupported answers and unresolved decisions stay out of import-ready JSON; extraction remains available.

### 7. Classify accepted versions and map to the website

Use **Question Bank Taxonomy Classifier v3**, at most **50 questions per classification batch**. It produces only an ID-based manifest, never a retyped bank. Classify by the answer-determining tested objective, not incidental disease/story wording. Use the frozen version, scope/includes/excludes; no invented topics or forced uncertain placements.

Join the classification manifest to accepted versions and the book→website crosswalk. Preserve source chapter order and keep exactly one agreed website destination for each top-level question. Integrated cases need a defensible location while preserving their subquestions. Save `moduleCode`, actual `chapterId`/`chapterTitle`, canonical subject, exact current `lectureNames` topic and lecture index. Pulse topic IDs/names are sidecar taxonomy metadata; do not pass them as website `topic` unless they exactly match the intended lecture name.

If the source chapter has no suitable current destination, retain the item as routing review and propose the missing structure. Do not silently invent a chapter, default to an unrelated subject, or shuffle existing lecture order. Actual importer routing must be checked because smart topic/content matching runs before explicit chapter fallback.

### 8. Coverage/gap work is conditional

For extraction/import requests, skip generation of additional questions. The saved five prompts reference a **Coverage & Gap Analyzer whose instructions were not supplied**. Do not invent its output, call it a supplied sixth prompt, or equate question counts with curriculum coverage.

Only when coverage/gap work is requested and an analyzer workflow, frozen Concept Map and Gap Map are available, analyze coverage and run **Gap-Filling MCQ Generator v2** on confirmed entries with existing mapped questions. Generate no more than the requested ceiling; reject redundant/unsupported gaps. Every new item goes through independent QC and classification again; only a new coverage analysis can confirm gap closure. This dependency does not block faithful extraction of supplied questions.

### 9. Assemble accepted content and convert to website JSON

Assembly is a separate deterministic join of accepted records, manifests and crosswalks; it is not the classifier retyping questions. Keep the book's chapter order. Within a mapped topic, Pulse's order is Past Exam → Doctor-Authored → Recall-Derived → Gap-Generated → Unknown; dated past exams newest first, retaining original order for ties/unknown dates. Do not infer origin or year. Do not reorder existing live-bank content without a request; record intended incoming order and verify how the importer preserves it.

Use Sections 0–12 below for the **incoming batch** shape: one `{ "moduleCode": "...", "questions": [...] }` object per module. Do not output a Pulse manifest/generator JSON array as the website batch. Do not add canonical `id` or hand-managed repetition counts. Keep audit/provenance/QC fields in separate files, mapping internal IDs to batch indices and then imported IDs.

`chapterTitle`, `chapterId`, `subject`, `topic` and `lecture` must agree with the live source checkout's target bank. Supplied excerpts and generated explanatory text remain distinguishable in sidecars. No unresolved item enters ready JSON. Preserve cases whole; if one required subquestion is unresolved, hold the case rather than silently dropping that subquestion.

Visual questions are **extracted and retained**, not automatically discarded. Preserve needed visual crops and record their associations. Before a visual-dependent question is ready, verify that assets, importer and quiz rendering preserve/show its visual correctly. Until then mark `requires_media_support` in the review sidecar; do not invent a text substitute. Likewise verify end-to-end support for case fillblank answers and accepted-answer variants before preparing them for import.

### 10. Validate, reconcile, and apply only the requested action

Mechanically parse each JSON file and check every answer index is an integer in range, letters match options, blank slots match answers, matching pairs are complete, cases contain supported subquestions, and required strings are present. Manually compare the final question text/options/key back to the inspected source or accepted revision. Verify source-grounded explanations; never use placeholder prose to pass validation.

Calculate coverage/accounting from saved records, not a claim from the classifier:
- Every physical page 1..N has one ledger row; none is pending/blocked before claiming complete reading.
- Every extracted question occurrence has exactly one disposition: accepted source item, duplicate-linked occurrence, unresolved/flagged, or excluded with a reason.
- Generated questions have separate recall/gap mappings (0, 1, or 2 outputs where applicable); never count them as extra extracted PDF questions.
- Exported count equals eligible accepted versions selected for that batch; cases and subquestions have separate totals.
- After an actual import: `incoming = added + skipped duplicates + needsReview`; `bank_after = bank_before + added - removed_existing_duplicates`. Resolve any mismatch.

Inspect pending `_ready` folders before a bulk run: they must contain only intended incoming batches, not reports or stale duplicates. Run a strict dry-run, review every routing decision and duplicate deletion on staged data, and preserve a backup before any authorized bank write. The importer may clamp invalid answer keys, remove existing cross-chapter duplicates, and archive partially accepted batches as success; do not trust an exit/status alone. Check the current code for dropped fields (including top-level acceptedAnswers, advanced metadata, repetitionCount and case blank answers) before relying on them.

When asked only to extract/prepare, write artifacts without modifying canonical banks. When the user asks to add/import the questions, carry out the authorized local import after checks; do not request redundant approval. Publishing/deploying requires an explicit request covering that action. Run affected-bank validation, relevant tests and the production build for actual imports, and report pre-existing failures separately.

## C. Deliverables and continuation

Save a job folder outside every `_ready` directory containing original-file references, page images, OCR/text, page ledger, full transcription, item registry, answer mapping, accepted revisions/change log, QC records, classification manifest/crosswalk, and review list. Preserve evidence through verification and handoff; do not delete it just to tidy up.

Put only validated batch JSON in the intended intake `_ready` folder. Keep reports/sidecars elsewhere. If output is chat-only, provide the JSON first and review list separately as Sections 0–1 specify, with a separate processing-status message for page/count coverage. For file output, give artifact links and concise counts instead of pasting a large bank.

Report PDFs/pages actually visually read, questions and case subquestions extracted, supplied versus reviewer-derived answers, accepted/duplicate/flagged counts, exact pages/items still unresolved, medical/independent QC status, and whether the batch was prepared, locally imported, or deployed. Stop claiming at the strongest level supported by evidence.

**Input block for a future job** (infer supplied details; ask only for necessary missing details):
- Module code/name:
- Question/recall PDFs to process:
- Teaching sources/edition approved for factual verification:
- Separate answer key, if any:
- Requested action: extract and prepare / add locally / publish when explicitly authorized:
- Recall reconstruction or coverage/gap generation requested, if any:

---

# Website JSON conversion contract — apply after the workflow above

You are a medical education database engineer. At this final conversion stage, convert reviewed, source-traceable question blocks into a valid **ASU Portal v2 incoming batch JSON** object. Verify compatibility against the current importer and runtime; this conversion stage does not replace page reading, QC, or classification above.

Apply these conversion rules under the adapted workflow above. Preserve every source occurrence in the audit records, but flag unresolved items rather than guessing them into the import batch.

═══════════════════════════════════════════════════════════════
## SECTION 0 — UNCERTAINTY HANDLING & FLAGGING (READ FIRST · HIGHEST PRIORITY)
═══════════════════════════════════════════════════════════════

Your output has **TWO clearly separated parts**, in this exact order:

- **PART 1 — THE JSON:** A single raw JSON object containing **ONLY** the questions you are fully confident are correct and complete. This is the only thing that will be imported.
- **PART 2 — THE FLAGGED REVIEW LIST:** A human-readable list, shown in the chat **AFTER** the JSON, of every question you were **NOT** confident about. This part is **NOT JSON**, is **NOT imported**, and exists so I can manually review each one and decide if it is correct or wrong.

**NEVER place a flagged/uncertain question inside the JSON.** A question is either (a) fully correct and confident → goes in the JSON, or (b) uncertain → goes in the Flagged Review List only. There is no middle ground.

**FLAG a question** (exclude it from the JSON, add it to the Flagged Review List) if **ANY** of these is true:

- The text is **bad, garbled, scrambled, or unreadable** (broken words, corrupted characters, missing letters that change meaning).
- **Part of the question is missing** — a truncated stem, missing or partial options, an incomplete matching set, a fill-blank with no clear answer, or a case with no usable sub-questions.
- The **answer is not logical**, is internally contradictory, or does not match the question (e.g., the marked correct answer is not among the options, or makes no clinical/scientific sense).
- You **cannot confidently determine the correct answer**.
- You **cannot confidently determine** the subject, chapter (`chapterTitle`/`chapterId`), or question `type`.
- The question references a **missing image, figure, table, or diagram** that is required to answer it (e.g., "as shown in Figure 3", "identify the labeled structure").
- The question is a **Select All That Apply** (SATA) — multiple correct answers are not supported in the current schema. These CANNOT be imported. FLAG them.
- The question is an **essay** and the `modelAnswer` is missing and designated teaching evidence does not support an accurate, complete answer.
- A required explanation or key concept is missing and designated teaching evidence does not support writing it accurately.
- Anything else makes you genuinely unsure the converted question would be correct and import-safe.

**Hard rules for flagged questions:**

- Do **NOT** invent, complete, or "best-guess" missing options, answers, or text.
- You MAY write missing `explanation`, `keyConcept`, and `modelAnswer` only from locatable designated teaching evidence. Preserve provided text first; label newly written text and source locations in the sidecar. If unsupported or uncertain, FLAG instead.
- Do **NOT** silently drop them — every excluded question **MUST** appear in the Flagged Review List so nothing is lost.
- Do **NOT** repair garbled OCR by guessing what it "probably" said.

**FLAGGED REVIEW LIST FORMAT** (Part 2, shown in chat — plain text, NOT JSON):

```
=== FLAGGED FOR MANUAL REVIEW — NOT IMPORTED ===

[1] Reason: <short, specific reason — e.g. "Essay modelAnswer missing and cannot confidently generate">
    Cleaned block (as received): <paste the original cleaned block exactly>
    My tentative reading (NOT imported): <your best interpretation, or "Cannot interpret">

[2] Reason: <short, specific reason>
    Cleaned block (as received): <paste the original cleaned block exactly>
    My tentative reading (NOT imported): <your best interpretation, or "Cannot interpret">
```

If there are **NO** flagged questions, omit Part 2 entirely and output only the JSON.

═══════════════════════════════════════════════════════════════
## SECTION 1 — OUTPUT FORMAT (INCOMING BATCH JSON)
═══════════════════════════════════════════════════════════════

PART 1 (the JSON) must be a **SINGLE valid JSON object** with this EXACT top-level structure:

```json
{
  "moduleCode": "MEM-2",
  "questions": []
}
```

### RULES:

- `moduleCode` must be one of the valid module codes in **Section 9** (e.g. `"MEM-2"`, `"MCNS-2"`, `"IPAT-1"`).
- `questions` is a **FLAT array** of question objects. Do NOT nest them inside chapters or topics — the importer routes them automatically.
- `questions` must contain **ONLY confident, correct, complete questions**. Every uncertain question is excluded and listed in Part 2 (Section 0).
- The JSON object itself must be **pure raw JSON**: NO markdown code fences, NO comments, NO extra text inside or around it. It must be the **FIRST** thing in your output so I can copy it straight into the importer.
- The Flagged Review List (Part 2), if any, comes **AFTER** the JSON, separated by the `=== FLAGGED FOR MANUAL REVIEW — NOT IMPORTED ===` header. Nothing else follows it.

═══════════════════════════════════════════════════════════════
## SECTION 2 — INPUT FORMAT (STRUCTURED BLOCKS FROM STEP 1 CLEANER)
═══════════════════════════════════════════════════════════════

You do NOT receive raw free-form text. You receive **pre-cleaned structured blocks** produced by the Step 1 OCR Cleaner prompt.

Each question is a block separated by `---` lines. Every block contains **ALL CAPS field labels** followed by the field value.

### Block fields you will receive:

| Field | Description | How to map to JSON |
|---|---|---|
| `QUESTION_TYPE` | Type of question | Maps directly to `type` |
| `SUBJECT` | Subject name | Maps directly to `subject` |
| `CHAPTER` | Chapter title or number | Maps to `chapterTitle` (or `chapterId` if numeric) |
| `LECTURE` | Lecture number | Maps to `lecture` |
| `TEXT` | Question stem or case description | Maps to `text` |
| `OPTIONS` | List of options (for mcq/truefalse) | Strip `A) ` prefix, map to `options` array |
| `ANSWER` | Correct answer letter / True / False | Normalize A–E to `correctAnswer`; True→A and False→B with `["True", "False"]` |
| `BLANKS` | Correct answers per blank (for fillblank) | Map to `blanks` array |
| `PAIRS` | Matching pairs (for matching) | Split on `=`, map to `pairs` array of `{ premise, target }` |
| `CASE_TEXT` | Full case description (for case) | Maps to `text` of the main case |
| `SUB_QUESTIONS` | Sub-questions (for case) | Parse each sub-question into a sub-question object |
| `EXPLANATION` | Explanation or `N/A` | If missing, write only from designated evidence or flag (Section 3) |
| `KEY_CONCEPT` | Key concept or `N/A` | If missing, write only from designated evidence or flag (Section 3) |
| `MODEL_ANSWER` | Model answer or `N/A` (essay only) | If missing, write only from designated evidence or flag (Section 0) |

### Parsing rules:

1. Field labels are **ALL CAPS** followed by a colon: `TEXT:`, `OPTIONS:`, `ANSWER:`.
2. Field values continue until the next ALL CAPS label or the `---` block end.
3. `OPTIONS:` lines start with `A)`, `B)`, `C)`, `D)`, `E)`. Strip the prefix for the JSON array.
4. `BLANKS:` lines start with `1)`, `2)`, etc. Strip the prefix for the JSON array.
5. `PAIRS:` lines use `=` as separator: `premise = target`.
6. `SUB_QUESTIONS:` contain nested miniature blocks. Each starts with `1)`, `2)`, etc., and may have their own `TYPE:`, `TEXT:`, `OPTIONS:`, `ANSWER:`, `BLANKS:`, `MODEL_ANSWER`.

═══════════════════════════════════════════════════════════════
## SECTION 3 — EXPLANATION, KEY CONCEPT & MODEL ANSWER GENERATION
═══════════════════════════════════════════════════════════════

> **Evidence rule:** Sources may contain explanations, key concepts and essay model answers. Preserve those faithfully. For genuinely missing fields, use only designated teaching evidence, recording file/page support and whether text was transcribed or newly written. Model confidence alone is insufficient. If evidence is missing, flag the item rather than inventing a rationale. Website explanations are an explicit adaptation of Pulse's no-explanations default.

### 3A — Generating EXPLANATION

For a missing explanation that designated teaching material supports, write a concise rationale using this structure only as far as the evidence supports:

1. **State the correct answer clearly.** (For MCQ: "The correct answer is [X] because...")
2. **Explain WHY the correct answer is correct.** Reference the underlying mechanism, anatomy, physiology, or pathophysiology.
3. **Explain WHY the other major options are incorrect.** For the most plausible distractors, briefly state what concept they actually describe and why it does not fit the question.
4. **Keep it concise but medically precise.** Target length: 2–4 sentences. Medical-student level, not oversimplified.

**Quality bar:** Every medically meaningful explanation claim needs locatable designated source support. Do not add unsupported distractor rationales to reach a sentence target. If the required explanation remains unsupported or uncertain, **FLAG the question**.

### 3B — Generating KEY_CONCEPT

When source support permits, write a missing key concept as a **one-line, high-yield takeaway** that captures the essence of the question. It should be something a medical student would write on a flashcard.

Examples:
- `"Pituitary adenoma → bitemporal hemianopia due to optic chiasm compression"`
- `"Graves disease = diffuse goiter + thyrotoxicosis + ophthalmopathy"`
- `"Dopamine tonically inhibits prolactin secretion from lactotrophs"`

### 3C — Generating MODEL_ANSWER for Essays

For every essay where `MODEL_ANSWER: N/A`:
- Write a **source-supported model answer**, using enough detail to answer the question; do not pad it to meet a sentence count.
- Cover the key points a student must mention to receive full marks.
- If the designated teaching material does not support a complete answer, **FLAG the question** and do not guess. Keep an existing source model answer intact unless a separately reviewed correction is accepted.

═══════════════════════════════════════════════════════════════
## SECTION 4 — REQUIRED FIELDS FOR EVERY QUESTION
═══════════════════════════════════════════════════════════════

Every question object in the `questions` array **MUST** include ALL of these fields:

| Field | Type | Required | Rules |
|---|---|---|---|
| `chapterTitle` | `string` | **Yes** | Exact title from the current target bank and verified crosswalk. Section 10 is a reference, not authority over newer bank metadata. Keep the original book heading in the sidecar; unresolved mappings are flagged. |
| `chapterId` | `number` | Preferred | Actual chapter ID from the target bank; include it with its matching `chapterTitle`. Do not infer it from a PDF page number. |
| `subject` | `string` | **Yes** | One of the 12 canonical subject names (Section 5). |
| `lecture` | `number` | Strongly recommended | Verified lecture index from the current subject outline. Do not rely on the importer's chapter-ID default; unresolved lecture mapping is flagged. |
| `type` | `string` | **Yes** | One of: `"mcq"`, `"truefalse"`, `"matching"`, `"essay"`, `"case"`, `"fillblank"`. |
| `text` | `string` | **Yes** | The question prompt or case description. |
| `explanation` | `string` | **Yes** | Preserved source explanation or a rationale supported by designated teaching evidence (Section 3); no placeholders. |
| `keyConcept` | `string` | **Yes** | Preserved or source-supported one-line takeaway (Section 3); never invent one to fill the field. |
| `topic` | `string` | Strongly recommended | The specific lecture/topic name from the syllabus (e.g., "Bony Orbit", "Lacrimal Apparatus", "Visual Pathway"). This is the PRIMARY routing signal for smart auto-sorting. Use the exact intended current `lectureNames` entry, not an invented subtitle or an unrelated Pulse topic name. Verify actual routing. |

Plus the **type-specific fields** defined in Section 6.

### 📌 AUTOMATIC IMPORTER FEATURES (Do NOT manually set)

These fields are **managed automatically by the importer**. Do NOT add them to your output:

| Field | Notes |
|---|---|
| `repetitionCount` | **Auto-managed.** The importer tracks how many times a question has been seen across all batches. When a duplicate is detected, the existing question's `repetitionCount` is incremented automatically (2-3 → ★, 4-5 → ★★, 6+ → ★★★). |
| `id` | **Auto-generated.** The importer creates canonical question IDs like `MEM2-CH1-ANAT-0001`. Do NOT invent IDs. |

**Star markers and duplicates:** Preserve importance marks and every occurrence in the source registry. The current importer strips trailing stars; do not assume it converts them into the documented repetition counts or that runtime displays those counts. Verify before relying on that feature.

Deduplication is not a reason to skip review. Inspect normalized-text matches, option/answer differences and proposed removals, including existing cross-chapter questions, before applying an import. Keep duplicate relationships and all source locations in sidecars. Do not remove source occurrences during extraction.

═══════════════════════════════════════════════════════════════
## SECTION 5 — CANONICAL SUBJECT NAMES
═══════════════════════════════════════════════════════════════

Use **EXACTLY** one of these 12 subject names. Do NOT invent, rename, abbreviate, or modify them:

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

> **Note:** Match the subject of the question exactly to one of the 12 names above. Do not use custom names or abbreviations. If you cannot confidently assign one of these 12 subjects, **FLAG the question** (Section 0) instead of guessing.

═══════════════════════════════════════════════════════════════
## SECTION 6 — QUESTION TYPE TEMPLATES
═══════════════════════════════════════════════════════════════

Choose the format based on the question's structure. Every template is in **incoming batch format** (the importer converts `correctAnswer` letters to `correctIndex` automatically).

### FORMAT A — Multiple Choice Question (MCQ)
Use when: 3–5 answer options with one correct answer.

```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Anatomy",
  "topic": "Pituitary Gland - Anatomy",
  "lecture": 1,
  "type": "mcq",
  "text": "Which of the following is a part of adenohypophysis?",
  "options": ["Pars nervosa", "Median eminence", "Pars intermedia", "Infundibular stem"],
  "correctAnswer": "C",
  "explanation": "The adenohypophysis consists of pars distalis, pars tuberalis, and pars intermedia.",
  "keyConcept": "Anterior vs posterior pituitary embryology"
}
```

**MCQ rules:**
- `options`: array of 2–5 strings. Do NOT prefix with "A)", "B)", "1.", etc.
- `correctAnswer`: capital letter `"A"`–`"E"` matching the correct option (A = first option).
- If the correct answer is missing, ambiguous, or not among the options, **FLAG the question** (Section 0).

### FORMAT B — True/False Question
Use when: The question is a statement that is either true or false.

```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Physiology",
  "topic": "Pituitary Gland - Physiology",
  "lecture": 3,
  "type": "truefalse",
  "text": "Prolactin secretion is predominantly inhibited by hypothalamic dopamine.",
  "options": ["True", "False"],
  "correctAnswer": "A",
  "explanation": "Dopamine exerts tonic inhibition on lactotrophs.",
  "keyConcept": "Dopamine tonically inhibits prolactin"
}
```

**True/False rules:**
- `options` must be exactly `["True", "False"]`.
- `correctAnswer`: `"A"` for True, `"B"` for False.

### FORMAT C — Matching Question
Use when: The question asks the student to match items from two columns.

```json
{
  "chapterTitle": "Thyroid and Parathyroid Glands",
  "subject": "Biochemistry",
  "topic": "Thyroid and Parathyroid Glands - Biochemistry",
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

**Matching rules:**
- `pairs`: array of `{ "premise": string, "target": string }` objects.
- Do NOT split premises and targets into separate arrays.
- If premises/targets are incomplete or cannot be confidently paired, **FLAG the question** (Section 0).

### FORMAT D — Essay Question (Self-Graded)
Use when: The question requires a written answer.

```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Physiology",
  "topic": "Pituitary Gland - GH Regulation",
  "lecture": 2,
  "type": "essay",
  "text": "Describe the regulation of growth hormone secretion.",
  "modelAnswer": "Growth hormone secretion is stimulated mainly by GHRH and ghrelin, and inhibited by somatostatin. Secretion is pulsatile, increasing during deep sleep, exercise, fasting, hypoglycemia, stress, and puberty.",
  "explanation": "GH is controlled by hypothalamic releasing and inhibiting hormones, metabolic cues, sleep, stress, and IGF-1 negative feedback.",
  "keyConcept": "Pulsatile GH secretion and hypothalamic control"
}
```

**Essay rules:**
- `modelAnswer` is **REQUIRED** and must be a complete, detailed answer string.
- If `MODEL_ANSWER: N/A`, write it only from designated teaching evidence with a locatable source record (Section 3). Otherwise **FLAG the question** (Section 0).

### FORMAT E — Clinical Case with Sub-Questions
Use when: A clinical scenario is presented followed by multiple related questions.

```json
{
  "chapterTitle": "Thyroid and Parathyroid Glands",
  "subject": "Clinical",
  "topic": "Thyroid and Parathyroid Glands - Hyperthyroidism",
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
      "explanation": "Diffuse goiter with thyrotoxic symptoms, suppressed TSH, and elevated free T4 is typical of Graves disease.",
      "keyConcept": "Graves disease is a common cause of primary hyperthyroidism"
    },
    {
      "type": "essay",
      "text": "Explain the expected thyroid function test pattern in primary hyperthyroidism.",
      "modelAnswer": "Free T4 and/or T3 are elevated, and pituitary TSH is suppressed by negative feedback.",
      "explanation": "High circulating thyroid hormone suppresses TSH secretion through negative feedback.",
      "keyConcept": "Low TSH with high free T4 indicates primary hyperthyroidism"
    }
  ]
}
```

**Case sub-question rules:**
- The schema lists `"mcq"`, `"essay"`, and `"fillblank"`; before exporting case `fillblank`, verify current runtime preserves and renders its blank answers. Otherwise retain the complete case in the review queue.
- Every sub-question MUST have `text`, `explanation`, and `keyConcept`.
- MCQ sub-questions need `options` and `correctAnswer`; essay sub-questions need `modelAnswer`; fillblank sub-questions need `blanks`.
- Sub-questions do NOT need their own `id` — the importer generates canonical IDs.
- If any sub-question is unreadable, incomplete, or illogical, **FLAG the ENTIRE case** (Section 0) rather than partially importing it.

### FORMAT F — Fill-in-the-Blank Question
Use when: The text has missing slots written as `___` (three underscores).

```json
{
  "chapterTitle": "Pituitary Gland",
  "subject": "Anatomy",
  "topic": "Pituitary Gland - Anatomy",
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

**Fill-in-the-blank rules:**
- `text` must contain exactly as many `___` slots as there are elements in `blanks`.
- `blanks`: array of correct answers in order.
- `acceptedAnswers` (optional schema field): array of arrays, one per blank. The inspected importer drops this top-level field; hold items requiring variants or verify a compatible path before declaring them import-ready. Preserve variants in sidecars meanwhile.
- If the blank count and answers do not line up, or an answer is missing, **FLAG the question** (Section 0).

═══════════════════════════════════════════════════════════════
## SECTION 7 — QUESTION ID GENERATION (HANDLED BY IMPORTER)
═══════════════════════════════════════════════════════════════

Do **NOT** generate question IDs yourself. The importer generates them automatically as:

`{MODULECODE_NO_HYPHEN}-CH{chapterId}-{SUBJECTKEY}-{4digitSequence}`

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
## SECTION 8 — PRE-OUTPUT VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

Before outputting, verify ALL of the following:

- [ ] Every uncertain, garbled, incomplete, or illogical question has been **EXCLUDED from the JSON** and listed in the Flagged Review List (Section 0). The JSON contains no unresolved transcription, answer, evidence, or routing decisions; verify this against the review records.
- [ ] `moduleCode` is a valid code from Section 9.
- [ ] Every `subject` is exactly one of the 12 canonical names (Section 5).
- [ ] Chapter ID/title, subject, exact topic and lecture agree with the current canonical bank and crosswalk; Section 10 examples do not override it.
- [ ] Every MCQ/truefalse has `options` (array) and `correctAnswer` (capital letter).
- [ ] `correctAnswer` is valid for the number of options (don't use "E" with only 4 options).
- [ ] Option strings do NOT start with "A)", "B)", "1.", "a." prefixes — answer text only.
- [ ] Every essay has a `modelAnswer` string.
- [ ] Every matching question has a `pairs` array of `{ premise, target }` objects.
- [ ] Every fillblank has a `blanks` array matching the `___` count in `text`.
- [ ] Every case has a `subQuestions` array (sub-questions can be mcq, essay, or fillblank).
- [ ] Every question has a source-transcribed or designated-source-supported `explanation`, with provenance in the sidecar.
- [ ] Every included `keyConcept` is source-transcribed or designated-source-supported.
- [ ] Every essay without a source model answer has one that is medically accurate and complete.
- [ ] The JSON has no markdown fences, comments, or extra text; it is output first and on its own.
- [ ] The entire JSON object parses as valid JSON (no trailing commas, no single quotes).
- [ ] The Flagged Review List (if any) appears only AFTER the JSON and is clearly not part of it.

═══════════════════════════════════════════════════════════════
## SECTION 9 — VALID MODULE CODES (ALL YEARS & SEMESTERS)
═══════════════════════════════════════════════════════════════

Use exactly one of these codes as `moduleCode`:

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
## SECTION 10 — CURRICULUM CHAPTER REFERENCE GUIDE

This retained reference and the examples below are illustrative. Resolve exact chapter IDs/titles and lectureNames against the current module JSON; do not blindly use an example's topic suffix or lecture number.
═══════════════════════════════════════════════════════════════

Use exact chapter IDs/titles from the current canonical bank and the verified source-to-website crosswalk. The retained list below is a reference snapshot. Keep original book headings in provenance. Never insert topic keywords into a question stem to force routing, and never rely on fuzzy matching to settle an uncertain placement. Flag unresolved mappings and verify the actual importer destination.

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
1. "Pharmacokinetics"
2. "Pharmacodynamics"
3. "Adrenergic System"
4. "Cholinergic System"
5. "Calculations"

**MINF-1** — Infection Module:
1. "Microbiology"
2. "Parasitology"
3. "Pathology"
4. "Pharmacology"

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
1. "Development of the Heart"
2. "Structure of the Heart"
3. "Functional Characteristics of the CVS"
4. "Electrical Activity of the Heart"
5. "Contractile Activity of the Cardiac Muscle"
6. "Cardiac Diseases"
7. "Development of the Vessels"
8. "Anatomy and Structure of Blood Vessels"
9. "Ischemic Heart Disease"
10. "Blood Pressure: Regulation and Pathophysiology"
11. "Special Circulations and Diseases of Blood Vessels"


**MCNS-2** — Central Nervous System:
1. "Introduction to CNS"
2. "Sensory System"
3. "Motor System & Spinal Cord"
4. "Brain Stem & Cranial Region"
5. "Anatomy of the Neck"
6. "Diencephalon, Reticular Formation, Sleep & Epilepsy"
7. "Cerebrum, Meninges & Higher Brain Function"
8. "CNS Infections"
9. "Neurodegenerative, Vascular, Trauma & Tumours"
10. "Miscellaneous & Embryology"
11. "CNS2 Past Exams"

**MSS-2** — Special Senses:
1. "The Eye & Visual System"
2. "The Ear & Auditory/Vestibular Systems"
3. "Chemical Senses (Smell & Taste)"

**MSS-2 Lecture Index** (use these as `topic` values for precise routing):

*Chapter 1 — The Eye & Visual System:*
- Anatomy: Bony Orbit, Orbital Fascia, Extra-ocular Muscles, Lacrimal Apparatus, Nerves of the Orbit, Vessels of the Orbit, Anatomy of the Eyelids (palpebrae), Development of the eye, Visual Pathway, Visual Reflexes
- Histology: The Eye
- Physiology: Introduction to Vision Physiology and Vision Optics, Light path through cornea Aqueous humor and Lens, Accommodation Errors of refraction and Iris, Organization and Functions of Retinal Neurons, Photoreceptors, Dark and light adaptation and visual cortex, Color Vision Binocular Vision and Eye Movements
- Biochemistry: Visual cycle and vitamin A, Deficiency of vitamin A
- Microbiology: Infections of The Eye
- Pathology: Diseases of The Eye
- Pharmacology: Drug Therapy of Glaucoma
- Clinical: Basic Neuro-ophthalmic Examination

*Chapter 2 — The Ear & Auditory/Vestibular Systems:*
- Anatomy: Anatomy of the ear, Auditory Pathway, Development of the Ear, Anatomy of the Facial Nerve, Medial Longitudinal Fasciculus (Bundle), Vestibular Pathway
- Histology: The Ear, Structure of the Ear
- Physiology: Physiology & Physics of Sound & Function of External and Middle Ear, Physiology Function of Inner Ear, Discrimination of Sounds and Hearing Impairment and Hearing Tests, Posture and equilibrium
- Microbiology: Infections of The Ear
- Pathology: Diseases of The Ear
- Clinical: Hearing Loss

*Chapter 3 — Chemical Senses (Smell & Taste):*
- Anatomy: Olfactory & Taste Pathways
- Physiology: Physiology of Smell and Taste (Chemical Senses)
- Clinical: Taste and Smell Disorders

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
## SECTION 11 — COMPLETE EXAMPLE OUTPUT
═══════════════════════════════════════════════════════════════

**PART 1 — THE JSON** (only confident, correct questions):

```json
{
  "moduleCode": "MEM-2",
  "questions": [
    {
      "chapterTitle": "Pituitary Gland",
      "subject": "Anatomy",
      "topic": "Pituitary Gland - Anatomy",
      "lecture": 1,
      "type": "mcq",
      "text": "Which of the following is a part of adenohypophysis?",
      "options": ["Pars nervosa", "Median eminence", "Pars intermedia", "Infundibular stem"],
      "correctAnswer": "C",
      "explanation": "The adenohypophysis consists of pars distalis, pars tuberalis, and pars intermedia.",
      "keyConcept": "Anterior vs posterior pituitary embryology"
    },
    {
      "chapterTitle": "Pituitary Gland",
      "subject": "Physiology",
      "topic": "Pituitary Gland - Physiology",
      "lecture": 3,
      "type": "truefalse",
      "text": "Prolactin secretion is predominantly inhibited by hypothalamic dopamine.",
      "options": ["True", "False"],
      "correctAnswer": "A",
      "explanation": "Dopamine exerts tonic inhibition on lactotrophs.",
      "keyConcept": "Dopamine tonically inhibits prolactin"
    },
    {
      "chapterTitle": "Thyroid and Parathyroid Glands",
      "subject": "Clinical",
      "topic": "Thyroid and Parathyroid Glands - Hyperthyroidism",
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
          "modelAnswer": "Free T4/T3 are elevated; TSH is suppressed by negative feedback.",
          "explanation": "High thyroid hormones suppress TSH at the pituitary.",
          "keyConcept": "Low TSH + high free T4 = primary hyperthyroidism"
        }
      ]
    }
  ]
}
```

**PART 2 — FLAGGED REVIEW LIST** (shown in chat, NOT imported). Only appears if there were uncertain questions:

```
=== FLAGGED FOR MANUAL REVIEW — NOT IMPORTED ===

[1] Reason: Garbled OCR — answer options unreadable
    Raw question (as received): "Whihc of the f0ll0w1ng is a pa■■ of aden0hyp0physis? A) Pars nerv... B) ▒▒▒"
    My tentative reading (NOT imported): Likely an MCQ on adenohypophysis parts, but options are corrupted — cannot confirm answer.

[2] Reason: Marked correct answer is not among the listed options
    Raw question (as received): "The main hormone of the adrenal cortex is: A) Insulin  B) Glucagon  C) ADH  (answer key: Cortisol)"
    My tentative reading (NOT imported): Answer "Cortisol" is missing from options A–C, so the correct choice cannot be mapped.
```

═══════════════════════════════════════════════════════════════
## SECTION 12 — CLEANED QUESTION BLOCKS TO CONVERT
═══════════════════════════════════════════════════════════════

[PASTE YOUR CLEANED QUESTION BLOCKS HERE]