# Project Memory & Knowledge Scratchpad (MEMORY.md)
*Canonical Persistent Memory for ASU Medical Portal (A-Plus)*

---

## 1. Project Identity & Architecture Core

* **Platform Name:** A-Plus (A⁺) Medical Portal (Ain Shams University Faculty of Medicine).
* **Mission:** Medical learning portal providing verified question banks, simulated exam sessions, and clinical case solvers for Year 1 through Year 5 medical students across 42 modules.
* **Technology Stack:**
  * **Frontend:** React 18, Vite 5, TypeScript 5.5, Tailwind CSS, Lucide React, Framer Motion.
  * **Backend & Database:** Cloudflare D1 (`a-plus-db`, Serverless Relational SQL) + Cloudflare R2 (`a-plus-storage`, Zero-Egress Object Storage), Vercel Serverless Functions (`api/`). (Supabase completely decommissioned).
  * **Testing Harness:** Vitest (unit & integration tests), TypeScript strict checking.
  * **Knowledge Graph:** Graphify (Tree-sitter AST, 8,024+ nodes in `graphify-out/`).
  * **Context Packaging:** Repomix (`repomix.config.json`).

---

## 2. Inviolable Architectural & UI Invariants

These rules are strict project invariants. Any agent working on this codebase must adhere to them without exception:

1. **Biochemistry vs. Genetics Module Code**:
   * Year 1 Semester 1 Introduction to Medical Biochemistry is **`IBM-1`**.
   * Molecular Biology & Medical Genetics is **`MBMG-1`**.
   * Never confuse `IBM-1` with `MBMG-1`. Always verify the module catalog before importing or querying banks.

2. **Special Senses Clinical Mapping**:
   * In Musculoskeletal & Special Senses 2 (`MSS-2`), ENT and Ophthalmology questions from Anki or raw source files map directly to the `"clinical"` subject ID in `MSS-2.json`.

3. **Subject Colour-Coding Guide Prohibition**:
   * **Rule:** Do NOT render or reintroduce the subject colour-coding guide box anywhere on the website.

4. **Quiz Sound Toggle Requirement**:
   * **Rule:** The quiz solving sound toggle must display **only the sound icon**, with NO visible text such as “Sound on” or “Sound off”.
   * The accessible label (`aria-label`) and state must be maintained.

5. **Study Navigation & Branch Scoping**:
   * Integrated chapter-first modules: `Chapter → Subject → Topic`.
   * Subject-first modules: `Subject → Topic`.
   * Single-branch chapters open directly to topics.
   * Topic search and custom practice must remain strictly within the selected branch.
   * Preserve 20/40-question batch fingerprints, unfinished-session resumption, and current-content-version progress.

6. **Medical Question Intake & Verification Policy**:
   * Process only user-designated input files (`QUESTION_IMPORT_WORKFLOW.md`).
   * Never relabel historical-key imports as medically verified.
   * Stage an explicit reviewed file list; never use `git add .` for question releases.

7. **Git Release Constraint**:
   * Do NOT push commits to GitHub (e.g. `git push`) unless the user explicitly tells you to do so. Local commits are permitted; remote pushes require explicit user approval.

8. **Medical Anki & Visual Extraction Standard**:
   * Start at `docs/medical-anki/START_HERE.md`; use `MEDICAL_ANKI_WORKFLOW.md`, `IMAGE_EXTRACTION_WORKFLOW.md` and both sibling project skills in `.agents/skills/`.
   * Preserve textbook-only tested facts, full source dispositions, concise standalone cards, exact image relevance, source-faithful crops/keys, immutable GUID/model identities and tested recipient scheduling preservation.
   * Composite PDF viewports normally use 300 DPI; clear complete native rasters may be better than distorted placements. No fake upscaling or arbitrary minimum-pixel rejection. Catalogue names/test counts never establish visual approval.
   * Inspect selected assets and every exact pairing; bind reviews to source/draft/selection/asset hashes. Preserve original libraries and review only approved display subsets; no destructive archive cleanup. Report actual medical/client/reuse limitations.
   * Portable skills/guides and a shareable kit are stored in the repository, not dependent on the creator's home directory. Current source snapshots and verification details are in `docs/medical-anki/`.

