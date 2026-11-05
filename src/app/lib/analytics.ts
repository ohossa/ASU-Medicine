/**
 * Google Analytics 4 (GA4) & Search Console Integration Suite
 * Provides SPA route tracking, Core Web Vitals telemetry, and rich medical study event tracking.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

let isInitialized = false;

/**
 * Reads configured Google Analytics measurement ID from environment.
 * Typical format: G-XXXXXXXXXX
 */
export function getMeasurementId(): string {
  return (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
}

/**
 * Reads configured Google Search Console verification token from environment.
 */
export function getGoogleSiteVerification(): string {
  return (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || "").trim();
}

/**
 * Initializes GA4 and Google Site Verification if configured.
 * Runs asynchronously and never blocks page render.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined" || isInitialized) return;

  const measurementId = getMeasurementId();
  const verificationToken = getGoogleSiteVerification();

  // 1. Inject Google Search Console Verification Meta Tag if provided
  if (verificationToken) {
    let metaTag = document.querySelector('meta[name="google-site-verification"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "google-site-verification");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", verificationToken);
  }

  // 2. Initialize Google Analytics 4 (gtag.js)
  if (measurementId) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };

      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: false, // Pageviews are tracked dynamically via SPA router
        anonymize_ip: true,
        cookie_flags: "SameSite=None;Secure",
      });

      // Inject script tag asynchronously
      const scriptId = "google-analytics-gtag";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        document.head.appendChild(script);
      }

      isInitialized = true;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[Analytics] Initialization failed:", err);
      }
    }
  }
}

/**
 * Tracks SPA pageviews dynamically across route transitions.
 */
export function trackPageView(path?: string, title?: string): void {
  if (typeof window === "undefined") return;

  const pagePath = path || window.location.pathname + window.location.search;
  const pageTitle = title || document.title;
  const pageLocation = window.location.href;

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: pageLocation,
    });
  }

  if (import.meta.env.DEV) {
    console.debug(`[Analytics] page_view: ${pagePath} ("${pageTitle}")`);
  }
}

/**
 * Tracks a custom event in Google Analytics.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  if (import.meta.env.DEV) {
    console.debug(`[Analytics] event: ${eventName}`, params);
  }
}

// ==========================================
// Specialized Medical Portal Telemetry Events
// ==========================================

export function trackQuizStart(moduleCode: string, mode: string, questionCount: number): void {
  trackEvent("quiz_start", {
    module_code: moduleCode,
    quiz_mode: mode,
    question_count: questionCount,
  });
}

export function trackQuestionAnswer(
  moduleCode: string,
  questionId: string,
  isCorrect: boolean,
  timeSpentMs?: number,
): void {
  trackEvent("question_answered", {
    module_code: moduleCode,
    question_id: questionId,
    is_correct: isCorrect,
    time_spent_ms: timeSpentMs,
  });
}

export function trackQuizComplete(
  moduleCode: string,
  score: number,
  totalQuestions: number,
  accuracy: number,
  durationSeconds?: number,
): void {
  trackEvent("quiz_completed", {
    module_code: moduleCode,
    score,
    total_questions: totalQuestions,
    accuracy_percentage: Math.round(accuracy),
    duration_seconds: durationSeconds,
  });
}

export function trackSearch(query: string, resultCount: number): void {
  trackEvent("search", {
    search_term: query,
    result_count: resultCount,
  });
}

export function trackAnkiDownload(deckName: string, year: string): void {
  trackEvent("file_download", {
    file_name: deckName,
    file_type: "anki_deck",
    academic_year: year,
  });
}

export function trackReportSubmit(questionId: string, issueType: string): void {
  trackEvent("question_report_submitted", {
    question_id: questionId,
    issue_type: issueType,
  });
}

export function trackWebVitalsTelemetry(metric: { name: string; value: number; rating: string }): void {
  trackEvent("web_vitals", {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
  });
}
