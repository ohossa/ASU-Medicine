import { useState, useEffect } from 'react';
import { GraduationCap, ChevronRight, ChevronLeft, X, Lock, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    chooseAnotherModule: 'Choose Another Module'
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
    chooseAnotherModule: 'اختر وحدة أخرى'
  }
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 dark:bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Decorative corner */}
        <div className={`absolute top-0 ${isRTL ? 'left-0 bg-gradient-to-br' : 'right-0 bg-gradient-to-bl'} w-24 h-24 from-physiology/8 to-transparent rounded-bl-[80px] pointer-events-none`} />

        {/* Top Header Buttons */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          {comingSoonModule || step !== 'year' ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-xs font-bold text-gray-650 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 cursor-pointer"
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
            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800/60 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                  className="w-full py-3 px-6 bg-physiology text-white hover:bg-physiology-dark dark:hover:bg-physiology/90 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-98 shadow-md hover:shadow-lg cursor-pointer"
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

                <div className="flex flex-col gap-2.5">
                  {([1, 2, 3, 4, 5] as const).map((year) => (
                    <button
                      key={year}
                      onClick={() => handleSelectYear(year)}
                      className="group w-full py-4 px-5 bg-gray-50 hover:bg-physiology/8 dark:bg-white/5 dark:hover:bg-physiology/10 text-gray-900 dark:text-white rounded-2xl font-semibold transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-physiology/20 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-sm font-bold">{getYearLabel(year)}</span>
                      <ChevronRight size={16} className={`text-gray-400 group-hover:text-physiology transition-all duration-250 group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                    </button>
                  ))}
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

                <div className="flex flex-col gap-3">
                  {([1, 2] as const).map((sem) => (
                    <button
                      key={sem}
                      onClick={() => handleSelectSemester(sem)}
                      className="group w-full py-5 px-6 bg-gray-50 hover:bg-physiology/8 dark:bg-white/5 dark:hover:bg-physiology/10 text-gray-900 dark:text-white rounded-2xl font-semibold transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-physiology/20 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-base font-bold">{tLocal(`semester${sem}` as any)}</span>
                      <ChevronRight size={16} className={`text-gray-400 group-hover:text-physiology transition-all duration-250 group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                    </button>
                  ))}
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

                <div className="flex flex-col gap-3">
                  {(SYLLABUS_MODULES[selectedYear!]?.[selectedSemester!] || []).map((mod) => {
                    const active = isModuleActive(mod.code);
                    return (
                      <button
                        key={mod.code}
                        onClick={() => handleSelectModule(mod)}
                        className={`group w-full py-4 px-5 rounded-2xl border transition-all duration-250 hover:scale-[1.01] text-start flex flex-col justify-between gap-3 cursor-pointer ${
                          active
                            ? 'bg-white hover:bg-physiology/5 border-gray-150 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-physiology/10 hover:border-physiology/30'
                            : 'bg-gray-50/70 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800/40 hover:bg-gray-100/50 dark:hover:bg-gray-800/40'
                        }`}
                      >
                        <div className="w-full flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="block text-[11px] font-bold text-physiology uppercase tracking-widest">
                              {mod.code}
                            </span>
                            <h4 className="font-archivo font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">
                              {mod.name}
                            </h4>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            {active ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                                <CheckCircle size={10} />
                                {tLocal('readyToTrack')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-200/55 dark:bg-white/5 border border-transparent text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <Lock size={10} />
                                {tLocal('comingSoon')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="w-full flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                          <div className="flex gap-4">
                            <span>
                              {tLocal('creditPoints')}: <strong className="text-gray-700 dark:text-gray-300">{mod.cp}</strong>
                            </span>
                            <span>
                              {tLocal('marks')}: <strong className="text-gray-700 dark:text-gray-300">{mod.marks}</strong>
                            </span>
                          </div>

                          {active && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-physiology font-semibold group-hover:translate-x-1 transition-transform duration-200">
                              <ArrowRight size={14} className={isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''} />
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
      </div>
    </div>
  );
}
