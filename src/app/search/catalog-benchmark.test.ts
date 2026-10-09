import { writeFileSync } from "node:fs";
import { it, expect } from "vitest";
import {
  ensureDataLoaded,
  SYLLABUS_MODULES,
  getChaptersForModuleAndMode,
} from "../data";
import { buildSearchEntries, searchEntries } from "./engine";
it("indexes the real published catalog and records broad-query costs", async () => {
  await ensureDataLoaded();
  const start = performance.now();
  const sources = Object.entries(SYLLABUS_MODULES).flatMap(([y, sems]) =>
    Object.entries(sems).flatMap(([sem, mods]) =>
      mods.map((m) => ({
        year: Number(y),
        semester: Number(sem),
        moduleCode: m.code,
        moduleName: m.name,
        chapters: getChaptersForModuleAndMode(m.code, "mixed"),
      })),
    ),
  );
  const entries = buildSearchEntries(sources);
  const indexed = performance.now();
  const measurements = [
    "lipase",
    "stomach",
    "esophagus",
    "calcium",
    "انزيم",
    "",
  ].map((query) => {
    const before = performance.now();
    const matches = searchEntries(entries, query, {});
    return {
      query,
      matches: matches.length,
      ms: Math.round((performance.now() - before) * 10) / 10,
    };
  });
  expect(entries.length).toBeGreaterThan(10000);
  expect(
    measurements.find((m) => m.query === "lipase")!.matches,
  ).toBeGreaterThan(0);
  const report = {
    entries: entries.length,
    indexMs: Math.round(indexed - start),
    measurements,
  };
  if (process.env.ASU_BENCHMARK_OUTPUT)
    writeFileSync(
      process.env.ASU_BENCHMARK_OUTPUT,
      JSON.stringify(report, null, 2),
    );
});
