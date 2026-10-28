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

  const statIcons: Record<string, any> = {
    new: AlertCircle,
    reviewing: Clock,
    fixed: CheckCircle2,
    dismissed: ShieldCheck,
  };

  const statColors: Record<string, string> = {
    new: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    reviewing: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
    fixed: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dismissed: "text-stone-600 dark:text-stone-400 bg-stone-500/10 border-stone-500/20",
  };

  return (
    <div className="admin-overview-container space-y-6">
      {/* 4 Apple Studio Stat Cards */}
      <div className="admin-stat-grid">
        {(Object.keys(labels) as Array<keyof typeof labels>).map((s) => {
          const Icon = statIcons[s] || Inbox;
          const colorClass = statColors[s] || "";
          return (
            <div className={`admin-surface admin-stat ${colorClass}`} key={s}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
                  {labels[s]} reports
                </span>
                <Icon size={18} />
              </div>
              <strong className="text-3xl font-bold tracking-tight">
                {format(reports.counts[s as keyof typeof reports.counts])}
              </strong>
            </div>
          );
        })}
      </div>

      {/* Review Backlog Section */}
      <section className="admin-surface admin-detail">
        <div className="admin-overview-heading flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 m-0">
              Review backlog
            </h2>
            <p className="report-muted mt-1">
              {format(reports.unresolved)} unresolved reports across{" "}
              {format(reports.unresolvedQuestions)}{" "}
              {reports.unresolvedQuestions === 1 ? "question" : "questions"}.
            </p>
          </div>
          <Link
            to="/admin/reports?status=unresolved"
            className="report-primary inline-flex items-center gap-2"
          >
            Review reports
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-6">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 m-0">
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
                    className="admin-priority-link block p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 hover:bg-stone-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="admin-meta font-medium text-teal-700 dark:text-teal-400 block mb-1">
                          {q.moduleCode} · {q.subjectName} ·{" "}
                          {q.topicName || q.chapterTitle}
                        </span>
                        <p className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 text-sm m-0">
                          {cleanQuestionStem(q.text)}
                        </p>
                      </div>
                      <span className="admin-priority-count shrink-0 text-right bg-stone-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300">
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {q.unresolvedCount} reports
                        </span>
                        <span className="block text-stone-500 text-[11px]">
                          {q.reporterCount} students
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-center py-8 bg-stone-50/50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
              <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500" />
              <p className="report-muted m-0 font-medium">
                No unresolved reports. Your inbox is clear.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI Tutor Telemetry Section */}
      <section className="admin-surface admin-detail">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
          <Cpu size={18} className="text-teal-600" />
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 m-0">
              AI tutor usage
            </h2>
            <p className="report-muted text-xs mt-0.5">
              Website activity today · Africa/Cairo · Groq
            </p>
          </div>
        </div>

        {data.tutorError && (
          <p role="alert" className="report-error mt-4">
            {data.tutorError}
          </p>
        )}

        {tutor && (
          <>
            <div className="admin-stat-grid mt-5">
              {[
                ["Requests", tutor.requests],
                ["Successful", tutor.successes],
                ["Failed", tutor.failures],
                ["Tokens used", tutor.totalTokens],
              ].map(([label, value]) => (
                <div className="admin-stat bg-stone-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800/60" key={label}>
                  <strong className="text-2xl font-bold tracking-tight block">
                    {format(Number(value))}
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
              <div className="admin-quota mt-5 p-4 rounded-xl bg-stone-50 dark:bg-zinc-900/40 border border-stone-200/80 dark:border-stone-800/80">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 m-0">
                  Latest provider quota reading
                </h3>
                <p className="report-muted text-xs mt-0.5 mb-3">
                  Observed{" "}
                  {new Date(tutor.quota.observedAt).toLocaleString(undefined, {
                    timeZone: "Africa/Cairo",
                  })}{" "}
                  (Cairo)
                </p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-stone-500 font-medium">Daily requests remaining</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100 mt-1">
                      {tutor.quota.remainingRequests === null
                        ? "Unavailable"
                        : format(tutor.quota.remainingRequests)}
                      {tutor.quota.requestLimit !== null
                        ? ` / ${format(tutor.quota.requestLimit)}`
                        : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 font-medium">Tokens remaining this minute</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100 mt-1">
                      {tutor.quota.remainingTokens === null
                        ? "Unavailable"
                        : format(tutor.quota.remainingTokens)}
                      {tutor.quota.tokenLimit !== null
                        ? ` / ${format(tutor.quota.tokenLimit)}`
                        : ""}
                    </dd>
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
    </div>
  );
}
