import { Skeleton } from "@/components/ui/skeleton";

const GRID_ITEMS = 10;

export function CategorySkeleton() {
  return (
    <div className="flex flex-col gap-6 my-7">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr] lg:gap-8 items-start">
        {/* Sidebar filters visible from md and up */}
        <div className="hidden md:flex h-fit flex-col gap-3 rounded-lg border bg-card p-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-5 w-28 mt-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: GRID_ITEMS }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 rounded-lg bg-card p-3 sm:p-4"
            >
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
