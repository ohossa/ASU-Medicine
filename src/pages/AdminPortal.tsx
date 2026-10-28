import type { SubQuestion } from "../app/types";
import {
  Copy,
  MessageSquare,
  BookOpen,
  BarChart3,
  Sparkles,
  ArrowLeft,
  Inbox,
  LayoutDashboard,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Mail,
  User,
  CheckCircle2,
  ExternalLink,
  Search,
  Check,
  Info,
} from "lucide-react";
import { ReplyComposer } from "./ReportReplyComposer";
import { reviewContext } from "../app/reports/review-context";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { PortalShell } from "../app/components/PortalShell";
import { cleanQuestionStem } from "../app/utils/questionStem";
import { reportRequest } from "../app/reports/client";
import {
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  type QuestionReport,
  type ReportList,
  type ReportStatus,
} from "../app/reports/contracts";
import "../app/reports/reports.css";
import AdminOverviewPanel from "./AdminOverviewPanel";
import AdminAnalyticsView from "./admin/AdminAnalyticsView";
import { InlineQuestionEditor } from "../app/components/InlineQuestionEditor";

const AdminQuestionEditor = lazy(() => import("./AdminQuestionEditor"));

const statusLabels: Record<ReportStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  fixed: "Fixed",
  dismissed: "Dismissed",
};

export default function AdminPortal({
  userButton,
}: {
  userButton?: ReactNode;
}) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const tokenRef = useRef(getToken);
  tokenRef.current = getToken;
  const [access, setAccess] = useState<{ userId?: string; error?: string }>({});

  useEffect(() => {
    const controller = new AbortController();
    const id = user?.id;
    reportRequest<{ isAdmin: boolean }>(tokenRef.current, "?action=access", {
      signal: controller.signal,
    })
      .then((result) => {
        if (!controller.signal.aborted)
          setAccess(
            result.isAdmin
              ? { userId: id }
              : { error: "This portal is restricted to the owner." },
          );
      })
      .catch((error) => {
        if (!controller.signal.aborted) setAccess({ error: error.message });
      });
    return () => controller.abort();
  }, [user?.id]);

  return (
    <PortalShell
      userButton={userButton}
      crumbs={[
        { label: "Portal", onClick: () => navigate("/") },
        { label: "Admin" },
      ]}
    >
      {access.userId && access.userId === user?.id ? (
        <AdminWorkspace key={user.id} />
      ) : (
        <div className="admin-portal">
          <div className="admin-surface admin-empty">
            <ShieldCheck size={32} className="mx-auto mb-4 text-teal-600" />
            <h1 className="admin-title">Private admin portal</h1>
            {access.error ? (
              <>
                <p role="alert" className="report-muted">
                  {access.error}
                </p>
                <div className="admin-actions justify-center mt-4">
                  <button
                    className="report-secondary"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                  <Link className="report-secondary" to="/">
                    Return to website
                  </Link>
                </div>
              </>
            ) : (
              <p role="status" className="report-muted">
                Verifying your access…
              </p>
            )}
          </div>
        </div>
      )}
    </PortalShell>
  );
}

