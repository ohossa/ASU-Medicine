// src/app/components/LoginScreen.tsx
// Improved: cleaner two-col layout, animated feature list, better typography scale,
// reduced visual noise, proper reduced-motion support.

import { useEffect, useRef } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { InteractiveBackground } from './ui/InteractiveBackground';
import { Activity, Shield, RefreshCw, BookOpen } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'All question types',
    desc: 'MCQ, Essay, Fill-in-the-blank, Matching, Case Studies — every format your exam demands.',
    color: 'text-physiology',
    bg:   'bg-physiology/10',
  },
  {
    icon: RefreshCw,
    title: 'Cross-device sync',
    desc: 'Progress, notes, and quiz history sync automatically via the cloud.',
    color: 'text-clinical',
    bg:   'bg-clinical/10',
  },
  {
    icon: Shield,
    title: 'Secure & private',
    desc: 'Clerk-powered authentication keeps your data yours — no shared databases.',
    color: 'text-anatomy',
    bg:   'bg-anatomy/10',
  },
] as const;

export function LoginScreen() {
  const blobRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on the hero blobs — skipped for reduced motion
  useEffect(() => {
    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mm.matches) return;

    const handleMove = (e: MouseEvent) => {
      if (!blobRef.current) return;
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 20;
      const y = (e.clientY / h - 0.5) * 20;
      blobRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-background font-manrope selection:bg-physiology/20 selection:text-physiology-dark overflow-hidden">
      {/* ── Animated background ─────────────────────────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <InteractiveBackground />
        <div
          ref={blobRef}
          className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
          style={{ transitionDuration: '800ms' }}
        >
          <div className="absolute top-[8%]  left-[4%]  h-[38vw] w-[38vw] rounded-full
                          bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
                          from-physiology/25 to-transparent blob-float-1" />
          <div className="absolute bottom-[8%] right-[4%]  h-[42vw] w-[42vw] rounded-full
                          bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
                          from-anatomy/25 to-transparent blob-float-2" />
          <div className="absolute top-[38%] left-[38%] h-[28vw] w-[28vw] rounded-full
                          bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
                          from-clinical/20 to-transparent blob-float-3" />
        </div>
      </div>

      {/* ── Content grid ───────────────────────────────────── */}
      <div className="w-full max-w-[1160px] grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 lg:gap-20 items-center">

        {/* Left: Branding + features */}
        <div className="flex flex-col gap-8 text-center lg:text-left z-10 animate-pop-up">
          {/* Logo mark */}
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-physiology to-clinical
                            flex items-center justify-center shadow-lg shadow-physiology/25
                            flex-shrink-0">
              <Activity className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-archivo font-black text-base text-foreground tracking-tight">ASU Medical Portal</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Ain Shams University</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="font-archivo font-black text-4xl sm:text-5xl lg:text-[3.5rem] text-foreground tracking-tight leading-[1.08]">
              Master your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-physiology via-clinical to-anatomy">
                Medical Studies.
              </span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Practice every question format, track your syllabus, and study smarter — built for ASU Medicine students.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 max-w-lg mx-auto lg:mx-0">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="animate-pop-up flex items-start gap-3.5 text-left px-4 py-3.5
                           rounded-2xl bg-card/60 border border-border/60
                           backdrop-blur-sm shadow-sm
                           hover:border-border transition-all duration-300"
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <div className={`w-8 h-8 rounded-xl ${f.bg} ${f.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <f.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Clerk sign-in card */}
        <div className="flex justify-center lg:justify-end z-10 w-full animate-pop-up" style={{ animationDelay: '120ms' }}>
          <div className="glass-panel p-3 sm:p-4 glow-border shadow-2xl w-full max-w-[420px]">
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'mx-auto w-full',
                  card: 'bg-transparent shadow-none m-0 rounded-3xl border-none p-2',
                  headerTitle: 'font-archivo font-black text-2xl text-foreground',
                  headerSubtitle: 'font-manrope font-medium text-muted-foreground',
                  socialButtonsBlockButton:
                    'rounded-2xl border border-border bg-card/60 hover:bg-muted/60 ' +
                    'transition-all duration-200 text-foreground font-semibold h-11 ' +
                    'backdrop-blur-sm hover:-translate-y-px active:translate-y-0',
                  socialButtonsBlockButtonText: 'font-archivo font-semibold',
                  dividerLine: 'bg-border',
                  dividerText: 'text-muted-foreground font-semibold text-xs',
                  formFieldLabel: 'text-foreground/80 font-bold text-xs uppercase tracking-wider',
                  formFieldInput:
                    'rounded-xl border border-border bg-input-background h-11 text-foreground ' +
                    'font-medium focus:ring-2 focus:ring-physiology/30 focus:border-physiology ' +
                    'transition-all placeholder:text-muted-foreground',
                  formButtonPrimary:
                    'bg-physiology hover:bg-physiology-dark transition-all duration-200 rounded-xl h-11 ' +
                    'font-archivo font-bold text-sm shadow-md shadow-physiology/25 ' +
                    'hover:-translate-y-px active:translate-y-0 active:shadow-sm',
                  footerActionText: 'text-muted-foreground font-medium',
                  footerActionLink: 'text-physiology hover:text-physiology-dark font-bold transition-colors',
                  identityPreviewText: 'text-foreground font-semibold',
                  identityPreview: 'rounded-xl bg-muted/50 border border-border',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
