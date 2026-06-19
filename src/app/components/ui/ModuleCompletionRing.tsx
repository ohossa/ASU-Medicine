interface ModuleCompletionRingProps {
  pct: number;
  size?: number;
  color?: string;
}

export default function ModuleCompletionRing({ pct, size = 48, color = '#ffffff' }: ModuleCompletionRingProps) {
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="11" fontWeight="600">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}