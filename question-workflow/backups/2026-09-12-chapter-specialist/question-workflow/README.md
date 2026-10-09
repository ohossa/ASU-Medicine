# ASU portable question workflow

**Main prompt:** `../CONVERSION_PROMPTS_MASTER.md` — Portable v3. It is self-contained and can be attached to another AI chat. The essential adapted Pulse rules and website incoming JSON contract are inside; the original Pulse files are not runtime dependencies.

**User guide:** `START_TO_FINISH.md` — what to upload and the exact sequence from PDFs to a verified live release.

**Offline website context:** `website-destination-context.json` — a dated snapshot of available module/chapter/subject/lecture destinations, without question text or credentials. It substitutes for direct repository access when a chat prepares a crosswalk. Refresh it before actual import; do not treat it as a medical source or the deployed state.

**Focused extraction helper:** `../OCR_CLEANER_PROMPT.md` — optional, consistent with Portable v3. The main prompt already contains the essential extraction rules.

## Current order

Question files first → complete visual reading/transcription and key reconciliation → extraction QA/duplicate registry → save checkpoint → book supplied later → source-based QC and exact book chapter organization → current website mapping → JSON export → staged validation → authorized local import → authorized deployment → live verification.

Book structure and repository access are NOT prerequisites for extracting the question files. Unknown final placements stay pending without changing original headings or text. Independent review and live publication require the corresponding capabilities; the prompt prepares a handoff if unavailable.

## Pulse originals and adaptations

Five unchanged original prompts are preserved under `pulse-prompts/`; `SHA256.json` verifies their contents. Portable v3 embeds their essential roles: structure building, recall-only generation, source-bound independent review, ID-manifest classification (max 50 items per batch), and conditional confirmed-gap generation. It adapts them for preservation of existing question types/option counts and website explanations.

The new user instruction to organize later supersedes the earlier chapter-first setup for this ASU pipeline. Originals remain historical reference, not conflicting automatic triggers. The referenced Coverage & Gap Analyzer instructions were not supplied; do not invent that stage or claim complete curriculum coverage from question counts.

## Backups and scope

`backups/2026-09-12/` contains the original website instructions. `backups/2026-09-12-portable-rewrite/` preserves the preceding combined version before the portable rewrite. Old backups are not active instructions.

This update changes prompt/documentation artifacts only. It does not extract existing teaching/question PDFs, import questions, fix application code, or publish the website. Application-specific support must be checked by the integrating agent at import time.
