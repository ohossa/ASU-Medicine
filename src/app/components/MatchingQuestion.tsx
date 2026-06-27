/**
 * MatchingQuestion.tsx
 *
 * A premium drag-and-drop / tappable card-pairing interface for matching questions.
 * Replaces native <select> dropdowns with a tactile, accessible, animated experience.
 *
 * Features:
 *  • Pointer + touch drag-and-drop with snap-back animations
 *  • Two-tap fallback for touch-first devices
 *  • Keyboard navigation (Tab, Arrows, Enter, Space, Escape)
 *  • Haptic feedback on supported devices
 *  • Framer Motion layout animations
 *  • Full bilingual support
 *  • Screen-reader accessible with aria-live announcements
 */

import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, GripVertical } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export interface MatchingProps {
  pairs: { premise: string; target: string }[];
  scrambled: string[];
  matches: Record<number, number>;
  submitted: boolean;
  disabled?: boolean;
  onChange: (next: { scrambled: string[]; matches: Record<number, number>; submitted: boolean }) => void;
}

/* ─── haptic helpers ─── */
function hapticTap() {
  try { navigator.vibrate?.(15); } catch { /* noop */ }
}
function hapticError() {
  try { navigator.vibrate?.([30, 30, 30]); } catch { /* noop */ }
}
function hapticSuccess() {
  try { navigator.vibrate?.(50); } catch { /* noop */ }
}

/* ─── is this a touch-first device? ─── */
const IS_TOUCH_DEVICE =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/* ─── translations ─── */
const t = {
  en: {
    submit: 'Lock In Matches',
    selectTarget: 'Select a match',
    matched: 'Matched',
    removed: 'Match removed',
    correct: 'Correct',
    incorrect: 'Incorrect',
    yourAnswer: 'Your answer',
    correctMatch: 'should match',
    dragHint: 'Drag a card from the left onto a card on the right',
    tapHint: 'Tap a premise, then tap its matching target',
    keyboardHint: 'Use Tab and Arrow keys to navigate, Enter to select',
  },
  ar: {
    submit: 'إرسال التوصيلات',
    selectTarget: 'اختر تطابقًا',
    matched: 'تم التوصيل',
    removed: 'تم إلغاء التوصيل',
    correct: 'صحيح',
    incorrect: 'خطأ',
    yourAnswer: 'إجابتك',
    correctMatch: 'يجب أن يطابق',
    dragHint: 'اسحب بطاقة من اليسار فوق بطاقة على اليمين',
    tapHint: 'انقر على البدية ثم انقر على الهدف المطابق',
    keyboardHint: 'استخدم Tab والأسهم للتنقل، Enter للاختيار',
  },
};

