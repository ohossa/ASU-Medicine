import { useEffect } from 'react';
import './loading-screen.css';

interface LoadingScreenProps {
  isLoading?: boolean;
  progress?: number;
  label?: string;
  onComplete?: () => void;
  compact?: boolean;
}

export default function LoadingScreen({
  isLoading = true,
  label = 'Preparing your medical workspace…',
  onComplete,
  compact = false,
}: LoadingScreenProps) {
  useEffect(() => {
    if (!isLoading) onComplete?.();
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="study-loading study-loading--route"
      >
        <div className="shimmer-compact-card">
          <div className="shimmer-brand-mini">
            <span className="shimmer-pulse-node" aria-hidden="true" />
            <span className="shimmer-brand-text">ASU Medicine</span>
          </div>
          <p className="shimmer-label">{label}</p>
          <div className="shimmer-bar" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="study-loading study-loading--entry"
    >
      {/* Background ambient lighting */}
      <div className="shimmer-ambient-mesh" aria-hidden="true" />

      {/* Top Navbar Skeleton */}
      <header className="shimmer-topbar">
        <div className="shimmer-brand">
          <div className="shimmer-monogram" aria-hidden="true">
            <span>ASU</span>
            <svg
              width="18"
              height="10"
              viewBox="0 0 20 12"
              fill="none"
              className="shimmer-ecg"
            >
              <path
                d="M1 6H5L7 1L9 11L12 3L14 8L16 6H19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="shimmer-title-wrap">
            <span className="shimmer-app-title">ASU Medicine</span>
            <span className="shimmer-app-sub">Faculty of Medicine</span>
          </div>
        </div>
        <div className="shimmer-nav-items">
          <div className="shimmer-pill-ghost" />
          <div className="shimmer-pill-ghost" />
          <div className="shimmer-circle-pfp" />
        </div>
      </header>

      {/* Main Workspace Skeleton */}
      <main className="shimmer-workspace-body">
        {/* Status notice */}
        <div className="shimmer-status-pill">
          <span className="shimmer-live-dot" aria-hidden="true" />
          <p className="shimmer-label-main">{label}</p>
        </div>

        {/* Hero Banner Skeleton */}
        <div className="shimmer-card shimmer-hero">
          <div className="shimmer-line shimmer-line-w40" />
          <div className="shimmer-line shimmer-line-w70" />
          <div className="shimmer-line shimmer-line-w50" />
          <div className="shimmer-hero-actions">
            <div className="shimmer-btn-placeholder" />
            <div className="shimmer-btn-placeholder-outline" />
          </div>
        </div>

        {/* Module / Metric Cards Grid Skeleton */}
        <div className="shimmer-grid">
          <div className="shimmer-card shimmer-col">
            <div className="shimmer-line shimmer-line-w50" />
            <div className="shimmer-line shimmer-line-w90" />
            <div className="shimmer-line shimmer-line-w60" />
          </div>
          <div className="shimmer-card shimmer-col">
            <div className="shimmer-line shimmer-line-w50" />
            <div className="shimmer-line shimmer-line-w90" />
            <div className="shimmer-line shimmer-line-w60" />
          </div>
          <div className="shimmer-card shimmer-col">
            <div className="shimmer-line shimmer-line-w50" />
            <div className="shimmer-line shimmer-line-w90" />
            <div className="shimmer-line shimmer-line-w60" />
          </div>
        </div>
      </main>
    </div>
  );
}
