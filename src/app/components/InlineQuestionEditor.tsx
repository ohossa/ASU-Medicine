import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  RefreshCw,
  FolderTree,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { reportRequest, questionBankRequest } from "../reports/client";
import { DeleteQuestionModal } from "./DeleteQuestionModal";

export interface InlineQuestionEditorProps {
  moduleCode: string;
  chapterId: number;
  subjectId?: string;
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
  chapters?: any[];
  onSaved?: (
    updatedQuestion: any,
    newRevision?: number,
    relocation?: {
      chapterId: number;
      chapterTitle: string;
      subjectId: string;
      subjectName: string;
      topicName?: string;
    }
  ) => void;
  onDeleted?: (deletedQuestionId: string, newRevision?: number) => void;
  onCancel?: () => void;
}

export function InlineQuestionEditor({
  moduleCode,
  chapterId,
  subjectId,
  question,
  revision = 0,
  reportId,
  reportRevision = 0,
  chapters: initialChapters,
  onSaved,
  onDeleted,
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

  const [chapters, setChapters] = useState<any[]>(initialChapters || []);
  const [selectedChapterId, setSelectedChapterId] = useState<number>(chapterId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjectId || "");
  const [selectedLecture, setSelectedLecture] = useState<number>(question.lecture || 1);
  const [initialRouting, setInitialRouting] = useState<{
    chapterId: number;
    subjectId: string;
    lecture: number;
    chapterTitle?: string;
    subjectName?: string;
  }>({
    chapterId,
    subjectId: subjectId || "",
    lecture: question.lecture || 1,
  });

  const [activeRevision, setActiveRevision] = useState<number>(revision);
  const [busy, setBusy] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isMcqOrTf =
    !question.type ||
    question.type === "mcq" ||
    question.type === "truefalse";

  // Fetch latest live revision and chapters from server on mount or when question ID changes
  useEffect(() => {
    let cancelled = false;
    async function fetchLatestRevision() {
      // In offline tests without a mocked fetch, avoid connection attempts to localhost
      if (
        typeof process !== "undefined" &&
        process.env.NODE_ENV === "test" &&
        !(fetch as any).mock
      ) {
        return;
      }

      try {
        const single = await questionBankRequest<{
          entry: {
            revision: number;
            chapterId?: number;
            chapterTitle?: string;
            subjectId?: string;
            subjectName?: string;
            question?: any;
          };
          chapters?: any[];
        }>(
          getToken,
          `?action=single&moduleCode=${encodeURIComponent(
            moduleCode
          )}&questionId=${encodeURIComponent(String(question.id))}`
        );
        if (cancelled) return;
        if (single?.chapters && Array.isArray(single.chapters) && single.chapters.length > 0) {
          setChapters(single.chapters);
        }
        if (single?.entry) {
          if (typeof single.entry.revision === "number") {
            setActiveRevision(single.entry.revision);
          }
          const chId = single.entry.chapterId ?? chapterId;
          const subId = single.entry.subjectId ?? subjectId ?? "";
          const lec = single.entry.question?.lecture ?? question.lecture ?? 1;
          setSelectedChapterId(chId);
          setSelectedSubjectId(subId);
          setSelectedLecture(lec);
          setInitialRouting({
            chapterId: chId,
            subjectId: subId,
            lecture: lec,
            chapterTitle: single.entry.chapterTitle,
            subjectName: single.entry.subjectName,
          });
        }
      } catch {
        // Fall back to provided revision prop
      }
    }
    fetchLatestRevision().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [moduleCode, question.id, chapterId, subjectId]);

  useEffect(() => {
    if (chapters.length > 0 && !selectedSubjectId) {
      const matchCh = chapters.find((c) => c.id === selectedChapterId) || chapters[0];
      if (matchCh?.subjects?.length > 0) {
        setSelectedSubjectId(matchCh.subjects[0].id);
      }
    }
  }, [chapters, selectedChapterId, selectedSubjectId]);

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

  const refreshRevisionFromServer = async (): Promise<number> => {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "test" &&
      !(fetch as any).mock
    ) {
      return activeRevision;
    }
    try {
      const single = await questionBankRequest<{ entry: { revision: number } }>(
        getToken,
        `?action=single&moduleCode=${encodeURIComponent(
          moduleCode
        )}&questionId=${encodeURIComponent(String(question.id))}`
      );
      if (single?.entry && typeof single.entry.revision === "number") {
        setActiveRevision(single.entry.revision);
        return single.entry.revision;
      }
    } catch {
      // Fallback
    }
    return activeRevision;
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
      // 1. Refresh latest revision right before saving to eliminate 409 conflicts
      const currentRev = await refreshRevisionFromServer();

      // 2. Build updated question payload
      const updatedQuestion = {
        ...question,
        id: String(question.id),
        text: stem.trim(),
        explanation: explanation.trim(),
        lecture: selectedLecture || question.lecture || 1,
        type: question.type || "mcq",
      };

      if (isMcqOrTf) {
        updatedQuestion.options = options.map((o) => o.trim());
        updatedQuestion.correctIndex = correctIndex;
      }

      // 3. Save question patch to server
      const patchPayload: Record<string, any> = {
        moduleCode,
        chapterId,
        questionId: String(question.id),
        revision: currentRev,
        question: updatedQuestion,
      };

      if (selectedChapterId !== undefined) {
        patchPayload.targetChapterId = selectedChapterId;
      }
      if (selectedSubjectId) {
        patchPayload.targetSubjectId = selectedSubjectId;
      }

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
        if (res.status === 409) {
          // Auto-sync to latest revision so immediate next save works
          const latestRev = await refreshRevisionFromServer();
          throw new Error(
            `Question revision was updated in the background to Rev ${latestRev}. Click "Save Question Patch" again to apply your changes.`
          );
        }
        throw new Error(body.error || "Failed to save question edit.");
      }

      const patchResult = await res.json();
      const nextRev =
        patchResult?.edit?.revision !== undefined
          ? Number(patchResult.edit.revision)
          : currentRev + 1;

      // Update local revision tracker so consecutive saves never throw 409
      setActiveRevision(nextRev);

      // 4. Optionally mark the student report as fixed
      if (markFixed && reportId) {
        await reportRequest(getToken, "", {
          method: "PATCH",
          body: JSON.stringify({
            id: reportId,
            revision: reportRevision,
            status: "fixed",
            notes: `Question correction published (Revision ${nextRev}). Stem and answers verified.`,
          }),
        }).catch((err) => {
          console.warn("Could not auto-mark report as fixed:", err);
        });
      }

      setSuccess(
        `Question correction published successfully (Revision ${nextRev})!`
      );

      if (onSaved) {
        const destCh = chapters.find((c) => c.id === selectedChapterId);
        const destSub = destCh?.subjects?.find((s: any) => s.id === selectedSubjectId);
        const topicName = destSub?.lectureNames?.[selectedLecture - 1];
        onSaved(updatedQuestion, nextRev, {
          chapterId: selectedChapterId,
          chapterTitle: destCh?.title || `Chapter ${selectedChapterId}`,
          subjectId: selectedSubjectId,
          subjectName: destSub?.name || selectedSubjectId,
          topicName,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save question edit."
      );
    } finally {
      setBusy(false);
    }
  };

  const currentChapterObj = chapters.find((c) => c.id === selectedChapterId);
  const currentSubjectObj = currentChapterObj?.subjects?.find((s: any) => s.id === selectedSubjectId);
  const initialChapterObj = chapters.find((c) => c.id === initialRouting.chapterId);
  const initialSubjectObj = initialChapterObj?.subjects?.find((s: any) => s.id === initialRouting.subjectId);

  const isRelocated =
    selectedChapterId !== initialRouting.chapterId ||
    (Boolean(selectedSubjectId) && Boolean(initialRouting.subjectId) && selectedSubjectId !== initialRouting.subjectId) ||
    selectedLecture !== initialRouting.lecture;

  return (
    <div className="rounded-2xl border-2 border-teal-500/30 bg-teal-500/[0.03] p-5 shadow-sm dark:border-teal-500/20 dark:bg-teal-500/[0.02]">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-teal-200/50 dark:border-teal-800/40">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
            <Sparkles size={14} />
          </span>
          <div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 m-0">
              On-The-Spot Question Editor
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 m-0 flex items-center gap-1.5">
              <span>{moduleCode} · Question ID: {String(question.id)}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 font-semibold">
                Revision {activeRevision}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshRevisionFromServer}
            disabled={busy}
            title="Refresh revision from server"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300 dark:border-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
          >
            <RefreshCw size={12} className={busy ? "animate-spin" : ""} />
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
              aria-label="Close editor"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-700 border border-rose-500/20 dark:text-rose-300">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold m-0">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-800 border border-emerald-500/20 dark:text-emerald-300">
          <Check size={15} className="shrink-0" />
          <p className="font-semibold m-0">{success}</p>
        </div>
      )}

      {/* Editor Body */}
      <div className="space-y-4">
        {/* Curriculum Routing & Placement */}
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/[0.04] p-3.5 dark:border-teal-500/15 dark:bg-teal-500/[0.02]">
          <div className="flex items-center gap-2 mb-2.5">
            <FolderTree size={15} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-200">
                Curriculum Routing & Placement
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 m-0">
                Move this question to another subject, chapter, or lecture topic directly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="destination-subject-select"
                className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1"
              >
                Destination Chapter & Subject
              </label>
              {chapters.length > 0 ? (
                <select
                  id="destination-subject-select"
                  aria-label="Destination Chapter and Subject"
                  value={`${selectedChapterId}:${selectedSubjectId}`}
                  onChange={(e) => {
                    const [cIdStr, sId] = e.target.value.split(":");
                    const cId = Number(cIdStr);
                    setSelectedChapterId(cId);
                    setSelectedSubjectId(sId);
                    setSelectedLecture(1);
                  }}
                  disabled={busy}
                  className="w-full min-h-[44px] rounded-xl border border-stone-200 bg-white/95 px-3 py-2 text-xs font-medium text-stone-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                >
                  {chapters.flatMap((c) =>
                    (c.subjects || []).map((s: any) => (
                      <option key={`${c.id}:${s.id}`} value={`${c.id}:${s.id}`}>
                        {c.title} · {s.name}
                      </option>
                    ))
                  )}
                </select>
              ) : (
                <div className="flex min-h-[44px] items-center rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300">
                  Chapter {selectedChapterId} · Subject {selectedSubjectId || "Current"}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="destination-lecture-select"
                className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1"
              >
                Lecture / Topic
              </label>
              {currentSubjectObj?.lectureNames && currentSubjectObj.lectureNames.length > 0 ? (
                <select
                  id="destination-lecture-select"
                  aria-label="Lecture or Topic"
                  value={selectedLecture}
                  onChange={(e) => setSelectedLecture(Number(e.target.value))}
                  disabled={busy}
                  className="w-full min-h-[44px] rounded-xl border border-stone-200 bg-white/95 px-3 py-2 text-xs font-medium text-stone-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                >
                  {currentSubjectObj.lectureNames.map((name: string, idx: number) => (
                    <option key={idx} value={idx + 1}>
                      {idx + 1}. {name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="destination-lecture-select"
                  aria-label="Lecture or Topic"
                  type="number"
                  min={1}
                  value={selectedLecture}
                  onChange={(e) => setSelectedLecture(Math.max(1, Number(e.target.value) || 1))}
                  disabled={busy}
                  placeholder="Lecture number (e.g. 1)"
                  className="w-full min-h-[44px] rounded-xl border border-stone-200 bg-white/95 px-3 py-2 text-xs font-medium text-stone-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                />
              )}
            </div>
          </div>

          {/* Relocation indicator banner */}
          {isRelocated && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-900 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-200">
              <ArrowRight size={14} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold m-0">
                  Relocating question:{" "}
                  <span className="line-through opacity-75">
                    {initialSubjectObj?.name || initialRouting.subjectName || `Chapter ${initialRouting.chapterId}`}
                    {" "}(Lec {initialRouting.lecture})
                  </span>
                  {" "}→{" "}
                  <span className="font-bold underline">
                    {currentSubjectObj?.name || `Chapter ${selectedChapterId}`}
                    {" "}(Lec {selectedLecture}
                    {currentSubjectObj?.lectureNames?.[selectedLecture - 1]
                      ? `: ${currentSubjectObj.lectureNames[selectedLecture - 1]}`
                      : ""}
                    )
                  </span>
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 m-0 flex items-center gap-1">
                  <ShieldCheck size={12} className="shrink-0" />
                  <span>Question ID <strong>{String(question.id)}</strong> is permanently preserved. Student quiz history and reports remain intact.</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Question Stem */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
            Question Stem
          </label>
          <textarea
            rows={3}
            value={stem}
            onChange={(e) => setStem(e.target.value)}
            disabled={busy}
            placeholder="Question prompt text…"
            className="w-full rounded-xl border border-stone-200 bg-white/90 p-3 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-100 transition-all font-serif"
          />
        </div>

        {/* MCQ Choices */}
        {isMcqOrTf && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                Answer Choices & Correct Answer
              </label>
              <span className="text-[11px] text-stone-400">
                Click letter to mark as correct
              </span>
            </div>

            <div className="space-y-2">
              {options.map((opt, idx) => {
                const isCorrect = correctIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 rounded-xl border p-2 transition-all ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-50/70 dark:border-emerald-500/60 dark:bg-emerald-950/20"
                        : "border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setCorrectIndex(idx)}
                      disabled={busy}
                      aria-label={`Mark option ${String.fromCharCode(
                        65 + idx
                      )} as correct answer`}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
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
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 border-t border-teal-200/50 pt-4 dark:border-teal-800/40">
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          disabled={busy}
          className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100/80 hover:text-rose-700 hover:border-rose-300 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 transition-all active:scale-[0.98]"
        >
          <Trash2 size={14} />
          Delete Question
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="min-h-[44px] px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={busy}
            className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-stone-300/80 bg-white px-4 py-2 text-xs font-semibold text-stone-700 shadow-sm hover:bg-stone-50 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 transition-all"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : null}
            Save Question Patch
          </button>

          {reportId && (
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={busy}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 active:scale-[0.98] transition-all"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
              Save & Mark Report Fixed
            </button>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteQuestionModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          moduleCode={moduleCode}
          chapterId={chapterId}
          questionId={question.id}
          questionStem={stem}
          revision={activeRevision}
          reportId={reportId}
          reportRevision={reportRevision}
          onSuccess={(result) => {
            setShowDeleteModal(false);
            if (onDeleted) {
              onDeleted(String(question.id), result.revision);
            }
          }}
        />
      )}
    </div>
  );
}
