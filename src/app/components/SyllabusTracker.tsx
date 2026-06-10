// src/app/components/SyllabusTracker.tsx
// Improvements:
//  - Progress bar at the top shows overall completion
//  - Toast cleanup: original had a bug where the timer cleanup fn returned inside setState
//    (it was a no-op cleanup). Fixed by storing timer in a ref.
//  - Chapter cards use grid-cols properly on all breakpoints
//  - Notes use a <textarea> (not <input>) for longer notes
//  - "Close" button moved to sticky footer so it's always reachable
//  - Keyboard: Escape closes the modal

import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Edit3, X, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { ChapterData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { triggerCloudSync } from '../hooks/useCloudSync';

interface Props {
  moduleCode: string;
  moduleName: string;
  chapters:   ChapterData[];
  onClose:    () => void;
}

interface ChapterState {
  studied:  boolean;
  revised:  boolean;
  mcq:      boolean;
  essay:    boolean;
  notes:    string;
}

type CheckField = keyof Omit<ChapterState, 'notes'>;

const STATUS_FIELDS: { field: CheckField; label: string; activeClass: string }[] = [
  { field: 'studied', label: 'Studied',  activeClass: 'bg-physiology text-white border-physiology' },
  { field: 'revised', label: 'Revised',  activeClass: 'bg-biochem text-white border-biochem' },
  { field: 'mcq',     label: 'MCQ Done', activeClass: 'bg-anatomy text-white border-anatomy' },
  { field: 'essay',   label: 'Essay',    activeClass: 'bg-histology text-white border-histology' },
];

const INACTIVE_CLASS = 'bg-muted border-transparent text-muted-foreground hover:bg-accent';

function computeProgress(data: Record<number, ChapterState>, chapters: ChapterData[]): number {
  if (!chapters.length) return 0;
  const total  = chapters.length * 4; // 4 checkboxes each
  const done   = chapters.reduce((acc, ch) => {
    const s = data[ch.id];
    if (!s) return acc;
    return acc + [s.studied, s.revised, s.mcq, s.essay].filter(Boolean).length;
  }, 0);
  return Math.round((done / total) * 100);
}

export function SyllabusTracker({ moduleCode, moduleName, chapters, onClose }: Props) {
  const { t }        = useLanguage();
  const storageKey   = `asu_study_tracker_${moduleCode}`;
  const toastTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showToast,  setShowToast]  = useState(false);
  const [expanded,   setExpanded]   = useState<Set<number>>(new Set(chapters.map(c => c.id)));

  const [data, setData] = useState<Record<number, ChapterState>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch { /* fall through */ }
    const initial: Record<number, ChapterState> = {};
    chapters.forEach(ch => { initial[ch.id] = { studied: false, revised: false, mcq: false, essay: false, notes: '' }; });
    return initial;
  });

  // Sync from cloud
  useEffect(() => {
    const handle = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) setData(JSON.parse(saved));
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, [storageKey]);

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

  const persist = useCallback((next: Record<number, ChapterState>) => {
    localStorage.setItem(storageKey, JSON.stringify(next));
    triggerCloudSync();
    // Show toast — clear any pending timer first
    if (toastTimer.current !== null) clearTimeout(toastTimer.current);
    setShowToast(true);
    toastTimer.current = setTimeout(() => { setShowToast(false); toastTimer.current = null; }, 1600);
  }, [storageKey]);

  // Clean up toast timer on unmount
  useEffect(() => () => { if (toastTimer.current !== null) clearTimeout(toastTimer.current); }, []);

  const toggleField = useCallback((chapterId: number, field: CheckField) => {
    setData(prev => {
      const next = { ...prev, [chapterId]: { ...prev[chapterId], [field]: !prev[chapterId]?.[field] } };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateNotes = useCallback((chapterId: number, value: string) => {
    setData(prev => {
      const next = { ...prev, [chapterId]: { ...prev[chapterId], notes: value } };
      persist(next);
      return next;
    });
  }, [persist]);

  const toggleExpand = (id: number) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const progress = computeProgress(data, chapters);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6
                 bg-foreground/20 dark:bg-background/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Syllabus Tracker"
    >
      <div className="w-full max-w-4xl glass-panel glow-border rounded-[28px] shadow-2xl
                      overflow-hidden flex flex-col max-h-[92vh] animate-slide-up">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="px-6 sm:px-8 py-5 border-b border-border bg-card/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-physiology/10 text-physiology-dark dark:text-physiology flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-archivo text-xl font-black text-foreground tracking-tight">{t('syllabusTracker') || 'Syllabus Tracker'}</h3>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{moduleCode} · {moduleName}</p>
            </div>
          </div>
          <button onClick={onClose}
            aria-label="Close tracker"
            className="w-9 h-9 rounded-full bg-muted hover:bg-accent flex items-center justify-center
                       text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* ── Progress bar ───────────────────────────────────────────── */}
        <div className="px-6 sm:px-8 py-3 border-b border-border bg-card/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Overall Progress</span>
            <span className="text-[11px] font-black text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-physiology to-clinical rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── Chapter list ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-3">
          {chapters.map(ch => {
            const state    = data[ch.id] || { studied: false, revised: false, mcq: false, essay: false, notes: '' };
            const isOpen   = expanded.has(ch.id);
            const doneCount = [state.studied, state.revised, state.mcq, state.essay].filter(Boolean).length;

            return (
              <div key={ch.id}
                className="bg-card border border-border rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

                {/* Chapter header row — click to expand/collapse */}
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
                  onClick={() => toggleExpand(ch.id)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl w-10 h-10 flex-shrink-0 flex items-center justify-center
                                     rounded-xl bg-muted/60 border border-border text-base">
                      {ch.emoji}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        {t('chapter')} {ch.id}
                      </span>
                      <h4 className="font-archivo text-sm font-bold text-foreground leading-snug truncate">
                        {ch.title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-black tabular-nums
                                      ${doneCount === 4 ? 'text-success-dark dark:text-success'
                                        : doneCount > 0 ? 'text-biochem-dark dark:text-biochem'
                                        : 'text-muted-foreground'}`}>
                      {doneCount}/4
                    </span>
                    {isOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                  </div>
                </button>

                {/* Expandable content */}
                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-border/60">
                    {/* Status buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
                      {STATUS_FIELDS.map(({ field, activeClass }) => {
                        const active = state[field];
                        return (
                          <button key={field}
                            onClick={() => toggleField(ch.id, field)}
                            className={`px-3 py-2.5 rounded-full border text-[11px] font-bold
                                        flex items-center justify-center gap-1.5 transition-all duration-200
                                        shadow-sm hover:scale-[1.03] active:scale-[0.98]
                                        ${active ? activeClass : INACTIVE_CLASS}`}
                          >
                            {active && <Check size={11} strokeWidth={3} />}
                            {t(field === 'mcq' ? 'mcqDone' : field === 'essay' ? 'essayDone' : field)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Notes */}
                    <div className="flex items-start gap-2.5">
                      <Edit3 size={14} className="text-muted-foreground mt-3 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">
                          {t('personalNotes') || 'Personal Notes'}
                        </span>
                        <textarea
                          rows={2}
                          value={state.notes}
                          onChange={e => updateNotes(ch.id, e.target.value)}
                          placeholder={t('notesPlaceholder') || 'Type your notes here…'}
                          className="w-full resize-none bg-muted/50 border border-border focus:border-physiology
                                     rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground/60
                                     py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-physiology/20
                                     transition-all leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Sticky footer ──────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-border bg-card/40 flex justify-end">
          <button onClick={onClose}
            className="px-6 py-2.5 bg-foreground dark:bg-foreground hover:opacity-90
                       text-background rounded-full text-xs font-bold tracking-wide
                       transition-all duration-200 active:scale-[0.98] glow-border">
            {t('close') || 'Close'}
          </button>
        </div>

        {/* ── Save toast ─────────────────────────────────────────────── */}
        {showToast && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 toast-in
                          px-4 py-2 bg-foreground/90 text-background rounded-full
                          text-xs font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <Check size={11} className="text-success" strokeWidth={3} />
            {t('saveSuccess') || 'Saved'}
          </div>
        )}
      </div>
    </div>
  );
}
