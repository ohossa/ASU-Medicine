# ASU Medical Portal — Master Implementer Prompt

> **Copy-paste this entire document into your AI agent (Antigravity, Cursor Agent, etc.).**
> Every destructive change is preceded by a git commit and includes a revert command.
> If anything breaks, run the nuclear option: `git reset --hard pre-audit-backup`

---

## Phase 0 — Create Baseline & Safety Branch

**Purpose:** Lock in the current state before a single file is edited.

**Prerequisites:** You are in `/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal` on branch `main`.

### 0.1 Inspect current state
```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
git status --short
npm run build 2>&1 | tail -5
```

### 0.2 Commit current uncommitted changes
```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
git add -A
git commit -m "BASELINE: pre-audit state"
```

### 0.3 Create safety branch
```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
git branch pre-audit-backup
```

### 0.4 Verify
```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
git log --oneline -1 | grep -q "BASELINE: pre-audit state" && echo "OK" || echo "FAIL"
git branch --list | grep -q "pre-audit-backup" && echo "OK" || echo "FAIL"
npm run build 2>&1 | (grep -q "dist" && echo "OK build") || echo "FAIL"
```

### 🔁 Revert this entire phase
```bash
git reset --hard pre-audit-backup
```

> ⚠️ **Nuclear Option:** This command instantly undoes every change made by this prompt, no matter how many phases deep.

---


## Phase 1 — Dead Code & Dependency Removal

> ⚠️ Every sub-step ends with a commit. If anything breaks, revert that single commit.

---

### 1.1 Delete dead Vite template `src/App.tsx`

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
rm src/App.tsx
```

**Commit:**
```bash
git add -A && git commit -m "cleanup: remove dead Vite template App.tsx"
```

**Revert:**
```bash
git revert HEAD
```

**Verify:**
```bash
test ! -f src/App.tsx && echo "OK" || echo "FAIL"
```

---

### 1.2 Delete dead UI primitives (49 files)

Keep only `InteractiveBackground.tsx` and `StackedCarousel.tsx`.

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
cd src/app/components/ui/
ls | grep -vx "InteractiveBackground.tsx" | grep -vx "StackedCarousel.tsx" | xargs rm -f
cd -
```

**Commit:**
```bash
git add -A && git commit -m "cleanup: remove 49 unused UI primitive components"
```

**Revert:**
```bash
git revert HEAD
```

**Verify:**
```bash
ls src/app/components/ui/ | sort | diff - <(echo -e "InteractiveBackground.tsx\nStackedCarousel.tsx") && echo "OK" || echo "FAIL"
```

---

### 1.3 Remove unused dependencies — Batch 1 (completely unused)

Packages with zero imports anywhere in production code.

Edit `package.json` and delete these exact lines in `dependencies`:
- `"@emotion/react": "11.14.0",`
- `"@emotion/styled": "11.14.1",`
- `"@mui/icons-material": "7.3.5",`
- `"@mui/material": "7.3.5",`
- `"@popperjs/core": "2.11.8",`
- `"react-popper": "2.3.0",`
- `"react-dnd": "16.0.1",`
- `"react-dnd-html5-backend": "16.0.1",`
- `"react-slick": "0.31.0",`
- `"react-responsive-masonry": "2.7.1",`
- `"date-fns": "3.6.0",`
- `"ecc-universal": "^2.0.0",`

Then run:
```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
npm install
npm run build
```

**Commit:**
```bash
git add -A && git commit -m "cleanup: remove 12 unused runtime dependencies (batch 1)"
```

**Revert:**
```bash
git revert HEAD && npm install
```

**Verify:**
```bash
! grep -qE '"@emotion/react"|"@mui/material"|"react-dnd"|"react-slick"|"ecc-universal"' package.json && echo "OK" || echo "FAIL"
```

---

### 1.4 Remove unused dependencies — Batch 2 (UI-primitive-only deps)

These were used solely by the 49 dead UI primitives.

