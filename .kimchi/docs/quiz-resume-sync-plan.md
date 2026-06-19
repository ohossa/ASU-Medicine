# Quiz Resume + Cloud Sync — Implementation Spec

**Status:** Ready to build
**Infra:** Already exists (api/sync.ts + useCloudSync.ts)
**Complexity:** Medium — 4 chunks, ~5 files

---

## Goal
No student ever loses quiz progress again. Refresh, close the browser, or switch devices — the quiz picks up exactly where they left off.

---

## Architecture Overview

We **reuse the existing cloud sync infrastructure**:
- `api/sync.ts` (Redis/Upstash + Clerk auth) ✅
- `useCloudSync.ts` (pushes localStorage to cloud automatically) ✅

The missing layer is **quiz-session local persistence** that feeds into the above.

```
Quiz start → check localStorage for saved session
           → found? show ResumeDialog
           → user: resume → hydrate useQuizEngine from saved state
           → user: restart → delete saved session, start fresh

During quiz → debounced save to localStorage (every 2s)
           → triggerCloudSync() pushes to cloud

Finish quiz → delete saved session
           → save result to history (existing)
```

---

## Decisions (Made — Override If You Disagree)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Resume UX** | Dialog: "Resume Question 12/30 · 8:24 elapsed" + buttons: Resume / Restart Fresh / Cancel | Student sees exact state, explicit choice |
| **What gets saved** | current + answers + elapsedSeconds + flagged + essayDraft + showEssayAnswer + completed | Everything needed to reconstruct identical state |
| **Cross-device conflict** | Last-write-wins | Solo study app — simultaneous multi-device same quiz is edge case |
| **Offline behavior** | Local first (localStorage), auto-sync when online via existing `useCloudSync` | Robust, works on subway/airplane |
| **Retention** | Until quiz completed or explicitly abandoned (dialog button) | No arbitrary deletion |
| **Guest mode** | LocalStorage only, no cloud sync | No auth = no cloud |
| **Storage key** | `asu_quiz_session:${userId}:${chapterId}:${subjectId}` or `asu_quiz_session:${chapterId}:${subjectId}` (guest) | Scoped per user + chapter + subject |

---

## Chunk 1: Expand `useQuizEngine` — Accept Saved State

**File:** `src/app/hooks/useQuizEngine.ts`

Add optional initial-state params to `UseQuizEngineOptions`:

```ts
interface UseQuizEngineOptions {
  questions: Question[];
  onFinish: (session: QuizSession) => void;
  timerMode?: 'off' | 'practice';
  targetQuestionCount?: number;
  initialAnswers?: Record<number, unknown>;
  initialCurrent?: number;
  initialElapsedSeconds?: number;
  initialFlagged?: number[];
  initialFinished?: boolean;
  initialConfirmFinish?: boolean;
  initialShowGrid?: boolean;
  initialShowShortcuts?: boolean;
}
```

Inside the hook, use these to seed the `useState` calls instead of the hardcoded `0` / `new Set()` defaults.

**Acceptance:**
- `createHook({ initialCurrent: 5, initialAnswers: {0:2, 1:0}, initialElapsedSeconds: 120 })` starts at Q6 with answers already filled in.
- Tests updated to cover initial state.

---

## Chunk 2: Auto-Save + Resume Detection

**Files:**
- `src/app/hooks/useQuizSession.ts` *(new)* — save/load/clear
- `src/app/components/QuizInterface.tsx` — integrate

### `useQuizSession.ts` — new hook

Responsibilities:
1. `save(session: QuizSessionSave, userId: string | null)` → localStorage + `triggerCloudSync()`
2. `load(chapterId, subjectId, userId)` → parse from localStorage or null
3. `clear(chapterId, subjectId, userId)` → delete localStorage key + push empty to cloud
4. `hasSavedSession(...)` → boolean

```ts
export interface QuizSessionSave {
  current: number;
  answers: Record<number, unknown>;
  elapsedSeconds: number;
  flagged: number[];
  finished: boolean;
  confirmFinish: boolean;
  showGrid: boolean;
  showShortcuts: boolean;
  timerMode: TimerMode;
  timestamp: number;
}
```

