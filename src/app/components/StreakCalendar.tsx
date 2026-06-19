import { useMemo } from 'react';
const WEEK_DAYS = ['M','T','W','T','F','S','S'];
const WEEKS = 16;
const colors = ['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39'];

interface StreakCalendarProps {
  studyDays: string[];
}

function getIntensity(dateStr: string, studyDays: string[]): number {
  const count = studyDays.filter(d => d === dateStr).length;
  if (count >= 10) return 4;
  if (count >= 6) return 3;
  if (count >= 3) return 2;
  return count > 0 ? 1 : 0;
}

export default function StreakCalendar({ studyDays }: StreakCalendarProps) {
  const weeks = useMemo(() => {
     
    const now = new Date();
    const result: { date: string; intensity: number }[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      const week: typeof result[0] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() - ((WEEKS - 1 - w) * 7 + (6 - d)));
        week.push({ date: date.toISOString().split('T')[0], intensity: getIntensity(date.toISOString().split('T')[0], studyDays) });
      }
      result.push(week);
    }
    return result;
  }, [studyDays]);

  return (
    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3">Study Streak</h3>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-1">
          {WEEK_DAYS.map((d,i) => <span key={i} className="text-[9px] text-white/40 text-right w-3 leading-[10px]">{d}</span>)}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div key={di} title={day.date} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[day.intensity] }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}