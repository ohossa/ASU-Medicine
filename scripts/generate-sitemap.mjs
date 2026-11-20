import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "src/app/generated/bankManifest.json");
const sitemapPath = path.join(root, "public/sitemap.xml");

const today = new Date().toISOString().split("T")[0];

async function generate() {
  const bytes = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(bytes);

  const urls = [
    { loc: "https://asu.codes/", priority: "1.0", changefreq: "daily" },
    { loc: "https://asu.codes/anki", priority: "0.9", changefreq: "weekly" },
    { loc: "https://asu.codes/marks-calculator", priority: "0.8", changefreq: "monthly" },
    { loc: "https://asu.codes/learning", priority: "0.85", changefreq: "weekly" },
    { loc: "https://asu.codes/support", priority: "0.6", changefreq: "monthly" },
    { loc: "https://asu.codes/terms", priority: "0.4", changefreq: "yearly" },
    { loc: "https://asu.codes/privacy", priority: "0.4", changefreq: "yearly" },
    { loc: "https://asu.codes/disclaimer", priority: "0.4", changefreq: "yearly" },
  ];

  // Year level landing hubs
  for (let y = 1; y <= 5; y++) {
    urls.push({
      loc: `https://asu.codes/year-${y}`,
      priority: "0.85",
      changefreq: "weekly",
    });
  }

  // Add individual module URLs across Years 1 to 5
  // Sorted predictably by year and module code
  const entries = Object.entries(manifest).sort(([aCode, aInfo], [bCode, bInfo]) => {
    if (aInfo.year !== bInfo.year) return aInfo.year - bInfo.year;
    return aCode.localeCompare(bCode);
  });

  for (const [code, info] of entries) {
    const yr = info.year;
    const lowerCode = code.toLowerCase();

    // 1. Module mode & syllabus overview landing page
    urls.push({
      loc: `https://asu.codes/year-${yr}/${lowerCode}`,
      priority: "0.9",
      changefreq: "weekly",
    });

    // 2. Direct mixed practice mode (preserves existing indexed URLs in GSC)
    urls.push({
      loc: `https://asu.codes/year-${yr}/${lowerCode}/mixed`,
      priority: "0.85",
      changefreq: "weekly",
    });
  }

  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    ),
    "</urlset>",
    "",
  ];

  await writeFile(sitemapPath, xmlLines.join("\n"));
  console.log(`[generate-sitemap] Generated public/sitemap.xml with ${urls.length} verified URLs.`);
}

generate().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
