import React from 'react';
import { ArrowLeft, ArrowRight, Clock, Activity, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getQuizHistory } from '../utils/storage';
import type { QuizResult } from '../utils/storage';
import { useState, useEffect } from 'react';

interface HistoryScreenProps {
  onBack: () => void;
  onSelectHistory: (result: QuizResult) => void;
}

export function HistoryScreen({ onBack, onSelectHistory }: HistoryScreenProps) {
  const { language } = useLanguage();
  const [history, setHistory] = useState(() => getQuizHistory().filter(r => r && typeof r === 'object').reverse());

  useEffect(() => {
    const handleStorage = () => {
      setHistory(getQuizHistory().filter(r => r && typeof r === 'object').reverse());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-physiology hover:border-physiology/30 transition-colors shadow-sm group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:translate-x-1" />
        </button>
        <div>
          <h2 className="font-archivo text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="text-physiology" />
            {language === 'en' ? 'Activity History' : 'سجل النشاط'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            {language === 'en' ? 'Review your past quiz sessions and performance' : 'راجع جلسات الاختبار السابقة وأدائك'}
          </p>
        </div>
      </div>

      {/* List */}
      {history.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
          <Clock size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h3 className="font-archivo text-xl font-bold text-gray-500 dark:text-gray-400">
            {language === 'en' ? 'No history yet' : 'لا يوجد سجل بعد'}
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {language === 'en' ? 'Complete a quiz to see your history here.' : 'أكمل اختبارًا لرؤية سجلك هنا.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((r, i) => {
            const pct = r.pct || 0;
            const correct = r.correct || 0;
            const total = r.total || 0;
            const elapsed = r.elapsedSeconds || 0;
            const dateStr = new Date(r.date || r.timestamp || Date.now()).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

            return (
            <button
              key={r.id || `hist-${i}`}
              onClick={() => onSelectHistory(r)}
              className="w-full text-left bg-white dark:bg-gray-900 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-100 dark:border-gray-800 hover:border-physiology/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-5">
                {/* Score badge */}
                <div className={`min-w-[70px] h-[50px] rounded-xl flex flex-col items-center justify-center font-archivo font-black border shadow-sm ${
                  pct >= 80 
                    ? 'bg-gradient-to-br from-physiology/10 to-physiology/5 text-physiology-dark border-physiology/20 dark:text-physiology' 
                    : pct >= 50
                      ? 'bg-gradient-to-br from-biochem/10 to-biochem/5 text-biochem-dark border-biochem/20 dark:text-biochem'
                      : 'bg-gradient-to-br from-pathology/10 to-pathology/5 text-pathology-dark border-pathology/20 dark:text-pathology'
                }`}>
                  <span className="text-lg leading-none">{pct}%</span>
                </div>
                
                {/* Info */}
                <div>
                  <h3 className="font-archivo text-lg font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-physiology transition-colors">
                    {r.chapterTitle || `Chapter ${r.chapterId || 'Unknown'}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-semibold text-gray-500">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                      {r.subjectName || 'All Subjects'}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Clock size={12} /> {dateStr}
                    </span>
                    {r.flaggedQuestionIds && r.flaggedQuestionIds.length > 0 && (
                      <span className="flex items-center gap-1 text-clinical whitespace-nowrap">
                        <AlertCircle size={12} /> {r.flaggedQuestionIds.length} Flagged
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right side stats */}
              <div className="flex items-center justify-between w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="text-center px-4 md:border-r border-gray-100 dark:border-gray-800">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Questions</div>
                    <div className="text-sm font-black text-gray-700 dark:text-gray-300">{correct}/{total}</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Time</div>
                    <div className="text-sm font-black text-gray-700 dark:text-gray-300">
                      {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 items-center justify-center group-hover:bg-physiology/10 group-hover:text-physiology transition-colors ml-4">
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </div>
              </div>
            </button>
          )})}
        </div>
      )}
    </div>
  );
}
