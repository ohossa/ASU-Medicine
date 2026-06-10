import React, { useMemo } from 'react';
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
  Zap,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Clock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChapterData, SubjectData, SubjectColor } from '../types';
import { subjectStyles } from '../types';
import { shuffleArray } from '../data';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { getQuizHistory } from '../utils/storage';
import { useState, useEffect } from 'react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface Props {
  chapter: ChapterData;
  onBack: () => void;
  onSelectSubject: (subject: SubjectData, questions: ReturnType<typeof shuffleArray>) => void;
  onQuickStart: (questions: ReturnType<typeof shuffleArray>) => void;
  breadcrumbPath?: BreadcrumbItem[];
}

const iconMap: Record<string, LucideIcon> = {
  Activity,
  FlaskConical,
  Bone,
  Microscope,
  ShieldAlert,
  Pill,
  Stethoscope,
};

const totalQs = (subjects: SubjectData[]) =>
  subjects.reduce((a, s) => a + s.questions.length, 0);

export function SubjectSelect({ chapter, onBack, onSelectSubject, onQuickStart, breadcrumbPath }: Props) {
  const allQuestions = useMemo(() => chapter.subjects.flatMap((s) => s.questions), [chapter]);
  const totalQuestions = useMemo(() => totalQs(chapter.subjects), [chapter.subjects]);
  const { t, language } = useLanguage();
  
  const [history, setHistory] = useState(() => getQuizHistory());

  useEffect(() => {
    const handleStorage = () => setHistory(getQuizHistory());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 font-manrope relative overflow-hidden">
      {/* Dynamic Floating Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
        <div className="absolute top-[10%] left-[5%] h-[35vw] w-[35vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-physiology/6 to-transparent dark:from-physiology/4blob-float-1" />
        <div className="absolute bottom-[10%] right-[5%] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-anatomy/6 to-transparent dark:from-anatomy/4blob-float-2" />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 8%) scale(1.08); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-6%, -5%) scale(0.92); }
        }
        .blob-float-1 { animation: floatBlob1 25s ease-in-out infinite; }
        .blob-float-2 { animation: floatBlob2 30s ease-in-out infinite alternate; }

        @keyframes pulseRing {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .card-stagger { animation: fadeInUp 600ms cubic-bezier(0.34,1.56,0.64,1) both; }
        .card-stagger:nth-child(1) { animation-delay: 100ms; }
        .card-stagger:nth-child(2) { animation-delay: 160ms; }
        .card-stagger:nth-child(3) { animation-delay: 220ms; }
        .card-stagger:nth-child(4) { animation-delay: 280ms; }
        .card-stagger:nth-child(5) { animation-delay: 340ms; }
        .card-stagger:nth-child(6) { animation-delay: 400ms; }
        .card-stagger:nth-child(7) { animation-delay: 460ms; }
        
        .subject-card {
          transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .subject-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .subject-card:active { transform: translateY(-2px) scale(0.98); }
        .icon-float { transition: transform 350ms cubic-bezier(0.34,1.56,0.64,1); }
        .subject-card:hover .icon-float { transform: scale(1.15) rotate(-5deg); }
        .arrow-bounce { transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1); }
        .subject-card:hover .arrow-bounce { transform: translateX(4px); }
        .glow-ring { animation: pulseRing 3s ease-in-out infinite; }
        .blob-1 { animation: float 7s ease-in-out infinite; }
        .blob-2 { animation: float 9s ease-in-out infinite reverse; }
        .btn-back { transition: all 250ms cubic-bezier(0.34,1.56,0.64,1); }
        .btn-back:hover { transform: translateX(-3px); }
        .progress-line {
          background: linear-gradient(90deg, #10B981 0%, #06B6D4 50%, #3B82F6 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .header-anim { animation: slideInLeft 500ms ease-out both; }
        .header-anim-delay { animation: slideInLeft 500ms ease-out 100ms both; }
        .stats-anim { animation: fadeInUp 600ms ease-out 300ms both; }
      `}</style>

      {/* STICKY HEADER */}
      <header className="shrinking-header bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="btn-back inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-semibold border border-gray-100 dark:border-gray-700"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">{t('chaptersCount')}</span>
              </button>
              {/* Desktop Breadcrumbs (Full Path) */}
              <div className="header-anim hidden lg:flex items-center gap-2 text-sm">
                {breadcrumbPath ? (
                  breadcrumbPath.map((segment, idx) => {
                    const isLast = idx === breadcrumbPath.length - 1;
                    return (
                      <React.Fragment key={idx}>
                        {segment.onClick && !isLast ? (
                          <button
                            onClick={segment.onClick}
                            className="text-gray-400 dark:text-gray-500 font-medium hover:text-physiology transition-colors duration-200"
                          >
                            {segment.label}
                          </button>
                        ) : (
                          <span className={isLast ? "text-gray-900 dark:text-white font-bold" : "text-gray-400 dark:text-gray-500 font-medium"}>
                            {segment.label}
                          </span>
                        )}
                        {!isLast && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <>
                    <span className="text-gray-400 dark:text-gray-500 font-medium">{t('portal')}</span>
                    <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
                    <span className="text-gray-900 dark:text-white font-bold">{t('chapter')} {chapter.id}</span>
                  </>
                )}
              </div>

              {/* Tablet Breadcrumbs (Truncated) */}
              <div className="header-anim hidden md:flex lg:hidden items-center gap-2 text-sm">
                <span className="text-gray-400 dark:text-gray-500 font-medium">{t('portal')}</span>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
                <span className="text-gray-400 dark:text-gray-500 font-medium tracking-widest">...</span>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
                <span className="text-gray-900 dark:text-white font-bold">{t('chapter')} {chapter.id}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="stats-anim flex items-center gap-2 px-4 py-2 bg-physiology/5 border border-physiology/15 rounded-full">
                <span className="w-2 h-2 rounded-full bg-physiology" />
                <span className="text-xs font-bold text-physiology-dark">
                  {chapter.subjects.length} {t('availableSubjects')}
                </span>
              </div>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          <div className="h-0.5 -mx-6 lg:-mx-8">
            <div className="progress-line h-full w-full opacity-40 rounded-full" />
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">

        <div className="blob-1 absolute -top-16 right-20 w-56 h-56 rounded-full bg-gradient-to-br from-physiology/8 to-clinical/6 blur-3xl" />
        <div className="blob-2 absolute -bottom-20 left-10 w-48 h-48 rounded-full bg-gradient-to-br from-anatomy/8 to-histology/6 blur-3xl" />

        <div className="relative max-w-[1600px] mx-auto px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="header-anim inline-flex items-center gap-2.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-bold tracking-wide uppercase mb-5">
                <span className="text-lg">{chapter.emoji}</span>
                {t('chapter')} {chapter.id}
              </div>
              <h1 className="header-anim font-archivo text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-3">
                {chapter.title}
              </h1>
              <p className="header-anim-delay text-gray-400 dark:text-gray-500 text-base lg:text-lg font-medium max-w-md leading-relaxed">
                {chapter.subtitle} — {language === 'en' ? 'Select a subject to begin your assessment.' : 'اختر مادة لبدء التقييم.'}
              </p>
            </div>

            <div className="stats-anim flex items-center gap-5 lg:gap-8 bg-gray-50/80 dark:bg-gray-800/80 px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="font-archivo text-2xl font-black text-gray-900 dark:text-white">{chapter.subjects.length}</div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">{t('subjectsTab')}</div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
              <div className="text-center">
                <div className="font-archivo text-2xl font-black text-physiology">{totalQuestions}</div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">{t('questions')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECT CARDS */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-physiology to-anatomy" />
          <h2 className="font-archivo text-lg font-bold text-gray-900 dark:text-white tracking-tight">{t('chooseSubject')}</h2>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800 ml-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 text-start">
          {chapter.subjects.map((subject) => {
            const color = subject.id as SubjectColor;
            const s = subjectStyles[color];
            const Icon = iconMap[subject.iconName] ?? Activity;
            const hasQuestions = subject.questions.length > 0;
            
            const latestResult = history.find(r => r.chapterId === chapter.id && r.subjectName === subject.name);
            const isCompleted = !!latestResult;

            return (
              <div
                key={subject.id}
                className={`card-stagger scroll-reveal subject-card glass-panel glow-border rounded-[30px] p-6 cursor-pointer group relative overflow-hidden transition-all duration-300 ${
                  !hasQuestions ? 'opacity-60' : ''
                } ${isCompleted ? 'bg-physiology/5 border-physiology/30 hover:border-physiology/50 hover:bg-physiology/10' : ''}`}
                style={{ viewTransitionName: `subject-${subject.id}` }}
                onClick={() => hasQuestions && onSelectSubject(subject, subject.questions)}
              >
                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${s.bgOp5} group-hover:${s.bgOp10} transition-colors duration-500 pointer-events-none`} />
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full ${s.bgOp8} glow-ring`} />
                
                {isCompleted && (
                  <div className="absolute top-5 right-5 text-physiology bg-physiology/10 rounded-full p-1.5 border border-physiology/20 shadow-sm z-10 animate-fade-in">
                    <CheckCircle size={28} strokeWidth={2.5} className="drop-shadow-sm" />
                  </div>
                )}

                <div className="relative">
                  <div className={`icon-float w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradientFrom} ${s.gradientTo} flex items-center justify-center mb-4 ${s.borderOp10} border`}>
                    <Icon size={24} className={s.text} />
                  </div>

                  <h3 className={`font-archivo text-lg font-bold ${isCompleted ? 'text-physiology' : 'text-gray-900 dark:text-white'} group-hover:${s.text} transition-colors duration-300 tracking-tight mb-1 pr-8`}>
                    {subject.name}
                  </h3>

                  <div className={`flex items-center gap-2 px-3 py-2 ${s.bgOp5} rounded-xl mb-5 ${s.borderOp10} border`}>
                    <HelpCircle size={14} className={s.text} />
                    <span className={`text-xs font-bold ${s.textDark}`}>
                      {hasQuestions ? `${subject.questions.length} ${t('questions')}` : t('comingSoon')}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-800 mb-4" />

                  <div className="flex items-center justify-end relative h-5">
                    {/* Default Begin Text */}
                    {hasQuestions && !isCompleted && (
                      <div className={`absolute right-0 arrow-bounce flex items-center gap-1 text-xs font-bold ${s.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        {t('begin')}
                        <ArrowRight size={14} />
                      </div>
                    )}
                    
                    {/* Retake Text (if completed) */}
                    {hasQuestions && isCompleted && (
                      <div className={`absolute right-0 arrow-bounce flex items-center gap-1 text-xs font-bold text-physiology opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        Retake Subject
                        <ArrowRight size={14} />
                      </div>
                    )}
                  </div>
                  
                  {/* Floating Pop-up for Previous Results on Hover */}
                  {isCompleted && latestResult && (
                    <div className="absolute top-full left-0 right-0 mt-4 opacity-0 group-hover:opacity-100 group-hover:-translate-y-20 transition-all duration-300 pointer-events-none z-20">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-100 dark:border-gray-700 mx-auto w-[90%]">
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Latest Exam Result</div>
                        <div className="flex items-center justify-between">
                          <div className={`font-black ${latestResult.pct >= 75 ? 'text-physiology' : latestResult.pct >= 50 ? 'text-biochem' : 'text-pathology'}`}>
                            {latestResult.pct}%
                          </div>
                          <div className="text-xs font-bold text-gray-600 dark:text-gray-300">
                            {latestResult.correct}/{latestResult.total}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Clock size={10} />
                            {Math.floor(latestResult.elapsedSeconds / 60)}m
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK START BANNER */}
        <div
          className="mt-10 glass-panel scroll-reveal rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-start glow-border"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center">
              <Zap size={20} className="text-white dark:text-gray-900" />
            </div>
            <div>
              <h3 className="font-archivo text-base font-bold text-gray-900 dark:text-white tracking-tight">{t('quickStartAllSubjectsBanner')}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                {t('quickStartAllSubjectsDescBanner')}
              </p>
            </div>
          </div>
          <button
            disabled={totalQuestions === 0}
            onClick={() => onQuickStart(allQuestions)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 text-white dark:text-gray-900 rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:scale-[0.97] active:scale-95"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
          >
            {t('startAll')}
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-10 pb-8 text-center space-y-1.5 border-t border-gray-100 dark:border-gray-800/80 pt-6">
          <p className="text-xs text-gray-450 dark:text-gray-500 font-semibold tracking-wider uppercase">
            {t('asu')} • {t('portalTitle')}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium max-w-xl mx-auto px-6 leading-relaxed">
            {t('developedForStudents')}{' '}
            <a href="mailto:omarhmaged@gmail.com" className="hover:text-physiology dark:hover:text-white transition-colors underline font-semibold">
              omarhmaged@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
