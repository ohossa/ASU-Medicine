import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const distDir = path.join(root, "dist");
const manifestPath = path.join(root, "src/app/generated/bankManifest.json");
const dataPath = path.join(root, "src/app/data.ts");

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function extractModuleNames() {
  const dataTs = await readFile(dataPath, "utf8");
  const regex = /code:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g;
  const map = {};
  let m;
  while ((m = regex.exec(dataTs)) !== null) {
    map[m[1].toUpperCase()] = m[2];
  }
  return map;
}

async function prerender() {
  const templatePath = path.join(distDir, "index.html");
  let template;
  try {
    template = await readFile(templatePath, "utf8");
  } catch (err) {
    console.error("[prerender-seo] dist/index.html not found. Run vite build first!");
    process.exit(1);
  }

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const moduleNames = await extractModuleNames();

  const routes = [
    {
      path: "/",
      canonical: "https://asu.codes/",
      title: "A-Plus (A⁺) — Independent Medical Study Companion & Question Bank · asu.codes",
      description: "Independent medical question bank and study companion for medical students in Egypt. Practice 29,864+ exam MCQs, clinical spotters, and past papers aligned with integrated medical curricula (Ain Shams University Years 1–3). 100% free.",
      shellH1: "A-Plus (A⁺) — Independent Medical Study Companion &amp; Question Bank",
      shellContent: `
        <p itemprop="description">
          The free, peer-maintained clinical study engine for medical students in Egypt. Practice 29,864+ medically audited MCQs, past papers, clinical spotters, and spaced-repetition flashcards aligned with integrated medical curricula (Ain Shams University Years 1–3).
        </p>
        <div class="stats">
          <span>📚 42 Modules</span>
          <span>📝 29,864 Questions</span>
          <span>💡 100% Free &amp; Open Access</span>
        </div>
      `,
    },
    {
      path: "/anki",
      canonical: "https://asu.codes/anki",
      title: "Medical Anki Decks & Spaced Repetition — A-Plus · asu.codes",
      description: "Download high-yield, verified medical Anki decks with lecture rationales and cloze deletions for Egyptian medical faculties (Ain Shams University Years 1–3). 100% free spaced repetition.",
      shellH1: "Medical Anki Decks &amp; Spaced Repetition",
      shellContent: `
        <p itemprop="description">
          High-yield spaced-repetition Anki decks aligned directly with integrated lecture syllabi and exam past papers. Download complete APKG packages with verified clozes, clinical figures, and detailed rationales.
        </p>
        <div class="stats">
          <span>🗂️ 42 Illustrated Module Decks</span>
          <span>⚡ Spaced Repetition Engine</span>
          <span>🆓 100% Free APKG Downloads</span>
        </div>
        <p><a href="/">← Return to Portal Home</a> · <a href="/learning">View Learning Hub</a></p>
      `,
    },
    {
      path: "/marks-calculator",
      canonical: "https://asu.codes/marks-calculator",
      title: "Egyptian Medical Faculties Marks & GPA Calculator — A-Plus · asu.codes",
      description: "Calculate marks distributions, GPA, credit points, and university exam thresholds for Egyptian medical faculties including Ain Shams University.",
      shellH1: "Medical Marks &amp; GPA Calculator",
      shellContent: `
        <p itemprop="description">
          Interactive marks and grade point average (GPA) estimation engine calibrated for credit-hour integrated medical faculties in Egypt. Calculate modular semester grades, credit weightings, and exam passing thresholds.
        </p>
        <div class="stats">
          <span>🎯 Credit Point (CP) Weighting</span>
          <span>📊 Real-time GPA Conversion</span>
          <span>🎓 Faculty Grading Guidelines</span>
        </div>
        <p><a href="/">← Return to Portal Home</a></p>
      `,
    },
    {
      path: "/learning",
      canonical: "https://asu.codes/learning",
      title: "Learning Hub, Streaks & Milestones — A-Plus · asu.codes",
      description: "Track your medical study progress, personal XP, active study streaks, and module mastery across 42 medical subjects on A-Plus.",
      shellH1: "Learning Hub &amp; Spaced Progress",
      shellContent: `
        <p itemprop="description">
          Real-time study analytics, Cairo study-day streaks, experience points (XP), and comprehensive question attempt histories across all 42 academic question banks.
        </p>
        <div class="stats">
          <span>🔥 Daily Study Streaks</span>
          <span>🏆 Level &amp; XP Progression</span>
          <span>📈 Module Mastery Tracking</span>
        </div>
        <p><a href="/">← Return to Portal Home</a></p>
      `,
    },
    {
      path: "/support",
      canonical: "https://asu.codes/support",
      title: "Student Support & Question Reports — A-Plus · asu.codes",
      description: "Community verification ledger, question correction triage reports, and medical curriculum audit contact for A-Plus.",
      shellH1: "Student Support &amp; Question Verification",
      shellContent: `
        <p itemprop="description">
          Transparent question review and medical verification registry. Submit inquiries, report ambiguous past exam questions, and view live triage updates.
        </p>
        <p><a href="/">← Return to Portal Home</a></p>
      `,
    },
    {
      path: "/terms",
      canonical: "https://asu.codes/terms",
      title: "Terms of Service — A-Plus · asu.codes",
      description: "Terms of service and acceptable educational use policy for A-Plus independent medical study companion.",
      shellH1: "Terms of Service",
      shellContent: `
        <p itemprop="description">
          Open and fair access terms for medical students practicing questions on A-Plus.
        </p>
        <p><a href="/">← Return to Portal Home</a></p>
      `,
    },
    {
      path: "/privacy",
      canonical: "https://asu.codes/privacy",
      title: "Privacy Policy — A-Plus · asu.codes",
      description: "Privacy policy, data preservation standards, and student privacy commitment for A-Plus.",
      shellH1: "Privacy Policy",
      shellContent: `
        <p itemprop="description">
          Zero-tracking student privacy commitment. Your study metrics and quiz drafts are secured with persistent encryption.
        </p>
        <p><a href="/">← Return to Portal Home</a></p>
      `,
    },
    {
      path: "/disclaimer",
      canonical: "https://asu.codes/disclaimer",
      title: "Medical Disclaimer — A-Plus · asu.codes",
      description: "Important medical and educational disclaimer for A-Plus study companion. Designed strictly for student exam preparation.",
      shellH1: "Medical &amp; Educational Disclaimer",
      shellContent: `
        <p itemprop="description">
          A-Plus is an independent educational tool designed solely for medical students preparing for academic examinations. It does not provide medical advice, diagnosis, or patient care recommendations.
        </p>
        <p><a href="/">← Return to Portal Home</a></p>
      `,
    },
  ];

  // Year level landing hubs
  for (let yr = 1; yr <= 5; yr++) {
    const yrModules = Object.entries(manifest).filter(([_, info]) => info.year === yr);
    routes.push({
      path: `/year-${yr}`,
      canonical: `https://asu.codes/year-${yr}`,
      title: `Year ${yr} Medical Modules & Question Banks — A-Plus · asu.codes`,
      description: `Practice verified exam MCQs, clinical spotters, and past papers for all Year ${yr} integrated modules in the Egyptian medical curriculum.`,
      shellH1: `Year ${yr} Medical Modules &amp; Question Banks`,
      shellContent: `
        <p itemprop="description">
          Comprehensive curriculum question banks for Year ${yr} medical students. Practice chapter drills, timed simulations, and past faculty assessments.
        </p>
        <div class="stats">
          <span>📚 ${yrModules.length} Modules in Year ${yr}</span>
          <span>⚡ Instant Correction &amp; Explanations</span>
        </div>
        <ul>
          ${yrModules.map(([c]) => `<li><a href="/year-${yr}/${c.toLowerCase()}"><strong>${c}</strong> · ${escapeHtml(moduleNames[c] || c)}</a></li>`).join("\n")}
        </ul>
        <p><a href="/">← Return to Portal Home</a></p>
      `,
    });
  }

  // Module landing & practice routes
  for (const [code, info] of Object.entries(manifest)) {
    const yr = info.year;
    const lowerCode = code.toLowerCase();
    const name = moduleNames[code] || code;

    // 1. Module mode & study overview landing page
    routes.push({
      path: `/year-${yr}/${lowerCode}`,
      canonical: `https://asu.codes/year-${yr}/${lowerCode}`,
      title: `${code} ${name} — Question Bank & Study Hub · asu.codes`,
      description: `Practice verified past exam questions, chapter drills, and clinical spotters for ${code} (${name}) aligned with Year ${yr} medical curriculum.`,
      shellH1: `${code} — ${escapeHtml(name)}`,
      shellContent: `
        <nav aria-label="Breadcrumb">
          <small><a href="/">Home</a> &gt; <a href="/year-${yr}">Year ${yr}</a> &gt; ${code}</small>
        </nav>
        <p itemprop="description">
          Verified academic question bank for ${code} (${escapeHtml(name)}). Practice modular MCQs, review high-yield lecture topics, and test your clinical recall with full rationales.
        </p>
        <div class="stats">
          <span>📚 Academic Year ${yr}</span>
          <span>📝 Practice &amp; Exam Modes</span>
          <span>⚡ Instant Feedback</span>
        </div>
        <ul>
          <li><a href="/year-${yr}/${lowerCode}/mixed"><strong>Launch Practice Session</strong> — Timed MCQs and chapter drills</a></li>
          <li><a href="/anki"><strong>Download Anki Deck</strong> — Spaced repetition flashcards for ${code}</a></li>
          <li><a href="/year-${yr}"><strong>View All Year ${yr} Modules</strong></a></li>
        </ul>
      `,
    });

    // 2. Direct mixed practice mode (preserves existing indexed URLs in GSC)
    routes.push({
      path: `/year-${yr}/${lowerCode}/mixed`,
      canonical: `https://asu.codes/year-${yr}/${lowerCode}/mixed`,
      title: `${code} Practice MCQs & Past Exams — A-Plus · asu.codes`,
      description: `Interactive practice quiz and exam simulation for ${code} (${name}). Detailed medical rationales and instant scoring.`,
      shellH1: `${code} Practice &amp; Quiz Mode`,
      shellContent: `
        <nav aria-label="Breadcrumb">
          <small><a href="/">Home</a> &gt; <a href="/year-${yr}">Year ${yr}</a> &gt; <a href="/year-${yr}/${lowerCode}">${code}</a> &gt; Mixed Practice</small>
        </nav>
        <p itemprop="description">
          Practice interactive multiple-choice questions for ${code} (${escapeHtml(name)}). Includes explanations, lecture topic filters, and self-assessment scoring.
        </p>
        <p><a href="/year-${yr}/${lowerCode}">← View ${code} Module Overview</a> · <a href="/">Return to Portal Home</a></p>
      `,
    });
  }

  console.log(`[prerender-seo] Pre-rendering ${routes.length} static SEO HTML shells...`);

  for (const r of routes) {
    let html = template;

    // 1. Replace Canonical Tag
    html = html.replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${r.canonical}" />`
    );

    // 2. Replace Title Tag
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(r.title)}</title>`
    );

    // 3. Replace Meta Description
    html = html.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(r.description)}" />`
    );

    // 4. Replace OpenGraph & Twitter Tags
    html = html.replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${r.canonical}" />`
    );
    html = html.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeHtml(r.title)}" />`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtml(r.description)}" />`
    );
    html = html.replace(
      /<meta name="twitter:url" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:url" content="${r.canonical}" />`
    );
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeHtml(r.title)}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeHtml(r.description)}" />`
    );

    // 5. Replace Crawl Shell inside <div id="root">
    const newShell = `
      <article class="crawl-shell" itemscope itemtype="https://schema.org/MedicalWebPage">
        <header>
          <h1 itemprop="headline">${r.shellH1}</h1>
          ${r.shellContent}
        </header>
        <footer>
          <p><small>&copy; 2026 A-Plus (asu.codes) · Independent Student Initiative built by Omar Hossam · Free to use, always.</small></p>
          <nav>
            <a href="/">Home</a> ·
            <a href="/anki">Anki</a> ·
            <a href="/learning">Learning Hub</a> ·
            <a href="/terms">Terms</a> ·
            <a href="/privacy">Privacy</a> ·
            <a href="/support">Support</a>
          </nav>
        </footer>
      </article>
    `.trim();

    html = html.replace(
      /<article class="crawl-shell"[\s\S]*?<\/article>/,
      newShell
    );

    if (r.path === "/") {
      await writeFile(path.join(distDir, "index.html"), html, "utf8");
    } else {
      const cleanPath = r.path.replace(/^\/+/, "");
      const dirPath = path.join(distDir, cleanPath);
      await mkdir(dirPath, { recursive: true });
      // Write both dir/index.html and dir.html for maximum compatibility
      await writeFile(path.join(dirPath, "index.html"), html, "utf8");
      await writeFile(path.join(distDir, `${cleanPath}.html`), html, "utf8");
    }
  }

  console.log(`[prerender-seo] Successfully generated ${routes.length} static SEO HTML shells in dist/!`);
}

prerender().catch((err) => {
  console.error("[prerender-seo] Error during prerendering:", err);
  process.exit(1);
});
