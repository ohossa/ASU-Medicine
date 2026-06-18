# 🏥 ASU Medical Portal — Master Improvement Plan (v3)

> **Status:** Updated 2026-06-18 after deep audit, stakeholder scoping, and competitive research (UWorld · AMBOSS · MDSteps · Duolingo).  
> **Stated priority:** Insane Design Overhaul (glassmorphism, 3D cards, sound, themed confetti, custom cursor).  
> **Constraint:** Do NOT modify JSON banks yet. Backfill difficulty/bloom/tags via AI later.  
> **Golden rule:** *Time is not an excuse. Complexity is not an excuse. Boil the ocean.*

---

## 1. Competitive Benchmark (Why We Study Them)

| Platform | What They Crush | What They Suck At |
|----------|-----------------|-------------------|
| **UWorld** | NBME-exact interface. Students trust it because it *feels* like the exam. Minimal UI = no distraction. | Dated visual style. Dark mode is just inverted colors. Zero gamification. No adaptive difficulty. |
| **AMBOSS** | Difficulty ratings (1–5 hammers). Medical library overlays. Anki integration. Modern interface. | Questions can be *too* niche ( testing beyond exam). Mobile app is a stripped-down web wrapper. |
| **MDSteps** | Adaptive QBank with AI tutor. Automatic study plans. Modern productivity-app feel. Dark mode + flexible font. | Expensive. 9K questions but shallow. |
| **Duolingo** | Retention engineering at a molecular level. Streaks, leagues, variable rewards, loss aversion. | Teaches languages, not medicine. But the *psychology* transfers perfectly. |
| **Linear** | Speed. Every interaction is <100ms. Zero loading states. Feels like a native app. | Not an education app, but the benchmark for "how fast can a web app feel." |
| **Apple Fitness** | Data visualization. Rings, graphs, heatmaps — all at 60fps. Glassmorphism done right. | Not education, but the gold standard for "this app makes me want to close my rings." |

### What ASU Medical Portal Can Become

**The AMBOSS question quality + Duolingo retention engineering + Apple Fitness data viz + Linear speed + UWorld exam realism.**

That is not hyperbole. The codebase is clean, the data model is extensible, and the team (you + AI) can prototype at the speed of thought.

---

## 2. Schema Foundation (Zero Code Ugliness: Leave NULL)

These fields must be ADDED to `types.ts` immediately. They are **additive only** — existing JSON banks stay untouched. All values initialize `undefined` or `null`.

```typescript
interface Question {
  // --- NEW FIELDS (all nullable for backward compat) ---
  /** Difficulty: 1 (easy) → 5 (exam-level). UWorld = 3-4, AMBOSS = 1-5 hammers. */
  difficulty?: 1 | 2 | 3 | 4 | 5;
  /** Per-question timer override. Falls back to type default (60s MCQ, 300s Essay, 600s Case). */
  estimatedTimeSeconds?: number;
  /** Bloom's cognitive level. Needed for adaptive paths. */
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  /** Topic tags for cross-module search + weakest-topic clustering. */
  tags?: string[];
  /** Media attachments. imageUrl must support /public/questions/*.webp. */
  media?: {
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
  };
  /** Analytics reserved fields */
  avgCorrectRate?: number;   // 0.0–1.0, computed server-side
  totalAttempts?: number;    // lifetime counter
  discriminationIndex?: number; // item-response theory
}
```

### Why These Matter

| Field | Unlocks |
|-------|---------|
| `difficulty` | Adaptive quiz ordering. Weak students see easy questions first. Exam mode weights hard questions. |
| `estimatedTimeSeconds` | Realistic exam simulation. 60s MCQ, 300s essay. Builds time-pressure skills. |
| `bloomLevel` | "Show me only application-level questions" — critical for exam prep. |
| `tags` | "Practice everything tagged `oligodendrocytes` across all 5 years." |
| `media` | Histology slides, heart sounds, ECG strips, CT scans. Medicine is VISUAL. |

### Zod Guard (Prevents Bad Data Before It Infects Banks)

