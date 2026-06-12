// src/app/components/AnalyticsDashboard.tsx
// ASU Medical Portal — Ain Shams University
// Premium analytics dashboard (Light/Dark Mode responsive).

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Flame,
  Award,
  BookOpen,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { QuizResult } from "../utils/storage";
import { useTheme } from "../context/ThemeContext";
import { PortalShell } from "./PortalShell";

/* ---------------------------------- Theme ---------------------------------- */

const getThemeColors = (themeMode: "light" | "dark") => {
  const isDark = themeMode === "dark";
  return {
    bg: "transparent",
    surface: isDark ? "#121214" : "#ffffff",
    border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(24,24,27,0.08)",
    text: isDark ? "rgba(255,255,255,0.92)" : "rgba(24,24,27,0.92)",
    textSecondary: isDark ? "rgba(255,255,255,0.55)" : "rgba(24,24,27,0.65)",
    textTertiary: isDark ? "rgba(255,255,255,0.35)" : "rgba(24,24,27,0.42)",
    teal: isDark ? "#2dd4bf" : "#0d9488",
    purple: isDark ? "#a855f7" : "#7c3aed",
    amber: isDark ? "#fbbf24" : "#d97706",
    red: isDark ? "#f87171" : "#dc2626",
    green: isDark ? "#4ade80" : "#16a34a",
    font: `-apple-system, "SF Pro Display", "SF Pro Text", Inter, "Helvetica Neue", sans-serif`,
  } as const;
};

