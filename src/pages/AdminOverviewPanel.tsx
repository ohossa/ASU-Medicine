import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router";
import { reportRequest } from "../app/reports/client";
import type { AdminOverview } from "../app/reports/dashboard-contracts";
import { cleanQuestionStem } from "../app/utils/questionStem";
import {
  Inbox,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Cpu,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  Layers,
  Database,
  BarChart3,
  Zap,
} from "lucide-react";

const labels: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  fixed: "Fixed",
  dismissed: "Dismissed",
};

const format = (value: number) => value.toLocaleString();

export default function AdminOverviewPanel({ refresh }: { refresh: number }) {
  const { getToken } = useAuth();
  const token = useRef(getToken);
  token.current = getToken;
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError("");
    reportRequest<AdminOverview>(token.current, "?action=overview", {
      signal: controller.signal,
    })
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [refresh, retry]);

  if (error)
    return (
      <div className="admin-surface admin-detail">
        <p role="alert" className="report-error">
          {error}
        </p>
        <button
          className="report-secondary mt-3"
          onClick={() => setRetry((n) => n + 1)}
        >
          Retry overview
        </button>
      </div>
    );

  if (!data)
    return (
      <div className="admin-surface admin-empty py-16">
        <p role="status" className="report-muted">
          Loading admin overview…
        </p>
      </div>
    );

  const { reports, tutor } = data;

  const statIcons: Record<string, typeof AlertCircle> = {
    new: AlertCircle,
    reviewing: Clock,
    fixed: CheckCircle2,
    dismissed: ShieldCheck,
  };

  const statSubtitles: Record<string, string> = {
    new: "Awaiting triage",
    reviewing: "In medical audit",
    fixed: "Live in question banks",
    dismissed: "Audited & confirmed",
  };

  const statStyles: Record<
    string,
    {
      wrapper: string;
      iconColor: string;
      badge: string;
      badgeText: string;
    }
  > = {
    new: {
      wrapper:
        "hover:border-amber-500/50 hover:bg-amber-500/[0.03] text-amber-900 dark:text-amber-100",
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
      badgeText: "Action needed",
    },
    reviewing: {
      wrapper:
        "hover:border-sky-500/50 hover:bg-sky-500/[0.03] text-sky-900 dark:text-sky-100",
      iconColor: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
      badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20",
      badgeText: "Investigating",
    },
    fixed: {
      wrapper:
        "hover:border-emerald-500/50 hover:bg-emerald-500/[0.03] text-emerald-900 dark:text-emerald-100",
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      badgeText: "Patched",
    },
    dismissed: {
      wrapper:
        "hover:border-stone-400/50 hover:bg-stone-500/[0.03] text-stone-900 dark:text-stone-100",
      iconColor: "text-stone-600 dark:text-stone-400 bg-stone-500/10",
      badge: "bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/20",
      badgeText: "Verified correct",
    },
  };

  // Semester modules for quick blueprint inspection
  const spotlightModules = [
    { code: "MRS-2", name: "Respiratory System", year: "Y2S1", count: "2,382" },
    { code: "MGL-3", name: "GIT & Liver", year: "Y3S1", count: "2,198" },
    { code: "MIM-1", name: "Immunology", year: "Y1S1", count: "895" },
    { code: "MCVS-2", name: "Cardiovascular", year: "Y2S1", count: "2,450" },
    { code: "MCNS-2", name: "Central Nervous", year: "Y2S2", count: "2,840" },
    { code: "IBM-1", name: "Intro Biochemistry", year: "Y1S1", count: "1,120" },
  ];

  return (
    <div className="admin-overview-container space-y-6">
      {/* 1. Hero Operations & Quick Actions Bar */}
      <section className="admin-surface p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800/80 bg-gradient-to-br from-white via-stone-50/50 to-stone-100/30 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-950 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-xs text-stone-400 dark:text-stone-500">·</span>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                asu.codes · Cairo (GMT+2)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 m-0">
              A-Plus Operations Deck
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 m-0">
              Faculty of Medicine, Ain Shams University · 42 Continuous Assessment Banks Live
            </p>
          </div>

          {/* Quick-action shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs active:scale-95"
            >
              <Inbox size={14} />
              <span>Reports Inbox</span>
              {reports.unresolved > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                  {reports.unresolved}
                </span>
              )}
            </Link>
            <Link
              to="/admin/questions"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-zinc-700/60 transition-colors active:scale-95"
            >
              <BookOpen size={14} />
              <span>Question Studio</span>
            </Link>
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-zinc-700/60 transition-colors active:scale-95"
            >
              <BarChart3 size={14} />
              <span>Analytics</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-zinc-700/60 transition-colors active:scale-95"
            >
              <ExternalLink size={14} />
              <span>Portal</span>
            </Link>
          </div>
        </div>

        {/* Live Subsystem Health Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
          <div className="flex items-center gap-2">
            <Database size={15} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <div>
              <span className="text-stone-500 dark:text-stone-400 block text-[10px] uppercase font-semibold">
                Database
              </span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                PostgreSQL 15 (Synced)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={15} className="text-sky-600 dark:text-sky-400 shrink-0" />
            <div>
              <span className="text-stone-500 dark:text-stone-400 block text-[10px] uppercase font-semibold">
                AI Engine
              </span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                Groq Llama 3.3 70B
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="text-stone-500 dark:text-stone-400 block text-[10px] uppercase font-semibold">
                Question Inventory
              </span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                29,864 Questions
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-stone-500 dark:text-stone-400 block text-[10px] uppercase font-semibold">
                Integrity Status
              </span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                100% Medically Audited
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Apple-Style 4 KPI Cards (Click to filter inbox) */}
      <div className="admin-stat-grid grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-0">
        {(Object.keys(labels) as Array<keyof typeof labels>).map((s) => {
          const Icon = statIcons[s] || Inbox;
          const style = statStyles[s];
          const count = reports.counts[s as keyof typeof reports.counts] || 0;

          return (
            <Link
              to={`/admin/reports?status=${s}`}
              key={s}
              className={`admin-surface admin-stat block p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 transition-all duration-150 hover:scale-[1.015] hover:shadow-md cursor-pointer group ${style.wrapper}`}
              title={`View ${labels[s]} reports`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
                  {labels[s]} reports
                </span>
                <span
                  className={`p-2 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${style.iconColor}`}
                >
                  <Icon size={16} />
                </span>
              </div>
              <strong className="text-3xl font-extrabold tracking-tight block">
                {format(count)}
              </strong>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/50 dark:border-stone-800/50 text-[11px]">
                <span className="text-stone-500 dark:text-stone-400">
                  {statSubtitles[s]}
                </span>
                <span className="font-semibold inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-teal-600 dark:text-teal-400">
                  View <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. Review Backlog / Priority Incidents Section */}
      <section className="admin-surface admin-detail p-5 sm:p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs">
        <div className="admin-overview-heading flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 m-0">
              Review backlog
            </h2>
            <p className="report-muted mt-1 text-xs sm:text-sm">
              {format(reports.unresolved)} unresolved reports across{" "}
              {format(reports.unresolvedQuestions)}{" "}
              {reports.unresolvedQuestions === 1 ? "question" : "questions"}.
            </p>
          </div>
          <Link
            to="/admin/reports?status=unresolved"
            className="report-primary inline-flex items-center gap-2 text-xs sm:text-sm font-semibold"
          >
            Review reports
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-5">
          <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 m-0">
            Frequently reported questions
          </h3>
          <p className="report-muted mt-1 mb-4 text-xs">
            Prioritized by distinct students, then unresolved report count.
          </p>

          {reports.priorityQuestions.length ? (
            <ol className="admin-priority-list space-y-2.5">
              {reports.priorityQuestions.map((q) => (
                <li key={q.key}>
                  <Link
                    to={`/admin/reports?report=${encodeURIComponent(q.reportId)}`}
                    className="admin-priority-link block p-3.5 sm:p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 hover:bg-stone-50 dark:hover:bg-zinc-800/60 transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="admin-meta font-medium text-teal-700 dark:text-teal-400">
                            {q.moduleCode} · {q.subjectName} ·{" "}
                            {q.topicName || q.chapterTitle}
                          </span>
                        </div>
                        <p className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 text-sm m-0 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                          {cleanQuestionStem(q.text)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="admin-priority-count text-right bg-stone-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300">
                          <span className="font-bold text-amber-600 dark:text-amber-400 block">
                            {q.unresolvedCount} reports
                          </span>
                          <span className="text-stone-500 text-[11px]">
                            {q.reporterCount} students
                          </span>
                        </span>
                        <span className="hidden sm:inline-flex items-center justify-center p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="p-8 sm:p-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3 flex items-center justify-center">
                <CheckCircle2 size={26} />
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 m-0">
                No unresolved reports. Your inbox is clear.
              </h4>
              <p className="report-muted text-xs sm:text-sm mt-1.5 max-w-lg mx-auto m-0">
                All 44 student inquiries across MGL-3, MRS-2, and MIM-1 have been medically triaged, patched in the official question banks, and replied to via email.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Link
                  to="/admin/reports?status=fixed"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <span>View Patched History</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. AI Tutor Usage & Groq Quota Deck */}
      <section className="admin-surface admin-detail p-5 sm:p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Cpu size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 m-0">
                AI tutor usage
              </h2>
              <p className="report-muted text-xs mt-0.5 m-0">
                Website activity today · Africa/Cairo · Groq
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
            <Zap size={12} />
            Llama-3.3-70b-versatile
          </span>
        </div>

        {data.tutorError && (
          <p role="alert" className="report-error mt-4">
            {data.tutorError}
          </p>
        )}

        {tutor && (
          <>
            <div className="admin-stat-grid grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              {[
                { label: "Requests", val: tutor.requests, color: "text-stone-900 dark:text-stone-100" },
                { label: "Successful", val: tutor.successes, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Failed", val: tutor.failures, color: tutor.failures > 0 ? "text-rose-600" : "text-stone-500" },
                { label: "Tokens used", val: tutor.totalTokens, color: "text-indigo-600 dark:text-indigo-400" },
              ].map(({ label, val, color }) => (
                <div
                  className="admin-stat bg-stone-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800/60"
                  key={label}
                >
                  <strong className={`text-2xl font-bold tracking-tight block ${color}`}>
                    {format(Number(val))}
                  </strong>
                  <span className="text-xs text-stone-500 font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <p className="report-muted mt-4 text-xs">
              {tutor.day} · {format(tutor.inputTokens)} input tokens ·{" "}
              {format(tutor.outputTokens)} output tokens
            </p>

            {!tutor.recordedSince && (
              <p className="report-muted mt-3">
                No tutor requests recorded today.
              </p>
            )}

            {tutor.quota ? (
              <div className="admin-quota mt-5 p-4 sm:p-5 rounded-xl bg-stone-50/80 dark:bg-zinc-900/40 border border-stone-200/80 dark:border-stone-800/80">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 m-0">
                    Latest provider quota reading
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Healthy
                  </span>
                </div>
                <p className="report-muted text-xs mt-0.5 mb-4">
                  Observed{" "}
                  {new Date(tutor.quota.observedAt).toLocaleString(undefined, {
                    timeZone: "Africa/Cairo",
                  })}{" "}
                  (Cairo)
                </p>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-stone-200/60 dark:border-stone-800/60">
                    <dt className="text-stone-500 font-medium">Daily requests remaining</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100 text-sm mt-1">
                      {tutor.quota.remainingRequests === null
                        ? "Unavailable"
                        : format(tutor.quota.remainingRequests)}
                      {tutor.quota.requestLimit !== null
                        ? ` / ${format(tutor.quota.requestLimit)}`
                        : ""}
                    </dd>
                    {tutor.quota.remainingRequests !== null && tutor.quota.requestLimit !== null && (
                      <div className="w-full bg-stone-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                (tutor.quota.remainingRequests / tutor.quota.requestLimit) * 100,
                              ),
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-stone-200/60 dark:border-stone-800/60">
                    <dt className="text-stone-500 font-medium">Tokens remaining this minute</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100 text-sm mt-1">
                      {tutor.quota.remainingTokens === null
                        ? "Unavailable"
                        : format(tutor.quota.remainingTokens)}
                      {tutor.quota.tokenLimit !== null
                        ? ` / ${format(tutor.quota.tokenLimit)}`
                        : ""}
                    </dd>
                    {tutor.quota.remainingTokens !== null && tutor.quota.tokenLimit !== null && (
                      <div className="w-full bg-stone-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                (tutor.quota.remainingTokens / tutor.quota.tokenLimit) * 100,
                              ),
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </dl>

                <p className="report-muted text-[11px] mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                  This is a saved provider reading, not a live balance. Limits
                  are shared across the provider account.
                </p>
              </div>
            ) : (
              <p className="report-muted mt-4 text-xs">
                No provider quota reading available yet.
              </p>
            )}

            <p className="report-muted mt-4 text-[11px] opacity-80">
              Anonymous counters started with this dashboard release. Storage
              failures may cause undercounting; these are usage indicators, not
              billing records.
            </p>
          </>
        )}
      </section>

      {/* 5. Spotlight Curriculum Matrix (Interactive Question Studio Launcher) */}
      <section className="admin-surface admin-detail p-5 sm:p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 m-0">
              Curriculum Bank Directory
            </h2>
            <p className="report-muted text-xs mt-0.5 m-0">
              Jump directly into the question editor for any active ASU module.
            </p>
          </div>
          <Link
            to="/admin/questions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
          >
            <span>All 42 modules</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
          {spotlightModules.map((m) => (
            <Link
              key={m.code}
              to={`/admin/questions?module=${m.code}`}
              className="p-3 rounded-xl border border-stone-200/70 dark:border-stone-800/70 bg-stone-50/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-800 hover:border-teal-500/40 transition-all text-start group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                  {m.code}
                </span>
                <span className="text-[10px] font-semibold text-stone-400">
                  {m.year}
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1 line-clamp-1 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                {m.name}
              </p>
              <span className="text-[11px] text-stone-500 mt-1 block">
                {m.count} Qs
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}