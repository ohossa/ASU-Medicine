import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./app/context/ThemeContext";
import { LanguageProvider } from "./app/context/LanguageContext";
import { SiteUpdateNotice } from "./app/components/SiteUpdateNotice";
import App from "./app/App";
export default function StudyEntry() {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={key || "pk_test_placeholder"}>
      <ThemeProvider>
        <LanguageProvider>
          <App />
          <SiteUpdateNotice />
        </LanguageProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