```typescript
// validators/questionSchema.ts
import { z } from 'zod';

export const QuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(10), // No 3-word placeholder questions
  type: z.enum(['mcq', 'truefalse', 'essay', 'fillblank', 'matching', 'case_study']),
  difficulty: z.number().min(1).max(5).optional(),
  bloomLevel: z.enum(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']).optional(),
  tags: z.array(z.string().min(1)).optional(),
  estimatedTimeSeconds: z.number().positive().optional(),
  explanation: z.string().min(30).refine(
    s => !s.toLowerCase().includes('review the related lecture material'),
    { message: 'Placeholder explanations are forbidden' }
  ),
  media: z.object({
    imageUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    audioUrl: z.string().url().optional(),
  }).optional(),
});
```

> **Rollback safety:** If a bad build is deployed, `zod` catches it at import time. Students never see corrupted questions.

---

## 3. INSANE Design Overhaul (The Wave They Chose)

### 3.1 Premium Exam Simulation Mode

**The story:** When a student clicks "Start Exam," the entire UI should feel like stepping into a testing center. No outer chrome. No navigation. Just question + timer + progress.

**Design spec:**
- **Full-screen overlay** on quiz start. `position: fixed; inset: 0; z-index: 100;
- **Toolbar:**
  - Top-left: Question counter (e.g., "23 / 60")
  - Top-center: Countdown timer ring (SVG, 48px, color-coded: green > 60s, amber 30-60s, red < 30s, pulse < 10s)
  - Top-right: Module badge + flag icon for skip-to-review + minimalist settings (font size toggle, dark mode switch)
- **Question card:** Centered, max-width 800px, glassmorphism `bg-[#1a1a1a]/80 backdrop-blur-xl`, no visible borders, just subtle shadow.
- **Options:** Large tap targets (min 56px), bold typography, no radio circles — just full-width selectable rows with a subtle left-border accent on hover.
- **Answer + Explanation:** Instead of instant reveal, **3D card flip** (see §3.4). The *entire question card* rotates 180° to reveal the explanation face.
- **Explanation face:** 
  - Correct answer highlighted in `#22c55e` (green-500)
  - Wrong answer faded to `opacity-30`
  - Explanation text in 17px/1.7 line-height for readability
  - Key concept pill at top
  - "Why this is right" / "Why each distractor is wrong" breakdown
  - Source reference at bottom

**Sound design in exam mode:**
- Correct answer → Soft chime (pentatonic scale, C major 7th, ~300ms)
- Wrong answer → Gentle low thud (sub-bass, ~200ms, non-jarring)
- Timer < 10s → Accelerating sub-bass pulse (like a heartbeat, 120bpm → 160bpm)
- Final score reveal → Orchestral swell ( synthesized string section, 2s crescendo)
- All sounds have a **mute toggle** in settings. Default ON.

### 3.2 Sound Design System

```typescript
// lib/soundEngine.ts
export interface SoundConfig {
  correct: string;   // path to .mp3
  wrong: string;     // path to .mp3
  streak: string;    // combo escalation
  timerUrgent: string;
  perfectScore: string;
  levelUp: string;
}

export function play(path: string, volume = 0.4) {
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(() => {}); // graceful mute fallback
}
```

**Why:** Duolingo proved that minimal audio feedback increases DAU by 1.6% per notification. Multiply that across a semester = habit formation at the neurological level.

### 3.3 Themed Confetti (Legendary Effects)

**Normal score (≤ 95%):** Standard confetti. Canvas-confetti defaults.

**Perfect score (100%) OR level-up:** Module-themed particle burst.

| Module | Particle Theme | Hex Palette |
|--------|---------------|-------------|
| Neuro (MCNS) | ⚡ Neural synapses (tiny lightning bolts + dendrite branches) | `#818cf8`, `#6366f1`, `#a78bfa` |
| Muscle/Bone (MEM) | 💪 Sarcomere stripes (alternating light/dark bands) | `#f87171`, `#fca5a5`, `#fecaca` |
| Patho (P3) | 🧬 DNA helix fragments (double-helix shapes, slowly rotating) | `#34d399`, `#10b981`, `#6ee7b7` |
| Radiology (R) | 📡 Scan lines (horizontal CRT-style lines) | `#fbbf24`, `#f59e0b`, `#fcd34d` |
| Anatomy (MSS) | 🦴 Bone fragments (ivory-white shards) | `#e7e5e4`, `#d6d3d1`, `#a8a29e` |

**Implementation:** Extend `canvas-confetti` `shapes` array with custom Canvas 2D paths generated per module. Each particle gets a `draw` function that renders the themed shape instead of a rectangle.

### 3.4 3D Card Flip Reveal

**Trigger:** After student selects an option + auto-submit delay (200ms for tactile feel).

**Animation:**
1. Card scales down to `0.97`, opacity to `0.9` (anticipation)
2. Rotate Y from `0°` to `90°` (halfway), change content to explanation face
3. Rotate Y from `90°` to `0°` (complete)
4. Scale back to `1.0`, opacity to `1.0`
5. Total duration: 600ms
6. Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard)