/* ----------------------------- Motion variants ----------------------------- */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------- Primitives -------------------------------- */

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function Card({ children, style, ...rest }: CardProps) {
  const { theme: mode } = useTheme();
  const theme = getThemeColors(mode);
  return (
    <motion.div
      variants={rise}
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={{
        background: theme.surface,
        border: theme.border,
        borderRadius: 20,
        padding: "24px 26px",
        position: "relative",
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface TooltipProps {
  label: string;
  visible: boolean;
}

function Tooltip({ label, visible }: TooltipProps) {
  const { theme: mode } = useTheme();
  const theme = getThemeColors(mode);
  const isDark = mode === "dark";
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 4 }}
      transition={{ duration: 0.18 }}
      style={{
        position: "absolute",
        top: 12,
        right: 14,
        fontSize: 10.5,
        letterSpacing: 0.3,
        color: theme.textSecondary,
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(24,24,27,0.04)",
        border: theme.border,
        borderRadius: 999,
        padding: "4px 10px",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </motion.div>
  );
}

interface CardLabelProps {
  icon: React.ComponentType<{ size?: number | string; color?: string; strokeWidth?: number | string }>;
  color: string;
  children: React.ReactNode;
}

function CardLabel({ icon: Icon, color, children }: CardLabelProps) {
  const { theme: mode } = useTheme();
  const theme = getThemeColors(mode);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
      <Icon size={15} color={color} strokeWidth={2.2} />
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: theme.textSecondary,
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ----------------------------- SVG visualisations -------------------------- */

interface RadialRingProps {
  percent: number;
  color: string;
  size?: number;
  stroke?: number;
}

function RadialRing({ percent, color, size = 96, stroke = 7 }: RadialRingProps) {
  const { theme: mode } = useTheme();
  const isDark = mode === "dark";
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(24,24,27,0.07)"} strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (c * percent) / 100 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      />
    </svg>
  );
}

interface LinearBarProps {
  percent: number;
  color: string;
}

function LinearBar({ percent, color }: LinearBarProps) {
  const { theme: mode } = useTheme();
  const isDark = mode === "dark";
  return (
    <div
      style={{
        height: 6,
        borderRadius: 999,
        background: isDark ? "rgba(255,255,255,0.07)" : "rgba(24,24,27,0.07)",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        style={{ height: "100%", borderRadius: 999, background: color }}
      />
    </div>
  );
}

interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

function Sparkline({ data, color, width = 160, height = 44 }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} fill="none">
      <motion.polyline
        points={pts}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: "easeOut", delay: 0.5 }}
      />
    </svg>
  );
}

/* ------------------------------- Component --------------------------------- */

interface AnalyticsDashboardProps {
  onBack: () => void;
  userButton?: React.ReactNode;
  history: QuizResult[];
  studentName: string;
  studentYear: number | null;
  progress: { completed: number; total: number; pct: number };
}

export function AnalyticsDashboard({
  onBack,
  userButton,
  history,
  studentName,
  studentYear,
  progress,
}: AnalyticsDashboardProps) {
  const { theme: mode } = useTheme();
  const theme = getThemeColors(mode);
  const [hovered, setHovered] = useState<string | null>(null);

  // 1. Calculate General Stats
  const totalQuestions = history.reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = history.reduce((sum, r) => sum + r.correct, 0);
  const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const totalSeconds = history.reduce((sum, r) => sum + r.elapsedSeconds, 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  // 2. Study Trend (last 7 sessions in minutes spent)
  const studyTrend = history.slice(0, 7).reverse().map(r => r.elapsedSeconds / 60);
  const STUDY_TREND = studyTrend.length >= 2
    ? studyTrend
    : (studyTrend.length === 1 ? [...studyTrend, ...studyTrend] : [0, 0]);

  // 3. Module Breakdown
  const moduleMap: Record<string, { correct: number, total: number, code: string }> = {};
  history.forEach(r => {
    const code = r.moduleCode || 'MEM-2';
    if (!moduleMap[code]) {
      moduleMap[code] = { correct: 0, total: 0, code };
    }
    moduleMap[code].correct += r.correct;
    moduleMap[code].total += r.total;
  });

  const MODULES = Object.entries(moduleMap).map(([code, data]) => {
    const percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    let name = code;
    let subject = "Mixed";
    if (code === 'MEM-2') {
      name = "Endocrine System & Metabolism";
      subject = "Physiology / Biochem";
    } else if (code === 'MCNS-2') {
      name = "Central Nervous System";
      subject = "Anatomy / Pathology";
    } else if (code === 'MBL-2') {
      name = "Blood & Lymphatic System";
      subject = "Physiology";
    }
    return {
      name,
      percent,
      color: code === 'MEM-2' ? theme.teal : code === 'MCNS-2' ? theme.purple : theme.amber,
      subject
    };
  });

  const displayModules = MODULES.length > 0 ? MODULES : [
    { name: "Endocrine System & Metabolism", percent: 0, color: theme.teal, subject: "Physiology / Biochem" },
    { name: "Central Nervous System", percent: 0, color: theme.purple, subject: "Anatomy / Pathology" }
  ];

  // 4. Weak Area Analysis (group by subjectName)
  const subjectMap: Record<string, { correct: number, total: number }> = {};
  history.forEach(r => {
    if (!r.subjectName) return;
    if (!subjectMap[r.subjectName]) {
      subjectMap[r.subjectName] = { correct: 0, total: 0 };
    }
    subjectMap[r.subjectName].correct += r.correct;
    subjectMap[r.subjectName].total += r.total;
  });

  const WEAK_AREAS = Object.entries(subjectMap).map(([name, data]) => {
    const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    let tone = theme.green;
    let label = "Mastered";
    if (accuracy < 50) {
      tone = theme.red;
      label = "Needs revision";
    } else if (accuracy < 85) {
      tone = theme.amber;
      label = "Improving";
    }
    return { name, accuracy, tone, label };
  }).sort((a, b) => a.accuracy - b.accuracy);

  const displayWeakAreas = WEAK_AREAS.length > 0 ? WEAK_AREAS : [
    { name: "Physiology", accuracy: 0, tone: theme.red, label: "Needs practice" },
    { name: "Biochemistry", accuracy: 0, tone: theme.amber, label: "Needs practice" }
  ];

  // 5. Streak Calculation
  const getStreak = (historyList: QuizResult[]) => {
    if (!historyList.length) return 0;
    const dates = historyList
      .map(r => new Date(r.date).toDateString())
      .filter((v, i, self) => self.indexOf(v) === i)
      .map(d => new Date(d));
    
    dates.sort((a, b) => b.getTime() - a.getTime());
    
    let streakCount = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const latest = dates[0];
    if (!latest) return 0;
    
    const diffTime = Math.abs(today.getTime() - latest.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1 && latest.toDateString() !== yesterday.toDateString()) {
      return 0;
    }
    
    let current = latest;
    streakCount = 1;
    for (let i = 1; i < dates.length; i++) {
      const next = dates[i];
      const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1.1) {
        streakCount++;
        current = next;
      } else {
        break;
      }
    }
    return streakCount;
  };

  const streak = getStreak(history);
  const crumbs = [{ label: "Portal", onClick: onBack }, { label: "Performance" }];

  return (
    <PortalShell crumbs={crumbs} userButton={userButton}>
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          minHeight: "100vh",
          background: theme.bg,
          fontFamily: theme.font,
          color: theme.text,
          padding: "clamp(24px, 5vw, 64px)",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {/* ------------------------------ Header ----------------------------- */}
          <motion.header
            variants={rise}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 40,
            }}
          >
            <div>
              <h1
                style={{
                  margin: "8px 0 0",
                  fontSize: "clamp(26px, 4vw, 38px)",
                  fontWeight: 700,
                  letterSpacing: -0.8,
                }}
              >
                Welcome back, {studentName}
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: theme.surface,
                  border: theme.border,
                  borderRadius: 999,
                  padding: "10px 18px",
                }}
              >
                <Flame size={15} color="#f97316" strokeWidth={2.2} />
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{streak} Day Streak</span>
              </div>
            </div>
          </motion.header>

          {/* --------------------------- Key metrics --------------------------- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Total Progress */}
            <Card
              onMouseEnter={() => setHovered("progress")}
              onMouseLeave={() => setHovered(null)}
            >
              <Tooltip visible={hovered === "progress"} label={`${progress.completed} of ${progress.total} topics complete`} />
              <CardLabel icon={Award} color={theme.teal}>Total Progress</CardLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ position: "relative", width: 96, height: 96 }}>
                  <RadialRing percent={progress.pct} color={theme.teal} />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: -0.4,
                    }}
                  >
                    {progress.pct}%
                  </span>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Complete</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: theme.textSecondary }}>
                    Curriculum, Year {studentYear || 1}
                  </p>
                </div>
              </div>
            </Card>

            {/* Questions Solved */}
            <Card
              onMouseEnter={() => setHovered("questions")}
              onMouseLeave={() => setHovered(null)}
            >
              <Tooltip visible={hovered === "questions"} label={`${averageAccuracy}% average accuracy`} />
              <CardLabel icon={BookOpen} color={theme.purple}>Questions Solved</CardLabel>
              <p style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>
                {totalCorrect}{" "}
                <span style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary }}>
                  / {totalQuestions}
                </span>
              </p>
              <p style={{ margin: "0 0 16px", fontSize: 12.5, color: theme.textSecondary }}>
                Correct / Attempted
              </p>
              <LinearBar percent={averageAccuracy} color={theme.purple} />
            </Card>

            {/* Study Time */}
            <Card
              onMouseEnter={() => setHovered("time")}
              onMouseLeave={() => setHovered(null)}
            >
              <Tooltip visible={hovered === "time"} label={`Avg: ${history.length ? Math.round(totalSeconds / history.length / 60) : 0} mins per quiz`} />
              <CardLabel icon={Clock} color={theme.amber}>Study Time</CardLabel>
              <p style={{ margin: "0 0 2px", fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>
                {totalHours} hrs
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 12.5, color: theme.textSecondary }}>
                total study time
              </p>
              <Sparkline data={STUDY_TREND} color={theme.amber} />
            </Card>
          </div>

          {/* ------------------------- Module breakdown ------------------------ */}
          <Card style={{ marginBottom: 18 }}>
            <CardLabel icon={Activity} color={theme.teal}>Module Breakdown</CardLabel>
            <div style={{ display: "grid", gap: 22 }}>
              {displayModules.map((m) => (
                <motion.div
                  key={m.name}
                  variants={rise}
                  whileHover={{ x: 3 }}
                  onMouseEnter={() => setHovered(m.name)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 9,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 600 }}>{m.name}</span>
                      <span style={{ fontSize: 11, color: theme.textTertiary, letterSpacing: 0.4 }}>
                        {m.subject}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: m.color }}>
                      {m.percent}% Mastered
                    </span>
                  </div>
                  <LinearBar percent={m.percent} color={m.color} />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* ------------------------ Weak area analysis ----------------------- */}
          <Card>
            <CardLabel icon={AlertTriangle} color={theme.red}>Weak Area Analysis</CardLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {displayWeakAreas.map((w) => (
                <motion.div
                  key={w.name}
                  variants={rise}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 360, damping: 22 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    borderRadius: 999,
                    background: `${w.tone}14`, // ~8% tint
                    border: `1px solid ${w.tone}33`,
                    cursor: "default",
                  }}
                  title={w.label}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: w.tone,
                      boxShadow: `0 0 8px ${w.tone}66`,
                    }}
                  />
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{w.name}</span>
                  <span style={{ fontSize: 12.5, color: w.tone, fontWeight: 600 }}>
                    {w.accuracy}% accuracy
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </motion.main>
    </PortalShell>
  );
}
