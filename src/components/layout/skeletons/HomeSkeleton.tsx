import { Skeleton } from "@/components/ui/skeleton";

const ROW_CARD_COUNT = 6;
const HERO_CARD_COUNT_DESKTOP = 2;
const HERO_CARD_COUNT_MOBILE = 1;

export function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16">
      {/* Hero bloggers carousel */}
      <div className="space-y-3">
        <div className="flex w-full  overflow-x-auto gap-3 sm:gap-4 pb-2">
          {Array.from({ length: HERO_CARD_COUNT_MOBILE }).map((_, idx) => (
            <div
              key={idx}
              className="h-45 sm:h-60 md:h-70 lg:h-90 rounded-2xl border bg-card shadow-sm overflow-hidden flex-1"
            >
              <Skeleton className="h-52 sm:h-60 md:h-72 w-full" />
              <div className=" p-4 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
          <div className="hidden md:flex w-full  overflow-x-auto gap-3 sm:gap-4">
            {Array.from({ length: HERO_CARD_COUNT_DESKTOP }).map((_, idx) => (
              <div
                key={idx}
                className="h-45 sm:h-60 md:h-70 lg:h-90 rounded-2xl border bg-card shadow-sm overflow-hidden flex-1"
              >
                <Skeleton className="h-52 sm:h-60 md:h-72 w-full" />
                <div className=" p-4 space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New arrivals */}
      <div className="space-y-3">
        <Skeleton className="h-7 w-32" />
        <div className="flex overflow-x-auto gap-3 pb-2 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 md:overflow-visible">
          {Array.from({ length: ROW_CARD_COUNT + 2 }).map((_, idx) => (
            <div
              key={idx}
              className="min-w-[210px] sm:min-w-60 md:min-w-0 rounded-xl border bg-card p-3 sm:p-4 flex flex-col gap-3"
            >
              <Skeleton className="h-36 sm:h-44 md:h-48 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Popular bloggers */}
      <div className="space-y-3">
        <Skeleton className="h-7 w-36" />
        <div className="flex overflow-x-auto gap-3 pb-2 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 md:overflow-visible">
          {Array.from({ length: ROW_CARD_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className="min-w-[200px] sm:min-w-[230px] md:min-w-0 rounded-xl border bg-card overflow-hidden"
            >
              <Skeleton className="h-40 sm:h-48 md:h-56 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generic product rows */}
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <Skeleton className="h-7 w-28" />
          <div className="flex overflow-x-auto gap-3 pb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
            {Array.from({ length: ROW_CARD_COUNT }).map((__, cardIndex) => (
              <div
                key={cardIndex}
                className="min-w-[200px] sm:min-w-[220px] md:min-w-0 rounded-lg border bg-card p-3 sm:p-4 flex flex-col gap-3"
              >
                <Skeleton className="h-32 sm:h-38 md:h-44 w-full rounded" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
