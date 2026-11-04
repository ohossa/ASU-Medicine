import { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { GraduationCap } from "lucide-react";
import { SYLLABUS_MODULES } from "../data";
import "./luxury-landing.css";

export function LoginScreen() {
  const [activeYear, setActiveYear] = useState<number>(2);

  const clerkAppearance = {
    baseTheme: dark,
    variables: {
      colorPrimary: "#c9b8a0",
      colorBackground: "transparent",
      colorText: "#ffffff",
      colorTextSecondary: "#a1a1aa",
      colorInputBackground: "rgba(255, 255, 255, 0.04)",
      colorInputText: "#ffffff",
      borderRadius: "14px",
      fontFamily: "'Inter', -apple-system, sans-serif",
    },
    elements: {
      rootBox: "w-full",
      card: "bg-transparent shadow-none w-full p-0",
      headerTitle: "text-white font-semibold text-lg",
      headerSubtitle: "text-zinc-400 text-xs",
      socialButtonsBlockButton:
        "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-all min-h-[46px] rounded-xl relative",
      socialButtonsBlockButtonBadge:
        "!absolute !top-0 !right-4 !-translate-y-1/2 !bg-[#c9b8a0]/20 !border !border-[#c9b8a0]/40 !text-[#c9b8a0] !text-[10px] !font-bold !uppercase !px-2.5 !py-0.5 !rounded-full",
      dividerLine: "bg-white/10",
      dividerText: "text-zinc-500 text-xs",
      formFieldLabel: "text-zinc-300 text-xs",
      formFieldInput:
        "border bg-white/[0.04] border-white/10 text-white focus:border-[#c9b8a0]/60 focus:ring-[#c9b8a0]/20 min-h-11 rounded-xl text-sm transition-all",
      formButtonPrimary:
        "bg-[#c9b8a0] text-black font-bold min-h-11 rounded-xl hover:bg-[#e8d5b7] transition-all shadow-lg shadow-[#c9b8a0]/15",
      footerActionText: "text-zinc-500 text-xs",
      footerActionLink: "text-[#c9b8a0] hover:text-[#e8d5b7] font-medium text-xs",
    },
  };

  const currentYearModules = Object.values(SYLLABUS_MODULES[activeYear] || {}).flat();

  return (
    <div className="luxury-landing-root">
      {/* 32px Radial Dot Grid Overlay */}
      <div className="luxury-dot-grid" aria-hidden="true" />

      {/* Central Golden Ambient Glow */}
      <div className="luxury-ambient-glow" aria-hidden="true" />

      {/* ── 1. Top Navbar ── */}
      <header className="luxury-navbar">
        <a href="/" className="luxury-nav-brand">
          <div className="luxury-nav-monogram">
            <span>asu.codes</span>
          </div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full">
            Independent
          </span>
        </a>

        <nav className="luxury-nav-links" aria-label="Main Navigation">
          <a href="#curriculum" className="luxury-nav-link">Curriculum</a>
          <a href="/anki" className="luxury-nav-link">Anki Decks</a>
          <a href="/marks-calculator" className="luxury-nav-link">Marks Calculator</a>
          <a href="/support" className="luxury-nav-link">Support</a>
        </nav>

        <a href="#auth-portal" className="luxury-nav-cta">
          <GraduationCap size={16} />
          <span>Sign In</span>
        </a>
      </header>

      {/* ── 2. Hero Section ── */}
      <section className="luxury-hero-section">
        {/* Independent Companion Pill */}
        <div className="luxury-live-pill" role="status">
          <span className="luxury-live-dot" />
          <span className="luxury-live-tag">INDEPENDENT</span>
          <span className="luxury-live-text">Student-Built Medical Study Companion</span>
        </div>

        {/* Minimalist Editorial Headline */}
        <h1 className="luxury-headline">
          Medicine, simplified. <br />
          <span className="luxury-headline-gold">Practice on your own terms.</span>
        </h1>

        <p className="luxury-subheadline">
          An ad-free, student-led question bank and exam simulator. Practice chapter MCQs,
          simulate continuous assessments, and review spaced repetition flashcards without institutional clutter.
        </p>

        {/* ── 3. Neural Network Stage & Central Node ── */}
        <div className="luxury-neural-stage" id="auth-portal">
          {/* Dynamic SVG Bezier Connecting Lines */}
          <svg className="luxury-svg-canvas" viewBox="0 0 1000 500" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="goldNeuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8d5b7" />
                <stop offset="50%" stopColor="#c9b8a0" />
                <stop offset="100%" stopColor="#a78b71" />
              </linearGradient>
            </defs>

            {/* Path 1: Central to Top-Left */}
            <path d="M 320 250 C 220 220, 150 140, 160 80" className="node-line" />
            <path d="M 320 250 C 220 220, 150 140, 160 80" className="node-line-flow" />

            {/* Path 2: Central to Top-Right */}
            <path d="M 680 250 C 760 210, 840 130, 830 70" className="node-line" />
            <path d="M 680 250 C 760 210, 840 130, 830 70" className="node-line-flow" />

            {/* Path 3: Central to Bottom-Right */}
            <path d="M 680 320 C 780 350, 820 400, 810 440" className="node-line" />
            <path d="M 680 320 C 780 350, 820 400, 810 440" className="node-line-flow" />
          </svg>

          {/* Satellite Card 1: Top-Left */}
          <div className="luxury-satellite-card satellite-top-left">
            <div className="satellite-eyebrow">Exams & Mocks</div>
            <div className="satellite-title">Continuous II Blueprint Practice</div>
            <div className="satellite-meta">Timed solving with instant answer rationale</div>
          </div>

          {/* Satellite Card 2: Top-Right */}
          <div className="luxury-satellite-card satellite-top-right">
            <div className="satellite-eyebrow">Practical Review</div>
            <div className="satellite-title">Clinical Spotters & Specimens</div>
            <div className="satellite-meta">Pinned anatomical specimens and stations</div>
          </div>

          {/* Satellite Card 3: Bottom-Right */}
          <div className="luxury-satellite-card satellite-bottom-right">
            <div className="satellite-eyebrow">Spaced Repetition</div>
            <div className="satellite-title">FSRS & Anki Synchronization</div>
            <div className="satellite-meta">Adaptive intervals for long-term retention</div>
          </div>

          {/* Central Interactive Glass Node: Clerk Sign In */}
          <div className="luxury-central-node">
            <div className="luxury-node-header">
              <div className="luxury-node-brand">
                <div className="luxury-nav-monogram">
                  <span>asu.codes</span>
                </div>
                <div>
                  <h2>Student Workspace</h2>
                  <p>Sign in to continue your practice</p>
                </div>
              </div>
              <span className="luxury-node-badge">Free Project</span>
            </div>

            <div className="clerk-dark-theme-container flex items-center justify-center">
              <SignIn routing="virtual" appearance={clerkAppearance} />
            </div>

            <p className="text-[11px] text-zinc-500 text-center mt-4 border-t border-zinc-800/60 pt-3">
              Independent study platform · Sign in with any Google account
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Curriculum Explorer Section ── */}
      <section className="luxury-curriculum-section" id="curriculum">
        <div className="luxury-section-head">
          <div className="luxury-section-eyebrow">Curriculum Navigator</div>
          <h2 className="luxury-section-title">Browse by Academic Year</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
            Explore modules across all five years of the medical curriculum.
          </p>
        </div>

        {/* Year Switcher Tabs */}
        <div className="luxury-year-tabs" role="tablist" aria-label="Academic Years">
          {[1, 2, 3, 4, 5].map((yr) => (
            <button
              key={yr}
              type="button"
              role="tab"
              aria-selected={activeYear === yr}
              data-active={activeYear === yr}
              className="luxury-year-tab"
              onClick={() => setActiveYear(yr)}
            >
              Year {yr}
            </button>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="luxury-module-grid">
          {currentYearModules.map((m) => (
            <div key={m.code} className="luxury-module-card">
              <div className="luxury-module-header">
                <span className="luxury-module-badge">{m.code}</span>
                <span className="text-xl text-[#c9b8a0]" aria-hidden="true">
                  🩺
                </span>
              </div>
              <h3 className="luxury-module-name">{m.name}</h3>
              <div className="luxury-module-footer">
                <span>{m.marks ? `${m.marks} Marks · ${m.cp} CP` : `${m.cp} Credit Points`}</span>
                <span className="text-zinc-500">Year {activeYear}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Minimalist Footer ── */}
      <footer className="luxury-footer">
        <div className="luxury-footer-inner">
          {/* Brand & Independence Statement */}
          <div className="luxury-footer-brand">
            <h3>asu.codes</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              An independent, student-led study companion designed to make medical question practice,
              spotter review, and exam prep straightforward and ad-free.
            </p>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11.5px] text-zinc-400 leading-normal">
              <strong className="text-zinc-300 block mb-0.5">Disclaimer:</strong>
              asu.codes is an independent, non-commercial student project. It is not affiliated with, endorsed by, or operated by Ain Shams University or the Faculty of Medicine.
            </div>
          </div>

          {/* Col 1: Curriculum */}
          <div className="luxury-footer-col">
            <h4>Curriculum</h4>
            <ul>
              <li><a href="#curriculum" onClick={() => setActiveYear(1)}>Year 1 Modules</a></li>
              <li><a href="#curriculum" onClick={() => setActiveYear(2)}>Year 2 Modules</a></li>
              <li><a href="#curriculum" onClick={() => setActiveYear(3)}>Year 3 Modules</a></li>
              <li><a href="#curriculum" onClick={() => setActiveYear(4)}>Year 4 Modules</a></li>
              <li><a href="#curriculum" onClick={() => setActiveYear(5)}>Year 5 Modules</a></li>
            </ul>
          </div>

          {/* Col 2: Study Tools */}
          <div className="luxury-footer-col">
            <h4>Study Tools</h4>
            <ul>
              <li><a href="/anki">Anki Flashcards</a></li>
              <li><a href="/marks-calculator">Marks Calculator</a></li>
              <li><a href="/support">Feedback & Support</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div className="luxury-footer-col">
            <h4>Legal & Policies</h4>
            <ul>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/disclaimer">Medical Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="luxury-footer-bottom">
          <span>© {new Date().getFullYear()} asu.codes · Independent Student Project.</span>
          <span>Built for medical students to study at their own pace.</span>
        </div>
      </footer>
    </div>
  );
}

export default LoginScreen;
