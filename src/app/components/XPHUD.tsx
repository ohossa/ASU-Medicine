import { useGamificationStore } from '../store/gamificationStore';
import { Flame, Star, Dna } from 'lucide-react';

export default function XPHUD() {
  const { streakDays, level, xp } = useGamificationStore();
  const progress = useGamificationStore(s => s.getLevelProgress());

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10">
      <div className="flex items-center gap-1.5 text-amber-400">
        <Flame size={14} /><span className="text-xs font-semibold">{streakDays}</span>
      </div>
      <div className="flex items-center gap-1.5 text-yellow-300">
        <Star size={14} /><span className="text-xs font-semibold">{xp.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5 text-emerald-400">
        <Dna size={14} /><span className="text-xs font-semibold">Lv. {level}</span>
      </div>
      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${progress.pct}%` }} />
      </div>
    </div>
  );
}