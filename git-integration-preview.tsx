import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './src/styles/index.css';
import { ThemeProvider } from './src/app/context/ThemeContext';
import { LanguageProvider } from './src/app/context/LanguageContext';
import { GitBankSelect } from './src/app/components/GitBankSelect';
import { SubjectSelect } from './src/app/components/SubjectSelect';
import { toGitTopicChapter } from './src/app/lib/gitBank';
import { PortalFooter } from './src/app/components/PortalFooter';
import type { ChapterData, QuestionCollection, Question } from './src/app/types';
import rawData from './src/imports/year-3/semester-1/MGL-3.json';

const allChapters = ((rawData as any).default?.chapters || (rawData as any).chapters || []) as ChapterData[];

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: 'red', background: '#fee' }}>
          <h2>Render Error:</h2>
          <pre>{this.state.error.message}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function Preview() {
  const [collection, setCollection] = useState<QuestionCollection>('past-exams');
  const [examPeriod, setExamPeriod] = useState<'ca-1' | 'ca-2' | null>(null);
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  const practiceCount = allChapters
    .filter(c => c.bankSection !== 'past-exams')
    .reduce((sum, c) => sum + c.subjects.reduce((s2, sub) => s2 + sub.questions.length, 0), 0);
  const ca1Count = allChapters
    .filter(c => c.bankSection === 'past-exams' && c.examPeriod === 'ca-1')
    .reduce((sum, c) => sum + c.subjects.reduce((s2, sub) => s2 + sub.questions.length, 0), 0);
  const ca2Count = allChapters
    .filter(c => c.bankSection === 'past-exams' && c.examPeriod === 'ca-2')
    .reduce((sum, c) => sum + c.subjects.reduce((s2, sub) => s2 + sub.questions.length, 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ASUCodes Portal Local Preview
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-mono font-medium">GIT Module (MGL-3)</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Total: <strong className="text-white">6,539 Questions</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCollection('practice'); setExamPeriod(null); setChapter(null); setQuestions(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              collection === 'practice'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            Practice Bank ({practiceCount.toLocaleString()} Qs)
          </button>
          <button
            onClick={() => { setCollection('past-exams'); setExamPeriod(null); setChapter(null); setQuestions(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              collection === 'past-exams'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            Past Exams (CA-1: {ca1Count} Qs · CA-2: {ca2Count} Qs)
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="p-6 max-w-7xl mx-auto">
        {questions ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <button
              onClick={() => setQuestions(null)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 rounded-xl transition-all shadow-sm"
            >
              ← Back to subjects
            </button>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400">
                {chapter?.examPeriod ? chapter.examPeriod.toUpperCase() : 'Practice'}
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">{chapter?.title}</h1>
              <p className="text-slate-400 text-sm mt-1">{questions.length} questions loaded in this topic</p>
            </div>
            <div className="space-y-4">
              {questions.slice(0, 10).map((q, idx) => (
                <div key={q.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
                    <span>Question {idx + 1} of {questions.length}</span>
                    <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-400">{q.id}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 leading-relaxed mb-4">{q.text}</h3>
                  <div className="grid gap-2">
                    {q.options?.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswer;
                      return (
                        <div
                          key={optIdx}
                          className={`p-3.5 rounded-xl text-sm border transition-all flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-medium'
                              : 'bg-slate-950/50 border-slate-800/60 text-slate-300'
                          }`}
                        >
                          <span className="font-mono font-semibold text-slate-400">{String.fromCharCode(65 + optIdx)}.</span>
                          <span className="flex-1">{opt}</span>
                          {isCorrect && (
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-200 block mb-1">High-Yield Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
              {questions.length > 10 && (
                <p className="text-center text-xs text-slate-500 py-4 font-mono">
                  + {questions.length - 10} more questions in this subject
                </p>
              )}
            </div>
          </div>
        ) : chapter ? (
          <SubjectSelect
            chapter={toGitTopicChapter(chapter)}
            moduleCode="MGL-3"
            onBack={() => setChapter(null)}
            onSelectSubject={(_, q) => setQuestions(q)}
            onQuickStart={setQuestions}
          />
        ) : (
          <GitBankSelect
            chapters={allChapters}
            collection={collection}
            onCollectionChange={setCollection}
            examPeriod={examPeriod}
            onExamPeriodChange={setExamPeriod}
            studyModeName="MCQ Practice Mode"
            onSelectChapter={setChapter}
            onBackToModeSelect={() => {}}
          />
        )}
      </main>
      {questions && <PortalFooter />}
    </div>
  );
}

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Y29ycmVjdC1jYXRmaXNoLTI0LmNsZXJrLmFjY291bnRzLmRldiQ';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ClerkProvider publishableKey={clerkKey}>
      <ThemeProvider>
        <LanguageProvider>
          <Preview />
        </LanguageProvider>
      </ThemeProvider>
    </ClerkProvider>
  </ErrorBoundary>
);

