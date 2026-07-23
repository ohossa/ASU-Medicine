import { Activity, Check, Layers3 } from "lucide-react";
import "./premium-cards.css";

/* ════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ════════════════════════════════════════════════════════════ */

/* Micro-grain: inline SVG turbulence, tiled. Reads as satin glass
   at 4–5% opacity with overlay blending. */
const NOISE =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/* Card shell: neon hairline border (dual-background compositing) +
   frosted body + grain + animated mesh blob behind content. */
export function CardShell({
  accent,
  accent2,
  blobPos = "85% 8%",
  className = "",
  children,
  onClick,
  style = {},
}: {
  accent: string;
  accent2?: string;
  blobPos?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}) {
  const hasPosition = /\b(absolute|relative|fixed|sticky)\b/.test(className);
  return (
    <div
      onClick={onClick}
      className={`${hasPosition ? "" : "relative"} overflow-hidden rounded-[28px] p-[1px] ${className}`}
      style={{
        /* Bioluminescent hairline: gradient drawn only in the 1px border
           area via padding-box/border-box compositing */
        background: `linear-gradient(140deg, ${accent}66, ${accent}14 35%, ${
          accent2 ?? accent
        }55 100%) border-box`,
        boxShadow: `0 0 24px -8px ${accent}40, 0 24px 48px -24px rgba(0,0,0,0.5)`,
        ...style,
      }}
    >
      <div className="relative h-full rounded-[27px] bg-white/85 dark:bg-[#101013]/85 backdrop-blur-2xl">
        {/* Pulsing organic mesh blob */}
        <div
          className="pointer-events-none absolute inset-0 animate-mesh-pulse"
          style={{
            background: `
              radial-gradient(340px 260px at ${blobPos}, ${accent}2e, transparent 65%),
              radial-gradient(280px 320px at 30% 110%, ${accent2 ?? accent}1a, transparent 60%)`,
          }}
        />
        {/* Satin grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[27px] opacity-[0.045] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}

/* Icon in a circular frosted-glass badge enclosure */
export function IconBadge({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <span
      className="grid h-12 w-12 place-items-center rounded-full backdrop-blur-md
                 bg-white/40 dark:bg-white/[0.06]
                 border border-white/50 dark:border-white/[0.12]"
      style={{ color: accent, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 0 16px -6px ${accent}80` }}
    >
      {children}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   1. YEAR CARD — Foundations / PRE-CLERKSHIP
   ════════════════════════════════════════════════════════════ */
const SYSTEMS = ["CNS", "Special Senses", "Endocrine"];

export function YearCard() {
  const pct = 27 / 50;
  const R = 52, C = 2 * Math.PI * R;
  return (
    <CardShell accent="#3b82f6" accent2="#a855f7" blobPos="80% 0%" className="w-[320px]">
      <div className="flex flex-col gap-6 p-7">
        {/* Glowing Year badge */}
        <span
          className="self-start rounded-full px-4 py-1.5 font-heading text-[12px] font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #a855f7)",
            boxShadow: "0 0 18px -4px #3b82f688",
          }}
        >
          Year 2
        </span>

        {/* Progress wheel — Credit Points dial */}
        <div className="relative mx-auto">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={R} fill="none" strokeWidth="9"
                    className="stroke-zinc-200/70 dark:stroke-white/[0.07]" />
            <defs>
              <linearGradient id="yc-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle
              cx="70" cy="70" r={R} fill="none" strokeWidth="9"
              stroke="url(#yc-grad)" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
              style={{ filter: "drop-shadow(0 0 6px #3b82f680)" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-heading text-[22px] font-black leading-none">27<span className="text-[13px] text-zinc-400">/50</span></p>
              <p className="mt-1 text-[9px] font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-500">CREDIT POINTS</p>
            </div>
          </div>
        </div>
        <p className="text-center text-[12px] text-zinc-500 dark:text-zinc-400 -mt-3">
          Total Marks: <strong className="text-zinc-900 dark:text-zinc-100">1080</strong>
        </p>

        <div>
          <h3 className="font-heading text-[21px] font-black tracking-tight">Foundations</h3>
          <p className="mt-0.5 text-[10px] font-bold tracking-[0.28em] text-zinc-400 dark:text-zinc-500">
            PRE-CLERKSHIP
          </p>
        </div>

        {/* Active systems mini-list with status checks */}
        <div className="flex flex-wrap gap-2">
          {SYSTEMS.map(s => (
            <span key={s}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold
                             bg-white/50 dark:bg-white/[0.05] backdrop-blur-md
                             border border-white/60 dark:border-white/[0.09]
                             text-zinc-600 dark:text-zinc-300">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#22c55e]/15 text-[#22c55e]">
                <Check size={9} strokeWidth={3.5} />
              </span>
              {s}
            </span>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

/* ════════════════════════════════════════════════════════════
   2. MODULE CARD — MCNS-2 Central Nervous System
   ════════════════════════════════════════════════════════════ */
export function ModuleCard() {
  const pct = 45, R = 17, C = 2 * Math.PI * R;
  return (
    <CardShell accent="#22c55e" blobPos="92% 4%" className="w-[340px]">
      <div className="flex flex-col p-6">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold tracking-[0.24em] text-zinc-400 dark:text-zinc-500">
            MCNS-2
          </span>
          {/* Glowing pulsing Live pill */}
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold
                           bg-[#22c55e]/12 text-[#22c55e] border border-[#22c55e]/30"
                style={{ boxShadow: "0 0 14px -4px #22c55e90" }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            </span>
            Live (260 questions)
          </span>
        </div>

        <h3 className="mt-5 font-heading text-[19px] font-bold leading-snug tracking-tight">
          Central Nervous System Module
        </h3>

        {/* Mini stat blocks with hairline divider */}
        <div className="mt-5 flex items-center rounded-2xl border border-white/50 dark:border-white/[0.08]
                        bg-white/40 dark:bg-white/[0.04] backdrop-blur-md">
          <div className="flex-1 p-3.5 text-center">
            <p className="font-heading text-[18px] font-black">13</p>
            <p className="text-[9px] font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-500">CP</p>
          </div>
          <span className="h-9 w-px bg-zinc-200/80 dark:bg-white/[0.09]" />
          <div className="flex-1 p-3.5 text-center">
            <p className="font-heading text-[18px] font-black">260</p>
            <p className="text-[9px] font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-500">MARKS</p>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <a href="#start" className="font-heading text-[14px] font-bold text-[#22c55e]
                                      transition-all hover:drop-shadow-[0_0_8px_#22c55e80]">
            Start →
          </a>
          {/* Glowing circular completion chart */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">45% Completed</span>
            <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
              <circle cx="22" cy="22" r={R} fill="none" strokeWidth="4"
                      className="stroke-zinc-200/70 dark:stroke-white/[0.08]" />
              <defs>
                <linearGradient id="mc-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#86efac" />
                </linearGradient>
              </defs>
              <circle cx="22" cy="22" r={R} fill="none" strokeWidth="4"
                      stroke="url(#mc-grad)" strokeLinecap="round"
                      strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
                      style={{ filter: "drop-shadow(0 0 5px #22c55e90)" }} />
            </svg>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/* ════════════════════════════════════════════════════════════
   3. STUDY MODE CARD — MCQ Practice Mode
   ════════════════════════════════════════════════════════════ */
export function StudyModeCard() {
  return (
    <CardShell accent="#22c55e" blobPos="90% 0%" className="w-[340px]">
      <div className="flex flex-col p-6">
        <IconBadge accent="#22c55e"><Activity size={21} /></IconBadge>

        <h3 className="mt-5 font-heading text-[19px] font-bold tracking-tight">MCQ Practice Mode</h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          Loads only multiple-choice, true/false, and fill-in-the-blank questions for rapid recall.
        </p>

        {/* Glowing heartbeat waveform — drawn live via dash animation */}
        <svg viewBox="0 0 280 48" className="mt-5 w-full" fill="none">
          <path
            d="M0 24 H70 L82 24 L92 8 L104 40 L114 16 L122 24 H170 L180 24 L188 14 L198 34 L206 24 H280"
            stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
            className="animate-ekg"
            style={{ filter: "drop-shadow(0 0 5px #22c55e) drop-shadow(0 0 14px #22c55e60)" }}
          />
        </svg>

        {/* Stat block + CTA */}
        <div className="mt-5 flex items-center justify-between rounded-2xl border p-4
                        border-white/50 dark:border-white/[0.08]
                        bg-white/40 dark:bg-white/[0.04] backdrop-blur-md">
          <div>
            <p className="font-heading text-[20px] font-black leading-none">847</p>
            <p className="mt-1 text-[9px] font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              QUESTIONS AVAILABLE
            </p>
          </div>
          <a href="#start"
             className="rounded-full px-4 py-2 font-heading text-[13px] font-bold text-[#22c55e]
                        border border-[#22c55e]/30 transition-all duration-300
                        hover:shadow-[0_0_0_3px_rgba(34,197,94,0.18),0_0_20px_-4px_#22c55e]
                        hover:border-[#22c55e]/60">
            Start Practice →
          </a>
        </div>
      </div>
    </CardShell>
  );
}

/* Optional showcase row */
export default function PremiumCardsDemo() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8 p-12
                    bg-[#fafafa] dark:bg-[#0a0a0a] min-h-screen font-body
                    text-zinc-900 dark:text-zinc-100">
      <YearCard />
      <ModuleCard />
      <StudyModeCard />
      <Layers3 className="hidden" /> {/* keep tree-shaker honest in demos */}
    </div>
  );
}
