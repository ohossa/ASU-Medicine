import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../../..");

describe("SEO & AI Search Assets Verification", () => {
  describe("public/robots.txt", () => {
    it("exists and explicitly allows major AI crawler bots", () => {
      const robotsPath = path.join(root, "public/robots.txt");
      expect(fs.existsSync(robotsPath)).toBe(true);
      const content = fs.readFileSync(robotsPath, "utf-8");

      // Verify AI crawlers are explicitly allowed
      expect(content).toContain("User-agent: GPTBot");
      expect(content).toContain("User-agent: ClaudeBot");
      expect(content).toContain("User-agent: PerplexityBot");
      expect(content).toContain("User-agent: Google-Extended");
      expect(content).toContain("User-agent: Applebot-Extended");

      // Verify standard directives and exclusion of non-standard directives flagged by Lighthouse
      expect(content).toContain("Sitemap: https://asu.codes/sitemap.xml");
      expect(content).toContain("Allow: /llms.txt");
      expect(content).not.toContain("LLMs-Txt:");
    });
  });

  describe("public/llms.txt & llms-full.txt", () => {
    it("llms.txt starts with H1 and conforms to standard", () => {
      const llmsPath = path.join(root, "public/llms.txt");
      expect(fs.existsSync(llmsPath)).toBe(true);
      const content = fs.readFileSync(llmsPath, "utf-8");

      // First line must be H1
      const lines = content.split("\n");
      expect(lines[0]).toBe("# A-Plus (asu.codes)");

      // Followed by blockquote description
      expect(content).toContain("> An independent, peer-maintained clinical study engine");

      // Contains module links
      expect(content).toContain("https://asu.codes/year-2/mcvs-2/mixed");
      expect(content).toContain("https://asu.codes/year-2/mcns-2/mixed");
      expect(content).toContain("https://asu.codes/anki");
    });

    it("llms-full.txt maps all 42 modules", () => {
      const fullPath = path.join(root, "public/llms-full.txt");
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, "utf-8");

      expect(content).toContain("Total Questions: 29,864 across 42 active modules.");
      expect(content).toContain("MCVS-2");
      expect(content).toContain("MCNS-2");
      expect(content).toContain("MGL-3");
      expect(content).toContain("MSS-2");
    });
  });

  describe("public/ai JSON feeds", () => {
    it("ARD manifest (.well-known/ard.json) conforms to Agentic Resource Discovery spec", () => {
      const ardPath = path.join(root, "public/.well-known/ard.json");
      expect(fs.existsSync(ardPath)).toBe(true);
      const content = fs.readFileSync(ardPath, "utf-8");
      const ard = JSON.parse(content);

      expect(ard.specVersion).toBe("0.91");
      expect(ard.host.displayName).toContain("A-Plus");
      expect(Array.isArray(ard.entries)).toBe(true);
      expect(ard.entries.length).toBeGreaterThanOrEqual(2);

      for (const entry of ard.entries) {
        expect(entry.identifier).toMatch(/^urn:air:asu\.codes:/);
        expect(entry.displayName).toBeTruthy();
        expect(entry.url).toMatch(/^https:\/\/asu\.codes\//);
      }
    });

    it("summary.json is valid and contains curriculum metadata", () => {
      const summaryPath = path.join(root, "public/ai/summary.json");
      expect(fs.existsSync(summaryPath)).toBe(true);
      const summary = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));

      expect(summary.name).toBe("A-Plus · Medical Portal");
      expect(summary.domain).toBe("asu.codes");
      expect(summary.metrics.modulesCount).toBe(42);
      expect(summary.metrics.questionsCount).toBe(29864);
      expect(summary.curriculumAlignment.primaryInstitutionCurriculum).toContain("Ain Shams University");
    });

    it("faq.json has structured Q&A in English and Arabic", () => {
      const faqPath = path.join(root, "public/ai/faq.json");
      expect(fs.existsSync(faqPath)).toBe(true);
      const data = JSON.parse(fs.readFileSync(faqPath, "utf-8"));

      expect(Array.isArray(data.faqs)).toBe(true);
      expect(data.faqs.length).toBeGreaterThanOrEqual(6);

      const hasEnglish = data.faqs.some((f: { question: string }) => f.question.includes("What is A-Plus"));
      const hasArabic = data.faqs.some((f: { question: string }) => f.question.includes("طب عين شمس"));
      expect(hasEnglish).toBe(true);
      expect(hasArabic).toBe(true);
    });
  });

  describe("index.html crawlability and schema", () => {
    it("has semantic crawl shell inside root with H1 and module links", () => {
      const indexPath = path.join(root, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");

      // H1 in raw HTML
      expect(html).toContain("<h1 itemprop=\"headline\">A-Plus (A⁺) — Independent Medical Study Companion &amp; Question Bank</h1>");
      
      // Modules and tool links in raw HTML
      expect(html).toContain('href="/year-2/mcvs-2/mixed"');
      expect(html).toContain('href="/year-2/mcns-2/mixed"');
      expect(html).toContain('href="/anki"');
      expect(html).toContain('href="/marks-calculator"');

      // FAQ section in raw HTML
      expect(html).toContain("Frequently Asked Questions (FAQ)");
      expect(html).toContain("طب عين شمس");
    });

    it("has valid JSON-LD graph with WebSite, EducationalOrganization, FAQPage, MedicalWebPage", () => {
      const indexPath = path.join(root, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");

      const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      expect(match).not.toBeNull();
      const schema = JSON.parse(match![1]);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(Array.isArray(schema["@graph"])).toBe(true);

      const types = schema["@graph"].map((node: { "@type": string }) => node["@type"]);
      expect(types).toContain("WebSite");
      expect(types).toContain("EducationalOrganization");
      expect(types).toContain("MedicalWebPage");
      expect(types).toContain("FAQPage");

      const faq = schema["@graph"].find((node: { "@type": string }) => node["@type"] === "FAQPage");
      expect(faq.mainEntity.length).toBeGreaterThanOrEqual(6);
    });

    it("has required meta tags and university separation compliance", () => {
      const indexPath = path.join(root, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");

      // Canonical and social tags
      expect(html).toContain('<link rel="canonical" href="https://asu.codes/" />');
      expect(html).toContain('content="https://asu.codes/social-preview.png"');

      // Author and keywords
      expect(html).toContain('name="author" content="Omar Hossam"');
      expect(html).toContain('Ain Shams medical question bank');
    });
  });
});
