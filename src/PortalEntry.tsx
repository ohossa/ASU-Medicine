import { lazy, Suspense, useEffect } from "react";
import { MotionConfig } from "motion/react";
import LoadingScreen from "./app/components/LoadingScreen";
import { ThemeProvider } from "./app/context/ThemeContext";
import { LanguageProvider } from "./app/context/LanguageContext";
import { trackPageView } from "./app/lib/analytics";
import StudyEntry from "./StudyEntry";

const SupportPage = lazy(() => import("./pages/support/SupportPage"));
const TermsPage = lazy(() => import("./pages/legal/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage"));
const MedicalDisclaimerPage = lazy(() => import("./pages/legal/MedicalDisclaimerPage"));

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

  useEffect(() => {
    if (
      isSupportPath(normalizedPath) ||
      isTermsPath(normalizedPath) ||
      isPrivacyPath(normalizedPath) ||
      isDisclaimerPath(normalizedPath)
    ) {
      trackPageView(normalizedPath);
    }
  }, [normalizedPath]);

  let content = <StudyEntry />;

  if (isSupportPath(normalizedPath)) {
    content = (
      <Suspense fallback={<LoadingScreen compact label="Opening Support…" />}>
        <SupportPage />
      </Suspense>
    );
  } else if (isTermsPath(normalizedPath)) {
    content = (
      <Suspense fallback={<LoadingScreen compact label="Opening Terms…" />}>
        <TermsPage />
      </Suspense>
    );
  } else if (isPrivacyPath(normalizedPath)) {
    content = (
      <Suspense fallback={<LoadingScreen compact label="Opening Privacy Policy…" />}>
        <PrivacyPage />
      </Suspense>
    );
  } else if (isDisclaimerPath(normalizedPath)) {
    content = (
      <Suspense fallback={<LoadingScreen compact label="Opening Disclaimer…" />}>
        <MedicalDisclaimerPage />
      </Suspense>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <ThemeProvider>{content}</ThemeProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}