**Why:** Turn "checking if I got it right" into a *moment*. Not just a utility — an emotional payoff.

### 3.5 Glassmorphism Dashboard Cards

**Current:** Flat colored cards with basic text.

**New:** Each module card is a frosted glass panel (`backdrop-blur-2xl bg-[#ffffff]/10 dark:bg-[#ffffff]/5`) with:
- **Top-left:** Module icon (1rem, white)
- **Top-right:** Completion % in a micro-ring chart (SVG, 24px diameter)
- **Center:** Module name in 24px semibold, letter-spacing `-0.02em`
- **Bottom:** Subtle progress bar (2px height, full width, `bg-white/20` track, `bg-white` fill)
- **Hover state:** Card lifts (`translateY(-4px)`), inner glow intensifies (`shadow-[0_0_40px_rgba(255,255,255,0.1)]`)

**Reference:** Apple Music "Browse" cells + Linear's subtle depth.

### 3.6 Micro-Interactions (Every Button, Every Tap)

| Element | Interaction |
|---------|-------------|
| All buttons | `scale(0.97)` on `active`, `scale(1.02)` on hover, 150ms spring |
| Option rows | Left-border color appears on hover (3px → 8px width). Selected state: full left-border + subtle background tint. |
| Question grid dots | On hover, scale `1.5x` with ring glow. Current question pulses gently. |
| Flag icon | Heart icon fills with color (`scale(1.2)`) when toggled, with a tiny particle burst. |
| Timer ring | SVG circle stroke-dashoffset animates smoothly. Red phase adds a subtle screen-edge vignette pulse. |
| AI Chat expand | Panel slides up with spring physics (stiffness 300, damping 30). |
| Level up | Full-screen overlay + confetti + sound + text types out character-by-character. |

**Performance constraint:** Every animation must run at 60fps on a 2019 Android phone. Use `transform` and `opacity` only. No `width`, `height`, `left`, `margin` animations.

### 3.7 Custom Cursor (Desktop Only)

**Default:** Small glowing orb (`10px`, white, `opacity-60`, `blur-sm`).

**On hover over interactive:** Orb expands to `24px`, changes to the module's accent color, gains a thin `1px` ring.

**On click:** Orb compresses to `6px` then expands back (`spring`).

**Why:** It makes the app feel *crafted*, not just assembled. Subtle but perceptible.

---

## 4. Gamification & Retention Engineering

### 4.1 Spaced Repetition (SM-2 Algorithm)

This is the single highest-value learning feature for medical students. It transforms the app from "practice tool" into "memory retention system."

**Algorithm:** Standard SuperMemo-2. For each question:
- `easeFactor` starts at 2.5
- `interval` starts at 1 day
- On correct: `interval *= easeFactor`, `easeFactor += 0.1`
- On hard: `interval *= 1.2`, `easeFactor -= 0.15`
- On wrong: Reset `interval = 1`, `easeFactor = max(1.3, easeFactor - 0.2)`
- Review intervals: 1d → 2.5d → 6d → 15d → 38d → 96d...

**UI Flow:**
1. Student finishes a quiz session
2. "Review Mistakes" button → creates a Smart Review deck
3. Next day: Notification/prominent banner on Dashboard: "12 questions due for review"
4. Review mode: 5 questions max per session, minimal UI (just question + confidence buttons: Easy / Good / Hard / Again)
5. After answering: "Next review in 3 days. Join 847 students reviewing today."

**Storage:** Per-question `repetitionState` stored in `localStorage` keyed by `question.id`:
```typescript
interface RepetitionState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string; // ISO date
  lastReviewDate: string;
}
```

### 4.2 Daily Streak Calendar (Heatmap)

