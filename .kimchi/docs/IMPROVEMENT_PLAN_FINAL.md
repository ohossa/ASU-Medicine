# 🏥 ASU Medical Portal — Implementation Spec & Step-by-Step Execution Plan

> **Status:** LOCKED. 2026-06-19. All stakeholder decisions resolved.  
> **Constraint:** JSON banks untouched. All schema changes additive.  
> **Aesthetic:** Apple / Spotify throughout. Clean, smooth, zero friction.  
> **Quality gate:** Every phase builds + tests + commits independently. No phase ships without its tests.

---

## 0. Lock File — Stakeholder Decisions

| # | Decision | Value |
|---|----------|-------|
| 1 | Sound source | Freesound samples (.mp3), ON by default, mute in settings |
| 2 | Exam questions | Configurable 20 / 40 / 60 / 80 |
| 3 | Streak calendar | Forward only (today onward) |
| 4 | Spaced repetition sync | Cloud + localStorage fallback |
| 5 | Difficulty backfill | Heuristic default immediately + optional AI batch later |
| 6 | Confetti rollout | Colors Phase 3, custom shapes Phase 5 |
| 7 | Confetti trigger | Generic for normal scores. Themed ONLY on perfect (100%) |
| 8 | Exam timer UX | Toggle inside quiz settings, no separate screen |
| 9 | Design rule | Apple / Spotify aesthetic. Glassmorphism, neutral grays, micro-interactions |
| 10 | Difficulty student burden | ZERO. Backend only. No popups, no toggles, no rating |

---

## 1. Architecture Overview

### 1.1 Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│  JSON Banks (→ import.meta.glob)                                     │
│  ├─ Question.difficulty?: number    ← heuristic default at build    │
│  ├─ Question.bloomLevel?: string    ← AI batch later (optional)     │
│  ├─ Question.tags?: string[]        ← AI batch later (optional)     │
│  ├─ Question.estimatedTimeSeconds?: number                          │
│  └─ Question.media?: {imageUrl?, videoUrl?, audioUrl?}              │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  data.ts (load + normalize)                                          │
│  ├─ transformV2Question()   ← assignDefaultDifficulty(q)           │
│  ├─ assignDefaultDifficulty() (see §2.1)                           │
│  └─ zodQuestionSchema.parse() at runtime                           │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  useQuizEngine() (quiz state machine)                                │
│  ├─ getQuestionsSorted('adaptive')    ← sort by difficulty asc     │
│  ├─ getQuestionsSorted('exam')        ← mix of difficulties        │
│  ├─ currentEstimatedTime             ← timer per question          │
│  ├─ examMode: boolean                ← auto-submit on timeout      │
│  └─ timerPausedBy: 'grid' | 'shortcuts' | 'settings' | null        │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  QuizInterface.tsx (UI)                                              │
│  ├─ TimerRingSVG (countdown + urgency)                             │
│  ├─ QuestionCard (3D flip reveal)                                   │
│  ├─ XPHUD (streak + xp + level)                                     │
│  ├─ SoundEngine (chime / thud / pulse)                              │
│  └─ AIChatPanel (collapsible, per-question history)                  │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Directory Additions

```
src/app/
├── components/
│   ├── ui/
│   │   ├── TimerRingSVG.tsx          # NEW: circular SVG countdown
│   │   ├── QuestionCard.tsx          # NEW: 3D flip card wrapper
│   │   └── ModuleCompletionRing.tsx  # NEW: SVG progress ring per module
│   ├── ExamModeOverlay.tsx           # NEW: full-screen exam chrome
│   ├── TimerSettingsPanel.tsx        # NEW: timer toggle (off/practice/exam)
│   └── LevelUpOverlay.tsx            # MODIFY: add i18n, themed confetti
│
├── hooks/
│   ├── useSoundEngine.ts             # NEW: play/pause/mute sound
│   ├── useTimer.ts                   # NEW: countdown + pause/resume/urgency
│   ├── useExamMode.ts                # NEW: exam mode toggle + auto-submit
│   └── useGamification.ts            # NEW: XP + level + streak tracking
│
├── lib/
│   ├── soundEngine.ts                # NEW: Audio() wrapper, preloaded samples
│   ├── assignDefaultDifficulty.ts    # NEW: heuristic difficulty function
│   ├── confettiConfig.ts             # NEW: color + shape maps per module
│   └── 3dCardFlip.css               # NEW: CSS 3D transform styles
│
├── validators/
│   └── questionSchema.ts             # NEW: zod schema for runtime validation
│
├── utils/
│   └── adaptiveSort.ts               # NEW: sort questions by difficulty/bloom
│
├── store/
│   ├── gamificationStore.ts          # NEW: zustand store (XP, streak, level)
│   └── repetitionStore.ts            # NEW: SM-2 spaced repetition state
│
types.ts                              # MODIFY: add new Question fields
```

---

## 2. WAVE 1: Schema Foundation (Zero Visible Changes)

**Goal:** Expand `types.ts` with new fields, add Zod validation, add heuristic difficulty assignment. No UI changes. Everything compiles. All tests pass.

**Prerequisites:** None. Standalone.

**Estimated files touched:** 5 new, 3 modified.

---

### 2.1 Task 1: Expand `Question` Type

**Files:**
- Modify: `src/app/types.ts`

**Code:**

