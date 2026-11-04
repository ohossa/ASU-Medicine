import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LoginScreen } from "./LoginScreen";

let capturedAppearance: any = null;

vi.mock("@clerk/clerk-react", () => ({
  SignIn: (props: any) => {
    capturedAppearance = props.appearance;
    return (
      <div data-testid="mock-clerk-signin" className={props.appearance?.elements?.rootBox}>
        <div className={props.appearance?.elements?.card}>
          <button className={props.appearance?.elements?.socialButtonsBlockButton}>
            <span className={props.appearance?.elements?.socialButtonsBlockButtonText}>
              Continue with Google
            </span>
          </button>
          <div className={props.appearance?.elements?.dividerRow}>
            <span className={props.appearance?.elements?.dividerText}>or</span>
          </div>
          <label className={props.appearance?.elements?.formFieldLabel}>
            Email address or username
          </label>
          <input
            className={props.appearance?.elements?.formFieldInput}
            placeholder="Enter email or username"
          />
          <button className={props.appearance?.elements?.formButtonPrimary}>
            Continue
          </button>
        </div>
      </div>
    );
  },
}));

afterEach(() => {
  cleanup();
  capturedAppearance = null;
});

describe("LoginScreen Component", () => {
  it("renders the 50/50 split auth layout with independent brand and testimonial", () => {
    render(<LoginScreen />);

    // Brand headline
    expect(
      screen.getByRole("heading", { name: /master your medical studies/i }),
    ).toBeInTheDocument();

    // Wordmark
    expect(screen.getByText("asu.codes")).toBeInTheDocument();
    expect(screen.getByText("Independent Project")).toBeInTheDocument();

    // Mohamed Ibrahim testimonial
    expect(
      screen.getByText(/dude i genuinely don't know how to thank you enough/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Mohamed Ibrahim")).toBeInTheDocument();
    expect(screen.getByText("Year 2 Medical Student")).toBeInTheDocument();

    // Core 3 features
    expect(screen.getByText("Chapter Practice & Review")).toBeInTheDocument();
    expect(screen.getByText("Syllabus Progress & Retention")).toBeInTheDocument();
    expect(screen.getByText("Question Search & Calculators")).toBeInTheDocument();
  });

  it("renders the top-right project donation support link correctly (not a helpdesk link)", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Support the project")).toBeInTheDocument();

    const supportLink = screen.getByRole("link", { name: /support asu\.codes 🤍 →/i });
    expect(supportLink).toBeInTheDocument();
    expect(supportLink).toHaveAttribute("href", "/support");
    expect(supportLink).toHaveAttribute(
      "title",
      "Help cover server costs and keep the project free",
    );
  });

  it("wraps Clerk in dark container classes and injects deep dark appearance settings", () => {
    const { container } = render(<LoginScreen />);

    const clerkWrapper = container.querySelector(
      ".split-clerk-container.clerk-dark-theme-container",
    );
    expect(clerkWrapper).not.toBeNull();

    // Verify Clerk appearance tokens
    expect(capturedAppearance).not.toBeNull();
    expect(capturedAppearance.variables.colorPrimary).toBe("#2743ff");
    expect(capturedAppearance.variables.colorBackground).toBe("transparent");
    expect(capturedAppearance.variables.colorInputBackground).toBe("#0f1524");
    expect(capturedAppearance.variables.colorInputText).toBe("#ffffff");

    // Header logo must be hidden to avoid redundant duplicate icons
    expect(capturedAppearance.elements.headerLogo).toBe("hidden");

    // Social buttons must be dark with white text
    expect(capturedAppearance.elements.socialButtonsBlockButton).toContain("bg-[#0f1524]");
    expect(capturedAppearance.elements.socialButtonsBlockButtonText).toContain("text-white");

    // Inputs must be dark with white text
    expect(capturedAppearance.elements.formFieldInput).toContain("bg-[#0f1524]");
    expect(capturedAppearance.elements.formFieldInput).toContain("text-white");

    // Primary button must be cobalt
    expect(capturedAppearance.elements.formButtonPrimary).toContain("bg-[#2743ff]");
  });
});
