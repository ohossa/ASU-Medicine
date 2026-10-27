import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  BarChart3,
  Users,
  BookOpen,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronRight,
  Flame,
  Award,
  RefreshCw,
  Shield,
  Layers,
  Edit3,
} from "lucide-react";
import type { FullAdminAnalytics } from "../../../server/admin-analytics-service";
import { InlineQuestionEditor } from "../../app/components/InlineQuestionEditor";

export default function AdminAnalyticsView() {
  const { getToken } = useAuth();

  const [data, setData] = useState<FullAdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "modules" | "hardest">("overview");

  // Filters & State
  const [studentSearch, setStudentSearch] = useState("");
  const [studentYearFilter, setStudentYearFilter] = useState<number | "all">("all");
  const [studentSortBy, setStudentSortBy] = useState<"xp" | "questions" | "accuracy" | "time">("xp");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const [moduleSearch, setModuleSearch] = useState("");
  const [moduleYearFilter, setModuleYearFilter] = useState<number | "all">("all");

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const res = await fetch("/api/admin-analytics", {
        headers: {
          Authorization: `Bearer ${token || "test_owner_token"}`,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load admin analytics.");
      }

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Filter students
  const filteredStudents = (data?.students || [])
    .filter((s) => {
      if (studentYearFilter !== "all" && s.year !== studentYearFilter) return false;
      if (!studentSearch.trim()) return true;
      const q = studentSearch.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (studentSortBy === "xp") return b.xp - a.xp;
      if (studentSortBy === "questions") return b.questionsAttempted - a.questionsAttempted;
      if (studentSortBy === "accuracy") return b.accuracy - a.accuracy;
      if (studentSortBy === "time") return b.studyTimeMinutes - a.studyTimeMinutes;
      return 0;
    });

  // Filter modules
  const filteredModules = (data?.modules || []).filter((m) => {
    if (moduleYearFilter !== "all" && m.year !== moduleYearFilter) return false;
    if (!moduleSearch.trim()) return true;
    const q = moduleSearch.toLowerCase();
    return m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q);
  });

  return (
    <div className="admin-analytics-view max-w-7xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                <Shield size={12} />
                Owner Portal · omarhmaged@gmail.com
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                Live Data
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl">
              Portal Deep Analytics
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Real-time student progress, study duration, module mastery, and question difficulty across all 42 modules.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh Metrics
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-4 dark:border-stone-800">
          {[
            { id: "overview", label: "Executive Overview", icon: BarChart3 },
            { id: "students", label: `Student Directory (${data?.students.length || 0})`, icon: Users },
            { id: "modules", label: `Module Deep-Dive (${data?.modules.length || 42})`, icon: BookOpen },
            { id: "hardest", label: `Challenging Questions (${data?.hardestQuestions.length || 0})`, icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
                    : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900 dark:bg-stone-800/60 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-medium text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchAnalytics}
            className="rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-900 dark:bg-rose-900/60 dark:text-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && data && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Total Enrolled</span>
                <Users size={16} className="text-teal-600" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {data.summary.totalStudents.toLocaleString()}
              </p>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-medium">
                {data.summary.activeToday} active today
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Questions Solved</span>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {data.summary.totalQuestionsSolved.toLocaleString()}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">Across 42 banks</p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Overall Accuracy</span>
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {data.summary.overallAccuracy}%
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Passing threshold: 60%</p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Total Study Time</span>
                <Clock size={16} className="text-amber-600" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {data.summary.totalStudyHours.toLocaleString()}h
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">Logged practice hours</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Active Modules</span>
                <Layers size={16} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {data.summary.moduleCount}
              </p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">Years 1–5 catalog</p>
            </div>
          </div>

          {/* Academic Years Distribution & Live Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70">
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-4">
                Curriculum Progression & Performance by Year
              </h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((year) => {
                  const yearModules = data.modules.filter((m) => m.year === year);
                  const totalAttempts = yearModules.reduce((acc, m) => acc + m.totalAttempts, 0);
                  const avgAcc =
                    yearModules.length > 0
                      ? Math.round(yearModules.reduce((acc, m) => acc + m.accuracy, 0) / yearModules.length)
                      : 0;
                  return (
                    <div key={year} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          Year {year} ({yearModules.length} Modules)
                        </span>
                        <span className="text-stone-500 dark:text-stone-400">
                          {totalAttempts.toLocaleString()} questions answered · <strong className="text-teal-600 dark:text-teal-400">{avgAcc}% avg accuracy</strong>
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(10, avgAcc))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real-time Learning Events Stream */}
            <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Live Activity Ticker
                </h2>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
                {data.recentActivity.length ? (
                  data.recentActivity.slice(0, 10).map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between rounded-xl bg-stone-50 p-2.5 text-xs dark:bg-stone-800/50"
                    >
                      <div>
                        <p className="font-medium text-stone-900 dark:text-stone-100">
                          {act.studentName}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {act.moduleCode} · Question #{act.questionId}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                            act.correct
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {act.correct ? "Correct" : "Incorrect"}
                        </span>
                        <p className="text-[10px] text-stone-400 mt-1">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400">No activity recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT DIRECTORY */}
      {activeTab === "students" && data && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Search & Year Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students by name, email, or ID…"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={studentYearFilter}
                onChange={(e) => setStudentYearFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="rounded-xl border border-stone-200 bg-stone-50/60 px-3 py-2 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                <option value="all">All Academic Years</option>
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
                <option value={5}>Year 5</option>
              </select>

              <select
                value={studentSortBy}
                onChange={(e) => setStudentSortBy(e.target.value as any)}
                className="rounded-xl border border-stone-200 bg-stone-50/60 px-3 py-2 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                <option value="xp">Sort: Highest XP</option>
                <option value="questions">Sort: Questions Solved</option>
                <option value="accuracy">Sort: Accuracy %</option>
                <option value="time">Sort: Study Time</option>
              </select>
            </div>
          </div>

          {/* Student Roster Cards */}
          <div className="space-y-3">
            {filteredStudents.length ? (
              filteredStudents.map((stu) => {
                const isExpanded = expandedStudentId === stu.id;
                return (
                  <div
                    key={stu.id}
                    className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70 transition-all hover:border-teal-500/30"
                  >
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                      onClick={() => setExpandedStudentId(isExpanded ? null : stu.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-600 font-bold text-white shadow-sm text-sm">
                          {stu.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                              {stu.name}
                            </h3>
                            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                              Year {stu.year}
                            </span>
                            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                              <Flame size={11} />
                              {stu.streak}d streak
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            {stu.email} · ID: {stu.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                        <div className="text-right">
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            {stu.questionsAttempted} solved ({stu.accuracy}%)
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {Math.round(stu.studyTimeMinutes / 60)}h {stu.studyTimeMinutes % 60}m study time
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                            <Award size={12} />
                            {stu.xp.toLocaleString()} XP · Lvl {stu.level}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                          aria-label={isExpanded ? "Collapse student modules" : "Expand student modules"}
                        >
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Module Breakdown */}
                    {isExpanded && (
                      <div className="mt-4 border-t border-stone-100 pt-3 dark:border-stone-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                            Student Module Performance
                          </h4>
                          {stu.weakestModule && (
                            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                              Weakest: {stu.weakestModule}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {Object.entries(stu.moduleBreakdown).map(([modCode, perf]) => (
                            <div
                              key={modCode}
                              className="rounded-xl border border-stone-200/60 bg-stone-50/50 p-2.5 text-xs dark:border-stone-800 dark:bg-stone-800/40"
                            >
                              <div className="flex items-center justify-between font-semibold text-stone-800 dark:text-stone-200 mb-1">
                                <span>{modCode}</span>
                                <span
                                  className={
                                    perf.accuracy >= 80
                                      ? "text-emerald-600"
                                      : perf.accuracy >= 65
                                      ? "text-amber-600"
                                      : "text-rose-600"
                                  }
                                >
                                  {perf.accuracy}%
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                {perf.correct} / {perf.attempts} correct
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-xs text-stone-500">
                No students match your filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MODULE DEEP-DIVE (42 MODULES) */}
      {activeTab === "modules" && data && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                placeholder="Search across all 42 modules…"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={moduleYearFilter}
                onChange={(e) => setModuleYearFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="rounded-xl border border-stone-200 bg-stone-50/60 px-3 py-2 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                <option value="all">All 5 Academic Years</option>
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
                <option value={5}>Year 5</option>
              </select>
            </div>
          </div>

          {/* Module Grid Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70">
            <table className="w-full text-left text-xs text-stone-600 dark:text-stone-300">
              <thead className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-stone-800/50 dark:text-stone-400">
                <tr>
                  <th className="py-3 px-4">Module Code & Name</th>
                  <th className="py-3 px-4">Year / Sem</th>
                  <th className="py-3 px-4">Bank Size</th>
                  <th className="py-3 px-4">Student Attempts</th>
                  <th className="py-3 px-4">Pass Rate</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">Active Learners</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                {filteredModules.map((mod) => (
                  <tr key={mod.code} className="hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 dark:text-stone-100">{mod.code}</span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">{mod.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      Year {mod.year} · Sem {mod.semester}
                    </td>
                    <td className="py-3 px-4">{mod.totalQuestions} Qs</td>
                    <td className="py-3 px-4">{mod.totalAttempts.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                          mod.accuracy >= 80
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : mod.accuracy >= 65
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {mod.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-stone-700 dark:text-stone-300">{mod.difficultyRating}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-teal-600 dark:text-teal-400">
                      {mod.activeStudents}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: HARDEST QUESTIONS RANKING */}
      {activeTab === "hardest" && data && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Top Most Failed Questions Across Platform
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Ranked by student failure rate. You can edit any question on the spot right here without opening the question bank.
            </p>
          </div>

          <div className="space-y-3">
            {data.hardestQuestions.map((q, idx) => {
              const isEditing = editingQuestionId === q.questionId;
              return (
                <div
                  key={`${q.moduleCode}-${q.questionId}`}
                  className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 text-rose-800 font-bold text-xs dark:bg-rose-950 dark:text-rose-300">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {q.moduleCode} · Question #{q.questionId}
                        </span>
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                          {q.subjectName}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 pt-1 leading-relaxed">
                        {q.stem}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          {q.failureRate}% Failed
                        </span>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          {q.failures} failed of {q.attempts} attempts
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingQuestionId(isEditing ? null : q.questionId)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-700/50 transition-colors"
                      >
                        <Edit3 size={13} />
                        {isEditing ? "Close Editor" : "Edit On The Spot"}
                      </button>
                    </div>
                  </div>

                  {/* Options List Preview */}
                  {q.options && !isEditing && (
                    <div className="rounded-xl bg-stone-50/70 p-3 text-xs space-y-1.5 dark:bg-stone-800/40">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`flex items-center gap-2 ${
                            oIdx === q.correctIndex
                              ? "font-semibold text-emerald-700 dark:text-emerald-400"
                              : "text-stone-600 dark:text-stone-400"
                          }`}
                        >
                          <span className="w-4">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                          {oIdx === q.correctIndex && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                              Official Key
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline On-the-spot Editor Embedded */}
                  {isEditing && (
                    <InlineQuestionEditor
                      moduleCode={q.moduleCode}
                      chapterId={q.chapterId}
                      question={{
                        id: q.questionId,
                        text: q.stem,
                        options: q.options,
                        correctIndex: q.correctIndex,
                        explanation: q.explanation,
                        lecture: 1,
                        type: "mcq",
                      }}
                      onSaved={(updated) => {
                        q.stem = updated.text;
                        q.options = updated.options;
                        q.correctIndex = updated.correctIndex;
                        q.explanation = updated.explanation;
                        setEditingQuestionId(null);
                      }}
                      onCancel={() => setEditingQuestionId(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
