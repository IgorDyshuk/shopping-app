import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/media-hooks/use-mobile";
import { ChevronRight } from "lucide-react";

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
  disableMobileCarousel?: boolean;
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
  disableMobileCarousel = false,
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
  const itemClasses = "pl-0 first:pl-3";
  const peekOffsetPx = !disableMobileCarousel && peekNext ? 16 : 0;
  const itemStyle = useMemo(
    () => ({
      flexBasis: `calc(100% / ${clampCount(columns)} - ${peekOffsetPx}px)`,
    }),
    [columns, peekOffsetPx]
  );
  const autoplayPlugin = autoplay ? Autoplay({ delay: autoplayDelay }) : null;
  const slidesToScroll = clampCount(columns);
  const contentClass = peekNext ? "pr-2" : "";

  if (isMobile && disableMobileCarousel) {
    return (
      <div className="relative ">
        <div className="mb-1 md:mb-3 flex items-center gap-3">
          <h2 className="text-2xl">{title}</h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-1 text-xs sm:text-sm hover:underline"
            >
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
        <div className="flex overflow-x-auto pb-4 py-2 md:py-6">
          {items.map((item, index) => (
            <div
              key={getItemKey ? getItemKey(item, index) : index}
              className="min-w-60"
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        opts={{ align: "start", loop: loop, slidesToScroll }}
        plugins={autoplayPlugin ? [autoplayPlugin] : []}
      >
        <div className="mb-1 md:mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl">{title}</h2>
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="flex items-center gap-1 text-xs sm:text-sm hover:underline"
              >
                <ChevronRight className="size-5" />
              </Link>
            )}
          </div>

          {(viewAllLink || (controlsInline && !hideControls)) && (
            <div className="flex">
              {controlsInline && !hideControls && (
                <div className="flex items-center gap-2 sm:flex">
                  <CarouselPrevious className="static translate-y-0 size-10" />
                  <CarouselNext className="static translate-y-0 size-10" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <CarouselContent
            className={`ml-0 py-2 md:py-6 gap-1 ${contentClass}`}
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
              <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 size-10" />
              <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 size-10" />
            </>
          )}
        </div>
      </Carousel>
    </div>
  );
}
