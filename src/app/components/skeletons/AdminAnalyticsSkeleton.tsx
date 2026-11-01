import { Skeleton } from "./ShimmerSkeleton";

export function AdminAnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-fade-in">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" rounded="lg" />
          <Skeleton className="h-4 w-80" rounded="md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28" rounded="xl" />
          <Skeleton className="h-10 w-28" rounded="xl" />
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#12131a]/80 p-5 space-y-3 shadow-sm"
          >
            <Skeleton className="h-4 w-20" rounded="md" />
            <Skeleton className="h-8 w-16" rounded="lg" />
            <Skeleton className="h-3 w-28" rounded="md" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-11 w-full sm:w-80" rounded="xl" />
        <Skeleton className="h-11 w-36" rounded="xl" />
        <Skeleton className="h-11 w-36" rounded="xl" />
      </div>

      {/* Master Table Skeleton */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#12131a]/80 p-6 space-y-4 shadow-sm">
        <Skeleton className="h-6 w-48 mb-2" rounded="md" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9" rounded="full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36" rounded="md" />
                  <Skeleton className="h-3 w-48" rounded="md" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Skeleton className="h-4 w-16" rounded="md" />
                <Skeleton className="h-4 w-16" rounded="md" />
                <Skeleton className="h-7 w-20" rounded="lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
