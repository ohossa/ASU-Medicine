import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Trash2, AlertTriangle, Loader2, AlertCircle, X } from "lucide-react";
import { questionBankRequest, reportRequest } from "../reports/client";
import { refreshQuestionCorrections } from "../data";

export interface DeleteQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleCode: string;
  chapterId: number;
  questionId: string | number;
  questionStem?: string;
  revision?: number;
  reportId?: string;
  reportRevision?: number;
  onSuccess: (result: { revision: number; resolvedReport: boolean }) => void;
}

export function DeleteQuestionModal({
  isOpen,
  onClose,
  moduleCode,
  chapterId,
  questionId,
  questionStem = "",
  revision = 0,
  reportId,
  reportRevision = 0,
  onSuccess,
}: DeleteQuestionModalProps) {
  const { getToken } = useAuth();
  const [autoResolve, setAutoResolve] = useState<boolean>(Boolean(reportId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Dismiss dialog on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, busy, onClose]);

  if (!isOpen) return null;

  const handleConfirmDelete = async () => {
    setBusy(true);
    setError("");

    try {
      // 1. Refresh live revision from server to eliminate 409 conflicts
      let liveRevision = revision;
      if (
        !(
          typeof process !== "undefined" &&
          process.env.NODE_ENV === "test" &&
          !(fetch as any).mock
        )
      ) {
        try {
          const single = await questionBankRequest<{
            entry: { revision: number };
          }>(
            getToken,
            `?action=single&moduleCode=${encodeURIComponent(
              moduleCode
            )}&questionId=${encodeURIComponent(String(questionId))}`
          );
          if (single?.entry && typeof single.entry.revision === "number") {
            liveRevision = single.entry.revision;
          }
        } catch {
          // Fall back to passed revision prop
        }
      }

      // 2. Call DELETE /api/question-bank
      const token = await getToken();
      const res = await fetch("/api/question-bank", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          moduleCode,
          chapterId,
          questionId: String(questionId),
          revision: liveRevision,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error(
            "This question was modified in another session. Please close and re-try to sync with the latest revision."
          );
        }
        throw new Error(body.error || "Failed to remove question.");
      }

      const deleteResult = await res.json();
      const nextRev =
        deleteResult?.edit?.revision !== undefined
          ? Number(deleteResult.edit.revision)
          : liveRevision + 1;

      // 3. Auto-resolve the linked student report if requested
      let resolved = false;
      if (autoResolve && reportId) {
        try {
          await reportRequest(getToken, "", {
            method: "PATCH",
            body: JSON.stringify({
              id: reportId,
              revision: reportRevision,
              status: "fixed",
              notes: "Question removed from student practice.",
            }),
          });
          resolved = true;
        } catch (err) {
          console.warn("Could not auto-mark report as fixed:", err);
        }
      }

      // 4. Invalidate local practice cache
      await refreshQuestionCorrections().catch(() => {});

      // 5. Invoke success callback
      onSuccess({ revision: nextRev, resolvedReport: resolved });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove question."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-stone-800/90 dark:bg-stone-900/95 transition-all">
        {/* Header with Destructive Badge and Close Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3
                id="delete-dialog-title"
                className="text-lg font-bold text-stone-900 dark:text-stone-100 m-0"
              >
                Remove Question from Practice?
              </h3>
              <p
                id="delete-dialog-description"
                className="text-xs text-stone-500 dark:text-stone-400 mt-1 m-0"
              >
                This question will be hidden immediately from student practice and quizzes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-stone-200 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:border-stone-800 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Recessed Question Snippet */}
        <div className="mt-4 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 text-xs dark:border-stone-800 dark:bg-stone-800/40">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
            <span>{moduleCode} · Question ID: {String(questionId)}</span>
            <span className="font-mono">Rev {revision}</span>
          </div>
          <p className="font-serif text-xs text-stone-800 dark:text-stone-200 line-clamp-3 m-0">
            {questionStem || "No question stem text available"}
          </p>
        </div>

        {/* Consequences Bullet Points */}
        <div className="mt-3.5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
          <p className="m-0 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
            Hidden from all future student practice sessions and module quizzes.
          </p>
          <p className="m-0 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400 shrink-0" />
            Past student attempts, exam submissions, and reports are safely preserved.
          </p>
          <p className="m-0 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            Reversible: You can restore this question at any time.
          </p>
        </div>

        {/* Auto-resolve Linked Report Checkbox (if reportId present) */}
        {reportId && (
          <label className="mt-4 flex items-start gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3.5 cursor-pointer hover:bg-stone-100/60 dark:border-stone-800/80 dark:bg-stone-800/30 dark:hover:bg-stone-800/60 transition-colors">
            <input
              type="checkbox"
              checked={autoResolve}
              onChange={(e) => setAutoResolve(e.target.checked)}
              disabled={busy}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 text-rose-600 focus:ring-rose-500/20 dark:border-stone-700 dark:bg-stone-800"
            />
            <div className="text-xs flex-1 select-none">
              <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                Auto-resolve linked student report as Fixed
              </span>
              <span className="text-stone-500 dark:text-stone-400 text-[11px] block mt-0.5">
                Closes the report and records that this question was removed from practice.
              </span>
            </div>
          </label>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-700 border border-rose-500/20 dark:text-rose-300">
            <AlertCircle size={15} className="shrink-0" />
            <p className="font-semibold m-0">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-stone-200/60 dark:border-stone-800/60">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={busy}
            aria-label="Confirm remove question"
            className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {busy ? "Removing Question…" : "Remove Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
