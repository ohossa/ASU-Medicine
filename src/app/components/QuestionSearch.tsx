// src/app/components/QuestionSearch.tsx
// ASU Medical Portal — Ain Shams University
// Search engine across all database questions and answers.

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowLeft, BookOpen, Flag, FileText, Check, X, ShieldAlert,
  CornerDownRight, LayoutGrid, HelpCircle
} from "lucide-react";
import { SYLLABUS_MODULES, getChaptersForModuleAndMode, isModuleActive } from "../data";
import { toggleFlaggedQuestion, getFlaggedQuestions } from "../utils/storage";
import type { Question } from "../types";

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

interface SearchEntry {
  question: Question;
  chapterTitle: string;
  moduleName: string;
  moduleCode: string;
  subjectName: string;
}

interface QuestionSearchProps {
  onBack: () => void;
}

const getSearchableQuestions = (): SearchEntry[] => {
  const list: SearchEntry[] = [];
  for (const year of Object.keys(SYLLABUS_MODULES)) {
    const semesters = SYLLABUS_MODULES[Number(year)];
    for (const sem of Object.keys(semesters)) {
      const modules = semesters[Number(sem)];
      for (const mod of modules) {
        if (isModuleActive(mod.code)) {
          const chapters = getChaptersForModuleAndMode(mod.code, "mixed");
          chapters.forEach((chapter) => {
            chapter.subjects.forEach((subject) => {
              subject.questions.forEach((q) => {
                list.push({
                  question: q,
                  chapterTitle: chapter.title,
                  moduleName: mod.name,
                  moduleCode: mod.code,
                  subjectName: subject.name,
                });
              });
            });
          });
        }
      }
    }
  }
  return list;
};

/* Accessors — single place to adapt to your Question shape */
const qText = (q: Question): string => (q as any).text ?? (q as any).question ?? "";
const qAnswerText = (q: Question): string => {
  const anyQ = q as any;
  if (anyQ.options && typeof anyQ.correctIndex === "number") {
    return anyQ.options[anyQ.correctIndex] ?? "";
  }
  return anyQ.answer ?? "";
};
const isMcq = (q: Question): boolean =>
  Array.isArray((q as any).options) && (q as any).options.length > 0;

