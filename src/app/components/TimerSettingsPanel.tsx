export type TimerMode = 'off' | 'practice' | 'exam';

interface TimerSettingsPanelProps {
  mode: TimerMode;
  questionCount: number;
  onChangeMode: (m: TimerMode) => void;
  onChangeQuestionCount: (n: number) => void;
}

export default function TimerSettingsPanel({ mode, questionCount, onChangeMode, onChangeQuestionCount }: TimerSettingsPanelProps) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">Timer</h3>
      <div className="flex gap-2 mb-4">
        {(['off','practice','exam'] as TimerMode[]).map(m => (
          <button key={m} onClick={() => onChangeMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
              mode === m ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>{m}</button>
        ))}
      </div>
      <h3 className="text-sm font-semibold text-white mb-3">Questions</h3>
      <div className="flex gap-2">
        {[20,40,60,80].map(n => (
          <button key={n} onClick={() => onChangeQuestionCount(n)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              questionCount === n ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>{n}</button>
        ))}
      </div>
    </div>
  );
}