import { useState } from 'react';
import {
  Timer,
  Zap,
  BookOpen,
  Award,
  Sliders,
  Shield,
  Lightbulb,
  X,
  Play,
  CheckCircle2,
} from 'lucide-react';
import type { MockExamConfig, MockExamPreset, MockExamFeedbackMode } from '../../types/mockExam';

export interface MockExamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleCode: string;
  moduleName?: string;
  totalAvailableQuestions: number;
  onStartExam: (config: MockExamConfig) => void;
}

export function MockExamConfigModal({
  isOpen,
  onClose,
  moduleCode,
  moduleName,
  totalAvailableQuestions,
  onStartExam,
}: MockExamConfigModalProps) {
  if (!isOpen) return null;

  const [preset, setPreset] = useState<MockExamPreset>('midterm');
  const [feedbackMode, setFeedbackMode] = useState<MockExamFeedbackMode>('official');

  // Custom settings state
  const [customQuestions, setCustomQuestions] = useState(30);
  const [customMinutes, setCustomMinutes] = useState(40);
  const [isUntimed, setIsUntimed] = useState(false);

  const presets = [
    {
      id: 'quick' as MockExamPreset,
      title: 'Quick Assessment',
      icon: Zap,
      questions: Math.min(20, totalAvailableQuestions),
      minutes: 25,
      desc: 'Rapid knowledge check. 20 questions in 25 minutes.',
      badge: '20 Qs · 25m',
      accent: 'border-blue-500/40 bg-blue-500/5',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      id: 'midterm' as MockExamPreset,
      title: 'Continuous Assessment',
      icon: BookOpen,
      questions: Math.min(40, totalAvailableQuestions),
      minutes: 50,
      desc: 'Official Ain Shams CA-1 / CA-2 test simulation. 40 questions in 50 minutes.',
      badge: '40 Qs · 50m · University Standard',
      accent: 'border-teal-500/50 bg-teal-500/5 ring-1 ring-teal-500/30',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    },
    {
      id: 'final' as MockExamPreset,
      title: 'Comprehensive Final',
      icon: Award,
      questions: Math.min(80, totalAvailableQuestions),
      minutes: 100,
      desc: 'Full-length end-of-semester paper simulation. 80 questions in 100 minutes.',
      badge: '80 Qs · 100m · Full Exam',
      accent: 'border-purple-500/40 bg-purple-500/5',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    },
    {
      id: 'custom' as MockExamPreset,
      title: 'Custom Test Builder',
      icon: Sliders,
      questions: customQuestions,
      minutes: isUntimed ? 0 : customMinutes,
      desc: 'Choose exact question count and time limit tailored to your study schedule.',
      badge: 'Custom Configuration',
      accent: 'border-stone-400/40 bg-stone-500/5',
      badgeColor: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300',
    },
  ];

  const activePreset = presets.find((p) => p.id === preset) || presets[1];
  const effectiveQuestions = preset === 'custom' ? customQuestions : activePreset.questions;
  const effectiveMinutes = preset === 'custom' ? (isUntimed ? 0 : customMinutes) : activePreset.minutes;

  const handleLaunch = () => {
    onStartExam({
      moduleCode,
      preset,
      questionCount: effectiveQuestions,
      durationMinutes: effectiveMinutes,
      mode: feedbackMode,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mock-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-stone-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-stone-800 dark:bg-stone-900/95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                <Timer size={13} />
                {moduleCode} Exam Simulator
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {totalAvailableQuestions} Qs Pool
              </span>
            </div>
            <h2 id="mock-modal-title" className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-2xl">
              Timed Mock Exam Simulation
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {moduleName ? `${moduleName} · ` : ''}Practice under realistic testing center conditions with active time management and Ain Shams faculty grading.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback Mode Segmented Switcher (Apple HIG) */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Examination Mode & Feedback Rules
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setFeedbackMode('official')}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all min-h-[48px] ${
                feedbackMode === 'official'
                  ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-teal-500/20'
                  : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40'
              }`}
            >
              <Shield size={18} className={`mt-0.5 shrink-0 ${feedbackMode === 'official' ? 'text-teal-600 dark:text-teal-400' : 'text-stone-400'}`} />
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  Official Exam Mode
                  {feedbackMode === 'official' && <CheckCircle2 size={13} className="text-teal-600" />}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                  Strict exam rules. Answers and rationales locked until final submission. Question review grid enabled.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFeedbackMode('tutor')}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all min-h-[48px] ${
                feedbackMode === 'tutor'
                  ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-teal-500/20'
                  : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40'
              }`}
            >
              <Lightbulb size={18} className={`mt-0.5 shrink-0 ${feedbackMode === 'tutor' ? 'text-teal-600 dark:text-teal-400' : 'text-stone-400'}`} />
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  Timed Tutor Mode
                  {feedbackMode === 'tutor' && <CheckCircle2 size={13} className="text-teal-600" />}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                  Active countdown timer running, but reveals official key and explanation immediately after each choice.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Preset Selection Grid */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Select Exam Format & Length
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presets.map((p) => {
              const Icon = p.icon;
              const active = preset === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all min-h-[48px] flex flex-col justify-between ${
                    active
                      ? `${p.accent} border-teal-500 shadow-sm ring-2 ring-teal-500/25`
                      : 'border-stone-200/80 bg-white/60 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-xl ${active ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'}`}>
                          <Icon size={16} />
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {p.title}
                        </h4>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Builder Sliders (when custom preset is selected) */}
        {preset === 'custom' && (
          <div className="mt-4 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-800/40 space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-stone-700 dark:text-stone-300">Question Count</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{customQuestions} Questions</span>
              </div>
              <input
                type="range"
                min={5}
                max={Math.min(100, totalAvailableQuestions)}
                step={5}
                value={customQuestions}
                onChange={(e) => setCustomQuestions(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none dark:bg-stone-700"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>5 Qs</span>
                <span>{Math.min(100, totalAvailableQuestions)} Qs</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-stone-700 dark:text-stone-300">Exam Duration</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {isUntimed ? 'Untimed Practice' : `${customMinutes} Minutes`}
                </span>
              </div>

              {!isUntimed && (
                <input
                  type="range"
                  min={10}
                  max={150}
                  step={5}
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none dark:bg-stone-700"
                />
              )}

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/50 dark:border-stone-700/50">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 dark:text-stone-400">
                  <input
                    type="checkbox"
                    checked={isUntimed}
                    onChange={(e) => setIsUntimed(e.target.checked)}
                    className="rounded accent-teal-600 h-4 w-4"
                  />
                  Practice without countdown timer
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action Bar */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Selected: <strong className="text-stone-900 dark:text-stone-100">{effectiveQuestions} Questions</strong> ·{' '}
            <strong className="text-stone-900 dark:text-stone-100">{effectiveMinutes > 0 ? `${effectiveMinutes} Minutes` : 'Untimed'}</strong> ·{' '}
            <span className="capitalize">{feedbackMode} Mode</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 min-h-[44px] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleLaunch}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 min-h-[44px] transition-all hover:scale-[1.02]"
            >
              <Play size={14} className="fill-white" />
              Launch Mock Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
