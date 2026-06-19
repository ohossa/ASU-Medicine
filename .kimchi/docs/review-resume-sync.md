# Code Review: Quiz Resume + Cloud Sync Feature

**Reviewer:** kimchi review agent
**Date:** 2026-06-20
**Files reviewed:**
- `src/app/hooks/useQuizSession.ts`
- `src/app/components/QuizResumeCard.tsx`
- `src/app/hooks/useQuizEngine.ts`
- `src/app/components/QuizInterface.tsx`
- `src/app/App.tsx`
- `src/app/hooks/useCloudSync.ts`
- `src/app/utils/storage.ts`
- `api/sync.ts`
- `src/app/components/TimerSettingsPanel.tsx`

---

## VERDICT: NEEDS_FIXES

The resume flow is architecturally broken: `savedSession` is loaded, displayed in the resume card, and passed to `QuizInterface`, but it is **never forwarded to `useQuizEngine`** for hydration. The quiz engine is always initialized fresh with empty state. Several other correctness and cloud-sync integration bugs are documented below.

---

## ISSUE 1: savedSession Never Hydrates the Quiz Engine (CRITICAL)

**File:** `src/app/components/QuizInterface.tsx`
**Lines:** 79-99 (engine initialization) and 82 (Props interface)

**Problem:**

`QuizInterface` accepts `savedSession?: QuizSessionSave` as a prop and correctly uses it to restore `showEssayAnswer` (line 119: `useState(() => savedSession?.showEssayAnswer ?? false)`), but `useQuizEngine` is called with **no initial state** from the saved session:

```tsx
// Line 85-88 — engine initialized with empty defaults always
const engine = useQuizEngine({
  questions,
  onFinish: (session) => onFinish(session.answers, session.elapsedSeconds, session.flaggedQuestions),
});
```

`useQuizEngine` accepts `initialAnswers`, `initialCurrent`, `initialElapsedSeconds`, `initialFlagged`, `initialFinished` — none of which are populated from `savedSession`.

**Consequence:** The resume card shows "Resume from Q15" (correct), the user clicks Resume, `quizPayload.savedSession` is set correctly in App.tsx line 1043, but `QuizInterface` renders a **brand new quiz starting at Q1** with no answers. The user loses all progress.

**Suggested fix:**

```tsx
const engine = useQuizEngine({
  questions,
  onFinish: (session) => onFinish(session.answers, session.elapsedSeconds, session.flaggedQuestions),
  initialAnswers: savedSession?.answers,
  initialCurrent: savedSession?.current ?? 0,
  initialElapsedSeconds: savedSession?.elapsedSeconds ?? 0,
  initialFlagged: savedSession?.flagged,
  initialFinished: savedSession?.finished ?? false,
});
```

Also initialize `elapsedSeconds` state in the engine if not already done via `initialElapsedSeconds`.

---

## ISSUE 2: Essay Draft Text is Never Saved to localStorage

**File:** `src/app/components/QuizInterface.tsx`
**Lines:** 200-220 (auto-save)

**Problem:**

The `essayDraft` state variable holds the user's in-progress essay text as they type (updated by `setEssayDraft` in the textarea onChange). However, every auto-save call hardcodes `essayDrafts: {}`:

```tsx
// Line 217
saveQuizSession({
  ...
  essayDrafts: {},   // <—— ALWAYS EMPTY
});
```

If the user types an essay answer, then navigates away or the browser crashes before the next save, the draft is lost. Only the `showEssayAnswer` flag is persisted. `QuizSessionSave.essayDrafts` is defined in the schema but never populated.

**Suggested fix:**

Maintain a `essayDraftsRef` (or `essayDrafts` state) that mirrors the essay draft state. On every sync tick:

```tsx
const essayDraftsRef = useRef<Record<number, string>>({});
// Keep in sync with essayDraft state changes

// In auto-save:
essayDrafts: essayDraftsRef.current,
```

Also initialize essay drafts from `savedSession.essayDrafts` on resume.

---

## ISSUE 3: `isSaving.current` Race Condition — Silent Save Drops

**File:** `src/app/hooks/useQuizSession.ts`
**Lines:** 21-23 and 35-37

**Problem:**

The `isSaving.current` guard uses `requestAnimationFrame` to reset the flag, but this introduces a race window:

```tsx
const save = useCallback((payload, userId?) => {
  if (isSaving.current) return;          // Guard
  isSaving.current = true;
  try {
    ...
  } catch { /* no-op */ }
  requestAnimationFrame(() => {
    isSaving.current = false;            // Resets ~16ms later
  });
}, []);
```

If two save triggers arrive within ~16ms (e.g., user rapidly navigating + auto-save firing simultaneously), the second save is silently dropped because the RAF callback hasn't fired yet. This is especially likely when the user finishes a quiz (which calls `clear` + `triggerCloudSync`) immediately after the last auto-save tick.