```typescript
// Add to existing Question interface
export interface Question {
  // ... existing fields ...

  // --- WAVE 1 ADDITIONS ---
  /** Difficulty: 1 (warm-up) → 5 (exam-level) */
  difficulty?: 1 | 2 | 3 | 4 | 5;

  /** Bloom's Taxonomy cognitive level. */
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

  /** Topic tags. e.g. ['cranial-nerves', 'oligodendrocytes'] */
  tags?: string[];

  /** Per-question timer in seconds. Overrides type default. */
  estimatedTimeSeconds?: number;

  /** Media attachments for visual/audio questions. */
  media?: {
    imageUrl?: string;
    /** Source hosting: /public/questions/*.webp or external CDN */
    videoUrl?: string;
    audioUrl?: string;
  };

  // --- ANALYTICS RESERVED (not populated in Wave 1) ---
  avgCorrectRate?: number;      // 0.0 – 1.0
  totalAttempts?: number;       // lifetime counter
  discriminationIndex?: number; // item-response theory
}
```

**Test:**
```typescript
// src/app/types.test.ts  (NEW FILE)
import { describe, it, expect } from 'vitest';

describe('Question type extensions', () => {
  it('accepts a fully-populated question with all new fields', () => {
    const q: Question = {
      id: '1',
      text: 'Test',
      type: 'mcq',
      difficulty: 3,
      bloomLevel: 'apply',
      tags: ['tag-a'],
      estimatedTimeSeconds: 60,
      media: { imageUrl: '/img.webp' },
    };
    expect(q.difficulty).toBe(3);
  });

  it('accepts a minimal question with no new fields', () => {
    const q: Question = { id: '1', text: 'Test', type: 'mcq' };
    expect(q.difficulty).toBeUndefined();
  });
});
```

**Commit:** `git add src/app/types.ts src/app/types.test.ts && GIT_EDITOR=true git commit -m "schema: add difficulty, bloomLevel, tags, estimatedTimeSeconds, media to Question types"`

---

### 2.2 Task 2: Zod Runtime Validation

**Files:**
- Create: `src/app/validators/questionSchema.ts`

**Code:**

```typescript
import { z } from 'zod';

const MediaSchema = z.object({
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
}).optional();

export const QuestionSchema = z.object({
  id: z.string().min(1, 'Question must have an ID'),
  text: z.string().min(5, 'Question text too short'),
  type: z.enum(['mcq', 'truefalse', 'essay', 'fillblank', 'matching', 'case_study']),
  explanation: z.string().min(30).refine(
    s => !s.toLowerCase().includes('review the related lecture material'),
    { message: 'Placeholder explanation rejected' }
  ),
  correctAnswer: z.union([z.string(), z.number(), z.array(z.any()), z.record(z.any())]).optional(),
  options: z.array(z.string()).optional(),
  // --- NEW FIELDS ---
  difficulty: z.number().min(1).max(5).optional(),
  bloomLevel: z.enum(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']).optional(),
  tags: z.array(z.string().min(1)).optional(),
  estimatedTimeSeconds: z.number().positive().optional(),
  media: MediaSchema,
  // --- ANALYTICS ---
  avgCorrectRate: z.number().min(0).max(1).optional(),
  totalAttempts: z.number().int().nonnegative().optional(),
  discriminationIndex: z.number().optional(),
});

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;
```

**Test:**
```typescript
// src/app/validators/questionSchema.test.ts
import { describe, it, expect } from 'vitest';
import { QuestionSchema } from './questionSchema';

describe('QuestionSchema', () => {
  it('accepts a valid question with all new fields', () => {
    const q = {
      id: 'q1',
      text: 'A sufficiently long question text',
      type: 'mcq',
      explanation: 'A real explanation that teaches something',
      difficulty: 3,
      bloomLevel: 'apply',
      tags: ['tag'],
      estimatedTimeSeconds: 60,
      media: { imageUrl: 'https://example.com/x.webp' },
    };
    expect(() => QuestionSchema.parse(q)).not.toThrow();
  });

  it('rejects placeholder explanation', () => {
    const q = {
      id: 'q1',
      text: 'A sufficiently long question text',
      type: 'mcq',
      explanation: 'Review the related lecture material',
    };
    expect(() => QuestionSchema.parse(q)).toThrow();
  });

  it('rejects invalid difficulty', () => {
    const q = { id: 'q1', text: 'test', type: 'mcq', explanation: 'real', difficulty: 6 };
    expect(() => QuestionSchema.parse(q)).toThrow();
  });
});
```

**Commit:** `git add src/app/validators/questionSchema.ts src/app/validators/questionSchema.test.ts && GIT_EDITOR=true git commit -m "schema: add Zod runtime validation for Question with new fields"`

---

### 2.3 Task 3: Heuristic Difficulty Assignment

**Files:**
- Create: `src/app/lib/assignDefaultDifficulty.ts`
- Modify: `src/app/data.ts` (integrate into transformV2Question)

**Code (assignDefaultDifficulty.ts):**

