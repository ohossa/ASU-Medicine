---
name: medical-anki-production
description: Create source-grounded medical Anki decks and compatible APKG updates using coverage ledgers, concise recall cards, reviewed images and real import tests.
---

# Medical Anki production

Read [the full production workflow](references/workflow.md). Use the sibling [medical-image-extraction](../medical-image-extraction/SKILL.md) whenever extracting, cropping, replacing or pairing figures. [The start prompt](references/start-prompt.md) captures a future run's exact scope; existing authorisation and current user instructions take precedence.

Default to the designated module textbook as tested-fact authority. Verify contents/lecture openings and printed page labels; bookmarks and OCR are aids. Analyse authorised exams/formative papers before full drafting, preserving uncertain fragments, duplicate sittings and source conflicts. Every substantive source point, table/legend/footnote needs a card, equivalent, specific exclusion or hold. Past-exam emphasis does not justify omitted useful book content.

Write standalone, high-yield Basic/Cloze cards without quotas. Answers are normally short phrases or one sentence; preserve important complete enumerations, qualifiers and useful ranges. Avoid tautologies, answer leakage, “other/remaining”, trivia and duplicate targets. Split oversized supply cards. Use UK English, unbolded questions, restrained keyword emphasis and labelled `<br>` contrasts. Underline only book-verified essential exam keywords with recorded exam links. Preserve the approved system font, template and accessible light/dark colours.

Write direct, standalone study prose in Basic Front, Back and Extra, and in Cloze Text and Extra. Omit source narration such as “according to the book”, “in the module”, “the account describes” and “the lecture states”. Name the actual structure, process, disease, population or formal classification. Keep exact printed-page or slide references in the dedicated Source field. Preserve qualifiers and the scope of any source-specific claim. If a claim cannot be phrased accurately without source-specific framing, hold it for review.

For both Basic and Cloze, use the conditional **Extra Section** box with centred title, text and images; keep main questions/answers left-aligned and revealed Cloze answers amber/gold. Read [the complete answer-layout contract and copyable assets](references/answer-layout.md) when creating or editing templates. CSS alone does not add the missing Cloze wrapper.

Default sequence: write/review text in bounded batches, freeze passing fields, then enrich exact cards with reviewed images in Extra. Brief external clarifications/doses belong in Extra, distinctly sourced; external images do not authorise outside tested text. Keep one home lecture; use shared lecture tags only when agreed. Reserve FacultyDrugList for a planned future list when creating a new compatible model; do not mutate published field order casually.

Store immutable note IDs and published GUID/model/field/template identities independently of editable wording. Preserve existing Cloze numbers and recipient scheduling. Never rebuild GUIDs from a changed Front/deck. Partition work by explicit registry IDs, checkpoint exact hashes/next IDs and resume after interruptions without overlapping writers.

A release needs all-card source review, coverage reconciliation, actual full-size image/pair reviews and native fresh/repeat/update imports in disposable collections with established history. Compare every field, identities/scheduling/revlog and all media payload hashes. Render all actual Anki faces across modes/widths, then inspect representative screenshots. Test simulated drug-list/media updates if promised; export without author progress.

Keep image sources, links, references and credits out of every Anki deck and subdeck description and out of review-card prose. Record image provenance in the media manifest. Supply required credits in a companion attribution file distributed with the APKG when the terms permit. If the required credit cannot be provided there or in an intact credit already accompanying the image, choose a different permitted figure. Preserve original creator marks. Inspect imported descriptions before release.

Deliver APKG, quantitative subject/lecture breakdown, coverage/media/provenance records, change log, student update instructions and hash. Distinguish notes/cards, placements/unique images and extracted/reviewed candidates. Report holds, remaining image opportunities and actual client/review limitations. Do not call script success medical infallibility or imply live Anki mutation/publication. Stop at the user's agreed part boundary.

For Genital Part 2, use GPT-6.2 Astra at Standard speed only to write or revise medical card text. Use GPT-6.2 Sol at Standard speed for source preparation, coverage reconciliation, source review, image selection and verification, packaging and tests. Apply this routing when authorised and available, and record the actual models used.

Phase 1 finishes and source-reviews every text batch, reconciles the full coverage ledger, and freezes the approved card text and identities before Phase 2 begins. Phase 2 verifies and pairs relevant images in Extra, then tests the complete APKG. Follow the faculty yellow highlights chapter by chapter across Front, Back, Text and Extra. Keep claims supported by independently unhighlighted passages, and retain unmarked claims in mixed paragraphs. Apply the same scope when reviewing visible image labels and captions. Keep excluded claims out of study material.
