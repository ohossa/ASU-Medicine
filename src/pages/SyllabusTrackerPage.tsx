import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Check, Edit3, Calendar, ChevronDown, BookOpen, Layers, Target, GraduationCap, Globe, Sun, Moon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ChapterData, SubjectData, SubjectColor } from '../app/types';
import { useLanguage } from '../app/hooks/useLanguage';
import { useTheme } from '../app/hooks/useTheme';
import { triggerCloudSync } from '../app/hooks/useCloudSync';
import { useProgress } from '../app/hooks/useProgress';
import { SYLLABUS_MODULES, getChaptersForModuleAndMode } from '../app/data';
import type { ModuleInfo } from '../app/data';
import { useUser } from '@clerk/clerk-react';
import { PortalShell } from '../app/components/PortalShell';
import { pageVariants } from '../app/lib/motion';
import './syllabus-tracker-page.css';

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

type BaseField = 'studied' | 'revised' | 'mcq' | 'essay';
type LectureField = 'studied' | 'revised';

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const SUBJECT_COLORS: Record<string, string> = {
  physiology: '#14b8a6',   // Teal
  biochem: '#ec4899',      // Pink
  microbiology: '#10b981', // Emerald
  anatomy: '#f97316',      // Orange
  histology: '#eab308',    // Yellow
  pathology: '#a855f7',    // Purple
  pharma: '#ef4444',       // Red
  clinical: '#3b82f6',     // Blue
  parasitology: '#84cc16', // Lime
  psychiatry: '#6366f1',   // Indigo
  ophthalmology: '#06b6d4',// Cyan
  ent: '#f43f5e',          // Rose
};

const MS = [
  { k: 'studied' as BaseField, labelKey: 'studied', icon: BookOpen, c: '#22c55e' },
  { k: 'revised' as BaseField, labelKey: 'revised', icon: Calendar, c: '#14b8a6' },
  { k: 'mcq' as BaseField, labelKey: 'mcqDone', icon: Target, c: '#a855f7' },
  { k: 'essay' as BaseField, labelKey: 'essay', icon: GraduationCap, c: '#f97316' }
];

const FALLBACK: Record<string, { en: string; ar: string }> = {
  syllabusTracker: { en: 'Syllabus Tracker', ar: 'متتبع المنهج' },
  overallProgress: { en: 'Overall Progress', ar: 'التقدم الكلي' },
  studied:         { en: 'Studied', ar: 'تمت المذاكرة' },
  revised:         { en: 'Revised', ar: 'تمت المراجعة' },
  mcqDone:         { en: 'MCQ Done', ar: 'تم حل الاختيارات' },
  essay:           { en: 'Essay Done', ar: 'المقالي' },
  completed:       { en: 'Completed', ar: 'مكتمل' },
  lecture:         { en: 'Lecture', ar: 'محاضرة' },
  lectures:        { en: 'Lectures', ar: 'محاضرات' },
  chapters:        { en: 'Chapters', ar: 'فصول' },
  markAllStudied:  { en: 'Mark All Studied', ar: 'الكل مُذاكر' },
  markAllRevised:  { en: 'Mark All Revised', ar: 'الكل مُراجَع' },
  notes:           { en: 'Notes', ar: 'ملاحظات' },
  notesPlaceholder:{ en: 'Write your notes, lecture keys, or exam tips for this chapter...', ar: 'اكتب ملاحظاتك لهذا الفصل…' },
  saved:           { en: 'Saved', ar: 'تم الحفظ' },
  page:            { en: 'Page', ar: 'صفحة' },
  noChapters:      { en: 'No chapters available for this module yet.', ar: 'لا توجد فصول متاحة لهذه المادة بعد.' },
  allChapters:     { en: 'All Chapters', ar: 'كل الفصول' },
  syllabusOutline: { en: 'Syllabus Outline', ar: 'مخطط المنهج' },
  coreMilestones:  { en: 'Core Milestones', ar: 'المهام الأساسية' },
  subjectsLectures:{ en: 'Subjects & Lectures', ar: 'المواد والمحاضرات' },
  notesHighlights: { en: 'Notes & Highlights', ar: 'ملاحظات وتنبيهات' },
  itemsCompleted:  { en: 'items completed', ar: 'عناصر مكتملة' },
};

