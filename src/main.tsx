import { PortalEntry } from "./PortalEntry";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./styles/index.css";
import { ErrorBoundary } from "./app/components/ErrorBoundary";

// 1. Dynamic chunk loading recovery: If a new deployment removes old chunk hashes,
// Vite fires 'vite:preloadError'. Soft-reload once to fetch fresh assets.
window.addEventListener("vite:preloadError", () => {
  const RECOVERY_KEY = "asu:last-preload-recovery";
  const lastRecovery = Number(sessionStorage.getItem(RECOVERY_KEY) || 0);
  const now = Date.now();
  if (now - lastRecovery > 15000) {
    sessionStorage.setItem(RECOVERY_KEY, String(now));
    if ("caches" in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          if (name.includes("asu-navigation")) {
            caches.delete(name).catch(() => {});
          }
        }
      }).catch(() => {});
    }
    window.location.reload();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <PortalEntry />
      <Analytics />
    </ErrorBoundary>
  </StrictMode>,
);

// 2. Service Worker registration & background lifecycle listeners
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope,
        );

        // Notify client if an updated worker is already waiting
        if (registration.waiting) {
          window.dispatchEvent(
            new CustomEvent("asu:sw-update-available", {
              detail: { registration },
            }),
          );
        }

        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                window.dispatchEvent(
                  new CustomEvent("asu:sw-update-available", {
                    detail: { registration },
                  }),
                );
              }
            });
          }
        });

        // Listen for explicit apply requests from UI
        window.addEventListener("asu:apply-update", () => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        });

        // Proactively check for service worker updates on page load, focus, and visibility
        registration
          .update()
          .catch((err) => console.warn("Failed to check for sw update:", err));

        window.addEventListener("focus", () => {
          registration.update().catch(() => {});
        });

        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            registration.update().catch(() => {});
          }
        });
      })
      .catch((err) => {
        console.error("ServiceWorker registration failed: ", err);
      });
  });
}
