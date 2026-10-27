import { useState } from 'react';
import { visiblePracticeChapters } from '../lib/practiceOrder';
import { ShuffleSwitch } from '../preferences/ShuffleSwitch';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  Award,
  Bone,
  Activity,
  Microscope,
  FlaskConical,
  ShieldAlert,
  Pill,
  Biohazard,
  Bug,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { ChapterData, QuestionCollection, SubjectColor } from '../types';
import { subjectStyles } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { selectGitCollection, selectGitExamPeriod } from '../lib/gitBank';
import { FlowBreadcrumbs, type FlowCrumb } from './FlowBreadcrumbs';
import { applySubjectTheme } from '../theme/subjectThemes';
import { PortalFooter } from './PortalFooter';

interface Props {
  chapters: ChapterData[];
  collection: QuestionCollection;
  onCollectionChange: (collection: QuestionCollection) => void;
  examPeriod?: 'ca-1' | 'ca-2' | null;
  onExamPeriodChange?: (period: 'ca-1' | 'ca-2' | null) => void;
  studyModeName: string;
  onSelectChapter: (chapter: ChapterData) => void;
  onBackToModeSelect: () => void;
  userButton?: React.ReactNode;
  breadcrumbPath?: FlowCrumb[];
}

const countQuestions = (chapter: ChapterData) =>
  chapter.subjects.reduce((total, subject) => total + subject.questions.length, 0);

const activeTopicCount = (chapter: ChapterData) => {
  const isPast = (chapter.bankSection ?? 'practice') === 'past-exams';
  if (!isPast) return chapter.subjects[0]?.lectureCount ?? 0;
  const sub = chapter.subjects[0];
  if (!sub) return 0;
  if (sub.lectureNames?.length) {
    const lecsWithQs = new Set(sub.questions.map(q => q.lecture));
    return lecsWithQs.size;
  }
  return sub.questions.length > 0 ? (sub.lectureCount ?? 1) : 0;
};

const icons: Partial<Record<SubjectColor, typeof BookOpen>> = {
  anatomy: Bone,
  physiology: Activity,
  histology: Microscope,
  biochem: FlaskConical,
  pathology: ShieldAlert,
  pharma: Pill,
  microbiology: Biohazard,
  parasitology: Bug,
  clinical: Stethoscope,
};

const panel =
  'border border-border dark:border-white/[0.06] bg-card dark:bg-white/[0.02] glass-panel rounded-[28px]';
const appear = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

