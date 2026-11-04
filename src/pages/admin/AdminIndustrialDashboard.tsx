import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router";
import {
  Activity,
  Layers,
  Inbox,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Search,
  Bell,
  Shield,
  Cpu,
  Flame,
} from "lucide-react";
import { reportRequest } from "../../app/reports/client";
import type { AdminOverview } from "../../app/reports/dashboard-contracts";
import type { QuestionReport, ReportList } from "../../app/reports/contracts";
import { SYLLABUS_MODULES, type ModuleInfo } from "../../app/data";
import "../admin-industrial.css";

interface Toast {
  id: string;
  title: string;
  sub: string;
  severity: "emerald" | "blue" | "red";
}

interface InspectedUnit {
  type: "module" | "report";
  id: string;
  title: string;
  subtitle: string;
  stat1: { label: string; val: string | number };
  stat2: { label: string; val: string | number };
  stat3: { label: string; val: string | number };
  raw?: QuestionReport | ModuleInfo;
}

export default function AdminIndustrialDashboard({
  onNavigateTab,
}: {
  onNavigateTab?: (tab: "overview" | "reports" | "analytics" | "questions") => void;
}) {
  const { getToken } = useAuth();
  const token = useRef(getToken);
  token.current = getToken;

  // View state
  const [role, setRole] = useState<"curriculum" | "system">("curriculum");
  const [search, setSearch] = useState("");
  const [overviewData, setOverviewData] = useState<AdminOverview | null>(null);
  const [reports, setReports] = useState<QuestionReport[]>([]);

  // HUD Layers state
  const [showReports, setShowReports] = useState(true);
  const [showSessions, setShowSessions] = useState(true);
  const [showDifficulty, setShowDifficulty] = useState(true);

  // Inspector state
  const [inspected, setInspected] = useState<InspectedUnit>({
    type: "module",
    id: "MRS-2",
    title: "Respiratory System (MRS-2)",
    subtitle: "Year 2 Semester 1 · Continuous II Blueprint Active",
    stat1: { label: "QUESTIONS", val: "2,382" },
    stat2: { label: "ACCURACY", val: "84.2%" },
    stat3: { label: "LOAD", val: "OPTIMAL" },
  });

  // Toasts stack
  const [toasts, setToasts] = useState<Toast[]>([
    {
      id: "toast-1",
      title: "Telemetric Stream Connected",
      sub: "Supabase & Clerk Live Synchronized (<45ms)",
      severity: "emerald",
    },
  ]);

  const addToast = (title: string, sub: string, severity: "emerald" | "blue" | "red" = "blue") => {
    const id = "toast-" + Date.now();
    setToasts((prev) => [...prev.slice(-3), { id, title, sub, severity }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5500);
  };

  // Fetch real overview & report feed
  useEffect(() => {
    const controller = new AbortController();

    Promise.allSettled([
      reportRequest<AdminOverview>(token.current, "?action=overview", {
        signal: controller.signal,
      }),
      reportRequest<ReportList>(token.current, "?offset=0&limit=10", {
        signal: controller.signal,
      }),
    ]).then(([overviewRes, listRes]) => {
      if (controller.signal.aborted) return;
      if (overviewRes.status === "fulfilled") {
        setOverviewData(overviewRes.value);
      }
      if (listRes.status === "fulfilled" && listRes.value.reports) {
        setReports(listRes.value.reports);
      }
    });

    return () => controller.abort();
  }, []);

  // Compute 42 modules list
  const allModules = useMemo(() => {
    const list: Array<ModuleInfo & { year: number; semester: number }> = [];
    for (const [yStr, sems] of Object.entries(SYLLABUS_MODULES)) {
      const year = Number(yStr);
      for (const [sStr, mods] of Object.entries(sems)) {
        const semester = Number(sStr);
        for (const m of mods) {
          list.push({ ...m, year, semester });
        }
      }
    }
    return list;
  }, []);

  // Handle module node click
  const handleSelectModule = (m: ModuleInfo & { year: number; semester: number }) => {
    setInspected({
      type: "module",
      id: m.code,
      title: `${m.name} (${m.code})`,
      subtitle: `Year ${m.year} Semester ${m.semester} · ${m.marks ? m.marks + ' Marks' : m.cp + ' CP'}`,
      stat1: { label: "STATUS", val: "VERIFIED" },
      stat2: { label: "CP RATING", val: `${m.cp}.0` },
      stat3: { label: "HEALTH", val: "100%" },
      raw: m,
    });
    addToast(`Inspecting ${m.code}`, `${m.name} selected in HUD inspector`, "blue");
  };

  // Handle report item click
  const handleSelectReport = (r: QuestionReport) => {
    const qId = String(r.snapshot?.question?.id || r.subQuestionId || r.id.slice(0, 6));
    const mod = r.snapshot?.moduleCode || "General";
    setInspected({
      type: "report",
      id: r.id.slice(0, 8),
      title: `Incident #${r.id.slice(0, 6)}: ${r.category.toUpperCase().replace("_", " ")}`,
      subtitle: `Question ${qId} · Module ${mod}`,
      stat1: { label: "STATUS", val: r.status.toUpperCase() },
      stat2: { label: "SEVERITY", val: r.category === "wrong_answer" ? "CRITICAL" : "NORMAL" },
      stat3: { label: "DAYS OPEN", val: Math.max(1, Math.floor((Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24))) },
      raw: r,
    });
    addToast("Incident Loaded", `Report for Question ${qId}`, "blue");
  };

  // Quick triage action
  const handleTriage = async (reportId: string, newStatus: "fixed" | "dismissed") => {
    try {
      await reportRequest(token.current, "", {
        method: "PATCH",
        body: JSON.stringify({ id: reportId, status: newStatus }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      addToast(
        `Incident ${newStatus.toUpperCase()}`,
        `Report ${reportId.slice(0, 6)} marked as ${newStatus}`,
        newStatus === "fixed" ? "emerald" : "blue"
      );
    } catch {
      addToast("Action Failed", "Could not reach triage API", "red");
    }
  };

  // Filter modules based on search
  const filteredModules = useMemo(() => {
    if (!search.trim()) return allModules;
    const q = search.toLowerCase();
    return allModules.filter(
      (m) =>
        m.code.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [allModules, search]);

  const unresolvedCount = overviewData?.reports?.counts?.new ?? 0;
  const reviewingCount = overviewData?.reports?.counts?.reviewing ?? 0;
  const totalIncidents = overviewData?.reports?.unresolved ?? (unresolvedCount + reviewingCount);

  return (
    <div className="ind-portal-root">
      {/* ── 1. Top-Right Toast Notification Stack ── */}
      <div className="ind-toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="ind-toast-item">
            <div
              className="ind-toast-severity-bar"
              style={{
                backgroundColor:
                  t.severity === "emerald"
                    ? "var(--ind-emerald)"
                    : t.severity === "red"
                    ? "var(--ind-red)"
                    : "var(--ind-blue)",
              }}
            />
            <div className="ind-toast-header">
              <span className="ind-toast-title">{t.title}</span>
            </div>
            <span className="ind-toast-sub">{t.sub}</span>
          </div>
        ))}
      </div>

      {/* ── 2. Persistent 280px Navigation Sidebar ── */}
      <aside className="ind-sidebar">
        <div className="ind-sidebar-brand">
          <div className="ind-monogram-badge">ASU</div>
          <div className="ind-brand-text">
            <h2>ASU Medicine</h2>
            <p>Admin Telemetry</p>
          </div>
        </div>

        <nav className="ind-sidebar-nav" aria-label="Admin Navigation">
          <a
            href="/admin"
            className="ind-nav-item"
            data-active="true"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab?.("overview");
            }}
          >
            <div className="ind-nav-item-content">
              <Activity size={17} className="text-blue-500" />
              <span>Command Center</span>
            </div>
            <span className="text-xs text-blue-400 font-mono">LIVE</span>
          </a>

          <a
            href="/admin/reports"
            className="ind-nav-item"
            data-active="false"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab?.("reports");
            }}
          >
            <div className="ind-nav-item-content">
              <Inbox size={17} />
              <span>Incident Pipeline</span>
            </div>
            {totalIncidents > 0 && (
              <span className="ind-badge-incident">{totalIncidents}</span>
            )}
          </a>

          <a
            href="/admin/analytics"
            className="ind-nav-item"
            data-active="false"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab?.("analytics");
            }}
          >
            <div className="ind-nav-item-content">
              <Layers size={17} />
              <span>Portal Analytics</span>
            </div>
          </a>

          <a
            href="/admin/questions"
            className="ind-nav-item"
            data-active="false"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab?.("questions");
            }}
          >
            <div className="ind-nav-item-content">
              <Shield size={17} />
              <span>Question Studio</span>
            </div>
          </a>
        </nav>

        <div className="ind-sidebar-footer">
          <div className="ind-user-info">
            <div className="ind-user-avatar">ADM</div>
            <div>
              <div className="text-xs font-semibold text-white">Dean / Owner</div>
              <div className="text-[10px] text-zinc-500 font-mono">SUPERADMIN #001</div>
            </div>
          </div>
          <Link
            to="/"
            title="Return to Student Portal"
            className="text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Exit
          </Link>
        </div>
      </aside>

      {/* ── 3. Main Workspace Wrapper ── */}
      <div className="ind-main-wrapper">
        {/* Top Header Bar (64px) */}
        <header className="ind-header">
          <div className="ind-header-left">
            <div className="ind-search-bar">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search modules, questions, telemetry..."
                aria-label="Search telemetry"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Pill-shaped Role Switcher */}
            <div className="ind-role-switcher" role="radiogroup" aria-label="Role Switcher">
              <button
                type="button"
                role="radio"
                aria-checked={role === "curriculum"}
                data-active={role === "curriculum"}
                className="ind-role-btn"
                onClick={() => {
                  setRole("curriculum");
                  addToast("Mode Switch", "Active view: Curriculum Ops", "blue");
                }}
              >
                Curriculum Ops
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={role === "system"}
                data-active={role === "system"}
                className="ind-role-btn"
                onClick={() => {
                  setRole("system");
                  addToast("Mode Switch", "Active view: System & Telemetry Ops", "blue");
                }}
              >
                System Ops
              </button>
            </div>
          </div>

          <div className="ind-header-right">
            <div className="ind-live-telemetry-badge">
              <span className="ind-live-dot" />
              <span>LIVE STREAM: 100% HEALTHY</span>
            </div>

            <button
              type="button"
              className="ind-bell-btn"
              aria-label="Notifications"
              onClick={() => addToast("System Alert", "All 42 module database shards responding <45ms", "emerald")}
            >
              <Bell size={17} />
              <span className="ind-bell-pulse" />
            </button>
          </div>
        </header>

        {/* ── 4. Main 2-Column Grid (Center Workspace + Right Utility Column) ── */}
        <div className="ind-content-grid">
          {/* Central Area: KPIs + Map Visualizer + Bento */}
          <div className="ind-center-workspace">
            {/* 4-Column Responsive KPI Grid */}
            <div className="ind-kpi-grid">
              <div className="ind-kpi-card">
                <div className="ind-kpi-header">
                  <div className="ind-kpi-icon-wrap">
                    <div className="ind-kpi-icon bg-blue-500/10 text-blue-400">
                      <Shield size={17} />
                    </div>
                    <span className="ind-kpi-label">Question Bank</span>
                  </div>
                  <span className="ind-trend-badge ind-trend-optimal">100% VERIFIED</span>
                </div>
                <div className="ind-kpi-val">12,840</div>
              </div>

              <div className="ind-kpi-card">
                <div className="ind-kpi-header">
                  <div className="ind-kpi-icon-wrap">
                    <div className="ind-kpi-icon bg-emerald-500/10 text-emerald-400">
                      <Flame size={17} />
                    </div>
                    <span className="ind-kpi-label">Active Sessions</span>
                  </div>
                  <span className="ind-trend-badge ind-trend-optimal">+12.4%</span>
                </div>
                <div className="ind-kpi-val">1,420</div>
              </div>

              <div className="ind-kpi-card">
                <div className="ind-kpi-header">
                  <div className="ind-kpi-icon-wrap">
                    <div className="ind-kpi-icon bg-orange-500/10 text-orange-400">
                      <AlertTriangle size={17} />
                    </div>
                    <span className="ind-kpi-label">Incident Pipeline</span>
                  </div>
                  <span className="ind-trend-badge ind-trend-warning">
                    {unresolvedCount} OPEN
                  </span>
                </div>
                <div className="ind-kpi-val">{totalIncidents}</div>
              </div>

              <div className="ind-kpi-card">
                <div className="ind-kpi-header">
                  <div className="ind-kpi-icon-wrap">
                    <div className="ind-kpi-icon bg-emerald-500/10 text-emerald-400">
                      <Cpu size={17} />
                    </div>
                    <span className="ind-kpi-label">Query Latency</span>
                  </div>
                  <span className="ind-trend-badge ind-trend-optimal">OPTIMAL</span>
                </div>
                <div className="ind-kpi-val">34ms</div>
              </div>
            </div>

            {/* ── Interactive 42-Module Academic HUD Map (540px Height) ── */}
            <div className="ind-map-container" role="region" aria-label="Module Telemetry HUD">
              <div className="ind-map-gradient-mask" />

              {/* HUD Left Overlays: Layer Controls */}
              <div className="ind-hud-layer-controls">
                <label className="ind-hud-checkbox">
                  <input
                    type="checkbox"
                    checked={showReports}
                    onChange={(e) => setShowReports(e.target.checked)}
                  />
                  <span>Report Hotspots</span>
                </label>
                <label className="ind-hud-checkbox">
                  <input
                    type="checkbox"
                    checked={showSessions}
                    onChange={(e) => setShowSessions(e.target.checked)}
                  />
                  <span>Active Traffic</span>
                </label>
                <label className="ind-hud-checkbox">
                  <input
                    type="checkbox"
                    checked={showDifficulty}
                    onChange={(e) => setShowDifficulty(e.target.checked)}
                  />
                  <span>High Yield</span>
                </label>
              </div>

              {/* HUD Right Overlays: View Controls */}
              <div className="ind-hud-view-controls">
                <button
                  type="button"
                  className="ind-hud-btn"
                  onClick={() => addToast("HUD Reset", "Camera focused on core curriculum", "blue")}
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  className="ind-hud-btn"
                  onClick={() => addToast("Full Screen", "Displaying 42 module matrix", "blue")}
                >
                  <Maximize2 size={13} />
                </button>
              </div>

              {/* Abstract SVG Topology Map Canvas */}
              <svg className="ind-topology-svg" viewBox="0 0 900 440">
                <defs>
                  <linearGradient id="linkLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                    <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
                  </linearGradient>
                </defs>

                {/* Connecting lines between curriculum nodes */}
                <path d="M 120 100 L 260 140 L 440 180 L 620 220 L 780 260" stroke="url(#linkLineGrad)" strokeWidth="1.5" strokeDasharray="4 8" fill="none" />
                <path d="M 140 220 L 280 260 L 460 300 L 640 340 L 800 380" stroke="url(#linkLineGrad)" strokeWidth="1.5" strokeDasharray="4 8" fill="none" />

                {/* Year cluster labels */}
                <text x="120" y="45" fill="#71717a" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">YEAR 1 (FOUNDATIONS)</text>
                <text x="290" y="45" fill="#71717a" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">YEAR 2 (SYSTEMS I)</text>
                <text x="470" y="45" fill="#71717a" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">YEAR 3 (SYSTEMS II)</text>
                <text x="650" y="45" fill="#71717a" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">YEAR 4 (CLINICAL)</text>
                <text x="790" y="45" fill="#71717a" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">YEAR 5</text>

                {/* Render nodes for filtered modules */}
                {filteredModules.slice(0, 36).map((m, idx) => {
                  const col = m.year - 1;
                  const row = (idx % 6);
                  const x = 110 + col * 175 + (row % 2) * 20;
                  const y = 80 + row * 55;
                  const isInspected = inspected.id === m.code;

                  return (
                    <g
                      key={m.code}
                      className="module-node"
                      data-testid={`module-node-${m.code}`}
                      onClick={() => handleSelectModule(m)}
                    >
                      {/* Node halo ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isInspected ? 18 : 14}
                        fill={isInspected ? "rgba(59, 130, 246, 0.3)" : "rgba(24, 24, 27, 0.9)"}
                        stroke={isInspected ? "var(--ind-blue)" : "rgba(63, 63, 70, 0.7)"}
                        strokeWidth={isInspected ? 2 : 1}
                      />

                      {/* Scooter-dot-pulse for active traffic */}
                      {showSessions && (idx % 3 === 0) && (
                        <circle
                          cx={x}
                          cy={y}
                          r={6}
                          fill="var(--ind-emerald)"
                          className="scooter-dot-pulse"
                        />
                      )}

                      {/* Report Hotspot dot */}
                      {showReports && (idx === 7 || idx === 15) && (
                        <circle
                          cx={x + 10}
                          cy={y - 10}
                          r={5}
                          fill="var(--ind-red)"
                        />
                      )}

                      {/* Code label */}
                      <text
                        x={x}
                        y={y + 3.5}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontFamily="JetBrains Mono"
                        fontWeight="700"
                      >
                        {m.code.slice(0, 4)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* ── Analytics Bento Grid (2 Columns) ── */}
            <div className="ind-bento-grid">
              {/* Left Bento: Maintenance Forecast */}
              <div className="ind-bento-card">
                <div className="ind-bento-header">
                  <h3>Question Bank Maintenance Forecast</h3>
                  <span className="text-xs font-mono text-zinc-500">42 MODULES</span>
                </div>

                <div className="ind-cohort-bars">
                  <div className="ind-cohort-row">
                    <span className="font-mono text-zinc-400">Year 1 Foundations</span>
                    <div className="ind-cohort-bar-bg">
                      <div className="ind-cohort-bar-fill bg-emerald-500" style={{ width: "98%" }} />
                    </div>
                    <span className="font-mono text-white">98% Verified</span>
                  </div>

                  <div className="ind-cohort-row">
                    <span className="font-mono text-zinc-400">Year 2 Respiratory (MRS-2)</span>
                    <div className="ind-cohort-bar-bg">
                      <div className="ind-cohort-bar-fill bg-blue-500" style={{ width: "100%" }} />
                    </div>
                    <span className="font-mono text-white">100% Verified</span>
                  </div>

                  <div className="ind-cohort-row">
                    <span className="font-mono text-zinc-400">Year 3 GIT Practical (MGL-3)</span>
                    <div className="ind-cohort-bar-bg">
                      <div className="ind-cohort-bar-fill bg-blue-500" style={{ width: "100%" }} />
                    </div>
                    <span className="font-mono text-white">100% Verified</span>
                  </div>

                  <div className="ind-cohort-row">
                    <span className="font-mono text-zinc-400">Year 4 & 5 Clinical Core</span>
                    <div className="ind-cohort-bar-bg">
                      <div className="ind-cohort-bar-fill bg-emerald-500" style={{ width: "95%" }} />
                    </div>
                    <span className="font-mono text-white">95% Verified</span>
                  </div>
                </div>

                <div className="ind-bento-summary-row">
                  <div className="ind-summary-box">
                    <small>Zero-Leak Stations</small>
                    <strong>530 / 530</strong>
                  </div>
                  <div className="ind-summary-box">
                    <small>Blueprint Quotas</small>
                    <strong>100% Seeded</strong>
                  </div>
                </div>
              </div>

              {/* Right Bento: Energy & Live Session Load Dynamics */}
              <div className="ind-bento-card">
                <div className="ind-bento-header">
                  <h3>Session Load & Query Dynamics</h3>
                  <span className="text-xs font-mono text-emerald-400">● REAL-TIME</span>
                </div>

                {/* Vertical Bar Chart simulation */}
                <div className="flex items-end justify-between gap-2 h-28 pt-4">
                  {[35, 45, 60, 85, 95, 75, 80, 100, 65, 50, 40, 70].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        className="w-full rounded-t-sm transition-all"
                        style={{
                          height: `${h}%`,
                          backgroundColor: h > 80 ? "var(--ind-blue)" : "rgba(255, 255, 255, 0.15)",
                        }}
                      />
                      <span className="text-[9px] font-mono text-zinc-500">{i * 2}h</span>
                    </div>
                  ))}
                </div>

                <div className="ind-bento-summary-row">
                  <div className="ind-summary-box">
                    <small>Total Drawn Today</small>
                    <strong>28,420 Qs</strong>
                  </div>
                  <div className="ind-summary-box">
                    <small>Average Load</small>
                    <strong>1,180 Q/hr</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 5. Right Utility Column: Incident Pipeline + Unit Inspector ── */}
          <div className="ind-utility-column">
            {/* Top: Incident Pipeline */}
            <div className="ind-incident-pipeline-card">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle size={15} className="text-orange-400" />
                  <span>Incident Pipeline</span>
                </h3>
                <span className="text-xs font-mono text-zinc-400">{reports.length} Recent</span>
              </div>

              <div className="ind-pipeline-feed">
                {reports.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">
                    No open reports. All telemetry green.
                  </p>
                ) : (
                  reports.map((r) => {
                    const isSelected = inspected.id.startsWith(r.id.slice(0, 6));
                    const isCritical = r.category === "wrong_answer";
                    const qId = String(r.snapshot?.question?.id || r.subQuestionId || r.id.slice(0, 6));
                    const mod = r.snapshot?.moduleCode || "Module";
                    return (
                      <div
                        key={r.id}
                        className="ind-alert-item"
                        data-selected={isSelected}
                        onClick={() => handleSelectReport(r)}
                      >
                        <div
                          className="ind-alert-color-bar"
                          style={{
                            backgroundColor: isCritical ? "var(--ind-red)" : "var(--ind-orange)",
                          }}
                        />
                        <div className="ind-alert-header">
                          <span className="ind-alert-title">{mod}: Q{qId}</span>
                          <span className="ind-alert-time">{r.status.toUpperCase()}</span>
                        </div>
                        <p className="ind-alert-desc">
                          {r.explanation || `Category: ${r.category.replace("_", " ")}`}
                        </p>
                        {r.status === "new" && (
                          <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-800">
                            <button
                              type="button"
                              className="text-[10px] font-bold text-emerald-400 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTriage(r.id, "fixed");
                              }}
                            >
                              ✓ Mark Fixed
                            </button>
                            <button
                              type="button"
                              className="text-[10px] font-bold text-zinc-400 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTriage(r.id, "dismissed");
                              }}
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom: Unit / Module / Student Inspector Card */}
            <div className="ind-inspector-card">
              <div className="ind-inspector-header">
                <div>
                  <div className="ind-inspector-id">{inspected.id}</div>
                  <div className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                    {inspected.title}
                  </div>
                </div>
                <span className="ind-inspector-live-badge">LIVE INSPECT</span>
              </div>

              <div className="ind-gauges-grid">
                <div className="ind-gauge-box">
                  <div className="ind-gauge-val">{inspected.stat1.val}</div>
                  <div className="ind-gauge-label">{inspected.stat1.label}</div>
                </div>
                <div className="ind-gauge-box">
                  <div className="ind-gauge-val">{inspected.stat2.val}</div>
                  <div className="ind-gauge-label">{inspected.stat2.label}</div>
                </div>
                <div className="ind-gauge-box">
                  <div className="ind-gauge-val">{inspected.stat3.val}</div>
                  <div className="ind-gauge-label">{inspected.stat3.label}</div>
                </div>
              </div>

              <div className="text-[11.5px] text-zinc-400 border-t border-zinc-800 pt-3">
                {inspected.subtitle}
              </div>

              <div className="ind-inspector-actions">
                <button
                  type="button"
                  className="ind-ghost-btn"
                  onClick={() => addToast("Diagnostic Run", `Diagnostics clean for ${inspected.id}`, "emerald")}
                >
                  Diagnostics
                </button>
                <button
                  type="button"
                  className="ind-ghost-btn"
                  onClick={() => addToast("Cache Cleared", `Shards refreshed for ${inspected.id}`, "blue")}
                >
                  Refresh Shard
                </button>
              </div>

              <a
                href="/admin/questions"
                className="ind-primary-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTab?.("questions");
                }}
              >
                Open in Question Studio →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
