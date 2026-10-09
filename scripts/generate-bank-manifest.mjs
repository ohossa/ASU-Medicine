import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const root = path.resolve(import.meta.dirname, ".."),
  imports = path.join(root, "src/imports");
const manifest = {};
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name);
    if (e.isDirectory()) await walk(file);
    else if (e.name.endsWith(".json")) {
      const bytes = await readFile(file);
      const raw = JSON.parse(bytes);
      const code = raw.meta?.moduleCode ?? e.name.replace(/\.json$/, "");
      const match = file.match(/year-(\d+)\/semester-(\d+)\//);
      if (!match) throw new Error("Bank path missing year/semester: " + file);
      let mcqCount = 0,
        essayCount = 0;
      for (const c of raw.chapters ?? [])
        for (const s of c.subjects ?? c.topics ?? [])
          for (const q of s.questions ?? []) {
            if (
              ["essay", "case", "casestudy"].includes(q.type) ||
              (!q.options && q.modelAnswer)
            )
              essayCount++;
            else mcqCount++;
          }
      const relative =
        "../imports/" + path.relative(imports, file).split(path.sep).join("/");
      if (manifest[code]) throw new Error("Duplicate module code: " + code);
      manifest[code] = {
        year: Number(match[1]),
        semester: Number(match[2]),
        paths: [relative],
        mcqCount,
        essayCount,
        totalCount: mcqCount + essayCount,
        revision: createHash("sha256").update(bytes).digest("hex"),
        bytes: bytes.length,
      };
    }
  }
}
await walk(imports);
await mkdir(path.join(root, "src/app/generated"), { recursive: true });
await writeFile(
  path.join(root, "src/app/generated/bankManifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Catalogued ${Object.keys(manifest).length} banks without embedding questions.`,
);