**Suggested fix:** Reset synchronously after the try block, or remove the RAF wrapper:

```tsx
const save = useCallback((payload, userId?) => {
  if (isSaving.current) return;
  isSaving.current = true;
  try {
    ...
  } finally {
    isSaving.current = false;
  }
}, []);
```

---

## ISSUE 4: Quiz Session Keys Excluded from Cloud Sync Push

**File:** `src/app/hooks/useCloudSync.ts`
**Lines:** 7-30 (STORAGE_KEYS list) and 38-48 (dynamic key collection)

**Problem:**

Quiz session keys follow the pattern `asu_quiz_session:{uid}:{chapterId}:{subjectName}` (as defined in `useQuizSession.ts` `getKey()`). They are **not** in the static `STORAGE_KEYS` array. The dynamic key collection loop only finds keys with the `asu_study_tracker_` prefix:

```tsx
// useCloudSync.ts lines 38-48
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('asu_study_tracker_')) {  // <—— WRONG PREFIX
    ...
  }
}
```

`asu_quiz_session:*` does not start with `asu_study_tracker_`, so quiz session data is **not included in the cloud push payload**.

**Impact on cross-device resume:** Quiz sessions are saved to localStorage and synced to Redis (via POST to `/api/sync`). They survive the initial pull. But on subsequent pushes (after a resume, a new session, etc.), quiz session keys are dropped from the payload, meaning the Redis record becomes stale. On a new device, the user would pull the Redis state and get old or missing session data.

**Suggested fix:** Add `asu_quiz_session` as a discovered prefix in the dynamic loop:

```tsx
if (key && (
  key.startsWith('asu_study_tracker_') ||
  key.startsWith('asu_quiz_session:')
)) {
  ...
}
```

Or simply remove the prefix filter and include all keys:

```tsx
if (key && key.startsWith('asu_')) {
  // include all asu_-prefixed keys
}
```

---

## ISSUE 5: TimerMode Type Missing 'exam' Variant

**File:** `src/app/components/TimerSettingsPanel.tsx`
**Line:** 1 (export type) and `src/app/components/QuizInterface.tsx` line 125

**Problem:**

`TimerSettingsPanel` defines and exports:

```tsx
export type TimerMode = 'off' | 'practice';
```

But `QuizInterface` uses a state that includes `'exam'`:

```tsx
// QuizInterface.tsx line 125
const [timerMode, setTimerMode] = useState<'off' | 'practice' | 'exam'>('practice');
```

This is a TypeScript type error (assigning `'exam'` to a type that only allows `'off' | 'practice'`). It does not cause a runtime crash because no code path currently sets `timerMode` to `'exam'` — but it is latent. If a future code path or the settings panel adds `'exam'`, the type system will not catch it.

**Suggested fix:** Add `'exam'` to the `TimerMode` type in `TimerSettingsPanel.tsx`:

```tsx
export type TimerMode = 'off' | 'practice' | 'exam';
```

And update the settings panel button array accordingly.

---

## ISSUE 6: quizDataRef.answers Uses Loose `unknown` Type

**File:** `src/app/components/QuizInterface.tsx`
**Line:** 200

**Problem:**

```tsx
const quizDataRef = useRef({ ... answers: {} as Record<number, unknown> ...
```

The answers map should be `Record<number, QuizAnswer>` to match what `useQuizEngine` produces (`Record<number, unknown>` from `answers` state). Using `unknown` is loose and can mask type errors. The save payload `answers: d.answers` is then `Record<number, unknown>` but `QuizSessionSave.answers` is typed as `Record<number, QuizAnswer>`.

**Suggested fix:**

```tsx
import type { QuizAnswer } from '../types';
const quizDataRef = useRef({ ... answers: {} as Record<number, QuizAnswer>, ...
```

---

## ISSUE 7: No Session Cleanup on Quiz Finish

**File:** `src/app/hooks/useQuizSession.ts`
**Affected:** `useQuizSession.clear()` is never called after `handleFinishQuiz` in App.tsx

**Problem:**

When a quiz is completed (user clicks Submit), `handleFinishQuiz` in App.tsx calls `saveQuizResult` and navigates to the results screen. The `clear()` function of `useQuizSession` is never called. The session key in localStorage (`asu_quiz_session:uid:chapterId:subjectName`) persists indefinitely.

Impact:
- `handleSelectSubject` will find the session and show the resume card — but the session's `finished` flag is `true`, so the `if (saved && !saved.finished)` check in `handleSelectSubject` correctly prevents showing the resume card.
- However, the orphaned key remains in localStorage forever, adding noise. For users who switch accounts or share devices, stale sessions accumulate.
- More critically: since the session is not cleared, if `finished` were somehow `false` for a completed quiz (edge case: user clicks Submit then rapidly closes the tab before the state update), the resume card would incorrectly appear.

