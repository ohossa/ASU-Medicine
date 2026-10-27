import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import TermsPage from "./TermsPage";
import PrivacyPage from "./PrivacyPage";
import MedicalDisclaimerPage from "./MedicalDisclaimerPage";
import { LanguageContext } from "../../app/context/LanguageContextValue";

afterEach(cleanup);

describe("Legal and compliance pages", () => {
  it("renders Terms of Service with educational scope", () => {
    render(<TermsPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Terms of Service/i })).toBeInTheDocument();
    expect(screen.getByText(/Educational Mission/i)).toBeInTheDocument();
    expect(screen.getByText(/Free Access Guarantee/i)).toBeInTheDocument();
  });

  it("renders in Arabic when language context is set to ar", () => {
    render(
      <LanguageContext.Provider value={{ language: "ar", toggleLanguage: () => {}, t: (k) => k }}>
        <TermsPage />
      </LanguageContext.Provider>
    );
    expect(screen.getByRole("heading", { level: 1, name: /شروط الاستخدام/i })).toBeInTheDocument();
    expect(screen.getByText(/الرسالة التعليمية والنطاق/i)).toBeInTheDocument();
  });

  it("renders Privacy Policy with zero-tracking disclosure", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/No Commercial Tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/Local-First Client Storage/i)).toBeInTheDocument();
  });

  it("renders Medical Disclaimer with non-clinical study notice", () => {
    render(<MedicalDisclaimerPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Medical Educational Disclaimer/i })).toBeInTheDocument();
    expect(screen.getByText(/Not Medical Advice for Real Patients/i)).toBeInTheDocument();
    expect(screen.getByText(/Strictly an Educational Study Aid/i)).toBeInTheDocument();
  });
});
