import { expect, it } from "vitest";
import {
  buildSearchEntries,
  searchEntries,
  answerText,
  highlightParts,
} from "./engine";
import type { Question, ChapterData } from "../types";
const q = (id: string, text: string, extra = {}) =>
  ({
    id,
    text,
    type: "mcq",
    options: ["A", "B"],
    correctIndex: 0,
    explanation: "Useful fact",
    ...extra,
  }) as Question;
const source = (code: string, year: number, questions: Question[]) => ({
  moduleCode: code,
  moduleName: code,
  year,
  semester: 1,
  chapters: [
    {
      id: 1,
      title: "Stomach",
      subjects: [{ id: "histology", name: "Histology", questions }],
    },
  ] as ChapterData[],
});
it("ranks exact stems before option or explanation matches and searches all fields", () => {
  const entries = buildSearchEntries([
    source("MGL-3", 3, [
      q("1", "Lipase activity"),
      q("2", "Another question", { options: ["Lipase", "B"] }),
      q("3", "Last question", { explanation: "Lipase activity" }),
    ]),
  ]);
  expect(
    searchEntries(entries, "lipase", {}).map((e) => e.question.id),
  ).toEqual(["1", "2", "3"]);
});
it("scopes by year and uses composite identities including case children", () => {
  const entries = buildSearchEntries([
    source("MGL-3", 3, [
      q("same", "A case", {
        type: "case",
        subQuestions: [
          {
            id: "child",
            type: "essay",
            text: "Which enzyme?",
            modelAnswer: "Lipase",
          },
        ],
      }),
    ]),
    source("IBM-1", 1, [q("same", "Lipase")]),
  ]);
  expect(new Set(entries.map((e) => e.key)).size).toBe(entries.length);
  expect(
    searchEntries(entries, "lipase", { year: "3" }).some(
      (e) => e.childId === "child",
    ),
  ).toBe(true);
  expect(
    searchEntries(entries, "lipase", { year: "3" }).every((e) => e.year === 3),
  ).toBe(true);
});
it("formats True and False without truthiness and leaves missing keys unresolved", () => {
  expect(answerText(q("t", "", { type: "truefalse", correctIndex: 0 }))).toBe(
    "True",
  );
  expect(answerText(q("f", "", { type: "truefalse", correctIndex: 1 }))).toBe(
    "False",
  );
  expect(
    answerText(q("u", "", { type: "truefalse", correctIndex: undefined })),
  ).toBe("");
});
it("normalizes Arabic and highlights original text safely", () => {
  const entries = buildSearchEntries([
    source("IBM-1", 1, [q("a", "إِنْزِيم الليباز")]),
  ]);
  expect(searchEntries(entries, "انزيم", {})).toHaveLength(1);
  expect(highlightParts("إِنْزِيم الليباز", "انزيم").some((p) => p.match)).toBe(
    true,
  );
  expect(
    highlightParts("<script> + [x]", "[x]")
      .filter((p) => p.match)
      .map((p) => p.text),
  ).toEqual(["[x]"]);
});
it("returns every match instead of dropping results after 100", () => {
  const entries = buildSearchEntries([
    source(
      "MGL-3",
      3,
      Array.from({ length: 151 }, (_, i) => q(String(i), "Lipase")),
    ),
  ]);
  expect(searchEntries(entries, "lipase", {})).toHaveLength(151);
});
