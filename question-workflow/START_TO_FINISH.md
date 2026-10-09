# From your PDFs to questions working on asu.codes

The main prompt to upload first is **CONVERSION_PROMPTS_MASTER.md** (Portable v3, 2026-09-12). Its essential extraction, Pulse review, chapter organization, JSON format and integration instructions are embedded. A chat does not need this repository or our conversation to begin. At the later book stage, use the standalone **[CHAPTER_ORGANIZATION_PROMPT.md](./CHAPTER_ORGANIZATION_PROMPT.md)** for the detailed organization protocol; the master still works on its own.

No prompt can create unavailable vision, storage, repository or publishing access. Use a chat with PDF/image viewing for page reading; use a repository-capable agent for the final site changes. Keep the downloadable job files between stages rather than relying on chat memory.

## What you do

### First: send the question files

Attach the master prompt and your question PDFs. About 50 files can be processed in upload waves if the platform has limits. Include any separate answer keys you already have. You do **not** need the book yet.

Copy this message:

> Use the attached ASU Portable Master Prompt. Extract every supplied question PDF, visually read every page, preserve all text/questions/options/answers and page evidence, and save a resumable job package. More files may arrive in later uploads. Organize into the book's chapters later when I provide the book. Do not generate extra questions or modify/publish the website now. Begin with the accessible files and report the actual received-file inventory.

The AI registers all received files, reads every page, saves transcription and questions, reconciles keys, checks duplicates across files and records unresolved content. It must not claim unseen pages were read. If the platform stops, say **Continue from the saved checkpoint**. Download/save the full job artifacts before leaving that chat. If you know the upload set is complete, say **These are all the question files for this job** so the final inventory can be closed.

### Second: send the book when ready

Attach **CHAPTER_ORGANIZATION_PROMPT.md** and use the same chat with its saved artifacts, or upload the full job package and required source/page evidence to another capable chat. Include the master too if medical QC is still pending; the chapter specialist performs organization, not answer repair. Supply the book/edition and any other teaching references you authorize. A table of contents alone can establish chapter names but usually cannot support medical verification of all answers.

Copy this message:

> Use the attached Chapter Organization & Question Classification Prompt with the full extracted job and this book/layout. Build a versioned map preserving exact titles, hierarchy and order, with physical/printed page evidence. If medical QC is pending, perform the attached master’s source-based QC stage before final acceptance; prepare an independent-review handoff if no isolated reviewer is available. Classify selected versions by their tested objective in batches of at most 50, retain uncertain placements in a separate queue, and assemble by ID/version without rewriting any question content. Preserve empty chapters and all source occurrences. Keep book IDs separate from website destinations. Save the complete updated job, manifests, integrity results and continuation checkpoint. Do not generate extra questions or import/deploy the website in this stage.

The AI reads the designated book, records its chapter map, reviews answers, resolves supported missing fields and classifies reviewed versions. You resolve genuine source/key conflicts or supply missing scans when necessary. Without those inputs, unaffected accepted questions can proceed as a clearly identified subset; held questions are not silently counted as done.

### Third: finish the website integration here, or with an agent that has access

Bring the complete reviewed job package back to this project. This agent can obtain the latest module structure and run integration checks. If you prefer the other chat to prepare final JSON, supply a **current** website destination packet or current target module JSON first. `website-destination-context.json` is an initial snapshot, not a promise that the site remains unchanged.

For local preparation/import, say:

> Use the updated job package and current website repository. Map the accepted questions to the correct module/chapter/subject/lecture. Stage and validate the import, preserve existing IDs/content, and add the eligible questions locally. Report every added, duplicate, held or rejected item and run the relevant validation, tests and build. Do not deploy yet.

When you want them live, say:

> Publish this verified question update to the correct asu.codes production deployment, then verify the new content, routes, answer behavior and required media on the live website. Report the deployed version and any unresolved checks.

If you want both actions together and the agent has the required access, explicitly authorize **local import and production deployment with live verification** in one request. That avoids a redundant publication handoff. The agent must still resolve failing checks and cannot invent access or success.

## Exact full order the AI follows

| Step | Work | Evidence/output before moving on |
| --- | --- | --- |
| 1 | Register every received document and available capability | Document manifest, physical page counts, availability, input-set status |
| 2 | Render/OCR and visually inspect every individual page | Page ledger, readable page evidence, full page transcription; gaps explicitly recorded |
| 3 | Extract every question occurrence and case child | Stable IDs, raw/cleaned content, source locations, preserved visuals and corrections |
| 4 | Read/join answer keys, including late/separate keys | Answer map with exact source locations, unmatched/missing/conflicting answers |
| 5 | Technical extraction QA and cross-file duplicate review | All occurrences retained, duplicate links, unresolved queue, checkpoint |
| 6 | Wait for the book if it has not arrived | Extraction package complete to its stated scope; organization remains pending |
| 7 | Read the designated book and establish exact chapter order | Versioned book chapter map and teaching evidence; no invented website IDs |
| 8 | Independently review and reconcile accepted question versions | Reviewer evidence, key comparison, accepted repairs, unresolved conflicts held |
| 9 | Classify accepted versions in batches of at most 50 | ID-based classification manifest; deterministic chapter-organized assembly |
| 10 | Map book organization to the current website structure | Verified crosswalk using fresh module/chapter/subject/lecture data |
| 11 | Convert accepted items to flat per-module incoming JSON | Parsed files, content/key checks, export manifest and traceable item indices |
| 12 | Stage import and inspect actual routing/duplicates/field preservation | Backup, staged diff and reports, no unexamined needsReview or incidental deletions |
| 13 | Apply authorized local import; validate the written result | Reopened bank, stable/new IDs, reconciled counts, tests/build and UI checks |
| 14 | Deploy when explicitly authorized | Confirmed correct host/environment and release version |
| 15 | Verify published questions work on the live site | Live URL/version, counts, routes, scoring/answers/explanations/media, cache checks |

Recall reconstruction and confirmed gap generation are OPTIONAL branches only when requested, not routine additions to a faithful PDF extraction job. They return to QC/classification before export. Full curriculum coverage is a separate claim from reading every supplied page.

## Website finish-line checklist

- Every source occurrence is accepted, duplicate-linked, held, or explicitly excluded with a reason.
- All items claimed as imported match the final bank and intended destinations, with original/source-to-canonical ID mappings.
- No options, correct answers, case children or required visuals were lost in conversion.
- New content is present on the published version, not only in local JSON/build files.
- Affected routes and question types actually display and behave correctly; pre-existing errors and blocked checks are reported.
- Any held subset has exact IDs/counts and a next action. A partial release is labeled partial.

## What to carry between chats

Stage-relevant prompts (master; chapter specialist at book stage) + checkpoint/README + complete registry/transcriptions + page/key evidence + duplicate/review records + accepted versions + chapter map/classification once created + current destination packet/crosswalk and exports once created. Keep the originals too.

A checkpoint is an index and continuation guide, **not a replacement for the question data**. Another chat must receive actual files; it cannot access a local path mentioned in a message unless those files exist in its environment. Missing evidence must be reattached when required for verification.
