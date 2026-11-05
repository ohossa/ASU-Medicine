/**
 * Zero-dependency Core Web Vitals and Real User Performance Monitor.
 * Accurately tracks LCP, INP/FID, CLS, FCP, and TTFB using browser PerformanceObserver.
 */

export interface Metric {
  name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

function getRating(name: Metric["name"], value: number): Metric["rating"] {
  switch (name) {
    case "LCP":
      return value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor";
    case "FID":
    case "INP":
      return value <= 200 ? "good" : value <= 500 ? "needs-improvement" : "poor";
    case "CLS":
      return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor";
    case "FCP":
      return value <= 1800 ? "good" : value <= 3000 ? "needs-improvement" : "poor";
    case "TTFB":
      return value <= 800 ? "good" : value <= 1800 ? "needs-improvement" : "poor";
  }
}

export function initWebVitals(onReport?: (metric: Metric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  const report = (name: Metric["name"], value: number) => {
    const metric: Metric = {
      name,
      value: Math.round(name === "CLS" ? value * 1000 : value) / (name === "CLS" ? 1000 : 1),
      rating: getRating(name, value),
    };

    if (import.meta.env.DEV) {
      const color =
        metric.rating === "good" ? "#10b981" : metric.rating === "needs-improvement" ? "#f59e0b" : "#ef4444";
      console.log(`%c[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`, `color: ${color}; font-weight: bold;`);
    }

    if (onReport) {
      onReport(metric);
    }
  };

  // TTFB
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav) {
      report("TTFB", nav.responseStart);
    }
  } catch { /* ignore */ }

  // FCP
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          report("FCP", entry.startTime);
          fcpObserver.disconnect();
        }
      }
    });
    fcpObserver.observe({ type: "paint", buffered: true });
  } catch { /* ignore */ }

  // LCP
  try {
    let largestEntry: PerformanceEntry | null = null;
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        largestEntry = entries[entries.length - 1];
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    const stopLCP = () => {
      if (largestEntry) {
        report("LCP", largestEntry.startTime);
      }
      lcpObserver.disconnect();
    };

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") stopLCP();
    }, { once: true });
    window.addEventListener("pagehide", stopLCP, { once: true });
  } catch { /* ignore */ }

  // CLS
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        report("CLS", clsValue);
        clsObserver.disconnect();
      }
    }, { once: true });
  } catch { /* ignore */ }

  // INP
  try {
    const inpObserver = new PerformanceObserver((list) => {
      let maxDuration = 0;
      for (const entry of list.getEntries() as any[]) {
        if (entry.duration > maxDuration) {
          maxDuration = entry.duration;
        }
      }
      if (maxDuration > 0) {
        report("INP", maxDuration);
      }
    });
    inpObserver.observe({ type: "first-input", buffered: true });
  } catch { /* ignore */ }
}
