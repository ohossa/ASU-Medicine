import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import type { Question } from "../types";
export function freezeAttempt(questions: Question[]) {
  return compressToUTF16(JSON.stringify(questions));
}
export function restoreAttempt(snapshot?: string): Question[] | null {
  if (!snapshot) return null;
  try {
    const q = JSON.parse(decompressFromUTF16(snapshot));
    return Array.isArray(q) &&
      q.every((v) => v && typeof v.text === "string" && v.id !== undefined)
      ? q
      : null;
  } catch {
    return null;
  }
}
