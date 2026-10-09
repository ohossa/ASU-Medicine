import {useSyncedHistory} from '../hooks/useSyncedHistory';
import {useOptionalLearning} from '../learning/LearningProvider';
import {moduleProgress} from '../learning/progress';
import {historyAccount} from '../learning/historyScope';
import {TopicPracticePicker} from './TopicPracticePicker';
import {latestTopicResult} from '../learning/customPractice';
import { ShuffleSwitch } from '../preferences/ShuffleSwitch';
import React, { useState, useLayoutEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Activity,
  FlaskConical,
  Bone,
  Microscope,
  ShieldAlert,
  Pill,
  Stethoscope,
  Biohazard,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Layers,
  Award,
  Brain,
  Eye,
  Ear,
  Bug
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ChapterData, SubjectData, SubjectColor, Question } from '../types';
import { subjectStyles } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { FlowBreadcrumbs } from './FlowBreadcrumbs';
import { applySubjectTheme } from '../theme/subjectThemes';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

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
  lectures?: Record<string, LectureState>;
}

interface Props {
  chapter: ChapterData;
  onBack: () => void;
  onSelectSubject: (subject: SubjectData, questions: Question[]) => void;
  onQuickStart: (questions: Question[]) => void;
  breadcrumbPath?: BreadcrumbItem[];
  userButton?: React.ReactNode;
  moduleCode?: string;
}

interface LatestResult {
  isCustom?:boolean;
  correct: number;
  total: number;
  pct: number;
  elapsedSeconds: number;
}

/* ------------------------------------------------------------------ */
/* Static maps                                                         */
/* ------------------------------------------------------------------ */

const ACCENT: Record<SubjectColor, { text: string; softBg: string; solidBg: string; border: string; gradient: string }> = {
  physiology:   { text: 'text-physiology',   softBg: 'bg-physiology/10',   solidBg: 'bg-physiology',   border: 'border-physiology/30',   gradient: 'from-physiology/20 to-physiology/5' },
  biochem:      { text: 'text-biochem',      softBg: 'bg-biochem/10',      solidBg: 'bg-biochem',      border: 'border-biochem/30',      gradient: 'from-biochem/20 to-biochem/5' },
  microbiology: { text: 'text-microbiology', softBg: 'bg-microbiology/10', solidBg: 'bg-microbiology', border: 'border-microbiology/30', gradient: 'from-microbiology/20 to-microbiology/5' },
  anatomy:      { text: 'text-anatomy',      softBg: 'bg-anatomy/10',      solidBg: 'bg-anatomy',      border: 'border-anatomy/30',      gradient: 'from-anatomy/20 to-anatomy/5' },
  histology:    { text: 'text-histology',    softBg: 'bg-histology/10',    solidBg: 'bg-histology',    border: 'border-histology/30',    gradient: 'from-histology/20 to-histology/5' },
  pathology:    { text: 'text-pathology',    softBg: 'bg-pathology/10',    solidBg: 'bg-pathology',    border: 'border-pathology/30',    gradient: 'from-pathology/20 to-pathology/5' },
  pharma:       { text: 'text-pharma',       softBg: 'bg-pharma/10',       solidBg: 'bg-pharma',       border: 'border-pharma/30',       gradient: 'from-pharma/20 to-pharma/5' },
  clinical:     { text: 'text-clinical',     softBg: 'bg-clinical/10',     solidBg: 'bg-clinical',     border: 'border-clinical/30',     gradient: 'from-clinical/20 to-clinical/5' },
  parasitology: { text: 'text-parasitology', softBg: 'bg-parasitology/10', solidBg: 'bg-parasitology', border: 'border-parasitology/30', gradient: 'from-parasitology/20 to-parasitology/5' },
  psychiatry:   { text: 'text-psychiatry',   softBg: 'bg-psychiatry/10',   solidBg: 'bg-psychiatry',   border: 'border-psychiatry/30',   gradient: 'from-psychiatry/20 to-psychiatry/5' },
  ophthalmology:{ text: 'text-ophthalmology',softBg: 'bg-ophthalmology/10',solidBg: 'bg-ophthalmology',border: 'border-ophthalmology/30',gradient: 'from-ophthalmology/20 to-ophthalmology/5' },
  ent:          { text: 'text-ent',          softBg: 'bg-ent/10',          solidBg: 'bg-ent',          border: 'border-ent/30',          gradient: 'from-ent/20 to-ent/5' },
};

