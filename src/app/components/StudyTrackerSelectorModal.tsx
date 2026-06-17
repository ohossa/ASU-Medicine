import { useState, useEffect } from 'react';
import { GraduationCap, ChevronRight, ChevronLeft, X, Lock, CheckCircle, Info, ArrowRight, BookOpen, Layers, Award, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { SYLLABUS_MODULES, isModuleActive } from '../data';
import type { ModuleInfo } from '../data';

interface Props {
  onClose: () => void;
  onSelectModule: (module: ModuleInfo) => void;
}

type Step = 'year' | 'semester' | 'module';

const LOCAL_TRANSLATIONS = {
  en: {
    selectModuleTracker: 'Study Progress Tracker',
    chooseModuleDesc: 'Select an academic year, semester, and module to view or update your study tracker.',
    selectYear: 'Select Academic Year',
    selectSemester: 'Select Semester',
    selectModule: 'Select Module',
    back: 'Back',
    close: 'Close',
    comingSoon: 'Coming Soon',
    active: 'Active & Ready',
    readyToTrack: 'Ready to Track',
    integrationInProgress: 'Integration in Progress',
    dbPendingDesc: 'Our academic editors are currently formatting the question database for {moduleName} ({moduleCode}). You can start tracking once it is released in a future update!',
    semester1: 'Semester 1',
    semester2: 'Semester 2',
    year1: 'Year 1',
    year2: 'Year 2',
    year3: 'Year 3',
    year4: 'Year 4',
    year5: 'Year 5',
    creditPoints: 'Credit Points',
    marks: 'Marks',
    chooseAnotherModule: 'Choose Another Module',
    preClerkship: 'Pre-Clerkship',
    clerkship: 'Clerkship',
    firstHalf: 'First Half',
    secondHalf: 'Second Half',
    semestersCount: '2 Semesters',
    activeLabel: 'Active System'
  },
  ar: {
    selectModuleTracker: 'متابع التقدم الدراسي',
    chooseModuleDesc: 'اختر السنة الدراسية، الفصل الدراسي، والوحدة لعرض أو تحديث متابعك الدراسي.',
    selectYear: 'اختر السنة الدراسية',
    selectSemester: 'اختر الفصل الدراسي',
    selectModule: 'اختر الوحدة الدراسية',
    back: 'رجوع',
    close: 'إغلاق',
    comingSoon: 'قريباً',
    active: 'نشط وجاهز',
    readyToTrack: 'جاهز للمتابعة',
    integrationInProgress: 'جاري دمج البيانات',
    dbPendingDesc: 'يقوم المحررون الأكاديميون لدينا حاليًا بتنسيق قاعدة بيانات الأسئلة لـ {moduleName} ({moduleCode}). ستتمكن من البدء في متابعة تقدمك فور إصدارها في تحديث قادم!',
    semester1: 'الفصل الدراسي الأول',
    semester2: 'الفصل الدراسي الثاني',
    year1: 'السنة الأولى',
    year2: 'السنة الثانية',
    year3: 'السنة الثالثة',
    year4: 'السنة الرابعة',
    year5: 'السنة الخامسة',
    creditPoints: 'الساعات المعتمدة',
    marks: 'الدرجات',
    chooseAnotherModule: 'اختر وحدة أخرى',
    preClerkship: 'الأساسي',
    clerkship: 'الإكلينيكي',
    firstHalf: 'الفترة الأولى',
    secondHalf: 'الفترة الثانية',
    semestersCount: 'فصلان دراسيان',
    activeLabel: 'النظام النشط'
  }
};

const YEAR_METADATA: Record<number, { cp: number; active: boolean }> = {
  1: { cp: 27, active: false },
  2: { cp: 27, active: true },
  3: { cp: 30, active: false },
  4: { cp: 32, active: false },
  5: { cp: 32, active: false }
};

export function StudyTrackerSelectorModal({ onClose, onSelectModule }: Props) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [step, setStep] = useState<Step>('year');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [comingSoonModule, setComingSoonModule] = useState<ModuleInfo | null>(null);

  const tLocal = (key: keyof typeof LOCAL_TRANSLATIONS['en']): string => {
    return LOCAL_TRANSLATIONS[language]?.[key] || LOCAL_TRANSLATIONS['en'][key] || key;
  };

  const getYearLabel = (y: number) => {
    return tLocal(`year${y}` as any);
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    setStep('semester');
  };

  const handleSelectSemester = (sem: number) => {
    setSelectedSemester(sem);
    setStep('module');
  };

  const handleSelectModule = (mod: ModuleInfo) => {
    if (isModuleActive(mod.code)) {
      onSelectModule(mod);
    } else {
      setComingSoonModule(mod);
    }
  };

  const handleBack = () => {
    if (comingSoonModule) {
      setComingSoonModule(null);
    } else if (step === 'module') {
      setStep('semester');
      setSelectedSemester(null);
    } else if (step === 'semester') {
      setStep('year');
      setSelectedYear(null);
    }
  };

  // Close on Escape keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Animated Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/40 dark:bg-black/60 backdrop-blur-md"
      />

      {/* Animated Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] z-10"
      >
        {/* Decorative background radial glow */}
        <div className={`absolute top-0 ${isRTL ? 'left-0 bg-gradient-to-br' : 'right-0 bg-gradient-to-bl'} w-32 h-32 from-physiology/8 to-transparent rounded-bl-[80px] pointer-events-none`} />

        {/* Top Header Buttons */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          {comingSoonModule || step !== 'year' ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-xs font-bold text-gray-650 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 hover:border-gray-200 dark:hover:border-gray-700 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={14} className={isRTL ? 'rotate-180' : ''} />
              <span>{tLocal('back')}</span>
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center text-physiology">
              <GraduationCap size={20} />
            </div>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-850 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label={tLocal('close')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Inner Content */}
        <div className="flex-1 overflow-y-auto pr-1 pl-1 relative z-10">
          <AnimatePresence mode="wait">
            {comingSoonModule ? (
              <motion.div
                key="coming-soon"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-center py-6 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-physiology/10 flex items-center justify-center text-physiology mb-5">
                  <Info size={32} />
                </div>
                <h3 className="font-archivo text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                  {tLocal('integrationInProgress')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-sm mx-auto mb-8">
                  {tLocal('dbPendingDesc')
                    .replace('{moduleName}', comingSoonModule.name)
                    .replace('{moduleCode}', comingSoonModule.code)}
                </p>
                <button
                  onClick={handleBack}
                  className="w-full py-3 px-6 bg-physiology text-white hover:bg-physiology/90 dark:hover:bg-physiology/90 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-98 shadow-md hover:shadow-lg cursor-pointer"
                >
                  {tLocal('chooseAnotherModule')}
                </button>
              </motion.div>
            ) : step === 'year' ? (
              <motion.div
                key="year-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-archivo text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {tLocal('selectYear')}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                    {tLocal('chooseModuleDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([1, 2, 3, 4, 5] as const).map((year) => {
                    const isClinical = year >= 4;
                    const phaseLabel = isClinical ? tLocal('clerkship') : tLocal('preClerkship');
                    const metadata = YEAR_METADATA[year];
                    const activeText = metadata.active ? ` · ${tLocal('activeLabel')}` : '';
                    const descText = `${tLocal('semestersCount')} · ${metadata.cp} CP${activeText}`;
                    return (
                      <button
                        key={year}
                        onClick={() => handleSelectYear(year)}
                        className="group relative w-full overflow-hidden py-7 px-8 bg-white dark:bg-gradient-to-br dark:from-slate-900/60 dark:to-slate-950/80 border border-gray-150 dark:border-slate-800/80 hover:border-physiology/30 dark:hover:border-physiology/30 text-gray-900 dark:text-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-lg hover:shadow-physiology/4 dark:hover:shadow-physiology/8 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 text-left rtl:text-right cursor-pointer flex items-center justify-between"
                      >
                        <div className="min-w-0 z-10 flex flex-col items-start pr-2 rtl:pr-0 rtl:pl-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest leading-none mb-3 border ${
                            isClinical 
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' 
                              : 'bg-physiology/10 border-physiology/20 text-physiology'
                          }`}>
                            {phaseLabel}
                          </span>
                          <span className="block font-archivo text-xl font-extrabold tracking-tight">
                            {getYearLabel(year)}
                          </span>
                          <span className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mt-2 tracking-wide">
                            {descText}
                          </span>
                        </div>
                        <span className="font-archivo font-black text-6xl opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.10] text-gray-400 group-hover:text-physiology transition-all duration-300 select-none absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none">
                          {year}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-150 dark:border-white/[0.06] group-hover:border-physiology/20 group-hover:bg-physiology/10 flex items-center justify-center text-gray-400 group-hover:text-physiology transition-all duration-300 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0 relative z-10">
                          <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : step === 'semester' ? (
              <motion.div
                key="semester-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-archivo text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {tLocal('selectSemester')}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                    {getYearLabel(selectedYear!)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([1, 2] as const).map((sem) => {
                    const labelSem = sem === 1 ? tLocal('firstHalf') : tLocal('secondHalf');
                    return (
                      <button
                        key={sem}
                        onClick={() => handleSelectSemester(sem)}
                        className="group relative overflow-hidden p-6 bg-white dark:bg-gradient-to-br dark:from-slate-900/60 dark:to-slate-950/80 hover:bg-physiology/5 dark:hover:bg-physiology/8 border border-gray-150 dark:border-slate-800/80 hover:border-physiology/30 dark:hover:border-physiology/30 text-gray-900 dark:text-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 text-center flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[160px]"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-physiology/10 border border-physiology/20 flex items-center justify-center text-physiology group-hover:scale-110 group-hover:bg-physiology/15 transition-all duration-300 shrink-0">
                          {sem === 1 ? <BookOpen size={24} /> : <GraduationCap size={24} />}
                        </div>
                        <div>
                          <span className="block font-archivo text-lg font-extrabold tracking-tight">
                            {tLocal(`semester${sem}` as any)}
                          </span>
                          <span className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1.5 opacity-90">
                            {labelSem}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="module-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-archivo text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {tLocal('selectModule')}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                    {getYearLabel(selectedYear!)} · {tLocal(`semester${selectedSemester!}` as any)}
                  </p>
                </div>

                <div className="flex flex-col gap-3.5">
                  {(SYLLABUS_MODULES[selectedYear!]?.[selectedSemester!] || []).map((mod) => {
                    const active = isModuleActive(mod.code);
                    return (
                      <button
                        key={mod.code}
                        onClick={() => handleSelectModule(mod)}
                        className={`group relative overflow-hidden w-full p-6 rounded-[24px] border transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 text-start flex flex-col gap-4 cursor-pointer ${
                          active
                            ? 'bg-white dark:bg-gradient-to-br dark:from-slate-900/60 dark:to-slate-950/80 border-gray-150 dark:border-slate-800/85 hover:border-physiology/40 dark:hover:border-physiology/40 shadow-sm hover:shadow-md'
                            : 'bg-gray-50/60 dark:bg-white/[0.01] border-gray-100 dark:border-gray-800/40 opacity-70 dark:opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 w-full">
                          <div className="flex-1 min-w-0">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-physiology/10 border border-physiology/20 text-[10px] font-extrabold text-physiology uppercase tracking-widest leading-none">
                              {mod.code}
                            </span>
                            <h4 className="font-archivo font-extrabold text-lg text-gray-900 dark:text-white mt-2.5 leading-snug truncate">
                              {mod.name}
                            </h4>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            {active ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                                <CheckCircle size={11} />
                                {tLocal('readyToTrack')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-200/50 dark:bg-white/5 border border-transparent text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <Lock size={11} />
                                {tLocal('comingSoon')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 dark:border-gray-800/60 text-[11px] font-medium text-gray-400 dark:text-gray-500 w-full">
                          <div className="flex items-center gap-3.5">
                            <span className="inline-flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-gray-150/40 dark:border-white/[0.04]">
                              {tLocal('creditPoints')}: <strong className="text-gray-700 dark:text-gray-300 font-bold ms-0.5">{mod.cp}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-gray-150/40 dark:border-white/[0.04]">
                              {tLocal('marks')}: <strong className="text-gray-700 dark:text-gray-300 font-bold ms-0.5">{mod.marks}</strong>
                            </span>
                          </div>

                          {active && (
                            <span className="inline-flex items-center text-physiology group-hover:translate-x-1 transition-transform duration-300">
                              <ArrowRight size={16} className={isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''} />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