Edit `package.json` and delete these exact lines in `dependencies`:
**All 20 @radix-ui/* packages:**
- `"@radix-ui/react-accordion": "1.2.3",`
- `"@radix-ui/react-alert-dialog": "1.1.6",`
- `"@radix-ui/react-aspect-ratio": "1.1.2",`
- `"@radix-ui/react-avatar": "1.1.3",`
- `"@radix-ui/react-checkbox": "1.1.4",`
- `"@radix-ui/react-collapsible": "1.1.3",`
- `"@radix-ui/react-context-menu": "2.2.6",`
- `"@radix-ui/react-dialog": "1.1.6",`
- `"@radix-ui/react-dropdown-menu": "2.1.6",`
- `"@radix-ui/react-hover-card": "1.1.6",`
- `"@radix-ui/react-label": "2.1.2",`
- `"@radix-ui/react-menubar": "1.1.6",`
- `"@radix-ui/react-navigation-menu": "1.2.5",`
- `"@radix-ui/react-popover": "1.1.6",`
- `"@radix-ui/react-progress": "1.1.2",`
- `"@radix-ui/react-radio-group": "1.2.3",`
- `"@radix-ui/react-scroll-area": "1.2.3",`
- `"@radix-ui/react-select": "2.1.6",`
- `"@radix-ui/react-separator": "1.1.2",`
- `"@radix-ui/react-slider": "1.2.3",`
- `"@radix-ui/react-slot": "1.1.2",`
- `"@radix-ui/react-switch": "1.1.3",`
- `"@radix-ui/react-tabs": "1.1.3",`
- `"@radix-ui/react-toggle": "1.1.2",`
- `"@radix-ui/react-toggle-group": "1.1.2",`
- `"@radix-ui/react-tooltip": "1.1.8",`

**Other dead UI-only packages:**
- `"recharts": "2.15.2",`
- `"cmdk": "1.1.1",`
- `"vaul": "1.1.2",`
- `"react-day-picker": "8.10.1",`
- `"input-otp": "1.4.2",`
- `"embla-carousel-react": "8.6.0",`
- `"react-resizable-panels": "2.1.7",`
- `"react-hook-form": "7.55.0",`
- `"sonner": "2.0.3",`
- `"next-themes": "0.4.6",`
- `"class-variance-authority": "0.7.1",`
- `"clsx": "2.1.1",`
- `"tailwind-merge": "3.2.0",`

Then run:
```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
npm install
npm run build
```

**Commit:**
```bash
git add -A && git commit -m "cleanup: remove 33 dead UI-only dependencies (batch 2)"
```

**Revert:**
```bash
git revert HEAD && npm install
```

**Verify:**
```bash
! grep -qE '"@radix-ui/react-accordion"|"cmdk"|"vaul"|"recharts"|"input-otp"' package.json && echo "OK" || echo "FAIL"
```

---

### 1.5 Fix broken hero.png preload

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
# Move the file
mv src/assets/hero.png public/hero.png
# Fix the preload href in index.html
sed -i '' 's|href="/src/assets/hero.png"|href="/hero.png"|g' index.html
```

**Commit:**
```bash
git add -A && git commit -m "fix: move hero.png to public/ and fix preload href"
```

**Revert:**
```bash
git revert HEAD
```

**Verify:**
```bash
test -f public/hero.png && ! test -f src/assets/hero.png && grep -q 'href="/hero.png"' index.html && echo "OK" || echo "FAIL"
```

---

### Phase 1 Verify-All Command

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
npm run build && \
! test -f src/App.tsx && \
ls src/app/components/ui/ | wc -l | grep -q '^2$' && \
! grep -qE '"@mui/material"|"@radix-ui/react-accordion"|"react-dnd"|"recharts"' package.json && \
test -f public/hero.png && \
git log --oneline -5
```


## Phase 2 — TypeScript Hardening

> ⚠️ Enable strict mode, fix type errors, and remove @ts-ignore. Run `npx tsc --noEmit` after every sub-step.

---

### 2.1 Enable strict mode in tsconfig.app.json

Edit `tsconfig.app.json`. Add these three lines to `compilerOptions` (after `"erasableSyntaxOnly": true`):

```json
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
```

**Commit:**
```bash
git add tsconfig.app.json && git commit -m "ts: enable strict mode"
```

**Revert:**
```bash
git checkout HEAD~1 -- tsconfig.app.json
```

**Verify:**
```bash
grep -q '"strict": true' tsconfig.app.json && echo "OK" || echo "FAIL"
```

---

### 2.2 Add global type declaration for `document.startViewTransition`

Create `src/app/types/view-transitions.d.ts`:

```typescript
interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    ready: Promise<void>;
    finished: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition: () => void;
  };
}
```

Then in `src/app/App.tsx`, delete the two `// @ts-ignore` comments:
- Line 760: delete `    // @ts-ignore`
- Line 762: delete `    // @ts-ignore`

**Commit:**
```bash
git add src/app/types/view-transitions.d.ts src/app/App.tsx && git commit -m "ts: add startViewTransition types and remove @ts-ignore"
```

**Revert:**
```bash
git revert HEAD
```

**Verify:**
```bash
grep -c '@ts-ignore' src/app/App.tsx | grep -q '^0$' && test -f src/app/types/view-transitions.d.ts && echo "OK" || echo "FAIL"
```

---

### 2.3 Fix raw JSON `any` types in `src/app/data.ts`

Replace the following exact snippets in `src/app/data.ts`:

**A. Lines 356-358 — Replace `any | null` with `unknown | null`:**
```typescript
interface LoadedDatabases {
  mcqRaw: unknown | null;
  essayRaw: unknown | null;
  v2Raw?: unknown | null;
}
```

**B. Line 363 — Add type guard to `assertUniqueQuestionIds`:**
Replace:
```typescript
function assertUniqueQuestionIds(rawData: any, filename: string): void {
```
With:
```typescript
function assertUniqueQuestionIds(rawData: unknown, filename: string): void {
  if (!rawData || typeof rawData !== 'object' || !('chapters' in rawData)) return;
```

**C. Lines 380-409 — Add type guard to transform helpers:**
Replace:
```typescript
function transformV2Question(q: any, subjectColor: SubjectColor): Question {
```
With:
```typescript
function transformV2Question(q: unknown, subjectColor: SubjectColor): Question {
  if (!q || typeof q !== 'object') throw new Error('Invalid question object');
  const qx = q as Record<string, unknown>;
  // adjust property access below to use qx[key]
```

Also replace `sq: any` on line 393 with `sq: unknown` and add a guard.

Replace:
```typescript
function detectDbTypeOfJson(rawData: any): 'mcq' | 'essay' {
```
With:
```typescript
function detectDbTypeOfJson(rawData: unknown): 'mcq' | 'essay' {
  if (!rawData || typeof rawData !== 'object') return 'mcq';
  const raw = rawData as Record<string, unknown>;
```

**D. Lines 641-698 — Replace forEach callback `any` with `unknown`:**
Replace all occurrences of `(ch: any)`, `(subj: any)`, `(q: any)`, `(tp: any)` inside forEach callbacks with `unknown` and add type guards.

Example for line 641-643:
```typescript
db.v2Raw.chapters.forEach((ch: unknown) => {
  if (!ch || typeof ch !== 'object') return;
  const chapter = ch as Record<string, unknown>;
  (chapter.subjects as unknown[] | undefined)?.forEach((subj: unknown) => {
    if (!subj || typeof subj !== 'object') return;
    const subject = subj as Record<string, unknown>;
    (subject.questions as unknown[] | undefined)?.forEach((q: unknown) => {
      if (!q || typeof q !== 'object') return;
      const question = q as Record<string, unknown>;
```

**E. Line 741 — Replace `let meta: any` with `let meta: unknown`:**
```typescript
let meta: unknown;
```

Then run:
```bash
npx tsc --noEmit
```
Fix any remaining errors that appear.

**Commit:**
```bash
git add src/app/data.ts && git commit -m "ts: fix implicit-any in data.ts with unknown + type guards"
```

**Revert:**
```bash
git revert HEAD
```

---

### 2.4 Fix implicit-any in `src/app/App.tsx`

Replace these exact snippets:

**A. Lines 231-236 — Replace setter prop `any`s with `React.Dispatch`:**
```typescript
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  setSelectedYear: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedSemester: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedModule: React.Dispatch<React.SetStateAction<ModuleInfo | null>>;
  setStudyMode: React.Dispatch<React.SetStateAction<'mcq' | 'essay' | 'mixed' | null>>;
  setSelectedChapter: React.Dispatch<React.SetStateAction<ChapterData | null>>;
```

**B. Line 380 — Replace `any[]` with `ChapterData[]`:**
```typescript
  activeChapters: ChapterData[];
```

**C. Line 385 — Replace `any` in handler type:**
```typescript
  handleSelectHistory: (res: QuizResult, source: 'chapters' | 'history') => void;
```

**D. Line 851 — Replace `ans: any` with a union type:**
Create a union type near the top of App.tsx (after imports):
```typescript
type AnswerValue = unknown;
```
Then:
```typescript
const checkAnswerCorrect = (q: Question, ans: AnswerValue): boolean => {
```

**E. Line 991 — Replace `m: any` with `ModuleInfo`:**
Replace the existing fallback lookup with a typed accessor. The current code:
```typescript
let targetModule = SYLLABUS_MODULES[yr]?.[sem]?.find((m: any) => m.code === modCode) || null;
```
Should use the already-defined `ModuleInfo` type or `any` replaced with `ModuleInfo`.

Then run:
```bash
npx tsc --noEmit
```
Fix any remaining errors.

**Commit:**
```bash
git add src/app/App.tsx && git commit -m "ts: fix implicit-any prop types and checkAnswerCorrect in App.tsx"
```

**Revert:**
```bash
git revert HEAD
```

---

### Phase 2 Master Verify

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
npx tsc --noEmit && \
grep -c '@ts-ignore' src/app/App.tsx | grep -q '^0$' && \
grep -q '"strict": true' tsconfig.app.json && \
echo "PASS"
```


## Phase 3 — Safe Storage Migration

> Wrap every `localStorage` call in `try/catch` via a centralized utility.

---

### 3.1 Create `src/app/utils/safeStorage.ts`

Create the file with this exact source:

```typescript
const safeStorage = {
  getItem<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota/security errors */
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export default safeStorage;
```

**Commit:**
```bash
git add src/app/utils/safeStorage.ts && git commit -m "feat: add safeStorage utility with try/catch wrappers"
```

**Revert:**
```bash
git revert HEAD
```

**Verify:**
```bash
test -f src/app/utils/safeStorage.ts && echo "OK" || echo "FAIL"
```

---

### 3.2 Migrate `src/app/App.tsx` (22 raw calls)

Replace these patterns in `App.tsx`:

**Lines 241-246:**
Before:
```typescript
    localStorage.setItem('asu_medical_student_year', year.toString());
    localStorage.removeItem('asu_portal_year');
    localStorage.removeItem('asu_portal_semester');
    localStorage.removeItem('asu_portal_module');
    localStorage.removeItem('asu_portal_studyMode');
    localStorage.removeItem('asu_portal_screen');
