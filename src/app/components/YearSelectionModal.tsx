// src/app/components/YearSelectionModal.tsx
// Improved: focus trapping, bilingual localization, text-start alignments, and RTL support.

import { useEffect, useState, useRef } from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Props { onSelect: (year: number) => Promise<void>; loadError?: string | null; onRetry?: () => void; localPreview?: boolean; }

export function YearSelectionModal({ onSelect, loadError, onRetry, localPreview=false }: Props) {
  const { t, language } = useLanguage();

  const dialogRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSelect = async (year: number) => {
    if (saving) return;
    setSaving(true); setError(null);
    try { await onSelect(year); }
    catch { setError(language === 'ar' ? 'تعذر حفظ السنة. حاول مرة أخرى.' : 'Your year could not be saved. Please try again.'); }
    finally { setSaving(false); }
  };

  // Trap keyboard focus inside modal and focus first element on mount
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [];
    if (buttons.length > 0) {
      buttons[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const focusable = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [];
      if (focusable.length === 0) { e.preventDefault(); return; }
      
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
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', handleKeyDown); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6
                 bg-foreground/20 dark:bg-background/60 backdrop-blur-md animate-fade-in"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('selectYear')}
    >
      <div
        className="w-full max-w-md max-h-[90dvh] overflow-hidden bg-card border border-border rounded-[28px] p-2
                   shadow-2xl animate-slide-up relative"
      >
        <div className="max-h-[calc(90dvh-1rem)] overflow-y-auto overscroll-contain rounded-[22px] p-4 sm:p-6">
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
              {localPreview ? (language === 'en' ? 'Local preview: your year is saved for this account in this browser. Cloud sync remains active on the published website.' : 'معاينة محلية: تُحفظ سنتك لهذا الحساب في هذا المتصفح. المزامنة السحابية متاحة على الموقع المنشور.') : language === 'en' ? 'Confirm your academic year. We will remember it for your home page and marks calculator across devices.' : 'أكد سنتك الدراسية لحفظها لحسابك وفتح الصفحة الرئيسية وحاسبة الدرجات على سنتك تلقائياً.'}
            </p>
          </div>
        </div>

        {(error || loadError) && <p role="alert" className="mb-3 text-sm text-red-500">{error || loadError}</p>}
        {loadError && onRetry && <button type="button" onClick={onRetry} disabled={saving} className="mb-3 text-sm underline">{language === 'en' ? 'Retry loading saved year' : 'إعادة تحميل السنة المحفوظة'}</button>}
        {saving && <p role="status" className="mb-3 text-sm text-muted-foreground">{language === 'en' ? 'Saving your year…' : 'جارٍ حفظ السنة…'}</p>}
        {/* Year buttons */}
        <div className="flex flex-col gap-2.5">
          {([1, 2, 3, 4, 5] as const).map((year) => (
            <button
              key={year}
              data-year-btn
              disabled={saving}
              onClick={() => handleSelect(year)}
              className="group disabled:opacity-50 w-full py-3.5 px-5 bg-muted/60 hover:bg-physiology/8
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
    </div>
  );
}
