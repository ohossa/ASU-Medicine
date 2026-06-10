import { useState, useEffect } from 'react';
import type { Screen, ChapterData, SubjectData, Question } from '../types';
import { getChaptersForModuleAndMode, SYLLABUS_MODULES, isModuleActive } from '../data';
import type { ModuleInfo } from '../data';
import { saveQuizResult } from '../utils/storage';
import type { QuizResult } from '../utils/storage';

interface QuizPayload {
  chapter: ChapterData;
  subject: SubjectData | null;
  questions: Question[];
}

interface ResultPayload {
  chapter: ChapterData;
  subject: SubjectData | null;
  questions: Question[];
  answers: Record<number, any>;
  elapsedSeconds: number;
  flaggedQuestions: Set<number>;
}

export function useNavigationState(t: (key: string) => string, language: string) {
  // Student Year tracking
  const [studentYear, setStudentYear] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('asu_medical_student_year');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  // Listen for storage changes from cloud sync
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('asu_medical_student_year');
        if (saved) {
          setStudentYear(parseInt(saved, 10));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Navigation states
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const saved = localStorage.getItem('asu_portal_screen');
      if (saved) {
        if (saved === 'quiz' || saved === 'results') return 'chapters';
        return saved as Screen;
      }
      return 'yearSelect';
    } catch { return 'yearSelect'; }
  });
  const [selectedYear, setSelectedYear] = useState<number | null>(() => {
    try { const saved = localStorage.getItem('asu_portal_year'); return saved ? Number(saved) : null; } catch { return null; }
  });
  const [selectedSemester, setSelectedSemester] = useState<number | null>(() => {
    try { const saved = localStorage.getItem('asu_portal_semester'); return saved ? Number(saved) : null; } catch { return null; }
  });
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(() => {
    try { const saved = localStorage.getItem('asu_portal_module'); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [studyMode, setStudyMode] = useState<'mcq' | 'essay' | 'mixed' | null>(() => {
    try { const saved = localStorage.getItem('asu_portal_studyMode'); return saved as any || null; } catch { return null; }
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('asu_portal_screen', screen);
    if (selectedYear) localStorage.setItem('asu_portal_year', selectedYear.toString());
    else localStorage.removeItem('asu_portal_year');
    if (selectedSemester) localStorage.setItem('asu_portal_semester', selectedSemester.toString());
    else localStorage.removeItem('asu_portal_semester');
    if (selectedModule) localStorage.setItem('asu_portal_module', JSON.stringify(selectedModule));
    else localStorage.removeItem('asu_portal_module');
    if (studyMode) localStorage.setItem('asu_portal_studyMode', studyMode);
    else localStorage.removeItem('asu_portal_studyMode');
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
    }
  }, [screen, selectedYear, selectedSemester, selectedModule, studyMode]);

  const [showTracker, setShowTracker] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [quizPayload, setQuizPayload] = useState<QuizPayload | null>(null);
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(null);
  const [modalModule, setModalModule] = useState<ModuleInfo | null>(null);

  // Carousel states
  const [activeYearCarouselIndex, setActiveYearCarouselIndex] = useState(1); // Default to Year 2
  const [activeSemesterCarouselIndex, setActiveSemesterCarouselIndex] = useState(0);

  const transitionTo = (fn: () => void) => {
    if (document.startViewTransition) {
      document.startViewTransition(fn);
    } else {
      fn();
    }
  };

  const navigateTo = (targetScreen: Screen) => {
    transitionTo(() => {
      setScreen(targetScreen);
      if (targetScreen === 'yearSelect') {
        setSelectedYear(null);
        setSelectedSemester(null);
        setSelectedModule(null);
        setStudyMode(null);
        setSelectedChapter(null);
      } else if (targetScreen === 'semesterSelect') {
        setSelectedSemester(null);
        setSelectedModule(null);
        setStudyMode(null);
        setSelectedChapter(null);
      } else if (targetScreen === 'moduleSelect') {
        setSelectedModule(null);
        setStudyMode(null);
        setSelectedChapter(null);
      } else if (targetScreen === 'studyModeSelect') {
        setStudyMode(null);
        setSelectedChapter(null);
      } else if (targetScreen === 'chapters') {
        setSelectedChapter(null);
      }
    });
  };

  const handleSelectYear = (year: number) => {
    transitionTo(() => {
      setSelectedYear(year);
      setScreen('semesterSelect');
    });
  };

  const handleSelectSemester = (sem: number) => {
    transitionTo(() => {
      setSelectedSemester(sem);
      setScreen('moduleSelect');
    });
  };

  const handleSelectModule = (mod: ModuleInfo) => {
    if (isModuleActive(mod.code)) {
      transitionTo(() => {
        setSelectedModule(mod);
        setScreen('studyModeSelect');
      });
    } else {
      setModalModule(mod);
    }
  };

  const handleSelectMode = (mode: 'mcq' | 'essay' | 'mixed') => {
    transitionTo(() => {
      setStudyMode(mode);
      setScreen('chapters');
    });
  };

  const handleSelectChapter = (chapter: ChapterData) => {
    transitionTo(() => {
      setSelectedChapter(chapter);
      setScreen('subjects');
    });
  };

  const handleSelectSubject = (subject: SubjectData, questions: Question[]) => {
    transitionTo(() => {
      setQuizPayload({ chapter: selectedChapter!, subject, questions });
      setScreen('quiz');
    });
  };

  const handleQuickStart = (questions: Question[]) => {
    transitionTo(() => {
      setQuizPayload({ chapter: selectedChapter!, subject: null, questions });
      setScreen('quiz');
    });
  };

  const checkAnswerCorrect = (q: Question, ans: any) => {
    if (ans === undefined) return false;
    if (q.type === 'mcq' || q.type === 'truefalse') {
      return ans === q.correctIndex;
    }
    if (q.type === 'matching') {
      const scrambled = ans.scrambled;
      const matches = ans.matches || ans;
      if (!scrambled || !matches || !q.pairs) return false;
      return q.pairs.every((pair, pIdx) => {
        const correctTargetIdx = scrambled.indexOf(pair.target);
        return matches[pIdx] === correctTargetIdx;
      });
    }
    if (q.type === 'essay') {
      return ans?.selfGrade === 'correct';
    }
    if (q.type === 'case' && q.subQuestions) {
      return q.subQuestions.every((subQ) => {
        const subAns = ans[subQ.id];
        if (subAns === undefined) return false;
        if (subQ.type === 'mcq') {
          return subAns === subQ.correctIndex;
        }
        if (subQ.type === 'essay') {
          return subAns?.selfGrade === 'correct';
        }
        return false;
      });
    }
    if (q.type === 'fillblank') {
      const userAnswers = ans.userAnswers || [];
      const blanks = q.blanks || [];
      if (userAnswers.length !== blanks.length) return false;
      return blanks.every((correctWord, bIdx) => {
        const userWord = (userAnswers[bIdx] || '').trim().toLowerCase();
        const correctWordLower = correctWord.toLowerCase();
        const matchesPrimary = userWord === correctWordLower;
        const matchesAccepted = q.acceptedAnswers?.[bIdx]?.some(
          (alt) => alt.trim().toLowerCase() === userWord
        );
        return matchesPrimary || matchesAccepted;
      });
    }
    return false;
  };

  const handleFinishQuiz = (answers: Record<number, any>, elapsedSeconds: number, flaggedQuestions: Set<number>) => {
    const questions = quizPayload!.questions;
    
    let total = 0;
    let correct = 0;

    questions.forEach((q, i) => {
      const ans = answers[i];
      if (q.type === 'case' && q.subQuestions) {
        total += q.subQuestions.length;
        if (ans) {
          q.subQuestions.forEach((subQ) => {
            const subAns = ans[subQ.id];
            if (subAns !== undefined) {
              const isSubCorrect = subQ.type === 'mcq'
                ? subAns === subQ.correctIndex
                : subAns?.selfGrade === 'correct';
              if (isSubCorrect) correct++;
            }
          });
        }
      } else {
        total += 1;
        if (ans !== undefined && checkAnswerCorrect(q, ans)) {
          correct++;
        }
      }
    });

    saveQuizResult({
      moduleCode: selectedModule?.code,
      year: selectedYear,
      semester: selectedSemester,
      chapterId: quizPayload!.chapter.id,
      chapterTitle: quizPayload!.chapter.title,
      subjectName: quizPayload!.subject?.name ?? 'All Subjects',
      correct,
      total,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
      elapsedSeconds,
      questionIds: questions.map(q => q.id),
      answers,
      flaggedQuestionIds: Array.from(flaggedQuestions)
    });

    transitionTo(() => {
      setResultPayload({
        chapter: quizPayload!.chapter,
        subject: quizPayload!.subject,
        questions,
        answers,
        elapsedSeconds,
        flaggedQuestions
      });
      setScreen('results');
    });
  };

  const handleSelectHistory = (result: QuizResult) => {
    const modCode = result.moduleCode || 'MEM-2';
    const yr = result.year || 2;
    const sem = result.semester || 2;

    const moduleChapters = getChaptersForModuleAndMode(modCode, 'mixed');
    const chapter = moduleChapters.find((c) => String(c.id) === String(result.chapterId));
    if (!chapter) return;

    const subject = chapter.subjects.find((s) => s.name === result.subjectName) || null;

    let questionsList: Question[] = [];
    if (result.questionIds && Array.isArray(result.questionIds)) {
      const allChapterQuestions = chapter.subjects.flatMap((s) => s.questions);
      result.questionIds.forEach((id: number) => {
        const found = allChapterQuestions.find((q) => q.id === id);
        if (found) {
          questionsList.push(found);
        }
      });
    }

    if (questionsList.length === 0) {
      if (subject) {
        questionsList = subject.questions;
      } else {
        questionsList = chapter.subjects.flatMap((s) => s.questions);
      }
    }

    const answersRecord = result.answers || {};
    const flaggedSet = new Set<number>(result.flaggedQuestionIds || []);

    let targetModule = SYLLABUS_MODULES[yr]?.[sem]?.find((m: any) => m.code === modCode) || null;
    if (!targetModule && modCode === 'MEM-2') {
      targetModule = {
        code: 'MEM-2',
        name: 'Endocrine System & Metabolism Module',
        cp: 5.5,
        marks: 110,
        keywords: ['endocrine', 'metabolism', 'mem']
      };
    }

    transitionTo(() => {
      setSelectedYear(yr);
      setSelectedSemester(sem);
      if (targetModule) {
        setSelectedModule(targetModule);
      }
      setStudyMode('mixed');
      setSelectedChapter(chapter);
      setQuizPayload({ chapter, subject, questions: questionsList });
      setResultPayload({
        chapter,
        subject,
        questions: questionsList,
        answers: answersRecord,
        elapsedSeconds: result.elapsedSeconds,
        flaggedQuestions: flaggedSet,
      });
      setScreen('results');
    });
  };

  const handleRetake = () => {
    if (!quizPayload) return;
    transitionTo(() => {
      setQuizPayload({ ...quizPayload, questions: quizPayload.questions });
      setScreen('quiz');
    });
  };

  const handleBackToChapters = () => {
    transitionTo(() => {
      setSelectedChapter(null);
      setQuizPayload(null);
      setResultPayload(null);
      setScreen('chapters');
    });
  };

  const redirectToEndocrine = () => {
    transitionTo(() => {
      setModalModule(null);
      setSelectedYear(2);
      setSelectedSemester(2);
      setSelectedModule({
        code: 'MEM-2',
        name: 'Endocrine System & Metabolism Module',
        cp: 5.5,
        marks: 110,
        keywords: ['endocrine', 'metabolism', 'mem']
      });
      setScreen('studyModeSelect');
    });
  };

  return {
    studentYear,
    setStudentYear,
    screen,
    setScreen,
    selectedYear,
    setSelectedYear,
    selectedSemester,
    setSelectedSemester,
    selectedModule,
    setSelectedModule,
    studyMode,
    setStudyMode,
    showTracker,
    setShowTracker,
    selectedChapter,
    setSelectedChapter,
    quizPayload,
    setQuizPayload,
    resultPayload,
    setResultPayload,
    modalModule,
    setModalModule,
    activeYearCarouselIndex,
    setActiveYearCarouselIndex,
    activeSemesterCarouselIndex,
    setActiveSemesterCarouselIndex,
    navigateTo,
    handleSelectYear,
    handleSelectSemester,
    handleSelectModule,
    handleSelectMode,
    handleSelectChapter,
    handleSelectSubject,
    handleQuickStart,
    handleFinishQuiz,
    handleSelectHistory,
    handleRetake,
    handleBackToChapters,
    redirectToEndocrine
  };
}
