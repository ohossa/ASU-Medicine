// src/app/components/YearSelectionModal.tsx
// Improved: focus trapping, bilingual localization, text-start alignments, RTL support, and resilient skip/fallback bypass.

import { useEffect, useState, useRef } from 'react';
import { GraduationCap, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  onSelect: (year: number) => Promise<void>;
  onDismiss?: (fallbackYear?: number) => void;
  loadError?: string | null;
  onRetry?: () => void;
  localPreview?: boolean;
}

export function YearSelectionModal({ onSelect, onDismiss, loadError, onRetry, localPreview=false }: Props) {
  const { t, language } = useLanguage();

  const dialogRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSelect = async (year: number) => {
    if (saving) return;
    setSaving(true); setError(null);
    try { await onSelect(year); }
    catch {
      setError(
        language === 'ar'
          ? 'تعذر حفظ السنة على السحابة. يمكنك المتابعة إلى الموقع كالسنة الثالثة.'
          : 'Your year could not be saved to the cloud. You can continue to the portal as Year 3.'
      );
    }
    finally { setSaving(false); }
  };

  // Trap keyboard focus inside modal and focus first element on mount
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstYearBtn = dialogRef.current?.querySelector<HTMLButtonElement>('[data-year-btn]');
    const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [];
    if (firstYearBtn) {
      firstYearBtn.focus();
    } else if (buttons.length > 0) {
      buttons[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onDismiss) {
        e.preventDefault();
        onDismiss(3);
        return;
      }
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
  }, [onDismiss]);

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
        {onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(3)}
            disabled={saving}
            aria-label={language === 'ar' ? 'إغلاق والمتابعة كالسنة الثالثة' : 'Close and continue as Year 3'}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 w-11 h-11 rounded-full
                       flex items-center justify-center text-muted-foreground hover:text-foreground
                       hover:bg-muted/80 dark:hover:bg-white/10 active:scale-95 transition-all
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={20} />
          </button>
        )}
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

        {(error || loadError) && (
          <div className="mb-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-start space-y-3 animate-fade-in">
            <p role="alert" className="text-sm font-semibold text-destructive dark:text-red-400">
              {error || loadError}
            </p>
            {onDismiss && (
              <button
                type="button"
                onClick={() => onDismiss(3)}
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground hover:opacity-90 rounded-xl
                           font-semibold text-sm transition-all shadow-sm active:scale-[0.98] min-h-[44px]
                           flex items-center justify-center gap-2"
              >
                {language === 'ar' ? 'المتابعة إلى الموقع كالسنة الثالثة (الافتراضي)' : 'Continue to Portal as Year 3 (Default)'}
              </button>
            )}
            {loadError && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={saving}
                className="text-xs text-muted-foreground underline hover:text-foreground block"
              >
                {language === 'en' ? 'Retry loading saved year' : 'إعادة تحميل السنة المحفوظة'}
              </button>
            )}
          </div>
        )}
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

        {onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(3)}
            disabled={saving}
            className="w-full mt-3 py-3 px-4 rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground
                       bg-muted/40 hover:bg-muted/80 dark:bg-white/5 dark:hover:bg-white/10
                       transition-all duration-200 border border-transparent hover:border-border min-h-[44px] flex items-center justify-center"
          >
            {language === 'ar' ? 'تخطي الآن — المتابعة كالسنة الثالثة (الافتراضي)' : 'Skip for now — Continue as Year 3 (Default)'}
          </button>
        )}
        </div>
      </div>
    </div>
  );
}
