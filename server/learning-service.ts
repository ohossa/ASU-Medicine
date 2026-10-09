import { ReportError } from "./report-service.js";
import { prepareReward } from "./learning-policy.js";
import { REWARDS, TITLES } from "../src/app/learning/contracts.js";
import type { QuestionSnapshot } from "../src/app/reports/contracts.js";
interface Dependencies {
  authenticate: (token: string) => Promise<{ id: string }>;
  year: (id: string) => Promise<number>;
  bank: (code: string) => Promise<Map<string, QuestionSnapshot>>;
  award: (
    id: string,
    year: number,
    rewards: NonNullable<ReturnType<typeof prepareReward>>[],
  ) => Promise<unknown>;
  dashboard: (id: string, year: number, period?: string) => Promise<unknown>;
  profile: (id: string, year: number) => Promise<{ level: number }>;
  saveProfile: (
    id: string,
    year: number,
    patch: Record<string, unknown>,
  ) => Promise<unknown>;
  rate: (id: string) => Promise<boolean>;
}
export function createLearningService(d: Dependencies) {
  async function account(token: string) {
    const { id } = await d.authenticate(token);
    const year = await d.year(id);
    if (!Number.isInteger(year) || year < 1 || year > 5)
      throw new ReportError(409, "Choose and save your academic year first.");
    return { id, year };
  }
  return {
    async overview(token: string, period = "weekly") {
      const { id, year } = await account(token);
      return d.dashboard(id, year, period === "all" ? "all" : "weekly");
    },
    async submit(token: string, input: unknown) {
      const { id, year } = await account(token);
      if (!(await d.rate(id)))
        throw new ReportError(
          429,
          "Too many learning updates. Please retry later.",
        );
      const b = input as { moduleCode?: unknown; items?: unknown };
      if (
        !b ||
        typeof b.moduleCode !== "string" ||
        !/^[A-Z0-9-]+-[1-5]$/.test(b.moduleCode) ||
        !Array.isArray(b.items) ||
        b.items.length < 1 ||
        b.items.length > 100
      )
        throw new ReportError(400, "Invalid learning submission.");
      if (!b.moduleCode.endsWith("-" + year))
        throw new ReportError(400, "Only your current academic year earns XP.");
      const bank = await d.bank(b.moduleCode),
        seen = new Set<string>(),
        rewards: NonNullable<ReturnType<typeof prepareReward>>[] = [];
      for (const item of b.items) {
        if (
          !item ||
          typeof item.questionId !== "string" ||
          item.questionId.length > 180 ||
          seen.has(item.questionId)
        )
          throw new ReportError(400, "Invalid or duplicate question.");
        seen.add(item.questionId);
        const snapshot = bank.get(item.questionId);
        if (!snapshot)
          throw new ReportError(
            409,
            "A question changed or is unavailable. Refresh the bank.",
          );
        if (["case", "casestudy"].includes(snapshot.question.type)) {
          const answers =
            item.answer && typeof item.answer === "object" ? item.answer : {};
          for (const sub of (snapshot.question.subQuestions ??
            []) as QuestionSnapshot["question"][]) {
            const q = {
              ...sub,
              id: item.questionId + "/" + sub.id,
              text: (snapshot.question.text ?? "") + " " + (sub.text ?? ""),
            };
            const reward = prepareReward(
              { ...snapshot, question: q },
              answers[sub.id],
            );
            if (reward) rewards.push(reward);
          }
        } else {
          const reward = prepareReward(snapshot, item.answer);
          if (reward) rewards.push(reward);
        }
      }
      if (rewards.length > 300)
        throw new ReportError(400, "Too many question parts.");
      return d.award(id, year, rewards);
    },
    async settings(token: string, input: unknown) {
      const { id, year } = await account(token);
      const b = input as Record<string, unknown>;
      if (!b || typeof b !== "object" || Array.isArray(b))
        throw new ReportError(400, "Invalid settings.");
      const patch: Record<string, unknown> = {},
        p = await d.profile(id, year);
      if (b.optIn !== undefined) {
        if (typeof b.optIn !== "boolean")
          throw new ReportError(400, "Invalid consent.");
        patch.optIn = b.optIn;
      }
      if (b.alias !== undefined) {
        if (
          typeof b.alias !== "string" ||
          !/^[\p{L}\p{N} _'-]{3,24}$/u.test(b.alias.trim())
        )
          throw new ReportError(
            400,
            "Use an alias of 3–24 letters or numbers, without an email address.",
          );
        patch.alias = b.alias.trim();
      }
      for (const [field, pool] of [
        ["banner", REWARDS],
        ["title", TITLES],
      ] as const) {
        if (b[field] !== undefined) {
          const option = pool.find((r) => r.id === b[field]);
          if (!option || option.level > p.level)
            throw new ReportError(
              400,
              "Reach the required level to unlock this reward.",
            );
          patch[field] = option.id;
        }
      }
      return d.saveProfile(id, year, patch);
    },
  };
}
