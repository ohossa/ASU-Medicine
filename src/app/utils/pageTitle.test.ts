import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { formatPageTitle, updateDocumentTitle, updatePageHead, DEFAULT_FULL_TITLE } from "./pageTitle";

describe("pageTitle utility", () => {
  const originalTitle = document.title;

  beforeEach(() => {
    document.title = originalTitle;
    document.head.innerHTML = "";
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  it("formats home or empty input with the clean default title", () => {
    expect(formatPageTitle()).toBe(DEFAULT_FULL_TITLE);
    expect(formatPageTitle("")).toBe(DEFAULT_FULL_TITLE);
    expect(formatPageTitle("   ")).toBe(DEFAULT_FULL_TITLE);
    expect(formatPageTitle("Home")).toBe(DEFAULT_FULL_TITLE);
    expect(formatPageTitle("home")).toBe(DEFAULT_FULL_TITLE);
  });

  it("formats page names into compact [Page] · A-Plus structure", () => {
    expect(formatPageTitle("Support")).toBe("Support · A-Plus");
    expect(formatPageTitle("MRS-2")).toBe("MRS-2 · A-Plus");
    expect(formatPageTitle("Reports Inbox")).toBe("Reports Inbox · A-Plus");
    expect(formatPageTitle("Question Studio")).toBe("Question Studio · A-Plus");
    expect(formatPageTitle("Anki Decks")).toBe("Anki Decks · A-Plus");
    expect(formatPageTitle("  Terms of Service  ")).toBe("Terms of Service · A-Plus");
  });

  it("updates document.title directly", () => {
    updateDocumentTitle("Support");
    expect(document.title).toBe("Support · A-Plus");

    updateDocumentTitle("");
    expect(document.title).toBe(DEFAULT_FULL_TITLE);
  });

  it("updates canonical link and social tags via updatePageHead", () => {
    updatePageHead({
      pageName: "Anki Decks",
      pathname: "/anki/",
      description: "Medical Anki flashcards for Ain Shams students",
    });

    expect(document.title).toBe("Anki Decks · A-Plus");

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute("href")).toBe("https://asu.codes/anki");

    const ogUrl = document.querySelector('meta[property="og:url"]');
    expect(ogUrl?.getAttribute("content")).toBe("https://asu.codes/anki");

    const desc = document.querySelector('meta[name="description"]');
    expect(desc?.getAttribute("content")).toBe("Medical Anki flashcards for Ain Shams students");
  });
});