```
After:
```typescript
    import safeStorage from './utils/safeStorage';
    safeStorage.setItem('asu_medical_student_year', year);
    safeStorage.removeItem('asu_portal_year');
    safeStorage.removeItem('asu_portal_semester');
    safeStorage.removeItem('asu_portal_module');
    safeStorage.removeItem('asu_portal_studyMode');
    safeStorage.removeItem('asu_portal_screen');
```

**Lines 526-556 (init useState callbacks):**
Replace every `localStorage.getItem(...)` with `safeStorage.getItem(...)`:
```typescript
const saved = safeStorage.getItem('asu_medical_student_year', null);
// etc. for asu_portal_screen, asu_portal_year, asu_portal_semester, asu_portal_module, asu_portal_studyMode
```

**Lines 643:**
```typescript
const saved = safeStorage.getItem('asu_medical_student_year', null);
```

**Lines 683-691 (sync useEffect):**
Replace all `localStorage.setItem` / `removeItem` with `safeStorage.setItem` / `removeItem`.

**Commit:**
```bash
git add src/app/App.tsx && git commit -m "safeStorage: migrate App.tsx raw localStorage calls"
```

**Revert:**
```bash
git revert HEAD
```

---

### 3.3 Migrate contexts and remaining files

Repeat the same pattern for these files. Add `import safeStorage from '../utils/safeStorage'` (adjust path per file) and replace all `localStorage.` calls.

| File | Path | Key names used |
|---|---|---|
| ThemeContext | `src/app/context/ThemeContext.tsx` | `theme` |
| LanguageContext | `src/app/context/LanguageContext.tsx` | `language` |
| progress store | `src/app/store/progress.tsx` | quiz progress key |
| sound.ts | `src/app/lib/sound.ts` | `fx.muted` |
| MarksCalculator | `src/app/components/MarksCalculator.tsx` | marks keys |
| YearSelectionModal | `src/app/components/YearSelectionModal.tsx` | year key |
| SyllabusTracker | `src/app/components/SyllabusTracker.tsx` | tracker keys |
| useCloudSync | `src/app/hooks/useCloudSync.ts` | sync key |
| storage.ts | `src/app/utils/storage.ts` | quiz history keys |

After each file, run a build check before committing, or batch them into one commit:

```bash
git add src/app/context/ src/app/store/ src/app/lib/ src/app/components/ src/app/hooks/ src/app/utils/storage.ts && \
git commit -m "safeStorage: migrate all remaining raw localStorage calls"
```

**Revert:**
```bash
git revert HEAD
```

---

### Phase 3 Master Verify

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
grep -rn 'localStorage\.' src/ | grep -v safeStorage.ts | grep -v '.css' | wc -l | grep -q '^0$' && echo "PASS" || echo "FAIL"
```


## Phase 4 — Logic Deduplication

> Extract duplicated logic into shared utilities so fixes need only happen once.

---

### 4.1 Extract `checkAnswerCorrect` to `src/app/utils/quiz.ts`

Create `src/app/utils/quiz.ts` with this exact source:

```typescript
import type { Question, SubQuestion } from '../types';

export function checkAnswerCorrect(q: Question, ans: unknown): boolean {
  if (ans === undefined) return false;

  if (q.type === 'mcq' || q.type === 'truefalse') {
    return ans === q.correctIndex;
  }

  if (q.type === 'matching') {
    const { scrambled, matches } = ans as {
      scrambled: number[];
      matches: number[];
    };
    if (!scrambled || !matches || !q.pairs) return false;
    return q.pairs.every((pair, pIdx) => {
      const correctTargetIdx = scrambled.indexOf(pair.target);
      return correctTargetIdx !== -1 && matches[pIdx] === correctTargetIdx;
    });
  }

  if (q.type === 'essay') {
    return (ans as { selfGrade?: string })?.selfGrade === 'correct';
  }

  if (q.type === 'case' && q.subQuestions) {
    const answerMap = ans as Record<string, unknown>;
    return q.subQuestions.every((subQ) => {
      const subAns = answerMap[subQ.id];
      if (subAns === undefined) return false;
      if (subQ.type === 'mcq') return subAns === subQ.correctIndex;
      if (subQ.type === 'essay')
        return (subAns as { selfGrade?: string })?.selfGrade === 'correct';
      return false;
    });
  }

  if (q.type === 'fillblank') {
    const { userAnswers } = ans as { userAnswers: string[] };
    const blanks = q.blanks || [];
    if (!userAnswers || userAnswers.length !== blanks.length) return false;
    return blanks.every((correctWord, bIdx) => {
      const userWord = (userAnswers[bIdx] || '').trim().toLowerCase();
      const correctWordLower = correctWord.toLowerCase();
      const matchesPrimary = userWord === correctWordLower;
      const matchesAccepted = q.acceptedAnswers?.[bIdx]?.some(
        (alt) => alt.trim().toLowerCase() === userWord
      );
      return matchesPrimary || matchesAccepted;
    });
  }

  return false;
}
```

Then delete the local definitions and add imports in these 3 files:

**`src/app/App.tsx` (around line 851):**
Delete:
```typescript
const checkAnswerCorrect = (q: Question, ans: any) => {
  // ... entire function body ...
};
```
Add at top of file (after other imports):
```typescript
import { checkAnswerCorrect } from './utils/quiz';
```

**`src/app/components/QuizInterface.tsx` (around line 64):**
Delete:
```typescript
function checkAnswerCorrect(q: Question, ans: any): boolean {
  // ... entire function body ...
}
```
Add at top of file:
```typescript
import { checkAnswerCorrect } from '../utils/quiz';
```

**`src/app/components/ResultsDashboard.tsx` (around line 62):**
Delete:
```typescript
function checkAnswerCorrect(q: Question, ans: any): boolean {
  // ... entire function body ...
}
```
Add at top of file:
```typescript
import { checkAnswerCorrect } from '../utils/quiz';
```

**Commit:**
```bash
git add src/app/utils/quiz.ts src/app/App.tsx src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx && \
git commit -m "refactor: deduplicate checkAnswerCorrect into utils/quiz.ts"
```

**Revert:**
```bash
git revert HEAD
```

**Verify:**
```bash
grep -c 'function checkAnswerCorrect\|const checkAnswerCorrect' src/app/App.tsx src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx | grep -q ':0$' && echo "OK" || echo "FAIL"
```

---

### 4.2 Extract `norm` to `src/app/utils/string.ts`

Create `src/app/utils/string.ts`:

```typescript
export const norm = (s: unknown): string => String(s ?? '').trim().toLowerCase();
```

Then replace in both files:

**`src/app/components/QuizInterface.tsx` (around line 62):**
Delete:
```typescript
const norm = (s: any) => String(s ?? '').trim().toLowerCase();
```
Add import:
```typescript
import { norm } from '../utils/string';
```

