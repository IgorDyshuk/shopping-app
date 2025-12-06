import { Skeleton } from "@/components/ui/skeleton";

const CARD_COUNT = 6;
const SECTION_COUNT = 3;

export function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20">
      {Array.from({ length: SECTION_COUNT }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4 md:space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-32" />
            <div className="hidden gap-2 sm:flex">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: CARD_COUNT }).map((__, cardIndex) => (
              <div
                key={cardIndex}
                className="flex h-full flex-col gap-3 rounded-lg border bg-card p-3 sm:p-4"
              >
                <Skeleton className="aspect-square w-full rounded-md bg-white" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/12" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