Auto-save inside QuizInterface:
```tsx
useEffect(() => {
  const timeout = setTimeout(() => {
    saveSession({ current, answers, elapsedSeconds, flagged: [...flagged], ... });
  }, 2000);
  return () => clearTimeout(timeout);
}, [current, answers, elapsedSeconds, flagged, finished, timerMode]);
```

### Resume Flow in QuizInterface

On mount (before rendering quiz):
1. Call `hasSavedSession(chapterId, subjectId, clerkUserId)`
2. If found + not completed → render `<ResumeDialog>` overlay on top of quiz
3. Dialog content:
   ```
   ⏸ You have a saved session
   Question 12 of 30  ·  8:24 elapsed
   [Resume]  [Restart Fresh]  [Cancel]
   ```
4. "Resume" → load saved state → pass to `useQuizEngine({ ...initialState })` → dismiss dialog
5. "Restart Fresh" → `clearSession(...)` → start fresh
6. "Cancel" → hide dialog but don't delete session (user can decide later)

**Acceptance:**
- Refreshing mid-quiz restores exact position, answers, and timer
- Switching devices pulls saved session from cloud and shows resume dialog
- Auto-save fires no more than once per 2 seconds
- Session cleared on finish or restart

---

## Chunk 3: Resume Dialog UI

**File:** `src/app/components/ResumeDialog.tsx` *(new)*

- Centered modal with `AnimatePresence` + `FocusTrap`
- Shows progress bar, elapsed time, current question number
- Three actions: Resume (primary), Restart Fresh (secondary), Cancel (text button)
- Respects reduced-motion and RTL

## Chunk 4: Integration & Tests

**Files touched:**
- `QuizInterface.tsx` — mount resume check + auto-save
- `App.tsx` — ensure `useCloudSync` is mounted at app root (check it's already there)
- `useQuizEngine.ts` — accept initial state
- `useQuizEngine.test.ts` — test initial state hydration
- Add 2 new tests for `useQuizSession.ts`

**Acceptance:**
- Complete quiz flow: start → answer 5 questions → F5 → restore exact Q6 with prior answers intact
- Cross-device: finish 8 questions on laptop → open on phone → resume from Q9
- Offline: answer questions on airplane mode → come online → sync pushes next time quiz auto-saves
- No `any` types. ESLint 0. Tests pass.

---

## Data Flow Diagram

```
┌──────────────┐     setAnswer/goTo/flag     ┌──────────────┐
│ useQuizEngine│ ───────────────────────────▶ │QuizInterface │
│   (state)    │◀──────────────────────────── │ (auto-save)  │
└──────────────┘           every 2s           └──────┬───────┘
                                                     │
                                                     ▼
                                            ┌──────────────┐
                                            │  localStorage│
                                            │ quiz_session │
                                            └──────┬───────┘
                                                     │ triggerCloudSync()
                                                     ▼
                                            ┌──────────────┐
                                            │   Upstash    │
                                            │    Redis     │
                                            └──────────────┘
```

---

## Open Questions (Answer Before Build)

1. **Abandon button?** Should the resume dialog have an explicit "Abandon & Delete" button, or is "Restart Fresh" sufficient?
2. **Multiple incomplete quizzes?** Can a student have 3 different chapters all partially done? (localStorage key includes chapterId, so yes — fully supported.)
3. **Timer pause while away?** If you close the tab and come back 2 hours later, should elapsedSeconds continue from where it was, or reset? (My default: **continue** — the timer measures total active study time, not wall-clock. Pausing penalizes nothing.)

---

## Build Schedule

| Chunk | File(s) | Complexity | Est. Effort |
|-------|---------|-----------|-------------|
| 1 | useQuizEngine.ts + test | Simple | 15 min |
| 2 | useQuizSession.ts + QuizInterface | Medium | 40 min |
| 3 | ResumeDialog.tsx | Simple | 20 min |
| 4 | Integration + tests + verify | Medium | 25 min |

**Total: ~4 files, 1.5 hours of focused work.**

---

Approve this plan or tell me what to change — then I'll build the whole thing in one go.