**`src/app/components/ResultsDashboard.tsx` (around line 60):**
Delete:
```typescript
const norm = (s: any) => String(s ?? '').trim().toLowerCase();
```
Add import:
```typescript
import { norm } from '../utils/string';
```

**Commit:**
```bash
git add src/app/utils/string.ts src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx && \
git commit -m "refactor: deduplicate norm helper into utils/string.ts"
```

**Revert:**
```bash
git revert HEAD
```

**Verify:**
```bash
grep -c 'const norm' src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx | grep -q ':0$' && echo "OK" || echo "FAIL"
```

---

### 4.3 Extract `transitionTo` to `src/app/hooks/useViewTransition.ts`

Create `src/app/hooks/useViewTransition.ts`:

```typescript
export function useViewTransition() {
  return function transitionTo(fn: () => void): void {
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(fn);
    } else {
      fn();
    }
  };
}
```

Then in `src/app/App.tsx`:
- Delete the inline `transitionTo` definition (around line 759-765):
```typescript
const transitionTo = (fn: () => void) => {
  // @ts-ignore
  if (document.startViewTransition) {
    // @ts-ignore
    document.startViewTransition(fn);
  } else {
    fn();
  }
};
```
- Add import:
```typescript
import { useViewTransition } from './hooks/useViewTransition';
```
- Inside `MainApp`, add:
```typescript
const transitionTo = useViewTransition();
```

**Commit:**
```bash
git add src/app/hooks/useViewTransition.ts src/app/App.tsx && \
git commit -m "refactor: extract transitionTo into useViewTransition hook"
```

**Revert:**
```bash
git revert HEAD
```

**Verify:**
```bash
grep -c 'function transitionTo\|const transitionTo = ' src/app/App.tsx | grep -q '^0$' && echo "OK" || echo "FAIL"
```

---

### Phase 4 Master Verify

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
test -f src/app/utils/quiz.ts && \
test -f src/app/utils/string.ts && \
test -f src/app/hooks/useViewTransition.ts && \
grep -c 'function checkAnswerCorrect\|const checkAnswerCorrect' src/app/App.tsx src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx | grep -q ':0$' && \
grep -c 'const norm' src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx | grep -q ':0$' && \
grep -c 'function transitionTo\|const transitionTo = ' src/app/App.tsx | grep -q '^0$' && \
npm run build && \
echo "PASS"
```


## Phase 5 — Component Extraction & Navigation Unification

> Break the 1,767-line god component into focused files and make quiz navigation URL-driven.

---

### 5.1 Extract `PortalFooter` to `src/app/components/PortalFooter.tsx`

**Cut from `src/app/App.tsx` lines 102-119:**
```tsx
function PortalFooter() {
  return (
    <footer className="w-full mt-16 pb-8 text-center space-y-2 border-t border-gray-100 dark:border-gray-800/80 pt-6">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wider uppercase">
        Ain Shams University • ASU Medical Portal
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium max-w-xl mx-auto px-6 leading-relaxed">
        Developed for medical students. For inquiries, database updates, or error reports, please contact:{' '}
        <a
          href="mailto:omarhmaged@gmail.com"
          className="hover:text-physiology dark:hover:text-white transition-colors underline font-semibold"
        >
          omarhmaged@gmail.com
        </a>
      </p>
    </footer>
  );
}
```

**Paste into `src/app/components/PortalFooter.tsx`:**
```tsx
export function PortalFooter() {
  return (
    <footer className="w-full mt-16 pb-8 text-center space-y-2 border-t border-gray-100 dark:border-gray-800/80 pt-6">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wider uppercase">
        Ain Shams University • ASU Medical Portal
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium max-w-xl mx-auto px-6 leading-relaxed">
        Developed for medical students. For inquiries, database updates, or error reports, please contact:{' '}
        <a
          href="mailto:omarhmaged@gmail.com"
          className="hover:text-physiology dark:hover:text-white transition-colors underline font-semibold"
        >
          omarhmaged@gmail.com
        </a>
      </p>
    </footer>
  );
}
```

**In `App.tsx`:** Add import `import { PortalFooter } from './components/PortalFooter';` at the top.

**Commit:**
```bash
git add src/app/components/PortalFooter.tsx src/app/App.tsx && git commit -m "refactor: extract PortalFooter component"
```

---

### 5.2 Extract `ClerkThemeTogglePortal` to `src/app/components/ClerkThemeTogglePortal.tsx`

**Cut from `App.tsx` lines 121-164** (the full `ClerkThemeTogglePortal` function).

**Paste into `src/app/components/ClerkThemeTogglePortal.tsx`:**
```tsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ThemeToggle } from './ThemeToggle';

export function ClerkThemeTogglePortal() {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    const findContainer = () => {
      const previews = document.querySelectorAll('.cl-userPreview');
      let preview: Element | null = null;
      for (let i = 0; i < previews.length; i++) {
        const p = previews[i];
        if (p.closest('.cl-userProfile-root')) continue;
        preview = p;
        break;
      }
      if (preview) {
        let existing = preview.querySelector('#clerk-custom-toggle-container');
        if (!existing) {
          existing = document.createElement('div');
          existing.id = 'clerk-custom-toggle-container';
          existing.className = 'ms-auto flex items-center justify-end pl-2 shrink-0 scale-85 origin-right';
          preview.appendChild(existing);
        }
        setContainer(existing);
      } else {
        setContainer(null);
      }
    };
    findContainer();
    const observer = new MutationObserver(() => findContainer());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!container) return null;
  return createPortal(<ThemeToggle />, container);
}
```

**In `App.tsx`:** Add import and delete the inline definition.

**Commit:**
```bash
git add src/app/components/ClerkThemeTogglePortal.tsx src/app/App.tsx && git commit -m "refactor: extract ClerkThemeTogglePortal component"
```

---

### 5.3 Extract profile pages to `src/app/components/profile/`

**Cut `LanguageProfilePage` from App.tsx lines 166-217** and paste into `src/app/components/profile/LanguageProfilePage.tsx`.

**Cut `AcademicYearProfilePage` from App.tsx lines 219-340** and paste into `src/app/components/profile/AcademicYearProfilePage.tsx`.

Both need standard top-of-file imports (`useLanguage`, `GraduationCap`, `Check`, `Globe`, etc.) copied from App.tsx.

**In `App.tsx`:** Add imports:
```tsx
import { LanguageProfilePage } from './components/profile/LanguageProfilePage';
import { AcademicYearProfilePage } from './components/profile/AcademicYearProfilePage';
```

**Commit:**
```bash
git add src/app/components/profile/ src/app/App.tsx && git commit -m "refactor: extract LanguageProfilePage and AcademicYearProfilePage"
```

---

### 5.4 Extract `QuizFlowWrapper` to `src/app/components/QuizFlowWrapper.tsx`

**Cut from App.tsx lines 342-508** (the full `QuizFlowWrapper` function) and paste into `src/app/components/QuizFlowWrapper.tsx`.

Add standard imports for all the hooks and types it uses (copied from App.tsx imports).

**IMPORTANT — Navigation fix:** After extraction, remove the `useEffect` inside `QuizFlowWrapper` that forces `screen` to `'chapters'` on param changes. This is the root cause of the refresh state-loss bug. Delete lines inside `QuizFlowWrapper` that do:
```tsx
useEffect(() => {
  if (code) { ... setSelectedModule ... }
  if (mode) { ... setStudyMode ... }
  if (screen !== 'chapters' && ...) { setScreen('chapters'); }
}, [code, mode, ...]);
```

**In `App.tsx`:** Add import and delete inline definition.

**Commit:**
```bash
git add src/app/components/QuizFlowWrapper.tsx src/app/App.tsx && git commit -m "refactor: extract QuizFlowWrapper and remove screen reset bug"
```

---

### 5.5 Create `usePortalPersistence` hook

Create `src/app/hooks/usePortalPersistence.ts`:

```tsx
import { useEffect, useRef } from 'react';
import safeStorage from '../utils/safeStorage';

