import { Skeleton } from "@/components/ui/skeleton";

export default function BloggerSkeleton() {
  return (
    <div className="grid w-full gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          key={idx}
          className="relative h-70 sm:h-110 md:h-90 w-full overflow-hidden rounded-md"
        >
          <Skeleton className="h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />
          <Skeleton className="absolute bottom-3 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full" />
        </div>
      ))}
    </div>
  );
}
