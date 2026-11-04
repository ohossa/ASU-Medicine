import { motion, useReducedMotion } from "motion/react";
import { SignIn } from "@clerk/clerk-react";
import { GraduationCap, BookOpen, Search } from "lucide-react";
import "./split-login.css";

/* ------------------------------ Feature data (Old Page Fusion) ------------------------------ */

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Chapter Practice & Review",
    desc: "Practice MCQs and essays by module, review your answers, and retry missed questions with full explanations.",
  },
  {
    icon: BookOpen,
    title: "Syllabus Progress & Retention",
    desc: "Track completed lectures, monitor your spaced repetition intervals, and bookmark high-yield questions.",
  },
  {
    icon: Search,
    title: "Question Search & Calculator",
    desc: "Instantly search questions across all modules and calculate exam grades with blueprint weighting.",
  },
];

export function LoginScreen() {
  const reduced = Boolean(useReducedMotion());

  const clerkAppearance = {
    variables: {
      colorPrimary: "#2743ff",
      colorBackground: "#ffffff",
      colorText: "#0d1220",
      colorTextSecondary: "#5b6478",
      colorInputBackground: "#ffffff",
      colorInputText: "#0d1220",
      borderRadius: "10px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    elements: {
      rootBox: "w-full",
      card: "bg-transparent shadow-none w-full p-0 border-0",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      socialButtonsBlockButton:
        "border border-[#dfe2ea] bg-white text-[#0d1220] hover:bg-[#f8f9fc] hover:border-[#cfd4e0] transition-all min-h-[46px] rounded-xl font-medium shadow-none text-sm relative",
      socialButtonsBlockButtonText: "text-[#0d1220] font-semibold text-sm",
      socialButtonsBlockButtonBadge:
        "!absolute !top-0 !right-4 !-translate-y-1/2 !bg-[#2743ff]/10 !border !border-[#2743ff]/20 !text-[#2743ff] !text-[10px] !font-bold !uppercase !px-2 !py-0.5 !rounded-full",
      dividerLine: "bg-[#e6e8ee]",
      dividerText: "text-[#5b6478] text-xs font-normal uppercase tracking-wider",
      formFieldLabel: "text-[#0d1220] text-xs font-semibold tracking-wide mb-1.5",
      formFieldInput:
        "border border-[#dfe2ea] bg-white text-[#0d1220] focus:border-[#2743ff] focus:ring-4 focus:ring-[#2743ff]/15 min-h-[44px] rounded-xl text-sm transition-all",
      formButtonPrimary:
        "bg-[#2743ff] text-white font-semibold min-h-[46px] rounded-xl hover:bg-[#1b34c9] transition-all shadow-none text-sm active:scale-[0.99]",
      footerActionText: "text-[#5b6478] text-xs",
      footerActionLink: "text-[#2743ff] hover:underline font-semibold text-xs",
      identityPreviewText: "text-[#0d1220]",
      identityPreviewEditButton: "text-[#2743ff] hover:underline",
      formFieldAction: "text-[#2743ff] hover:underline text-xs font-medium",
    },
  };

  return (
    <div className="split-auth-container">
      {/* ── LEFT: SOLID ELECTRIC-COBALT BRAND PANEL (#2743ff) ── */}
      <section className="split-brand-panel" aria-label="Brand Overview">
        {/* Faint #1b34c9 dot grid */}
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
              Ship your best work, <span className="apricot-underline">faster.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="split-supporting-line"
            >
              The unified, ad-free question bank and exam simulator for medical students.
              Solve chapter questions, practice continuous assessment mocks, and retain high-yield concepts.
            </motion.p>

            {/* 3 Core Features (from old page) */}
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
                &ldquo;The fastest way to test yourself before continuous exams. High-yield, clean, and zero distractions.&rdquo;
              </blockquote>
              <div className="split-author-row">
                <div className="split-author-avatar">MS</div>
                <div>
                  <div className="split-author-name">Medical Student, Class of &apos;26</div>
                  <div className="split-author-role">Clinical Phase · Independent User</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Trusted Engine Wordmarks */}
          <div className="split-trust-block">
            <div className="split-trust-eyebrow">STUDENT STUDY ENGINE</div>
            <div className="split-wordmarks-row">
              <span className="split-wordmark-item">MCQ PRACTICE</span>
              <span className="split-wordmark-item">CLINICAL SPOTTERS</span>
              <span className="split-wordmark-item">FSRS ANKI</span>
              <span className="split-wordmark-item">SYLLABUS TRACKER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RIGHT: CRISP WHITE AUTH FORM (#ffffff) ── */}
      <section className="split-form-panel" aria-label="Sign In Form">
        <div className="split-form-top">
          <span className="text-zinc-500">Need help?</span>
          <a href="/support" className="split-form-top-link">
            Student Support →
          </a>
        </div>

        <div className="split-form-center">
          <h2 className="split-welcome-heading">Welcome back</h2>
          <p className="split-welcome-subhead">
            Sign in to your account to continue your study workspace
          </p>

          <div className="split-auth-card-region">
            <SignIn routing="virtual" appearance={clerkAppearance} />
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

        <div className="text-center text-[11px] text-zinc-400 mt-8 pt-4 border-t border-[#e6e8ee]">
          © {new Date().getFullYear()} asu.codes · Independent student project. Not affiliated with Ain Shams University.
        </div>
      </section>
    </div>
  );
}

export default LoginScreen;
