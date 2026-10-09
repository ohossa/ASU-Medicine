/** Cloud keeps its historical wire key; browser copies are isolated by authenticated account. */
export const HISTORY_WIRE_KEY = "endocrine_essay_quiz_history";
let account: string | null | undefined;
export function setHistoryAccount(id: string | null) {
  account = id;
}
export function historyStorageKey(id: string | null | undefined = account) {
  return id === undefined ? HISTORY_WIRE_KEY : `asu_history:${id ?? "guest"}`;
}

export function historyAccount() { return account; }
