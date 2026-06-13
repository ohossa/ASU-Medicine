import { ChevronRight, Sun, Moon, Languages } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
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
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8 relative">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-heading font-black tracking-tight text-[15px] leading-tight">
              ASU Medical Portal
            </span>
            {isLoaded && isSignedIn && displayName && (
              <span className="text-[10.5px] font-bold tracking-wide text-zinc-400 dark:text-zinc-500 leading-none mt-0.5 opacity-90">
                {displayName}
              </span>
            )}
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
            <div className="relative flex items-center">
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

      {!hideFooter && (
        <footer className="border-t border-zinc-200/70 dark:border-white/[0.06] py-10 text-center">
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Ain Shams University <span className="mx-1.5 opacity-40">•</span> ASU Medical Portal</p>
          <a href="mailto:omarhmaged@gmail.com" className="mt-1.5 inline-block text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-[#22c55e] transition-colors">omarhmaged@gmail.com</a>
        </footer>
      )}
    </div>
  );
}
