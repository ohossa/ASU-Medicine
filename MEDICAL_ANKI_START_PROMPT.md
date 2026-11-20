# Medical Anki project start prompt

Copy the prompt below into a new task, fill in the inputs, and attach or grant access to the complete workflow. The workflow is the full procedure; this prompt establishes the current run.

```text
Use $medical-anki-production and $medical-image-extraction (or read the attached MEDICAL_ANKI_WORKFLOW.md and IMAGE_EXTRACTION_WORKFLOW.md if skills are unavailable) to create a concise, source-grounded, image-enriched medical Anki deck. Read the workflows before acting. Do not assume you have access to our previous chat or files.

INPUTS
Module:
Year and semester:
Textbook title, edition and part:
Textbook file path:
Lecture PDF/PPT/PPTX folder paths:
Assigned units, chapters, subjects and lectures:
Excluded sources or topics:
Factual authority: textbook only unless I explicitly specify otherwise.
Exact parent deck path: Medicine ASU::Year 3::Semester 1
Existing baseline APKG, if this is an update:
Operation: new cards / text revision / image-only enrichment / image replacement / merge
Authorised changes:
May original lecture files be physically moved and renamed? Yes/No
Intended audience: private use / classmates / public distribution
Output directory:
Target Anki clients:

REQUIRED OUTCOME
Deliver a tested APKG with embedded images and a truthful validation report, not just text or CSV. Keep a canonical note registry, source coverage ledger, image inventory, card-image mapping and progress log so the next task can resume safely.

CARD RULES
Use textbook-grounded questions and answers in UK English. Read each entire lecture range before drafting. Choose Basic or Cloze by the learning task, without a quota. For a new faculty-list-compatible Basic model use Front, Back, Extra, Source, FacultyDrugList; Cloze uses Text, Extra, Source, FacultyDrugList. Keep FacultyDrugList blank until a verified faculty list arrives. Preserve existing published models. Answers should normally be a phrase or one sentence, fewer than about 25 words and under two displayed lines where practical. Split independent targets only as needed; a modest card increase is acceptable, but do not create trivial fragments or redundant broad list cards. Preserve important qualifiers, numerical values and units.

Write direct, standalone study prose in Basic Front, Back and Extra, and in Cloze Text and Extra. Omit source narration such as “according to the book”, “in the module”, “the account describes” and “the lecture states”. Name the actual structure, process, disease, population or formal classification. Keep exact printed-page or slide references in the dedicated Source field. Preserve qualifiers and the scope of any source-specific claim. If a claim cannot be phrased accurately without source-specific framing, hold it for review.

Use Cloze only when a small natural set or sequence benefits. Use c1 for related blanks intended to generate one review card. Do not group many unrelated facts merely to reduce the card count. Verify actual generated-card counts.

Do not bold questions or whole answers. Bold only essential answer keywords. Use italics and underline sparingly; use separate labelled lines with <br> for contrasts and distinct components. No unsolicited tags, Key or High-yield labels, filler, decorative fonts or unnecessary template redesigns. Preserve the established readable system font and layout when continuing our decks.

ANSWER LAYOUT
Both Basic and Cloze must have the same conditional Extra Section box on the answer side. Centre the heading, text and images inside Extra; keep main questions/answers left-aligned and retain accessible amber/gold revealed Cloze targets. Use the saved answer-layout assets; do not put the heading in note fields. Test empty/text/small-image/multi-image Extra for both note types across light/dark mobile/desktop widths.

SOURCE AND HIERARCHY RULES
Inspect the actual contents and section openings. Preserve full unit, chapter, subject and individual lecture names under the exact parent, omitting levels absent from the book. deck: is a search operator, not part of a stored name. Verify printed book pages separately from PDF page indices and put an exact source anchor on every note.

Do not let lecture or external image labels become unapproved tested facts. Flag illegible, conflicting or suspected erroneous material. Do not invent a correction or silently replace the textbook with outside knowledge. Document supported corrections separately and request direction when they change the source contract.

IMAGE RULES
Organise and match only the authorised lecture sources. Extract native images AND render every relevant page/slide, including composite and vector diagrams. Review all candidates and inspect useful figures at full size. Reject thank-you slides, decoration, slide-text clutter, duplicates, unreadable labels and misleading crops.

Draft and review text in batches first, freeze it, then enrich exact cards with separately reviewed images; plan visual targets during authoring. Put supplementary pictures in Extra after answering. Prefer the best relevant lecture diagram; use the textbook where useful, and actively search online for clearer or missing diagrams. Prioritise Anatomy, Histology and Pathology, while adding meaningful visuals across other subjects. Use many images where they teach something, not to satisfy a quota. Usually one decisive figure is enough; add another only if it contributes a useful different view.

Verify the original online figure, medical identity, labels, orientation, resolution and permission appropriate to the audience. Keep image sources, links, references and credits out of every Anki deck and subdeck description and out of review-card prose. Record image provenance in the media manifest. Supply required credits in a companion attribution file distributed with the APKG when the terms permit. If the required credit cannot be provided there or in an intact credit already accompanying the image, choose a different permitted figure. Preserve original creator marks. Do not assume online availability, private use or a lecture's inclusion grants redistribution rights. Embed local media, do not hotlink. Preserve originals and traceable crops without inventing or altering medical labels.

UPDATE RULES
Keep the original package recoverable. Preserve published GUIDs and compatible model/field/template identities. For image-only work, change only the intended image field; compare every frozen field before and after. Do not regenerate GUIDs from changed fronts or renamed decks. Keep existing scheduling intact for private enrichment. Do not modify the user's live collection or publish the package unless explicitly authorised.

VERIFICATION
Complete bounded lecture/subject batches; preserve explicit registry IDs and hash-bound checkpoints so interruptions or appended cards cannot lose scope. Reconcile all important source points with the coverage ledger. Check every released card and image pairing. Before release, read Basic Front, Back and Extra and Cloze Text and Extra for source narration, keeping the separate factual Source field intact. Inspect the imported deck and subdeck descriptions for image credits, links and reference lists. Check that every required credit is present in the companion material or on the intact figure as permitted. Build passing lecture, subject and unit checkpoints. Verify archive/database integrity, exact hierarchy, note/card counts, source anchors, duplicates, Cloze expansion, embedded media, hashes and update differences. Test fresh import, repeat import and, where relevant, baseline-to-update import in a disposable Anki profile. Verify progress preservation under the intended import settings. Check desktop and mobile-sized rendering and state which actual clients were tested.

Analyse all supplied exams/formatives first, tracking uncertain dates, duplicate sittings and incomplete fragments. Use only book-verified exam keywords for subtle answer-side underlining. Reconcile every substantive book point, table, legend and footnote with a card/equivalent/exclusion/hold; audit all parasitology categories systematically. Do not ask context-dependent “other” questions or combine vascular, lymphatic and nerve supplies into an oversized card.

Do not equate extraction with visual review, structural checks with medical accuracy, or package size with completeness. Stop release on unresolved critical content, media or update failures. Report genuinely unavailable checks instead of claiming they passed. Never promise zero errors.

START
Inspect the supplied sources and baseline, establish the exact hierarchy and page map, then prepare the inventory, source coverage and visual library. Follow the workflow in order and continue within the authorised scope. Ask only when a missing choice materially changes the result or additional authority is required. Save progress at every passing checkpoint and deliver the final APKG with a concise, evidence-based report.
```
