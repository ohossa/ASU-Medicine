# BRIEFING — 2026-06-10T18:41:17Z

## Mission
Optimize the Core Web Vitals (LCP, CLS, INP, FCP) for the ASU Medicine React SPA (Vite) as per ORIGINAL_REQUEST.md.

## 🔒 My Identity
- Archetype: orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/.agents/orchestrator
- Original parent: top-level
- Original parent conversation ID: 4335e309-f152-4cfb-a5a5-1abfeadd987c

## 🔒 My Workflow
- **Pattern**: Project (Iteration Loop)
- **Scope document**: /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/PROJECT.md
1. **Decompose**: The scope is optimizing CWV for the SPA. Fits one iteration loop because it's localized performance optimizations. Wait, the scope covers LCP, CLS, INP, and FCP. I'll define it as a single milestone "CWV Optimization" or decompose into two milestones: 1. LCP & CLS, 2. INP & FCP. Let's decompose into 1 milestone for simplicity.
2. **Dispatch & Execute**:
   - **Direct (iteration loop)**: Explorer → Worker → Reviewer → gate
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Self-succeed at 16 spawns, write handoff.md, spawn successor.
- **Work items**:
  1. Audit CWV (Explorer) [pending]
  2. Implement LCP & CLS fixes (Worker) [pending]
  3. Implement INP & FCP fixes (Worker) [pending]
  4. Review & Verification (Reviewer) [pending]
- **Current phase**: 1
- **Current focus**: Audit

## 🔒 Key Constraints
- Never write, modify, or create source code files directly.
- Never run build/test commands yourself — require workers to do so.
- Audit gating is MANDATORY before reporting completion.

## Current Parent
- Conversation ID: 4335e309-f152-4cfb-a5a5-1abfeadd987c
- Updated: not yet

## Key Decisions Made
- Use teamwork_preview_explorer to audit and define the fix strategy.
- Use teamwork_preview_worker to apply fixes.
- Use teamwork_preview_reviewer to verify fixes against DevTools steps and acceptance criteria.
- Use teamwork_preview_auditor for integrity check.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|

## Succession Status
- Succession required: no
- Spawn count: 0 / 16
- Pending subagents: none
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: not started
- Safety timer: none

## Artifact Index
- /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/.agents/ORIGINAL_REQUEST.md — Original requirements
- /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/PROJECT.md — Architecture and milestones