interface PortalState {
  screen: string;
  selectedYear: number | null;
  selectedSemester: number | null;
  selectedModule: unknown;
  studyMode: string | null;
  selectedChapter: unknown;
  quizPayload: unknown;
  resultPayload: unknown;
}

export function usePortalPersistence(state: PortalState) {
  const pendingRef = useRef<number | null>(null);

  // Sync to localStorage
  useEffect(() => {
    safeStorage.setItem('asu_portal_screen', state.screen);
    if (state.selectedYear) safeStorage.setItem('asu_portal_year', state.selectedYear);
    else safeStorage.removeItem('asu_portal_year');
    if (state.selectedSemester) safeStorage.setItem('asu_portal_semester', state.selectedSemester);
    else safeStorage.removeItem('asu_portal_semester');
    if (state.selectedModule) safeStorage.setItem('asu_portal_module', JSON.stringify(state.selectedModule));
    else safeStorage.removeItem('asu_portal_module');
    if (state.studyMode) safeStorage.setItem('asu_portal_studyMode', state.studyMode);
    else safeStorage.removeItem('asu_portal_studyMode');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
    }
  }, [state.screen, state.selectedYear, state.selectedSemester, state.selectedModule, state.studyMode]);

  // Debounced history sync
  useEffect(() => {
    if (pendingRef.current) cancelAnimationFrame(pendingRef.current);
    pendingRef.current = requestAnimationFrame(() => {
      const rep = {
        screen: state.screen,
        selectedYear: state.selectedYear,
        selectedSemester: state.selectedSemester,
        selectedModule: state.selectedModule,
        studyMode: state.studyMode,
        selectedChapter: state.selectedChapter,
        quizPayload: state.quizPayload,
        resultPayload: state.resultPayload,
      };
      const current = window.history.state;
      if (!current || !current.asuPortal) {
        window.history.replaceState({ asuPortal: true, ...rep }, '');
      } else {
        const changed = JSON.stringify(current) !== JSON.stringify({ asuPortal: true, ...rep });
        if (changed) window.history.pushState({ asuPortal: true, ...rep }, '');
      }
    });
    return () => {
      if (pendingRef.current) cancelAnimationFrame(pendingRef.current);
    };
  }, [state]);
}
```

**In `App.tsx`:**
- Delete the old inline `useEffect` blocks for localStorage sync and history sync.
- Add `import { usePortalPersistence } from './hooks/usePortalPersistence';`
- Inside `MainApp`, call:
```tsx
usePortalPersistence({
  screen, selectedYear, selectedSemester, selectedModule, studyMode,
  selectedChapter, quizPayload, resultPayload,
});
```

**Commit:**
```bash
git add src/app/hooks/usePortalPersistence.ts src/app/App.tsx && git commit -m "refactor: extract usePortalPersistence with debounced history and safeStorage"
```

---

### 5.6 Unify quiz navigation to URL-driven routes

**In `App.tsx` routes**, replace the single `/year-2/:code/:mode` route with nested sub-routes that read the current sub-screen from the URL path:

Before:
```tsx
<Route path="/year-2/:code/:mode" element={
  <QuizFlowWrapper code={params.code} mode={params.mode} ... />
} />
```

After:
```tsx
<Route path="/year-2/:code/:mode/*" element={
  <QuizFlowWrapper ... />
}>
  <Route index element={<Navigate to="chapters" replace />} />
  <Route path="chapters" element={<ChapterSelect chapters={activeChapters} ... />} />
  <Route path="chapters/:chapterId" element={<SubjectSelect chapter={selectedChapter} ... />} />
  <Route path="chapters/:chapterId/quiz" element={<QuizInterface ... />} />
  <Route path="chapters/:chapterId/results" element={<ResultsDashboard ... />} />
</Route>
```

Then update `QuizFlowWrapper` to use `<Outlet>` from `react-router` instead of the internal `screen` state machine:

```tsx
import { Outlet, useNavigate, useParams } from 'react-router';

export function QuizFlowWrapper({ ... }) {
  // ... existing props ...
  const navigate = useNavigate();
  const params = useParams();

  // Remove the old screen-forcing useEffect entirely

  return <Outlet />;
}
```

Each child route component can derive its data from props passed by the parent route `element`.

**Commit:**
```bash
git add src/app/App.tsx src/app/components/QuizFlowWrapper.tsx && git commit -m "refactor: URL-driven quiz sub-navigation via nested routes"
```

---

### Phase 5 Master Verify

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
test -f src/app/components/PortalFooter.tsx && \
test -f src/app/components/ClerkThemeTogglePortal.tsx && \
test -f src/app/components/profile/LanguageProfilePage.tsx && \
test -f src/app/components/profile/AcademicYearProfilePage.tsx && \
test -f src/app/components/QuizFlowWrapper.tsx && \
test -f src/app/hooks/usePortalPersistence.ts && \
grep -c 'function PortalFooter' src/app/App.tsx | grep -q '^0$' && \
grep -c 'function ClerkThemeTogglePortal' src/app/App.tsx | grep -q '^0$' && \
grep -c 'function LanguageProfilePage' src/app/App.tsx | grep -q '^0$' && \
grep -c 'function AcademicYearProfilePage' src/app/App.tsx | grep -q '^0$' && \
grep -c 'function QuizFlowWrapper' src/app/App.tsx | grep -q '^0$' && \
grep -c 'localStorage\.setItem\|localStorage\.removeItem\|history\.pushState\|history\.replaceState' src/app/App.tsx | grep -q '^0$' && \
npm run build && \
echo "PASS"
```


## Phase 6 — CSS & Asset Polish

> Low-risk visual and metadata improvements.

---

### 6.1 Add missing OG tags to `index.html`

After line 21 (after `twitter:image` meta), insert:

```html
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="ASU Medical Portal" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image:width" content="1200" />
    <meta name="twitter:image:height" content="630" />
```

Also fix Twitter meta keys on lines 23-28: change `property="twitter:` to `name="twitter:` for all Twitter tags.

**Commit:**
```bash
git add index.html && git commit -m "seo: add OG locale, dimensions, fix twitter property→name"
```

**Revert:**
```bash
git checkout HEAD~1 -- index.html
```

---

### 6.2 Add dynamic theme-color

In `src/app/App.tsx`, after the `isDark` value is available (inside `MainApp` or via `useTheme`), add:

```tsx
useEffect(() => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0c0e16' : '#f8f9fc');
}, [isDark]);
```

Then in `index.html`, change line 25 from:
```html
<meta name="theme-color" content="#0c0e16" />
```
to:
```html
<meta name="theme-color" content="#f8f9fc" />
```

