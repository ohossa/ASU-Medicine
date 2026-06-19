import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Check, Edit3, X, Calendar, ChevronDown, ChevronUp, BookOpen, Layers, Target, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ChapterData, SubjectData, SubjectColor } from '../types';
import { subjectStyles } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { triggerCloudSync } from '../hooks/useCloudSync';
import { useProgress } from '../hooks/useProgress';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface LectureState {
  studied: boolean;
  revised: boolean;
}

interface ChapterState {
  studied: boolean;
  revised: boolean;
  mcq: boolean;
  essay: boolean;
  notes: string;
  lectures?: Record<string, LectureState>; // key: `${subjectId}_L${lectureNumber}`
}

interface Props {
  moduleCode: string;
  moduleName: string;
  chapters: ChapterData[];
  onClose: () => void;
}

type BaseField = 'studied' | 'revised' | 'mcq' | 'essay';
type LectureField = 'studied' | 'revised';

/* ------------------------------------------------------------------ */
/* Static helpers                                                      */
/* ------------------------------------------------------------------ */

const ACCENT: Record<SubjectColor, { text: string; softBg: string; solidBg: string; border: string; ring: string }> = {
  physiology:   { text: 'text-physiology',   softBg: 'bg-physiology/15',   solidBg: 'bg-physiology',   border: 'border-physiology/40',   ring: 'ring-physiology/40' },
  biochem:      { text: 'text-biochem',      softBg: 'bg-biochem/15',      solidBg: 'bg-biochem',      border: 'border-biochem/40',      ring: 'ring-biochem/40' },
  microbiology: { text: 'text-microbiology', softBg: 'bg-microbiology/15', solidBg: 'bg-microbiology', border: 'border-microbiology/40', ring: 'ring-microbiology/40' },
  anatomy:      { text: 'text-anatomy',      softBg: 'bg-anatomy/15',      solidBg: 'bg-anatomy',      border: 'border-anatomy/40',      ring: 'ring-anatomy/40' },
  histology:    { text: 'text-histology',    softBg: 'bg-histology/15',    solidBg: 'bg-histology',    border: 'border-histology/40',    ring: 'ring-histology/40' },
  pathology:    { text: 'text-pathology',    softBg: 'bg-pathology/15',    solidBg: 'bg-pathology',    border: 'border-pathology/40',    ring: 'ring-pathology/40' },
  pharma:       { text: 'text-pharma',       softBg: 'bg-pharma/15',       solidBg: 'bg-pharma',       border: 'border-pharma/40',       ring: 'ring-pharma/40' },
  clinical:     { text: 'text-clinical',     softBg: 'bg-clinical/15',     solidBg: 'bg-clinical',     border: 'border-clinical/40',     ring: 'ring-clinical/40' },
  parasitology: { text: 'text-parasitology', softBg: 'bg-parasitology/15', solidBg: 'bg-parasitology', border: 'border-parasitology/40', ring: 'ring-parasitology/40' },
  psychiatry:   { text: 'text-psychiatry',   softBg: 'bg-psychiatry/15',   solidBg: 'bg-psychiatry',   border: 'border-psychiatry/40',   ring: 'ring-psychiatry/40' },
  ophthalmology:{ text: 'text-ophthalmology',softBg: 'bg-ophthalmology/15',solidBg: 'bg-ophthalmology',border: 'border-ophthalmology/40',ring: 'ring-ophthalmology/40' },
  ent:          { text: 'text-ent',          softBg: 'bg-ent/15',          solidBg: 'bg-ent',          border: 'border-ent/40',          ring: 'ring-ent/40' },
};

/** Optional extra classes coming from the shared subjectStyles map (shape-agnostic, safe access). */
const styleHint = (color: SubjectColor): string => {
  const s = (subjectStyles as Record<string, unknown>)[color];
  return typeof s === 'string' ? s : '';
};

const emptyChapterState = (): ChapterState => ({
  studied: false,
  revised: false,
  mcq: false,
  essay: false,
  notes: '',
  lectures: {},
});

const lectureKeys = (subject: SubjectData): string[] =>
  Array.from({ length: Math.max(0, subject.lectureCount) }, (_, i) => `${subject.id}_L${i + 1}`);

const BASE_FIELDS: { field: BaseField; labelKey: string; Icon: typeof BookOpen }[] = [
  { field: 'studied', labelKey: 'studied', Icon: BookOpen },
  { field: 'revised', labelKey: 'revised', Icon: Calendar },
  { field: 'mcq',     labelKey: 'mcqDone', Icon: Target },
  { field: 'essay',   labelKey: 'essay',   Icon: GraduationCap },
];

