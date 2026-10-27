# Bank Audit Validate

> 22 nodes

## Key Concepts

- **ref_fs** (28 connections)
- **dedup-exact.ts** (4 connections) — `data-format-v2/scripts/dedup-exact.ts`
- **quality-audit.ts** (4 connections) — `data-format-v2/scripts/quality-audit.ts`
- **enrich-merge.ts** (3 connections) — `data-format-v2/scripts/enrich-merge.ts`
- **fix-targeted.ts** (3 connections) — `data-format-v2/scripts/fix-targeted.ts`
- **audit-biological.ts** (3 connections) — `output/audit-biological.ts`
- **validate-logic.ts** (2 connections) — `scripts/validate-logic.ts`
- **validate-question-bank.ts** (2 connections) — `scripts/validate-question-bank.ts`
- **bank** (1 connections) — `data-format-v2/scripts/dedup-exact.ts`
- **removed** (1 connections) — `data-format-v2/scripts/dedup-exact.ts`
- **textIndex** (1 connections) — `data-format-v2/scripts/dedup-exact.ts`
- **batch** (1 connections) — `data-format-v2/scripts/enrich-merge.ts`
- **lines** (1 connections) — `data-format-v2/scripts/enrich-merge.ts`
- **bank** (1 connections) — `data-format-v2/scripts/fix-targeted.ts`
- **report** (1 connections) — `data-format-v2/scripts/fix-targeted.ts`
- **bank** (1 connections) — `data-format-v2/scripts/quality-audit.ts`
- **questions** (1 connections) — `data-format-v2/scripts/quality-audit.ts`
- **textMap** (1 connections) — `data-format-v2/scripts/quality-audit.ts`
- **bank** (1 connections) — `output/audit-biological.ts`
- **issues** (1 connections) — `output/audit-biological.ts`
- **data** (1 connections) — `scripts/validate-logic.ts`
- **data** (1 connections) — `scripts/validate-question-bank.ts`

## Relationships

- [Final Bank Assemble](Final_Bank_Assemble.md) (3 shared connections)
- [Contradictions Audit Bank](Contradictions_Audit_Bank.md) (2 shared connections)
- [Section8 Blocks Existing](Section8_Blocks_Existing.md) (2 shared connections)
- [Fixes Merge Chunk](Fixes_Merge_Chunk.md) (1 shared connections)
- [Audit Consistency Bank](Audit_Consistency_Bank.md) (1 shared connections)
- [Clean Chunk Alllines](Clean_Chunk_Alllines.md) (1 shared connections)
- [Extract Biochem Blocks](Extract_Biochem_Blocks.md) (1 shared connections)
- [Extract Chunk Chunks](Extract_Chunk_Chunks.md) (1 shared connections)
- [Import Patho Essays](Import_Patho_Essays.md) (1 shared connections)
- [Manual Clean Blocks](Manual_Clean_Blocks.md) (1 shared connections)
- [Propagate Fixes Combined](Propagate_Fixes_Combined.md) (1 shared connections)
- [Recover Blocks Pieces](Recover_Blocks_Pieces.md) (1 shared connections)

## Source Files

- `data-format-v2/scripts/dedup-exact.ts`
- `data-format-v2/scripts/enrich-merge.ts`
- `data-format-v2/scripts/fix-targeted.ts`
- `data-format-v2/scripts/quality-audit.ts`
- `output/audit-biological.ts`
- `scripts/validate-logic.ts`
- `scripts/validate-question-bank.ts`

## Audit Trail

- EXTRACTED: 42 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*