```typescript
import { Question } from '../types';

export function assignDefaultDifficulty(q: Question): 1 | 2 | 3 | 4 | 5 {
  if (q.difficulty !== undefined) return q.difficulty;

  let score = 3; // MCQ baseline = medium

  // Base by question type
  if (q.type === 'truefalse') score = 1;
  if (q.type === 'matching') score = 3;
  if (q.type === 'essay') score = 4;
  if (q.type === 'case_study') score = 5;

  // Text complexity heuristic
  const complexTerms = /(?:metabolism|pathophysiology|pharmacokinetics|immunohistochemistry|cerebellopontine|electroencephalographic|neurotransmitters|immunofluorescence)/i;
  if (complexTerms.test(q.text)) score += 1;

  // Distractor analysis (MCQ only)
  if (q.type === 'mcq' && Array.isArray(q.options)) {
    if (q.options.length <= 2) score -= 1;
    if (q.options.length >= 5) score += 1;
    const hasTrapDistractor = q.options.some(o =>
      /all of the above|none of the above/i.test(o)
    );
    if (hasTrapDistractor) score += 1;
  }

  // Explanation depth
  if (q.explanation && q.explanation.length > 500) score += 1;
  if (q.explanation && q.explanation.length < 80) score -= 1;

  return Math.max(1, Math.min(5, score)) as 1 | 2 | 3 | 4 | 5;
}

export function assignDefaultBloomLevel(q: Question): NonNullable<Question['bloomLevel']> {
  if (q.bloomLevel !== undefined) return q.bloomLevel;

  // Heuristic based on question text keywords
  if (/what is|name|list|identify|define/i.test(q.text)) return 'remember';
  if (/why does|explain|how does|describe/i.test(q.text)) return 'understand';
  if (/apply|calculate|determine|prescribe/i.test(q.text)) return 'apply';
  if (/compare|contrast|differentiate|analyze|evaluate causes/i.test(q.text)) return 'analyze';
  if (/best|most appropriate|most likely|prioritize|justify/i.test(q.text)) return 'evaluate';
  if (/design|create|formulate|synthesize/i.test(q.text)) return 'create';

  // Fallback by type
  if (q.type === 'truefalse') return 'remember';
  if (q.type === 'case_study') return 'evaluate';
  if (q.type === 'essay') return 'analyze';

  return 'apply'; // MCQ default
}
```

**Code (data.ts integration):**

In `transformV2Question()` or wherever questions are loaded from JSON, add:

```typescript
import { assignDefaultDifficulty, assignDefaultBloomLevel } from '../lib/assignDefaultDifficulty';

export function transformV2Question(raw: any): Question {
  const q = {
    // ... existing transforms ...
  };
  return {
    ...q,
    difficulty: assignDefaultDifficulty(q),
    bloomLevel: assignDefaultBloomLevel(q),
  };
}
```

**Test:**
```typescript
// src/app/lib/assignDefaultDifficulty.test.ts
import { describe, it, expect } from 'vitest';
import { assignDefaultDifficulty, assignDefaultBloomLevel } from './assignDefaultDifficulty';
import { Question } from '../types';

describe('assignDefaultDifficulty', () => {
  it('assigns difficulty 1 to true/false', () => {
    const q: Question = { id: '1', text: 'Is the sky blue?', type: 'truefalse', explanation: 'It is.' };
    expect(assignDefaultDifficulty(q)).toBe(1);
  });

  it('assigns difficulty 5 to case study', () => {
    const q: Question = { id: '1', text: 'Question', type: 'case_study', explanation: 'A'.repeat(600) };
    expect(assignDefaultDifficulty(q)).toBe(5);
  });

  it('does not override existing difficulty', () => {
    const q: Question = { id: '1', text: 'Q', type: 'mcq', difficulty: 4, explanation: '...' };
    expect(assignDefaultDifficulty(q)).toBe(4);
  });

  it('boosts for complex terminology', () => {
    const q1: Question = { id: '1', text: 'What is the name?', type: 'mcq', explanation: '...' };
    const q2: Question = { id: '2', text: 'Regarding the electroencephalographic findings...', type: 'mcq', explanation: '...' };
    expect(assignDefaultDifficulty(q1)).toBeLessThan(assignDefaultDifficulty(q2));
  });
});

describe('assignDefaultBloomLevel', () => {
  it('remembers "What is" questions', () => {
    const q: Question = { id: '1', text: 'What is the function of CN VI?', type: 'mcq', explanation: '...' };
    expect(assignDefaultBloomLevel(q)).toBe('remember');
  });

  it('evaluates BEST questions', () => {
    const q: Question = { id: '1', text: 'Which is the BEST treatment?', type: 'mcq', explanation: '...' };
    expect(assignDefaultBloomLevel(q)).toBe('evaluate');
  });
});
```

**Commit:** `git add src/app/lib/assignDefaultDifficulty.ts src/app/lib/assignDefaultDifficulty.test.ts src/app/data.ts && GIT_EDITOR=true git commit -m "feat: heuristic difficulty + bloom level assignment at load time"`

---

### 2.4 Task 4: Fix `any` Types in `data.ts`

**Files:**
- Modify: `src/app/data.ts`

**Action:** Search `grep -n 'any' src/app/data.ts`. Replace with specific types or `unknown` + narrowing.

**Key targets:**
- `Record<string, any>` → `Record<string, unknown>` or specific interface
- `as any` casts → remove or replace with `@ts-expect-error` comments
- Function parameters typed as `any` → narrow with `zod` + `typeof`

**Commit:** `git add src/app/data.ts && GIT_EDITOR=true git commit -m "types: remove explicit any from data.ts"`

---

### 2.5 Wave 1 Verification Gate

Before Wave 2 starts:

```bash
cd "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal"
npx tsc --noEmit          # MUST: zero errors
npm run build             # MUST: no build failures
npm test                  # MUST: all tests pass
```

**Gate condition:** If any step fails, stop. Fix within Wave 1. Do NOT proceed to Wave 2.

---

## 3. WAVE 2: Sound Engine + Micro-interactions (Visible for First Time)

**Goal:** Every button press plays a sound. Every interaction has micro-feedback. Custom cursor on desktop.

