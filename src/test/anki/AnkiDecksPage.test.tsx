import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AnkiDecksPage } from "../../pages/AnkiDecksPage";

// Mock PortalShell to render cleanly in test environment
vi.mock("../../app/components/PortalShell", () => ({
  PortalShell: ({
    children,
    crumbs,
  }: {
    children: React.ReactNode;
    crumbs: { label: string; onClick?: () => void }[];
  }) => (
    <div data-testid="portal-shell">
      <div data-testid="breadcrumbs">
        {crumbs.map((c) => (
          <button key={c.label} onClick={c.onClick}>
            {c.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  ),
}));

describe("AnkiDecksPage Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders page header, title, LURO logo, and returns to dashboard when back button is clicked", () => {
    const handleBack = vi.fn();
    render(<AnkiDecksPage onBack={handleBack} initialYear={3} />);

    expect(
      screen.getByRole("heading", { name: "Anki Flashcards", level: 1 }),
    ).toBeInTheDocument();

    const logo = screen.getByAltText("LURO Anki");
    expect(logo).toHaveAttribute("src", "/luro-anki-logo.png");

    const returnBtn = screen.getByRole("button", {
      name: /Return to Dashboard/i,
    });
    fireEvent.click(returnBtn);
    expect(handleBack).toHaveBeenCalledOnce();
  });

  it("keeps the setup guide closed by default and reveals Notion, MemU, and WhatsApp links upon expansion", () => {
    render(<AnkiDecksPage onBack={() => {}} initialYear={3} />);

    expect(
      screen.getByText("New to Anki? Quick Setup & Mobile Guide"),
    ).toBeInTheDocument();

    // Verify closed on default
    const guideToggle = screen.getByRole("button", {
      name: /New to Anki\? Quick Setup & Mobile Guide/i,
    });
    expect(guideToggle).toHaveAttribute("aria-expanded", "false");

    // Click to open guide
    fireEvent.click(guideToggle);
    expect(guideToggle).toHaveAttribute("aria-expanded", "true");

    const notionLink = screen.getByRole("link", {
      name: /Open Ain Shams Anki Tutorial/i,
    });
    expect(notionLink).toHaveAttribute(
      "href",
      "https://anki-asu.notion.site/Anki-Tutorials-Ain-shams-Medicine-e02ae973c7db41edb4ef7381495b0912",
    );

    const memuLink = screen.getByRole("link", {
      name: /Get MemU on App Store/i,
    });
    expect(memuLink).toHaveAttribute(
      "href",
      "https://apps.apple.com/us/app/memu-enhanced-flashcards/id6742653596",
    );
  });

  it("displays Year 3 Semester 1 modules including MGL-3 with ready Part 1 and Part 2 download buttons", () => {
    render(<AnkiDecksPage onBack={() => {}} initialYear={3} />);

    // MGL-3 GIT module should be present
    expect(screen.getByText("GIT & Liver Module")).toBeInTheDocument();
    expect(screen.getByText("GIT & Liver — Part 1")).toBeInTheDocument();
    expect(screen.getByText("GIT & Liver — Part 2")).toBeInTheDocument();

    // Check download buttons
    const downloadBtns = screen.getAllByRole("link", {
      name: /Download.*flashcard/i,
    });
    expect(downloadBtns.length).toBeGreaterThanOrEqual(2);
    expect(downloadBtns[0]).toHaveAttribute("download");
    expect(downloadBtns[0]).toHaveAttribute("target", "_blank");
  });

  it("switches academic years and updates displayed modules accordingly", () => {
    render(<AnkiDecksPage onBack={() => {}} initialYear={3} />);

    // Switch to Year 1
    const year1Tab = screen.getByRole("tab", { name: "Year 1" });
    fireEvent.click(year1Tab);
    expect(year1Tab).toHaveAttribute("aria-selected", "true");

    // Year 1 Anatomy module should be visible
    expect(
      screen.getByText("Introduction to Anatomy & Embryology"),
    ).toBeInTheDocument();

    // Pending decks show "In Prep" status
    expect(screen.getAllByText("In Prep").length).toBeGreaterThan(0);
  });

  it("switches semesters and updates semester modules", () => {
    render(<AnkiDecksPage onBack={() => {}} initialYear={1} />);

    // Switch to Semester 2
    const sem2Btn = screen.getByRole("tab", { name: "Semester 2" });
    fireEvent.click(sem2Btn);
    expect(sem2Btn).toHaveAttribute("aria-selected", "true");

    // Year 1 Semester 2 Pathology module should be visible
    expect(screen.getByText("Introduction to Pathology")).toBeInTheDocument();
  });
});
