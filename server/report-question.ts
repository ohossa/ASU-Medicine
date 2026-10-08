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
  const year = input.moduleCode.slice(-1);
  for (const semester of [1, 2]) {
    let source: string;
    try {
      source = await readFile(
        join(
          process.cwd(),
          "src/imports",
          `year-${year}`,
          `semester-${semester}`,
          `${input.moduleCode}.json`,
        ),
        "utf8",
      );
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw e;
    }
    const bank = JSON.parse(source);
    if (bank.meta?.moduleCode !== input.moduleCode) continue;
    const chapter = bank.chapters?.find(
      (c: { id: number }) => c.id === input.chapterId,
    );
    const edits = getEdits ? await getEdits(input.moduleCode) : [];
    for (const subject of chapter?.subjects || []) {
      let question = subject.questions?.find(
        (q: { id: string | number }) => String(q.id) === input.questionId,
      );
      const added = edits.find(e => e.baseVersion === 'created' && e.chapterId === chapter.id && e.subjectId === subject.id && e.questionId === input.questionId);
      if (!question && added && !added.deleted && !bank.chapters.some((c:any)=>c.subjects.some((s:any)=>s.questions.some((q:any)=>String(q.id)===input.questionId)))) question = added.question;
      if (!question) continue;
      if (getEdits) {
        const sourceVersion = createHash('sha256').update(JSON.stringify(question)).digest('hex');
        const edit = edits.find(e => e.chapterId === chapter.id && e.questionId === input.questionId && e.baseVersion === sourceVersion);
        if (edit?.deleted) continue;
        if (edit) question = edit.question;
      }

      if (
        input.subQuestionId &&
        !question.subQuestions?.some(
          (q: { id: string }) => q.id === input.subQuestionId,
        )
      )
        throw new ReportError(404, "That question part could not be found.");
      return {
        moduleCode: input.moduleCode,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        subjectName: subject.name,
        topicName: typeof question.lecture === 'number' ? subject.lectureNames?.[question.lecture - 1] : undefined,
        version: createHash("sha256")
          .update(JSON.stringify(question))
          .digest("hex"),
        question,
      };
    }
  }
  throw new ReportError(
    404,
    "This question has changed or is unavailable. Refresh the page and try again.",
  );
}
