# PDF → Pulse review → ASU website workflow

Use the repository's **CONVERSION_PROMPTS_MASTER.md** as the main entry point. It now contains the complete PDF-reading and Pulse coordination instructions followed by the existing website conversion contract and curriculum references. **OCR_CLEANER_PROMPT.md** is the faithful transcription stage.

## Original Pulse prompts

The five files under `pulse-prompts/` are unchanged copies of the originals from `/Users/omarhossa/Documents/Pulse Questions/Pulse Prompts/`. SHA256.json records their verified digests. They were read alongside the task **Plan Pulse medical questions** on 12 September 2026. Do not activate all automatic triggers simultaneously.

| Stage | Original prompt | ASU adaptation |
| --- | --- | --- |
| Establish structure | Module and Topic Structure Builder v2.md | Preserve book chapter order; crosswalk to current website chapters/lectures |
| Reconstruct designated recalls | Recall to MCQ Generator v5.md | Conditional; complete source questions are transcribed, not regenerated |
| Independent QC | MCQ Reviewer and Quality Control v2.2.md | Source evidence and blind key comparison; preserve original item option count/style |
| Classify accepted versions | Question Bank Taxonomy Classifier v3.md | At most 50 per batch; ID-based manifest, separate deterministic assembly |
| Fill confirmed gaps | Gap-Filling MCQ Generator v2.md | Conditional on requested coverage work and supplied/established Concept/Gap Maps |

The Coverage & Gap Analyzer instructions were not supplied with the five prompts. This does not block PDF extraction or preparation of existing questions; it blocks unsupported claims of complete curriculum coverage.

## Order

Designate inputs → map chapters → render/OCR and visually read every page → full transcription and item registry → answer-key reconciliation → optional recall generation → independent QC/reconciliation → classification/crosswalk → optional coverage and gap loop → deterministic assembly → ASU batch conversion → validation and authorized import.

For a future request, send the PDF(s), module code/name, and teaching source(s) to use for factual verification. State whether to prepare batches or add them locally. Explicitly identify recalls or gap-generation work if wanted. File designation itself authorizes processing the supplied files; repeated confirmations are unnecessary.

The page-reading requirement means actually opening and visually inspecting every rendered page, including answers, not merely generating PNGs, OCRing, reading a subset, or scanning a contact sheet. Keep page/item ledgers and unresolved queues through completion.

## What changed

- Main conversion prompt gained the full staged workflow and source-bound medical evidence rules.
- Cleaner now preserves full text, provided explanations, figures, answer keys and duplicate occurrences in audit records instead of deleting them during cleanup.
- Website format stays a flat `{moduleCode, questions}` incoming object; page/QC/taxonomy provenance remains in sidecars.
- Source types/options remain intact; Pulse's five-option constraints apply to new generated MCQs.
- Known importer issues are explicitly checked before claiming import readiness.
- Original versions of the two website prompts are backed up in `backups/2026-09-12/`.

This change edits instructions only. It does not process any existing question/teaching PDF, import questions, modify application code, or deploy the website.
