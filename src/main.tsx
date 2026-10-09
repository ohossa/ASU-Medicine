import { PortalEntry } from "./PortalEntry";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./styles/index.css";
import { ErrorBoundary } from "./app/components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <PortalEntry />
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  </StrictMode>,
);

// Register Service Worker for offline support in production
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope,
        );
        // Proactively check for service worker updates on page load
        registration
          .update()
          .catch((err) => console.warn("Failed to check for sw update:", err));
        window.addEventListener("focus", () => {
          registration.update().catch(() => {});
        });
      })
      .catch((err) => {
        console.error("ServiceWorker registration failed: ", err);
      });
  });
}
