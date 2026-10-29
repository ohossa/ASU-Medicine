import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import type {
  QuestionSnapshot,
  ReportSubmission,
} from "../src/app/reports/contracts.js";
import { ReportError } from "./report-service.js";
export async function resolveReportQuestion(
  input: ReportSubmission,
  getEdits?: (moduleCode: string) => Promise<import("./question-edit-service.js").QuestionEdit[]>,
): Promise<QuestionSnapshot> {
  const cleanModule = (input.moduleCode || "").trim().toUpperCase();
  const yearMatch = cleanModule.match(/-(\d+)$/);
  const targetYear = yearMatch ? yearMatch[1] : cleanModule.slice(-1);

  // Try targeted year first, then fallback to candidate years 1..5
  const candidateYears = [targetYear, "1", "2", "3", "4", "5"].filter(
    (v, i, a) => v && a.indexOf(v) === i,
  );

  let edits: import("./question-edit-service.js").QuestionEdit[] = [];
  if (getEdits) {
    try {
      edits = await getEdits(cleanModule);
    } catch (err) {
      console.warn(
        "Failed to fetch live question edits for reporting snapshot, using bank source:",
        err,
      );
      edits = [];
    }
  }

  for (const yr of candidateYears) {
    for (const semester of [1, 2]) {
      let source: string;
      try {
        source = await readFile(
          join(
            process.cwd(),
            "src/imports",
            `year-${yr}`,
            `semester-${semester}`,
            `${cleanModule}.json`,
          ),
          "utf8",
        );
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw e;
      }
      const bank = JSON.parse(source);
      if (bank.meta?.moduleCode !== cleanModule) continue;

      const allChapters: Array<{
        id: number;
        title: string;
        subjects?: Array<{
          id: string;
          name: string;
          lectureNames?: string[];
          questions?: Array<any>;
        }>;
      }> = bank.chapters || [];

      // 1. First attempt: Look inside the specified chapterId
      let chapter = allChapters.find((c) => c.id === input.chapterId);

      // 2. Second attempt: If chapter was not found or question is not in this chapter,
      // search ALL chapters in the module bank!
      const hasQuestion = (c: typeof chapter) =>
        c?.subjects?.some((s) =>
          s.questions?.some((q) => String(q.id) === input.questionId),
        );

      if (!chapter || !hasQuestion(chapter)) {
        const foundInBank = allChapters.find((c) => hasQuestion(c));
        if (foundInBank) {
          chapter = foundInBank;
        }
      }

      if (!chapter) continue;

      for (const subject of chapter.subjects || []) {
        let question = subject.questions?.find(
          (q: { id: string | number }) => String(q.id) === input.questionId,
        );
        const added = edits.find(
          (e) =>
            e.baseVersion === "created" &&
            e.chapterId === chapter!.id &&
            e.subjectId === subject.id &&
            e.questionId === input.questionId,
        );
        if (
          !question &&
          added &&
          !added.deleted &&
          !allChapters.some((c: any) =>
            c.subjects?.some((s: any) =>
              s.questions?.some((q: any) => String(q.id) === input.questionId),
            ),
          )
        ) {
          question = added.question;
        }
        if (!question) continue;
        let destChapter = chapter;
        let destSubject = subject;
        if (getEdits && edits.length > 0) {
          const sourceVersion = createHash("sha256")
            .update(JSON.stringify(question))
            .digest("hex");
          const edit = edits.find(
            (e) =>
              e.chapterId === chapter!.id &&
              e.questionId === input.questionId &&
              e.baseVersion === sourceVersion,
          );
          if (edit?.deleted) continue;
          if (edit) {
            question = edit.question;
            if (edit.targetChapterId !== undefined) {
              const foundCh = allChapters.find((c) => c.id === edit.targetChapterId);
              if (foundCh) destChapter = foundCh;
            }
            if (edit.targetSubjectId !== undefined) {
              const foundSub = destChapter.subjects?.find((s) => s.id === edit.targetSubjectId);
              if (foundSub) destSubject = foundSub;
            }
          }
        }

        if (
          input.subQuestionId &&
          !question.subQuestions?.some(
            (q: { id: string }) => q.id === input.subQuestionId,
          )
        )
          throw new ReportError(404, "That question part could not be found.");
        return {
          moduleCode: cleanModule,
          chapterId: destChapter.id,
          chapterTitle: destChapter.title,
          subjectName: destSubject.name,
          topicName:
            typeof question.lecture === "number"
              ? destSubject.lectureNames?.[question.lecture - 1]
              : undefined,
          version: createHash("sha256")
            .update(JSON.stringify(question))
            .digest("hex"),
          question,
        };
      }
    }
  }

  throw new ReportError(
    404,
    "This question has changed or is unavailable. Refresh the page and try again.",
  );
}