const FALLBACK: Record<string, { en: string; ar: string }> = {
  syllabusTracker: { en: 'Syllabus Tracker', ar: 'متتبع المنهج' },
  overallProgress: { en: 'Overall Progress', ar: 'التقدم الكلي' },
  studied:         { en: 'Studied', ar: 'تمت المذاكرة' },
  revised:         { en: 'Revised', ar: 'تمت المراجعة' },
  mcqDone:         { en: 'MCQ Done', ar: 'تم حل الاختيارات' },
  essay:           { en: 'Essay', ar: 'المقالي' },
  completed:       { en: 'Completed', ar: 'مكتمل' },
  lecture:         { en: 'Lecture', ar: 'محاضرة' },
  lectures:        { en: 'Lectures', ar: 'محاضرات' },
  markAllStudied:  { en: 'All Studied', ar: 'الكل مُذاكر' },
  markAllRevised:  { en: 'All Revised', ar: 'الكل مُراجَع' },
  notes:           { en: 'Notes', ar: 'ملاحظات' },
  notesPlaceholder:{ en: 'Write your notes for this chapter…', ar: 'اكتب ملاحظاتك لهذا الفصل…' },
  close:           { en: 'Close', ar: 'إغلاق' },
  saved:           { en: 'Saved', ar: 'تم الحفظ' },
  page:            { en: 'Page', ar: 'صفحة' },
  noChapters:      { en: 'No chapters available for this module yet.', ar: 'لا توجد فصول متاحة لهذه المادة بعد.' },
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function SyllabusTracker({ moduleCode, moduleName, chapters, onClose }: Props) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const storageKey = `asu_study_tracker_${moduleCode}`;
  const progressStore = useProgress();

  /** Translation with graceful local fallback if a key is missing. */
  const label = useCallback(
    (key: string): string => {
      const translated = typeof t === 'function' ? t(key) : undefined;
      if (translated && translated !== key) return translated;
      const f = FALLBACK[key];
      return f ? (isRTL ? f.ar : f.en) : key;
    },
    [t, isRTL],
  );

  /** Builds a fully-shaped state map from a raw localStorage payload. */
  const hydrate = useCallback(
    (raw: string | null): Record<number, ChapterState> => {
      let parsed: Record<string, Partial<ChapterState>> = {};
      if (raw) {
        try {
          parsed = (JSON.parse(raw) as Record<string, Partial<ChapterState>>) ?? {};
        } catch {
          parsed = {};
        }
      }
      const next: Record<number, ChapterState> = {};
      for (const ch of chapters) {
        const saved = parsed[String(ch.id)] ?? {};
        next[ch.id] = {
          studied: !!saved.studied,
          revised: !!saved.revised,
          mcq: !!saved.mcq,
          essay: !!saved.essay,
          notes: typeof saved.notes === 'string' ? saved.notes : '',
          lectures: saved.lectures && typeof saved.lectures === 'object' ? saved.lectures : {},
        };
      }
      return next;
    },
    [chapters],
  );

  const [data, setData] = useState<Record<number, ChapterState>>(() =>
    hydrate(typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null),
  );
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Re-hydrate when module or chapter list changes */
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data hydration from localStorage must happen before paint
    setData(hydrate(typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null));
  }, [storageKey, hydrate]);

  /* Escape key closes the modal */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Multi-tab support & Cloud sync update support */
  useEffect(() => {
    const onStorage = (e: Event) => {
      if ('key' in e) {
        const se = e as StorageEvent;
        if (se.key === storageKey) {
          setData(hydrate(se.newValue));
        }
      } else {
        setData(hydrate(localStorage.getItem(storageKey)));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey, hydrate]);

  /* Toast timer cleanup */
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  /* Save + sync + toast */
  const persist = useCallback(
    (next: Record<number, ChapterState>) => {
      setData(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* storage unavailable — keep in-memory state */
      }
      triggerCloudSync();
      setShowToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowToast(false), 1600);
    },
    [storageKey],
  );

  /* ----------------------------- mutations ----------------------------- */

  const toggleBase = useCallback(
    (chapterId: number, field: BaseField) => {
      const current = data[chapterId] ?? emptyChapterState();
      const nextVal = !current[field];
      
      const lectures = { ...(current.lectures ?? {}) };
      if (field === 'studied' || field === 'revised') {
        const chapter = chapters.find((c) => c.id === chapterId);
        if (chapter) {
          for (const sub of chapter.subjects) {
            const keys = lectureKeys(sub);
            for (const k of keys) {
              const existing = lectures[k] ?? { studied: false, revised: false };
              lectures[k] = { ...existing, [field]: nextVal };
            }
          }
        }
      }

      if (nextVal) {
        progressStore.addXp(15);
      }

      persist({
        ...data,
        [chapterId]: {
          ...current,
          [field]: nextVal,
          lectures,
        },
      });
    },
    [data, chapters, persist, progressStore],
  );

  const toggleLecture = useCallback(
    (chapterId: number, subjectId: SubjectColor, lectureNumber: number, field: LectureField) => {
      const current = data[chapterId] ?? emptyChapterState();
      const key = `${subjectId}_L${lectureNumber}`;
      const lecture = current.lectures?.[key] ?? { studied: false, revised: false };
      const nextVal = !lecture[field];
      
      if (nextVal) {
        progressStore.addXp(5);
      }

      persist({
        ...data,
        [chapterId]: {
          ...current,
          lectures: { ...(current.lectures ?? {}), [key]: { ...lecture, [field]: nextVal } },
        },
      });
    },
    [data, persist, progressStore],
  );

  const markAllLectures = useCallback(
    (chapterId: number, subject: SubjectData, field: LectureField) => {
      const keys = lectureKeys(subject);
      if (keys.length === 0) return;
      const current = data[chapterId] ?? emptyChapterState();
      const lectures = { ...(current.lectures ?? {}) };
      const allOn = keys.every((k) => lectures[k]?.[field]);
      const nextVal = !allOn;

      if (nextVal) {
        progressStore.addXp(10);
      }

      for (const k of keys) {
        const existing = lectures[k] ?? { studied: false, revised: false };
        lectures[k] = { ...existing, [field]: nextVal };
      }
      persist({ ...data, [chapterId]: { ...current, lectures } });
    },
    [data, persist, progressStore],
  );

  const setNotes = useCallback(
    (chapterId: number, notes: string) => {
      const current = data[chapterId] ?? emptyChapterState();
      persist({ ...data, [chapterId]: { ...current, notes } });
    },
    [data, persist],
  );

  const toggleChapterExpanded = useCallback((chapterId: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  }, []);

  const toggleSubjectExpanded = useCallback((key: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /* ----------------------------- progress ------------------------------ */

  const chapterCounts = (chapter: ChapterData): { done: number; total: number } => {
    const st = data[chapter.id];
    let total = 4;
    let done = 0;
    for (const f of ['studied', 'revised', 'mcq', 'essay'] as BaseField[]) {
      if (st?.[f]) done++;
    }
    for (const sub of chapter.subjects) {
      total += Math.max(0, sub.lectureCount) * 2;
      for (const key of lectureKeys(sub)) {
        const ls = st?.lectures?.[key];
        if (ls?.studied) done++;
        if (ls?.revised) done++;
      }
    }
    return { done, total };
  };

  let overallTotal = 0;
  let overallDone = 0;
  for (const ch of chapters) {
    const { done, total } = chapterCounts(ch);
    overallTotal += total;
    overallDone += done;
  }
  const overallPct = overallTotal === 0 ? 0 : Math.round((overallDone / overallTotal) * 100);

  /* ------------------------------- UI bits ------------------------------ */

  const CheckBox = ({
    checked,
    color,
    text,
    onToggle,
  }: {
    checked: boolean;
    color: SubjectColor;
    text: string;
    onToggle: () => void;
  }) => {
    const a = ACCENT[color];
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={`group inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition-colors ${
          checked ? a.text : 'text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white'
        }`}
      >
        <span
          className={`flex h-[18px] w-[18px] items-center justify-center rounded-md border transition-all duration-200 ${
            checked ? `${a.solidBg} ${a.border}` : 'border-border dark:border-white/20 bg-card dark:bg-white/[0.02] group-hover:border-gray-400 dark:group-hover:border-white/40'
          }`}
        >
          <motion.span
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check size={12} className="text-black" strokeWidth={3} />
          </motion.span>
        </span>
        {text}
      </button>
    );
  };

  /* ------------------------------- render ------------------------------- */

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={label('syllabusTracker')}
    >
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/45 dark:bg-background/60 backdrop-blur-md"
      />

      {/* Main modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-card border border-border backdrop-blur-2xl rounded-[28px] overflow-hidden flex flex-col max-h-[92vh] shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-card/85 px-5 py-4 backdrop-blur-xl sm:px-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border dark:border-white/[0.08] bg-secondary dark:bg-white/[0.04]">
            <GraduationCap size={22} className="text-physiology" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-foreground dark:text-white sm:text-lg">{label('syllabusTracker')}</h2>
            <p className="truncate text-xs text-muted-foreground dark:text-white/50">
              {moduleCode} · {moduleName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={label('close')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border dark:border-white/[0.08] bg-secondary/80 dark:bg-white/[0.03] text-muted-foreground hover:text-foreground dark:text-white/60 dark:hover:text-white transition-all active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {/* Overall progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground dark:text-white/70">{label('overallProgress')}</span>
              <span className="font-semibold tabular-nums text-foreground dark:text-white">
                {overallPct}% · {overallDone}/{overallTotal}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full border border-border dark:border-white/[0.06] bg-secondary dark:bg-white/[0.04]">
              <motion.div
                initial={false}
                animate={{ width: `${overallPct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                className="h-full rounded-full bg-gradient-to-r from-physiology to-clinical"
              />
            </div>
          </div>

          {/* Empty state */}
          {chapters.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border dark:border-white/[0.1] py-12 text-center text-sm text-muted-foreground dark:text-white/40">
              {label('noChapters')}
            </div>
          )}

          {/* Chapter accordion cards */}
          <div className="space-y-3">
            {chapters.map((chapter) => {
              const st = data[chapter.id] ?? emptyChapterState();
              const isOpen = expandedChapters.has(chapter.id);
              const { done, total } = chapterCounts(chapter);
              const accent = ACCENT[chapter.accentColor];
              const chapterComplete = total > 0 && done === total;

              return (
                <div
                  key={chapter.id}
                  className={`overflow-hidden rounded-2xl border bg-card/30 dark:bg-white/[0.02] transition-colors ${
                    chapterComplete ? accent.border : 'border-border dark:border-white/[0.08]'
                  }`}
                >
                  {/* Card header */}
                  <button
                    type="button"
                    onClick={() => toggleChapterExpanded(chapter.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-muted/40 dark:hover:bg-white/[0.03] sm:px-5"
                  >
                    <span className="text-xl">{chapter.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground dark:text-white">{chapter.title}</span>
                      <span className="block truncate text-[11px] text-muted-foreground dark:text-white/45">
                        {chapter.subtitle} · {label('page')} {chapter.page} · {chapter.lectureRange}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium tabular-nums ${
                        chapterComplete
                          ? `${accent.softBg} ${accent.text} ${accent.border}`
                          : 'border-border dark:border-white/[0.08] bg-secondary dark:bg-white/[0.04] text-muted-foreground dark:text-white/60'
                      }`}
                    >
                      {done}/{total} {label('completed')}
                    </span>
                    <motion.span
                      initial={false}
                      animate={{ rotate: isOpen ? (isRTL ? -180 : 180) : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className="shrink-0 text-muted-foreground dark:text-white/40"
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="chapter-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 border-t border-border dark:border-white/[0.06] px-4 py-4 sm:px-5">
                          {/* Base statuses */}
                          <div className="flex flex-wrap gap-2">
                            {BASE_FIELDS.map(({ field, labelKey, Icon }) => {
                              const active = st[field];
                              return (
                                <button
                                  key={field}
                                  type="button"
                                  onClick={() => toggleBase(chapter.id, field)}
                                  aria-pressed={active}
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                                    active
                                      ? `${accent.softBg} ${accent.text} ${accent.border} ${styleHint(chapter.accentColor)}`
                                      : 'border-border dark:border-white/[0.08] bg-card dark:bg-white/[0.02] text-muted-foreground dark:text-white/55 hover:border-gray-300 dark:hover:border-white/20 hover:text-foreground dark:hover:text-white/85'
                                  }`}
                                >
                                  <Icon size={13} />
                                  {label(labelKey)}
                                  {active && <Check size={13} strokeWidth={3} />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Subjects */}
                          {chapter.subjects.length > 0 && (
                            <div className="space-y-2">
                              {chapter.subjects.map((subject) => {
                                const subKey = `${chapter.id}_${subject.id}`;
                                const subOpen = expandedSubjects.has(subKey);
                                const subAccent = ACCENT[subject.id];
                                const keys = lectureKeys(subject);
                                const subDone = keys.reduce((n, k) => {
                                  const ls = st.lectures?.[k];
                                  return n + (ls?.studied ? 1 : 0) + (ls?.revised ? 1 : 0);
                                }, 0);

                                return (
                                  <div key={subject.id} className="overflow-hidden rounded-xl border border-border dark:border-white/[0.06] bg-muted/20 dark:bg-white/[0.015]">
                                    <button
                                      type="button"
                                      onClick={() => toggleSubjectExpanded(subKey)}
                                      aria-expanded={subOpen}
                                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-start transition-colors hover:bg-muted/40 dark:hover:bg-white/[0.03]"
                                    >
                                      <Layers size={14} className={subAccent.text} />
                                      <span className="min-w-0 flex-1">
                                        <span className="block truncate text-xs font-semibold text-foreground/80 dark:text-white/85">{subject.name}</span>
                                        <span className="block truncate text-[10px] text-muted-foreground dark:text-white/40">
                                          {subject.lectureCount} {label('lectures')} · {subject.lectures}
                                        </span>
                                      </span>
                                      <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground dark:text-white/45">
                                        {subDone}/{keys.length * 2}
                                      </span>
                                      <span className="shrink-0 text-muted-foreground dark:text-white/40">
                                        {subOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                      </span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                      {subOpen && (
                                        <motion.div
                                          key="subject-body"
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="border-t border-border dark:border-white/[0.05] px-3.5 py-3">
                                            {keys.length === 0 ? (
                                              <p className="py-1 text-[11px] text-muted-foreground dark:text-white/35">—</p>
                                            ) : (
                                              <>
                                                {/* Mark-all utilities */}
                                                <div className="mb-2.5 flex flex-wrap gap-2">
                                                  <button
                                                    type="button"
                                                    onClick={() => markAllLectures(chapter.id, subject, 'studied')}
                                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all active:scale-95 border-border dark:border-white/[0.08] bg-card dark:bg-white/[0.03] ${subAccent.text} hover:bg-muted dark:hover:bg-white/[0.07]`}
                                                  >
                                                    {label('markAllStudied')}
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => markAllLectures(chapter.id, subject, 'revised')}
                                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all active:scale-95 border-border dark:border-white/[0.08] bg-card dark:bg-white/[0.03] ${subAccent.text} hover:bg-muted dark:hover:bg-white/[0.07]`}
                                                  >
                                                    {label('markAllRevised')}
                                                  </button>
                                                </div>

                                                {/* Lecture rows */}
                                                <div className="space-y-1">
                                                  {keys.map((k, i) => {
                                                    const ls = st.lectures?.[k] ?? { studied: false, revised: false };
                                                    return (
                                                      <div
                                                        key={k}
                                                        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg px-2 py-1.5 hover:bg-muted/40 dark:hover:bg-white/[0.03]"
                                                      >
                                                        <span className="text-xs text-foreground/80 dark:text-white/70">
                                                          {subject.lectureNames?.[i] || `${label('lecture')} ${i + 1}`}
                                                        </span>
                                                        <span className="flex items-center gap-3">
                                                          <CheckBox
                                                            checked={ls.studied}
                                                            color={subject.id}
                                                            text={label('studied')}
                                                            onToggle={() => toggleLecture(chapter.id, subject.id, i + 1, 'studied')}
                                                          />
                                                          <CheckBox
                                                            checked={ls.revised}
                                                            color={subject.id}
                                                            text={label('revised')}
                                                            onToggle={() => toggleLecture(chapter.id, subject.id, i + 1, 'revised')}
                                                          />
                                                        </span>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Notes block */}
                          <div>
                            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground dark:text-white/60">
                              <Edit3 size={13} />
                              {label('notes')}
                            </div>
                            <textarea
                              value={st.notes}
                              onChange={(e) => setNotes(chapter.id, e.target.value)}
                              placeholder={label('notesPlaceholder')}
                              rows={3}
                              className="w-full resize-y rounded-xl border border-border dark:border-white/[0.08] bg-card dark:bg-white/[0.02] px-3 py-2.5 text-xs text-foreground dark:text-white/85 placeholder:text-muted-foreground dark:placeholder:text-white/30 outline-none transition-shadow focus:ring-2 focus:ring-physiology/50"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 border-t border-border bg-card/85 px-5 py-3.5 backdrop-blur-xl sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="ms-auto block rounded-xl border border-border dark:border-white/[0.12] px-5 py-2 text-sm font-medium text-muted-foreground dark:text-white/80 transition-all hover:bg-muted dark:hover:border-white/[0.06] dark:hover:text-white/50 active:scale-95"
          >
            {label('close')}
          </button>
        </div>
      </motion.div>

      {/* Save toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="save-toast"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-xs font-medium text-foreground shadow-xl backdrop-blur-xl"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-physiology">
              <Check size={10} className="text-black" strokeWidth={3} />
            </span>
            {label('saved')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