const ICON_BY_NAME: Record<string, LucideIcon> = {
  activity: Activity,
  flaskconical: FlaskConical,
  flask: FlaskConical,
  bone: Bone,
  microscope: Microscope,
  shieldalert: ShieldAlert,
  shield: ShieldAlert,
  pill: Pill,
  stethoscope: Stethoscope,
  biohazard: Biohazard,
  brain: Brain,
  eye: Eye,
  ear: Ear,
  bug: Bug,
};

const ICON_BY_SUBJECT: Record<SubjectColor, LucideIcon> = {
  physiology: Activity,
  biochem: FlaskConical,
  microbiology: Biohazard,
  anatomy: Bone,
  histology: Microscope,
  pathology: ShieldAlert,
  pharma: Pill,
  clinical: Stethoscope,
  parasitology: Bug,
  psychiatry: Brain,
  ophthalmology: Eye,
  ent: Ear,
};

const iconFor = (subject: SubjectData): LucideIcon =>
  ICON_BY_NAME[(subject.iconName || '').toLowerCase().replace(/[^a-z]/g, '')] ?? ICON_BY_SUBJECT[subject.id] ?? HelpCircle;

/** Optional extra classes from the shared subjectStyles map (shape-agnostic). */
const styleHint = (color: SubjectColor): string => {
  const s = (subjectStyles as Record<string, unknown>)[color];
  return typeof s === 'string' ? s : '';
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const pctColor = (pct: number): string => {
  if (pct >= 75) return 'text-physiology';
  if (pct >= 50) return 'text-biochem';
  return 'text-pathology';
};

const fmtElapsed = (seconds: number): string => {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m === 0) return `${rest}s`;
  return rest > 0 ? `${m}m ${rest}s` : `${m}m`;
};

const FALLBACK: Record<string, { en: string; ar: string }> = {
  back:           { en: 'Back', ar: 'رجوع' },
  page:           { en: 'Page', ar: 'صفحة' },
  subjects:       { en: 'Subjects', ar: 'المواد' },
  questions:      { en: 'Questions', ar: 'الأسئلة' },
  available:      { en: 'available', ar: 'متاح' },
  comingSoon:     { en: 'Coming Soon', ar: 'قريبًا' },
  syllabus:       { en: 'Syllabus', ar: 'المنهج' },
  latestResult:   { en: 'Latest Result', ar: 'آخر نتيجة' },
  elapsed:        { en: 'elapsed', ar: 'مستغرق' },

  quickStartDesc: { en: 'Take on every subject in this chapter in one combined session.', ar: 'اختبر كل مواد هذا الفصل في جلسة واحدة مجمعة.' },
  startAll:       { en: 'Start All Subjects', ar: 'ابدأ كل المواد' },
  completed:      { en: 'Completed', ar: 'مكتمل' },
  noSubjects:     { en: 'No subjects available in this chapter yet.', ar: 'لا توجد مواد متاحة في هذا الفصل بعد.' },
};

