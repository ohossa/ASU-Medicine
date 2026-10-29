import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  ExternalLink,
  ChevronDown,
  BookOpen,
  Sparkles,
  Smartphone,
  GraduationCap,
  CheckCircle2,
  Clock,
  MessageCircle,
} from "lucide-react";
import { PortalShell } from "../app/components/PortalShell";
import {
  getModuleDeckGroups,
  getTotalAvailableDecksCount,
  resolveDirectDownloadUrl,
  getAnkiCommunityUrl,
} from "../app/data/ankiDecks";
import type { AnkiDeck } from "../app/data/ankiDecks";

interface AnkiDecksPageProps {
  onBack: () => void;
  userButton?: React.ReactNode;
  initialYear?: number;
}

const YEARS = [
  { id: 1, label: "Year 1", phase: "Foundations" },
  { id: 2, label: "Year 2", phase: "Foundations" },
  { id: 3, label: "Year 3", phase: "Transitional" },
  { id: 4, label: "Year 4", phase: "Clinical Phase" },
  { id: 5, label: "Year 5", phase: "Clinical Phase" },
];

export function AnkiDecksPage({
  onBack,
  userButton,
  initialYear = 3,
}: AnkiDecksPageProps) {
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const yr = Number(sp.get("year"));
      if (yr >= 1 && yr <= 5) return yr;
    } catch {}
    return initialYear;
  });
  const [selectedSemester, setSelectedSemester] = useState<number>(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const sem = Number(sp.get("semester") || sp.get("sem"));
      if (sem === 1 || sem === 2) return sem;
    } catch {}
    return 1;
  });
  const [guideOpen, setGuideOpen] = useState<boolean>(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.get("guide") === "1" || sp.get("guide") === "open";
    } catch {}
    return false;
  });

  const moduleGroups = getModuleDeckGroups(selectedYear, selectedSemester);
  const totalAvailableDecks = getTotalAvailableDecksCount();
  const communityUrl = getAnkiCommunityUrl();

  const crumbs = [{ label: "Portal", onClick: onBack }, { label: "Anki Flashcards" }];

  return (
    <PortalShell crumbs={crumbs} userButton={userButton}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
      >
        {/* ── Page Hero Header ────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl overflow-hidden shadow-md border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 p-1">
              <img
                src="/luro-anki-logo.png"
                alt="LURO Anki"
                className="h-full w-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Anki Flashcards
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300 border border-violet-500/20">
                  <Sparkles size={12} />
                  {totalAvailableDecks} Ready
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-bold text-sky-700 dark:text-sky-300 border border-sky-500/20">
                  LURO Edition
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Spaced-repetition flashcards packed with lecture diagrams and
                clinical photos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <a
              href={communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/40 px-4 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 active:scale-[0.98]"
              title="Join official LURO Anki WhatsApp community"
            >
              <svg className="w-4 h-4 fill-current text-emerald-600 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Group</span>
              <ExternalLink size={13} className="opacity-70" />
            </a>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
            >
              ← Return to Dashboard
            </button>
          </div>
        </div>

        {/* ── Humanized Instructions & iOS Guide Card ─────────────────── */}
        <section aria-labelledby="guide-heading" className="mb-8">
          <div className="overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-50/50 via-white to-white dark:from-violet-950/20 dark:via-[#141414] dark:to-[#141414] shadow-sm backdrop-blur-xl">
            <button
              type="button"
              id="guide-heading"
              onClick={() => setGuideOpen((prev) => !prev)}
              aria-expanded={guideOpen}
              className="flex w-full min-h-[52px] items-center justify-between p-5 sm:p-6 text-left cursor-pointer transition-colors hover:bg-violet-500/[0.03]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-600/15 text-violet-600 dark:bg-violet-400/20 dark:text-violet-300">
                  <BookOpen size={16} />
                </span>
                <div>
                  <h2 className="font-heading text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    New to Anki? Quick Setup & Mobile Guide
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    How cards are structured, where to get Anki, and free iOS
                    setup tips
                  </p>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`text-zinc-500 transition-transform duration-300 ${
                  guideOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {guideOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-zinc-200/60 dark:border-white/[0.06] px-5 pb-6 pt-5 sm:px-6"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: Card Design */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        <CheckCircle2 size={14} />
                        How these cards are built
                      </div>
                      <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        We kept the cards punchy and practical, packed with
                        lecture slides, textbook diagrams, and clinical figures.
                        Decks like GIT also include textbook page references at
                        the bottom, so if a question looks tricky, you can verify
                        it in your book right away.
                      </p>
                    </div>

                    {/* Column 2: First time setup */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        <GraduationCap size={14} />
                        First time using Anki?
                      </div>
                      <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Anki uses spaced repetition so you don&apos;t forget
                        early lectures before finals. If you&apos;ve never used
                        it, our Ain Shams tutorial covers card imports, recommended
                        interval settings, and key shortcuts:
                      </p>
                      <a
                        href="https://anki-asu.notion.site/Anki-Tutorials-Ain-shams-Medicine-e02ae973c7db41edb4ef7381495b0912"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 active:scale-[0.98] transition-all"
                      >
                        Open Ain Shams Anki Tutorial
                        <ExternalLink size={13} />
                      </a>
                    </div>

                    {/* Column 3: iOS & MemU */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        <Smartphone size={14} />
                        iPhone & iPad Users
                      </div>
                      <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Anki is completely free on Windows, Mac, and Android, but
                        the official iOS app costs $25 on the App Store. If you
                        want a free alternative that imports these{" "}
                        <code className="rounded bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.5 text-xs font-mono">
                          .apkg
                        </code>{" "}
                        packages with full image support, MemU works right away:
                      </p>
                      <a
                        href="https://apps.apple.com/us/app/memu-enhanced-flashcards/id6742653596"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all"
                      >
                        Get MemU on App Store (Free)
                        <ExternalLink size={13} />
                      </a>
                    </div>

                    {/* Column 4: WhatsApp Community */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <MessageCircle size={14} />
                        Anki Community Group
                      </div>
                      <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Have questions, want to request cards, or discuss card edits? Join our student WhatsApp group for active updates and support:
                      </p>
                      <a
                        href={communityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition-all"
                      >
                        Join WhatsApp Group
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Academic Year Selector Tabs ─────────────────────────────── */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              Select Academic Year
            </h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {YEARS.find((y) => y.id === selectedYear)?.phase}
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Academic Years"
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            {YEARS.map((year) => {
              const isSelected = selectedYear === year.id;
              return (
                <button
                  key={year.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedYear(year.id)}
                  className={`inline-flex min-h-[44px] min-w-[100px] shrink-0 items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 ${
                    isSelected
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {year.label}
                </button>
              );
            })}
          </div>

          {/* ── Semester Toggle Control ───────────────────────────────── */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mr-2">
              Semester:
            </span>
            <div
              role="tablist"
              aria-label="Semesters"
              className="inline-flex rounded-xl bg-zinc-200/70 p-1 dark:bg-zinc-800/80 border border-zinc-300/40 dark:border-white/5"
            >
              {[1, 2].map((sem) => {
                const isSelected = selectedSemester === sem;
                return (
                  <button
                    key={sem}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedSemester(sem)}
                    className={`inline-flex min-h-[40px] items-center justify-center rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer focus-visible:outline-none ${
                      isSelected
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    }`}
                  >
                    Semester {sem}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Module Cards Grid ───────────────────────────────────────── */}
        <section
          aria-label={`Modules for Year ${selectedYear} Semester ${selectedSemester}`}
          className="pb-16"
        >
          {moduleGroups.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-white/10 p-12 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No active modules scheduled for this semester.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {moduleGroups.map((group) => {
                const { module: mod, decks } = group;
                const hasReadyDecks = decks.some((d) => d.isAvailable);

                return (
                  <div
                    key={mod.code}
                    className={`flex flex-col justify-between rounded-3xl border p-5 sm:p-6 transition-all duration-300 bg-white dark:bg-[#141414] ${
                      hasReadyDecks
                        ? "border-violet-500/40 shadow-sm hover:shadow-md hover:border-violet-500/60 dark:border-violet-500/30"
                        : "border-zinc-200/80 dark:border-white/[0.07] opacity-95"
                    }`}
                  >
                    <div>
                      {/* Card Header: Module Badge & Code */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-zinc-100 dark:bg-white/10 px-3 py-1 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                          {mod.code}
                        </span>
                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          {mod.cp} CP
                        </span>
                      </div>

                      {/* Module Title */}
                      <h3 className="mt-3 font-heading text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                        {mod.name}
                      </h3>

                      {/* Cards within this module */}
                      <div className="mt-4 space-y-3">
                        {decks.map((deck) => (
                          <DeckItem key={deck.id} deck={deck} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </motion.div>
    </PortalShell>
  );
}

function DeckItem({ deck }: { deck: AnkiDeck }) {
  const directDownloadUrl = resolveDirectDownloadUrl(deck.downloadUrl);

  if (!deck.isAvailable || !directDownloadUrl) {
    return (
      <div className="rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {deck.title}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200/60 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
            <Clock size={10} />
            In Prep
          </span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
          {deck.description}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-50/40 dark:bg-violet-950/20 p-4 transition-colors hover:border-violet-500/40">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-violet-950 dark:text-violet-200">
          {deck.title}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
          Ready
        </span>
      </div>

      <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
        {deck.description}
      </p>

      {/* Meta tags & download pill */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-violet-500/10">
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          {deck.cardCount && (
            <span>
              <strong>{deck.cardCount}</strong> cards
            </span>
          )}
          {deck.fileSize && <span>• {deck.fileSize}</span>}
        </div>

        <a
          href={directDownloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          aria-label={`Download ${deck.title} flashcards`}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-[0.97] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-zinc-950"
        >
          <Download size={14} />
          Download .apkg
        </a>
      </div>
    </div>
  );
}
