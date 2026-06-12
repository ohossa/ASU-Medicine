import React from "react";
import { motion } from "framer-motion";
import { Activity, BookOpen, Search, Heart } from "lucide-react";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

/* ------------------------------ Motion system ----------------------------- */

const EASE = [0.16, 1, 0.3, 1]; // Apple-like elastic deceleration

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
});

/* ------------------------------ Clerk theming ----------------------------- */

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#2dd4bf",
    colorBackground: "transparent",
    colorText: "#e2e8f0",
    colorTextSecondary: "#8e8e93",
    colorInputBackground: "rgba(255,255,255,0.04)",
    colorInputText: "#ffffff",
    borderRadius: "12px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none w-full",
    headerTitle: "text-white font-semibold",
    headerSubtitle: "text-[#8e8e93]",
    socialButtonsBlockButton:
      "border border-white/[0.08] bg-white/[0.04] text-slate-200 " +
      "hover:bg-white/[0.07] transition-colors duration-200 relative",
    socialButtonsBlockButtonBadge:
      "!absolute !top-0 !right-4 !-translate-y-1/2 " +
      "!bg-teal-500/15 !border !border-teal-500/30 !text-teal-400 " +
      "!text-[8.5px] !font-extrabold !uppercase !tracking-widest !px-2.5 !py-0.5 !rounded-full " +
      "!leading-none !shadow-md",
    dividerLine: "bg-white/[0.08]",
    dividerText: "text-[#8e8e93]",
    formFieldLabel: "text-slate-300",
    formFieldInput:
      "bg-white/[0.04] border border-white/[0.08] text-white " +
      "focus:border-[#2dd4bf]/50 focus:ring-1 focus:ring-[#2dd4bf]/25 " +
      "transition-colors duration-200",
    formButtonPrimary:
      "bg-white text-[#0b0b0c] font-semibold shadow-none " +
      "hover:bg-white hover:opacity-90 transition-opacity duration-200",
    footerActionText: "text-[#8e8e93]",
    footerActionLink: "text-[#2dd4bf] hover:text-[#2dd4bf]/80",
  },
};

/* ------------------------------ Feature data ------------------------------ */

const FEATURES = [
  {
    icon: Heart,
    title: "Clinical Case Solver",
    desc: "Solve randomized clinical cases with vital monitors, history sheets, and diagnostic tests.",
  },
  {
    icon: BookOpen,
    title: "Syllabus & Study Tracker",
    desc: "Track syllabus progress, lecture completion checklists, and store notes for every chapter.",
  },
  {
    icon: Search,
    title: "Question Search & Calculator",
    desc: "Search text across all database questions and calculate target grades or marks requirements.",
  },
];

/* --------------------------------- Page ----------------------------------- */

export function LoginScreen() {
  return (
    <main
      className="relative min-h-screen overflow-hidden antialiased"
    >
      {/* Single ambient light source behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 lg:left-[72%]
                   h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: "rgba(45,212,191,0.05)", filter: "blur(140px)" }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl
                      grid-cols-1 items-center gap-16 px-6 py-16
                      lg:grid-cols-2 lg:gap-24 lg:px-12 lg:items-start lg:pt-40 lg:pb-24">

        {/* ----------------------- Left: brand & features ------------------- */}
        <section className="mx-auto w-full max-w-md lg:mx-0 lg:h-[480px] flex flex-col justify-between">
          <div>
            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl font-semibold leading-[1.15] tracking-tight
                         text-white sm:text-5xl"
            >
              Master your Medical Studies.
            </motion.h1>

            {/* Intro */}
            <motion.p
              {...fadeUp(0.2)}
              className="mt-4 text-[14.5px] leading-relaxed text-[#8e8e93]"
            >
              Practice every question format, track your syllabus, and study
              smarter — built for ASU Medicine students.
            </motion.p>
          </div>

          {/* Features */}
          <div className="space-y-6 lg:mt-0 mt-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  {...fadeUp(0.3 + i * 0.1)}
                  className="group flex items-start gap-4"
                >
                  <div
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center
                               rounded-xl transition-colors duration-300
                               group-hover:border-white/[0.14]"
                    style={{
                      backgroundColor: "#121214",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#8e8e93] transition-colors duration-300
                                 group-hover:text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{f.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#8e8e93]">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ------------------------- Right: login card ---------------------- */}
        <motion.section
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="mx-auto w-full max-w-[400px]"
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              backgroundColor: "rgba(18,18,20,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            }}
          >
            <div className="clerk-dark-theme-container lg:h-[480px] flex items-center justify-center">
              <SignIn routing="hash" appearance={clerkAppearance} />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
