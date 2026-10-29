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
  Trophy,
  Crown,
  Target,
  Mail,
  X,
} from "lucide-react";
import type { FullAdminAnalytics, StudentAnalytics } from "../../../server/admin-analytics-service";
import { InlineQuestionEditor } from "../../app/components/InlineQuestionEditor";
import { StudentEmailReplyModal } from "../../app/components/StudentEmailReplyModal";

export default function AdminAnalyticsView() {
  const { getToken } = useAuth();

  const [data, setData] = useState<FullAdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "modules" | "hardest">("overview");

  // Filters & State
  const [studentSearch, setStudentSearch] = useState("");
  const [studentYearFilter, setStudentYearFilter] = useState<number | "all">("all");
  const [studentSortBy, setStudentSortBy] = useState<"xp" | "questions" | "accuracy" | "time" | "streak">("xp");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [emailModalStudent, setEmailModalStudent] = useState<StudentAnalytics | null>(null);
  const [onlineOnlyFilter, setOnlineOnlyFilter] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

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

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter & Rank students dynamically
  const filteredStudents = (data?.students || [])
    .filter((s) => {
      if (onlineOnlyFilter && !s.isOnline) return false;
      if (studentYearFilter !== "all" && s.year !== studentYearFilter) return false;
      if (!studentSearch.trim()) return true;
      const q = studentSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (studentSortBy === "xp") return b.xp - a.xp;
      if (studentSortBy === "questions") return b.questionsAttempted - a.questionsAttempted;
      if (studentSortBy === "accuracy") return b.accuracy - a.accuracy;
      if (studentSortBy === "time") return b.studyTimeMinutes - a.studyTimeMinutes;
      if (studentSortBy === "streak") return b.streak - a.streak;
      return 0;
    });

  const getMetricCallout = (stu: StudentAnalytics) => {
    switch (studentSortBy) {
      case "xp":
        return {
          primary: `${stu.xp.toLocaleString()} XP`,
          secondary: `Level ${stu.level} Scholar`,
          label: "Total XP",
          icon: Award,
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60",
        };
      case "questions":
        return {
          primary: `${stu.questionsAttempted.toLocaleString()} Solved`,
          secondary: `${stu.accuracy}% Accuracy Rate`,
          label: "Questions Solved",
          icon: Target,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/60",
        };
      case "accuracy":
        return {
          primary: `${stu.accuracy}% Accuracy`,
          secondary: `${stu.questionsCorrect}/${stu.questionsAttempted} Correct`,
          label: "Accuracy",
          icon: CheckCircle2,
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60",
        };
      case "time":
        return {
          primary: `${Math.round(stu.studyTimeMinutes / 60)}h ${stu.studyTimeMinutes % 60}m`,
          secondary: "Logged Study Time",
          label: "Study Duration",
          icon: Clock,
          color: "text-purple-600 dark:text-purple-400",
          bgColor: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60",
        };
      case "streak":
        return {
          primary: `${stu.streak} Days 🔥`,
          secondary: `Best: ${stu.bestStreak}d streak`,
          label: "Active Streak",
          icon: Flame,
          color: "text-rose-600 dark:text-rose-400",
          bgColor: "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60",
        };
    }
  };

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

          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                autoRefresh
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm"
                  : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-stone-400"}`} />
              {autoRefresh ? "Live Presence (15s)" : "Auto-Refresh Off"}
            </button>

            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 transition-colors"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-4 dark:border-stone-800">
          {[
            { id: "overview", label: "Executive Overview", icon: BarChart3 },
            { id: "students", label: `Master Leaderboard (${data?.students.length || 0})`, icon: Trophy },
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

      {/* Error state banner */}
      {error && data && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-medium text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchAnalytics}
            className="rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-900 dark:bg-rose-900/60 dark:text-rose-100 min-h-[44px]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl border border-stone-200/80 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-800/40"
              />
            ))}
          </div>
          <div className="h-64 rounded-2xl border border-stone-200/80 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-800/40" />
        </div>
      )}

      {/* Authentication / Empty State when data is not loaded */}
      {!loading && !data && (
        <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-8 text-center shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80 space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            <Shield size={24} />
          </div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Portal Deep Analytics
          </h2>
          <p className="max-w-md mx-auto text-xs text-stone-500 dark:text-stone-400">
            {error ||
              "Sign in with the verified administrator account (omarhmaged@gmail.com) to view live student cohorts, mastery telemetry, and failure distributions."}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={fetchAnalytics}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors min-h-[44px]"
            >
              <RefreshCw size={13} />
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && data && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-50/70 p-4 shadow-sm backdrop-blur-md dark:border-emerald-500/30 dark:bg-emerald-950/40 ring-1 ring-emerald-500/20">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Online Now
                </span>
                <Users size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
                {data.summary.onlineNow ?? 1}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
                Active in last 5m
              </p>
            </div>

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

            <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/60">
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

      {/* TAB 2: EXCLUSIVE ADMIN MASTER LEADERBOARD & DIRECTORY */}
      {activeTab === "students" && data && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Command Control Bar: Sorting Segmented Pills & Search */}
          <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/50">
                    <Trophy size={13} className="text-amber-600 dark:text-amber-400" />
                    Admin Master Leaderboard
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {data.students.length} Accounts Enrolled
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-2xl">
                  Real-Time Student Rankings & Mastery
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Dynamic rankings based on selected metric, full individual module breakdowns, and direct student email outreach.
                </p>
              </div>

              {/* Dynamic Sort Metric Pills (Apple HIG Segmented Control) */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60 self-start lg:self-auto">
                {[
                  { id: "xp", label: "Total XP", icon: Award },
                  { id: "questions", label: "Questions Solved", icon: Target },
                  { id: "accuracy", label: "Accuracy %", icon: CheckCircle2 },
                  { id: "time", label: "Study Hours", icon: Clock },
                  { id: "streak", label: "Study Streak", icon: Flame },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = studentSortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStudentSortBy(opt.id as any)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold min-h-[44px] transition-all ${
                        active
                          ? "bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-stone-100"
                          : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                      }`}
                      aria-pressed={active}
                    >
                      <Icon size={14} className={active ? "text-teal-600 dark:text-teal-400" : ""} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search & Academic Year Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="search"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students by name, email, or account ID…"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/70 pl-9 pr-9 py-2.5 text-xs text-stone-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 min-h-[44px]"
                />
                {studentSearch && (
                  <button
                    type="button"
                    onClick={() => setStudentSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlineOnlyFilter(!onlineOnlyFilter)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold min-h-[44px] transition-all ${
                    onlineOnlyFilter
                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20"
                      : "border border-stone-200 bg-stone-50/70 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${onlineOnlyFilter ? "bg-white" : "bg-emerald-500 animate-pulse"}`} />
                  Online Only ({data.students.filter((s) => s.isOnline).length})
                </button>

                <select
                  value={studentYearFilter}
                  onChange={(e) => setStudentYearFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-2 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 min-h-[44px]"
                >
                  <option value="all">All Academic Years</option>
                  <option value={1}>Year 1 Cohort</option>
                  <option value={2}>Year 2 Cohort</option>
                  <option value={3}>Year 3 Cohort</option>
                  <option value={4}>Year 4 Cohort</option>
                  <option value={5}>Year 5 Cohort</option>
                </select>
              </div>
            </div>
          </div>

          {/* Top 3 Podium Showcase */}
          {filteredStudents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Crown size={14} className="text-amber-500" />
                  Current Top Performers
                </h3>
                <span className="text-xs text-stone-400">
                  Ranked by {studentSortBy === "xp" ? "Total XP" : studentSortBy === "questions" ? "Questions Solved" : studentSortBy === "accuracy" ? "Accuracy %" : studentSortBy === "time" ? "Study Time" : "Study Streak"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-3">
                {/* #2 Silver Contender */}
                {filteredStudents.length > 1 && (() => {
                  const stu = filteredStudents[1];
                  const callout = getMetricCallout(stu);
                  const CalloutIcon = callout.icon;
                  return (
                    <div
                      key={stu.id}
                      className="order-2 sm:order-1 relative flex flex-col justify-between rounded-3xl border border-slate-300/80 bg-gradient-to-b from-slate-200/40 via-slate-100/20 to-white/95 p-5 shadow-sm dark:border-slate-700 dark:from-slate-800/40 dark:via-stone-900/90 dark:to-stone-900 backdrop-blur-xl hover:border-slate-400 transition-all"
                    >
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-800 shadow-sm ring-2 ring-white dark:bg-slate-700 dark:text-slate-200 dark:ring-stone-900">
                        <span>🥈</span>
                        <span>#2 Contender</span>
                      </div>

                      <div className="pt-2 text-center">
                        <div className="relative inline-block mx-auto mb-2.5">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 font-black text-white text-lg shadow-sm">
                            {stu.name.slice(0, 2).toUpperCase()}
                          </div>
                          {stu.isOnline && (
                            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900 animate-pulse" title="Online now" />
                          )}
                        </div>

                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {stu.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {stu.email}
                        </p>

                        <div className="mt-3 rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-stone-800/60 border border-slate-200/50 dark:border-slate-700/50">
                          <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                            {callout.label}
                          </p>
                          <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5 flex items-center justify-center gap-1.5">
                            <CalloutIcon size={16} className="text-slate-500" />
                            {callout.primary}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {callout.secondary}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEmailModalStudent(stu)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white/90 py-2 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-stone-800 dark:text-slate-200 min-h-[44px] transition-colors"
                        >
                          <Mail size={13} />
                          Contact
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedStudentId(expandedStudentId === stu.id ? null : stu.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 py-2 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 min-h-[44px] transition-colors"
                        >
                          {expandedStudentId === stu.id ? "Close" : "Modules"}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* #1 Gold Champion */}
                {filteredStudents.length > 0 && (() => {
                  const stu = filteredStudents[0];
                  const callout = getMetricCallout(stu);
                  const CalloutIcon = callout.icon;
                  return (
                    <div
                      key={stu.id}
                      className="order-1 sm:order-2 sm:-translate-y-2 relative flex flex-col justify-between rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-400/20 via-amber-300/5 to-white/95 p-6 shadow-xl shadow-amber-500/10 ring-4 ring-amber-400/25 dark:border-amber-500/60 dark:from-amber-500/20 dark:via-stone-900/90 dark:to-stone-900 backdrop-blur-xl z-10"
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-1 text-xs font-black uppercase tracking-wider text-amber-950 shadow-md ring-2 ring-white dark:ring-stone-900">
                        <Crown size={14} className="fill-amber-950" />
                        <span>#1 Champion</span>
                      </div>

                      <div className="pt-2 text-center">
                        <div className="relative inline-block mx-auto mb-2.5">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 font-black text-amber-950 text-xl shadow-md ring-4 ring-amber-400/30">
                            {stu.name.slice(0, 2).toUpperCase()}
                          </div>
                          {stu.isOnline && (
                            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900 animate-pulse" title="Online now" />
                          )}
                        </div>

                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-base truncate">
                          {stu.name}
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                          {stu.email}
                        </p>

                        <div className="mt-3 rounded-2xl bg-amber-50/80 p-3.5 shadow-inner dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60">
                          <p className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 tracking-wider">
                            {callout.label} · Platform Leader
                          </p>
                          <p className="text-2xl font-black text-amber-950 dark:text-amber-200 mt-0.5 flex items-center justify-center gap-1.5">
                            <CalloutIcon size={20} className="text-amber-600 dark:text-amber-400" />
                            {callout.primary}
                          </p>
                          <p className="text-xs text-amber-800 dark:text-amber-400 mt-0.5 font-medium">
                            {callout.secondary}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-stone-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEmailModalStudent(stu)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-2 px-2 text-xs font-bold text-amber-950 shadow-sm hover:from-amber-600 hover:to-yellow-600 min-h-[44px] transition-all"
                        >
                          <Mail size={13} />
                          Recognize
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedStudentId(expandedStudentId === stu.id ? null : stu.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-amber-100/80 py-2 px-2 text-xs font-semibold text-amber-900 hover:bg-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 min-h-[44px] transition-colors"
                        >
                          {expandedStudentId === stu.id ? "Close" : "Inspect Modules"}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* #3 Bronze Achiever */}
                {filteredStudents.length > 2 && (() => {
                  const stu = filteredStudents[2];
                  const callout = getMetricCallout(stu);
                  const CalloutIcon = callout.icon;
                  return (
                    <div
                      key={stu.id}
                      className="order-3 sm:order-3 relative flex flex-col justify-between rounded-3xl border border-amber-700/30 bg-gradient-to-b from-amber-700/10 via-amber-700/5 to-white/95 p-5 shadow-sm dark:border-amber-800/40 dark:from-amber-950/20 dark:via-stone-900/90 dark:to-stone-900 backdrop-blur-xl hover:border-amber-700/50 transition-all"
                    >
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-900 shadow-sm ring-2 ring-white dark:bg-amber-900/60 dark:text-amber-200 dark:ring-stone-900">
                        <span>🥉</span>
                        <span>#3 Achiever</span>
                      </div>

                      <div className="pt-2 text-center">
                        <div className="relative inline-block mx-auto mb-2.5">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 font-black text-white text-lg shadow-sm">
                            {stu.name.slice(0, 2).toUpperCase()}
                          </div>
                          {stu.isOnline && (
                            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900 animate-pulse" title="Online now" />
                          )}
                        </div>

                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {stu.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {stu.email}
                        </p>

                        <div className="mt-3 rounded-2xl bg-white/80 p-3 shadow-inner dark:bg-stone-800/60 border border-amber-200/40 dark:border-amber-900/40">
                          <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                            {callout.label}
                          </p>
                          <p className="text-xl font-black text-amber-900 dark:text-amber-200 mt-0.5 flex items-center justify-center gap-1.5">
                            <CalloutIcon size={16} className="text-amber-700" />
                            {callout.primary}
                          </p>
                          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                            {callout.secondary}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEmailModalStudent(stu)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white/90 py-2 px-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 min-h-[44px] transition-colors"
                        >
                          <Mail size={13} />
                          Contact
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedStudentId(expandedStudentId === stu.id ? null : stu.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-stone-100 py-2 px-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 min-h-[44px] transition-colors"
                        >
                          {expandedStudentId === stu.id ? "Close" : "Modules"}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Complete Ranked Roster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                All Ranked Accounts ({filteredStudents.length})
              </h3>
              <span className="text-xs text-stone-400">
                Showing all registered users & study metrics
              </span>
            </div>

            {filteredStudents.length ? (
              filteredStudents.map((stu, idx) => {
                const isExpanded = expandedStudentId === stu.id;
                const rank = idx + 1;
                const callout = getMetricCallout(stu);
                const CalloutIcon = callout.icon;

                return (
                  <div
                    key={stu.id}
                    className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70 transition-all hover:border-teal-500/40"
                  >
                    <div
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                      onClick={() => setExpandedStudentId(isExpanded ? null : stu.id)}
                    >
                      {/* Left: Rank Badge + Avatar + Student Identity */}
                      <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className="shrink-0 flex items-center justify-center">
                          {rank === 1 ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 font-black text-amber-950 text-sm shadow-sm ring-1 ring-amber-400/50">
                              🥇
                            </span>
                          ) : rank === 2 ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 font-black text-slate-900 text-sm shadow-sm ring-1 ring-slate-300">
                              🥈
                            </span>
                          ) : rank === 3 ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 font-black text-white text-sm shadow-sm ring-1 ring-amber-600/50">
                              🥉
                            </span>
                          ) : (
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 font-bold text-stone-600 dark:bg-stone-800 dark:text-stone-300 text-xs">
                              #{rank}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 font-bold text-white shadow-sm text-sm">
                            {stu.name.slice(0, 2).toUpperCase()}
                          </div>
                          {stu.isOnline && (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900 animate-pulse"
                              title="Online now"
                            />
                          )}
                        </div>

                        {/* Name & Academic Tags */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                              {stu.name}
                            </h4>
                            {stu.isOnline && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-500/30">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online{stu.activeModule ? ` · ${stu.activeModule}` : ""}
                              </span>
                            )}
                            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                              Year {stu.year}
                            </span>
                            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                              <Flame size={11} />
                              {stu.streak}d streak
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                            {stu.email} · <span className="font-mono text-[11px]">ID: {stu.id}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right: Dynamic Metric Display + Quick Stats + Expand Button */}
                      <div className="flex items-center justify-between md:justify-end gap-3 text-xs pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                        {/* Dynamic Highlight Metric Chip */}
                        <div className={`rounded-xl px-3 py-1.5 border text-right ${callout.bgColor}`}>
                          <p className={`font-bold flex items-center justify-end gap-1 ${callout.color}`}>
                            <CalloutIcon size={13} />
                            {callout.primary}
                          </p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400">
                            {callout.secondary}
                          </p>
                        </div>

                        {/* Core Stats Overview */}
                        <div className="text-right hidden sm:block">
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            {stu.questionsAttempted} solved ({stu.accuracy}%)
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {Math.round(stu.studyTimeMinutes / 60)}h {stu.studyTimeMinutes % 60}m study time
                          </p>
                        </div>

                        {/* XP Pill */}
                        <div className="text-right hidden lg:block">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/50">
                            <Award size={12} />
                            {stu.xp.toLocaleString()} XP · Lvl {stu.level}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEmailModalStudent(stu);
                            }}
                            className="flex items-center justify-center h-9 w-9 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors"
                            title={`Email ${stu.name}`}
                            aria-label={`Send direct email to ${stu.name}`}
                          >
                            <Mail size={15} />
                          </button>

                          <button
                            type="button"
                            className="flex items-center justify-center h-9 w-9 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                            aria-label={isExpanded ? "Collapse student modules" : "Expand student modules"}
                          >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Deep Module Breakdown */}
                    {isExpanded && (
                      <div className="mt-4 border-t border-stone-100 pt-4 dark:border-stone-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                              Curriculum Module Mastery · {stu.name}
                            </h5>
                            <p className="text-[11px] text-stone-400">
                              Breakdown of questions attempted, accuracy, and performance tier per module.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {stu.weakestModule && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                Weakest: {stu.weakestModule}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => setEmailModalStudent(stu)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm min-h-[36px]"
                            >
                              <Mail size={13} />
                              Send Guidance Email
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                          {Object.entries(stu.moduleBreakdown).map(([modCode, perf]) => (
                            <div
                              key={modCode}
                              className="rounded-xl border border-stone-200/70 bg-stone-50/60 p-3 text-xs dark:border-stone-800 dark:bg-stone-800/40"
                            >
                              <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200 mb-1">
                                <span>{modCode}</span>
                                <span
                                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                                    perf.accuracy >= 80
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                      : perf.accuracy >= 65
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                  }`}
                                >
                                  {perf.accuracy}%
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                {perf.correct} of {perf.attempts} correct
                              </p>
                              <div className="mt-1.5 h-1.5 w-full rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    perf.accuracy >= 80 ? "bg-emerald-500" : perf.accuracy >= 65 ? "bg-amber-500" : "bg-rose-500"
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(5, perf.accuracy))}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-xs text-stone-500 dark:border-stone-800 dark:bg-stone-900/60">
                No students match your search and filter criteria.
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

      {/* Student Email Modal (Outreach & Academic Recognition) */}
      <StudentEmailReplyModal
        isOpen={Boolean(emailModalStudent)}
        onClose={() => setEmailModalStudent(null)}
        studentEmail={emailModalStudent?.email || ""}
        studentName={emailModalStudent?.name}
      />
    </div>
  );
}
