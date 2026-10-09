import type { Question, ChapterData } from "../types";
import { choiceAnswerIndex } from "../utils/quiz";
export interface SearchSource {
  moduleCode: string;
  moduleName: string;
  year: number;
  semester: number;
  chapters: ChapterData[];
}
export interface SearchEntry {
  key: string;
  question: Question;
  parent: Question;
  childId?: string;
  chapterTitle: string;
  chapterId: number;
  chapterKey: string;
  lectureNum?: number;
  subjectId: string;
  subjectName: string;
  moduleName: string;
  moduleCode: string;
  year: number;
  semester: number;
  collection: string;
  fields: string[];
  order: number;
}
export interface SearchFilters {
  year?: string;
  semester?: string;
  module?: string;
  subject?: string;
  chapter?: string;
  collection?: string;
  type?: string;
  flagged?: boolean;
  status?: string;
}
const spelling: Record<string, string> = {
  oesophagus: "esophagus",
  oesophageal: "esophageal",
  haemoglobin: "hemoglobin",
  haem: "heme",
  coeliac: "celiac",
  diarrhoea: "diarrhea",
};
function normalizedMap(text: string) {
  const chars: string[] = [];
  const ranges: Array<[number, number]> = [];
  let offset = 0;
  for (const ch of text) {
    const start = offset;
    offset += ch.length;
    const normalized = ch
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "")
      .replace(/[إأآٱ]/g, "ا");
    if (!normalized && ranges.length) ranges[ranges.length - 1][1] = offset;
    for (const c of normalized) {
      chars.push(c);
      ranges.push([start, offset]);
    }
  }
  return { text: chars.join(""), ranges };
}
export function normalizeSearch(text: string) {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/\s+/g, " ")
    .trim();
}
export function answerText(q: Question) {
  if (q.type === "truefalse") {
    const index = choiceAnswerIndex(q, q.correctIndex);
    return index === 0 ? "True" : index === 1 ? "False" : "";
  }
  if (q.options && q.correctIndex !== undefined)
    return q.options[q.correctIndex] ?? "";
  if (q.type === "matching")
    return q.pairs?.map((p) => `${p.premise} → ${p.target}`).join("\n") ?? "";
  if (q.type === "fillblank") return q.blanks?.join(", ") ?? "";
  return q.modelAnswer ?? "";
}
export function buildSearchEntries(sources: SearchSource[]) {
  const entries: SearchEntry[] = [];
  for (const src of sources)
    for (const c of src.chapters)
      for (const s of c.subjects)
        for (const parent of s.questions) {
          const add = (question: Question, childId?: string) =>
            entries.push({
              key: JSON.stringify([
                src.moduleCode,
                String(parent.id),
                childId ?? "",
              ]),
              question,
              parent,
              childId,
              chapterTitle:
                s.lectureNames?.[(parent.lecture ?? 1) - 1] ?? c.title,
              chapterId: c.id,
              chapterKey: s.lectureNames?.length
                ? `${src.moduleCode}:${c.id}:${s.id}:${parent.lecture ?? 1}`
                : `${src.moduleCode}:${c.id}`,
              lectureNum: s.lectureNames?.length
                ? (parent.lecture ?? 1)
                : undefined,
              subjectId: s.id,
              subjectName: s.name,
              moduleName: src.moduleName,
              moduleCode: src.moduleCode,
              year: src.year,
              semester: src.semester,
              collection: c.bankSection ?? "practice",
              order: entries.length,
              fields: [
                question.text,
                question.options?.join(" ") ?? "",
                question.explanation ?? "",
                answerText(question),
                `${c.title} ${s.lectureNames?.[(parent.lecture ?? 1) - 1] ?? ""} ${s.name} ${src.moduleName} ${src.moduleCode} ${question.tags?.join(" ") ?? ""}`,
              ].map((text) => canonical(normalizeSearch(text))),
            });
          add(parent);
          for (const sub of parent.subQuestions ?? [])
            add(
              {
                ...parent,
                ...sub,
                id: parent.id,
                options: sub.options,
                correctIndex: sub.correctIndex,
                modelAnswer: sub.modelAnswer,
                subQuestions: undefined,
              } as Question,
              sub.id,
            );
        }
  return entries;
}
function canonical(text: string) {
  return text.replace(/[a-z]+/g, (word) => spelling[word] ?? word);
}
export function searchEntries(
  entries: SearchEntry[],
  query: string,
  filters: SearchFilters,
  flagged = new Set<string>(),
  missed = new Set<string>(),
  attempted = new Set<string>(),
) {
  const phrase = canonical(normalizeSearch(query));
  const tokens = phrase.split(" ").filter(Boolean);
  return entries
    .flatMap((e) => {
      if (
        [
          "year",
          "semester",
          "module",
          "subject",
          "chapter",
          "collection",
          "type",
        ].some((k) => {
          const value = filters[k as keyof SearchFilters];
          const actual =
            k === "module"
              ? e.moduleCode
              : k === "subject"
                ? e.subjectId
                : k === "chapter"
                  ? e.chapterKey
                  : k === "type"
                    ? e.question.type
                    : e[k as "year" | "semester" | "collection"];
          return value && value !== "all" && String(actual) !== value;
        })
      )
        return [];
      if (filters.flagged && !flagged.has(String(e.parent.id))) return [];
      const identity = e.moduleCode + ":" + String(e.parent.id);
      if (
        (filters.status === "missed" && !missed.has(identity)) ||
        (filters.status === "unattempted" && attempted.has(identity))
      )
        return [];
      const fields = e.fields;
      const all = fields.join(" ");
      if (tokens.some((t) => !all.includes(t))) return [];
      const weights = [100, 45, 25, 20, 10];
      const score = fields.reduce(
        (n, f, i) =>
          n +
          (phrase && f.includes(phrase) ? weights[i] * 4 : 0) +
          tokens.reduce((n, t) => n + (f.includes(t) ? weights[i] : 0), 0),
        0,
      );
      return [{ entry: e, score }];
    })
    .sort((a, b) => b.score - a.score || a.entry.order - b.entry.order)
    .map((x) => x.entry);
}
export function highlightParts(text: string, query: string) {
  const map = normalizedMap(text),
    needle = normalizedMap(query.trim()).text;
  if (!needle) return [{ text, match: false }];
  const parts: Array<{ text: string; match: boolean }> = [];
  let cursor = 0;
  let from = 0;
  while (true) {
    const index = map.text.indexOf(needle, from);
    if (index < 0) break;
    const start = map.ranges[index][0],
      end = map.ranges[index + needle.length - 1][1];
    if (start > cursor)
      parts.push({ text: text.slice(cursor, start), match: false });
    parts.push({ text: text.slice(start, end), match: true });
    cursor = end;
    from = index + needle.length;
  }
  if (cursor < text.length)
    parts.push({ text: text.slice(cursor), match: false });
  return parts.length ? parts : [{ text, match: false }];
}
export const studyUrl = (e: SearchEntry) =>
  `/year-${e.year}/${e.moduleCode.toLowerCase()}/mixed?${new URLSearchParams({ chapter: String(e.chapterId), subject: e.subjectId, ...(e.lectureNum ? { lecture: String(e.lectureNum) } : {}), question: String(e.parent.id), ...(e.childId ? { child: e.childId } : {}) })}`;