**Suggested fix:** Call `clearQuizSession` in `handleFinishQuiz`:

```tsx
const handleFinishQuiz = (...) => {
  saveQuizResult({ ... });
  clearQuizSession(quizPayload!.chapter.id, quizPayload!.subject?.name ?? 'all');
  transitionTo(() => { ... });
};
```

Also add a guard in `handleSelectSubject` for `saved.finished`:

```tsx
if (saved && !saved.finished && Date.now() - saved.timestamp < 7 * 24 * 60 * 60 * 1000) {
  // Only show resume card if session is unfinished AND less than 7 days old
  setResumePayload(saved);
  return;
}
```

---

## ISSUE 8: No Redis TTL — Unlimited Data Accumulation

**File:** `api/sync.ts`
**Line:** 79 (dbClient.set call)

**Problem:**

The `api/sync.ts` handler stores all user data in Redis using:

```tsx
await dbClient.set(redisKey, data);
```

No TTL or expiration is set. The Upstash free tier is capped at **30MB total storage** across all keys. With unbounded writes and no eviction policy, the storage will eventually fill up, causing subsequent `set` operations to fail (Upstash returns errors on quota exhaustion rather than evicting).

**Redis storage analysis:**

| Session Type | Per-Session Size (JSON) | Free Tier Capacity (30MB) |
|---|---|---|
| 30 MCQ questions | ~12–18 KB | ~1,700 – 2,500 sessions |
| 50 essay questions (with drafts) | ~80–150 KB | ~200 – 375 sessions |
| Case study (10 sub-questions) | ~15–25 KB | ~1,200 – 2,000 sessions |
| Per user, 10-chapter module (MCQ only) | ~120–180 KB | ~165 – 250 modules |
| Per user, 10-chapter module (essay-heavy) | ~600–1,200 KB | ~25 – 50 modules |

**Assumptions for MCQ estimate:** Each answer object ~200 bytes (questionIndex: int, selectedOption: int, isCorrect: bool, timestamp). With 30 answers + metadata, total ~12–18 KB per session.

**Assumptions for essay estimate:** Each essay answer includes a `text` field that can be 500–2,000 characters. 50 essays × 1,500 chars = ~75KB of text alone, plus overhead → 80–150 KB.

**Assumptions for case study:** Sub-question answers are small (int indices or short strings). 10 sub-questions × ~1KB = ~10–15 KB.

**Suggested fix:** Add TTL on every Redis write:

```tsx
await dbClient.set(redisKey, data, { EX: 60 * 60 * 24 * 30 }); // 30-day TTL
```

Also implement a cleanup strategy for `asu_quiz_session:*` localStorage keys older than 7 days. Add a retention check on app startup:

```tsx
const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const cleanupOldSessions = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('asu_quiz_session:')) {
      try {
        const session = JSON.parse(localStorage.getItem(key)!);
        if (Date.now() - session.timestamp > MAX_SESSION_AGE_MS) {
          localStorage.removeItem(key);
        }
      } catch {}
    }
  }
};
// Call cleanupOldSessions() on app init
```

---

## Cloud Sync Trace: Full Data Flow (BFS)

### Step 1 — Auto-save tick (every 2 seconds)

```
QuizInterface useEffect (setInterval 2000ms)
  → reads quizDataRef.current (synchronized via useLayoutEffect)
  → saveQuizSession({
      chapterId: 5,
      subjectName: "Thyroid Disorders",
      current: 14,
      answers: { 0: 2, 1: 0, 2: 3, ... },   // Record<number, unknown>
      elapsedSeconds: 847,
      flagged: [3, 7, 12],
      finished: false,
      timerMode: "practice",
      showEssayAnswer: true,
      essayDrafts: {},                       // BUG: always empty
    })
```

### Step 2 — localStorage write

```
useQuizSession.save()
  → key = "asu_quiz_session:{userId}:{chapterId}:{subjectName}"
  → localStorage.setItem(key, JSON.stringify(session))
  → triggerCloudSync()
```

Key format: `asu_quiz_session:user_abc123:5:Thyroid Disorders`

### Step 3 — Cloud sync trigger (debounced, 500ms)

```
triggerCloudSync()
  → window.dispatchEvent(new Event('trigger-cloud-sync'))
  → useCloudSync listener fires → pushData()
  → collect all localStorage keys (BUG: asu_quiz_session:* not collected)
  → POST /api/sync with Bearer token
```

