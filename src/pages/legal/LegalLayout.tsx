import type { ReactNode } from "react";
import { ArrowLeft, Shield, FileText, AlertTriangle } from "lucide-react";
import { ThemeToggle } from "../../app/components/ThemeToggle";
import { LanguageToggle } from "../../app/components/LanguageToggle";
import { PortalFooter } from "../../app/components/PortalFooter";
import "./legal.css";

interface LegalLayoutProps {
  currentTab: "terms" | "privacy" | "disclaimer";
  children: ReactNode;
  arabic?: boolean;
}

export default function LegalLayout({ currentTab, children, arabic = false }: LegalLayoutProps) {
  const t = (en: string, ar: string) => (arabic ? ar : en);

  return (
    <div className="legal-container" dir={arabic ? "rtl" : "ltr"}>
      <div className="legal-content-wrapper">
        <header className="legal-header">
          <button
            type="button"
            className="legal-back-button"
            onClick={() => window.location.assign("/")}
            aria-label={t("Back to Study Portal", "العودة إلى منصة الدراسة")}
          >
            <ArrowLeft size={18} className={arabic ? "rotate-180" : ""} />
            <span>{t("Back to Portal", "العودة للمنصة")}</span>
          </button>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        <nav className="legal-nav-tabs" aria-label={t("Legal documents navigation", "التنقل في المستندات القانونية")}>
          <a
            href="/terms"
            className={`legal-tab ${currentTab === "terms" ? "active" : ""}`}
            aria-current={currentTab === "terms" ? "page" : undefined}
          >
            <FileText size={16} />
            <span>{t("Terms of Service", "شروط الاستخدام")}</span>
          </a>
          <a
            href="/privacy"
            className={`legal-tab ${currentTab === "privacy" ? "active" : ""}`}
            aria-current={currentTab === "privacy" ? "page" : undefined}
          >
            <Shield size={16} />
            <span>{t("Privacy Policy", "سياسة الخصوصية")}</span>
          </a>
          <a
            href="/disclaimer"
            className={`legal-tab ${currentTab === "disclaimer" ? "active" : ""}`}
            aria-current={currentTab === "disclaimer" ? "page" : undefined}
          >
            <AlertTriangle size={16} />
            <span>{t("Medical Disclaimer", "إخلاء المسؤولية الطبية")}</span>
          </a>
        </nav>

        <main className="legal-card">{children}</main>
        <div style={{ marginTop: "3rem" }}>
          <PortalFooter />
        </div>
      </div>
    </div>
  );
}
