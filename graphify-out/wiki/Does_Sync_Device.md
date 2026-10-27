# Does Sync Device

> 16 nodes

## Key Concepts

- **Cross-Device Quiz Resume Sync — Debug Review** (15 connections) — `.kimchi/docs/debug-resume-sync.md`
- **A. localStorage key format written by `saveQuizSession`** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **B. Does `useCloudSync.pushData()` include `asu_quiz_session:` keys?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **C. Does `api/sync.ts` POST handler correctly store per-key values in Redis?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **Critical Issue Found: `savedSession.essayDrafts` Type Mismatch** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **D. Does `api/sync.ts` GET handler correctly return these keys?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **E. Does `useCloudSync.pullData()` restore keys to localStorage on the new device?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **F. Does the debounced auto-save effect in `QuizInterface.tsx` actually fire?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **G. Is the auto-save silenced by a `finished` guard or broken `useLayoutEffect`?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **H. Does `useQuizSession.save` have a silent `try/catch`?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **I. Is there an `isSaving.current` race that drops saves?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **J. Does the `useEffect` in `QuizInterface` have the correct dependency array?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **K. What hostname/port does mobile browser hit for `/api/sync`?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **L. Is `/api/sync` an absolute or relative URL?** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **Potential Root Cause for Cross-Device Failure** (1 connections) — `.kimchi/docs/debug-resume-sync.md`
- **Summary of Findings** (1 connections) — `.kimchi/docs/debug-resume-sync.md`

## Relationships

- No strong cross-community connections detected

## Source Files

- `.kimchi/docs/debug-resume-sync.md`

## Audit Trail

- EXTRACTED: 15 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*