export type TimerMode = 'off' | 'practice';

interface TimerSettingsPanelProps {
  mode: TimerMode;
  onChangeMode: (m: TimerMode) => void;
}

export default function TimerSettingsPanel({ mode, onChangeMode }: TimerSettingsPanelProps) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">Timer</h3>
      <div className="flex gap-2">
        {(['off','practice'] as TimerMode[]).map(m => (
          <button key={m} onClick={() => onChangeMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
              mode === m ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>{m}</button>
        ))}
      </div>
    </div>
  );
}