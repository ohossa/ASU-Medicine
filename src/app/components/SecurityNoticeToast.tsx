import React, { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, KeyRound, X } from "lucide-react";

export interface SecurityNoticePayload {
  title: string;
  message: string;
  type?: "warning" | "error" | "info" | "success";
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export function dispatchSecurityNotice(notice: SecurityNoticePayload) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("asu-security-notice", { detail: notice }));
  }
}

export const SecurityNoticeToast: React.FC = () => {
  const [currentNotice, setCurrentNotice] = useState<SecurityNoticePayload | null>(null);

  useEffect(() => {
    const handleNotice = (e: Event) => {
      const customEvent = e as CustomEvent<SecurityNoticePayload>;
      if (customEvent.detail) {
        setCurrentNotice(customEvent.detail);
      }
    };

    window.addEventListener("asu-security-notice", handleNotice);
    return () => window.removeEventListener("asu-security-notice", handleNotice);
  }, []);

  useEffect(() => {
    if (!currentNotice) return;
    const duration = currentNotice.durationMs ?? (currentNotice.type === "error" ? 7000 : 5000);
    const timer = setTimeout(() => {
      setCurrentNotice(null);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentNotice]);

  if (!currentNotice) return null;

  const iconByType = () => {
    switch (currentNotice.type) {
      case "error":
        return <ShieldAlert className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" aria-hidden="true" />;
      case "success":
        return <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" aria-hidden="true" />;
      case "warning":
      default:
        return <KeyRound className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] w-[92%] max-w-md mx-auto pointer-events-auto"
    >
      <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-black/5 dark:border-white/5 flex items-center justify-center shrink-0">
            {iconByType()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {currentNotice.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
              {currentNotice.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {currentNotice.actionLabel && currentNotice.onAction && (
            <button
              onClick={() => {
                currentNotice.onAction?.();
                setCurrentNotice(null);
              }}
              className="min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 transition-colors"
            >
              {currentNotice.actionLabel}
            </button>
          )}

          <button
            onClick={() => setCurrentNotice(null)}
            aria-label="Dismiss security notice"
            className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
