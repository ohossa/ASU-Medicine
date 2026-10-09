import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import {
  ArrowLeft,
  Inbox,
  LayoutDashboard,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Mail,
} from "lucide-react";
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
import {TriagePanel,TriageAssessmentCard} from './TriagePanel';
import type {TriageView} from '../app/reports/triage-contracts';
import AdminOverviewPanel from "./AdminOverviewPanel";
const AdminQuestionEditor = lazy(() => import('./AdminQuestionEditor'));
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
            <ShieldCheck size={28} className="mx-auto mb-4 text-teal-600" />
            <h1 className="admin-title">Private admin portal</h1>
            {access.error ? (
              <>
                <p role="alert" className="report-muted">
                  {access.error}
                </p>
                <div className="admin-actions justify-center">
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
  const [triageData,setTriageData]=useState<TriageView|null>(null);
  const [triageBucket,setTriageBucket]=useState("all");
  useEffect(()=>{setTriageBucket(triageData?.mode==='prioritized'?'priority':'all');setOffset(0);},[triageData?.mode]);
  useEffect(()=>{if(isInbox && requestedStatus && ["all","unresolved",...REPORT_STATUSES].includes(requestedStatus)){setStatus(requestedStatus);setOffset(0);}},[isInbox,requestedStatus]);
  useEffect(() => {
    if (!isInbox) {setLoading(false);setError("");return;}
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const query = new URLSearchParams({status, offset:String(offset)});
    if (isInbox) {
      query.set('groupBy',groupBy);
      query.set('triage',triageBucket);
      if (search) query.set('search',search);
      if (moduleCode) query.set('moduleCode',moduleCode);
      if (subjectName) query.set('subjectName',subjectName);
      if (chapterId) query.set('chapterId',chapterId);
      if (topicName) query.set('topicName',topicName);
    }
    reportRequest<ReportList>(
      tokenRef.current,
      `?${query.toString()}`,
      { signal: controller.signal },
    )
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch((e) => {
        if (!controller.signal.aborted) { setError(e.message); setData(null); }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [status, offset, refresh, isEditor, isInbox, search, moduleCode, subjectName, chapterId, topicName, groupBy, triageBucket]);
  useEffect(() => {
    setSelected(null);
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
  const activeFilters = Boolean(search || moduleCode || subjectName || chapterId || topicName || status !== 'all');
  const renderReportRow = (report: QuestionReport) => (
    <button key={report.id} className="admin-report-row" aria-current={selectedId === report.id}
      onClick={() => setParams({ report: report.id })}>
      <span className="admin-badge">{statusLabels[report.status]}</span>
      <strong>{REPORT_CATEGORIES[report.category].en}</strong>
      <p>{cleanQuestionStem(report.snapshot.question.text || report.snapshot.question.question || '')}</p>
      <div className="admin-meta mt-2">
        {report.snapshot.moduleCode} · {report.reporter?.name || report.reporter?.username || 'Student'} · {new Date(report.createdAt).toLocaleDateString()}
      </div>
    </button>
  );
  return (
    <div className="admin-portal">
      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Admin navigation">
          <NavLink to="/admin" end>
            <LayoutDashboard size={16} />
            Overview
          </NavLink>
          <NavLink to="/admin/reports">
            <Inbox size={16} />
            Question reports
          </NavLink>
          <NavLink to="/admin/questions"><ShieldCheck size={16}/>Question studio</NavLink>
          <Link to="/">
            <ArrowLeft size={16} />
            Back to website
          </Link>
        </aside>
        <main>
          {isEditor ? <Suspense fallback={<p role="status">Loading question studio…</p>}><AdminQuestionEditor/></Suspense> : <>
          <header className="admin-topline">
            <div>
              <h1 className="admin-title">
                {isInbox ? "Question reports" : "Your admin space"}
              </h1>
              <p className="report-muted">
                {isInbox
                  ? "Review student feedback and keep the question bank accurate."
                  : "A quiet place to look after your website."}
              </p>
            </div>
            <button
              className="report-secondary"
              disabled={loading}
              onClick={() => setRefresh((v) => v + 1)}
              aria-label="Refresh reports"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </header>
          {error && (
            <p className="report-error" role="alert">
              {error}
            </p>
          )}
          {!isInbox && <AdminOverviewPanel refresh={refresh}/>}
          {isInbox && (
            <>
              <TriagePanel refresh={refresh} onRefresh={()=>setRefresh(v=>v+1)} onData={setTriageData}/>
              <nav className="triage-buckets" aria-label="Inbox priority"><button className="report-secondary" aria-pressed={triageBucket==='priority'} onClick={()=>{setTriageBucket('priority');setOffset(0);}}>Needs attention</button><button className="report-secondary" aria-pressed={triageBucket==='low'} onClick={()=>{setTriageBucket('low');setOffset(0);}}>Low priority ({triageData?.counts.low??0})</button><button className="report-secondary" aria-pressed={triageBucket==='all'} onClick={()=>{setTriageBucket('all');setOffset(0);}}>All reports</button></nav>
              <form className="admin-surface admin-filters" onSubmit={e=>{e.preventDefault();setSearch(searchDraft.trim());setOffset(0);}}>
                <div className="admin-search-row">
                  <label className="report-field">Search reports
                    <input type="search" maxLength={200} value={searchDraft} placeholder="Question, note, name, email or account ID"
                      onChange={e=>setSearchDraft(e.target.value)}/>
                  </label>
                  <button type="submit" className="report-primary">Search</button>
                </div>
                <div className="admin-filter-grid">
                  <label className="report-field">Report status
                    <select value={status} onChange={e=>{setStatus(e.target.value);setOffset(0);}}>
                      <option value="all">All reports</option><option value="unresolved">Unresolved</option>
                      {REPORT_STATUSES.map(s=><option key={s} value={s}>{statusLabels[s]}</option>)}
                    </select>
                  </label>
                  <label className="report-field">Module
                    <select value={moduleCode} onChange={e=>{setModuleCode(e.target.value);setSubjectName('');setChapterId('');setTopicName('');setOffset(0);}}>
                      <option value="">All modules</option>{data?.facets?.modules.map(m=><option key={m} value={m}>{m}</option>)}
                    </select>
                  </label>
                  <label className="report-field">Subject
                    <select value={subjectName} onChange={e=>{setSubjectName(e.target.value);setChapterId('');setTopicName('');setOffset(0);}}>
                      <option value="">All subjects</option>{data?.facets?.subjects.map(name=><option key={name} value={name}>{name}</option>)}
                    </select>
                  </label>
                  <label className="report-field">Chapter
                    <select value={chapterId} disabled={!moduleCode} onChange={e=>{setChapterId(e.target.value);setTopicName('');setOffset(0);}}>
                      <option value="">{moduleCode?'All chapters':'Choose a module first'}</option>{moduleCode&&data?.facets?.chapters.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </label>
                  <label className="report-field">Topic / lecture
                    <select value={topicName} disabled={!moduleCode} onChange={e=>{setTopicName(e.target.value);setOffset(0);}}>
                      <option value="">{moduleCode?'All topics':'Choose a module first'}</option>{moduleCode&&data?.facets?.topics?.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                  <label className="report-field">View
                    <select value={groupBy} onChange={e=>{setGroupBy(e.target.value);setOffset(0);}}>
                      <option value="question">Grouped by question</option><option value="report">Individual reports</option>
                    </select>
                  </label>
                </div>
                {activeFilters&&<button type="button" className="report-secondary mt-4" onClick={()=>{
                  setSearchDraft('');setSearch('');setStatus('all');setModuleCode('');setSubjectName('');setChapterId('');setTopicName('');setOffset(0);
                }}>Clear filters</button>}
              </form>
              {!loading&&data&&<p className="report-muted mb-4" role="status">
                {data.filteredReportCount??data.total} matching reports{data.groups ? ` across ${data.total} questions` : ''}. Newest first.
              </p>}
              {loading ? (
                <div role="status" className="admin-surface admin-empty">
                  <Loader2 size={22} className="animate-spin mx-auto mb-3" />
                  Loading reports…
                </div>
              ) : error ? null : (
                <div className="admin-inbox">
                  <div>
                    <div className="admin-surface admin-list">
                      {data?.reports.length ? (
                        data.groups ? data.groups.map(group => (
                          <details key={group.key} className="admin-report-group" open={group.reports.some(r=>r.id===selectedId)||undefined}>
                            <summary>
                              <strong>{cleanQuestionStem(group.reports[0].snapshot.question.text || group.reports[0].snapshot.question.question || '')}</strong>
                              <span className="admin-meta block mt-2">{group.reports[0].snapshot.moduleCode} · {group.reports[0].snapshot.subjectName}{group.reports[0].snapshot.topicName ? ` · ${group.reports[0].snapshot.topicName}` : ''}</span>
                              <span className="admin-group-counts">{group.reportCount} matching {group.reportCount===1?'report':'reports'} · {group.reporterCount} {group.reporterCount===1?'reporter':'reporters'} · {group.unresolvedCount} unresolved</span>
                            </summary>
                            {group.reports.map(renderReportRow)}
                          </details>
                        )) : data.reports.map(renderReportRow)
                      ) : (
                        <div className="admin-empty">
                          <Inbox
                            size={25}
                            className="mx-auto mb-3 text-teal-600"
                          />
                          <h2>{activeFilters ? "No matching reports" : "No reports here yet"}</h2>
                          <p className="report-muted mt-2">
                            {activeFilters ? "Try another search or clear the filters." : "Student reports will appear here after they are submitted."}
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
                      <span>
                        {data?.total
                          ? `${offset + 1}–${Math.min(offset + 25, data.total)} of ${data.total} ${data.groups ? "questions" : "reports"}`
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
                  {selected ? (
                    <ReportDetail
                      key={selected.id + ":" + selected.revision}
                      report={selected}
                      assessment={triageData?.assessments.find(a=>a.fingerprint===triageData.reportAssessments?.[selected.id])}
                      onUpdate={() => setRefresh((v) => v + 1)}
                    />
                  ) : (
                    <div className="admin-surface admin-empty">
                      {detailError ? (
                        <p role="alert" className="report-error">
                          {detailError}
                        </p>
                      ) : (
                        <p className="report-muted">
                          {selectedId
                            ? "Loading report…"
                            : "Select a report to review the details."}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          </>}
        </main>
      </div>
    </div>
  );
}
function ReportDetail({
  report,
  assessment,
  onUpdate,
}: {
  assessment?:import("../app/reports/triage-contracts").TriageAssessment;
  report: QuestionReport;
  onUpdate: () => void;
}) {
  const { getToken } = useAuth();
  const [notification, setNotification] = useState(report.notification);
  const [status, setStatus] = useState(report.status);
  const [notes, setNotes] = useState(report.notes);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function save() {
    setBusy(true);
    setError("");
    try {
      await reportRequest(getToken, "", {
        method: "PATCH",
        body: JSON.stringify({
          id: report.id,
          revision: report.revision,
          status,
          notes,
        }),
      });
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
  const snapshot = report.snapshot;
  return (
    <article className="admin-surface admin-detail">
      <span className="admin-badge">{statusLabels[report.status]}</span>
      <h2>{REPORT_CATEGORIES[report.category].en}</h2>
      <p className="admin-meta">
        {snapshot.moduleCode} · {snapshot.chapterTitle} · {snapshot.subjectName}
      </p>
      <p className="admin-meta mt-2">
        {new Date(report.createdAt).toLocaleString()} · Question{" "}
        {String(snapshot.question.id)}
      </p>
      {snapshot.topicName && <p className="admin-meta mt-2">Topic: {snapshot.topicName}</p>}
      {report.subQuestionId && (
        <p className="admin-meta mt-2">Reported part: {report.subQuestionId}</p>
      )}
      <TriageAssessmentCard assessment={assessment} onRefresh={onUpdate}/>
      <section className="admin-reporter" aria-labelledby="reporter-heading">
        <h3 id="reporter-heading">Reporter</h3>
        <dl>
          <div><dt>Name</dt><dd>{report.reporter?.name || "Not recorded"}</dd></div>
          {report.reporter?.username && <div><dt>Username</dt><dd>{report.reporter.username}</dd></div>}
          <div><dt>Email</dt><dd>
            {report.reporter?.email ? <>
              <a href={`mailto:${report.reporter.email}`}>{report.reporter.email}</a>
              <span className="admin-meta block mt-1">{report.reporter.emailVerified ? "Verified email" : "Email not verified"}</span>
            </> : "Not recorded"}
          </dd></div>
          <div><dt>Account ID</dt><dd>{report.reporterId}</dd></div>
        </dl>
        <p className="admin-meta mt-3">Account details recorded when this report was submitted.</p>
      </section>
      <div className="admin-note">
        {report.explanation || "No explanation was added."}
      </div>
      <details open>
        <summary className="text-sm font-semibold cursor-pointer">
          Question snapshot
        </summary>
        <pre className="mt-3">
          {snapshot.question.text || snapshot.question.question}
        </pre>
        {Array.isArray(snapshot.question.options) && (
          <ol className="text-xs space-y-2 my-4">
            {snapshot.question.options.map((option, index) => (
              <li key={index}>
                {String.fromCharCode(65 + index)}. {option}
                {index === snapshot.question.correctIndex ? " ✓" : ""}
              </li>
            ))}
          </ol>
        )}
        {(snapshot.question.modelAnswer || snapshot.question.explanation) && (
          <pre>
            {snapshot.question.modelAnswer || snapshot.question.explanation}
          </pre>
        )}
        <details className="mt-4">
          <summary className="admin-meta cursor-pointer">
            Full snapshot and source version
          </summary>
          <pre className="mt-3">{JSON.stringify(snapshot, null, 2)}</pre>
        </details>
      </details>
      <Link className="report-primary mb-5 inline-flex" to={`/admin/questions?module=${encodeURIComponent(report.snapshot.moduleCode)}&question=${encodeURIComponent(String(report.snapshot.question.id))}`}>Edit this question</Link>
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
          rows={4}
          maxLength={5000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={busy}
          placeholder="Source checked, decision, or follow-up…"
        />
      </label>
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
      <div className="admin-actions">
        <button className="report-primary" disabled={busy} onClick={save}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}Save
          changes
        </button>
      </div>
      <div className="admin-meta mt-6 flex items-center gap-2">
        <Mail size={13} />
        Email:{" "}
        {notification.state === "sent"
          ? "Accepted by provider"
          : notification.state}
      </div>
      {notification.state !== "sent" && (
        <button
          className="report-secondary mt-3"
          disabled={busy}
          onClick={retry}
        >
          Retry email notification
        </button>
      )}
      <p className="admin-meta mt-5">
        Report ID: {report.id}
        {report.updatedBy && (
          <>
            <br />
            Last reviewed: {new Date(report.updatedAt).toLocaleString()}
          </>
        )}
      </p>
    </article>
  );
}