9. **Cloudflare D1 & R2 Zero-Egress Architecture**:
   * Relational database queries use Cloudflare D1 (`a-plus-db`, UUID `47d271d7-0634-4db7-aa31-65cb1cd80af4`).
   * User progress JSON blobs use Cloudflare R2 (`a-plus-storage`).
   * Supabase is completely decommissioned and `@supabase/supabase-js` uninstalled; zero egress bandwidth limitations apply.
   * Data migration from Supabase exports is handled via `scripts/import-supabase-export.ts`.

---

## 3. The 4-Layer Memory Operating System

Knowledge in this repository is distributed across four coordinated tiers:

```
┌─────────────────────────────────────────────────────────────┐
│  Tier 1: Directives & Brand Invariants (Active Context)     │
│  Files: CLAUDE.md, AGENTS.md, docs/BRANDING.md, MEMORY.md   │
├─────────────────────────────────────────────────────────────┤
│  Tier 2: Structural Knowledge Graph (Graphify)              │
│  Files: graphify-out/graph.json, graph.html, wiki/index.md  │
│  Access: `graphify query "<topic>"`, `graphify path A B`   │
├─────────────────────────────────────────────────────────────┤
│  Tier 3: Episodic Session Memory (Claude-Mem + AgentMemory) │
│  Scope: Decisions, past debugging logs, user corrections   │
├─────────────────────────────────────────────────────────────┤
│  Tier 4: Codebase Snapshot Packaging (Repomix)              │
│  Tool: `repomix` via repomix.config.json (1.1M clean tokens)│
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Installed Skills & Tooling Roles

| Skill / Plugin | Scope | Exact Role in This Project |
|---|---|---|
| **`claude-hud`** | Statusline | Displays real-time context token usage, cost, and active tools in terminal statusline. |
| **`claude-mem`** | Episodic | SQLite + FTS5 cross-session memory capturing past fixes and architectural decisions. |
| **`caveman`** | Output | Enforces concise, telegraphic communication to eliminate AI filler and save context tokens. |
| **`ponytail`** | Code Gen | Enforces minimalist discipline (YAGNI): forbids adding unrequested dependencies or layers. |
| **`taste-skill`** | UI/UX | Prevents generic "AI-slop" landing pages, enforces deliberate typography and contrast. |
| **`apple-design`** | UI/UX | Apple Human Interface Guidelines: 44px touch targets, semantic dark/light, fluid layouts. |
| **`superpowers`** | Workflow | Strict TDD (Red-Green-Refactor), systematic debugging pipelines, and git worktrees. |
| **`karpathy-guidelines`**| Engineering | Surgical changes (touch only what you must), think before coding, loop until verified. |
| **`repomix`** | Snapshot | Packs clean repository slices for external model reviews or security audits. |
| **`graphify`** | Architecture| Queryable AST map; must be queried before reading raw files. Rebuilt on code modifications. |

---

## 5. Key File & Routing Anchors

* **Database & Routing Tests:**
  * Vitest Routing: `src/app/import-routing.test.ts`
  * Special Senses Tests: `src/app/special-senses.test.ts`
  * Bank Schema Validator: `data-format-v2/scripts/validate-banks.ts`
* **Core Application Entry & State:**
  * Main App Component: `src/app/App.tsx`
  * Quiz Engine Hook: `src/app/hooks/useQuizEngine.ts`
  * Progress Tracker: `src/app/hooks/useProgressHistory.ts`
* **Documentation Master Files:**
  * Master Architecture Encyclopedia: `docs/ARCHITECTURE_ENCYCLOPEDIA.md`
  * Brand Identity & Commandments: `docs/BRANDING.md`
  * Question Intake Workflow: `QUESTION_IMPORT_WORKFLOW.md`
  * UI Navigation Workflow: `WEBSITE_UI_WORKFLOW.md`
  * Agent Skills Playbook: `docs/AGENT_SKILLS_AND_MEMORY_PLAYBOOK.md`

---

## 6. MGL-3 GIT Practical Bank Architecture & Navigation Invariants

* **Canonical Structure:** Exactly 7 practical chapters totaling 891 questions in `src/app/data/practical/mgl-3-practical.json`:
  * **Chapter 301 (Anatomy - 315 Qs):** Split into 4 lecture modules (Module 1: 78 Qs, Module 2: 88 Qs, Module 3: 80 Qs, Module 4: 69 Qs).
  * **Chapter 302 (Histology - 183 Qs):** Split into 2 topics (Part 1: 86 Qs, Part 2: 97 Qs).
  * **Chapter 303 (Pathology - 145 Qs):** Single combined Pathology chapter splitting into 2 discrete topics: `Pathology Museum (Gross Jars)` (95 Qs, lecture 1) and `Pathology Lab (Microscopic Slides)` (50 Qs, lecture 2).
  * **Chapter 304 (Parasitology - 84 Qs):** 1 topic (84 spotters/cases including 18 high-res composite 5-panel figures).
  * **Chapter 305 (Microbiology - 51 Qs):** Split into 6 clinical cases (Cases 1 through 6).
  * **Chapter 306 (Physiology - 48 Qs):** 1 topic (48 clinical GI cases).
  * **Chapter 307 (Biochemistry - 65 Qs):** Split into 4 lab topics (Labs 1 through 4).
* **Topic Navigation Rule:** `toGitTopicChapter` in `src/app/lib/gitBank.ts` dynamically transforms each chapter's `lectureNames` into discrete selectable topic cards in `src/app/App.tsx`. Do NOT add bypasses returning raw un-split practical chapters.
* **Specimen Display:** Handled by `SpecimenViewer.tsx` featuring uncropped full view, inline 1x-3.5x zoom, pan dragging, and light/dark field inversion.

---

## 7. MUG-3 Urogenital System Architecture & Master Question Intake

* **Module Code:** `MUG-3` (Year 3 Semester 1, 10 Credit Points, 200 Marks).
* **Canonical Bank:** `src/imports/year-3/semester-1/MUG-3.json` (9,852 unique, production-grade questions, 20.68 MB).
* **Source Accounting (100% Cryptographic Parity):** All 201 source files across 11 directories in `/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/` (489.6 MB, 3,065 audited PDF pages) fully ingested and verified against `master-page-ledger.json` and `extraction-ledger.json`.
* **Zero-Defect Deduplication:** 7,988 extracted candidates merged and deduplicated against the baseline bank. Exactly 0 duplicate IDs and 0 duplicate `contentFingerprint` collisions (`deduplication-ledger.json`).
* **Chapter 301 Multidisciplinary Restructuring:** Added 7 missing curriculum subjects to Chapter 301 and relocated all 140 multidisciplinary questions misplaced in Chapter 1 Anatomy into their proper subject buckets.
* **100% Medical Accuracy & Mechanistic Explanations:**
  - 100% of questions verified against *Ain Shams Urogenital Module Textbook (4th Edition, Parts 1 & 2)* and faculty department answer keys.
  - 1,982 provisional student answer keys corrected to faculty consensus.
  - Standardized 4-part UWorld/AMBOSS architecture across all questions: (1) Faculty Model Answer & Scoring Rubric, (2) Clinical Pathophysiology/Mechanism, (3) High-Yield Clinical Pearl, (4) Direct Textbook & Lecture Citation.
  - 0 boilerplate or placeholder distractor texts across the entire bank.
* **Verification & Testing Status:**
  - `data-format-v2/scripts/validate-banks.ts`: All 42 banks pass with 0 errors.
  - `src/app/urogenital-bank.integration.test.ts`: 8/8 tests pass.
  - `src/app/import-routing.test.ts`: 27/27 tests pass.
  - Full Vitest suite: 176 test files, 1,034 tests pass (0 failures).
  - Production build (`npm run build`): Compiles clean (`dist/assets/MUG-3-Dh119Mmy.js`, 18,336 kB).
* **Ledgers & Documentation:** Complete in `docs/verification/urogenital-import/` (`extraction-ledger.json`, `master-page-ledger.json`, `deduplication-ledger.json`, `review-ledger.json`, `exclusion-ledger.json`, `intake-verification-report.md`, `TEST_READY.md`).


### Approved medical-card Extra layout (12 November 2026)

Both Basic and Cloze require the conditional Extra Section box: title, supplementary text and images centred; empty Extra hidden; main question/answer alignment unchanged. Preserve amber/gold revealed Cloze contrast. Use `.agents/skills/medical-anki-production/references/answer-layout.md` and the five matching `assets/` files; CSS alone does not create the Cloze wrapper. This supersedes the earlier Basic-only/left-aligned Extra guidance and does not authorise new card content or modification of existing APKGs.
