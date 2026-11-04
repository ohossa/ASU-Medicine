import { motion, useReducedMotion } from "motion/react";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { GraduationCap, BookOpen, Search } from "lucide-react";
import "./split-login.css";

/* ------------------------------ Feature data (Old Page Fusion) ------------------------------ */

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Chapter Practice & Review",
    desc: "Practice MCQs and questions by module, review your answers, and retry missed questions with full explanations.",
  },
  {
    icon: BookOpen,
    title: "Syllabus Progress & Retention",
    desc: "Track completed lectures, monitor your study intervals, and bookmark questions for quick review.",
  },
  {
    icon: Search,
    title: "Question Search & Calculators",
    desc: "Instantly search questions across all modules and calculate your exam marks and grade distributions.",
  },
];

export function LoginScreen() {
  const reduced = Boolean(useReducedMotion());

  const clerkAppearance = {
    baseTheme: dark,
    variables: {
      colorPrimary: "#2743ff",
      colorBackground: "transparent",
      colorText: "#ffffff",
      colorTextSecondary: "#8c97ad",
      colorInputBackground: "#0f1524",
      colorInputText: "#ffffff",
      borderRadius: "12px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    elements: {
      rootBox: "w-full max-w-full",
      card: "bg-transparent shadow-none w-full p-0 border-0",
      headerLogo: "hidden",
      headerTitle: "text-white font-semibold text-lg tracking-tight",
      headerSubtitle: "text-zinc-400 text-xs mt-1",
      socialButtonsBlockButton:
        "border border-[#1f2a40] bg-[#0f1524] text-white hover:bg-[#151e33] hover:border-[#2743ff] transition-all min-h-[46px] rounded-xl font-semibold shadow-none text-sm relative flex items-center justify-center",
      socialButtonsBlockButtonText: "text-white font-semibold text-sm",
      socialButtonsBlockButtonBadge:
        "!absolute !top-0 !right-4 !-translate-y-1/2 !bg-[#2743ff]/20 !border !border-[#2743ff]/45 !text-[#8fa5ff] !text-[10px] !font-bold !uppercase !px-2 !py-0.5 !rounded-full !tracking-wide",
      dividerLine: "bg-[#1b2438]",
      dividerText: "text-[#8c97ad] text-xs font-semibold uppercase tracking-wider bg-[#080c16] px-2",
      formFieldLabel: "text-zinc-200 text-xs font-semibold tracking-wide mb-1.5",
      formFieldInput:
        "border border-[#1f2a40] bg-[#0f1524] text-white placeholder-[#5f6b85] focus:border-[#2743ff] focus:ring-4 focus:ring-[#2743ff]/25 min-h-[46px] rounded-xl text-sm transition-all",
      formButtonPrimary:
        "bg-[#2743ff] text-white font-semibold min-h-[46px] rounded-xl hover:bg-[#1f38db] transition-all shadow-md shadow-[#2743ff]/20 text-sm active:scale-[0.99] cursor-pointer",
      footerActionText: "text-[#8c97ad] text-xs",
      footerActionLink: "text-[#718eff] hover:text-[#a5b7ff] hover:underline font-semibold text-xs",
      identityPreview: "border border-[#1f2a40] bg-[#0f1524] rounded-xl p-3 text-white flex items-center justify-between",
      identityPreviewText: "text-white font-medium text-sm",
      identityPreviewEditButton: "text-[#718eff] hover:text-[#a5b7ff] hover:underline font-semibold text-xs transition-colors",
      formFieldAction: "text-[#718eff] hover:text-[#a5b7ff] hover:underline text-xs font-semibold",
      otpCodeFieldInputs: "gap-2 justify-center",
      otpCodeFieldInput:
        "border border-[#1f2a40] bg-[#0f1524] text-white focus:border-[#2743ff] focus:ring-[#2743ff]/25 rounded-xl text-center text-lg font-bold transition-all",
      alert: "bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3",
      alertText: "text-red-300 text-xs",
      formFieldErrorText: "text-red-400 text-xs font-medium mt-1",
    },
  };

  return (
    <div className="split-auth-container">
      {/* ── LEFT: SOLID ELECTRIC-COBALT BRAND PANEL (#0d1536) ── */}
      <section className="split-brand-panel" aria-label="Brand Overview">
        {/* Faint dot grid */}
        <div className="split-dot-grid" aria-hidden="true" />

        <div className="split-brand-content">
          {/* Top: Wordmark & Independent Badge */}
          <div className="split-brand-top">
            <a href="/" className="split-wordmark" title="asu.codes Home">
              <span>asu.codes</span>
            </a>
            <div className="split-pill-independent">
              <span className="split-pill-dot" />
              <span>Independent Project</span>
            </div>
          </div>

          {/* Middle: Oversized Value-Prop Headline with Apricot Underline */}
          <div className="split-headline-wrap">
            <motion.h1
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="split-headline"
            >
              Master your medical studies, <span className="apricot-underline">smarter.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="split-supporting-line"
            >
              The independent question bank built by medical students. Solve chapter MCQs,
              review detailed explanations, and test your knowledge at your own pace.
            </motion.p>

            {/* 3 Core Features (from original page) */}
            <div className="split-features-list">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                    className="split-feature-item"
                  >
                    <div className="split-feature-icon">
                      <Icon size={17} />
                    </div>
                    <div>
                      <h2 className="split-feature-title">{f.title}</h2>
                      <p className="split-feature-desc">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Inline Testimonial Unit with Apricot Stars */}
            <div className="split-testimonial">
              <div className="split-stars-row" aria-label="5 stars rating">
                ★★★★★
              </div>
              <blockquote className="split-quote">
                &ldquo;Dude I genuinely don&apos;t know how to thank you enough.&rdquo;
              </blockquote>
              <div className="split-author-row">
                <div className="split-author-avatar">MS</div>
                <div>
                  <div className="split-author-name">Year 2 Medical Student</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Trusted Engine Wordmarks */}
          <div className="split-trust-block">
            <div className="split-trust-eyebrow">INDEPENDENT STUDY SUITE</div>
            <div className="split-wordmarks-row">
              <span className="split-wordmark-item">CHAPTER MCQS</span>
              <span className="split-wordmark-item">DETAILED EXPLANATIONS</span>
              <span className="split-wordmark-item">SPACED REPETITION</span>
              <span className="split-wordmark-item">EXAM SIMULATOR</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RIGHT: CRISP DARK AUTH FORM COLUMN (#080c16) ── */}
      <section className="split-form-panel" aria-label="Sign In Form">
        <div className="split-form-top">
          <span className="split-form-top-label">Support the project</span>
          <a
            href="/support"
            className="split-form-top-link"
            title="Help cover server costs and keep the project free"
          >
            Support asu.codes 🤍 →
          </a>
        </div>

        <div className="split-form-center">
          <h2 className="split-welcome-heading">Welcome back</h2>
          <p className="split-welcome-subhead">
            Sign in to your account to continue your study workspace
          </p>

          <div className="split-auth-card-region">
            <div className="split-clerk-container clerk-dark-theme-container">
              <SignIn routing="virtual" appearance={clerkAppearance} />
            </div>
          </div>

          <div className="split-form-footnote">
            <p>
              An independent study companion · <a href="/disclaimer">Read Medical Disclaimer</a>
            </p>
            <p className="split-form-legal">
              By signing in, you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-zinc-500 mt-8 pt-4 border-t border-[#1b2438]">
          © {new Date().getFullYear()} asu.codes · Independent student project. Not affiliated with Ain Shams University.
        </div>
      </section>
    </div>
  );
}

export default LoginScreen;
