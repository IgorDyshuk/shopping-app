import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { RatingStars } from "@/components/pages/ProductPage/RatingStars";
import { cn } from "@/lib/utils";

type ProductHeadingCardProps = {
  title?: string;
  rating?: {
    rate?: number;
    count?: number;
  };
  code?: number | string;
  className?: string;
};

export function ProductHeadingCard({
  title,
  rating,
  code,
  className,
}: ProductHeadingCardProps) {
  const hasRating = Boolean(rating?.rate);

  return (
    <Card
      className={cn(
        "py-0 md:py-4 px-2 md:px-4 border-0 md:border gap-1 sm:gap-2  md:gap-3 xl:gap-4 2xl:gap-5",
        className
      )}
    >
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardContent className="w-full px-0 flex justify-between">
        <div className="flex items-center gap-2">
          {hasRating ? (
            <>
              <RatingStars value={rating?.rate ?? 0} />
              <span className="text-sm font-medium">
                {rating?.rate?.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({rating?.count})
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No rating</span>
          )}
        </div>
        <div className="text-muted-foreground text-sm">Код: {code}</div>
      </CardContent>
    </Card>
  );
}
