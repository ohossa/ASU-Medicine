import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { editStore } from "./question-edit-store.js";
import type { QuestionSnapshot } from "../src/app/reports/contracts.js";
/** Load once per batch, applying the same version guards as the public question bank. */
export async function learningBank(
  moduleCode: string,
): Promise<Map<string, QuestionSnapshot>> {
  const result = new Map<string, QuestionSnapshot>();
  const edits = await editStore.list(moduleCode);
  for (const semester of [1, 2]) {
    let bank;
    try {
      bank = JSON.parse(
        await readFile(
          join(
            process.cwd(),
            "src/imports",
            `year-${moduleCode.slice(-1)}`,
            `semester-${semester}`,
            moduleCode + ".json",
          ),
          "utf8",
        ),
      );
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw e;
    }
    if (bank.comingSoon || bank.meta?.moduleCode !== moduleCode) continue;
    for (const ch of bank.chapters ?? [])
      for (const s of ch.subjects ?? []) {
        const items = [
          ...(s.questions ?? []),
          ...edits
            .filter(
              (e) =>
                e.baseVersion === "created" &&
                !e.deleted &&
                e.chapterId === ch.id &&
                e.subjectId === s.id,
            )
            .map((e) => e.question),
        ];
        for (let q of items) {
          const version = createHash("sha256")
            .update(JSON.stringify(q))
            .digest("hex");
          const edit = edits.find(
            (e) =>
              e.chapterId === ch.id &&
              e.questionId === String(q.id) &&
              e.baseVersion === version,
          );
          if (edit?.deleted) continue;
          if (edit) q = edit.question;
          const id = String(q.id);
          if (result.has(id))
            throw new Error("Duplicate canonical question ID.");
          result.set(id, {
            moduleCode,
            chapterId: ch.id,
            chapterTitle: ch.title,
            subjectName: s.name,
            topicName: s.lectureNames?.[(q.lecture ?? 1) - 1],
            version: createHash("sha256")
              .update(JSON.stringify(q))
              .digest("hex"),
            question: q,
          });
        }
      }
  }
  return result;
}
