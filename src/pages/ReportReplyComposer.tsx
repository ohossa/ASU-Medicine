import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Mail, Send, Eye, CheckCircle2, RefreshCw, Save } from "lucide-react";
import { reportRequest } from "../app/reports/client";
import type { QuestionReport } from "../app/reports/contracts";
import type {
  ReplyConversation,
  ReplyDraft,
  ReportReply,
} from "../app/reports/reply-contracts";
import { replyTemplate } from "../app/reports/review-context";
import safeStorage from "../app/utils/safeStorage";
type Pending = { id: string; requestId: string; subject: string; body: string };
export function ReplyComposer({
  report,
  request = reportRequest,
}: {
  report: QuestionReport;
  request?: typeof reportRequest;
}) {
  const { getToken } = useAuth(),
    { user } = useUser();
  const token = useRef(getToken);
  token.current = getToken;
  const cacheKey = `asu_admin_reply:${user?.id}:${report.id}`;
  const [conversation, setConversation] = useState<ReplyConversation | null>(
    null,
  );
  const [subject, setSubject] = useState(
    `Your ASUCodes report · ${report.snapshot.moduleCode} · ${report.snapshot.question.id}`,
  );
  const [body, setBody] = useState("");
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [preview, setPreview] = useState(false);
  const [pending, setPending] = useState<Pending | null>(() =>
    safeStorage.getItem<Pending | null>(cacheKey, null),
  );
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    request<ReplyConversation>(
      token.current,
      `?action=replies&id=${encodeURIComponent(report.id)}`,
      { signal: controller.signal },
    )
      .then((c) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(c.replies))
          throw new Error("Reply conversation could not be loaded.");
        setConversation(c);
        setRevision(c.draft?.revision || 0);
        const unresolved = c.replies.find(
          (r) => r.state !== "accepted" && r.requestId,
        );
        if (unresolved) {
          const p = {
            id: report.id,
            requestId: unresolved.requestId!,
            subject: unresolved.subject,
            body: unresolved.body,
          };
          setPending(p);
          setSubject(p.subject);
          setBody(p.body);
          setPreview(true);
        } else {
          const cached = safeStorage.getItem<Pending | null>(cacheKey, null);
          if (cached) {
            const accepted = c.replies.some(
              (r) => r.requestId === cached.requestId && r.state === "accepted",
            );
            if (accepted) {
              safeStorage.removeItem(cacheKey);
              setPending(null);
            } else {
              setPending(cached);
              setSubject(cached.subject);
              setBody(cached.body);
              setPreview(true);
              return;
            }
          }
          if (c.draft) {
            setSubject(
              c.draft.subject ||
                `Your ASUCodes report · ${report.snapshot.moduleCode} · ${report.snapshot.question.id}`,
            );
            setBody(c.draft.body);
          }
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setError(e.message || "Unable to load replies.");
      });
    return () => controller.abort();
  }, [report.id, cacheKey, request, reload]);
  const placeholders = /\[(?:Explain|Describe|Ask)[^\]\n]*\]/i.test(body);
  const duplicate = conversation?.replies.some(
    (r) =>
      r.state === "accepted" &&
      r.subject === subject.trim() &&
      r.body === body.trim(),
  );
  const valid =
    subject.trim().length >= 3 &&
    subject.length <= 160 &&
    !/[\r\n]/.test(subject) &&
    body.trim().length >= 20 &&
    body.length <= 6000 &&
    !placeholders &&
    !duplicate;
  async function saveDraft() {
    setBusy(true);
    setError("");
    try {
      const result = await request<{ draft: ReplyDraft }>(
        token.current,
        "?action=reply-draft",
        {
          method: "POST",
          body: JSON.stringify({ id: report.id, revision, subject, body }),
        },
      );
      setRevision(result.draft.revision);
      setNotice("Draft saved to the cloud.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save draft.");
    } finally {
      setBusy(false);
    }
  }
  async function send() {
    if (
      !conversation?.configured ||
      !conversation.recipient ||
      busy ||
      (!pending && !valid)
    )
      return;
    const payload = pending || {
      id: report.id,
      requestId: crypto.randomUUID(),
      subject: subject.trim(),
      body: body.trim(),
    };
    setPending(payload);
    safeStorage.setItem(cacheKey, payload);
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await request<{ reply: ReportReply }>(
        token.current,
        "?action=reply-send",
        { method: "POST", body: JSON.stringify(payload) },
      );
      const r = result.reply;
      setConversation((c) =>
        c
          ? {
              ...c,
              replies: [r, ...c.replies.filter((old) => old.id !== r.id)],
            }
          : c,
      );
      if (r.state === "accepted") {
        safeStorage.removeItem(cacheKey);
        setPending(null);
        setBody("");
        setPreview(false);
        setNotice("Your reply was accepted by the email provider.");
        setReload(v=>v+1);
      } else
        setNotice(
          "Delivery is not confirmed. Retry this same reply to check it safely.",
        );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to confirm delivery.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="admin-reply-panel" aria-labelledby="reply-heading">
      <div className="admin-section-heading">
        <div>
          <span className="admin-eyebrow">
            <Mail size={15} />
            STUDENT EMAIL
          </span>
          <h3 id="reply-heading">Reply to the student</h3>
        </div>
        <button
          type="button"
          className="report-secondary"
          disabled={busy}
          onClick={() => setReload((v) => v + 1)}
        >
          <RefreshCw size={14} />
          Reload conversation
        </button>
      </div>
      <p className="admin-meta">
        To:{" "}
        <strong>{conversation?.recipient || "Checking verified email…"}</strong>
      </p>
      {conversation && !conversation.recipient && (
        <p className="report-error">
          This account has no verified email available. You can still review and
          save the report.
        </p>
      )}
      {conversation && !conversation.configured && (
        <p className="admin-reply-config">
          Email delivery needs server configuration: RESEND_API_KEY and a
          verified REPORT_EMAIL_FROM. Drafts can still be saved.
        </p>
      )}
      <div className="admin-template-actions" aria-label="Reply templates">
        {(["correct", "fixed", "clarify"] as const).map((kind, i) => (
          <button
            type="button"
            className="report-secondary"
            disabled={busy || !!pending}
            key={kind}
            onClick={() => {
              setBody(replyTemplate(kind, report));
              setPreview(false);
              setNotice("");
            }}
          >
            {
              ["Answer is correct", "Question corrected", "Need clarification"][
                i
              ]
            }
          </button>
        ))}
      </div>
      <label className="report-field">
        Email subject
        <input
          value={subject}
          maxLength={160}
          disabled={busy || !!pending}
          onChange={(e) => {
            setSubject(e.target.value);
            setPreview(false);
          }}
        />
      </label>
      <label className="report-field">
        Email message
        <textarea
          rows={9}
          value={body}
          maxLength={6000}
          disabled={busy || !!pending}
          placeholder="Write your review and explain the decision…"
          onChange={(e) => {
            setBody(e.target.value);
            setPreview(false);
          }}
        />
      </label>
      <p className="admin-meta">
        Only this message is emailed. Internal notes and student account details
        stay private. Students can reply to your email address.
      </p>
      {placeholders && (
        <p className="admin-meta">
          Replace the instructions in square brackets before sending.
        </p>
      )}
      {duplicate && (
        <p className="admin-meta">
          This reply has already been accepted. Edit the message before starting
          another reply.
        </p>
      )}
      {pending && (
        <p className="admin-reply-config">
          An earlier send is awaiting confirmation. The message is locked so
          retrying cannot send different content.
        </p>
      )}
      {error && (
        <p role="alert" className="report-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="report-muted">
          {notice}
        </p>
      )}
      {preview && (
        <section className="admin-email-preview" aria-label="Email preview">
          <span className="admin-eyebrow">
            <Eye size={14} />
            EMAIL PREVIEW
          </span>
          <strong>{subject}</strong>
          <p>To: {conversation?.recipient}</p>
          <pre>{body}</pre>
        </section>
      )}
      <div className="admin-actions">
        <button
          className="report-secondary"
          disabled={busy || !!pending || !conversation}
          onClick={saveDraft}
        >
          <Save size={14} />
          Save draft
        </button>
        {pending ? (
          <button
            className="report-primary"
            disabled={
              busy || !conversation?.configured || !conversation.recipient
            }
            onClick={send}
          >
            <RefreshCw size={14} />
            {busy ? "Checking delivery…" : "Retry same reply"}
          </button>
        ) : preview ? (
          <button
            className="report-primary"
            disabled={
              busy ||
              !valid ||
              !conversation?.configured ||
              !conversation.recipient
            }
            onClick={send}
          >
            <Send size={14} />
            {busy ? "Sending…" : "Send reply"}
          </button>
        ) : (
          <button
            className="report-primary"
            disabled={busy || !valid || !conversation}
            onClick={() => setPreview(true)}
          >
            <Eye size={14} />
            Preview email
          </button>
        )}
      </div>
      <div className="admin-reply-history">
        <h4>Reply history</h4>
        {conversation?.replies.length ? (
          conversation.replies.map((r) => (
            <article key={r.id} className="admin-reply-entry">
              <span className="admin-reply-state">
                {r.state === "accepted" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <RefreshCw size={14} />
                )}{" "}
                {r.state === "accepted"
                  ? "Email accepted by provider"
                  : "Delivery not confirmed"}
              </span>
              <strong>{r.subject}</strong>
              <p className="admin-meta">
                {r.to} · {new Date(r.createdAt).toLocaleString()}
              </p>
              <pre>{r.body}</pre>
              <p className="admin-meta">
                {r.providerId
                  ? `Provider reference: ${r.providerId}`
                  : `Send reference: ${r.id}`}
              </p>
            </article>
          ))
        ) : (
          <p className="admin-meta">No replies sent for this report yet.</p>
        )}
      </div>
    </section>
  );
}
