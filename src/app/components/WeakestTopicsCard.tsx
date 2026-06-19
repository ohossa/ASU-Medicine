import ModuleCompletionRing from './ui/ModuleCompletionRing';
import DashboardCard from './DashboardCard';

interface WeakTopic {
  id: string;
  label: string;
  pct: number;
}

const MOCK_WEAK_TOPICS: WeakTopic[] = [
  { id: '1', label: 'Cardiac Cycle', pct: 42 },
  { id: '2', label: 'Renal Physiology', pct: 55 },
  { id: '3', label: 'Neurotransmission', pct: 61 },
];

export default function WeakestTopicsCard() {
  return (
    <DashboardCard>
      <h3 className="text-sm font-semibold text-white mb-3">Weakest Areas</h3>
      <div className="space-y-3">
        {MOCK_WEAK_TOPICS.map((topic) => (
          <div key={topic.id} className="flex items-center justify-between">
            <span className="text-xs text-white/60">{topic.label}</span>
            <ModuleCompletionRing
              pct={topic.pct}
              size={36}
              color={topic.pct < 50 ? '#fb7185' : topic.pct < 70 ? '#fbbf24' : '#34d399'}
            />
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10 transition-colors">
        Start Focused Session
      </button>
    </DashboardCard>
  );
}