**Commit:**
```bash
git add index.html src/app/App.tsx && git commit -m "ui: dynamic theme-color meta to prevent light-mode flash"
```

**Revert:**
```bash
git checkout HEAD~1 -- index.html src/app/App.tsx
```

---

### 6.3 Remove inline `<style>` block from `App.tsx`

Delete lines 1168-1220 in `src/app/App.tsx` (the `<style>{`...`}</style>` block containing `shrinkHeader`, `popUp`, `floatBlob` keyframes).

Verify `src/styles/theme.css` already contains equivalent keyframes. If not, move them there.

**Commit:**
```bash
git add src/app/App.tsx src/styles/theme.css && git commit -m "css: remove inline style block; move keyframes to theme.css"
```

**Revert:**
```bash
git revert HEAD
```

---

### 6.4 Fix `sw.js` external font URL

Edit `public/sw.js` and remove the Google Fonts CSS URL from the `PRECACHE_ASSETS` array (line 12). The array should only contain local paths.

Before:
```js
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  // ...
  "https://fonts.googleapis.com/css2?family=Amiri..."
];
```

After:
```js
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/favicon.svg",
  "/asu-medicine-logo.webp",
  "/icons.svg"
];
```

**Commit:**
```bash
git add public/sw.js && git commit -m "pwa: remove external Google Fonts from precache"
```

**Revert:**
```bash
git checkout HEAD~1 -- public/sw.js
```

---

### 6.5 Compress favicon and remove C2PA metadata

The `public/favicon.svg` is 221KB. Since `index.html` uses `/favicon.png`, the `.svg` is extra weight.

Option A — Remove it entirely:
```bash
rm public/favicon.svg
```
Also remove `"/favicon.svg"` from `sw.js` `PRECACHE_ASSETS`.

Option B — Replace with a tiny inline SVG (if you want to keep it):
Create a 2KB SVG without metadata.

**Commit:**
```bash
git add public/sw.js && test -f public/favicon.svg && git add public/favicon.svg || true
git commit -m "assets: remove bloated favicon.svg and sw.js precache entry"
```

**Revert:**
```bash
git revert HEAD
```

---

### Phase 6 Master Verify

```bash
grep -q 'og:locale' index.html && \
grep -q 'og:image:width' index.html && \
grep -q 'name="twitter:card"' index.html && \
grep -q 'theme-color' src/app/App.tsx && \
grep -c '<style>' src/app/App.tsx | grep -q '^0$' && \
! grep -q 'fonts.googleapis.com' public/sw.js && \
! test -f public/favicon.svg && \
echo "PASS"
```


## Phase 7 — Accessibility & PWA

> Keyboard support, skip links, structured data, cache headers, and manifest improvements.

---

### 7.1 Add `aria-label` to icon-only buttons

Search these files for buttons containing only an icon (no visible text). Add `aria-label` to each:

**`src/app/components/QuizInterface.tsx`:**
Find buttons that contain only `<IconName size=... />`. Add `aria-label` with descriptive text.
Example:
```tsx
<button aria-label="Next question"><ChevronRight size={20} /></button>
<button aria-label="Flag question"><Flag size={20} /></button>
```

**`src/app/App.tsx`:**
Find icon-only buttons in the header/custom user button area. Add `aria-label` to each.

**Commit:**
```bash
git add src/app/components/QuizInterface.tsx src/app/App.tsx && git commit -m "a11y: add aria-label to icon-only buttons"
```

**Revert:**
```bash
git revert HEAD
```

---

### 7.2 Add keyboard handling to quiz choices

In `src/app/components/QuizInterface.tsx`, ensure MCQ options can be navigated with arrow keys and selected with Enter/Space.

Add `role="radio"`, `aria-checked`, and `tabIndex` to each option element:
```tsx
<div
  role="radio"
  aria-checked={isSelected}
  tabIndex={0}
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
  ...
>
```

**Commit:**
```bash
git add src/app/components/QuizInterface.tsx && git commit -m "a11y: keyboard navigation for quiz options"
```

**Revert:**
```bash
git revert HEAD
```

---

### 7.3 Add skip-to-content link

In `src/app/App.tsx`, inside `MainApp` return, add immediately after `<div className="min-h-screen ...">`:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-physiology focus:text-white focus:rounded-lg focus:outline-none"
>
  Skip to content
</a>
```

Then find the `<main>` or main content wrapper and add `id="main-content"`:
```tsx
<main id="main-content" className="w-full relative z-10">
```

**Commit:**
```bash
git add src/app/App.tsx && git commit -m "a11y: add skip-to-content link"
```

**Revert:**
```bash
git revert HEAD
```

---

### 7.4 Add JSON-LD structured data to `index.html`

Add after the Twitter meta tags and before `<link rel="icon">`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ASU Medical Portal",
  "url": "https://asu.codes/",
  "description": "Master the ASU medical syllabus through structured assessment, clinical case solvers, and interactive quizzes.",
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "Ain Shams University",
    "url": "https://asu.edu.eg/"
  }
}
</script>
```

**Commit:**
```bash
git add index.html && git commit -m "seo: add JSON-LD structured data"
```

**Revert:**
```bash
git checkout HEAD~1 -- index.html
```

---

### 7.5 Add Cache-Control headers to `vercel.json`

Replace the contents of `vercel.json` with:

