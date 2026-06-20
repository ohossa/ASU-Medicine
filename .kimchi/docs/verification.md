# Verification Report

## Fix Applied

**File:** `src/app/App.tsx`

**Change:** Updated the `total` prop in `QuizResumeCard` to compute the correct total question count instead of using answered count.

**Before:**
```tsx
total={Object.keys(resumePayload.answers).length}
```

**After:**
```tsx
total={(() => {
  const sub = selectedChapter?.subjects.find(s => s.name === resumePayload?.subjectName);
  if (sub) return sub.questions.length;
  return selectedChapter?.subjects.flatMap(s => s.questions).length ?? 0;
})()}
```

## Test Output

```
Test Files  13 passed (13)
Tests       163 passed (163)
Duration    1.80s
```

All 163 tests passed.

## Lint Output

`npx tsc --noEmit` completed with no errors.

## Build Output

`npx vite build` completed successfully in 3.07s. Warning about large chunks is pre-existing and unrelated to this fix.

## Verdict

ALL_PASS