import { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import {
  GraduationCap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Brain,
  Microscope,
  CheckCircle2,
} from "lucide-react";
import { SYLLABUS_MODULES } from "../data";
import "./luxury-landing.css";

const FEATURES = [
  {
    icon: Layers,
    title: "42 Integrated Modules",
    desc: "Complete, syllabus-aligned coverage of Year 1 through Year 5 Ain Shams medical curriculum.",
  },
  {
    icon: Brain,
    title: "Smart Spaced Repetition",
    desc: "Built-in FSRS memory optimization algorithm, Anki flashcards sync, and retention analytics.",
  },
  {
    icon: ShieldCheck,
    title: "100% Faculty Verified",
    desc: "Evidence-grounded question review with clinical rationale, zero spoilers, and continuous blueprint quotas.",
  },
  {
    icon: Microscope,
    title: "Clinical Spotter Simulator",
    desc: "530+ high-definition specimens, pinned anatomical callouts, and timer examination modes.",
  },
];

export function LoginScreen() {
  const [activeYear, setActiveYear] = useState<number>(2);
  const [digestEmail, setDigestEmail] = useState("");
  const [digestSent, setDigestSent] = useState(false);

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

  const handleDigestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!digestEmail.trim()) return;
    setDigestSent(true);
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
            <span>ASU</span>
          </div>
          <span className="luxury-nav-brand-text">ASU Medicine</span>
        </a>

        <nav className="luxury-nav-links" aria-label="Main Navigation">
          <a href="#curriculum" className="luxury-nav-link">Curriculum</a>
          <a href="#features" className="luxury-nav-link">Features</a>
          <a href="#standards" className="luxury-nav-link">Standards</a>
          <a href="/anki" className="luxury-nav-link">Anki Flashcards</a>
          <a href="/marks-calculator" className="luxury-nav-link">Calculator</a>
        </nav>

        <a href="#auth-portal" className="luxury-nav-cta">
          <GraduationCap size={16} />
          <span>Enter Portal</span>
        </a>
      </header>

      {/* ── 2. Hero Section ── */}
      <section className="luxury-hero-section">
        {/* Live Notification Pill */}
        <div className="luxury-live-pill" role="status">
          <span className="luxury-live-dot" />
          <span className="luxury-live-tag">LIVE</span>
          <span className="luxury-live-text">1,420+ Ain Shams Medical Students Active</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="luxury-headline">
          The Academic Standard for <span className="luxury-headline-gold">Modern Medicine.</span>
        </h1>

        <p className="luxury-subheadline">
          Ain Shams University Faculty of Medicine&apos;s digital examination platform.
          Master 42 integrated modules, 12,800+ faculty-verified MCQs, and continuous assessment mock blueprints.
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

            {/* Path 1: Central to Top-Left (MRS-2 Satellite) */}
            <path d="M 320 250 C 220 220, 150 140, 160 80" className="node-line" />
            <path d="M 320 250 C 220 220, 150 140, 160 80" className="node-line-flow" />

            {/* Path 2: Central to Top-Right (MGL-3 Satellite) */}
            <path d="M 680 250 C 760 210, 840 130, 830 70" className="node-line" />
            <path d="M 680 250 C 760 210, 840 130, 830 70" className="node-line-flow" />

            {/* Path 3: Central to Bottom-Right (FSRS Satellite) */}
            <path d="M 680 320 C 780 350, 820 400, 810 440" className="node-line" />
            <path d="M 680 320 C 780 350, 820 400, 810 440" className="node-line-flow" />
          </svg>

          {/* Satellite Card 1: Top-Left (MRS-2 Continuous II) */}
          <div className="luxury-satellite-card satellite-top-left">
            <div className="satellite-eyebrow">Year 2 · Continuous II</div>
            <div className="satellite-title">Respiratory System (MRS-2)</div>
            <div className="satellite-meta">38 MCQs Blueprint · 1,282 Questions Pool</div>
          </div>

          {/* Satellite Card 2: Top-Right (MGL-3 Clinical Spotter) */}
          <div className="luxury-satellite-card satellite-top-right">
            <div className="satellite-eyebrow">Year 3 · Clinical Spotter</div>
            <div className="satellite-title">GIT Examination (MGL-3)</div>
            <div className="satellite-meta">530 Stations · Pinned Anatomical Specimens</div>
          </div>

          {/* Satellite Card 3: Bottom-Right (FSRS & Anki) */}
          <div className="luxury-satellite-card satellite-bottom-right">
            <div className="satellite-eyebrow">Smart Spaced Repetition</div>
            <div className="satellite-title">FSRS & Anki Cloud Sync</div>
            <div className="satellite-meta">Evidence-based long-term retention</div>
          </div>

          {/* Central Interactive Glass Node: Clerk Sign In */}
          <div className="luxury-central-node">
            <div className="luxury-node-header">
              <div className="luxury-node-brand">
                <div className="luxury-nav-monogram">
                  <span>ASU</span>
                </div>
                <div>
                  <h2>Student Access Portal</h2>
                  <p>Ain Shams University</p>
                </div>
              </div>
              <span className="luxury-node-badge">Official Portal</span>
            </div>

            <div className="clerk-dark-theme-container flex items-center justify-center">
              <SignIn routing="virtual" appearance={clerkAppearance} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Features Grid ── */}
      <section className="luxury-features-section" id="features">
        <div className="luxury-section-head">
          <div className="luxury-section-eyebrow">Rigorous Academic Architecture</div>
          <h2 className="luxury-section-title">Built for Serious Medical Education</h2>
        </div>

        <div className="luxury-features-grid">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="luxury-feature-card">
                <div className="luxury-icon-box">
                  <Icon size={22} />
                </div>
                <h3 className="luxury-feature-title">{f.title}</h3>
                <p className="luxury-feature-desc">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Curriculum Explorer Section ── */}
      <section className="luxury-curriculum-section" id="curriculum">
        <div className="luxury-section-head">
          <div className="luxury-section-eyebrow">All 42 Academic Modules</div>
          <h2 className="luxury-section-title">Explore the 5-Year Medical Pathway</h2>
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
              Year {yr} Curriculum
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

      {/* ── 6. Faculty Standards & Quality Framework ── */}
      <section className="luxury-features-section" id="standards">
        <div className="luxury-section-head">
          <div className="luxury-section-eyebrow">Medical Integrity Protocol</div>
          <h2 className="luxury-section-title">Zero Compromise on Medical Accuracy</h2>
        </div>

        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 size={20} className="text-[#c9b8a0] shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-semibold text-white">4-Gate Semantic Intake Pipeline</h4>
                <p className="text-sm text-zinc-400 mt-1">
                  Every imported question undergoes occurrence anchoring, duplicate reconciliation,
                  and faculty key verification before entering the active student pool.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 size={20} className="text-[#c9b8a0] shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-semibold text-white">Authentic Assessment Blueprints</h4>
                <p className="text-sm text-zinc-400 mt-1">
                  Mock examinations strictly mirror official faculty quotas (e.g. 38 MCQs, 49 minutes)
                  with unit-weighted mark distributions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 size={20} className="text-[#c9b8a0] shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-semibold text-white">Zero Spoiler Clinical Spotters</h4>
                <p className="text-sm text-zinc-400 mt-1">
                  High-definition specimen images with neutralized station captions and length-balanced
                  distractors to simulate realistic practical examinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Luxury 5-Column Footer ── */}
      <footer className="luxury-footer">
        <div className="luxury-footer-inner">
          {/* Brand Col */}
          <div className="luxury-footer-brand">
            <h3>ASU Medicine</h3>
            <p>
              Ain Shams University Faculty of Medicine examination and curriculum mastery platform.
            </p>
          </div>

          {/* Col 1: Curriculum */}
          <div className="luxury-footer-col">
            <h4>Curriculum</h4>
            <ul>
              <li><a href="#curriculum">Year 1 Modules</a></li>
              <li><a href="#curriculum">Year 2 Modules</a></li>
              <li><a href="#curriculum">Year 3 Modules</a></li>
              <li><a href="#curriculum">Year 4 Modules</a></li>
              <li><a href="#curriculum">Year 5 Modules</a></li>
            </ul>
          </div>

          {/* Col 2: Academic Tools */}
          <div className="luxury-footer-col">
            <h4>Tools</h4>
            <ul>
              <li><a href="/anki">Anki Flashcards</a></li>
              <li><a href="/marks-calculator">Marks Calculator</a></li>
              <li><a href="#standards">Medical Standards</a></li>
              <li><a href="/support">Academic Support</a></li>
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div className="luxury-footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/disclaimer">Medical Disclaimer</a></li>
            </ul>
          </div>

          {/* Col 4: Digest Input */}
          <div className="luxury-footer-col">
            <h4>Academic Digest</h4>
            <div className="luxury-digest-box">
              <p className="text-xs text-zinc-400">
                Receive weekly high-yield clinical summaries and assessment blueprint updates.
              </p>
              {digestSent ? (
                <p className="text-xs text-[#10b981] font-semibold">
                  ✓ Thank you. You are subscribed to updates.
                </p>
              ) : (
                <form onSubmit={handleDigestSubmit} className="luxury-digest-input-wrap">
                  <input
                    type="email"
                    required
                    placeholder="student@med.asu.edu.eg"
                    aria-label="Email address for academic digest"
                    value={digestEmail}
                    onChange={(e) => setDigestEmail(e.target.value)}
                    className="luxury-digest-input"
                  />
                  <button type="submit" aria-label="Subscribe" className="luxury-digest-btn">
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="luxury-footer-bottom">
          <span>© {new Date().getFullYear()} Ain Shams University Faculty of Medicine. All rights reserved.</span>
          <span>Designed with Apple Human Interface Guidelines for Academic Excellence.</span>
        </div>
      </footer>
    </div>
  );
}
export default LoginScreen;
