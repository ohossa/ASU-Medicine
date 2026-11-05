import { PortalFooter } from './PortalFooter';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useUser } from '@clerk/clerk-react';

export interface Crumb {
  label: string;
  onClick?: () => void;
}

export function PortalShell({ crumbs, children, userButton, hideFooter }: { crumbs: Crumb[]; children: ReactNode; userButton?: ReactNode; hideFooter?: boolean }) {
  const { language } = useLanguage();
  const { isLoaded, isSignedIn, user } = useUser();
  const displayName = user?.fullName || user?.firstName || user?.username || '';
  
  return (
    <div className="min-h-screen font-body bg-transparent text-zinc-900 dark:text-zinc-100 transition-colors duration-500 overflow-x-hidden">
      <header data-portal-toolbar className="sticky top-0 z-50 border-b border-zinc-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8 relative">
          <div className="flex min-w-0 items-center gap-2.5">
            {crumbs[0]?.onClick && <button type="button" onClick={crumbs[0].onClick} aria-label={`Back to ${crumbs[0].label}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border md:hidden"><ArrowLeft size={18}/></button>}
            <a href="/" className="flex min-w-0 items-center gap-2 text-inherit no-underline hover:opacity-90 transition-opacity" title="A-Plus (asu.codes) Home">
              <img src="/favicon.png" alt="A-Plus Logo" className="w-8 h-8 rounded-lg shadow-sm shrink-0 object-contain" />
              <div className="flex min-w-0 flex-col items-start leading-tight">
                <span className="font-heading font-extrabold tracking-tight text-[14px] sm:text-[15px] text-zinc-900 dark:text-zinc-100">
                  A-Plus
                </span>
                <span className="text-[10px] font-mono tracking-wide text-zinc-400 dark:text-zinc-500 leading-none">
                  asu.codes
                </span>
              </div>
            </a>
            {isLoaded && isSignedIn && displayName ? (
              <span className="hidden sm:inline-block ml-1 pl-2 border-l border-zinc-200 dark:border-white/10 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 truncate max-w-[120px]">
                {displayName}
              </span>
            ) : null}
          </div>
          <nav className="hidden md:flex items-center gap-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 rounded-full px-4 py-1.5 bg-zinc-100/60 dark:bg-white/[0.04] border border-zinc-200/50 dark:border-white/[0.05] backdrop-blur-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className={`opacity-50 ${language === 'ar' ? 'rotate-180' : ''}`} />}
                {c.onClick ? (
                  <button onClick={c.onClick} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit font-inherit">
                    {c.label}
                  </button>
                ) : (
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
              {userButton || (
                <>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center font-heading font-bold text-[13px] text-white">M</div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#22c55e] ring-2 ring-white dark:ring-[#0a0a0a]" />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {children}

      {!hideFooter && <PortalFooter />}

    </div>
  );
}