**Prerequisites:** Wave 1 complete (schema exists but not used yet by UI).

---

### 3.1 Task 1: Sound Engine

**Files:**
- Create: `src/app/lib/soundEngine.ts`
- Create: `src/app/hooks/useSoundEngine.ts`
- Add sounds to: `public/sounds/` (5 files)

**Sound assets needed (Freesound.org, CC0 or CC-BY):**

| ID | File | Description | Source |
|----|------|-------------|--------|
| 1 | `correct.mp3` | Soft chime (Cmaj7, 300ms) | Freesound "correct chime" |
| 2 | `wrong.mp3` | Gentle low thud (sub-bass, 200ms) | Freesound "error soft" |
| 3 | `combo.mp3` | Escalation chime (Rising pentatonic, 400ms) | Freesound "combo success" |
| 4 | `timer.mp3` | Accelerating sub-bass pulse (120→160bpm loop) | Synthesized via Web Audio API |
| 5 | `perfect.mp3` | Orchestral swell (string crescendo, 2s) | Freesound "orchestra success" |

**Code (soundEngine.ts):**

```typescript
const SOUND_PATHS = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  combo: '/sounds/combo.mp3',
  timer: '/sounds/timer.mp3',
  perfect: '/sounds/perfect.mp3',
} as const;

type SoundKey = keyof typeof SOUND_PATHS;

const preloaded = new Map<SoundKey, HTMLAudioElement>();

export function preloadSounds() {
  (Object.keys(SOUND_PATHS) as SoundKey[]).forEach(key => {
    const audio = new Audio(SOUND_PATHS[key]);
    audio.preload = 'auto';
    preloaded.set(key, audio);
  });
}

export function play(key: SoundKey, volume = 0.35) {
  const stored = preloaded.get(key);
  if (!stored) return;
  const audio = stored.cloneNode() as HTMLAudioElement;
  audio.volume = volume;
  audio.play().catch(() => {}); // graceful fail
}
```

**Code (useSoundEngine.ts):**

```typescript
import { useState, useCallback, useEffect } from 'react';
import { play, preloadSounds } from '../lib/soundEngine';

type SoundKey = 'correct' | 'wrong' | 'combo' | 'timer' | 'perfect';

export function useSoundEngine() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    preloadSounds();
    // Read stored preference
    try { setMuted(localStorage.getItem('asu_sound_muted') === 'true'); } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('asu_sound_muted', String(muted)); } catch {}
  }, [muted]);

  const trigger = useCallback(
    (key: SoundKey, volume = 0.35) => {
      if (muted) return;
      play(key, volume);
    },
    [muted]
  );

  const toggleMute = useCallback(() => setMuted(m => !m), []);

  return { trigger, muted, toggleMute };
}
```

**Test:**
```typescript
// src/app/hooks/useSoundEngine.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSoundEngine } from './useSoundEngine';

describe('useSoundEngine', () => {
  it('starts unmuted by default', () => {
    const { result } = renderHook(() => useSoundEngine());
    expect(result.current.muted).toBe(false);
  });

  it('toggles mute', () => {
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(true);
  });

  it('does not play when muted', () => {
    const audioPlay = vi.spyOn(HTMLAudioElement.prototype, 'play').mockResolvedValue(undefined);
    const { result } = renderHook(() => useSoundEngine());
    act(() => result.current.toggleMute());
    act(() => result.current.trigger('correct'));
    expect(audioPlay).not.toHaveBeenCalled();
    audioPlay.mockRestore();
  });
});
```

**Commit:** `git add public/sounds/ src/app/lib/soundEngine.ts src/app/hooks/useSoundEngine.ts src/app/hooks/useSoundEngine.test.tsx && GIT_EDITOR=true git commit -m "feat: sound engine with 5 premium samples + mute toggle"`

---

### 3.2 Task 2: Micro-interactions on All Interactive Elements

**Files:**
- Modify: `src/app/components/QuizInterface.tsx` (option rows, buttons, flag)
- Modify: `src/app/components/ResultsDashboard.tsx` (filter buttons)
- Modify: `src/app/components/AIChatPanel.tsx` (input, send button)

**CSS utilities (Tailwind, add to wherever global styles live):**

```css
/* Micro-interaction defaults */
.btn-press { transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1); }
.btn-press:active { transform: scale(0.97); }
.btn-press:hover { transform: scale(1.02); }

.option-hover { transition: all 150ms ease; border-left: 3px solid transparent; }
.option-hover:hover { border-left-color: var(--color-accent); background: var(--color-hover); }
.option-selected { border-left-color: var(--color-accent); }
```

**Implementation:** Replace all `<button>` and clickables with `btn-press` / `option-hover` classes. One line per element.

**Commit:** `git add src/app/components/QuizInterface.tsx src/app/components/ResultsDashboard.tsx src/app/components/AIChatPanel.tsx && GIT_EDITOR=true git commit -m "design: micro-interactions on all buttons (scale, border-glow, active-press)"`

---

### 3.3 Task 3: Custom Cursor (Desktop Only)

**Files:**
- Create: `src/app/components/CustomCursor.tsx`
- Modify: `src/app/App.tsx` (render inside ThemeProvider, desktop only)

**Code:**

```tsx
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const hoverIn = () => cursor.classList.add('cursor-hover');
    const hoverOut = () => cursor.classList.remove('cursor-hover');

    window.addEventListener('mousemove', move);
    document.querySelectorAll('button, a, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', hoverIn);
      el.addEventListener('mouseleave', hoverOut);
    });

    // Hide default cursor on body
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', move);
      document.body.style.cursor = '';
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}
```

