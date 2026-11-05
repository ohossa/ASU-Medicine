import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackQuizStart,
  trackQuestionAnswer,
  trackQuizComplete,
  trackSearch,
  trackAnkiDownload,
  trackReportSubmit,
  trackWebVitalsTelemetry,
  getMeasurementId,
  getGoogleSiteVerification,
} from "../../app/lib/analytics";

describe("Google Analytics 4 & Search Console Suite", () => {
  beforeEach(() => {
    // Reset DOM and mocks
    document.head.innerHTML = "";
    delete (window as any).dataLayer;
    delete (window as any).gtag;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("safely handles uninitialized analytics without throwing", () => {
    expect(typeof getMeasurementId()).toBe("string");
    expect(typeof getGoogleSiteVerification()).toBe("string");
    expect(() => initAnalytics()).not.toThrow();
    expect(() => trackPageView("/year-1/iae-1/mixed", "IAE-1 Quiz")).not.toThrow();
    expect(() => trackEvent("quiz_start", { module: "IAE-1" })).not.toThrow();
    expect(() => trackQuizStart("IAE-1", "mixed", 40)).not.toThrow();
    expect(() => trackQuestionAnswer("IAE-1", "q123", true, 2400)).not.toThrow();
    expect(() => trackQuizComplete("IAE-1", 38, 40, 95, 120)).not.toThrow();
    expect(() => trackSearch("action potential", 12)).not.toThrow();
    expect(() => trackAnkiDownload("Anatomy-Thorax.apkg", "1")).not.toThrow();
    expect(() => trackReportSubmit("q123", "scientific_error")).not.toThrow();
    expect(() => trackWebVitalsTelemetry({ name: "LCP", value: 1200, rating: "good" })).not.toThrow();
  });

  it("fires gtag event for trackPageView when gtag is available", () => {
    const mockGtag = vi.fn();
    window.gtag = mockGtag;

    trackPageView("/learning", "Learning Hub");

    expect(mockGtag).toHaveBeenCalledWith("event", "page_view", {
      page_path: "/learning",
      page_title: "Learning Hub",
      page_location: window.location.href,
    });
  });

  it("fires custom medical quiz telemetry events with exact parameters", () => {
    const mockGtag = vi.fn();
    window.gtag = mockGtag;

    trackQuizStart("IBM-1", "mixed", 20);
    expect(mockGtag).toHaveBeenCalledWith("event", "quiz_start", {
      module_code: "IBM-1",
      quiz_mode: "mixed",
      question_count: 20,
    });

    trackQuestionAnswer("IBM-1", "ibm-q1", false, 4500);
    expect(mockGtag).toHaveBeenCalledWith("event", "question_answered", {
      module_code: "IBM-1",
      question_id: "ibm-q1",
      is_correct: false,
      time_spent_ms: 4500,
    });

    trackQuizComplete("IBM-1", 18, 20, 90, 300);
    expect(mockGtag).toHaveBeenCalledWith("event", "quiz_completed", {
      module_code: "IBM-1",
      score: 18,
      total_questions: 20,
      accuracy_percentage: 90,
      duration_seconds: 300,
    });
  });

  it("tracks Core Web Vitals telemetry for GA4 reporting", () => {
    const mockGtag = vi.fn();
    window.gtag = mockGtag;

    trackWebVitalsTelemetry({ name: "INP", value: 45, rating: "good" });
    expect(mockGtag).toHaveBeenCalledWith("event", "web_vitals", {
      metric_name: "INP",
      metric_value: 45,
      metric_rating: "good",
    });
  });

  it("tracks search and file download queries", () => {
    const mockGtag = vi.fn();
    window.gtag = mockGtag;

    trackSearch("mitral stenosis", 5);
    expect(mockGtag).toHaveBeenCalledWith("event", "search", {
      search_term: "mitral stenosis",
      result_count: 5,
    });

    trackAnkiDownload("Cardiovascular-Pathology.apkg", "2");
    expect(mockGtag).toHaveBeenCalledWith("event", "file_download", {
      file_name: "Cardiovascular-Pathology.apkg",
      file_type: "anki_deck",
      academic_year: "2",
    });
  });
});
