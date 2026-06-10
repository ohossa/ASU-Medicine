import { useState, useEffect } from 'react';
import { Check, Edit3, X, Save, AlertCircle, Calendar } from 'lucide-react';
import type { ChapterData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { triggerCloudSync } from '../hooks/useCloudSync';

interface Props {
  moduleCode: string;
  moduleName: string;
  chapters: ChapterData[];
  onClose: () => void;
}

interface ChapterState {
  studied: boolean;
  revised: boolean;
  mcq: boolean;
  essay: boolean;
  notes: string;
}

export function SyllabusTracker({ moduleCode, moduleName, chapters, onClose }: Props) {
  const { t, language } = useLanguage();
  const storageKey = `asu_study_tracker_${moduleCode}`;
  
  const [trackerData, setTrackerData] = useState<Record<number, ChapterState>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    
    // Default fallback initial state
    const initial: Record<number, ChapterState> = {};
    chapters.forEach((ch) => {
      initial[ch.id] = {
        studied: false,
        revised: false,
        mcq: false,
        essay: false,
        notes: '',
      };
    });
    return initial;
  });

  const [saveToast, setSaveToast] = useState(false);

  // Listen for cloud sync pulling new data into localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setTrackerData(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  const handleCheckboxChange = (chapterId: number, field: keyof Omit<ChapterState, 'notes'>) => {
    setTrackerData((prev) => {
      const updatedChapter = {
        ...prev[chapterId],
        [field]: !prev[chapterId]?.[field],
      };
      const newState = {
        ...prev,
        [chapterId]: updatedChapter,
      };
      localStorage.setItem(storageKey, JSON.stringify(newState));
      triggerCloudSync();
      return newState;
    });
    showSaveIndicator();
  };

  const handleNotesChange = (chapterId: number, value: string) => {
    setTrackerData((prev) => {
      const updatedChapter = {
        ...prev[chapterId],
        notes: value,
      };
      const newState = {
        ...prev,
        [chapterId]: updatedChapter,
      };
      localStorage.setItem(storageKey, JSON.stringify(newState));
      triggerCloudSync();
      return newState;
    });
  };

  const showSaveIndicator = () => {
    setSaveToast(true);
    const timer = setTimeout(() => setSaveToast(false), 1500);
    return () => clearTimeout(timer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-950/60 backdrop-blur-md transition-all duration-300 animate-fade-in text-start">
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideInUp 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        
        .tracker-checkbox {
          transition: all 200ms ease;
        }
        .tracker-checkbox:hover {
          transform: scale(1.05);
        }
        .tracker-checkbox:active {
          transform: scale(0.95);
        }
      `}</style>

      <div className="w-full max-w-4xl glass-panel glow-border rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up relative">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-physiology/10 text-physiology-dark flex items-center justify-center">
              <Calendar size={22} />
            </div>
            <div>
              <h3 className="font-archivo text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('syllabusTracker')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                {moduleCode} • {moduleName}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {chapters.map((ch) => {
            const state = trackerData[ch.id] || { studied: false, revised: false, mcq: false, essay: false, notes: '' };
            
            return (
              <div 
                key={ch.id} 
                className="bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-[20px] p-5 sm:p-6 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Chapter title and badge */}
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-2xl flex-shrink-0 bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-gray-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                      {ch.emoji}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-0.5">
                        {t('chapter')} {ch.id}
                      </span>
                      <h4 className="font-archivo text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug tracking-tight">
                        {ch.title}
                      </h4>
                    </div>
                  </div>

                  {/* 4 Checklist boxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { field: 'studied', label: t('studied'), color: 'bg-physiology border-physiology text-white', inactive: 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700' },
                      { field: 'revised', label: t('revised'), color: 'bg-biochem border-biochem text-white', inactive: 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700' },
                      { field: 'mcq', label: t('mcqDone') || 'MCQ', color: 'bg-anatomy border-anatomy text-white', inactive: 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700' },
                      { field: 'essay', label: t('essayDone') || 'Essay', color: 'bg-histology border-histology text-white', inactive: 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700' },
                    ].map((box) => {
                      const isActive = state[box.field as keyof Omit<ChapterState, 'notes'>];
                      return (
                        <button
                          key={box.field}
                          onClick={() => handleCheckboxChange(ch.id, box.field as keyof Omit<ChapterState, 'notes'>)}
                          className={`tracker-checkbox px-3.5 py-2.5 rounded-full border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                            isActive ? box.color : box.inactive
                          }`}
                        >
                          {isActive && <Check size={12} strokeWidth={3} />}
                          <span>{box.label}</span>
                        </button>
                      );
                    })}
                  </div>

                </div>

                {/* Personal Notes Box */}
                <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800/60 flex items-start gap-3">
                  <div className="mt-2 text-gray-400 dark:text-gray-500 shrink-0">
                    <Edit3 size={16} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-2">
                      {t('personalNotes')}
                    </span>
                    <input
                      type="text"
                      value={state.notes}
                      onChange={(e) => handleNotesChange(ch.id, e.target.value)}
                      placeholder={t('notesPlaceholder') || 'Type your notes here...'}
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 focus:border-physiology rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-physiology/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-950/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full text-xs font-bold tracking-wide transition-all active:scale-[0.98] glow-border"
          >
            {t('close')}
          </button>
        </div>

        {/* Save toast */}
        {saveToast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all">
            <Check size={12} className="text-success" strokeWidth={3} />
            {t('saveSuccess')}
          </div>
        )}

      </div>
    </div>
  );
}
