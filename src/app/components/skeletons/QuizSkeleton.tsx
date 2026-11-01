import { Skeleton } from "./ShimmerSkeleton";

export function QuizSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6 animate-fade-in">
      {/* Top Header / Progress Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-20" rounded="xl" />
          <Skeleton className="h-5 w-32" rounded="md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" rounded="xl" />
          <Skeleton className="h-9 w-9" rounded="xl" />
        </div>
      </div>

      {/* Progress Bar Skeleton */}
      <Skeleton className="h-2 w-full" rounded="full" />

      {/* Question Card Skeleton */}
      <div className="rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#12131a]/80 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Question Metadata */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" rounded="md" />
          <Skeleton className="h-5 w-16" rounded="md" />
        </div>

        {/* Question Stem (3 lines) */}
        <div className="space-y-2.5">
          <Skeleton className="h-5 w-full" rounded="md" />
          <Skeleton className="h-5 w-5/6" rounded="md" />
          <Skeleton className="h-5 w-2/3" rounded="md" />
        </div>

        {/* 4 MCQ Option Skeletons */}
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-gray-200/80 dark:border-white/[0.07] bg-gray-50/50 dark:bg-white/[0.02] p-4 min-h-[56px]"
            >
              <Skeleton className="h-7 w-7 shrink-0" rounded="full" />
              <Skeleton className="h-4 w-3/4" rounded="md" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav Buttons Skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-11 w-28" rounded="xl" />
        <Skeleton className="h-11 w-28" rounded="xl" />
      </div>
    </div>
  );
}