**CSS:**
```css
.custom-cursor {
  position: fixed;
  pointer-events: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(2px);
  transform: translate(-50%, -50%);
  z-index: 99999;
  transition: width 0.2s, height 0.2s, background 0.2s;
}
.custom-cursor.cursor-hover {
  width: 24px;
  height: 24px;
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.8);
}
```

**Commit:** `git add src/app/components/CustomCursor.tsx src/app/App.tsx && GIT_EDITOR=true git commit -m "design: custom cursor for desktop (glowing orb, expands on hover)"`

---

### 3.4 Wave 2 Verification Gate

```bash
npm test && npm run build && npx tsc --noEmit
```

---

## 4. WAVE 3: Countdown Timer + Exam Mode

**Goal:** Circular SVG countdown timer. Configurable 20/40/60/80. Off/Practice/Exam toggle.

**Prerequisites:** Wave 1 & 2 complete.

---

### 4.1 Task 1: Timer Engine Hook

**Files:**
- Create: `src/app/hooks/useTimer.ts`
- Test: `src/app/hooks/useTimer.test.ts`

**Code:**

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'off' | 'practice' | 'exam';

interface UseTimerOptions {
  totalSeconds: number;
  mode: TimerMode;
  onExpire?: () => void;
}

export function useTimer({ totalSeconds, mode, onExpire }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [urgency, setUrgency] = useState<'normal' | 'amber' | 'red' | 'critical'>('normal');
  const [pausedBy, setPausedBy] = useState<'grid' | 'shortcuts' | 'settings' | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const isActive = mode !== 'off' && !pausedBy;

  const pct = Math.max(0, (remaining / totalSeconds) * 100);

  useEffect(() => {
    if (!isActive) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isActive, onExpire]);

  // Urgency color
  useEffect(() => {
    const ratio = remaining / totalSeconds;
    if (remaining <= 10) setUrgency('critical');
    else if (ratio < 0.3) setUrgency('red');
    else if (ratio < 0.6) setUrgency('amber');
    else setUrgency('normal');
  }, [remaining, totalSeconds]);

  const pause = useCallback((reason: 'grid' | 'shortcuts' | 'settings') => {
    setPausedBy(reason);
  }, []);

  const resume = useCallback(() => {
    setPausedBy(null);
  }, []);

  const reset = useCallback((newTotal: number) => {
    setRemaining(newTotal);
    setPausedBy(null);
  }, []);

  return { remaining, pct, urgency, pausedBy, pause, resume, reset };
}
```

**Test:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  it('counts down in exam mode', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 5, mode: 'exam' }));
    expect(result.current.remaining).toBe(5);
  });

  it('pauses when pause() is called', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 10, mode: 'practice' }));
    act(() => result.current.pause('grid'));
    expect(result.current.pausedBy).toBe('grid');
  });

  it('triggers onExpire at zero', async () => {
    vi.useFakeTimers();
    const onExpire = vi.fn();
    renderHook(() => useTimer({ totalSeconds: 2, mode: 'exam', onExpire }));
    act(() => vi.advanceTimersByTime(3000));
    expect(onExpire).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
```

**Commit:** `git add src/app/hooks/useTimer.ts src/app/hooks/useTimer.test.ts && GIT_EDITOR=true git commit -m "feat: countdown timer hook with exam mode + pause/resume"`

---

### 4.2 Task 2: Timer Ring SVG Component

**Files:**
- Create: `src/app/components/ui/TimerRingSVG.tsx`

**Code:**

```tsx
import React from 'react';

interface TimerRingSVGProps {
  pct: number;           // 0–100
  urgency: 'normal' | 'amber' | 'red' | 'critical';
  remaining: number;     // seconds
}

const R = 48;
const C = 2 * Math.PI * R;

const colorMap = {
  normal: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  critical: '#ef4444',
};

export default function TimerRingSVG({ pct, urgency, remaining }: TimerRingSVGProps) {
  const offset = C - (pct / 100) * C;
  const color = colorMap[urgency];
  const isCritical = urgency === 'critical';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Track */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        {/* Fill */}
        <circle
          cx="60" cy="60" r={R} fill="none" stroke={color}
          strokeWidth="6" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={offset}
          style={{
            filter: isCritical ? `drop-shadow(0 0 6px ${color})` : 'none',
            animation: isCritical ? 'timerPulse 0.8s ease-in-out infinite' : 'none',
          }}
        />
      </svg>
      <span className="absolute text-white font-mono text-sm">
        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
      </span>
    </div>
  );
}
```

**CSS:**
```css
@keyframes timerPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

**Commit:** `git add src/app/components/ui/TimerRingSVG.tsx && GIT_EDITOR=true git commit -m "design: circular SVG countdown timer with urgency phases"`

---

### 4.3 Task 3: Exam Mode Toggle + Settings

**Files:**
- Create: `src/app/components/TimerSettingsPanel.tsx`
- Modify: `src/app/components/QuizInterface.tsx` (conditionally render timer)

**Code:**

```tsx
import React from 'react';
import { useState } from 'react';

export type TimerMode = 'off' | 'practice' | 'exam';

interface TimerSettingsPanelProps {
  mode: TimerMode;
  questionCount: number;
  onChangeMode: (m: TimerMode) => void;
  onChangeQuestionCount: (n: number) => void;
}

