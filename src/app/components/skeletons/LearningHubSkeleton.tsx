import { Skeleton } from "./ShimmerSkeleton";

export function LearningHubSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8 animate-fade-in">
      {/* Top Profile / Hero Skeleton */}
      <div className="rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#12131a]/80 p-6 sm:p-8 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16" rounded="2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-44" rounded="md" />
              <Skeleton className="h-4 w-32" rounded="md" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28" rounded="xl" />
            <Skeleton className="h-10 w-28" rounded="xl" />
          </div>
        </div>

        {/* Level XP Bar Placeholder */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" rounded="md" />
            <Skeleton className="h-4 w-16" rounded="md" />
          </div>
          <Skeleton className="h-3 w-full" rounded="full" />
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#12131a]/80 p-5 space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" rounded="md" />
              <Skeleton className="h-8 w-8" rounded="lg" />
            </div>
            <Skeleton className="h-8 w-16" rounded="lg" />
            <Skeleton className="h-3 w-32" rounded="md" />
          </div>
        ))}
      </div>

      {/* Tabs Placeholder */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-white/[0.08] pb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-24" rounded="xl" />
        ))}
      </div>

      {/* Content / Table Placeholder */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#12131a]/80 p-6 space-y-4 shadow-sm">
        <Skeleton className="h-6 w-48 mb-4" rounded="md" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8" rounded="full" />
              <Skeleton className="h-4 w-40" rounded="md" />
            </div>
            <Skeleton className="h-4 w-20" rounded="md" />
          </div>
        ))}
      </div>
    </div>
  );
}
