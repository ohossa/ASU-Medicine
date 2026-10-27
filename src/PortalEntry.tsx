import { lazy, Suspense } from "react";
import { MotionConfig } from "motion/react";
import LoadingScreen from "./app/components/LoadingScreen";
import { ThemeProvider } from "./app/context/ThemeContext";
import { LanguageProvider } from "./app/context/LanguageContext";
const SupportPage = lazy(() => import("./pages/support/SupportPage"));
const TermsPage = lazy(() => import("./pages/legal/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage"));
const MedicalDisclaimerPage = lazy(() => import("./pages/legal/MedicalDisclaimerPage"));
const StudyEntry = lazy(() => import("./StudyEntry"));

export function isSupportPath(path: string) {
  return path.replace(/\/+$/, "") === "/support";
}
export function isTermsPath(path: string) {
  return path.replace(/\/+$/, "") === "/terms";
}
export function isPrivacyPath(path: string) {
  return path.replace(/\/+$/, "") === "/privacy";
}
export function isDisclaimerPath(path: string) {
  return path.replace(/\/+$/, "") === "/disclaimer";
}

export function PortalEntry({
  pathname = window.location.pathname,
}: {
  pathname?: string;
}) {
  const normalizedPath = pathname.replace(/\/+$/, "");

  let content = <StudyEntry />;

  if (isSupportPath(normalizedPath)) {
    content = <SupportPage />;
  } else if (isTermsPath(normalizedPath)) {
    content = <TermsPage />;
  } else if (isPrivacyPath(normalizedPath)) {
    content = <PrivacyPage />;
  } else if (isDisclaimerPath(normalizedPath)) {
    content = <MedicalDisclaimerPage />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<LoadingScreen />}>
        <LanguageProvider>
          <ThemeProvider>{content}</ThemeProvider>
        </LanguageProvider>
      </Suspense>
    </MotionConfig>
  );
}

