import { execSync } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

let commit = "dev";
try {
  commit = execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf8" }).trim();
} catch {
  commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "build-" + Date.now().toString(36);
}

const buildTime = new Date().toISOString();
const timestamp = Date.now();

const versionData = {
  version: "0.0.1",
  commit,
  buildTime,
  timestamp,
};

const jsonContent = JSON.stringify(versionData, null, 2) + "\n";

// 1. Write to public/ for HTTP polling by client (/version.json)
await mkdir(path.join(root, "public"), { recursive: true });
await writeFile(path.join(root, "public/version.json"), jsonContent);

// 2. Write to src/app/generated/ for build-time bundling in TypeScript
await mkdir(path.join(root, "src/app/generated"), { recursive: true });
await writeFile(path.join(root, "src/app/generated/version.json"), jsonContent);

console.log(`[generate-version] Generated version ${commit} at ${buildTime}`);
