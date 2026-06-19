# AI Chat Tutor — Design & Implementation Spec

## Trigger
- Button appears **ONLY after wrong answer submission** (Option C)
- Button text: "💬 Ask AI Tutor" (bilingual support with i18n)
- Button pulses subtly when available
- Disabled while AI is responding

## AI Knowledge (Option A)
- AI knows correct answer — explains directly
- System prompt includes: question text, options, correct answer, explanation, keyConcept, student's wrong pick
- Response style: warm, encouraging, uses the student's wrong answer as the starting point

## Language (Option B)
- Always English responses for medical accuracy
- UI labels bilingual (EN/AR)

## Layout (Option A — inline below explanation)
- Collapsible panel slides down below the explanation card
- Rounded-2xl border matching existing card style
- Glassmorphism background (bg-white/50 dark:bg-white/[0.03])
- Subtle amber/tinted border to differentiate from explanations

## Chat UX
- AI avatar: circle with robot icon, left side
- Student messages: right side, slightly different color
- Auto-scroll to bottom on new message
- Typing indicator (three bouncing dots) while AI responds
- "Clear chat" button (resets conversation for this question)
- Text input at bottom with send button and Enter-to-send
- Message limit indicator: "3/10 messages this question"

## Persistence (Option A)
- Per-question only, resets on next question
- Chat history stored in component state only (no server persistence per message)

## Data Access (Option A)
- Backend receives: {question, options, explanation, keyConcept, studentWrongAnswer, messages[]}
- AI can reference the explanation directly: "The explanation says..."
- AI can say "You picked C, but the correct answer is D because..."

## Animation
- Framer Motion: panel expands with spring (stiffness 300, damping 25)
- Messages stagger in with y offset + opacity
- Typing indicator: gentle bounce
- Send button: scale on hover, scale-95 on press

## Files to modify/create
- `api/hint.ts` — add conversation context, wrong answer
- `src/app/hooks/useHintSystem.ts` — message state, sendMessage, conversation
- `src/app/components/AIChatPanel.tsx` — NEW chat UI component (replaces HintPanel)
- `src/app/components/QuizInterface.tsx` — replace HintPanel with AIChatPanel, wire after wrong answer
- `src/app/components/HintPanel.tsx` — DELETE (replaced by AIChatPanel)
- `AI_HINT_SETUP.md` — update docs
- Tests: `AIChatPanel.test.tsx`, update `useHintSystem.test.ts`