**BUG:** `STORAGE_KEYS` is a static array that does NOT include quiz session keys. The dynamic key loop only covers `asu_study_tracker_*`. Quiz session keys are silently excluded from every cloud push after the initial sync. See Issue 4.

### Step 4 — API handler (api/sync.ts)

```
POST /api/sync
  → verifyToken(token) via @clerk/backend
  → userId = verified.sub
  → redisKey = "user_data:{userId}"
  → await dbClient.set(redisKey, payload)   // NO TTL SET
  → 200 OK
```

Redis key: `user_data:user_abc123`
Value: Full JSON blob of all localStorage data (all `asu_*` keys).

### Step 5 — On another device (initial pull on sign-in)

```
useCloudSync useEffect (on mount, when isSignedIn changes)
  → GET /api/sync
  → const { data } = await res.json()
  → data["asu_quiz_session:user_abc123:5:Thyroid Disorders"]
      = { chapterId: 5, subjectName: "Thyroid Disorders", current: 14, ... }
  → localStorage.setItem(key, JSON.stringify(value))
  → window.dispatchEvent(new Event('storage'))
  → App.tsx storage listener fires (for asu_medical_student_year only — other keys not reactive)
```

### Step 6 — Resume on new device

```
handleSelectSubject(subject, questions)
  → loadQuizSession(5, "Thyroid Disorders")
  → saved = { current: 14, answers: {...}, ... }
  → !saved.finished === true
  → setResumePayload(saved)
  → QuizResumeCard renders with current=14

onResume()
  → quizPayload = { chapter, subject, questions, savedSession: resumePayload }
  → QuizInterface renders with savedSession prop

  BUT: useQuizEngine({ initialAnswers: {} })  ← EMPTY (BUG: not hydrated)
  → Quiz starts at Q1, all progress lost
```

### Step 7 — Session cleared on finish

```
User clicks Finish → handleFinishQuiz()
  → saveQuizResult({ ... })          ← to history localStorage
  → triggerCloudSync()               ← push updated history to cloud
  → transitionTo(() => {
      setResultPayload(...);
      setScreen('results');
    })
  → QuizInterface unmounts → clearInterval() stops auto-save
```

`clearQuizSession()` is **NOT called** — see Issue 7.

---

## Summary Table

| # | Severity | File | Line(s) | Issue |
|---|---|---|---|---|
| 1 | **CRITICAL** | QuizInterface.tsx | 85-88 | `savedSession` not passed to `useQuizEngine` — progress lost on resume |
| 2 | HIGH | QuizInterface.tsx | 217 | `essayDrafts: {}` — essay text always lost on crash/navigation |
| 3 | MEDIUM | useQuizSession.ts | 21-23 | `isSaving.current` RAF race condition — silent save drops |
| 4 | **HIGH** | useCloudSync.ts | 38-48 | `asu_quiz_session:*` keys excluded from cloud push |
| 5 | LOW | TimerSettingsPanel.tsx | 1 | `TimerMode` missing `'exam'` variant |
| 6 | LOW | QuizInterface.tsx | 200 | `answers: unknown` — loose type; should be `QuizAnswer` |
| 7 | MEDIUM | App.tsx / useQuizSession.ts | `handleFinishQuiz` | Session not cleared on finish — orphaned keys accumulate |
| 8 | MEDIUM | api/sync.ts | 79 | No Redis TTL — 30MB free tier will fill with no eviction |

---

## What Works Correctly

- **Resume card rendering:** `QuizResumeCard` correctly displays `current`, `total` (answer count), `elapsedSeconds`, `answeredCount`. The UI is sound.
- **Resume/Restart state machine in App.tsx:** `resumePayload` state, `handleSelectSubject` session detection, `onResume` and `onRestart` handlers are logically correct (aside from the hydration bug in the engine).
- **Auto-save interval termination on unmount:** The `useEffect` cleanup `() => clearInterval(timer)` correctly stops the interval when `QuizInterface` unmounts.
- **`finished` guard:** `handleSelectSubject` correctly checks `!saved.finished` before showing the resume card, preventing showing resume for completed quizzes.
- **`showEssayAnswer` state restoration:** `useState(() => savedSession?.showEssayAnswer ?? false)` correctly restores essay answer visibility on resume.
- **Cloud sync pull (initial):** First-time sign-in pull correctly restores all localStorage keys from Redis.
- **`triggerCloudSync` debouncing:** The 500ms debounce correctly batches rapid saves.
- **`clear` function in useQuizSession:** Correctly removes the localStorage key and triggers cloud sync.
- **No circular imports detected:** The `useCloudSync` ↔ `useQuizSession` import chain is shallow and resolves correctly at runtime.
- **API auth:** Clerk JWT verification is correctly implemented in `api/sync.ts`.
- **Payload size limit:** 2MB cap in `api/sync.ts` protects against oversized payloads.