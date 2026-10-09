import { lazy, Suspense } from "react";
import { MotionConfig } from "motion/react";
import LoadingScreen from "./app/components/LoadingScreen";
import { ThemeProvider } from "./app/context/ThemeContext";
const SupportPage = lazy(() => import("./pages/support/SupportPage"));
const StudyEntry = lazy(() => import("./StudyEntry"));
export function isSupportPath(path: string) {
  return path.replace(/\/+$/, "") === "/support";
}
export function PortalEntry({
  pathname = window.location.pathname,
}: {
  pathname?: string;
}) {
  return (
    <MotionConfig reducedMotion="user"><Suspense
      fallback={<LoadingScreen/>}
    >
      {isSupportPath(pathname) ? (
        <ThemeProvider>
          <SupportPage />
        </ThemeProvider>
      ) : (
        <StudyEntry />
      )}
    </Suspense></MotionConfig>
  );
}
