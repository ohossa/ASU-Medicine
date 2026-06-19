const R = 48;
const C = 2 * Math.PI * R;
const colorMap = { normal: '#22c55e', amber: '#f59e0b', red: '#ef4444', critical: '#ef4444' };

interface TimerRingSVGProps {
  pct: number;
  urgency: 'normal' | 'amber' | 'red' | 'critical';
  remaining: number;
}

export default function TimerRingSVG({ pct, urgency, remaining }: TimerRingSVGProps) {
  const offset = C - (pct / 100) * C;
  const color = colorMap[urgency];
  const critical = urgency === 'critical';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle cx="60" cy="60" r={R} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={offset}
          style={{ filter: critical ? `drop-shadow(0 0 6px ${color})` : 'none' }}
        />
      </svg>
      <span className="absolute text-white font-mono text-sm">
        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
      </span>
    </div>
  );
}