export function MatchingQuestion({
  pairs,
  scrambled,
  matches,
  submitted,
  disabled,
  onChange,
}: MatchingProps) {
  const { language } = useLanguage();
  const txt = t[language] || t.en;
  const announcerId = useId();

  /* ─── derived state ─── */
  const allMatched = useMemo(
    () => pairs.length > 0 && pairs.every((_, i) => matches[i] !== undefined),
    [pairs, matches]
  );

  /* which premise is currently selected (tap mode) */
  const [selectedPremise, setSelectedPremise] = useState<number | null>(null);

  /* announcement for screen readers */
  const [announcement, setAnnouncement] = useState('');

  /* drag state */
  const dragRef = useRef<{
    active: boolean;
    premiseIdx: number | null;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    clone: HTMLElement | null;
  }>({
    active: false,
    premiseIdx: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    clone: null,
  });

  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragPremise, setDragPremise] = useState<number | null>(null);
  const [hoverTarget, setHoverTarget] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const premiseRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const targetRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* ─── helpers ─── */
  const announce = useCallback((msg: string) => {
    setAnnouncement(msg);
    // clear after screen reader has time to pick it up
    window.setTimeout(() => setAnnouncement(''), 1500);
  }, []);

  const assignMatch = useCallback(
    (premiseIdx: number, targetIdx: number) => {
      if (submitted || disabled) return;
      const nextMatches = { ...matches, [premiseIdx]: targetIdx };
      onChange({ scrambled, matches: nextMatches, submitted: false });
      hapticTap();
      announce(`${txt.matched}: ${pairs[premiseIdx].premise} → ${scrambled[targetIdx]}`);
      setSelectedPremise(null);
    },
    [submitted, disabled, matches, scrambled, onChange, pairs, announce, txt]
  );

  const removeMatch = useCallback(
    (premiseIdx: number) => {
      if (submitted || disabled) return;
      const nextMatches = { ...matches };
      delete nextMatches[premiseIdx];
      onChange({ scrambled, matches: nextMatches, submitted: false });
      hapticTap();
      announce(`${txt.removed}: ${pairs[premiseIdx].premise}`);
      setSelectedPremise(null);
    },
    [submitted, disabled, matches, scrambled, onChange, pairs, announce, txt]
  );

  const handleSubmit = useCallback(() => {
    if (!allMatched || submitted || disabled) return;
    hapticSuccess();
    onChange({ scrambled, matches, submitted: true });
  }, [allMatched, submitted, disabled, scrambled, matches, onChange]);

  /* ─── keyboard navigation ─── */
  const handlePremiseKey = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (submitted || disabled) return;
      const cols = pairs.length;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          premiseRefs.current[(idx + 1) % cols]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          premiseRefs.current[(idx - 1 + cols) % cols]?.focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (selectedPremise === idx) {
            setSelectedPremise(null);
          } else {
            setSelectedPremise(idx);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedPremise(null);
          break;
      }
    },
    [submitted, disabled, pairs.length, selectedPremise]
  );

  const handleTargetKey = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (submitted || disabled) return;
      const cols = scrambled.length;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          targetRefs.current[(idx + 1) % cols]?.focus();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          targetRefs.current[(idx - 1 + cols) % cols]?.focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (selectedPremise !== null) {
            assignMatch(selectedPremise, idx);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedPremise(null);
          break;
      }
    },
    [submitted, disabled, scrambled.length, selectedPremise, assignMatch]
  );

  /* ─── drag & drop (pointer events) ─── */
  const onPointerDownPremise = useCallback(
    (e: React.PointerEvent, idx: number) => {
      if (submitted || disabled || !e.isPrimary) return;
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);

      const rect = el.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      dragRef.current = {
        active: true,
        premiseIdx: idx,
        startX: rect.left - containerRect.left,
        startY: rect.top - containerRect.top,
        currentX: rect.left - containerRect.left,
        currentY: rect.top - containerRect.top,
        clone: el,
      };
      setDragPremise(idx);
      setDragPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    },
    [submitted, disabled]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active || !e.isPrimary) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const x = e.clientX;
    const y = e.clientY;
    dragRef.current.currentX = x;
    dragRef.current.currentY = y;
    setDragPos({ x, y });

    // detect which target we're hovering
    let hovered: number | null = null;
    for (let i = 0; i < targetRefs.current.length; i++) {
      const tEl = targetRefs.current[i];
      if (!tEl) continue;
      const r = tEl.getBoundingClientRect();
      if (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      ) {
        hovered = i;
        break;
      }
    }
    setHoverTarget(hovered);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.active || !e.isPrimary) return;
      const { premiseIdx } = dragRef.current;
      dragRef.current.active = false;
      setDragPremise(null);
      setHoverTarget(null);
      if (premiseIdx === null) return;

      const targetIdx = hoverTarget;
      if (targetIdx !== null && targetIdx !== undefined) {
        assignMatch(premiseIdx, targetIdx);
      } else {
        hapticError();
      }
    },
    [hoverTarget, assignMatch]
  );

  /* ─── tap-to-match (touch fallback) ─── */
  const onTapPremise = useCallback(
    (idx: number) => {
      if (submitted || disabled) return;
      if (selectedPremise === idx) {
        setSelectedPremise(null);
      } else {
        setSelectedPremise(idx);
      }
    },
    [submitted, disabled, selectedPremise]
  );

  const onTapTarget = useCallback(
    (idx: number) => {
      if (submitted || disabled) return;
      if (selectedPremise !== null) {
        assignMatch(selectedPremise, idx);
      }
    },
    [submitted, disabled, selectedPremise, assignMatch]
  );

  /* ─── visual helpers ─── */
  const getPremiseState = (idx: number): 'idle' | 'selected' | 'matched' | 'correct' | 'wrong' => {
    if (matches[idx] === undefined) return selectedPremise === idx ? 'selected' : 'idle';
    if (!submitted) return 'matched';
    const matchedText = scrambled[matches[idx]];
    return matchedText === pairs[idx].target ? 'correct' : 'wrong';
  };

  const getTargetState = (idx: number): 'idle' | 'matched' | 'correct' | 'wrong' | 'hovered' => {
    const matchedBy = Object.keys(matches).find((k) => matches[Number(k)] === idx);
    if (!matchedBy) return hoverTarget === idx ? 'hovered' : 'idle';
    if (!submitted) return 'matched';
    const premiseIdx = Number(matchedBy);
    const matchedText = scrambled[idx];
    return matchedText === pairs[premiseIdx].target ? 'correct' : 'wrong';
  };

  const premiseClasses = (state: ReturnType<typeof getPremiseState>) => {
    const base =
      'relative flex items-center gap-3 w-full rounded-xl border px-4 py-3 text-sm text-start transition-all duration-200 select-none ';
    switch (state) {
      case 'idle':
        return (
          base +
          'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-gray-800 dark:text-white/80 hover:border-gray-400 dark:hover:border-white/20 hover:shadow-sm'
        );
      case 'selected':
        return (
          base +
          'bg-transparent dark:bg-transparent border-gray-400 dark:border-white/40 text-gray-950 dark:text-white shadow-sm scale-[1.01] ring-1 ring-gray-400/30 dark:ring-white/20'
        );
      case 'matched':
        return (
          base +
          'bg-gray-50 dark:bg-white/[0.04] border-gray-950/15 dark:border-white/15 text-gray-800 dark:text-white/80'
        );
      case 'correct':
        return (
          base +
          'bg-emerald-50/60 dark:bg-emerald-500/[0.05] border-emerald-500/30 dark:border-emerald-400/25 text-emerald-900 dark:text-emerald-300'
        );
      case 'wrong':
        return (
          base +
          'bg-rose-50/60 dark:bg-rose-500/[0.05] border-rose-500/30 dark:border-rose-400/25 text-rose-900 dark:text-rose-300'
        );
    }
  };

  const targetClasses = (state: ReturnType<typeof getTargetState>) => {
    const base =
      'relative flex items-center justify-center gap-2 w-full rounded-xl border px-4 py-3 text-sm text-center transition-all duration-200 select-none ';
    switch (state) {
      case 'idle':
        return (
          base +
          'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.07] text-gray-800 dark:text-white/80 hover:border-gray-400 dark:hover:border-white/20 hover:shadow-sm'
        );
      case 'hovered':
        return (
          base +
          'bg-gray-50 dark:bg-white/[0.06] border-dashed border-gray-950/40 dark:border-white/40 text-gray-950 dark:text-white shadow-md scale-[1.02]'
        );
      case 'matched':
        return (
          base +
          'bg-gray-50 dark:bg-white/[0.04] border-gray-950/15 dark:border-white/15 text-gray-800 dark:text-white/80'
        );
      case 'correct':
        return (
          base +
          'bg-emerald-50/60 dark:bg-emerald-500/[0.05] border-emerald-500/30 dark:border-emerald-400/25 text-emerald-900 dark:text-emerald-300'
        );
      case 'wrong':
        return (
          base +
          'bg-rose-50/60 dark:bg-rose-500/[0.05] border-rose-500/30 dark:border-rose-400/25 text-rose-900 dark:text-rose-300'
        );
    }
  };

  /* ─── connector lines (SVG overlay) ─── */
  const [connectors, setConnectors] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    correct: boolean;
    sideBySide: boolean;
    key: string;
  }[]>([]);

  useLayoutEffect(() => {
    const compute = () => {
      if (!containerRef.current) return;
      const rects: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        correct: boolean;
        sideBySide: boolean;
        key: string;
      }[] = [];
      const containerRect = containerRef.current.getBoundingClientRect();

      for (let i = 0; i < pairs.length; i++) {
        const targetIdx = matches[i];
        if (targetIdx === undefined) continue;
        const pEl = premiseRefs.current[i];
        const tEl = targetRefs.current[targetIdx];
        if (!pEl || !tEl) continue;
        const pr = pEl.getBoundingClientRect();
        const tr = tEl.getBoundingClientRect();

        const sideBySide = tr.left > pr.right;

        rects.push({
          x1: sideBySide ? pr.right - containerRect.left : pr.left + pr.width / 2 - containerRect.left,
          y1: sideBySide ? pr.top + pr.height / 2 - containerRect.top : pr.bottom - containerRect.top,
          x2: sideBySide ? tr.left - containerRect.left : tr.left + tr.width / 2 - containerRect.left,
          y2: sideBySide ? tr.top + tr.height / 2 - containerRect.top : tr.top - containerRect.top,
          correct: submitted ? scrambled[targetIdx] === pairs[i].target : true,
          sideBySide,
          key: `${i}-${targetIdx}`,
        });
      }
      setConnectors(rects);
    };
    compute();
    window.addEventListener('resize', compute, { passive: true });
    return () => window.removeEventListener('resize', compute);
  }, [matches, pairs, scrambled, submitted]);

  /* ─── render ─── */
  return (
    <div
      className="relative w-full"
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* screen-reader announcer */}
      <div
        id={announcerId}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* SVG connector overlay */}
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="active-line-grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--subject-accent, #3b82f6)" />
            <stop offset="100%" stopColor="var(--subject-glow, #8b5cf6)" />
          </linearGradient>
          <linearGradient id="correct-line-grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="wrong-line-grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        {connectors.map((c) => {
          const dx = Math.abs(c.x2 - c.x1) * 0.45;
          const dy = Math.abs(c.y2 - c.y1) * 0.45;
          const pathD = c.sideBySide
            ? `M ${c.x1} ${c.y1} C ${c.x1 + dx} ${c.y1}, ${c.x2 - dx} ${c.y2}, ${c.x2} ${c.y2}`
            : `M ${c.x1} ${c.y1} C ${c.x1} ${c.y1 + dy}, ${c.x2} ${c.y2 - dy}, ${c.x2} ${c.y2}`;

          const strokeGrad = submitted
            ? (c.correct ? 'url(#correct-line-grad)' : 'url(#wrong-line-grad)')
            : 'url(#active-line-grad)';

          return (
            <g key={c.key}>
              {/* Glow backdrop path */}
              <motion.path
                d={pathD}
                stroke={strokeGrad}
                strokeWidth={6}
                fill="none"
                opacity={0.12}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              {/* Sharp foreground path */}
              <motion.path
                d={pathD}
                stroke={strokeGrad}
                strokeWidth={2}
                fill="none"
                opacity={0.7}
                strokeDasharray={submitted && !c.correct ? '6 4' : undefined}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              {/* Subtle animated flow overlay for active, unsubmitted state */}
              {!submitted && (
                <motion.path
                  d={pathD}
                  stroke={strokeGrad}
                  strokeWidth={2}
                  fill="none"
                  opacity={0.35}
                  strokeDasharray="6 10"
                  animate={{ strokeDashoffset: [-16, 0] }}
                  transition={{
                    ease: 'linear',
                    duration: 1.6,
                    repeat: Infinity,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* hint text */}
      <p className="text-xs text-gray-500 dark:text-white/40 mb-4 text-center select-none">
        {IS_TOUCH_DEVICE ? txt.tapHint : txt.dragHint}
      </p>

      {/* grid */}
      <div
        role="grid"
        aria-label={language === 'ar' ? 'بطاقات التوصيل' : 'Matching cards'}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6"
      >
        {/* Premises column */}
        <div role="rowgroup" aria-label={language === 'ar' ? 'البدائل' : 'Premises'} className="flex flex-col gap-3">
          {pairs.map((p, i) => {
            const state = getPremiseState(i);
            return (
              <motion.div
                key={i}
                role="gridcell"
                layout
                layoutId={`premise-${i}`}
                initial={false}
                animate={{ scale: state === 'selected' || state === 'wrong' || state === 'correct' ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <button
                  ref={(el) => { premiseRefs.current[i] = el; }}
                  type="button"
                  disabled={submitted || disabled}
                  className={premiseClasses(state)}
                  onPointerDown={(e) => onPointerDownPremise(e, i)}
                  onClick={() => onTapPremise(i)}
                  onKeyDown={(e) => handlePremiseKey(e, i)}
                  aria-pressed={state === 'selected'}
                  aria-label={`${p.premise}${state === 'matched' || state === 'correct' || state === 'wrong' ? `, ${txt.matched}` : ''}`}
                  tabIndex={submitted || disabled ? -1 : 0}
                >
                  {IS_TOUCH_DEVICE && (
                    <GripVertical size={14} className="shrink-0 text-gray-400 dark:text-white/30" />
                  )}
                  <span className="flex-1">{p.premise}</span>
                  {(state === 'correct' || state === 'matched') && <Check size={16} className="shrink-0 text-emerald-500" />}
                  {state === 'wrong' && <X size={16} className="shrink-0 text-rose-500" />}
                  {state === 'matched' && !submitted && (
                    <span
                      role="button"
                      tabIndex={-1}
                      onClick={(e) => { e.stopPropagation(); removeMatch(i); }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="shrink-0 ml-1 p-0.5 rounded-md hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors cursor-pointer"
                      aria-label={language === 'ar' ? 'إزالة التوصيل' : 'Remove match'}
                    >
                      <X size={14} className="text-gray-400 dark:text-white/40" />
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Middle arrow (desktop only) */}
        <div className="hidden sm:flex items-center justify-center">
          <div className="w-px h-full bg-gray-200 dark:bg-white/[0.08]" />
        </div>

        {/* Targets column */}
        <div role="rowgroup" aria-label={language === 'ar' ? 'الأهداف' : 'Targets'} className="flex flex-col gap-3">
          {scrambled.map((target, i) => {
            const state = getTargetState(i);
            return (
              <motion.div
                key={`target-${i}`}
                role="gridcell"
                layout
                layoutId={`target-${i}`}
                initial={false}
                animate={{ scale: state === 'hovered' ? 1.03 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <button
                  ref={(el) => { targetRefs.current[i] = el; }}
                  type="button"
                  disabled={submitted || disabled}
                  className={targetClasses(state)}
                  onClick={() => onTapTarget(i)}
                  onKeyDown={(e) => handleTargetKey(e, i)}
                  aria-label={`${target}${state === 'matched' || state === 'correct' || state === 'wrong' ? `, ${txt.matched}` : ''}`}
                  tabIndex={submitted || disabled ? -1 : 0}
                >
                  <span>{target}</span>
                  {state === 'correct' && <Check size={16} className="shrink-0 text-emerald-500" />}
                  {state === 'wrong' && <X size={16} className="shrink-0 text-rose-500" />}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      {!submitted && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allMatched}
            className="px-8 py-3 bg-gray-950 dark:bg-white text-white dark:text-black rounded-full text-xs font-bold tracking-wide hover:scale-[0.98] active:scale-95 transition-transform disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {txt.submit}
          </button>
        </div>
      )}

      {/* Post-submission corrections */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-5 space-y-2 text-start"
          >
            {pairs.map((p, i) => {
              const matchedText = scrambled[matches[i]];
              const isCorrect = matchedText === p.target;
              if (isCorrect) return null;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs border border-rose-200 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-500/[0.04] rounded-lg px-3 py-2"
                >
                  <X size={14} className="shrink-0 text-rose-500" />
                  <span className="text-gray-800 dark:text-white/80">
                    <strong>{p.premise}</strong> {txt.correctMatch}{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400">{p.target}</strong>
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag ghost */}
      {dragPremise !== null && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{
            left: dragPos.x,
            top: dragPos.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 1.05, opacity: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="bg-gray-950 dark:bg-white text-white dark:text-black rounded-xl px-4 py-3 text-sm font-medium shadow-2xl border border-gray-950/20 dark:border-white/20 whitespace-nowrap">
            {pairs[dragPremise]?.premise}
          </div>
        </motion.div>
      )}
    </div>
  );
}
