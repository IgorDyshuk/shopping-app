import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CategorySkeleton } from "@/components/layout/skeletons/CategorySkeleton";

export function BloggerSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-55 sm:h-90 md:h-110 w-full">
            <Skeleton className="h-full w-full" />
            <div className="absolute bottom-3 left-3 flex flex-col gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="px-1 border-none py-3 sm:py-5">
        <CardContent className="px-0 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-9 w-24 rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>

      <CategorySkeleton />
    </div>
  );
}