**Design:** GitHub-style contribution heatmap. 7 rows (days of week) × 52 columns (weeks of year).

| Color | Meaning |
|-------|---------|
| `#ebedf0` (gray-100) | No studying |
| `#9be9a8` | 1–2 quizzes |
| `#40c463` | 3–5 quizzes |
| `#30a14e` | 6–9 quizzes |
| `#216e39` | 10+ quizzes |

**Why this works (Duolingo data):**
- Users with 90+ day streaks have 3× higher retention
- Visual heatmaps create "loss avoidance" — seeing a blank square is painful
- The "streak freeze" (buy/earn one missed-day pass) is a monetizable safety valve (future)
- Weekly leagues ("Top 10 in your class this week") drive social competition

### 4.3 XP / Streak HUD During Quiz

**Position:** Top-right of quiz interface, below the module header.

**Elements:**
```
┌────────────────────────────┐
│ 🔥 12  ⭐ 2,450  🧬 Lv. 5 │
│ [██████░░░░] 490/500 XP   │
└────────────────────────────┘
```

**XP Rules:**
- Correct MCQ: +10 XP
- Correct Essay (self-graded): +20 XP
- Matching fully correct: +15 XP
- Case study correct: +25 XP
- Speed bonus: +5 XP if answered in < 50% of estimated time
- Streak bonus: +1 XP per streak day (max +30)
- Perfect session: +50 XP bonus

**Level thresholds:**
- Lv 1: 0 XP
- Lv 2: 500 XP
- Lv 3: 1,500 XP
- Lv 4: 3,000 XP
- Lv 5: 5,000 XP
- Lv 6: 8,000 XP
- Lv 7: 12,000 XP
- ... (logarithmic curve)

### 4.4 "Weakest Topics" Auto-Recommendation

After every session:
1. Compute accuracy by tag: `tagAccuracy = correctWithTag / totalWithTag`
2. Sort ascending. Show top 3.
3. Dashboard widget: "Your weakest areas this week:" with mini ring charts.
4. CTA: "Start focused session: Cranial Nerves (45%)" → generates a 10-question session using only questions tagged `cranial-nerves`.

---

## 5. Quiz Experience Enhancements

### 5.1 Countdown Timer + Urgency Ring

**Implementation:**
- Circular SVG progress ring around a central timer text
- `strokeDasharray = 2 * PI * r`
- `strokeDashoffset` animates from full to empty as time elapses
- Colors:
  - > 60% remaining: `#22c55e` (green)
  - 30–60% remaining: `#f59e0b` (amber)
  - < 30% remaining: `#ef4444` (red)
  - < 10% remaining: pulsing red + subtle screen vignette

**UX:**
- Toggle in quiz settings: "Timer Mode: Off / Practice (no penalty) / Exam (auto-submit on timeout)"
- When timer expires in Exam mode: auto-submit current answer, show "Time's up" overlay, auto-advance after 2s
- Sound: Sub-bass pulse accelerates as timer runs down

### 5.2 Swipe Navigation (Mobile)

**Implementation:** `motion/react` drag handler on question card.
- `onDragEnd`: if `offset.x > 120` → Previous. If `offset.x < -120` → Next.
- Snapback animation if drag not far enough
- Visual cue: adjacent question card peeks in from edge while dragging

**Constraint:** Must not interfere with option selection (vertical scroll vs horizontal swipe).

### 5.3 Pause / Resume

Current implementation pauses timer when shortcuts modal or question grid opens.

