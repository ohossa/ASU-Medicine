import { useState } from "react";
import { Mail, Copy, Check, ExternalLink, X, Send, Award, HeartHandshake } from "lucide-react";

export interface StudentEmailReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentEmail: string;
  studentName?: string;
  moduleCode?: string;
  questionId?: string;
  reportedCategory?: string;
  reportExplanation?: string;
}

export function StudentEmailReplyModal({
  isOpen,
  onClose,
  studentEmail,
  studentName = "Student",
  moduleCode,
  questionId,
  reportedCategory = "Question feedback",
  reportExplanation = "",
}: StudentEmailReplyModalProps) {
  if (!isOpen) return null;

  const isQuestionReport = Boolean(questionId);

  const defaultSubject = isQuestionReport
    ? `[ASUCodes] Follow-up on your report for ${moduleCode || "Question Bank"} (Q#${questionId})`
    : `[ASUCodes] Academic Guidance & Performance · Ain Shams Medicine`;

  const templates = isQuestionReport
    ? [
        {
          title: "Question Corrected & Verified",
          body: `Dear ${studentName},\n\nThank you for taking the time to report an issue with Question #${questionId} in ${moduleCode || "your module"}.\n\nOur faculty review has verified your feedback, and the question text / answer key has now been updated on the live website.\n\nThank you for helping us maintain the highest standard of academic accuracy.\n\nBest regards,\nOmar H. Maged\nASUCodes Medical Portal`,
        },
        {
          title: "Explanation Clarification",
          body: `Dear ${studentName},\n\nThank you for reaching out regarding Question #${questionId} in ${moduleCode || "your module"}.\n\nWe carefully reviewed the curriculum textbooks and lecture references for this topic. We have enriched the detailed explanation on the platform to clarify this clinical concept.\n\nKeep up the great work with your studies!\n\nBest regards,\nOmar H. Maged\nASUCodes Medical Portal`,
        },
        {
          title: "Curriculum Source Grounding",
          body: `Dear ${studentName},\n\nRegarding your note on Question #${questionId} in ${moduleCode || "your module"}:\n\nThis question aligns directly with the official Ain Shams University department lecture notes and past exam key. We have added extra reference notes to help clarify the distinction.\n\nWarm regards,\nOmar H. Maged\nASUCodes Medical Portal`,
        },
      ]
    : [
        {
          title: "Academic Recognition (Top Performer)",
          body: `Dear ${studentName},\n\nCongratulations on your outstanding performance on the ASUCodes medical platform! Your high consistency, accuracy, and study streak place you among the top performers on the portal.\n\nWe are proud of your dedication and wish you continued excellence in your Ain Shams medical studies.\n\nWarm regards,\nOmar H. Maged\nASUCodes Medical Portal`,
        },
        {
          title: "Study Guidance & Module Support",
          body: `Dear ${studentName},\n\nWe noticed your active practice and dedication across your medical question banks on ASUCodes.\n\nIf you ever need additional high-yield explanations, faculty references, or past exam question walk-throughs for any specific topics, feel free to reply directly to this email.\n\nBest of luck with your continuous assessments!\n\nBest regards,\nOmar H. Maged\nASUCodes Medical Portal`,
        },
        {
          title: "Faculty Feedback & Inquiries",
          body: `Dear ${studentName},\n\nThank you for being an active learner on the ASUCodes Medical Portal.\n\nWe are constantly improving the platform to best support your studies at Ain Shams University Faculty of Medicine. Please let us know if there is anything we can do to further enhance your preparation.\n\nWarm regards,\nOmar H. Maged\nASUCodes Medical Portal`,
        },
      ];

  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(templates[0].body);
  const [copied, setCopied] = useState(false);

  const handleTemplateSelect = (idx: number) => {
    setSelectedTemplate(idx);
    setBody(templates[idx].body);
  };

  const mailtoHref = `mailto:${encodeURIComponent(
    studentEmail
  )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleCopyBody = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reply-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl rounded-2xl border border-stone-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/95 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              {isQuestionReport ? <Mail size={16} /> : <Award size={16} />}
            </span>
            <div>
              <h2 id="reply-modal-title" className="text-base font-semibold text-stone-900 dark:text-stone-100">
                {isQuestionReport ? "Direct Student Reply" : "Personal Student Outreach"}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                To: <span className="font-medium text-stone-700 dark:text-stone-300">{studentEmail}</span>
                {reportedCategory && isQuestionReport ? ` · ${reportedCategory}` : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {reportExplanation && isQuestionReport && (
          <div className="mt-3 rounded-xl bg-stone-50 p-2.5 text-xs text-stone-600 dark:bg-stone-800/40 dark:text-stone-300 border border-stone-100 dark:border-stone-800">
            <span className="font-semibold text-stone-700 dark:text-stone-200">Student's report note:</span> {reportExplanation}
          </div>
        )}

        {/* Template Pills */}
        <div className="mt-4">
          <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
            <HeartHandshake size={13} className="text-teal-600" />
            Quick Response Templates
          </span>
          <div className="flex flex-wrap gap-1.5">
            {templates.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleTemplateSelect(i)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedTemplate === i
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/70 dark:bg-stone-800 dark:text-stone-300"
                }`}
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Subject & Body */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2 text-xs text-stone-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-300">
                Email Message
              </label>
              <button
                type="button"
                onClick={handleCopyBody}
                className="inline-flex items-center gap-1 text-[11px] text-teal-600 hover:underline dark:text-teal-400"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy text"}
              </button>
            </div>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs text-stone-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
          >
            Cancel
          </button>
          <a
            href={mailtoHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 active:scale-[0.98] transition-all"
          >
            <Send size={13} />
            Open in Mail Client
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
}