/* ------------------------------------------------------------------ */
/* Match highlighting                                                  */
/* ------------------------------------------------------------------ */

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  const safe = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={i}
            className="rounded-[3px] bg-amber-400/25 px-0.5 text-amber-200"
            style={{ background: "rgba(251,191,36,0.22)", color: "#fcd34d" }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Styles (Apple dark-mode tokens)                                     */
/* ------------------------------------------------------------------ */

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.045)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const hairline = "1px solid rgba(255,255,255,0.08)";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function QuestionSearch({ onBack }: QuestionSearchProps) {
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [revealed, setRevealed] = useState<Set<string | number>>(new Set());
  const [flagged, setFlagged] = useState<Set<string>>(
    () => new Set(getFlaggedQuestions().map(String))
  );

  const allEntries = useMemo(getSearchableQuestions, []);

  const modules = useMemo(() => {
    const map = new Map<string, string>();
    allEntries.forEach((e) => map.set(e.moduleCode, e.moduleName));
    return Array.from(map.entries());
  }, [allEntries]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((e) => {
      if (moduleFilter !== "all" && e.moduleCode !== moduleFilter) return false;
      if (flaggedOnly && !flagged.has(String((e.question as any).id))) return false;
      if (!q) return true;
      return (
        qText(e.question).toLowerCase().includes(q) ||
        qAnswerText(e.question).toLowerCase().includes(q) ||
        e.chapterTitle.toLowerCase().includes(q) ||
        e.subjectName.toLowerCase().includes(q) ||
        e.moduleName.toLowerCase().includes(q)
      );
    });
  }, [allEntries, query, moduleFilter, flaggedOnly, flagged]);

  const handleFlag = useCallback((id: string) => {
    toggleFlaggedQuestion(id);
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleReveal = (id: string | number) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const activeFilterCount = (moduleFilter !== "all" ? 1 : 0) + (flaggedOnly ? 1 : 0);

  return (
    <div
      className="min-h-screen w-full text-neutral-200 antialiased"
      style={{ background: "#0b0b0c", fontFamily: "-apple-system, 'SF Pro Text', Inter, sans-serif" }}
    >
      {/* ---------- Sticky header ---------- */}
      <header
        className="sticky top-0 z-30 px-4 pb-3 pt-4 sm:px-8"
        style={{
          background: "rgba(11,11,12,0.78)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderBottom: hairline,
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:scale-95"
            style={{ border: hairline }}
          >
            <ArrowLeft size={16} />
          </button>

          {/* Search field */}
          <div
            className="flex h-11 flex-1 items-center gap-2.5 rounded-2xl px-3.5"
            style={glass}
          >
            <Search size={16} className="shrink-0 text-neutral-500" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions, answers, chapters…"
              className="h-full w-full bg-transparent text-[15px] text-neutral-100 placeholder-neutral-500 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-neutral-400 transition-colors hover:bg-white/20"
              >
                <X size={11} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Filters"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:scale-95"
            style={{
              border: hairline,
              background: showFilters ? "rgba(255,255,255,0.1)" : "transparent",
            }}
          >
            <Search size={15} />
            {activeFilterCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ---------- Filter panel ---------- */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              className="mx-auto max-w-5xl overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2 pt-3">
                <FilterChip
                  active={moduleFilter === "all"}
                  onClick={() => setModuleFilter("all")}
                  icon={<LayoutGrid size={12} />}
                  label="All modules"
                />
                {modules.map(([code, name]) => (
                  <FilterChip
                    key={code}
                    active={moduleFilter === code}
                    onClick={() => setModuleFilter(code)}
                    label={name}
                  />
                ))}
                <span className="mx-1 h-4 w-px bg-white/10" />
                <FilterChip
                  active={flaggedOnly}
                  onClick={() => setFlaggedOnly((v) => !v)}
                  icon={<Flag size={12} />}
                  label="Flagged only"
                  activeColor="#f59e0b"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ---------- Results ---------- */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
        <p className="mb-4 text-[13px] tabular-nums text-neutral-500">
          {results.length.toLocaleString()} question{results.length === 1 ? "" : "s"}
          {query.trim() && <> matching “{query.trim()}”</>}
        </p>

        {results.length === 0 ? (
          <EmptyState query={query} flaggedOnly={flaggedOnly} />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <AnimatePresence initial={false}>
              {results.slice(0, 100).map((entry) => {
                const q = entry.question;
                const id = (q as any).id as string | number;
                const isExpanded = expandedId === id;
                const isRevealed = revealed.has(id);
                const isFlagged = flagged.has(String(id));

                return (
                  <motion.article
                    key={`${entry.moduleCode}-${id}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className={`overflow-hidden rounded-2xl ${isExpanded ? "lg:col-span-2" : ""}`}
                    style={glass}
                  >
                    {/* Card header */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : id)}
                      className="block w-full px-5 pb-4 pt-4 text-left transition-colors hover:bg-white/[0.03]"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px] font-medium tracking-wide text-neutral-500">
                        <BookOpen size={11} />
                        <span className="text-neutral-400">{entry.moduleName}</span>
                        <CornerDownRight size={10} />
                        <span>{entry.chapterTitle}</span>
                        <span className="text-neutral-600">·</span>
                        <span>{entry.subjectName}</span>
                        {isFlagged && (
                          <span className="ml-auto flex items-center gap-1 text-amber-400">
                            <Flag size={11} fill="currentColor" /> Flagged
                          </span>
                        )}
                      </div>
                      <h3 className="text-[15px] font-medium leading-snug text-neutral-100">
                        <Highlight text={qText(q)} query={query} />
                      </h3>
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-500">
                        {isMcq(q) ? <LayoutGrid size={11} /> : <FileText size={11} />}
                        <span>{isMcq(q) ? "Multiple choice" : "Written answer"}</span>
                      </div>
                    </button>

                    {/* Expanded body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        >
                          <div className="px-5 pb-5" style={{ borderTop: hairline }}>
                            {/* MCQ options */}
                            {isMcq(q) && (
                              <ul className="mt-4 space-y-2">
                                {(q as any).options.map((opt: string, i: number) => {
                                  const correct = i === (q as any).correctIndex;
                                  const show = isRevealed && correct;
                                  return (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-[14px] transition-colors"
                                      style={{
                                        border: show
                                          ? "1px solid rgba(52,211,153,0.4)"
                                          : hairline,
                                        background: show
                                          ? "rgba(52,211,153,0.08)"
                                          : "rgba(255,255,255,0.02)",
                                      }}
                                    >
                                      <span className="mt-0.5 shrink-0">
                                        {show ? (
                                          <Check size={14} className="text-emerald-400" />
                                        ) : (
                                          <span className="text-[12px] text-neutral-500">
                                            {String.fromCharCode(65 + i)}.
                                          </span>
                                        )}
                                      </span>
                                      <Highlight text={opt} query={query} />
                                    </li>
                                  );
                                })}
                              </ul>
                            )}

                            {/* Written answer */}
                            {!isMcq(q) && isRevealed && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 rounded-xl px-4 py-3 text-[14px] leading-relaxed text-emerald-100"
                                style={{
                                  border: "1px solid rgba(52,211,153,0.35)",
                                  background: "rgba(52,211,153,0.07)",
                                }}
                              >
                                <Highlight text={qAnswerText(q)} query={query} />
                              </motion.div>
                            )}

                            {/* Explanation */}
                            {isRevealed && (q as any).explanation && (
                              <div className="mt-3 flex gap-2 rounded-xl bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-neutral-400">
                                <HelpCircle size={14} className="mt-0.5 shrink-0 text-neutral-500" />
                                <p>{(q as any).explanation}</p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex items-center gap-2">
                              <ActionButton
                                primary
                                onClick={() => toggleReveal(id)}
                                icon={isRevealed ? <X size={13} /> : <Check size={13} />}
                                label={isRevealed ? "Hide answer" : "Reveal answer"}
                              />
                              <ActionButton
                                onClick={() => handleFlag(String(id))}
                                icon={
                                  <Flag
                                    size={13}
                                    fill={isFlagged ? "currentColor" : "none"}
                                    className={isFlagged ? "text-amber-400" : ""}
                                  />
                                }
                                label={isFlagged ? "Unflag" : "Flag"}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {results.length > 100 && (
          <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-neutral-500">
            <ShieldAlert size={13} />
            Showing first 100 results — refine your search to narrow down.
          </p>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

const FilterChip: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  activeColor?: string;
}> = ({ active, onClick, label, icon, activeColor = "#3b82f6" }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all active:scale-95"
    style={{
      border: active ? `1px solid ${activeColor}66` : "1px solid rgba(255,255,255,0.08)",
      background: active ? `${activeColor}1f` : "rgba(255,255,255,0.04)",
      color: active ? activeColor : "rgba(255,255,255,0.65)",
    }}
  >
    {icon}
    {label}
  </button>
);

const ActionButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}> = ({ onClick, icon, label, primary }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-all hover:brightness-110 active:scale-95"
    style={{
      border: "1px solid rgba(255,255,255,0.1)",
      background: primary ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.05)",
      color: primary ? "#93c5fd" : "rgba(255,255,255,0.75)",
    }}
  >
    {icon}
    {label}
  </button>
);

const EmptyState: React.FC<{ query: string; flaggedOnly: boolean }> = ({ query, flaggedOnly }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center gap-3 rounded-3xl py-20 text-center"
    style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
  >
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <Search size={22} className="text-neutral-500" />
    </div>
    <p className="text-[15px] font-medium text-neutral-300">No questions found</p>
    <p className="max-w-xs text-[13px] leading-relaxed text-neutral-500">
      {flaggedOnly
        ? "No flagged questions match. Try disabling the flagged filter."
        : query.trim()
        ? `Nothing matches “${query.trim()}”. Try a broader term or different module.`
        : "No active modules contain questions yet."}
    </p>
  </motion.div>
);
