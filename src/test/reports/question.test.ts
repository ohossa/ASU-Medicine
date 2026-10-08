import { describe, it, expect, vi } from "vitest";
import { resolveReportQuestion } from "../../../server/report-question";
import type { ReportSubmission } from "../../app/reports/contracts";
vi.mock("node:fs/promises", () => {
  const readFile = vi.fn(async () =>
    JSON.stringify({
      meta: { moduleCode: "MEM-2" },
      chapters: [
        {
          id: 1,
          title: "Book chapter",
          subjects: [
            {
              id: "anatomy",
              name: "Anatomy",
              lectureNames: ["Oral cavity"],
              questions: [
                {
                  id: "Q1",
                  text: "Canonical source",
                  lecture: 1,
                  type: "case",
                  subQuestions: [{ id: "S1", text: "Part one", type: "essay" }],
                },
              ],
            },
          ],
        },
      ],
    }),
  );
  return { readFile, default: { readFile } };
});
const input = {
  moduleCode: "MEM-2",
  chapterId: 1,
  questionId: "Q1",
} as ReportSubmission;
describe("Canonical question snapshots", () => {
  it("includes actual source content and a stable version hash", async () => {
    const a = await resolveReportQuestion(input),
      b = await resolveReportQuestion(input);
    expect(a.question.text).toBe("Canonical source");
    expect(a.version).toHaveLength(64);
    expect(a.version).toBe(b.version);
    expect(a.subjectName).toBe("Anatomy");
    expect(a.topicName).toBe("Oral cavity");
  });
  it("rejects a missing question or forged case part", async () => {
    await expect(
      resolveReportQuestion({ ...input, questionId: "missing" }),
    ).rejects.toMatchObject({ status: 404 });
    await expect(
      resolveReportQuestion({ ...input, subQuestionId: "missing" }),
    ).rejects.toMatchObject({ status: 404 });
  });
  it('accepts owner-created questions and rejects removed questions',async()=>{
    const added:any={baseVersion:'created',chapterId:1,subjectId:'anatomy',questionId:'NEW',question:{id:'NEW',type:'mcq',text:'Added question',options:['A','B'],correctIndex:0}};
    const snapshot=await resolveReportQuestion({...input,questionId:'NEW'},async()=>[added]);
    expect(snapshot.question.text).toBe('Added question');
    await expect(resolveReportQuestion({...input,questionId:'NEW'},async()=>[{...added,deleted:true}])).rejects.toMatchObject({status:404});
  });

});
