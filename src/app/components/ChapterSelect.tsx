import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { GraduationCap, Layers, ArrowRight, Palette, Clock, Award, Trash2, ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import type { ChapterData, SubjectColor } from '../types';
import { formatTime } from '../types';
import type { QuizResult } from '../utils/storage';
import { getQuizHistory, clearQuizHistory } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface Props {
  chapters: ChapterData[];
  studyModeName: string;
  moduleName: string;
  moduleCode: string;
  onSelectChapter: (chapter: ChapterData) => void;
  onSelectHistory?: (result: QuizResult) => void;
  onBackToModeSelect: () => void;
  userButton?: React.ReactNode;
  breadcrumbPath?: BreadcrumbItem[];
}

/* ------------------------------------------------------------------ */
/* Color records                                                       */
/* ------------------------------------------------------------------ */

const badgeColors: Record<SubjectColor, string> = {
  anatomy: 'bg-anatomy/10 text-anatomy',
  histology: 'bg-histology/10 text-histology',
  physiology: 'bg-physiology/10 text-physiology',
  biochem: 'bg-biochem/10 text-biochem',
  microbiology: 'bg-microbiology/10 text-microbiology',
  pathology: 'bg-pathology/10 text-pathology',
  pharma: 'bg-pharma/10 text-pharma',
  clinical: 'bg-clinical/10 text-clinical',
  parasitology: 'bg-parasitology/10 text-parasitology',
  psychiatry: 'bg-psychiatry/10 text-psychiatry',
  ophthalmology: 'bg-ophthalmology/10 text-ophthalmology',
  ent: 'bg-ent/10 text-ent',
};

const dotColors: Record<SubjectColor, string> = {
  anatomy: 'bg-anatomy',
  histology: 'bg-histology',
  physiology: 'bg-physiology',
  biochem: 'bg-biochem',
  microbiology: 'bg-microbiology',
  pathology: 'bg-pathology',
  pharma: 'bg-pharma',
  clinical: 'bg-clinical',
  parasitology: 'bg-parasitology',
  psychiatry: 'bg-psychiatry',
  ophthalmology: 'bg-ophthalmology',
  ent: 'bg-ent',
};

const cornerGradient: Record<SubjectColor, string> = {
  physiology: 'from-physiology/5',
  anatomy: 'from-anatomy/5',
  biochem: 'from-biochem/5',
  microbiology: 'from-microbiology/5',
  pathology: 'from-pathology/5',
  pharma: 'from-pharma/5',
  histology: 'from-histology/5',
  clinical: 'from-clinical/5',
  parasitology: 'from-parasitology/5',
  psychiatry: 'from-psychiatry/5',
  ophthalmology: 'from-ophthalmology/5',
  ent: 'from-ent/5',
};

const hoverText: Record<SubjectColor, string> = {
  physiology: 'group-hover:text-physiology',
  anatomy: 'group-hover:text-anatomy',
  biochem: 'group-hover:text-biochem',
  microbiology: 'group-hover:text-microbiology',
  pathology: 'group-hover:text-pathology',
  pharma: 'group-hover:text-pharma',
  histology: 'group-hover:text-histology',
  clinical: 'group-hover:text-clinical',
  parasitology: 'group-hover:text-parasitology',
  psychiatry: 'group-hover:text-psychiatry',
  ophthalmology: 'group-hover:text-ophthalmology',
  ent: 'group-hover:text-ent',
};

const startButtonBg: Record<SubjectColor, string> = {
  anatomy: 'bg-anatomy',
  histology: 'bg-histology',
  physiology: 'bg-physiology',
  biochem: 'bg-biochem',
  microbiology: 'bg-microbiology',
  pathology: 'bg-pathology',
  pharma: 'bg-pharma',
  clinical: 'bg-clinical',
  parasitology: 'bg-parasitology',
  psychiatry: 'bg-psychiatry',
  ophthalmology: 'bg-ophthalmology',
  ent: 'bg-ent',
};

const LEGEND: { id: SubjectColor; en: string; ar: string }[] = [
  { id: 'anatomy', en: 'Anatomy', ar: 'التشريح' },
  { id: 'histology', en: 'Histology', ar: 'الأنسجة' },
  { id: 'physiology', en: 'Physiology', ar: 'الفسيولوجيا' },
  { id: 'biochem', en: 'Biochemistry', ar: 'الكيمياء الحيوية' },
  { id: 'microbiology', en: 'Microbiology', ar: 'الأحياء الدقيقة' },
  { id: 'parasitology', en: 'Parasitology', ar: 'الطفيليات' },
  { id: 'pathology', en: 'Pathology', ar: 'الباثولوجيا' },
  { id: 'pharma', en: 'Pharmacology', ar: 'الأدوية' },
  { id: 'psychiatry', en: 'Psychiatry', ar: 'الطب النفسي' },
  { id: 'ophthalmology', en: 'Ophthalmology', ar: 'الرمد' },
  { id: 'ent', en: 'E.N.T.', ar: 'الأنف والأذن والحنجرة' },
  { id: 'clinical', en: 'Clinical', ar: 'الإكلينيكي' },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Score color classification. */
const pctColor = (pct: number): string => {
  if (pct >= 75) return 'text-physiology';
  if (pct >= 50) return 'text-biochem';
  return 'text-pathology';
};

const FALLBACK: Record<string, { en: string; ar: string }> = {
  back: { en: 'Back', ar: 'رجوع' },
  portal: { en: 'Portal', ar: 'البوابة' },
  syllabusProgress: { en: 'Syllabus & Progress', ar: 'المنهج والتقدم' },
  chapters: { en: 'Chapters', ar: 'الفصول' },
  subjects: { en: 'Subjects', ar: 'المواد' },
  questions: { en: 'Questions', ar: 'الأسئلة' },
  start: { en: 'Start', ar: 'ابدأ' },
  page: { en: 'Page', ar: 'صفحة' },
  legend: { en: 'Subject Color Guide', ar: 'دليل ألوان المواد' },
  recentResults: { en: 'Recent Results', ar: 'النتائج الأخيرة' },
  clearHistory: { en: 'Clear history', ar: 'مسح السجل' },
  noHistory: { en: 'No quiz attempts yet. Your recent results will appear here.', ar: 'لا توجد محاولات بعد. ستظهر نتائجك الأخيرة هنا.' },
  noChapters: { en: 'No chapters available for this module yet.', ar: 'لا توجد فصول متاحة لهذه المادة بعد.' },
};

/** Normalized, render-safe view of a QuizResult regardless of exact stored shape. */
interface HistoryView {
  raw: QuizResult;
  key: string;
  chapterTitle: string;
  correct: number;
  total: number;
  pct: number;
  seconds: number;
  date: Date | null;
}

const toHistoryView = (result: QuizResult, index: number): HistoryView => {
  const r = result as unknown as Record<string, unknown>;
  const num = (...keys: string[]): number | null => {
    for (const k of keys) {
      const v = r[k];
      if (typeof v === 'number' && Number.isFinite(v)) return v;
    }
    return null;
  };
  const str = (...keys: string[]): string | null => {
    for (const k of keys) {
      const v = r[k];
      if (typeof v === 'string' && v.length > 0) return v;
    }
    return null;
  };

  const correct = num('score', 'correct', 'correctCount', 'correctAnswers') ?? 0;
  const total = num('total', 'totalQuestions', 'questionCount') ?? 0;
  const explicitPct = num('percentage', 'pct');
  const pct = total > 0
    ? Math.round((correct / total) * 100)
    : Math.max(0, Math.min(100, Math.round(explicitPct ?? 0)));
  const seconds = num('timeElapsed', 'elapsed', 'duration', 'time') ?? 0;

  const rawDate = r['date'] ?? r['timestamp'] ?? r['completedAt'] ?? r['createdAt'];
  let date: Date | null = null;
  if (typeof rawDate === 'number' || typeof rawDate === 'string') {
    const d = new Date(rawDate);
    if (!Number.isNaN(d.getTime())) date = d;
  }

  return {
    raw: result,
    key: str('id') ?? `${date ? date.getTime() : 'h'}_${index}`,
    chapterTitle: str('chapterTitle', 'chapterName', 'chapter', 'title') ?? '—',
    correct,
    total,
    pct,
    seconds,
    date,
  };
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChapterSelect({
  chapters,
  studyModeName,
  moduleName,
  moduleCode,
  onSelectChapter,
  onSelectHistory,
  onBackToModeSelect,
  userButton,
  breadcrumbPath,
}: Props) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  const label = (key: string): string => {
    const translated = typeof t === 'function' ? t(key) : undefined;
    if (translated && translated !== key) return translated;
    const f = FALLBACK[key];
    return f ? (isRTL ? f.ar : f.en) : key;
  };

  const [history, setHistory] = useState<QuizResult[]>([]);

  /* History retrieval on mount */
  useEffect(() => {
    try {
      const all = getQuizHistory();
      const cleaned = (Array.isArray(all) ? all : []).filter(
        (r): r is QuizResult => r !== null && typeof r === 'object',
      );
      setHistory(cleaned.slice(0, 6));
    } catch {
      setHistory([]);
    }
  }, []);

  const handleClearHistory = () => {
    clearQuizHistory();
    setHistory([]);
  };

  /* Academic stats */
  const distinctSubjects = chapters.length > 0
    ? new Set(chapters.flatMap((c) => c.subjects.map((s) => s.id))).size
    : 7;
  const totalQuestions = chapters.reduce(
    (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
    0,
  );

  const mixedChapter = useMemo(() => {
    if (chapters.length <= 1) return null;

    const subjectsMap: Record<string, any> = {};
    chapters.forEach(ch => {
      ch.subjects.forEach(sub => {
        if (!subjectsMap[sub.id]) {
          subjectsMap[sub.id] = {
            id: sub.id,
            name: sub.name,
            iconName: sub.iconName,
            lectures: language === 'en' ? 'All Lectures' : 'جميع المحاضرات',
            lectureCount: 0,
            questions: [],
          };
        }
        subjectsMap[sub.id].questions = [
          ...subjectsMap[sub.id].questions,
          ...sub.questions
        ];
        subjectsMap[sub.id].lectureCount += sub.lectureCount;
      });
    });

    const mergedSubjects = Object.values(subjectsMap).filter((s: any) => s.questions.length > 0);
    if (mergedSubjects.length === 0) return null;

    return {
      id: 0,
      title: language === 'en' ? 'All Chapters (Mixed)' : 'الموديول كاملاً (مختلط)',
      subtitle: language === 'en' 
        ? 'Practice questions from all chapters and subjects combined' 
        : 'تدرب على أسئلة جميع الفصول والمواد مجتمعة',
      emoji: '📚',
      page: 1,
      lectureRange: language === 'en' ? 'All Sections' : 'جميع الأقسام',
      accentColor: 'clinical' as SubjectColor,
      subjects: mergedSubjects,
    };
  }, [chapters, language]);

  const renderMixedCard = (mCh: ChapterData) => {
    const accent = mCh.accentColor;
    return (
      <article
        onClick={() => onSelectChapter(mCh)}
        className="cs-enter group relative overflow-hidden bg-gradient-to-r from-card to-secondary/30 border border-border dark:border-white/[0.06] backdrop-blur-xl rounded-[28px] p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:border-gray-300 dark:hover:border-white/[0.14] mb-6 cursor-pointer"
        style={{ animationDelay: '100ms' }}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${cornerGradient[accent] || 'from-clinical/5'} to-transparent blur-2xl`}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-left rtl:text-right">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{mCh.emoji}</span>
              <span className="rounded-full bg-clinical/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-clinical dark:text-clinical/90">
                {isRTL ? 'مختلط كاملاً' : 'Full Mixed'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground dark:text-white tracking-tight">
              {mCh.title}
            </h2>

            {mCh.subjects.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                {mCh.subjects.map((s) => (
                  <span key={s.id} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColors[s.id]}`}>
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end shrink-0 gap-4 border-t border-border/50 sm:border-0 pt-4 sm:pt-0">
            <div className="text-start sm:text-right rtl:text-right">
              <span className="block text-[11px] text-muted-foreground dark:text-white/40 font-medium">
                {mCh.subjects.length} {label('subjects')}
              </span>
              <span className="block text-xs font-bold text-foreground/80 dark:text-white/75 mt-0.5">
                {mCh.subjects.reduce((sum, s) => sum + s.questions.length, 0)} {label('questions')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSelectChapter(mCh)}
              aria-label={`${label('start')}: ${mCh.title}`}
              className="flex h-12 w-12 items-center justify-center rounded-full text-white dark:text-black shadow-lg transition-all hover:scale-110 active:scale-95 bg-clinical hover:bg-clinical-dark cursor-pointer shrink-0"
            >
              <StartArrow size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </article>
    );
  };

  const crumbs: BreadcrumbItem[] = breadcrumbPath ?? [
    { label: label('portal'), onClick: onBackToModeSelect },
    { label: moduleCode },
    { label: studyModeName },
  ];

  const renderChapterCard = (chapter: ChapterData, index: number) => {
    const accent = chapter.accentColor;
    return (
      <article
        key={chapter.id}
        onClick={() => onSelectChapter(chapter)}
        className="cs-enter group relative overflow-hidden bg-card border border-border dark:border-white/[0.06] backdrop-blur-xl rounded-[28px] p-6 transition-all duration-300 hover:scale-[1.015] hover:-translate-y-2 hover:border-gray-300 dark:hover:border-white/[0.14] cursor-pointer"
        style={{ animationDelay: `${120 + index * 70}ms` }}
      >
        {/* Corner gradient accent */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-12 ${isRTL ? '-left-12' : '-right-12'} h-40 w-40 rounded-full bg-gradient-to-br ${cornerGradient[accent]} to-transparent blur-2xl`}
        />

        <div className="relative">
          <div className="mb-3 flex items-start justify-between gap-3">
            <span className="text-2xl">{chapter.emoji}</span>
            <span className="rounded-full border border-border dark:border-white/[0.08] bg-secondary/80 dark:bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground dark:text-white/50">
              #{chapter.id}
            </span>
          </div>

          <h3 className={`text-base font-semibold text-foreground dark:text-white transition-colors ${hoverText[accent]}`}>
            {chapter.title}
          </h3>


          {/* Subject badges */}
          {chapter.subjects.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chapter.subjects.map((s) => (
                <span key={s.id} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColors[s.id]}`}>
                  {s.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground dark:text-white/40">
              {chapter.subjects.reduce((a, s) => a + s.questions.length, 0)} {label('questions')}
            </span>
            <button
              type="button"
              onClick={() => onSelectChapter(chapter)}
              aria-label={`${label('start')}: ${chapter.title}`}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white dark:text-black shadow-lg transition-all hover:scale-110 active:scale-95 ${startButtonBg[accent]}`}
            >
              <StartArrow size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </article>
    );
  };

  const views = history.map(toHistoryView);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const StartArrow = isRTL ? ArrowLeft : ArrowRight;

  const formatDay = (d: Date | null): string =>
    d ? d.toLocaleDateString(isRTL ? 'ar' : 'en', { month: 'short', day: 'numeric' }) : '—';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="relative min-h-screen overflow-hidden text-foreground">
      {/* Self-contained animations (framer-motion intentionally not imported) */}
      <style>{`
        @keyframes cs-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cs-float-a { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px, 40px); } }
        @keyframes cs-float-b { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-40px, -30px); } }
        @keyframes cs-hue { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .cs-enter { opacity: 0; animation: cs-fade-up .55s cubic-bezier(.21,.65,.36,1) forwards; }
        .cs-blob-a { animation: cs-float-a 14s ease-in-out infinite; }
        .cs-blob-b { animation: cs-float-b 18s ease-in-out infinite; }
        .cs-gradient-title {
          background-image: linear-gradient(120deg, #10B981, #06B6D4, #3B82F6, #8B5CF6);
          background-size: 300% 300%;
          animation: cs-hue 8s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>


      <div aria-hidden className="cs-blob-a pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-gradient-radial from-physiology/4 to-transparent blur-3xl" />
      <div aria-hidden className="cs-blob-b pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-gradient-radial from-anatomy/4 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Unified Header Card Panel */}
        <div className="cs-enter mb-8 rounded-[28px] border border-border bg-card p-6 sm:p-8 shadow-sm" style={{ animationDelay: '0ms' }}>
          {/* ---------------- Top navigation bar ---------------- */}
          <nav className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={onBackToModeSelect}
              aria-label={label('back')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white hover:bg-muted transition-all active:scale-95 cursor-pointer"
            >
              <BackArrow size={16} />
            </button>

            <ol className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-xs font-medium text-gray-500 dark:text-white/60">
              {crumbs.map((crumb, i) => (
                <li key={`${crumb.label}_${i}`} className="flex shrink-0 items-center gap-1">
                  {i > 0 && <ChevronRight size={13} className={`text-gray-400 dark:text-white/30 ${isRTL ? 'rotate-180' : ''}`} />}
                  {crumb.onClick ? (
                    <button
                      type="button"
                      onClick={crumb.onClick}
                      className="rounded px-1 py-0.5 transition-colors text-gray-500 dark:text-white/60 hover:text-gray-950 dark:hover:text-white cursor-pointer"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={i === crumbs.length - 1 ? 'font-semibold text-gray-950 dark:text-white' : ''}>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>

            {userButton && <div className="shrink-0">{userButton}</div>}
          </nav>

          {/* ---------------- Hero section ---------------- */}
          <header className="mb-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="cs-gradient-title text-3xl font-bold tracking-tight sm:text-4xl">{moduleName}</h1>
                <p className="mt-1.5 text-sm text-muted-foreground dark:text-white/50">
                  {moduleCode} · {studyModeName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/year-2/${moduleCode.toLowerCase()}/tracker`)}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-white transition-all hover:bg-muted active:scale-95 cursor-pointer"
              >
                <Calendar size={16} className="text-physiology" />
                {label('syllabusProgress')}
              </button>
            </div>

            {/* Academic stats */}
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-gray-700 dark:text-white/80 font-medium">
                <Layers size={13} className="text-clinical" />
                {chapters.length} {label('chapters')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-gray-700 dark:text-white/80 font-medium">
                <GraduationCap size={13} className="text-biochem" />
                {distinctSubjects} {label('subjects')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-gray-700 dark:text-white/80 font-medium">
                <Award size={13} className="text-physiology" />
                {totalQuestions} {label('questions')}
              </span>
            </div>
          </header>
        </div>

        {/* ---------------- Main layout: grid + sidebar ---------------- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Chapter grid */}
          <main>
            {chapters.length > 0 && mixedChapter && renderMixedCard(mixedChapter)}
            {chapters.length === 0 ? (
              <div className="cs-enter rounded-[28px] border border-dashed border-border dark:border-white/[0.1] py-16 text-center text-sm text-muted-foreground dark:text-white/40">
                {label('noChapters')}
              </div>
            ) : moduleCode === 'MCNS-2' ? (
              <div className="space-y-8">
                {/* CNS 1 Section */}
                <div>
                  <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-muted-foreground border-l-4 border-physiology pl-3">
                    {isRTL ? 'الجهاز العصبي المركزي 1: المقدمة، الأنظمة الحسية والحركية' : 'CNS 1: Introduction, Sensory & Motor Systems'}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {chapters.filter(c => c.id <= 5).map((chapter, i) => renderChapterCard(chapter, i))}
                  </div>
                </div>

                {/* CNS 2 Section */}
                <div className="pt-4">
                  <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-muted-foreground border-l-4 border-anatomy pl-3">
                    {isRTL ? 'الجهاز العصبي المركزي 2: المخ، الدماغ البيني، الالتهابات والضمور' : 'CNS 2: Cerebrum, Diencephalon, Infections & Degeneration'}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {chapters.filter(c => c.id > 5).map((chapter, i) => renderChapterCard(chapter, i + 5))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {chapters.map((chapter, i) => renderChapterCard(chapter, i))}
              </div>
            )}

            {/* Legend */}
            <section
              className="cs-enter mt-8 rounded-[28px] border border-border dark:border-white/[0.06] bg-card p-5 backdrop-blur-xl"
              style={{ animationDelay: `${160 + chapters.length * 70}ms` }}
            >
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground dark:text-white/60">
                <Palette size={14} />
                {label('legend')}
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                {LEGEND.map((item) => (
                  <span key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white/65">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColors[item.id]}`} />
                    {isRTL ? item.ar : item.en}
                  </span>
                ))}
              </div>
            </section>
          </main>

          {/* ---------------- History sidebar ---------------- */}
          <aside className="cs-enter" style={{ animationDelay: '200ms' }}>
            <div className="rounded-[28px] border border-border dark:border-white/[0.06] bg-card p-5 backdrop-blur-xl lg:sticky lg:top-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground dark:text-white/60">
                  <Award size={14} className="text-biochem" />
                  {label('recentResults')}
                </h4>
                {views.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    aria-label={label('clearHistory')}
                    title={label('clearHistory')}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/50 dark:text-white/35 transition-colors hover:bg-pathology/10 hover:text-pathology"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              {views.length === 0 ? (
                <p className="py-6 text-center text-[11px] leading-relaxed text-muted-foreground dark:text-white/35">{label('noHistory')}</p>
              ) : (
                <ul className="space-y-2">
                  {views.map((v) => (
                    <li key={v.key}>
                      <button
                        type="button"
                        onClick={() => onSelectHistory?.(v.raw)}
                        disabled={!onSelectHistory}
                        className="w-full rounded-2xl border border-border dark:border-white/[0.05] bg-muted/20 dark:bg-white/[0.02] px-3.5 py-3 text-start transition-all enabled:hover:border-gray-300 dark:enabled:hover:border-white/[0.14] enabled:hover:bg-muted/50 dark:enabled:hover:bg-white/[0.05] enabled:active:scale-[0.985] disabled:cursor-default"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-bold tabular-nums ${pctColor(v.pct)}`}>{v.pct}%</span>
                          <span className="text-[10px] text-muted-foreground dark:text-white/40">{formatDay(v.date)}</span>
                        </div>
                        <p className="mt-1 truncate text-xs text-foreground/80 dark:text-white/75">{v.chapterTitle}</p>
                        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground dark:text-white/40">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={10} />
                            {formatTime(v.seconds)}
                          </span>
                          <span className="tabular-nums">
                            {v.correct}/{v.total}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}

export default ChapterSelect;