/* ------------------------------------------------------------------ */
/* Helper functions                                                    */
/* ------------------------------------------------------------------ */

const lookupModule = (mCode: string): ModuleInfo | null => {
  for (const year of Object.values(SYLLABUS_MODULES)) {
    for (const sem of Object.values(year)) {
      const found = sem.find(m => m.code.toLowerCase() === mCode.toLowerCase());
      if (found) return found;
    }
  }
  return null;
};

const lectureKeys = (subject: SubjectData): string[] =>
  Array.from({ length: Math.max(0, subject.lectureCount) }, (_, i) => `${subject.id}_L${i + 1}`);

const emptyChapterState = (): ChapterState => ({
  studied: false,
  revised: false,
  mcq: false,
  essay: false,
  notes: '',
  lectures: {},
});

export function SyllabusTrackerPage({ userButton }: { userButton?: React.ReactNode }) {
  const { code, yearId } = useParams<{ code: string; yearId: string }>();
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user } = useUser();
  const progressStore = useProgress();

  const isRTL = language === 'ar';
  const moduleCode = (code || 'MEM-2').toUpperCase();
  const storageKey = `asu_study_tracker_${moduleCode}`;

  const parsedYear = useMemo(() => {
    if (yearId) return yearId;
    const match = moduleCode.match(/-(\d+)/);
    return match ? match[1] : '2';
  }, [yearId, moduleCode]);

  const moduleInfo = useMemo(() => lookupModule(moduleCode), [moduleCode]);
  const moduleName = moduleInfo ? moduleInfo.name : 'Endocrine Module';

  const chapters = useMemo(() => {
    return getChaptersForModuleAndMode(moduleCode, 'mixed');
  }, [moduleCode]);

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

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [openSubjectIndex, setOpenSubjectIndex] = useState<number>(0);
  const [tab, setTab] = useState<'outline' | 'workspace'>('outline');
  const [isMobile, setIsMobile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeChapter = chapters[activeChapterIndex] || null;

  // Track window resizing to dynamically apply mobile/desktop classes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Re-hydrate when module or chapter list changes */
  useEffect(() => {
    setData(hydrate(typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null));
    setActiveChapterIndex(0);
    setOpenSubjectIndex(0);
  }, [storageKey, hydrate]);

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
      
      let lectures = { ...(current.lectures ?? {}) };
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

  /* ----------------------------- progress ------------------------------ */

  const chapterCounts = useCallback(
    (chapter: ChapterData): { done: number; total: number } => {
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
    },
    [data]
  );

  const overallStats = useMemo(() => {
    let overallTotal = 0;
    let overallDone = 0;
    const trackedChapters = moduleCode === 'MCNS-2'
      ? chapters.slice(0, 10)
      : moduleCode === 'MSS-2'
        ? chapters.slice(0, 8)
        : chapters;
    for (const ch of trackedChapters) {
      const { done, total } = chapterCounts(ch);
      overallTotal += total;
      overallDone += done;
    }
    const overallPct = overallTotal === 0 ? 0 : Math.round((overallDone / overallTotal) * 100);
    return { total: overallTotal, done: overallDone, pct: overallPct };
  }, [chapters, chapterCounts, moduleCode]);

  const getLectureTitle = (subject: SubjectData, index: number): string => {
    if (subject.lectureNames && subject.lectureNames[index]) {
      return subject.lectureNames[index];
    }
    if (subject.lectures) {
      // Split on comma or arabic comma
      const split = subject.lectures.split(/[,،]/).map(s => s.trim());
      if (split[index]) {
        return split[index];
      }
    }
    return isRTL ? `محاضرة ${index + 1}` : `Lecture ${index + 1}`;
  };

  // User details
  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student';
  const displayInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'OH';

  const crumbs = [
    { label: 'Portal', onClick: () => navigate('/') },
    { label: `Year ${parsedYear}`, onClick: () => navigate(`/year-${parsedYear}`) },
    { label: moduleCode, onClick: () => navigate(`/year-${parsedYear}/${moduleCode.toLowerCase()}`) },
    { label: label('syllabusTracker') }
  ];

  const customUserButton = (
    <div className="relative flex items-center">
      {userButton}
    </div>
  );

  return (
    <PortalShell crumbs={crumbs} userButton={customUserButton} hideFooter={true}>
      <motion.div 
        dir={isRTL ? 'rtl' : 'ltr'} 
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className={`syllabus-tracker-page-wrapper theme-${isDark ? 'dark' : 'light'} ${isMobile ? 'mobile' : 'desktop'}`} 
        data-tab={tab}
      >

        {/* Sub-Header for mobile and desktop viewports */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-black/20 backdrop-blur-md relative z-20 shrink-0">
          <div className="w-24 hidden sm:block" />
          <span className="text-xs font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase mx-auto">
            {moduleCode} · {isRTL ? 'متتبع المنهج' : 'Syllabus Tracker'}
          </span>
          <div className="w-24 hidden sm:block" />
        </div>

        {/* Main Split Area */}
        <div className="main">
        {/* Left Pane - Syllabus Outline */}
        <aside className="pane outline-pane">
          <div className="pane-head">
            <h2>{label('syllabusOutline')}</h2>
            <span className="pill frost">
              {moduleCode === 'MCNS-2' ? 10 : moduleCode === 'MSS-2' ? 8 : chapters.length} {label('chapters')}
            </span>
          </div>

          <div className="progress-card">
            <div className="pc-top">
              <span>{label('overallProgress')}</span>
              <b>{overallStats.pct}%</b>
            </div>
            <div className="pc-sub">
              {overallStats.done} / {overallStats.total} {label('itemsCompleted')}
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${overallStats.pct}%` }}></div>
            </div>
          </div>

          <div className="list-label">Chapters</div>

          <div className="chapter-list">
            {chapters.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                {label('noChapters')}
              </div>
            ) : moduleCode === 'MCNS-2' ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-3 py-1 bg-sky-500/5 dark:bg-sky-500/10 rounded-md select-none mb-1.5 border border-sky-500/10">
                    CNS 1 (Chapters 1-5)
                  </div>
                  <div className="space-y-1">
                    {chapters.slice(0, 5).map((ch, idx) => {
                      const realIdx = idx;
                      const isActive = realIdx === activeChapterIndex;
                      const counts = chapterCounts(ch);
                      const pct = counts.total === 0 ? 0 : Math.round((counts.done / counts.total) * 100);
                      return (
                        <button
                          key={ch.id}
                          className={`chapter ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setActiveChapterIndex(realIdx);
                            setOpenSubjectIndex(0);
                            if (isMobile) {
                              setTab('workspace');
                            }
                          }}
                        >
                          <div className="ch-emoji">{ch.emoji || '🦋'}</div>
                          <div className="ch-body">
                            <div className="ch-title">
                              {isRTL ? `الفصل ${realIdx + 1}:` : `Chapter ${realIdx + 1}:`} {ch.title}
                            </div>
                            <div className="ch-meta">
                              {label('page')} {ch.page} · {ch.subjects.length} Subjects
                            </div>
                          </div>
                          <div className="ch-prog">
                            <span className="done-pill">
                              {counts.done}/{counts.total}
                            </span>
                            <div className="ch-mini">
                              <i style={{ width: `${pct}%` }}></i>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-3 py-1 bg-purple-500/5 dark:bg-purple-500/10 rounded-md select-none mb-1.5 mt-2 border border-purple-500/10">
                    CNS 2 (Chapters 6-10)
                  </div>
                  <div className="space-y-1">
                    {chapters.slice(5, 10).map((ch, idx) => {
                      const realIdx = idx + 5;
                      const isActive = realIdx === activeChapterIndex;
                      const counts = chapterCounts(ch);
                      const pct = counts.total === 0 ? 0 : Math.round((counts.done / counts.total) * 100);
                      return (
                        <button
                          key={ch.id}
                          className={`chapter ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setActiveChapterIndex(realIdx);
                            setOpenSubjectIndex(0);
                            if (isMobile) {
                              setTab('workspace');
                            }
                          }}
                        >
                          <div className="ch-emoji">{ch.emoji || '🦋'}</div>
                          <div className="ch-body">
                            <div className="ch-title">
                              {isRTL ? `الفصل ${realIdx + 1}:` : `Chapter ${realIdx + 1}:`} {ch.title}
                            </div>
                            <div className="ch-meta">
                              {label('page')} {ch.page} · {ch.subjects.length} Subjects
                            </div>
                          </div>
                          <div className="ch-prog">
                            <span className="done-pill">
                              {counts.done}/{counts.total}
                            </span>
                            <div className="ch-mini">
                              <i style={{ width: `${pct}%` }}></i>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              (moduleCode === 'MSS-2' ? chapters.slice(0, 8) : chapters).map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                const counts = chapterCounts(ch);
                const pct = counts.total === 0 ? 0 : Math.round((counts.done / counts.total) * 100);
                return (
                  <button
                    key={ch.id}
                    className={`chapter ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setOpenSubjectIndex(0);
                      if (isMobile) {
                        setTab('workspace');
                      }
                    }}
                  >
                    <div className="ch-emoji">{ch.emoji || '🦋'}</div>
                    <div className="ch-body">
                      <div className="ch-title">
                        {isRTL ? `الفصل ${idx + 1}:` : `Chapter ${idx + 1}:`} {ch.title}
                      </div>
                      <div className="ch-meta">
                        {label('page')} {ch.page} · {ch.subjects.length} Subjects
                      </div>
                    </div>
                    <div className="ch-prog">
                      <span className="done-pill">
                        {counts.done}/{counts.total}
                      </span>
                      <div className="ch-mini">
                        <i style={{ width: `${pct}%` }}></i>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Pane - Workspace */}
        <section className="pane workspace-pane">
          {isMobile && (
            <div className="back-row">
              <button className="back-btn" onClick={() => setTab('outline')}>
                <ArrowLeft size={15} /> {label('allChapters')}
              </button>
            </div>
          )}

          {activeChapter ? (
            <>
              {/* Workspace Title */}
              <div className="ws-head">
                <h1>
                  {activeChapter.emoji} {isRTL ? `الفصل ${activeChapterIndex + 1}:` : `Chapter ${activeChapterIndex + 1}:`} {activeChapter.subtitle || activeChapter.title}
                </h1>
                <div className="ws-sub">
                  {label('page')} {activeChapter.page} • {activeChapter.lectureRange}
                  <span className="chiplet">{moduleName}</span>
                  {moduleCode === 'MCNS-2' && (
                    <span className={`chiplet ${activeChapterIndex < 5 ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/10' : 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/10'}`}>
                      {activeChapterIndex < 5 ? 'CNS 1' : 'CNS 2'}
                    </span>
                  )}
                </div>
              </div>

              {/* Core Milestones */}
              <div>
                <div className="section-label" style={{ marginBottom: '13px' }}>
                  {label('coreMilestones')}
                </div>
                <div className="milestones">
                  {MS.map((m) => {
                    const st = data[activeChapter.id] ?? emptyChapterState();
                    const isCompleted = !!st[m.k];
                    return (
                      <button
                        key={m.k}
                        className={`ms ${isCompleted ? 'on' : ''}`}
                        onClick={() => toggleBase(activeChapter.id, m.k)}
                        style={{ '--c': m.c } as React.CSSProperties}
                      >
                        <span className="check-badge">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span className="ms-ico">
                          <m.icon size={21} />
                        </span>
                        <span>
                          <span className="ms-txt" style={{ display: 'block' }}>
                            {label(m.labelKey)}
                          </span>
                          <span className="ms-state">
                            {isCompleted ? label('completed') : 'Not yet'}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subjects & Lectures Accordion */}
              <div>
                <div className="section-label" style={{ marginBottom: '13px' }}>
                  {label('subjectsLectures')}
                </div>
                <div className="accordion">
                  {activeChapter.subjects.map((sub, si) => {
                    const col = SUBJECT_COLORS[sub.id] || 'var(--accent)';
                    const isOpen = openSubjectIndex === si;
                    const keys = lectureKeys(sub);
                    const st = data[activeChapter.id] ?? emptyChapterState();

                    return (
                      <div key={sub.id} className={`subj ${isOpen ? 'open' : ''}`} style={{ '--sc': col } as React.CSSProperties}>
                        <button
                          className="subj-head"
                          onClick={() => setOpenSubjectIndex(isOpen ? -1 : si)}
                        >
                          <span className="subj-dot"></span>
                          <span className="subj-name">{sub.name}</span>
                          <span className="subj-stat">
                            {sub.lectureCount} {label('lectures')}
                          </span>
                          <span className="chev">
                            <ChevronDown size={18} />
                          </span>
                        </button>
                        <div className="subj-body">
                          <div className="subj-utils">
                            <button className="util" onClick={() => markAllLectures(activeChapter.id, sub, 'studied')}>
                              {label('markAllStudied')}
                            </button>
                            <button className="util" onClick={() => markAllLectures(activeChapter.id, sub, 'revised')}>
                              {label('markAllRevised')}
                            </button>
                          </div>
                          <div className="lectures">
                            {keys.map((k, li) => {
                              const ls = st.lectures?.[k] ?? { studied: false, revised: false };
                              const lecTitle = getLectureTitle(sub, li);
                              return (
                                <div key={k} className="lec">
                                  <span className="lec-name">
                                    {lecTitle}
                                  </span>
                                  <div className="lec-checks">
                                    <button
                                      className={`micro studied ${ls.studied ? 'on' : ''}`}
                                      onClick={() => toggleLecture(activeChapter.id, sub.id, li + 1, 'studied')}
                                    >
                                      <span className="box">
                                        <Check size={11} strokeWidth={3} />
                                      </span>
                                      {label('studied')}
                                    </button>
                                    <button
                                      className={`micro revised ${ls.revised ? 'on' : ''}`}
                                      onClick={() => toggleLecture(activeChapter.id, sub.id, li + 1, 'revised')}
                                    >
                                      <span className="box">
                                        <Check size={11} strokeWidth={3} />
                                      </span>
                                      {label('revised')}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes Card */}
              <div className="notes-card">
                <div className="notes-head">
                  <span className="pen">
                    <Edit3 size={16} />
                  </span>
                  {label('notesHighlights')}
                </div>
                <textarea
                  value={(data[activeChapter.id] ?? emptyChapterState()).notes}
                  onChange={(e) => setNotes(activeChapter.id, e.target.value)}
                  placeholder={label('notesPlaceholder')}
                ></textarea>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a chapter to begin tracking
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="portal-foot">
        <b>Ain Shams University</b> • ASU Medical Portal
      </footer>

      {/* Mobile Bottom Tabs */}
      <nav className="mobile-tabs">
        <button className={`mtab ${tab === 'outline' ? 'active' : ''}`} onClick={() => setTab('outline')}>
          <BookOpen size={20} />
          Outline
        </button>
        <button className={`mtab ${tab === 'workspace' ? 'active' : ''}`} onClick={() => setTab('workspace')}>
          <Layers size={20} />
          Workspace
        </button>
      </nav>

      {/* Floating Back to Modules Button */}
      <motion.button
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/year-${parsedYear}/${moduleCode.toLowerCase()}`)}
        className="fixed bottom-[86px] sm:bottom-[56px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-6 py-3 rounded-full border border-zinc-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-zinc-950/80 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 cursor-pointer"
      >
        <motion.div
          variants={{
            initial: { x: 0 },
            hover: { x: isRTL ? 4 : -4 }
          }}
          initial="initial"
          animate="initial"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center text-emerald-500 dark:text-emerald-400"
        >
          <ArrowLeft size={15} className={isRTL ? 'rotate-180' : ''} />
        </motion.div>
        <span className="tracking-wide">{isRTL ? 'العودة للمواد' : 'Back to Modules'}</span>
      </motion.button>

      {/* Save Toast Alert (Centered top to clear bottom button) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="save-toast"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-none fixed top-20 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-xs font-medium text-foreground shadow-xl backdrop-blur-xl"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22c55e]">
              <Check size={10} className="text-black" strokeWidth={3} />
            </span>
            {label('saved')}
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </PortalShell>
  );
}
