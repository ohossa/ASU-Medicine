import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

/**
 * Apple HIG-compliant skeleton primitive.
 * Provides a subtle, hardware-accelerated shimmering gradient placeholder.
 * Works seamlessly across semantic light and dark themes.
 */
export function Skeleton({
  className = "",
  rounded = "lg",
  ...props
}: SkeletonProps) {
  const roundedClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      role="status"
      aria-label="Loading content…"
      className={`relative overflow-hidden bg-gray-200/70 dark:bg-white/[0.06] ${roundedClass} ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/[0.08] to-transparent animate-[shimmer_1.6s_infinite]"
        style={{ transform: "translateZ(0)" }}
      />
    </div>
  );
}
