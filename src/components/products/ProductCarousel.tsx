import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";

type ProductCarouselProps<T> = {
  title: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  perRow?: {
    base?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  controlsInline?: boolean;
  peekNext?: boolean;
  viewAllLink?: string;
};

const clampCount = (count?: number) => {
  const rounded = Math.round(count ?? 1);
  return Math.min(6, Math.max(1, rounded));
};

export function ItemsCarousel<T>({
  title,
  items,
  renderItem,
  getItemKey,
  autoplay = false,
  autoplayDelay = 5000,
  loop = false,
  perRow = { base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 6 },
  controlsInline = true,
  peekNext = false,
  viewAllLink,
}: ProductCarouselProps<T>) {
  const isMobile = useIsMobile();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [columns, setColumns] = useState<number>(clampCount(perRow.base));

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 499px)");
    const update = () => setIsSmallScreen(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mqls = [
      window.matchMedia("(min-width: 1280px)"),
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(min-width: 640px)"),
      window.matchMedia("(min-width: 480px)"),
    ];

    const updateColumns = () => {
      let next = perRow.base ?? 1;

      if (perRow.xl && mqls[0].matches) {
        next = perRow.xl;
      } else if (perRow.lg && mqls[1].matches) {
        next = perRow.lg;
      } else if (perRow.md && mqls[2].matches) {
        next = perRow.md;
      } else if (perRow.sm && mqls[3].matches) {
        next = perRow.sm;
      } else if (perRow.xs && mqls[4].matches) {
        next = perRow.xs;
      }

      setColumns(clampCount(next));
    };

    updateColumns();
    mqls.forEach((mql) => mql.addEventListener("change", updateColumns));
    return () =>
      mqls.forEach((mql) => mql.removeEventListener("change", updateColumns));
  }, [perRow.base, perRow.xs, perRow.sm, perRow.md, perRow.lg, perRow.xl]);

  const hideControls = isMobile && isSmallScreen;
  // const itemClasses = "pl-1.5 md:pl-2 xl:pl-3";
  const itemClasses = "pl-0";
  const peekOffsetPx = peekNext ? 16 : 0;
  const itemStyle = useMemo(
    () => ({
      flexBasis: `calc(100% / ${clampCount(columns)} - ${peekOffsetPx}px)`,
    }),
    [columns, peekOffsetPx]
  );
  const autoplayPlugin = autoplay ? Autoplay({ delay: autoplayDelay }) : null;
  const slidesToScroll = clampCount(columns);
  const contentClass = peekNext ? "pr-2" : "";

  return (
    <div className="relative">
      <Carousel
        opts={{ align: "start", loop: loop, slidesToScroll }}
        plugins={autoplayPlugin ? [autoplayPlugin] : []}
      >
        <div className="mb-1 md:mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{title}</h2>

          {(viewAllLink || (controlsInline && !hideControls)) && (
            <div className="flex items-center gap-3">
              {viewAllLink && (
                <Link
                  to={viewAllLink}
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  Show more
                </Link>
              )}

              {controlsInline && !hideControls && (
                <div className="flex items-center gap-2 sm:flex">
                  <CarouselPrevious className="static translate-y-0 size-10" />
                  <CarouselNext className="static translate-y-0 size-10" />
                </div>
              )}
            </div>
          )}
        </div>
        <CarouselContent
          // className={`-ml-1.5 md:-ml-1.5 xl:-ml-3 ${contentClass}`}
          className={`ml-0 ${contentClass}`}
        >
          {items.map((item, index) => (
            <CarouselItem
              key={getItemKey ? getItemKey(item, index) : index}
              className={itemClasses}
              style={itemStyle}
            >
              {renderItem(item)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {!controlsInline && !hideControls && (
          <>
            <CarouselPrevious className="absolute left-7 top-1/2 -translate-y-1/2 -translate-x-1/2 size-10" />
            <CarouselNext className="absolute right-7 top-1/2 -translate-y-1/2 translate-x-1/2 size-10" />
          </>
        )}
      </Carousel>
    </div>
  );
}
