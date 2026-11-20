# Project workflow save verification

11 November 2026, Africa/Cairo. Scope: save the accepted Anki/image workflows and both skills inside the ASU Medical Portal project, with portable instructions. No medical cards, original teaching sources, website application code or question-bank content were changed by this task. No push/deployment was performed.

## Saved and checked

- Both complete skills are real files under `.agents/skills/medical-anki-production/` and `.agents/skills/medical-image-extraction/`; relative project `.codex/skills/` and `.claude/skills/` aliases resolve to them.
- `MEDICAL_ANKI_WORKFLOW.md`, `IMAGE_EXTRACTION_WORKFLOW.md` and `MEDICAL_ANKI_START_PROMPT.md` match the corresponding project skill references byte for byte after adapting their routing to this repository.
- `docs/medical-anki/START_HERE.md` provides direct Markdown and skill-based entrypoints for other AIs. The portable ZIP includes the canonical skill folders, full guides and actual validation records, without books, lecture assets, private collections or Anki packages.
- Prior related project documents/skill files were archived before replacement in `history/2026-11-11-before-workflow-update.zip`, including pre-existing local edits to the instruction files. Unrelated current changes were retained.
- Root/nested agent instructions, Claude entrypoint, project scratchpad, skills playbook and old handoff now route to current rules; the old blanket bitmap prohibition, arbitrary minimum-pixel rejection, destructive parity cleanup and catalogue-perfection claims are superseded.
- Both skill packages passed `quick_validate.py`.
- The read-only visual evidence validator passed **16 regression tests** in the project and again from an isolated copy containing only the two skill folders. This does not establish truthful viewing, medical accuracy, permission clearance or Anki compatibility for a future deck.
- **23 local Markdown links**, three guide/reference mirrors, four relative runtime aliases and the related archives passed their integrity checks at the saved checkpoint. The finished ZIP was also extracted for an isolated validator test.

## Portal checks required by the project instructions

- Import routing: **27 tests passed**.
- Special Senses: **12 tests passed**.
- Bank JSON schema validation: **42 files passed**. These are structural tests, not a medical review of those banks.

## Graphify use and boundaries

Used the existing graph first to locate the previous image workflow/skill, expanding from actual graph vocabulary `[image, extraction, workflow, Anki]`. It identified `IMAGE_EXTRACTION_WORKFLOW.md` (L1) and the previous skill's `Workflow` (L47). Raw inspection confirmed those previous rules were outdated. A corrected query result was saved to graph work memory, explicitly directing future agents to current source files.

`graphify update .` refreshed the code graph without an LLM/API call and produced **10,086 nodes / 15,815 edges / 1,343 communities** with an aggregated HTML view. This was not a fresh semantic re-extraction of all documentation, papers or images. Existing graph summaries can still describe previous document content; read the current workflows before acting. The existing graph was already over 5,000 nodes; this was disclosed before its refresh. Graph outputs were written into the working tree, not committed or pushed.

The wider repository graph update reported: three SQL files lacked the optional `tree_sitter_sql` parser; `scripts/rebuild-unique-keywords.py` had a pre-existing syntax error at line 47 and may be partially extracted; 97 code files yielded no symbols; and some community labels changed or need semantic naming refresh. Those unrelated source/parser issues were not modified or relabelled as passing. They do not invalidate the copied workflow validator tests. No full semantic graph rebuild, external service or clinical/client retest was performed for this documentation-save task.

## Remaining use requirements

Each new module must supply its actual authorised sources, coverage evidence and baseline identities, then complete fresh medical/card-image/import/update/render checks. Historical urinary test results are artifact-specific. Source snapshots retain origin paths for audit; they are not runtime dependencies. Neither a local save nor this portable kit guarantees every AI will auto-discover a skill; direct reading from START_HERE is the supported fallback.