/** The same glass surfaces, subject accents and spring interactions as the portal's chapter/topic screens. */
export function GitBankSelect({
  chapters,
  collection,
  onCollectionChange,
  examPeriod: propExamPeriod,
  onExamPeriodChange,
  studyModeName,
  onSelectChapter,
  onBackToModeSelect,
  userButton,
  breadcrumbPath,
}: Props) {
  const { language } = useLanguage();
  const ar = language === 'ar';

  const [localExamPeriod, setLocalExamPeriod] = useState<'ca-1' | 'ca-2' | null>(null);
  const currentExamPeriod = propExamPeriod !== undefined ? propExamPeriod : localExamPeriod;

  const setExamPeriod = (p: 'ca-1' | 'ca-2' | null) => {
    setLocalExamPeriod(p);
    onExamPeriodChange?.(p);
  };

  const pastCount = selectGitCollection(chapters, 'past-exams').reduce(
    (total, chapter) => total + countQuestions(chapter),
    0,
  );
  const effectiveCollection = collection === 'past-exams' && pastCount === 0 ? 'practice' : collection;
  const isPast = effectiveCollection === 'past-exams';

  const ca1Chapters = selectGitExamPeriod(visiblePracticeChapters(chapters), 'ca-1');
  const ca2Chapters = selectGitExamPeriod(visiblePracticeChapters(chapters), 'ca-2');
  const ca1Count = ca1Chapters.reduce((sum, ch) => sum + countQuestions(ch), 0);
  const ca2Count = ca2Chapters.reduce((sum, ch) => sum + countQuestions(ch), 0);

  const subjects = (isPast
    ? currentExamPeriod
      ? selectGitExamPeriod(visiblePracticeChapters(chapters), currentExamPeriod)
      : []
    : selectGitCollection(visiblePracticeChapters(chapters), 'practice')
  ).filter(ch => !isPast || countQuestions(ch) > 0);

  const total = subjects.reduce((sum, chapter) => sum + countQuestions(chapter), 0);
  const topicCount = subjects.reduce(
    (sum, chapter) => sum + (isPast ? activeTopicCount(chapter) : (chapter.subjects[0]?.lectureCount ?? 0)),
    0,
  );

  const bankLabel = ar ? 'بنك الأسئلة' : 'Question bank';
  const pastLabel = ar ? 'الامتحانات السابقة والأسئلة المستذكرة' : 'Past exams & recalls';
  const ca1Label = ar ? 'التقييم المستمر 1 (CA-1)' : 'Continuous 1 (CA-1)';
  const ca2Label = ar ? 'التقييم المستمر 2 (CA-2)' : 'Continuous 2 (CA-2)';
  const questionLabel = (n: number) =>
    ar ? `${n.toLocaleString()} سؤال` : `${n.toLocaleString()} ${n === 1 ? 'question' : 'questions'}`;

  const crumbs: FlowCrumb[] = [
    ...(breadcrumbPath ?? [
      { label: 'GIT & Liver', onClick: onBackToModeSelect },
      { label: studyModeName, onClick: onBackToModeSelect },
    ]),
    {
      label: bankLabel,
      ...(isPast
        ? {
            onClick: () => {
              setExamPeriod(null);
              onCollectionChange('practice');
            },
          }
        : {}),
    },
    ...(isPast
      ? [
          {
            label: pastLabel,
            ...(currentExamPeriod ? { onClick: () => setExamPeriod(null) } : {}),
          },
        ]
      : []),
    ...(isPast && currentExamPeriod
      ? [
          {
            label: currentExamPeriod === 'ca-1' ? ca1Label : ca2Label,
          },
        ]
      : []),
  ];

  const handleNavBack = () => {
    if (isPast && currentExamPeriod) {
      setExamPeriod(null);
    } else if (isPast) {
      onCollectionChange('practice');
    } else {
      onBackToModeSelect();
    }
  };

  const navBackAriaLabel = isPast
    ? currentExamPeriod
      ? ar
        ? 'رجوع إلى اختبارات التقييم المستمر'
        : 'Back to continuous exams'
      : ar
        ? 'رجوع إلى بنك الأسئلة'
        : 'Back to question bank'
    : ar
      ? 'رجوع إلى أنماط الدراسة'
      : 'Back to study modes';

  const headerTitle = isPast
    ? currentExamPeriod === 'ca-1'
      ? ca1Label
      : currentExamPeriod === 'ca-2'
        ? ca2Label
        : pastLabel
    : bankLabel;

  const headerSubtitle = isPast
    ? currentExamPeriod
      ? ar
        ? 'اختر المادة، ثم الفصل أو الموضوع.'
        : 'Choose a subject, then a chapter or topic.'
      : ar
        ? 'اختر اختبار التقييم المستمر للتدريب على أسئلته.'
        : 'Select an assessment exam to practice its questions.'
    : ar
      ? 'اختر المادة، ثم الفصل أو الموضوع.'
      : 'Choose a subject, then a chapter or topic.';

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground" dir={ar ? 'rtl' : 'ltr'}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[460px] w-[460px] rounded-full bg-gradient-to-br from-physiology/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[460px] w-[460px] rounded-full bg-gradient-to-tl from-anatomy/10 to-transparent blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.nav
          aria-label={ar ? 'مسار التنقل' : 'Breadcrumb'}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="sticky top-3 z-20 mb-8 flex items-center gap-3 rounded-2xl border border-border dark:border-white/[0.08] bg-card/85 px-3 py-2.5 glass-panel"
        >
          <button
            type="button"
            aria-label={navBackAriaLabel}
            onClick={handleNavBack}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/80 text-muted-foreground transition-all hover:text-foreground active:scale-95 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={16} className={ar ? 'rotate-180' : ''} />
          </button>
          <FlowBreadcrumbs crumbs={crumbs} rtl={ar} />
          <ShuffleSwitch />
          {userButton && <div className="shrink-0">{userButton}</div>}
        </motion.nav>

        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 26 }}
          className={`${panel} mb-8 p-6 sm:p-8`}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            GIT & Liver · {studyModeName}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-physiology via-anatomy to-pathology bg-clip-text text-transparent">
            {headerTitle}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{headerSubtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            {isPast && !currentExamPeriod ? (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5">
                  <GraduationCap size={14} className="text-biochem" />
                  2 {ar ? 'اختبارات تقييم مستمر' : 'continuous assessments'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 tabular-nums">
                  <Award size={14} className="text-physiology" />
                  {questionLabel(pastCount)}
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5">
                  <GraduationCap size={14} className="text-biochem" />
                  {subjects.length} {ar ? 'مواد' : 'subjects'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5">
                  <Layers size={14} className="text-clinical" />
                  {topicCount} {ar ? 'فصل / موضوع' : 'chapters / topics'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 tabular-nums">
                  <Award size={14} className="text-physiology" />
                  {questionLabel(total)}
                </span>
              </>
            )}
          </div>
        </motion.header>

        {/* Practice mode: Past Exams Banner */}
        {!isPast && pastCount > 0 && (
          <section className="mb-8" aria-label={pastLabel}>
            <motion.button
              type="button"
              disabled={pastCount === 0}
              onClick={() => onCollectionChange('past-exams')}
              whileHover={pastCount ? { scale: 1.01, y: -3 } : undefined}
              whileTap={pastCount ? { scale: 0.98 } : undefined}
              className={`${panel} group flex w-full items-center gap-5 bg-gradient-to-r from-biochem/5 to-secondary/30 p-6 sm:p-8 text-start transition-colors hover:border-biochem/40 focus-visible:outline-2 focus-visible:outline-biochem disabled:opacity-50`}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-biochem/20 bg-biochem/10">
                <GraduationCap size={28} className="text-biochem" />
              </span>
              <span className="flex-1">
                <span className="block text-xl font-semibold">{pastLabel}</span>
                <span className="mt-2 block text-sm text-muted-foreground">
                  {ar
                    ? 'امتحانات سابقة مقسمة لاختباري التقييم المستمر الأول والثاني (CA-1 و CA-2).'
                    : 'Separated into Continuous 1 (CA-1) and Continuous 2 (CA-2) past exam banks.'}
                </span>
                <span className="mt-3 block text-sm font-semibold tabular-nums text-biochem">
                  {questionLabel(pastCount)}
                </span>
              </span>
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-biochem text-white shadow-lg transition-transform group-hover:scale-110"
              >
                <ArrowRight size={20} className={ar ? 'rotate-180' : ''} />
              </span>
            </motion.button>
          </section>
        )}

        {/* Past exams mode: Continuous 1 vs Continuous 2 Cards */}
        {isPast && !currentExamPeriod && (
          <motion.section
            key="exam-selection"
            aria-label={ar ? 'اختبارات التقييم المستمر' : 'Continuous Assessment Exams'}
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.08 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8"
          >
            {/* Continuous 1 (CA-1) Card */}
            <motion.button
              type="button"
              variants={appear}
              whileHover={{ scale: 1.015, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExamPeriod('ca-1')}
              className={`${panel} group relative flex min-h-56 flex-col justify-between p-7 text-start transition-all hover:border-biochem/40 focus-visible:outline-2 focus-visible:outline-primary cursor-pointer`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-biochem/20 bg-biochem/10 text-biochem">
                    <GraduationCap size={24} />
                  </span>
                  <span className="rounded-full border border-biochem/30 bg-biochem/10 px-3 py-1 text-xs font-bold text-biochem tracking-wider uppercase">
                    CA-1
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">{ca1Label}</h2>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  {ar
                    ? 'أسئلة امتحانات التقييم المستمر الأول تشمل الجهاز الهضمي العلوي وتجويف الفم والمعدة والموضوعات الأولى.'
                    : 'Past exam questions for Assessment 1 covering upper GIT, oral cavity, stomach & earlier curriculum.'}
                </p>
              </div>

              <div className="mt-6 flex w-full items-center justify-between gap-3 border-t border-border/50 pt-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {ca1Chapters.length} {ar ? 'مواد' : 'subjects'}
                  </span>
                  <span>·</span>
                  <span className="font-semibold tabular-nums text-biochem">
                    {questionLabel(ca1Count)}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-biochem text-white shadow-lg transition-transform group-hover:scale-110"
                >
                  <ArrowRight size={18} className={ar ? 'rotate-180' : ''} />
                </span>
              </div>
            </motion.button>

            {/* Continuous 2 (CA-2) Card */}
            <motion.button
              type="button"
              variants={appear}
              whileHover={{ scale: 1.015, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExamPeriod('ca-2')}
              className={`${panel} group relative flex min-h-56 flex-col justify-between p-7 text-start transition-all hover:border-physiology/40 focus-visible:outline-2 focus-visible:outline-primary cursor-pointer`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-physiology/20 bg-physiology/10 text-physiology">
                    <Sparkles size={24} />
                  </span>
                  <span className="rounded-full border border-physiology/30 bg-physiology/10 px-3 py-1 text-xs font-bold text-physiology tracking-wider uppercase">
                    CA-2
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">{ca2Label}</h2>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  {ar
                    ? 'أسئلة امتحانات التقييم المستمر الثاني تشمل الكبد والقنوات المرارية والبنكرياس والجهاز الهضمي السفلي.'
                    : 'Past exam questions for Assessment 2 covering liver, biliary tree, pancreas, lower GIT & clinical topics.'}
                </p>
              </div>

              <div className="mt-6 flex w-full items-center justify-between gap-3 border-t border-border/50 pt-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {ca2Chapters.length} {ar ? 'مواد' : 'subjects'}
                  </span>
                  <span>·</span>
                  <span className="font-semibold tabular-nums text-physiology">
                    {questionLabel(ca2Count)}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-physiology text-white shadow-lg transition-transform group-hover:scale-110"
                >
                  <ArrowRight size={18} className={ar ? 'rotate-180' : ''} />
                </span>
              </div>
            </motion.button>
          </motion.section>
        )}

        {/* Subject cards: rendered for Practice mode OR inside a selected Continuous Exam */}
        {(!isPast || (isPast && currentExamPeriod)) && (
          <motion.section
            key={isPast ? `exam-${currentExamPeriod}` : 'practice-subjects'}
            aria-label={ar ? 'المواد' : 'Subjects'}
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.05 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {subjects.map((chapter) => {
              const color = subjectStyles[chapter.accentColor];
              const count = countQuestions(chapter);
              const subject = chapter.subjects[0];
              const Icon = icons[chapter.accentColor] ?? BookOpen;
              const displayName = subject?.name ?? chapter.title.replace(/^(?:CA-[12]|Past exams)\s*[—–-]\s*/, '');

              return (
                <motion.button
                  key={chapter.id}
                  type="button"
                  variants={appear}
                  disabled={count === 0}
                  whileHover={count ? { scale: 1.015, y: -4 } : undefined}
                  whileTap={count ? { scale: 0.98 } : undefined}
                  onClick={() => {
                    applySubjectTheme(chapter.accentColor);
                    onSelectChapter(chapter);
                  }}
                  className={`${panel} group relative flex min-h-52 flex-col items-start p-6 text-start transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                    count ? `${color.hoverBorder} cursor-pointer` : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl border ${color.borderOp15} bg-gradient-to-br ${color.gradientFrom} ${color.gradientTo}`}
                  >
                    <Icon size={23} className={color.text} />
                  </span>
                  <h2 className="text-lg font-semibold">{displayName}</h2>
                  <p className="mt-2 text-sm tabular-nums text-muted-foreground">{questionLabel(count)}</p>
                  <div className="mt-5 flex w-full items-center justify-between gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${color.bgOp10} ${color.text}`}>
                      {isPast ? activeTopicCount(chapter) : (subject?.lectureCount ?? 0)} {ar ? 'فصل / موضوع' : 'chapters / topics'}
                    </span>
                    <span
                      aria-hidden
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${color.bg} text-white shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <ArrowRight size={18} className={ar ? 'rotate-180' : ''} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.section>
        )}
      </div>
      <PortalFooter />
    </div>
  );
}
