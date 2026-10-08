import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router";
import { reportRequest } from "../app/reports/client";
import type { AdminOverview } from "../app/reports/dashboard-contracts";
import { cleanQuestionStem } from "../app/utils/questionStem";
const labels = {
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
  const [data, setData] = useState<AdminOverview | null>(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
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
          className="report-secondary"
          onClick={() => setRetry((n) => n + 1)}
        >
          Retry overview
        </button>
      </div>
    );
  if (!data)
    return (
      <p role="status" className="report-muted">
        Loading admin overview…
      </p>
    );
  const { reports, tutor } = data;
  return (
    <>
      <div className="admin-stat-grid">
        {(Object.keys(labels) as Array<keyof typeof labels>).map((s) => (
          <div className="admin-surface admin-stat" key={s}>
            <strong>{format(reports.counts[s])}</strong>
            <span>{labels[s]} reports</span>
          </div>
        ))}
      </div>
      <section className="admin-surface admin-detail">
        <div className="admin-overview-heading">
          <div>
            <h2>Review backlog</h2>
            <p className="report-muted">
              {format(reports.unresolved)} unresolved reports across{" "}
              {format(reports.unresolvedQuestions)}{" "}
              {reports.unresolvedQuestions === 1 ? "question" : "questions"}.
            </p>
          </div>
          <Link
            to="/admin/reports?status=unresolved"
            className="report-primary"
          >
            Review reports
          </Link>
        </div>
        <h3 className="mt-6 mb-3">Frequently reported questions</h3>
        <p className="report-muted mb-4">
          Prioritized by distinct students, then unresolved report count.
        </p>
        {reports.priorityQuestions.length ? (
          <ol className="admin-priority-list">
            {reports.priorityQuestions.map((q) => (
              <li key={q.key}>
                <Link
                  to={`/admin/reports?report=${encodeURIComponent(q.reportId)}`}
                  className="admin-priority-link"
                >
                  <div>
                    <span className="admin-meta">
                      {q.moduleCode} · {q.subjectName} ·{" "}
                      {q.topicName || q.chapterTitle}
                    </span>
                    <p>{cleanQuestionStem(q.text)}</p>
                  </div>
                  <span className="admin-priority-count">
                    {q.unresolvedCount} reports
                    <br />
                    {q.reporterCount} students
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="report-muted">
            No unresolved reports. Your inbox is clear.
          </p>
        )}
      </section>
      <section className="admin-surface admin-detail mt-6">
        <h2>AI tutor usage</h2>
        <p className="report-muted">
          Website activity today · Africa/Cairo · Groq
        </p>
        {data.tutorError && (
          <p role="alert" className="report-error">
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
                <div className="admin-stat" key={label}>
                  <strong>{format(Number(value))}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="report-muted">
              {tutor.day} · {format(tutor.inputTokens)} input tokens ·{" "}
              {format(tutor.outputTokens)} output tokens
            </p>
            {!tutor.recordedSince && (
              <p className="report-muted mt-3">
                No tutor requests recorded today.
              </p>
            )}
            {tutor.quota ? (
              <div className="admin-quota mt-5">
                <h3>Latest provider quota reading</h3>
                <p className="report-muted">
                  Observed{" "}
                  {new Date(tutor.quota.observedAt).toLocaleString(undefined, {
                    timeZone: "Africa/Cairo",
                  })}{" "}
                  (Cairo)
                </p>
                <dl>
                  <div>
                    <dt>Daily requests remaining</dt>
                    <dd>
                      {tutor.quota.remainingRequests === null
                        ? "Unavailable"
                        : format(tutor.quota.remainingRequests)}
                      {tutor.quota.requestLimit !== null
                        ? ` / ${format(tutor.quota.requestLimit)}`
                        : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>Tokens remaining this minute</dt>
                    <dd>
                      {tutor.quota.remainingTokens === null
                        ? "Unavailable"
                        : format(tutor.quota.remainingTokens)}
                      {tutor.quota.tokenLimit !== null
                        ? ` / ${format(tutor.quota.tokenLimit)}`
                        : ""}
                    </dd>
                  </div>
                </dl>
                <p className="report-muted">
                  This is a saved provider reading, not a live balance. Limits
                  are shared across the provider account.
                </p>
              </div>
            ) : (
              <p className="report-muted mt-4">
                No provider quota reading available yet.
              </p>
            )}
            <p className="report-muted mt-4">
              Anonymous counters started with this dashboard release. Storage
              failures may cause undercounting; these are usage indicators, not
              billing records.
            </p>
          </>
        )}
      </section>
    </>
  );
}
