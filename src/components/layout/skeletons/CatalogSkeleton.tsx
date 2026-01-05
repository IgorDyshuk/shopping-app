import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 4;
// Maximum cards we ever render (2xl and up).
const MAX_CARDS = 5;

export function CatalogSkeleton() {
  const visibilityByIndex = [
    "flex", // always visible
    "flex", // always visible
    "hidden md:flex", // show from md (>=768px)
    "hidden xl:flex", // show from xl (>=1280px)
    "hidden 2xl:flex", // show from 2xl (>=1536px)
  ];

  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
      {/* Sections */}
      {Array.from({ length: ROWS }).map((_, idx) => (
        <div key={idx} className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <div className="hidden sm:flex gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: MAX_CARDS }).map((__, cardIdx) => (
              <div key={cardIdx} className={visibilityByIndex[cardIdx]}>
                <div className="flex h-full flex-col gap-3 rounded-lg border bg-card p-3 sm:p-4 w-full">
                  <Skeleton className="h-60 sm:h-51 md:h-57 lg:h-63 xl:h-69 2xl:h-75 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
