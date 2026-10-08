import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { FocusTrap } from "focus-trap-react";
import { Flag, X, Check, Loader2 } from "lucide-react";
import { useParams } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { useLanguage } from "../hooks/useLanguage";
import { findQuestionById } from "../data";
import type { Question } from "../types";
import { REPORT_CATEGORIES, type ReportCategory } from "./contracts";
import { reportRequest } from "./client";
import "./reports.css";
interface Target {
  question: Question;
  chapterId: number;
  moduleCode: string;
}
const ReportContext = createContext<((target: Target) => void) | null>(null);
export function ReportQuestionButton({
  question,
  chapterId,
  moduleCode,
}: {
  question: Question;
  chapterId: number;
  moduleCode?: string;
}) {
  const open = useContext(ReportContext);
  const params = useParams();
  const { language } = useLanguage();
  if (!open) return null;
  return (
    <button
      type="button"
      className="question-report-trigger"
      aria-label={language === "ar" ? "الإبلاغ عن مشكلة" : "Report an issue"}
      title={language === "ar" ? "الإبلاغ عن مشكلة" : "Report an issue"}
      onClick={(event) => {
        event.stopPropagation();
        const found = moduleCode ? null : findQuestionById(question.id);
        const code = (
          moduleCode ||
          found?.moduleCode ||
          params.code ||
          ""
        ).toUpperCase();
        open({
          question,
          chapterId: found?.chapter.id ?? chapterId,
          moduleCode: code,
        });
      }}
    >
      <Flag size={13} aria-hidden="true" />
      <span>{language === "ar" ? "إبلاغ" : "Report"}</span>
    </button>
  );
}
export function ReportProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<Target | null>(null);
  return (
    <ReportContext.Provider value={setTarget}>
      {children}
      {target && (
        <ReportDialog target={target} onClose={() => setTarget(null)} />
      )}
    </ReportContext.Provider>
  );
}
function ReportDialog({
  target,
  onClose,
}: {
  target: Target;
  onClose: () => void;
}) {
  const { getToken } = useAuth();
  const { language } = useLanguage();
  const ar = language === "ar";
  const titleId = useId();
  const helpId = useId();
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [explanation, setExplanation] = useState("");
  const [part, setPart] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const requestId = useRef(crypto.randomUUID());
  const busy = useRef(false);
  // Retain a single idempotent payload for retry after an uncertain network response.
  const attempt = useRef<{ signature: string; id: string } | null>(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!category || busy.current) return;
    busy.current = true;
    setSending(true);
    setError("");
    const body = {
      moduleCode: target.moduleCode,
      chapterId: target.chapterId,
      questionId: String(target.question.id),
      category,
      explanation: explanation.trim(),
      ...(part ? { subQuestionId: part } : {}),
    };
    const signature = JSON.stringify(body);
    if (attempt.current && attempt.current.signature !== signature)
      requestId.current = crypto.randomUUID();
    attempt.current = { signature, id: requestId.current };
    try {
      const result = await reportRequest<{ saved: boolean; id: string }>(
        getToken,
        "",
        {
          method: "POST",
          body: JSON.stringify({ ...body, requestId: requestId.current }),
        },
      );
      if (result.saved !== true || typeof result.id !== "string")
        throw new Error(
          "The server did not confirm your report. Please try again.",
        );
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to send report.");
    } finally {
      setSending(false);
      busy.current = false;
    }
  }
  const close = () => {
    if (!busy.current) onClose();
  };
  return createPortal(
    <div
      className="report-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: false,
          clickOutsideDeactivates: false,
          fallbackFocus: () => dialogRef.current!,
          tabbableOptions: { displayCheck: "none" },
        }}
      >
        <section
          ref={dialogRef}
          tabIndex={-1}
          className="report-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={helpId}
          dir={ar ? "rtl" : "ltr"}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
        >
          <button
            className="report-close"
            onClick={close}
            disabled={sending}
            aria-label={ar ? "إغلاق" : "Close report"}
          >
            <X size={18} />
          </button>
          {sent ? (
            <div className="report-success" role="status">
              <span className="report-success-icon">
                <Check size={24} />
              </span>
              <h2 id={titleId}>
                {ar ? "تم استلام البلاغ" : "Report received"}
              </h2>
              <p id={helpId}>
                {ar
                  ? "شكراً لمساعدتنا في تحسين الأسئلة. تم حفظ بلاغك للمراجعة."
                  : "Thank you for helping improve the question bank. Your report has been saved for review."}
              </p>
              <button className="report-primary" onClick={onClose}>
                {ar ? "العودة للسؤال" : "Back to question"}
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="report-heading-icon">
                <Flag size={19} />
              </div>
              <h2 id={titleId}>
                {ar ? "الإبلاغ عن هذا السؤال" : "Report this question"}
              </h2>
              <p id={helpId} className="report-muted">
                {ar
                  ? "ما المشكلة التي لاحظتها؟ سيساعدنا بلاغك في مراجعة السؤال."
                  : "What did you notice? Help us keep the question bank clear and accurate."}
              </p>
              <div className="report-question-preview">
                <span>
                  {target.moduleCode} · {String(target.question.id)}
                </span>
                <p>{target.question.text}</p>
              </div>
              <fieldset disabled={sending}>
                <legend>{ar ? "نوع المشكلة" : "Issue type"}</legend>
                <div className="report-options">
                  {Object.entries(REPORT_CATEGORIES).map(([key, label]) => (
                    <label
                      key={key}
                      className={category === key ? "selected" : ""}
                    >
                      <input
                        type="radio"
                        name="issue-category"
                        value={key}
                        checked={category === key}
                        onChange={() => setCategory(key as ReportCategory)}
                      />
                      <span>{ar ? label.ar : label.en}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {!!target.question.subQuestions?.length && (
                <label className="report-field">
                  {ar ? "جزء السؤال" : "Question part"}
                  <select
                    value={part}
                    onChange={(e) => setPart(e.target.value)}
                    disabled={sending}
                  >
                    <option value="">
                      {ar ? "السؤال بالكامل" : "Whole question"}
                    </option>
                    {target.question.subQuestions.map((q, i) => (
                      <option key={q.id} value={q.id}>
                        {i + 1}. {q.text.slice(0, 85)}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="report-field">
                {ar ? "التوضيح (اختياري)" : "Explanation (optional)"}
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  disabled={sending}
                  required={category === "other"}
                  placeholder={
                    ar
                      ? "اشرح ما لاحظته أو اقترح تصحيحاً…"
                      : "Tell us what seems wrong, or suggest a correction…"
                  }
                />
              </label>
              <div className="report-field-hint">
                <span>
                  {ar
                    ? "سيُرفق مرجع السؤال تلقائياً."
                    : "The question reference is attached automatically."}
                </span>
                <span>{explanation.length}/2000</span>
              </div>
              {error && (
                <p role="alert" className="report-error">
                  {error}
                </p>
              )}
              <footer className="report-dialog-actions">
                <button
                  type="button"
                  className="report-secondary"
                  onClick={close}
                  disabled={sending}
                >
                  {ar ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="report-primary"
                  disabled={
                    !category ||
                    sending ||
                    (category === "other" && !explanation.trim())
                  }
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Flag size={14} />
                  )}{" "}
                  {sending
                    ? ar
                      ? "جارٍ الإرسال…"
                      : "Sending…"
                    : ar
                      ? "إرسال البلاغ"
                      : "Send report"}
                </button>
              </footer>
            </form>
          )}
        </section>
      </FocusTrap>
    </div>,
    document.body,
  );
}
