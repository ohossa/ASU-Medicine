// src/app/components/YearSelectionModal.tsx
// Improved: better visual hierarchy, animated entry, clearer CTA,
// year labels show progress context, no logic changes.

import { useEffect } from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { triggerCloudSync } from '../hooks/useCloudSync';

interface Props { onSelect: (year: number) => void; }

const YEAR_LABELS: Record<number, string> = {
  1: 'Pre-clinical foundations',
  2: 'Organ systems & physiology',
  3: 'Clinical sciences',
  4: 'Internal medicine & paeds',
  5: 'Surgery & specialties',
};

export function YearSelectionModal({ onSelect }: Props) {
  const handleSelect = (year: number) => {
    localStorage.setItem('asu_medical_student_year', year.toString());
    triggerCloudSync();
    onSelect(year);
  };

  // Trap keyboard focus inside modal
  useEffect(() => {
    const firstBtn = document.querySelector<HTMLButtonElement>('[data-year-btn]');
    firstBtn?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6
                 bg-foreground/20 dark:bg-background/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Select your academic year"
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-[36px] p-8
                   shadow-2xl animate-slide-up relative overflow-hidden"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl
                        from-physiology/8 to-transparent rounded-bl-[90px] pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-physiology/10 flex items-center justify-center text-physiology shadow-sm">
            <GraduationCap size={28} strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-archivo text-2xl font-black text-foreground tracking-tight">
              Welcome to the Portal!
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed max-w-xs mx-auto">
              Choose your academic year to get a personalised experience and the right modules.
            </p>
          </div>
        </div>

        {/* Year buttons */}
        <div className="flex flex-col gap-2.5">
          {([1, 2, 3, 4, 5] as const).map((year) => (
            <button
              key={year}
              data-year-btn
              onClick={() => handleSelect(year)}
              className="group w-full py-3.5 px-5 bg-muted/60 hover:bg-physiology/8
                         dark:bg-white/5 dark:hover:bg-physiology/10
                         text-foreground hover:text-physiology-dark dark:hover:text-physiology
                         rounded-2xl font-semibold transition-all duration-200
                         hover:scale-[1.02] active:scale-[0.99]
                         border border-transparent hover:border-physiology/20
                         shadow-sm hover:shadow-md
                         flex items-center justify-between"
            >
              <div className="text-left">
                <span className="block text-sm font-bold">Year {year}</span>
                <span className="block text-[11px] text-muted-foreground font-medium mt-0.5
                                 group-hover:text-physiology/70 transition-colors">
                  {YEAR_LABELS[year]}
                </span>
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground/50 group-hover:text-physiology transition-all
                           duration-200 group-hover:translate-x-0.5"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