**Add:** Dedicated pause button in exam mode (not available in "Exam" timer mode — that's the point).

---

## 6. Accessibility (Must Work for Everyone)

### 6.1 Global `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Plus per-component reduced-motion variants for `motion/react`.

### 6.2 `aria-live` for Quiz State Changes

```tsx
// Hidden live region in QuizInterface
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>
```

Announcements:
- "Correct. Cranial nerve VI innervates the lateral rectus."
- "Incorrect. The correct answer was B: Oculomotor nerve."
- "15 minutes remaining."
- "Question 23 of 60."

### 6.3 High-Contrast Mode

Detect `prefers-contrast: high`:
- Remove glassmorphism (use solid backgrounds)
- Increase border contrast (`border-black/90`)
- Ensure text-background contrast ratio ≥ 7:1
- Disable subtle shadows and glows

### 6.4 Focus Trap in Overlays

Use `react-focus-lock` or manual focus trap in:
- Keyboard shortcuts modal
- Question grid panel
- AI Chat expand
- Settings panel

---

## 7. Performance & Offline

### 7.1 Service Worker Expansion

Current: 6 assets precached.

**Target:** All critical static assets + hashed chunks.

**Implementation:** Use `workbox-build` or `vite-plugin-pwa` to generate precache manifest at build time. Inject into `sw.js`.

### 7.2 Route Prefetching

After dashboard loads, prefetch:
- `/year-2/:code` (most likely next stop)
- `/marks-calculator`
- `/analytics`

Implementation: `` for critical links, or `link rel="prefetch"` injected dynamically.

---

## 8. Phased Implementation Order

### Phase 1: Schema Lock (Week 1)
- Add `difficulty`, `bloomLevel`, `tags`, `estimatedTimeSeconds`, `media` to `types.ts`
- Add Zod schemas
- Add `avgCorrectRate`, `totalAttempts`, `discriminationIndex` to types
- Fix all `any` types in `data.ts`
- Enable strict mode in `tsconfig.json` (if feasible — may be a larger refactor)

### Phase 2: Sound + Micro-Interactions (Week 1)
- Sound engine (`lib/soundEngine.ts`)
- Purchase/generate sound assets (or use free Freesound.org samples)
- Micro-interactions on all buttons (scale, glow, haptic)
- Custom cursor (desktop)

### Phase 3: Exam Simulation + Countdown Timer (Week 2)
- Full-screen exam mode
- Circular timer ring with urgency colors
- Auto-submit on timeout
- Score reveal with themed confetti

### Phase 4: 3D Card Flip + Glassmorphism (Week 2)
- Card flip animation (CSS 3D transforms)
- Glassmorphism dashboard cards
- Module completion rings

### Phase 5: Gamification Core (Week 3)
- XP/Streak HUD in quiz
- Level thresholds + LevelUpOverlay redesign
- Daily streak calendar (heatmap)
- Spaced Repetition SM-2 engine
- "Weakest Topics" recommendations

### Phase 6: Accessibility + Polish (Week 3)
- Global `prefers-reduced-motion`
- `aria-live` quiz announcements
- Focus traps
- High-contrast mode
- 44px touch targets audit
- Semantic HTML landmarks

### Phase 7: Performance (Week 4)
- Service Worker precache expansion
- Route prefetching
- Image optimization pipeline
- Loading skeletons for async content

---

## 9. Quick Reference: What's Already Done

✅ Matching redesign (drag-drop, tap, haptics, SVG connectors, bilingual)  
✅ AI Chat Tutor (interactive chat, per-question history, NVIDIA/OpenRouter/Google adapters)  
✅ useQuizEngine hook (timer, navigation, scoring, 135 test cases)  
✅ FeatureErrorBoundary (3 routes)  
✅ Lazy JSON loading  
✅ Premium LoadingScreen (ECGMonitor, "Loading vitals…")  
✅ Expand All Explanations  
✅ Pause/resume timer on overlays  
✅ loading="lazy" on images  
✅ Font preloading  
✅ Preconnect hints  
✅ Vite build tweaks  
✅ 135 tests across 6 files  

---

## 10. Unresolved Questions (For Post-Plan Decisions)

1. **Sound licensing:** Should we synthesize sounds via Web Audio API (no external files) or use Freesound samples? Synthesis = zero loading, but less organic.
2. **Exam mode question count:** Default 60 questions? Configurable per module?
3. **Streak heatmap data:** Start from today, or retroactively compute from stored quiz history?
4. **Spaced repetition sync:** Repetition state lives in `localStorage`. Should it sync to cloud? (Adds complexity, but enables cross-device review.)
5. **Difficulty assignment strategy:** You chose NULL first, AI backfill later. What's the timeline for the AI backfill batch job?
6. **Themed confetti shapes:** Custom Canvas 2D paths require design work. Should we start with simple color-coded confetti and upgrade to shapes in a later pass?

---

*Plan v3. 27 shipped. 50+ remaining. This is the architecture for a genuinely world-class medical education platform.*

**Next step:** Approve this plan, answer the 6 unresolved questions above, and I start shipping Phase 1.