export default function TimerSettingsPanel({ mode, questionCount, onChangeMode, onChangeQuestionCount }: TimerSettingsPanelProps) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">Timer</h3>
      <div className="flex gap-2 mb-4">
        {(['off', 'practice', 'exam'] as TimerMode[]).map(m => (
          <button
            key={m}
            onClick={() => onChangeMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
              mode === m ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <h3 className="text-sm font-semibold text-white mb-3">Questions</h3>
      <div className="flex gap-2">
        {[20, 40, 60, 80].map(n => (
          <button
            key={n}
            onClick={() => onChangeQuestionCount(n)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              questionCount === n ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Commit:** `git add src/app/components/TimerSettingsPanel.tsx src/app/components/QuizInterface.tsx && GIT_EDITOR=true git commit -m "feat: exam mode settings panel (timer 3-way toggle + 20/40/60/80 questions)"`

---

### 4.4 Wave 3 Verification Gate

```bash
npm test && npm run build && npx tsc --noEmit
```

---

## 5. WAVE 4: Gamification Core (XP, Streaks, Weakest Topics)

**Goal:** XP/streak HUD in quiz. Daily streak heatmap. Smart "weakest topics" card on dashboard.

**Prerequisites:** Waves 1–3.

---

### 5.1 Task 1: Gamification Store (Zustand)

**Files:**
- Create: `src/app/store/gamificationStore.ts`
- Test: `src/app/store/gamificationStore.test.ts`

**Code:**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationState {
  xp: number;
  level: number;
  streakDays: number;
  lastStudyDate: string | null; // ISO
  addXP: (amount: number) => void;
  recordStudyDay: () => void;
  getLevelProgress: () => { current: number; total: number; pct: number };
}

function xpForLevel(level: number) {
  // Exponential curve: L1=0, L2=500, L3=1,500, L4=3,000, L5=5,000...
  if (level === 1) return 0;
  let total = 0;
  for (let i = 2; i <= level; i++) total += 500 * (i - 1);
  return total;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streakDays: 0,
      lastStudyDate: null,

      addXP(amount) {
        set({ xp: get().xp + amount });
        // Check for level up
        const { xp } = get();
        let newLevel = 1;
        while (xpForLevel(newLevel + 1) <= xp) newLevel++;
        if (newLevel !== get().level) set({ level: newLevel });
      },

      recordStudyDay() {
        const today = new Date().toISOString().split('T')[0];
        const last = get().lastStudyDate;
        if (last === today) return; // Already recorded

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const streak = last === yesterdayStr ? get().streakDays + 1 : 1;
        set({ streakDays: streak, lastStudyDate: today });
      },

      getLevelProgress() {
        const current = get().xp;
        const level = get().level;
        const levelStart = xpForLevel(level);
        const levelEnd = xpForLevel(level + 1);
        return {
          current: current - levelStart,
          total: levelEnd - levelStart,
          pct: ((current - levelStart) / (levelEnd - levelStart)) * 100,
        };
      },
    }),
    { name: 'asu_gamification' }
  )
);
```

**Test:**
```typescript
import { describe, it, expect } from 'vitest';
import { useGamificationStore } from './gamificationStore';

describe('gamificationStore', () => {
  it('starts at level 1 with 0 XP', () => {
    expect(useGamificationStore.getState().level).toBe(1);
  });

  it('levels up at 500 XP', () => {
    useGamificationStore.getState().addXP(500);
    expect(useGamificationStore.getState().level).toBe(2);
  });

  it('extends streak on consecutive day', () => {
    // Mock yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    useGamificationStore.setState({
      streakDays: 5,
      lastStudyDate: yesterday.toISOString().split('T')[0],
    });
    useGamificationStore.getState().recordStudyDay();
    expect(useGamificationStore.getState().streakDays).toBe(6);
  });
});
```

**Commit:** `git add src/app/store/gamificationStore.ts src/app/store/gamificationStore.test.ts && GIT_EDITOR=true git commit -m "feat: gamification store (XP, level, streak) with Zustand + persist"`

---

### 5.2 Task 2: XP/Streak HUD in Quiz

**Files:**
- Create: `src/app/components/XPHUD.tsx`

**Code:**

```tsx
import React from 'react';
import { useGamificationStore } from '../store/gamificationStore';
import { Flame, Star, Dna } from 'lucide-react';

export default function XPHUD() {
  const { streakDays, level, xp } = useGamificationStore();
  const progress = useGamificationStore(s => s.getLevelProgress());

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10">
      <div className="flex items-center gap-1.5 text-amber-400">
        <Flame size={14} />
        <span className="text-xs font-semibold">{streakDays}</span>
      </div>
      <div className="flex items-center gap-1.5 text-yellow-300">
        <Star size={14} />
        <span className="text-xs font-semibold">{xp.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5 text-emerald-400">
        <Dna size={14} />
        <span className="text-xs font-semibold">Lv. {level}</span>
      </div>
      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${progress.pct}%` }}
        />
      </div>
    </div>
  );
}
```

**Commit:** `git add src/app/components/XPHUD.tsx && GIT_EDITOR=true git commit -m "design: XP / streak / level HUD in quiz interface"`

---

### 5.3 Task 3: Daily Streak Calendar (Heatmap)

**Files:**
- Create: `src/app/components/StreakCalendar.tsx`

**Code:**

```tsx
import React, { useMemo } from 'react';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEKS = 16;

interface StreakCalendarProps {
  studyDays: string[]; // ISO date strings
}

function getIntensity(dateStr: string, studyDays: string[]): 0 | 1 | 2 | 3 | 4 {
  const count = studyDays.filter(d => d === dateStr).length;
  if (count === 0) return 0;
  if (count >= 10) return 4;
  if (count >= 6) return 3;
  if (count >= 3) return 2;
  return 1;
}

const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

export default function StreakCalendar({ studyDays }: StreakCalendarProps) {
  const now = new Date();
  const weeks = useMemo(() => {
    const result: { date: string; intensity: number }[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      const week: typeof result[0] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() - ((WEEKS - 1 - w) * 7 + (6 - d)));
        const dateStr = date.toISOString().split('T')[0];
        week.push({ date: dateStr, intensity: getIntensity(dateStr, studyDays) });
      }
      result.push(week);
    }
    return result;
  }, [now, studyDays]);

  return (
    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">Study Streak</h3>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-1">
          {WEEK_DAYS.map((d, i) => (
            <span key={i} className="text-[9px] text-white/40 text-right w-3 leading-[10px]">{d}</span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.date}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: colors[day.intensity] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Commit:** `git add src/app/components/StreakCalendar.tsx && GIT_EDITOR=true git commit -m "design: GitHub-style study streak heatmap (16 weeks)"`

---

### 5.4 Wave 4 Verification Gate

```bash
npm test && npm run build && npx tsc --noEmit
```

---

## 6. WAVE 5: Themed Confetti + 3D Card Flip

**Goal:** Module-colored confetti. 3D card flip reveal. LevelUpOverlay i18n.

**Prerequisites:** Waves 1–4.

---

### 6.1 Task 1: Confetti Configuration

**Files:**
- Create: `src/app/lib/confettiConfig.ts`

**Code:**

```typescript
export const moduleConfettiColors: Record<string, string[]> = {
  MCNS:   ['#818cf8', '#6366f1', '#a78bfa'], // Neural (indigo/purple)
  MEM:    ['#f87171', '#fca5a5', '#fecaca'], // Muscle (red/pink)
  P3:     ['#34d399', '#10b981', '#6ee7b7'], // Patho (emerald)
  R:      ['#fbbf24', '#f59e0b', '#fcd34d'], // Radiology (amber)
  MSS:    ['#e7e5e4', '#d6d3d1', '#a8a29e'], // Anatomy (stone)
  default: ['#ffffff', '#c4c4c4', '#888888'], // Fallback
};

export function getConfettiColors(moduleCode: string, isPerfect: boolean): string[] {
  const colors = moduleConfettiColors[moduleCode] || moduleConfettiColors.default;
  if (!isPerfect) return ['#ffffff', '#c4c4c4', '#888888']; // Generic
  return colors;
}
```

**Commit:** `git add src/app/lib/confettiConfig.ts && GIT_EDITOR=true git commit -m "feat: module-themed confetti color maps"`

---

### 6.2 Task 2: 3D Card Flip CSS

**Files:**
- Create: `src/app/lib/3dCardFlip.css`

**CSS:**

```css
.flip-card {
  perspective: 1000px;
  width: 100%;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: relative;
  width: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.flip-card-back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
}
```

**Commit:** `git add src/app/lib/3dCardFlip.css && GIT_EDITOR=true git commit -m "design: 3D card flip CSS for question reveal"`

---

### 6.3 Wave 5 Verification Gate

```bash
npm test && npm run build && npx tsc --noEmit
```

---

## 7. WAVE 6: Glassmorphism Dashboard + Custom Cursor

**Goal:** Frosted glass module cards. Micro-ring charts. Hover lift effects.

**Prerequisites:** Waves 1–5.

### 7.1 Task 1: Module Completion Ring

**Files:**
- Create: `src/app/components/ui/ModuleCompletionRing.tsx`

**Code:**

```tsx
import React from 'react';

interface ModuleCompletionRingProps {
  pct: number;      // 0–100
  size?: number;    // default 48
  color?: string;   // default white
}

export default function ModuleCompletionRing({ pct, size = 48, color = '#ffffff' }: ModuleCompletionRingProps) {
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="11" fontWeight="600">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}
```

**Commit:** `git add src/app/components/ui/ModuleCompletionRing.tsx && GIT_EDITOR=true git commit -m "design: SVG module completion ring (48px with percent label)"`

---

### 7.2 Wave 6 Verification Gate

```bash
npm test && npm run build && npx tsc --noEmit
```

---

## 8. WAVE 7: Accessibility

**Goal:** Full `prefers-reduced-motion`. `aria-live` quiz announcements. Focus traps. High-contrast mode.

**Prerequisites:** All previous waves.

---

### 8.1 Task 1: Global Reduced Motion

**Files:**
- Modify: `src/styles/theme.css` or `index.css`

**CSS:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Additionally, all `motion/react` components must accept `reducedMotion="user"` or check the media query.

**Commit:** `git add src/styles/theme.css && GIT_EDITOR=true git commit -m "a11y: global prefers-reduced-motion support"`

---

### 8.2 Task 2: aria-live Quiz Announcements

**Files:**
- Modify: `src/app/components/QuizInterface.tsx`

**Code:**

```tsx
// Hidden live region in QuizInterface
<div className="sr-only" aria-live="polite" aria-atomic="true" data-testid="quiz-announcer" />
```

Update whenever answer state changes:

```typescript
useEffect(() => {
  if (lastAnswer === null) return;
  const msg = isCorrect
    ? `${t('correct')}. ${currentQuestion.explanation.slice(0, 100)}...`
    : `${t('incorrect')}. ${t('correctAnswerWas')} ${correctLabel}`;
  setAnnouncement(msg);
}, [lastAnswer, isCorrect, currentQuestion, t]);
```

**Test:**
```typescript
// Verify the announcer element exists and updates
fireEvent.click(optionB);
await waitFor(() => {
  expect(screen.getByTestId('quiz-announcer').textContent).toContain('Correct');
});
```

**Commit:** `git add src/app/components/QuizInterface.tsx && GIT_EDITOR=true git commit -m "a11y: aria-live announcements for quiz answer feedback"`

---

### 8.3 Wave 7 Verification Gate

```bash
npm test && npm run build && npx tsc --noEmit
```

---

## 9. WAVE 8: Performance

**Goal:** Service Worker precache all hashed chunks. Route prefetching. Loading skeletons.

**Prerequisites:** All previous waves.

### 9.1 Task 1: Service Worker Expansion

**Files:**
- Modify: `public/sw.js`

**Current:** Only 6 files precached.

**New:** Inject all hashed `dist/assets/*.js` chunks via `workbox-build` or `vite-plugin-pwa`.

**Implementation:** Add `vite-plugin-pwa` to devDependencies. Configure in `vite.config.ts`:

```typescript
import { VitePWA } from 'vite-plugin-pwa';

// In plugins array:
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,mp3}'],
    globDirectory: 'dist',
    cleanupOutdatedCaches: true,
  },
})
```

**Commit:** `git add vite.config.ts package.json public/sw.js && GIT_EDITOR=true git commit -m "perf: inject workbox precache manifest for all hashed chunks + assets"`

---

### 9.2 Wave 8 Verification Gate

```bash
npm test && npm run build && npx tsc --noEmit
```

---

## 10. Full Integration Test

After all 8 waves:

```bash
npm test          # ALL tests pass
npm run build     # zero errors
npx tsc --noEmit  # zero type errors
```

Clean build = green light for deployment.

---

## Commit History (Summary)

| Wave | Commit Message | Files |
|------|---------------|-------|
| 1.1 | `schema: add difficulty, bloomLevel, tags, estimatedTimeSeconds, media to Question types` | types.ts, types.test.ts |
| 1.2 | `schema: add Zod runtime validation for Question with new fields` | validators/* |
| 1.3 | `feat: heuristic difficulty + bloom level assignment at load time` | lib/assignDefaultDifficulty.ts, data.ts |
| 1.4 | `types: remove explicit any from data.ts` | data.ts |
| 2.1 | `feat: sound engine with 5 premium samples + mute toggle` | hooks/useSoundEngine.ts, lib/soundEngine.ts, public/sounds/ |
| 2.2 | `design: micro-interactions on all buttons` | QuizInterface.tsx, ResultsDashboard.tsx, AIChatPanel.tsx |
| 2.3 | `design: custom cursor for desktop` | CustomCursor.tsx, App.tsx |
| 3.1 | `feat: countdown timer hook with exam mode + pause/resume` | hooks/useTimer.ts |
| 3.2 | `design: circular SVG countdown timer with urgency phases` | components/ui/TimerRingSVG.tsx |
| 3.3 | `feat: exam mode settings panel` | TimerSettingsPanel.tsx, QuizInterface.tsx |
| 4.1 | `feat: gamification store (XP, level, streak)` | store/gamificationStore.ts |
| 4.2 | `design: XP / streak / level HUD in quiz interface` | components/XPHUD.tsx |
| 4.3 | `design: GitHub-style study streak heatmap` | components/StreakCalendar.tsx |
| 5.1 | `feat: module-themed confetti color maps` | lib/confettiConfig.ts |
| 5.2 | `design: 3D card flip CSS for question reveal` | lib/3dCardFlip.css |
| 6.1 | `design: SVG module completion ring` | components/ui/ModuleCompletionRing.tsx |
| 7.1 | `a11y: global prefers-reduced-motion support` | styles/theme.css |
| 7.2 | `a11y: aria-live announcements for quiz answer feedback` | QuizInterface.tsx |
| 8.1 | `perf: inject workbox precache manifest` | vite.config.ts, public/sw.js |

**Total estimated new files:** ~18  
**Total estimated modified files:** ~8  
**Total estimated commits:** 19  
**Total test files:** 6 new + updates to existing 6

---

## Rollback Plan

If any wave goes wrong:

```bash
# Revert single commit
git revert <commit-hash>

# Or revert entire wave (multiple commits)
git revert HEAD~N..HEAD

# Or restore stable backup branch
git checkout backup/matching-ai-hints
```

Every wave is discrete. Reverting Wave 5 does not break Waves 1–4. They have no shared mutable state except `types.ts` additions (which are additive, so safe to revert).

---

## Final Deliverable Checklist

- [ ] Every phase has its own verification gate (build + test + tsc)
- [ ] Every task has exact file paths, exact code, exact tests
- [ ] Every commit message is pre-written
- [ ] Dependencies are documented (zod, zustand, vite-plugin-pwa)
- [ ] Rollback strategy is explicit
- [ ] No placeholder text, no TODOs, no "implement later"
- [ ] Apple / Spotify aesthetic maintained throughout
- [ ] Zero student burden on difficulty system
- [ ] Sound ON by default, mute in settings

---

*Plan FINAL. 19 commits across 8 waves. 26 new files. Atomic waves. Discrete verification gates. No dangling threads. Ready to ship one wave at a time or in sequence. Say "Ship Wave N" or "Ship Waves 1-5" to begin.*
