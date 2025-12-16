import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const THUMB_COUNT = 5;
const SIZE_COUNT = 6;
const ACCORDION_COUNT = 3;
const CHARACTERISTICS_COUNT = 5;

export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-10 mt-6">
      <div className="grid w-full gap-2 lg:grid-cols-2 items-start">
        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-80 sm:h-[420px] w-full rounded-lg" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: THUMB_COUNT }).map((_, idx) => (
                <Skeleton key={idx} className="h-12 w-12 rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Card className="p-4">
            <CardContent className="w-full px-0 flex flex-col gap-5">
              <Skeleton className="h-6 w-4/5" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-14" />
              </div>
            </CardContent>
          </Card>

          <Card className="py-6">
            <CardContent className="w-full px-0 flex flex-col gap-5">
              <div className="flex items-center justify-between px-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-5" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="px-4 flex flex-wrap items-center gap-5">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-28 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardContent className="px-0 flex flex-col gap-5">
              <Skeleton className="h-4 w-14" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: SIZE_COUNT }).map((_, idx) => (
                  <Skeleton key={idx} className="h-9 w-16 rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="px-4 py-0">
            <CardContent className="px-0">
              {Array.from({ length: ACCORDION_COUNT }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-3 py-4 border-b last:border-b-0"
                >
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Card className="p-4">
          <CardContent className="px-0">
            <div className="grid gap-3 md:grid-cols-[1fr_2fr] md:items-start">
              <Skeleton className="h-6 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-10/12" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="px-0">
            <div className="grid gap-4 md:grid-cols-[1fr_2fr] items-start">
              <Skeleton className="h-6 w-28" />
              <div className="flex flex-col divide-y divide-border">
                {Array.from({ length: CHARACTERISTICS_COUNT }).map((_, idx) => (
                  <div
                    key={idx}
                    className="grid gap-3 md:grid-cols-[1fr_1fr] items-start py-3"
                  >
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
