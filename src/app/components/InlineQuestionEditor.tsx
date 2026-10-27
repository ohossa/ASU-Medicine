import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { reportRequest } from "../reports/client";

export interface InlineQuestionEditorProps {
  moduleCode: string;
  chapterId: number;
  question: {
    id: string | number;
    text?: string;
    question?: string;
    type?: string;
    lecture?: number;
    options?: string[];
    correctIndex?: number;
    explanation?: string;
    modelAnswer?: string;
    subQuestions?: any[];
    [key: string]: any;
  };
  revision?: number;
  reportId?: string;
  reportRevision?: number;
  onSaved?: (updatedQuestion: any) => void;
  onCancel?: () => void;
}

export function InlineQuestionEditor({
  moduleCode,
  chapterId,
  question,
  revision = 0,
  reportId,
  reportRevision = 0,
  onSaved,
  onCancel,
}: InlineQuestionEditorProps) {
  const { getToken } = useAuth();

  const [stem, setStem] = useState(question.text || question.question || "");
  const [explanation, setExplanation] = useState(question.explanation || "");
  const [options, setOptions] = useState<string[]>(() =>
    Array.isArray(question.options) ? [...question.options] : ["", ""]
  );
  const [correctIndex, setCorrectIndex] = useState<number>(
    typeof question.correctIndex === "number" ? question.correctIndex : 0
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isMcqOrTf =
    !question.type ||
    question.type === "mcq" ||
    question.type === "truefalse";

  const handleAddOption = () => {
    if (options.length >= 10) return;
    setOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOption = (indexToRemove: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (correctIndex === indexToRemove) {
      setCorrectIndex(0);
    } else if (correctIndex > indexToRemove) {
      setCorrectIndex((prev) => prev - 1);
    }
  };

  const handleOptionTextChange = (index: number, text: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  const handleSave = async (markFixed = false) => {
    setError("");
    setSuccess("");

    if (!stem.trim()) {
      setError("Question stem cannot be empty.");
      return;
    }

    if (isMcqOrTf) {
      if (options.length < 2) {
        setError("At least two options are required.");
        return;
      }
      for (let i = 0; i < options.length; i++) {
        if (!options[i].trim()) {
          setError(`Option ${String.fromCharCode(65 + i)} cannot be blank.`);
          return;
        }
      }
      if (correctIndex < 0 || correctIndex >= options.length) {
        setError("Please designate a valid correct answer.");
        return;
      }
    }

    setBusy(true);

    try {
      // 1. Fetch current question revision to prevent conflicts
      let activeRevision = revision;
      try {
        const single = await reportRequest<{ entry: { revision: number } }>(
          getToken,
          `/api/question-bank?action=single&moduleCode=${encodeURIComponent(
            moduleCode
          )}&questionId=${encodeURIComponent(String(question.id))}`
        );
        if (single?.entry && typeof single.entry.revision === "number") {
          activeRevision = single.entry.revision;
        }
      } catch {
        // Fall back to provided revision
      }

      // 2. Build updated question payload
      const updatedQuestion = {
        ...question,
        id: String(question.id),
        text: stem.trim(),
        explanation: explanation.trim(),
        lecture: question.lecture || 1,
        type: question.type || "mcq",
      };

      if (isMcqOrTf) {
        updatedQuestion.options = options.map((o) => o.trim());
        updatedQuestion.correctIndex = correctIndex;
      }

      // 3. Save question patch to Redis
      const patchPayload = {
        moduleCode,
        chapterId,
        questionId: String(question.id),
        revision: activeRevision,
        question: updatedQuestion,
      };

      const res = await fetch("/api/question-bank", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify(patchPayload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save question edit.");
      }

      // 4. Optionally mark the student report as fixed
      if (markFixed && reportId) {
        await reportRequest(getToken, "", {
          method: "PATCH",
          body: JSON.stringify({
            id: reportId,
            revision: reportRevision,
            status: "fixed",
            notes: "Corrected on the spot via inline admin editor.",
          }),
        });
      }

      setSuccess(
        markFixed
          ? "Question saved and report marked as fixed!"
          : "Question patched successfully!"
      );

      if (onSaved) {
        onSaved(updatedQuestion);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="inline-question-editor rounded-2xl border border-teal-500/30 bg-teal-50/40 p-4 sm:p-6 shadow-sm backdrop-blur-md dark:border-teal-500/20 dark:bg-teal-950/20 transition-all duration-200 mt-4 mb-4"
      aria-label="On the spot question editor"
    >
      <div className="flex items-center justify-between gap-3 border-b border-teal-200/50 pb-3 mb-4 dark:border-teal-800/40">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
            <Sparkles size={14} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              On-the-spot Question Editor
              <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                Live Patch
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {moduleCode} · Question ID: {String(question.id)} · Ch {chapterId}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
            aria-label="Close editor"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
        >
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
        >
          <Check size={15} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Question Stem */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
            Question Stem (Prompt)
          </label>
          <textarea
            rows={3}
            value={stem}
            onChange={(e) => setStem(e.target.value)}
            disabled={busy}
            placeholder="Type or refine the question stem…"
            className="w-full rounded-xl border border-stone-200 bg-white/90 p-3 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-100 transition-all"
          />
        </div>

        {/* Options Editor */}
        {isMcqOrTf && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                Options & Correct Answer
              </label>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Click radio button to mark as correct
              </span>
            </div>

            <div className="space-y-2">
              {options.map((opt, idx) => {
                const isCorrect = correctIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 rounded-xl border p-2 transition-all duration-150 ${
                      isCorrect
                        ? "border-emerald-500/60 bg-emerald-50/60 dark:border-emerald-500/40 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30"
                        : "border-stone-200/80 bg-white/70 dark:border-stone-800 dark:bg-stone-900/60"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setCorrectIndex(idx)}
                      disabled={busy}
                      aria-label={`Mark option ${String.fromCharCode(
                        65 + idx
                      )} as correct answer`}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-semibold text-xs transition-all ${
                        isCorrect
                          ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                      }`}
                    >
                      {isCorrect ? <Check size={14} /> : String.fromCharCode(65 + idx)}
                    </button>

                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      disabled={busy}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}…`}
                      className="flex-1 rounded-lg border-0 bg-transparent px-2 py-1 text-sm text-stone-900 focus:outline-none focus:ring-0 dark:text-stone-100"
                    />

                    {isCorrect && (
                      <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        Correct
                      </span>
                    )}

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        disabled={busy}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                        aria-label={`Remove option ${String.fromCharCode(65 + idx)}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {options.length < 8 && (
              <button
                type="button"
                onClick={handleAddOption}
                disabled={busy}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-teal-500 hover:text-teal-700 dark:border-stone-700 dark:text-stone-400 dark:hover:border-teal-400 transition-colors"
              >
                <Plus size={13} />
                Add Choice Option
              </button>
            )}
          </div>
        )}

        {/* Explanation */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
            Faculty Explanation / Reference
          </label>
          <textarea
            rows={2}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            disabled={busy}
            placeholder="Detailed rationale, citation, or key textbook fact…"
            className="w-full rounded-xl border border-stone-200 bg-white/90 p-3 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-100 transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-teal-200/50 pt-4 dark:border-teal-800/40">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={busy}
          className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-stone-300/80 bg-white px-4 py-2 text-xs font-semibold text-stone-700 shadow-sm hover:bg-stone-50 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 transition-all"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : null}
          Save Question Patch
        </button>

        {reportId && (
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={busy}
            className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 active:scale-[0.98] transition-all"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
            Save & Mark Report Fixed
          </button>
        )}
      </div>
    </div>
  );
}
