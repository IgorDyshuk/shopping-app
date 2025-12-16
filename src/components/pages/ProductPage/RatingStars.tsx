import { Star, StarHalf } from "lucide-react";

type RatingStarsProps = {
  value: number;
};

export function RatingStars({ value }: RatingStarsProps) {
  const clamped = Math.max(0, Math.min(5, value));
  const full = Math.floor(clamped);
  const hasHalf = clamped - full >= 0.5;

  const emptyCount = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: full }).map((_, idx) => (
        <Star
          key={`full-${idx}`}
          className="size-4"
          fill="currentColor"
          stroke="currentColor"
        />
      ))}
      {hasHalf && (
        <StarHalf
          key="half"
          className="size-4"
          fill="currentColor"
          stroke="currentColor"
        />
      )}
      {Array.from({ length: emptyCount }).map((_, idx) => (
        <Star
          key={`empty-${idx}`}
          className="size-4 text-amber-300/50"
          stroke="currentColor"
          fill="none"
        />
      ))}
    </div>
  );
}
