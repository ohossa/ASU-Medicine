import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Activity, AlertCircle, ArrowRight, RotateCcw, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getQuizHistory } from '../utils/storage';
import type { QuizResult } from '../utils/storage';

interface HistoryScreenProps {
  onBack: () => void;
  onSelectHistory: (result: QuizResult) => void;
  userButton?: React.ReactNode;
}

const isSameDay = (d1: Date, d2: Date) => 
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getRelativeDayName = (date: Date, lang: string) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) return lang === 'en' ? 'Today' : 'اليوم';
  if (isSameDay(date, yesterday)) return lang === 'en' ? 'Yesterday' : 'أمس';
  
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { weekday: 'long', month: 'short', day: 'numeric' });
};

export function HistoryScreen({ onBack, onSelectHistory, userButton }: HistoryScreenProps) {
  const { language, t } = useLanguage();
  const [history, setHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    const fetchHistory = () => {
      const h = getQuizHistory().filter(r => r && typeof r === 'object').reverse();
      setHistory(h);
    };
    fetchHistory();
    window.addEventListener('storage', fetchHistory);
    return () => window.removeEventListener('storage', fetchHistory);
  }, []);

  // Group history by relative day
  const groupedHistory = history.reduce((groups, item) => {
    const d = new Date(item.date || item.timestamp || Date.now());
    if (isNaN(d.getTime())) return groups; // skip invalid dates
    const dayName = getRelativeDayName(d, language);
    if (!groups[dayName]) groups[dayName] = [];
    groups[dayName].push(item);
    return groups;
  }, {} as Record<string, QuizResult[]>);

  return (
    <div className="min-h-screen font-manrope">
      {/* HEADER */}
      <header className="shrinking-header bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="btn-back inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-semibold border border-gray-100 dark:border-gray-700"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">{t('back')}</span>
              </button>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 dark:text-gray-500 font-medium">{t('portal')}</span>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
                <span className="text-gray-900 dark:text-white font-bold">History</span>
              </div>
            </div>
            {userButton}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto py-10 px-6 lg:px-8 animate-fade-in">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-physiology/10 text-physiology mb-5 border border-physiology/20 shadow-sm">
            <Activity size={32} />
          </div>
          <h2 className="font-archivo text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Activity History' : 'سجل النشاط'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            {language === 'en' ? 'Review your past performance, analyze your mistakes, and instantly retake exams to track your improvement.' : 'راجع أدائك السابق، وحلل أخطائك، وأعد الاختبارات على الفور لتتبع تحسنك.'}
          </p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-900/50 rounded-[40px] border border-gray-100 dark:border-gray-800/80 shadow-sm glass-panel max-w-3xl mx-auto">
            <Calendar size={64} className="mx-auto text-gray-200 dark:text-gray-700 mb-6" />
            <h3 className="font-archivo text-2xl font-black text-gray-800 dark:text-gray-200">
              {language === 'en' ? 'No history yet' : 'لا يوجد سجل بعد'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium">
              {language === 'en' ? 'Once you complete your first exam, your results will be saved here.' : 'بمجرد إكمال اختبارك الأول، سيتم حفظ نتائجك هنا.'}
            </p>
            <button
              onClick={onBack}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-physiology text-white font-bold hover:bg-physiology-dark transition-colors shadow-lg shadow-physiology/20"
            >
              Start Studying <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-12 pb-20">
            {Object.entries(groupedHistory).map(([day, items]) => (
              <div key={day} className="space-y-5">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{day}</h3>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {items.map((r, i) => {
                    const pct = r.pct || 0;
                    const correct = r.correct || 0;
                    const total = r.total || 0;
                    const elapsed = r.elapsedSeconds || 0;
                    const dateObj = new Date(r.date || r.timestamp || Date.now());
                    const timeStr = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-EG', { hour: 'numeric', minute: '2-digit' });

                    const colorTheme = pct >= 80 ? 'physiology' : pct >= 50 ? 'biochem' : 'pathology';
                    const colorClasses = {
                      physiology: 'from-physiology/20 to-physiology/5 text-physiology-dark dark:text-physiology border-physiology/30',
                      biochem: 'from-biochem/20 to-biochem/5 text-biochem-dark dark:text-biochem border-biochem/30',
                      pathology: 'from-pathology/20 to-pathology/5 text-pathology-dark dark:text-pathology border-pathology/30'
                    };

                    return (
                      <div
                        key={r.id || `hist-${day}-${i}`}
                        className="bg-white dark:bg-gray-900 rounded-[30px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-physiology/30 transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                                  {r.subjectName || 'All Subjects'}
                                </span>
                                {r.flaggedQuestionIds && r.flaggedQuestionIds.length > 0 && (
                                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-clinical/10 text-clinical text-xs font-bold border border-clinical/20">
                                    <AlertCircle size={12} /> {r.flaggedQuestionIds.length} Flagged
                                  </span>
                                )}
                              </div>
                              <h4 className="font-archivo text-xl font-bold text-gray-900 dark:text-white leading-tight pr-4 group-hover:text-physiology transition-colors">
                                {r.chapterTitle || `Chapter ${r.chapterId || 'Unknown'}`}
                              </h4>
                            </div>

                            <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-archivo font-black text-2xl border shadow-inner bg-gradient-to-br ${colorClasses[colorTheme]}`}>
                              {pct}%
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 size={16} />
                              <span className="font-bold text-gray-700 dark:text-gray-300">{correct}</span> / {total} correct
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={16} />
                              <span className="font-bold text-gray-700 dark:text-gray-300">{Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</span> time
                            </div>
                            <div className="flex items-center gap-1.5 opacity-70">
                              {timeStr}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <button
                            onClick={() => onSelectHistory(r)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-physiology/10 text-gray-700 dark:text-gray-300 hover:text-physiology font-bold transition-colors border border-gray-200 dark:border-gray-700 hover:border-physiology/30"
                          >
                            <Activity size={18} />
                            View Results
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