/** Defensive view over QuizResult without depending on its exact shape. */
/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function SubjectSelect({ chapter, onBack, onSelectSubject, breadcrumbPath, userButton, moduleCode }: Props) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const isGit = moduleCode === 'MGL-3';
  const isLectureBased = isGit || moduleCode === 'MINF-1' || (moduleCode === 'MSS-2' && chapter.id >= 1 && chapter.id <= 8);

  const label = (key: string): string => {
    if (isGit) {
      if (key === 'comingSoon') return isRTL ? 'لا توجد أسئلة في هذا النمط' : 'No questions in this mode';
      if (key === 'subjects') return isRTL ? 'الفصول / الموضوعات' : 'Chapters / topics';
      if (key === 'startAll') return isRTL ? 'ابدأ كل الموضوعات' : 'Start all topics';
      if (key === 'quickStartDesc') return isRTL ? 'تدرب على كل موضوعات هذه المادة في هذه المجموعة.' : 'Practice every topic in this subject and collection.';
      if (key === 'available') return isRTL ? 'موضوع متاح' : 'topics available';
      if (key === 'noSubjects') return isRTL ? 'لا توجد موضوعات متاحة في هذا النمط.' : 'No topics available in this mode.';
    }
    if (isLectureBased) {
      if (key === 'subjects') return isRTL ? 'المحاضرات' : 'Lectures';
      if (key === 'startAll') return isRTL ? 'ابدأ كل المحاضرات' : 'Start All Lectures';
      if (key === 'quickStartDesc') return isRTL ? 'اختبر كل محاضرات هذا القسم في جلسة واحدة مجمعة.' : 'Take on every lecture in this chapter in one combined session.';
      if (key === 'available') return isRTL ? 'محاضرة متاحة' : 'lectures available';
    }
    const translated = typeof t === 'function' ? t(key) : undefined;
    if (translated && translated !== key) return translated;
    const f = FALLBACK[key];
    return f ? (isRTL ? f.ar : f.en) : key;
  };

  const history = useSyncedHistory();
  const learning = useOptionalLearning();
  const [trackerData, setTrackerData] = useState<Record<number, ChapterState>>({});

  // Read this account and module only; cloud hydration may arrive after mount.
  const trackerAccount=historyAccount();
  useLayoutEffect(() => {
    const update=()=>{
      try {
        setTrackerData(JSON.parse(localStorage.getItem(`asu_study_tracker:${trackerAccount??'guest'}:${moduleCode}`)??'{}'));
      } catch { setTrackerData({}); }
    };
    update();
    window.addEventListener('storage',update);
    return()=>window.removeEventListener('storage',update);
  },[trackerAccount,moduleCode,chapter.id]);

  /* Per-subject syllabus progress % */
  const syllabusProgress = useMemo(() => {
    const lectures = trackerData[chapter.id]?.lectures ?? {};
    const result: Record<string, number> = {};
    for (const subject of chapter.subjects) {
      if (isLectureBased && subject.lectureNum !== undefined) {
        const key = `${subject.id}_L${subject.lectureNum}`;
        const ls = lectures[key];
        let done = 0;
        if (ls?.studied) done++;
        if (ls?.revised) done++;
        result[subject.name] = Math.round((done / 2) * 100);
      } else {
        const total = Math.max(0, subject.lectureCount) * 2;
        if (total === 0) {
          result[subject.id] = 0;
          continue;
        }
        let done = 0;
        const prefix = `${subject.id}_L`;
        for (const [key, ls] of Object.entries(lectures)) {
          if (!key.startsWith(prefix)) continue;
          if (ls?.studied) done++;
          if (ls?.revised) done++;
        }
        result[subject.id] = Math.min(100, Math.round((done / total) * 100));
      }
    }
    return result;
  }, [trackerData, chapter, isLectureBased]);

  /* Per-subject latest exam result */
  const latestResults = useMemo(() => {
    const result: Record<string, LatestResult | null> = {};
    for (const subject of chapter.subjects) {
      const key = isLectureBased ? subject.name : subject.id;
      result[key] = latestTopicResult(history, chapter.id, subject.name, moduleCode);
    }
    return result;
  }, [history, chapter, isLectureBased, moduleCode]);

  const allQuestions = useMemo(() => chapter.subjects.flatMap((s) => s.questions), [chapter]);
  const activeSubjects = chapter.subjects.filter((s) => s.questions.length > 0).length;

  const accent = ACCENT[chapter.accentColor];
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  const crumbs: BreadcrumbItem[] = breadcrumbPath ?? [
    { label: label('back'), onClick: onBack },
    { label: chapter.title },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="relative min-h-screen overflow-hidden text-foreground">
      {/* Themed floating blobs */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className={`pointer-events-none absolute -top-40 -left-40 h-[460px] w-[460px] rounded-full bg-gradient-to-br ${accent.gradient} blur-3xl opacity-60 dark:opacity-60 ${styleHint(chapter.accentColor)}`}
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className={`pointer-events-none absolute -bottom-40 -right-40 h-[460px] w-[460px] rounded-full bg-gradient-to-tl ${accent.gradient} blur-3xl opacity-40`}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ---------------- Sticky navigation header ---------------- */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          aria-label={isRTL ? 'مسار التنقل' : 'Breadcrumb'}
          className={`sticky top-3 z-20 mb-8 flex items-center gap-3 rounded-2xl border bg-card/85 px-3 py-2.5 glass-panel border-border dark:${accent.border}`}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label={label('back')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border dark:border-white/[0.08] bg-secondary/80 dark:bg-white/[0.03] text-muted-foreground hover:text-foreground dark:text-white/60 dark:hover:text-white transition-all active:scale-95"
          >
            <BackArrow size={16} />
          </button>

          {isGit ? <FlowBreadcrumbs crumbs={crumbs} rtl={isRTL} /> : <ol className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-xs text-muted-foreground dark:text-white/45">
            {crumbs.map((crumb, i) => (
              <li key={`${crumb.label}_${i}`} className="flex shrink-0 items-center gap-1">
                {i > 0 && <ChevronRight size={13} className={`text-white/25 ${isRTL ? 'rotate-180' : ''}`} />}
                {crumb.onClick ? (
                  <button type="button" onClick={crumb.onClick} className="rounded px-1 py-0.5 transition-colors hover:text-foreground dark:hover:text-white">
                    {crumb.label}
                  </button>
                ) : (
                  <span className={i === crumbs.length - 1 ? 'font-medium text-foreground dark:text-white/80' : ''}>{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>}

          <span className={`hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium sm:inline-flex ${accent.softBg} ${accent.text}`}>
            <Layers size={11} />
            {activeSubjects}/{chapter.subjects.length} {label('available')}
          </span>

          <ShuffleSwitch />
          {userButton && <div className="shrink-0">{userButton}</div>}
        </motion.nav>

        {/* ---------------- Hero panel ---------------- */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 26, delay: 0.05 }}
          className="mb-10 flex flex-wrap items-center justify-between gap-5"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{chapter.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground dark:text-white">{chapter.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground dark:text-white/50">
                {chapter.id === 0 ? (
                  `${chapter.subtitle} · ${chapter.lectureRange}`
                ) : (
                  `${chapter.subtitle} · ${label('page')} ${chapter.page} · ${chapter.lectureRange}`
                )}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-5 rounded-2xl border px-5 py-3 border-border dark:${accent.border} bg-card dark:bg-white/[0.02] glass-panel`}>
            <div className="text-center">
              <p className={`text-lg font-bold tabular-nums ${accent.text}`}>{chapter.subjects.length}</p>
              <p className="text-[10px] text-muted-foreground dark:text-white/45">{label('subjects')}</p>
            </div>
            <div className="h-8 w-px bg-border dark:bg-white/[0.08]" />
            <div className="text-center">
              <p className={`text-lg font-bold tabular-nums ${accent.text}`}>{allQuestions.length}</p>
              <p className="text-[10px] text-muted-foreground dark:text-white/45">{label('questions')}</p>
            </div>
          </div>
        </motion.header>

        {/* ---------------- Subject grid ---------------- */}
        {chapter.subjects.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-border dark:border-white/[0.1] py-16 text-center text-sm text-muted-foreground dark:text-white/40">
            {label('noSubjects')}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {chapter.subjects.map((subject) => {
              const Icon = iconFor(subject);
              const subAccent = ACCENT[subject.id];
              const isActive = subject.questions.length > 0;
              const progress = syllabusProgress[isLectureBased ? subject.name : subject.id] ?? 0;
              const latest = latestResults[isLectureBased ? subject.name : subject.id] ?? null;
              const cloudProgress = moduleProgress(moduleCode??'',subject.questions,learning?.data?.entries??[]);
              const isCompleted = cloudProgress.attempted===subject.questions.length && subject.questions.length>0;
              const hasPractice = isCompleted || latest!==null;

              return (
                <motion.button
                  key={isLectureBased ? `${subject.id}_L${subject.lectureNum}` : subject.id}
                  type="button"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
                  }}
                  whileHover={isActive ? { scale: 1.03, y: -4, transition: { type: 'spring', stiffness: 400, damping: 18 } } : undefined}
                  whileTap={isActive ? { scale: 0.98 } : undefined}
                  disabled={!isActive}
                  onClick={() => {
                    if (isActive) {
                      applySubjectTheme(subject.id);
                      onSelectSubject(subject, subject.questions);
                    }
                  }}
                  className={`group relative flex flex-col text-start bg-card dark:bg-white/[0.02] border border-border dark:border-white/[0.06] glass-panel rounded-[28px] p-6 transition-colors ${
                    isActive ? 'hover:border-gray-300 dark:hover:border-white/20 cursor-pointer' : 'cursor-not-allowed opacity-50 saturate-50'
                  }`}
                >
                  {/* Icon + completed badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${subAccent.gradient} border ${subAccent.border}`}>
                      <Icon size={22} className={subAccent.text} />
                    </span>
                    {hasPractice && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-physiology/10 px-2 py-0.5 text-[10px] font-medium text-physiology">
                        <CheckCircle size={11} />
                        {isCompleted ? label('completed') : (isRTL?'تم التدريب':'Practiced')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-foreground dark:text-white">{subject.name}</h3>

                  {/* Questions badge */}
                  <span
                    className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      isActive ? `${subAccent.softBg} ${subAccent.text}` : 'bg-secondary text-muted-foreground dark:bg-white/[0.05] dark:text-white/40'
                    }`}
                  >
                    <HelpCircle size={11} />
                    {isActive ? `${subject.questions.length} ${label('questions')}` : label('comingSoon')}
                  </span>

                  {cloudProgress.attempted>0 && <div className="mt-3 text-xs text-muted-foreground">
                    <span className="tabular-nums">{cloudProgress.attempted}/{cloudProgress.total} {isRTL?'تمت الإجابة':'answered'}</span>
                    <progress className="mt-2 block h-1 w-full accent-emerald-500" value={cloudProgress.attempted} max={cloudProgress.total} aria-label={isRTL?'الأسئلة المُجاب عنها':'Questions answered'} />
                  </div>}

                  {/* Syllabus progress */}
                  {chapter.bankSection !== 'past-exams' && <div className="mt-4 w-full">
                    <div className="mb-1.5 flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground dark:text-white/45">{label('syllabus')}</span>
                      <span className={`font-semibold tabular-nums ${progress > 0 ? subAccent.text : 'text-muted-foreground dark:text-white/35'}`}>{progress}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-secondary dark:bg-white/[0.06]">
                      <motion.div
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                        className={`h-full rounded-full ${subAccent.solidBg}`}
                      />
                    </div>
                  </div>}

                  {/* Past results footer */}
                  <AnimatePresence initial={false}>
                    {latest && (
                      <motion.div
                        key="latest"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden w-full"
                      >
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border dark:border-white/[0.06] pt-3 text-[10px] text-muted-foreground dark:text-white/45">
                          <span className="inline-flex items-center gap-1">
                            <Award size={11} className={pctColor(latest.pct)} />
                            {label('latestResult')}:
                            <span className={`font-bold tabular-nums ${pctColor(latest.pct)}`}>
                              {latest.pct}% ({latest.correct}/{latest.total})
                            </span>
                          </span>
                          {!latest.isCustom&&<span className="inline-flex items-center gap-1 tabular-nums text-muted-foreground dark:text-white/40">
                            <Clock size={11} />
                            {fmtElapsed(latest.elapsedSeconds)} {label('elapsed')}
                          </span>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover arrow */}
                  {isActive && (
                    <span className={`absolute bottom-5 ${isRTL ? 'left-5' : 'right-5'} text-transparent transition-colors group-hover:text-muted-foreground dark:group-hover:text-white/40`}>
                      <ForwardArrow size={16} />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {allQuestions.length > 0 && <TopicPracticePicker chapter={chapter} moduleCode={moduleCode} onStart={onSelectSubject}/>}
      </div>
    </div>
  );
}

export default SubjectSelect;