```json
{
  "regions": ["iad1"],
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(index.html|)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

**Commit:**
```bash
git add vercel.json && git commit -m "perf: add immutable cache headers for assets and fonts"
```

**Revert:**
```bash
git checkout HEAD~1 -- vercel.json
```

---

### 7.6 Enhance PWA `manifest.json`

Add or verify these fields in `public/manifest.json`:

```json
{
  "name": "ASU Medical Portal",
  "short_name": "ASU Portal",
  "description": "Master the ASU medical syllabus through structured assessment, clinical case solvers, and interactive quizzes.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8f9fc",
  "theme_color": "#0c0e16",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en",
  "icons": [
    {
      "src": "/favicon.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Commit:**
```bash
git add public/manifest.json && git commit -m "pwa: enhance manifest with background_color, orientation, maskable icons"
```

**Revert:**
```bash
git checkout HEAD~1 -- public/manifest.json
```

---

### Phase 7 Master Verify

```bash
grep -q 'aria-label' src/app/components/QuizInterface.tsx && \
grep -q 'Skip to content' src/app/App.tsx && \
grep -q 'main-content' src/app/App.tsx && \
grep -q 'application/ld+json' index.html && \
grep -q 'immutable' vercel.json && \
grep -q 'maskable' public/manifest.json && \
echo "PASS"
```


## Phase 8 — Performance

> Bundle analysis, lazy loading, animation pausing, and runtime hardening.

---

### 8.1 Add `loading="lazy"` to non-critical images

In `src/app/components/QuizInterface.tsx`, find all `<img>` tags that are not immediate quiz-critical. Add `loading="lazy"` to images loaded from question data or secondary UI. Keep `loading="eager"` only for the first visible question image.

Example pattern to search and replace:
```tsx
<img src={...} alt={...} />
```
to:
```tsx
<img src={...} alt={...} loading="lazy" />
```

**Commit:**
```bash
git add src/app/components/QuizInterface.tsx && git commit -m "perf: lazy-load secondary quiz images"
```

**Revert:**
```bash
git revert HEAD
```

---

### 8.2 Add Page Visibility pause to `InteractiveBackground`

Edit `src/app/components/ui/InteractiveBackground.tsx`. Add a `document.visibilitychange` listener that pauses the animation loop when the tab is hidden:

```tsx
useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) {
      // pause animation frame loop
      pauseLoop();
    } else {
      resumeLoop();
    }
  };
  document.addEventListener('visibilitychange', handleVisibility);
  return () => document.removeEventListener('visibilitychange', handleVisibility);
}, []);
```

The exact `pauseLoop()` / `resumeLoop()` names depend on the component's internal animation implementation. Find the requestAnimationFrame loop and wrap it with a visibility check.

**Commit:**
```bash
git add src/app/components/ui/InteractiveBackground.tsx && git commit -m "perf: pause background animation when tab is hidden"
```

**Revert:**
```bash
git revert HEAD
```

---

### 8.3 Wrap lazy routes with `<ErrorBoundary>`

In `src/app/App.tsx`, wrap each lazy route with a per-feature ErrorBoundary so a crash in one route doesn't unmount the entire tree.

Create `src/app/components/FeatureErrorBoundary.tsx`:
```tsx
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export const FeatureErrorBoundary: React.FC<{ children: React.ReactNode; name: string }> = ({
  children,
  name,
}) => (
  <ErrorBoundary
    fallback={
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold mb-2">Something went wrong in {name}</h2>
        <p className="text-sm text-gray-500">Please refresh the page.</p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);
```

Then in `App.tsx`, wrap each heavy route:
```tsx
<Route path="/case-solver" element={
  <FeatureErrorBoundary name="Case Solver">
    <Suspense fallback={<div>Loading...</div>}>
      <ClinicalCaseSolver ... />
    </Suspense>
  </FeatureErrorBoundary>
} />
```

Repeat for `/marks-calculator`, `/question-search`, `/analytics`, `/flagged-questions`, and quiz routes.

**Commit:**
```bash
git add src/app/components/FeatureErrorBoundary.tsx src/app/App.tsx && git commit -m "resilience: add per-feature ErrorBoundary wrappers"
```

**Revert:**
```bash
git revert HEAD
```

---

### 8.4 Consolidate `framer-motion` → `motion`

Search all imports of `framer-motion` and replace with `motion`:

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
grep -rln "from ['\"]framer-motion['\"]" src/ | xargs sed -i '' "s|from 'framer-motion'|from 'motion/react'|g"
```

Verify build passes, then in `package.json`:
- Delete the `"framer-motion": "^12.40.0",` line from dependencies.

Then run:
```bash
npm install
npm run build
```

**Commit:**
```bash
git add package.json package-lock.json src/ && git commit -m "perf: consolidate framer-motion imports to motion"
```

**Revert:**
```bash
git revert HEAD && npm install
```

---

### 8.5 Install and run bundle analyzer

Install:
```bash
npm install -D rollup-plugin-visualizer
```

Edit `vite.config.ts` and add inside the `plugins` array:
```ts
import { visualizer } from 'rollup-plugin-visualizer';

// inside plugins:
visualizer({
  open: true,
  gzipSize: true,
  brotliSize: true,
  filename: 'stats.html',
}),
```

Build:
```bash
npm run build
```

Open `stats.html` in the browser to see bundle breakdown.

**Commit:**
```bash
git add vite.config.ts package.json package-lock.json && git commit -m "chore: add rollup-plugin-visualizer for bundle analysis"
```

**Revert:**
```bash
git revert HEAD && npm install
```

---

### Phase 8 Master Verify

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
grep -q 'loading="lazy"' src/app/components/QuizInterface.tsx && \
grep -q 'visibilitychange' src/app/components/ui/InteractiveBackground.tsx && \
test -f src/app/components/FeatureErrorBoundary.tsx && \
! grep -q '"framer-motion"' package.json && \
grep -q '"motion"' package.json && \
test -f stats.html && \
npm run build && \
echo "PASS"
```


---

## Execution Order

> Run these phases in order. Each phase is fully reversible with its own commit.

| Batch | Phase | Risk | Approx Time |
|---|---|---|---|
| 1 | **Phase 0** — Create Baseline & Safety Branch | Zero | 2 min |
| 1 | **Phase 1** — Dead Code & Dependency Removal | Low | 10 min |
| 2 | **Phase 2** — TypeScript Hardening | Medium | 15 min |
| 2 | **Phase 3** — Safe Storage Migration | Medium | 10 min |
| 3 | **Phase 4** — Logic Deduplication | Medium | 10 min |
| 4 | **Phase 5** — Component Extraction & Navigation Unification | High | 20 min |
| 5 | **Phase 6** — CSS & Asset Polish | Low | 10 min |
| 5 | **Phase 7** — Accessibility & PWA | Low | 10 min |
| 5 | **Phase 8** — Performance & Bundle Analysis | Low | 10 min |

### Batch Strategy
- **Batch 1** (Phase 0 + Phase 1): File deletion only. Zero risk. Revert with `git revert HEAD~N`.
- **Batch 2** (Phase 2 + Phase 3): Type fixes and storage safety. Revert each phase independently.
- **Batch 3** (Phase 4): Logic consolidation. Revert with single commit.
- **Batch 4** (Phase 5): Architecture change. Highest risk. Test quiz flow end-to-end before committing.
- **Batch 5** (Phase 6 + 7 + 8): Polish and analysis. Low risk.

### Revert One Batch
```bash
# Revert just the last batch
git revert <commit-hash>
```

### Revert Everything
```bash
git reset --hard pre-audit-backup
```

---


## Master Verification Checklist

Run this entire checklist after completing all phases. Every command should exit 0 or match.

### Build & Type Safety
```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
npm run build 2>&1 | grep -v "node_modules" | tail -5
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```
- [ ] `npm run build` exits 0 with no Rollup errors
- [ ] `npx tsc --noEmit` exits 0 with zero type errors

### Dead Code & Dependencies
```bash
! test -f src/App.tsx && \
! grep -qE '"@mui/material"|"@emotion/react"|"react-dnd"|"react-slick"|"ecc-universal"' package.json && \
! grep -qE '"@radix-ui/react-accordion"|"cmdk"|"vaul"|"recharts"|"input-otp"' package.json && \
ls src/app/components/ui/ | sort | diff - <(echo -e "InteractiveBackground.tsx\nStackedCarousel.tsx") && \
echo "PASS"
```
- [ ] `src/App.tsx` does not exist
- [ ] Unused deps (batch 1) removed from package.json
- [ ] Dead UI deps (batch 2) removed from package.json
- [ ] Only 2 files remain in `src/app/components/ui/`

### TypeScript Strictness
```bash
grep -q '"strict": true' tsconfig.app.json && \
grep -c '@ts-ignore' src/app/App.tsx | grep -q '^0$' && \
test -f src/app/types/view-transitions.d.ts && \
echo "PASS"
```
- [ ] `strict: true` in tsconfig.app.json
- [ ] Zero `@ts-ignore` in App.tsx
- [ ] `view-transitions.d.ts` exists

### Safe Storage
```bash
test -f src/app/utils/safeStorage.ts && \
grep -rn 'localStorage\.' src/ | grep -v safeStorage.ts | grep -v '.css' | wc -l | grep -q '^0$' && \
echo "PASS"
```
- [ ] `safeStorage.ts` exists
- [ ] Zero raw `localStorage.` calls outside safeStorage.ts

### Logic Deduplication
```bash
test -f src/app/utils/quiz.ts && \
test -f src/app/utils/string.ts && \
test -f src/app/hooks/useViewTransition.ts && \
grep -c 'function checkAnswerCorrect\|const checkAnswerCorrect' src/app/App.tsx src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx | grep -q ':0$' && \
grep -c 'const norm' src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx | grep -q ':0$' && \
grep -c 'function transitionTo\|const transitionTo = ' src/app/App.tsx | grep -q '^0$' && \
echo "PASS"
```
- [ ] `quiz.ts` exists, no local `checkAnswerCorrect` in 3 consumers
- [ ] `string.ts` exists, no local `norm` in 2 consumers
- [ ] `useViewTransition.ts` exists, no inline `transitionTo` in App.tsx

### Component Extraction
```bash
test -f src/app/components/PortalFooter.tsx && \
test -f src/app/components/ClerkThemeTogglePortal.tsx && \
test -f src/app/components/profile/LanguageProfilePage.tsx && \
test -f src/app/components/profile/AcademicYearProfilePage.tsx && \
test -f src/app/components/QuizFlowWrapper.tsx && \
test -f src/app/hooks/usePortalPersistence.ts && \
grep -c 'function PortalFooter' src/app/App.tsx | grep -q '^0$' && \
grep -c 'function ClerkThemeTogglePortal' src/app/App.tsx | grep -q '^0$' && \
grep -c 'function LanguageProfilePage' src/app/App.tsx | grep -q '^0$' && \
grep -c 'function AcademicYearProfilePage' src/app/App.tsx | grep -q '^0$' && \
grep -c 'function QuizFlowWrapper' src/app/App.tsx | grep -q '^0$' && \
echo "PASS"
```
- [ ] All 5 extracted component files exist
- [ ] None of the 5 functions remain inline in App.tsx

### CSS & Assets
```bash
grep -q 'og:locale' index.html && \
grep -q 'og:image:width' index.html && \
grep -q 'name="twitter:card"' index.html && \
grep -c '<style>' src/app/App.tsx | grep -q '^0$' && \
! grep -q 'fonts.googleapis.com' public/sw.js && \
! test -f public/favicon.svg && \
echo "PASS"
```
- [ ] OG tags present in index.html
- [ ] Zero inline `<style>` blocks in App.tsx
- [ ] No external Google Fonts URL in sw.js
- [ ] Bloated favicon.svg removed

### Accessibility & PWA
```bash
grep -q 'aria-label' src/app/components/QuizInterface.tsx && \
grep -q 'Skip to content' src/app/App.tsx && \
grep -q 'main-content' src/app/App.tsx && \
grep -q 'application/ld+json' index.html && \
grep -q 'immutable' vercel.json && \
grep -q 'maskable' public/manifest.json && \
echo "PASS"
```
- [ ] aria-labels added to icon-only buttons
- [ ] Skip-to-content link present
- [ ] JSON-LD structured data in index.html
- [ ] Immutable cache headers in vercel.json
- [ ] Maskable icons in manifest.json

### Performance
```bash
! grep -q '"framer-motion"' package.json && \
grep -q '"motion"' package.json && \
test -f src/app/components/FeatureErrorBoundary.tsx && \
test -f stats.html && \
echo "PASS"
```
- [ ] `framer-motion` removed from package.json
- [ ] `motion` still present
- [ ] `FeatureErrorBoundary.tsx` exists
- [ ] `stats.html` bundle analysis generated

### Final
```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
npm run build && npx tsc --noEmit && echo "ALL CHECKS PASSED"
```

---

> 🎉 If every box is checked, your codebase is cleaned, typed, deduplicated, and hardened. You are ready to ship.
> If anything fails, revert the last batch or use `git reset --hard pre-audit-backup`.


---

## Cross-Reference

Every finding in `AUDIT.md` mapped to its instruction block(s) in this prompt.

| AUDIT Finding | Severity | IMPLEMENT.md Phase | Notes |
|---|---|---|---|
| C1 — Broken asset preload | Critical | Phase 1.5 | Move hero.png to public/ + fix href |
| C2 — Oversized favicon | Critical | Phase 6.5 | Remove bloated favicon.svg |
| H1 — God component (1,767 lines) | High | Phase 5.1–5.4 | Extract 5 inline components |
| H2 — 25 useState hooks | High | Phase 5.5 | usePortalPersistence consolidates state sync |
| H3 — TypeScript strict disabled | High | Phase 2.1 | tsconfig changes |
| H4 — data.ts 19 `any` | High | Phase 2.3 | unknown + type guards |
| H5 — App.tsx 10 `any` | High | Phase 2.4 | Proper React types |
| H6 — checkAnswerCorrect ×3 | High | Phase 4.1 | Extract to quiz.ts |
| H7 — norm ×2 | High | Phase 4.2 | Extract to string.ts |
| H8 — Raw localStorage calls | High | Phase 3 | safeStorage.ts + migration |
| H9 — Unthrottled pushState | High | Phase 5.5 | Debounced via requestAnimationFrame |
| H10 — ~45 unused deps | High | Phase 1.3 + 1.4 | Two removal batches |
| M1 — Missing OG tags | Medium | Phase 6.1 | Add locale, site_name, dimensions |
| M2 — Twitter property→name | Medium | Phase 6.1 | Fix attribute name |
| M3 — Inline style block | Medium | Phase 6.3 | Remove App.tsx <style>, move to CSS |
| M4 — External font in sw.js | Medium | Phase 6.4 | Remove Google Fonts URL from precache |
| M5 — Unused font weights | Medium | — | **Intentionally omitted** — requires manual audit of which weights are referenced in CSS. Recommend: grep `font-weight` in CSS, delete unused .woff2 files. |
| M6 — Missing cache headers | Medium | Phase 7.5 | vercel.json headers config |
| M7 — @ts-ignore | Medium | Phase 2.2 | view-transitions.d.ts replaces suppression |
| M8 — Static theme-color | Medium | Phase 6.2 | Dynamic meta + light default |
| L1 — Dead src/App.tsx | Low | Phase 1.1 | Delete leftover template |
| L2 — 49 dead UI primitives | Low | Phase 1.2 | Keep only 2 files |
| L3 — Redundant framer-motion | Low | Phase 8.4 | Consolidate to motion |
| L4 — Inline quiz styles | Low | Phase 8.1 | lazy loading images (style block handled in M3) |
| L5 — Missing skip-to-content | Low | Phase 7.3 | Add link + anchor |
| L6 — Missing JSON-LD | Low | Phase 7.4 | Structured data script |

### Intentional Omissions

1. **M5 — Unused font weights**: Requires a manual audit of which font-weight declarations are actually used in the CSS/Tailwind config. This is safe to defer because unused font files don't affect runtime.
2. **Quiz timer extraction**: AUDIT mentioned extracting Timer into a child component. The Timer logic in QuizInterface.tsx is already encapsulated in a `useEffect` + state pattern. Extracting it into a separate `<Timer />` component is a nice-to-have that doesn't fix any bugs.
3. **Clerk CSS → Appearance API full migration**: The audit noted migrating Clerk CSS overrides. The existing overrides are minimal and functional. Full migration to the Appearance API would be a refactor with no user-facing benefit.

---

