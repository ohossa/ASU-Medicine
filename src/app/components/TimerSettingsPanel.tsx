export type TimerMode = 'off' | 'practice' | 'exam';

interface TimerSettingsPanelProps {
  mode: TimerMode;
  urgency?: 'normal' | 'warning' | 'critical';
  muted?: boolean;
  onChangeMode: (m: TimerMode) => void;
  onToggleMute?: () => void;
}

export default function TimerSettingsPanel({ mode, urgency = 'normal', muted = false, onChangeMode, onToggleMute }: TimerSettingsPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[11px] font-bold text-gray-800 dark:text-white/80 uppercase tracking-wider">Timer</h3>
        {mode === 'practice' && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
            urgency === 'critical'
              ? 'border-red-400/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
              : urgency === 'warning'
                ? 'border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-emerald-400/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              urgency === 'critical' ? 'bg-red-500 animate-pulse' : urgency === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
            {urgency === 'critical' ? 'Critical' : urgency === 'warning' ? 'Warning' : 'Normal'}
          </span>
        )}
      </div>

      <div className="flex rounded-lg border border-gray-200 dark:border-white/[0.08] p-0.5 bg-white dark:bg-black/20">
        {(['off','practice','exam'] as TimerMode[]).map(m => (
          <button
            key={m}
            onClick={() => onChangeMode(m)}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-medium capitalize transition-all ${
              mode === m
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-white/5'
                : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-black/20 py-1.5 text-[11px] font-medium transition-all hover:bg-gray-50 dark:hover:bg-white/[0.06]"
        >
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-white/40">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-white/70">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
          <span className={muted ? 'text-gray-400 dark:text-white/40' : 'text-gray-600 dark:text-white/70'}>
            {muted ? 'Unmute sounds' : 'Mute sounds'}
          </span>
        </button>
      )}

      <p className="mt-2.5 text-[10px] leading-relaxed text-gray-500 dark:text-white/40">
        {mode === 'off'
          ? 'Timer is paused. No pacing feedback will be shown.'
          : 'The clock tracks your elapsed time. It turns amber after 60% of estimated time and red after 85%.'}
      </p>
    </div>
  );
}
