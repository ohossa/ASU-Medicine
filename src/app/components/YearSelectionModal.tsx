// src/app/components/YearSelectionModal.tsx
// Improved: focus trapping, bilingual localization, text-start alignments, and RTL support.

import { useEffect } from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { triggerCloudSync } from '../hooks/useCloudSync';
import { useLanguage } from '../context/LanguageContext';

interface Props { onSelect: (year: number) => void; }

export function YearSelectionModal({ onSelect }: Props) {
  const { t } = useLanguage();

  const handleSelect = (year: number) => {
    localStorage.setItem('asu_medical_student_year', year.toString());
    triggerCloudSync();
    onSelect(year);
  };

  // Trap keyboard focus inside modal and focus first element on mount
  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-year-btn]');
    if (buttons.length > 0) {
      buttons[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const focusable = document.querySelectorAll<HTMLButtonElement>('[data-year-btn]');
      if (focusable.length === 0) return;
      
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6
                 bg-foreground/20 dark:bg-background/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={t('selectYear')}
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
              {t('welcomePortal')}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed max-w-xs mx-auto">
              {t('chooseYearDesc')}
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
              <div className="text-start">
                <span className="block text-sm font-bold">{t('year' + year)}</span>
                <span className="block text-[11px] text-muted-foreground font-medium mt-0.5
                                 group-hover:text-physiology/70 transition-colors">
                  {t('yearDesc' + year)}
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