function AdminWorkspace() {
  const { getToken } = useAuth();
  const tokenRef = useRef(getToken);
  tokenRef.current = getToken;
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const isInbox = location.pathname.includes("/reports");
  const isEditor = location.pathname.includes("/questions");
  const isAnalytics = location.pathname.includes("/analytics");
  const selectedId = params.get("report");
  const requestedStatus = params.get("status");
  const [status, setStatus] = useState("all");
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicName, setTopicName] = useState("");
  const [groupBy, setGroupBy] = useState("question");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<ReportList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState<QuestionReport | null>(null);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    if (
      isInbox &&
      requestedStatus &&
      ["all", "unresolved", ...REPORT_STATUSES].includes(requestedStatus)
    ) {
      setStatus(requestedStatus);
      setOffset(0);
    }
  }, [isInbox, requestedStatus]);

  useEffect(() => {
    if (!isInbox) {
      setLoading(false);
      setError("");
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ status, offset: String(offset) });
    if (isInbox) {
      query.set("groupBy", groupBy);
      if (search) query.set("search", search);
      if (moduleCode) query.set("moduleCode", moduleCode);
      if (subjectName) query.set("subjectName", subjectName);
      if (chapterId) query.set("chapterId", chapterId);
      if (topicName) query.set("topicName", topicName);
    }
    reportRequest<ReportList>(tokenRef.current, `?${query.toString()}`, {
      signal: controller.signal,
    })
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(e.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [
    status,
    offset,
    refresh,
    isEditor,
    isInbox,
    isAnalytics,
    search,
    moduleCode,
    subjectName,
    chapterId,
    topicName,
    groupBy,
  ]);

  useEffect(() => {
    setSelected((value) => (value?.id === selectedId ? value : null));
    setDetailError("");
    if (!selectedId) return;
    const controller = new AbortController();
    reportRequest<{ report: QuestionReport }>(
      tokenRef.current,
      `?action=detail&id=${encodeURIComponent(selectedId)}`,
      { signal: controller.signal },
    )
      .then((value) => {
        if (!controller.signal.aborted) setSelected(value.report);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setDetailError(e.message);
      });
    return () => controller.abort();
  }, [selectedId, refresh]);

  const activeFilters = Boolean(
    search ||
      moduleCode ||
      subjectName ||
      chapterId ||
      topicName ||
      status !== "all",
  );

  const getInitials = (name?: string | null, username?: string | null) => {
    const target = name || username || "Student";
    const parts = target.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return target.slice(0, 2).toUpperCase();
  };

  const renderReportRow = (report: QuestionReport) => {
    const isSelected = selectedId === report.id;
    const initials = getInitials(report.reporter?.name, report.reporter?.username);

    return (
      <button
        key={report.id}
        className={`admin-report-row ${isSelected ? "is-selected" : ""}`}
        aria-current={isSelected}
        onClick={() => setParams({ report: report.id })}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="admin-avatar-pill">
              {initials}
            </div>
            <div>
              <span className={`admin-badge admin-badge-${report.status}`}>
                {statusLabels[report.status]}
              </span>
            </div>
          </div>
          <span className="admin-meta text-xs">
            {new Date(report.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <strong className="mt-2 text-stone-900 dark:text-stone-100 font-semibold block">
          {REPORT_CATEGORIES[report.category].en}
        </strong>

        {groupBy === "report" && (
          <p className="admin-row-stem">
            {cleanQuestionStem(
              report.snapshot.question.text ||
                report.snapshot.question.question ||
                "",
            )}
          </p>
        )}

        {report.explanation && (
          <p className="admin-row-message italic">
            "{report.explanation}"
          </p>
        )}

        <div className="admin-meta mt-2">
          {report.snapshot.moduleCode} · {report.reporter?.name || report.reporter?.username || 'Student'} · {new Date(report.createdAt).toLocaleDateString()}
          {(report.reporter as any)?.systemRecovered && (
            <span className="admin-pill-recovered ml-1.5" title="System recovered legacy record">
              Recovered
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="admin-portal">
      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Admin navigation">
          <NavLink to="/admin" end>
            <LayoutDashboard size={17} />
            Overview
          </NavLink>
          <NavLink to="/admin/reports">
            <Inbox size={17} />
            Question reports
          </NavLink>
          <NavLink to="/admin/analytics">
            <BarChart3 size={17} />
            Portal analytics
          </NavLink>
          <NavLink to="/admin/questions">
            <ShieldCheck size={17} />
            Question studio
          </NavLink>
          <div className="mt-auto pt-6 border-t border-stone-200/60 dark:border-stone-800/60">
            <Link to="/" className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">
              <ArrowLeft size={16} />
              Back to website
            </Link>
          </div>
        </aside>

        <main className="admin-main">
          {isAnalytics ? (
            <AdminAnalyticsView />
          ) : isEditor ? (
            <Suspense fallback={<p role="status">Loading question studio…</p>}>
              <AdminQuestionEditor />
            </Suspense>
          ) : (
            <>
              <header className="admin-topline">
                <div>
                  <h1 className="admin-title">
                    {isInbox ? "Question reports" : "Your admin space"}
                  </h1>
                  <p className="report-muted">
                    {isInbox
                      ? "Direct student feedback, live patches, and verified email replies."
                      : "A quiet place to look after your website."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="report-secondary inline-flex items-center gap-2"
                    disabled={loading}
                    onClick={() => setRefresh((v) => v + 1)}
                    aria-label="Refresh reports"
                  >
                    <RefreshCw
                      size={14}
                      className={loading ? "animate-spin text-teal-600" : ""}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </header>

              {error && (
                <p className="report-error" role="alert">
                  {error}
                </p>
              )}

              {!isInbox && <AdminOverviewPanel refresh={refresh} />}

              {isInbox && (
                <>
                  {/* Apple-style segmented status pills bar */}
                  <div className="admin-segmented-bar mb-4" role="tablist" aria-label="Filter reports by status">
                    {[
                      { id: "all", label: "All reports" },
                      { id: "unresolved", label: "Unresolved" },
                      ...REPORT_STATUSES.map((s) => ({
                        id: s,
                        label: statusLabels[s],
                      })),
                    ].map((tab) => {
                      const isActive = status === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          className={`admin-segment-pill ${isActive ? "is-active" : ""}`}
                          onClick={() => {
                            setStatus(tab.id);
                            setOffset(0);
                          }}
                          role="tab"
                          aria-selected={isActive}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Filter & Search Bar */}
                  <form
                    className="admin-surface admin-filters"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSearch(searchDraft.trim());
                      setOffset(0);
                    }}
                  >
                    <div className="admin-search-row">
                      <label className="report-field flex-1">
                        Search reports
                        <input
                          type="search"
                          maxLength={200}
                          value={searchDraft}
                          placeholder="Question, student note, name, email or account ID…"
                          onChange={(e) => setSearchDraft(e.target.value)}
                        />
                      </label>
                      <button
                        type="submit"
                        className="report-primary inline-flex items-center gap-1.5"
                      >
                        <Search size={15} />
                        Search
                      </button>
                    </div>

                    <div className="admin-filter-grid mt-4">
                      {/* Hidden or synchronized standard label for test backwards compatibility */}
                      <label className="report-field">
                        Report status
                        <select
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            setOffset(0);
                          }}
                        >
                          <option value="all">All reports</option>
                          <option value="unresolved">Unresolved</option>
                          {REPORT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {statusLabels[s]}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="report-field">
                        Module
                        <select
                          value={moduleCode}
                          onChange={(e) => {
                            setModuleCode(e.target.value);
                            setSubjectName("");
                            setChapterId("");
                            setTopicName("");
                            setOffset(0);
                          }}
                        >
                          <option value="">All modules</option>
                          {data?.facets?.modules.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="report-field">
                        Subject
                        <select
                          value={subjectName}
                          onChange={(e) => {
                            setSubjectName(e.target.value);
                            setChapterId("");
                            setTopicName("");
                            setOffset(0);
                          }}
                        >
                          <option value="">All subjects</option>
                          {data?.facets?.subjects.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="report-field">
                        Chapter
                        <select
                          value={chapterId}
                          disabled={!moduleCode}
                          onChange={(e) => {
                            setChapterId(e.target.value);
                            setTopicName("");
                            setOffset(0);
                          }}
                        >
                          <option value="">
                            {moduleCode ? "All chapters" : "Choose a module first"}
                          </option>
                          {moduleCode &&
                            data?.facets?.chapters.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.title}
                              </option>
                            ))}
                        </select>
                      </label>

                      <label className="report-field">
                        Topic / lecture
                        <select
                          value={topicName}
                          disabled={!moduleCode}
                          onChange={(e) => {
                            setTopicName(e.target.value);
                            setOffset(0);
                          }}
                        >
                          <option value="">
                            {moduleCode ? "All topics" : "Choose a module first"}
                          </option>
                          {moduleCode &&
                            data?.facets?.topics?.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                        </select>
                      </label>

                      <label className="report-field">
                        View
                        <select
                          value={groupBy}
                          onChange={(e) => {
                            setGroupBy(e.target.value);
                            setOffset(0);
                          }}
                        >
                          <option value="question">Grouped by question</option>
                          <option value="report">Individual reports</option>
                        </select>
                      </label>
                    </div>

                    {activeFilters && (
                      <div className="mt-4 flex items-center justify-end">
                        <button
                          type="button"
                          className="report-secondary text-xs"
                          onClick={() => {
                            setSearchDraft("");
                            setSearch("");
                            setStatus("all");
                            setModuleCode("");
                            setSubjectName("");
                            setChapterId("");
                            setTopicName("");
                            setOffset(0);
                          }}
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </form>

                  {!loading && data && (
                    <p className="report-muted mb-4 font-medium" role="status">
                      {data.filteredReportCount ?? data.total} matching{" "}
                      {(data.filteredReportCount ?? data.total) === 1
                        ? "report"
                        : "reports"}
                      {data.groups
                        ? ` across ${data.total} ${data.total === 1 ? "question" : "questions"}`
                        : ""}
                      . Newest first.
                    </p>
                  )}

                  {loading && data && (
                    <p role="status" className="report-muted mb-4">
                      Updating inbox… Previously loaded reports remain visible.
                    </p>
                  )}

                  {loading && !data ? (
                    <div role="status" className="admin-surface admin-empty">
                      <Loader2 size={24} className="animate-spin mx-auto mb-3 text-teal-600" />
                      Loading reports…
                    </div>
                  ) : error && !data ? null : (
                    <div
                      className="admin-inbox"
                      data-review-open={Boolean(selectedId)}
                      aria-busy={loading}
                    >
                      {/* Left Column: Report Queue */}
                      <div className="admin-queue-col">
                        <div className="admin-surface admin-list">
                          {data?.reports.length ? (
                            data.groups ? (
                              data.groups.map((group) => (
                                <section
                                  key={group.key}
                                  className="admin-question-group"
                                >
                                  <button
                                    className="admin-question-open"
                                    aria-label={`Review question: ${cleanQuestionStem(
                                      group.reports[0].snapshot.question.text ||
                                        group.reports[0].snapshot.question.question ||
                                        "",
                                    )}`}
                                    aria-current={group.reports.some(
                                      (r) => r.id === selectedId,
                                    )}
                                    onClick={() =>
                                      setParams({ report: group.reports[0].id })
                                    }
                                  >
                                    <strong className="block text-stone-900 dark:text-stone-100">
                                      {cleanQuestionStem(
                                        group.reports[0].snapshot.question.text ||
                                          group.reports[0].snapshot.question.question ||
                                          "",
                                      )}
                                    </strong>
                                    <span className="admin-meta block mt-2">
                                      {group.reports[0].snapshot.moduleCode} ·{" "}
                                      {group.reports[0].snapshot.subjectName}
                                      {group.reports[0].snapshot.topicName
                                        ? ` · ${group.reports[0].snapshot.topicName}`
                                        : ""}
                                    </span>
                                    <span className="admin-group-counts mt-2 block">
                                      {group.reportCount} matching{" "}
                                      {group.reportCount === 1 ? "report" : "reports"}{" "}
                                      · {group.reporterCount}{" "}
                                      {group.reporterCount === 1
                                        ? "reporter"
                                        : "reporters"}{" "}
                                      · {group.unresolvedCount} unresolved
                                    </span>
                                  </button>
                                  <div
                                    className="admin-related-reports"
                                    aria-label="Student reports for this question"
                                  >
                                    {group.reports.map(renderReportRow)}
                                  </div>
                                </section>
                              ))
                            ) : (
                              data.reports.map(renderReportRow)
                            )
                          ) : (
                            <div className="admin-empty">
                              <Inbox
                                size={28}
                                className="mx-auto mb-3 text-teal-600/80"
                              />
                              <h2 className="text-base font-bold text-stone-800 dark:text-stone-200">
                                {activeFilters
                                  ? "No matching reports"
                                  : "No reports here yet"}
                              </h2>
                              <p className="report-muted mt-2">
                                {activeFilters
                                  ? "Try another search or clear the filters."
                                  : "Student reports will appear here after they are submitted."}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="admin-pager">
                          <button
                            className="report-secondary"
                            disabled={offset === 0}
                            onClick={() => setOffset((v) => Math.max(0, v - 25))}
                          >
                            Previous
                          </button>
                          <span className="font-medium text-stone-600 dark:text-stone-400">
                            {data?.total
                              ? `${offset + 1}–${Math.min(offset + 25, data.total)} of ${data.total} ${
                                  data.groups ? "questions" : "reports"
                                }`
                              : "0 reports"}
                          </span>
                          <button
                            className="report-secondary"
                            disabled={!data || offset + 25 >= data.total}
                            onClick={() => setOffset((v) => v + 25)}
                          >
                            Next
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Review Studio */}
                      {selected ? (
                        <div className="admin-review-content">
                          <button
                            className="report-secondary admin-mobile-back mb-3"
                            onClick={() => setParams({})}
                          >
                            <ArrowLeft size={15} />
                            Back to reports
                          </button>
                          <ReportDetail
                            key={selected.id}
                            report={selected}
                            onUpdate={() => setRefresh((v) => v + 1)}
                          />
                        </div>
                      ) : (
                        <div className="admin-surface admin-empty flex flex-col items-center justify-center min-h-[400px]">
                          {selectedId && (
                            <button
                              className="report-secondary admin-mobile-back mb-3"
                              onClick={() => setParams({})}
                            >
                              <ArrowLeft size={15} />
                              Back to reports
                            </button>
                          )}
                          {detailError ? (
                            <p role="alert" className="report-error">
                              {detailError}
                            </p>
                          ) : (
                            <div className="text-center py-12">
                              <BookOpen size={36} className="mx-auto mb-3 text-stone-300 dark:text-stone-700" />
                              <h3 className="font-semibold text-stone-700 dark:text-stone-300">
                                {selectedId ? "Loading report…" : "No Report Selected"}
                              </h3>
                              <p className="report-muted mt-1 max-w-sm">
                                {selectedId
                                  ? "Retrieving full question evidence and student profile…"
                                  : "Select any student report from the left queue to view evidence, inspect the question, and publish a live patch."}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export function ReportDetail({
  report,
  onUpdate,
}: {
  report: QuestionReport;
  onUpdate: () => void;
}) {
  const { getToken } = useAuth();
  const [copied, setCopied] = useState("");
  const [notification, setNotification] = useState(report.notification);
  const [status, setStatus] = useState(report.status);
  const [notes, setNotes] = useState(report.notes);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showInlineEditor, setShowInlineEditor] = useState(false);

  useEffect(() => {
    setStatus(report.status);
    setNotes(report.notes);
    setNotification(report.notification);
  }, [report.revision]);

  async function save(customStatus?: ReportStatus) {
    setBusy(true);
    setError("");
    const targetStatus = customStatus || status;
    try {
      await reportRequest(getToken, "", {
        method: "PATCH",
        body: JSON.stringify({
          id: report.id,
          revision: report.revision,
          status: targetStatus,
          notes,
        }),
      });
      if (customStatus) setStatus(customStatus);
      onUpdate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }

  async function retry() {
    setBusy(true);
    setError("");
    try {
      const result = await reportRequest<{
        notification: QuestionReport["notification"];
      }>(getToken, "?action=retry", {
        method: "POST",
        body: JSON.stringify({ id: report.id }),
      });
      setNotification(result.notification);
      setMessage(
        result.notification.state === "sent"
          ? "Email accepted by the delivery provider."
          : result.notification.state === "unconfigured"
            ? "Email delivery needs server configuration."
            : "Email could not be sent. You can retry.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to send.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied("Copied to clipboard.");
      setTimeout(() => setCopied(""), 3000);
    } catch {
      setError(
        "Clipboard access is unavailable. Select and copy the text below.",
      );
    }
  }

  const snapshot = report.snapshot;
  const isRecovered = Boolean((report.reporter as any)?.systemRecovered);
  const reporterEmail = report.reporter?.email;
  const isVerified = Boolean(report.reporter?.emailVerified);

  return (
    <article className="admin-surface admin-detail">
      {/* Top Review Bar */}
      <div className="admin-detail-header flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className={`admin-badge admin-badge-${report.status}`}>
              {statusLabels[report.status]}
            </span>
            <span className="admin-meta">
              Report ID: {report.id}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1.5 text-stone-900 dark:text-stone-100">
            {REPORT_CATEGORIES[report.category].en}
          </h2>
          <p className="admin-meta mt-0.5">
            {snapshot.moduleCode} · {snapshot.chapterTitle} · {snapshot.subjectName}
            {snapshot.topicName ? ` · ${snapshot.topicName}` : ""}
          </p>
        </div>

        {/* 1-Click Status Quick Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            className={`admin-status-pill ${status === "reviewing" ? "is-active text-sky-700 bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300" : ""}`}
            disabled={busy}
            onClick={() => save("reviewing")}
          >
            Reviewing
          </button>
          <button
            type="button"
            className={`admin-status-pill ${status === "fixed" ? "is-active text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300" : ""}`}
            disabled={busy}
            onClick={() => save("fixed")}
          >
            Fixed
          </button>
          <button
            type="button"
            className={`admin-status-pill ${status === "dismissed" ? "is-active text-stone-700 bg-stone-200 dark:bg-stone-800 dark:text-stone-300" : ""}`}
            disabled={busy}
            onClick={() => save("dismissed")}
          >
            Dismiss
          </button>
        </div>
      </div>

      <p className="admin-meta mt-3">
        Submitted {new Date(report.createdAt).toLocaleString()} · Question ID:{" "}
        <span className="font-mono">{String(snapshot.question.id)}</span>
      </p>

      {report.subQuestionId && (
        <p className="admin-meta mt-1">Reported part: {report.subQuestionId}</p>
      )}

      {/* Review Context Copy Bar */}
      <div className="admin-review-toolbar mt-4">
        <button
          className="report-secondary text-xs"
          onClick={() => copy(reviewContext(report))}
        >
          <Copy size={14} />
          Copy review context
        </button>
        <span className="admin-meta">
          Question + original student message. Profile details and internal notes excluded.
        </span>
        {copied && (
          <p role="status" className="admin-meta text-teal-600 dark:text-teal-400 font-semibold">
            {copied}
          </p>
        )}
      </div>

      {/* Evidence Grid: Question snapshot on Left, Student message & Reporter on Right */}
      <div className="admin-evidence-grid mt-6">
        {/* Left: Question Snapshot */}
        <section
          className="admin-question-evidence"
          aria-labelledby="question-heading"
        >
          <span className="admin-eyebrow">
            <BookOpen size={14} />
            QUESTION AT SUBMISSION
          </span>
          <h3 id="question-heading" className="text-base font-bold mt-1">
            Question snapshot
          </h3>

          <p className="admin-question-stem mt-3 font-serif text-base leading-relaxed text-stone-900 dark:text-stone-100">
            {snapshot.question.text || snapshot.question.question}
          </p>

          {Array.isArray(snapshot.question.options) && (
            <ol className="admin-answer-list mt-4 space-y-2">
              {snapshot.question.options.map((option, index) => {
                const isCorrect = index === snapshot.question.correctIndex;
                return (
                  <li
                    key={index}
                    className={`admin-answer-option ${isCorrect ? "is-correct" : ""}`}
                  >
                    <span className="admin-option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <p className="flex-1 m-0">{option}</p>
                    {isCorrect && (
                      <span className="admin-correct-tag flex items-center gap-1">
                        <Check size={12} />
                        Correct answer
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {snapshot.question.explanation && (
            <div className="admin-answer-explanation mt-4">
              <h4 className="font-semibold text-stone-800 dark:text-stone-200">
                Explanation
              </h4>
              <pre className="mt-1 text-sm text-stone-700 dark:text-stone-300">
                {snapshot.question.explanation}
              </pre>
            </div>
          )}

          {snapshot.question.modelAnswer && (
            <div className="admin-answer-explanation mt-3">
              <h4 className="font-semibold text-stone-800 dark:text-stone-200">
                Model answer
              </h4>
              <pre className="mt-1 text-sm text-stone-700 dark:text-stone-300">
                {snapshot.question.modelAnswer}
              </pre>
            </div>
          )}

          {Array.isArray(snapshot.question.subQuestions) &&
            (snapshot.question.subQuestions as SubQuestion[]).map((part) => (
              <section
                key={part.id}
                className={`admin-question-part mt-3 ${
                  report.subQuestionId === part.id ? "is-reported" : ""
                }`}
              >
                <h4>
                  {report.subQuestionId === part.id
                    ? "Reported part"
                    : "Question part"}{" "}
                  · {part.id}
                </h4>
                <p>{part.text}</p>
                {part.options && (
                  <ol className="admin-answer-list">
                    {part.options.map((option, index) => (
                      <li
                        key={index}
                        className={
                          index === part.correctIndex ? "is-correct" : ""
                        }
                      >
                        <span>{String.fromCharCode(65 + index)}</span>
                        <p>{option}</p>
                        {index === part.correctIndex && (
                          <strong>Correct answer</strong>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
                {(part.modelAnswer || part.explanation) && (
                  <pre>{part.modelAnswer || part.explanation}</pre>
                )}
                {part.blanks && (
                  <pre>Blank answers: {part.blanks.join(" · ")}</pre>
                )}
              </section>
            ))}

          {["pairs", "blanks", "acceptedAnswers", "media"]
            .filter((key) => snapshot.question[key] !== undefined)
            .map((key) => (
              <section className="admin-answer-explanation mt-3" key={key}>
                <h4>
                  {
                    (
                      {
                        pairs: "Matching key",
                        blanks: "Blank answers",
                        acceptedAnswers: "Accepted alternatives",
                        media: "Question media",
                      } as Record<string, string>
                    )[key]
                  }
                </h4>
                <pre>{JSON.stringify(snapshot.question[key], null, 2)}</pre>
              </section>
            ))}

          <details className="admin-source-details mt-4">
            <summary className="cursor-pointer text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-300">
              Full snapshot and source version
            </summary>
            <pre className="mt-2 text-xs">{JSON.stringify(snapshot, null, 2)}</pre>
          </details>
        </section>

        {/* Right: Student Message & Rich Reporter Card */}
        <section
          className="admin-student-evidence"
          aria-labelledby="student-message-heading"
        >
          {/* Student's Message Box */}
          <div className="admin-message-card">
            <span className="admin-eyebrow">
              <MessageSquare size={14} />
              STUDENT FEEDBACK
            </span>
            <h3 id="student-message-heading" className="text-base font-bold mt-1">
              Student’s message
            </h3>
            <p className="admin-meta mt-1">
              {REPORT_CATEGORIES[report.category].en} · As submitted
            </p>
            <blockquote className="admin-original-message mt-3">
              {report.explanation || "No explanation was added."}
            </blockquote>
            <button
              className="report-secondary text-xs mt-3 inline-flex items-center gap-1.5"
              disabled={!report.explanation}
              onClick={() => copy(report.explanation)}
            >
              <Copy size={13} />
              Copy student message
            </button>
          </div>

          {/* Student Profile Card (Apple HIG standard) */}
          <section
            className="admin-reporter admin-profile-card mt-6"
            aria-labelledby="reporter-heading"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/70 dark:border-stone-800/70">
              <div className="flex items-center gap-2">
                <User size={16} className="text-teal-600" />
                <h3 id="reporter-heading" className="text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 m-0">
                  Reporter
                </h3>
              </div>
              {reporterEmail && (
                <a
                  href={`mailto:${reporterEmail}`}
                  className="report-secondary text-xs inline-flex items-center gap-1"
                >
                  <Mail size={12} />
                  Email
                </a>
              )}
            </div>

            <dl className="admin-profile-dl mt-3">
              <div>
                <dt>Name</dt>
                <dd className="font-semibold text-stone-900 dark:text-stone-100">
                  {report.reporter?.name || "Not recorded"}
                </dd>
              </div>

              {report.reporter?.username && (
                <div>
                  <dt>Username</dt>
                  <dd>
                    <span className="admin-username-badge">
                      @{report.reporter.username}
                    </span>
                  </dd>
                </div>
              )}

              <div>
                <dt>Email</dt>
                <dd>
                  {reporterEmail ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <a
                        href={`mailto:${reporterEmail}`}
                        className="text-teal-700 dark:text-teal-400 underline font-medium"
                      >
                        {reporterEmail}
                      </a>
                      {isVerified ? (
                        <span className="admin-verified-badge inline-flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          Verified email
                        </span>
                      ) : (
                        <span className="admin-meta block mt-1">
                          Email not verified
                        </span>
                      )}
                    </div>
                  ) : (
                    "Not recorded"
                  )}
                </dd>
              </div>

              <div>
                <dt>Account ID</dt>
                <dd className="font-mono text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1">
                  <span>{report.reporterId}</span>
                  <button
                    type="button"
                    onClick={() => copy(report.reporterId)}
                    className="p-1 hover:text-stone-900 dark:hover:text-stone-100"
                    title="Copy Account ID"
                  >
                    <Copy size={11} />
                  </button>
                </dd>
              </div>
            </dl>

            {/* Explanation badge for recovered reports */}
            {isRecovered && (
              <div className="admin-recovered-box mt-3">
                <Info size={14} className="shrink-0 text-amber-600 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 leading-normal">
                  <strong>System Recovered Record</strong>
                  <p className="mt-0.5 m-0 opacity-90">
                    This question was recovered from fallback cache during database migration; placeholder student details were assigned. Real reports submitted by students automatically display their verified name, email, and Clerk account.
                  </p>
                </div>
              </div>
            )}

            <p className="admin-meta mt-3">
              Profile recorded at submission. Replies use the account’s current verified email.
            </p>
          </section>
        </section>
      </div>

      {/* Live Patching & Management Bar */}
      <div className="admin-management-panel mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200/70 dark:border-stone-800/70">
          <div>
            <h3 className="m-0 text-base font-bold text-stone-900 dark:text-stone-100">
              Review decision
            </h3>
            <p className="admin-meta mt-0.5">
              Edit question on the spot or mark review status.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="report-primary inline-flex items-center gap-1.5"
              onClick={() => setShowInlineEditor(!showInlineEditor)}
            >
              <Sparkles size={14} />
              {showInlineEditor
                ? "Close On-The-Spot Editor"
                : "Edit Question On The Spot"}
            </button>
            <Link
              className="report-secondary text-xs inline-flex items-center gap-1"
              to={`/admin/questions?module=${encodeURIComponent(
                report.snapshot.moduleCode,
              )}&question=${encodeURIComponent(String(report.snapshot.question.id))}`}
            >
              Full Question Studio
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {showInlineEditor && (
          <div className="mb-6">
            <InlineQuestionEditor
              moduleCode={snapshot.moduleCode}
              chapterId={snapshot.chapterId}
              question={snapshot.question}
              reportId={report.id}
              reportRevision={report.revision}
              onSaved={() => {
                onUpdate();
                setShowInlineEditor(false);
              }}
              onCancel={() => setShowInlineEditor(false)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <label className="report-field">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReportStatus)}
              disabled={busy}
            >
              {REPORT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="report-field">
            Internal notes
            <textarea
              rows={3}
              maxLength={5000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={busy}
              placeholder="Source checked, decision, or follow-up…"
            />
          </label>
        </div>

        <p className="admin-meta mt-2">
          Only you can see these notes. Publish the correction in Question studio, then mark the report fixed.
        </p>

        {error && (
          <p role="alert" className="report-error">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="report-muted mt-3">
            {message}
          </p>
        )}

        <div className="admin-actions mt-4 flex items-center justify-end">
          <button className="report-primary" disabled={busy} onClick={() => save()}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : null}
            Save changes
          </button>
        </div>
      </div>

      {/* Apple Mail Reply Composer */}
      <div className="mt-8">
        <ReplyComposer report={report} />
      </div>

      {/* Footer Audit Meta */}
      <div className="admin-meta mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Mail size={13} />
          Admin alert email:{" "}
          <span className="font-medium text-stone-700 dark:text-stone-300">
            {notification.state === "sent"
              ? "Accepted by provider"
              : notification.state}
          </span>
          {notification.state !== "sent" && (
            <button
              className="report-secondary text-xs ml-2"
              disabled={busy}
              onClick={retry}
            >
              Retry email notification
            </button>
          )}
        </div>

        <div className="text-right text-xs">
          <span>Report ID: {report.id}</span>
          {report.updatedBy && (
            <span className="block mt-0.5">
              Last reviewed: {new Date(report.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
