import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Trash2, Flag, Check, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getFlaggedQuestions, removeFlaggedQuestion } from '../utils/storage';
import { findQuestionById } from '../data';
import type { Question, ChapterData } from '../types';

interface FlaggedQuestionsScreenProps {
  onBack: () => void;
  onPracticeQuiz: (chapter: ChapterData, subjectName: string, questions: Question[]) => void;
  userButton?: React.ReactNode;
}

interface FlaggedItem {
  id: number;
  question: Question;
  chapter: ChapterData;
  moduleCode: string;
  subjectName: string;
}

export function FlaggedQuestionsScreen({ onBack, onPracticeQuiz, userButton }: FlaggedQuestionsScreenProps) {
  const { language, t } = useLanguage();
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<number, number>>({});

  const loadFlaggedQuestions = () => {
    const ids = getFlaggedQuestions();
    const items: FlaggedItem[] = [];
    ids.forEach((id) => {
      const found = findQuestionById(id);
      if (found) {
        items.push({
          id,
          question: found.question,
          chapter: found.chapter,
          moduleCode: found.moduleCode,
          subjectName: found.subjectName,
        });
      }
    });
    setFlaggedItems(items);
  };

  useEffect(() => {
    loadFlaggedQuestions();
    window.addEventListener('storage', loadFlaggedQuestions);
    return () => window.removeEventListener('storage', loadFlaggedQuestions);
  }, []);

  const handleUnflag = (id: number) => {
    removeFlaggedQuestion(id);
    setFlaggedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleRevealAnswer = (id: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectMcq = (questionId: number, optionIdx: number) => {
    setSelectedMcqAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'MCQ';
      case 'truefalse': return language === 'en' ? 'True / False' : 'صح / خطأ';
      case 'essay': return language === 'en' ? 'Written Essay' : 'سؤال مقالي';
      case 'matching': return language === 'en' ? 'Matching' : 'توصيل';
      case 'fillblank': return language === 'en' ? 'Fill in the Blank' : 'إكمال الفراغ';
      case 'case': return language === 'en' ? 'Clinical Case' : 'حالة سريرية';
      default: return type.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 font-manrope">
      {/* HEADER */}
      <header className="shrinking-header bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between gap-y-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="btn-back inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-semibold border border-gray-100 dark:border-gray-700 transition-all"
            >
              <ArrowLeft size={16} />
              <span>{t('back')}</span>
            </button>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 dark:text-gray-500 font-medium">{t('portal')}</span>
              <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
              <span className="text-gray-900 dark:text-white font-bold">Flagged Questions</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userButton}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-[1000px] mx-auto py-10 px-6 animate-fade-in">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-clinical/10 text-clinical mb-5 border border-clinical/20 shadow-sm">
            <Flag size={32} />
          </div>
          <h2 className="font-archivo text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Flagged Questions' : 'الأسئلة المميزة'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            {language === 'en' 
              ? 'Review questions you flagged during study sessions. Practice them dynamically or view explanations.' 
              : 'راجع الأسئلة التي قمت بتمييزها أثناء المذاكرة. تدرب عليها بشكل تفاعلي أو اطلع على الإجابات النموذجية.'}
          </p>
        </div>

        {flaggedItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900/50 rounded-[40px] border border-gray-100 dark:border-gray-800/80 shadow-sm glass-panel max-w-2xl mx-auto">
            <AlertCircle size={64} className="mx-auto text-gray-200 dark:text-gray-700 mb-6 animate-pulse" />
            <h3 className="font-archivo text-2xl font-black text-gray-800 dark:text-gray-200">
              {language === 'en' ? 'No flagged questions' : 'لا توجد أسئلة مميزة'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium px-6">
              {language === 'en' 
                ? 'Flag questions during quizzes and custom exams, and they will be synced here automatically.' 
                : 'قم بتمييز الأسئلة أثناء الاختبارات والامتحانات المخصصة، وسيتم مزامنتها هنا تلقائياً.'}
            </p>
            <button
              onClick={onBack}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-clinical text-white font-bold hover:bg-clinical-dark transition-colors shadow-lg shadow-clinical/20"
            >
              Go to Dashboard <ArrowLeft className="rotate-180" size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {flaggedItems.map((item) => {
              const q = item.question;
              const isRevealed = revealedAnswers[item.id] || false;
              const selectedOpt = selectedMcqAnswers[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 rounded-[30px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-clinical" />
                  
                  {/* Topic Metadata & Type Badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {item.moduleCode}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-clinical/10 text-clinical text-xs font-bold border border-clinical/20">
                        {item.subjectName}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold truncate max-w-[200px] sm:max-w-none">
                        {item.chapter.title}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-650 dark:text-gray-400">
                      {getQuestionTypeLabel(q.type)}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="text-gray-900 dark:text-gray-100 font-medium text-base mb-6 leading-relaxed whitespace-pre-wrap">
                    {q.text}
                  </div>

                  {/* MCQ / TrueFalse Options Rendering */}
                  {(q.type === 'mcq' || q.type === 'truefalse') && q.options && (
                    <div className="grid grid-cols-1 gap-2.5 mb-6">
                      {q.options.map((option, idx) => {
                        const isCorrect = idx === q.correctIndex;
                        const isSelected = selectedOpt === idx;
                        
                        let optionStyle = 'border-gray-100 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-800 dark:text-gray-250';
                        if (isSelected) {
                          optionStyle = isCorrect
                            ? 'bg-physiology/10 border-physiology text-physiology-dark dark:text-physiology'
                            : 'bg-pathology/10 border-pathology text-pathology-dark dark:text-pathology';
                        } else if (isRevealed && isCorrect) {
                          optionStyle = 'bg-physiology/10 border-physiology text-physiology-dark dark:text-physiology';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectMcq(item.id, idx)}
                            className={`w-full text-left p-4 rounded-2xl border font-semibold text-sm transition-all duration-200 flex items-center justify-between gap-3 ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {isSelected && (
                              isCorrect ? <Check size={18} className="text-physiology shrink-0" /> : <X size={18} className="text-pathology shrink-0" />
                            )}
                            {!isSelected && isRevealed && isCorrect && (
                              <Check size={18} className="text-physiology shrink-0 animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Matching/Fill Blank Summary or Subquestions */}
                  {isRevealed && (
                    <div className="bg-gray-50/50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-4 mb-6 text-sm space-y-4 animate-fade-in">
                      {/* Model Answer (if Essay) */}
                      {q.type === 'essay' && q.modelAnswer && (
                        <div>
                          <div className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Model Answer</div>
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{q.modelAnswer}</p>
                        </div>
                      )}

                      {/* Matching Solution */}
                      {q.type === 'matching' && q.pairs && (
                        <div>
                          <div className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Matches</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.pairs.map((pair, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2.5 bg-white dark:bg-gray-900 border border-gray-105 dark:border-gray-800 rounded-xl">
                                <span className="font-bold text-clinical">{pair.source}</span>
                                <ChevronRight size={12} className="text-gray-300" />
                                <span className="font-bold text-physiology">{pair.target}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fill in Blank Solution */}
                      {q.type === 'fillblank' && q.blanks && (
                        <div>
                          <div className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Accepted Answers</div>
                          <div className="flex flex-wrap gap-2">
                            {q.blanks.map((blank, idx) => (
                              <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-lg text-xs font-bold">
                                {idx + 1}. <span className="text-physiology">{blank}</span>
                                {q.acceptedAnswers?.[idx] && ` (or ${q.acceptedAnswers[idx].join(', ')})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Case Study text and Subquestions */}
                      {q.type === 'case' && (
                        <div className="space-y-4">
                          {q.caseStudyText && (
                            <div>
                              <div className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Case Study</div>
                              <p className="text-gray-800 dark:text-gray-250 italic leading-relaxed">{q.caseStudyText}</p>
                            </div>
                          )}
                          {q.subQuestions && (
                            <div className="space-y-3">
                              <div className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b pb-1">Sub-questions</div>
                              {q.subQuestions.map((sq, sqIdx) => (
                                <div key={sq.id} className="space-y-1.5 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
                                  <div className="font-semibold text-gray-900 dark:text-white">{sqIdx + 1}. {sq.text}</div>
                                  {sq.type === 'mcq' && sq.options && sq.correctIndex !== undefined && (
                                    <div className="text-xs text-physiology font-bold flex items-center gap-1">
                                      <Check size={14} /> Correct Option: {sq.options[sq.correctIndex]}
                                    </div>
                                  )}
                                  {sq.type === 'essay' && sq.modelAnswer && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      <span className="font-bold">Model Answer: </span> {sq.modelAnswer}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Key Concept / Explanation */}
                      {(q.keyConcept || q.explanation) && (
                        <div className="border-t pt-4 space-y-3">
                          {q.keyConcept && (
                            <div>
                              <div className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Key Concept</div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{q.keyConcept}</p>
                            </div>
                          )}
                          {q.explanation && (
                            <div>
                              <div className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Explanation</div>
                              <p className="text-gray-650 dark:text-gray-400 leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Action footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/80 mt-auto">
                    {/* Reveal Answer Toggle */}
                    <button
                      onClick={() => toggleRevealAnswer(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold transition-colors border border-gray-200/50 dark:border-gray-700"
                    >
                      {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
                      {isRevealed 
                        ? (language === 'en' ? 'Hide Solution' : 'إخفاء الحل') 
                        : (language === 'en' ? 'Reveal Solution' : 'عرض الحل')}
                    </button>

                    {/* Practice Quiz */}
                    <button
                      onClick={() => onPracticeQuiz(item.chapter, item.subjectName, [q])}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-clinical/10 hover:bg-clinical text-clinical hover:text-white font-bold transition-all border border-clinical/20 hover:border-transparent"
                    >
                      {language === 'en' ? 'Practice Question' : 'تدرب على السؤال'}
                    </button>

                    {/* Unflag Button */}
                    <button
                      onClick={() => handleUnflag(item.id)}
                      title="Unflag"
                      className="flex-shrink-0 p-3 rounded-xl border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-pathology/5 hover:border-pathology/20 hover:text-pathology text-gray-400 dark:text-gray-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
