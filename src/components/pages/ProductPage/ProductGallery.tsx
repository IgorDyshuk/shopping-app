import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  title?: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    setActiveImage(0);
    carouselApi?.scrollTo(0);
  }, [images, carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setActiveImage(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    onSelect();
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  if (!images.length) {
    return (
      <div className="h-80 rounded-lg border bg-muted text-muted-foreground flex items-center justify-center">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-7 sm:gap-10">
      <Carousel
        opts={{ align: "start", loop: true }}
        setApi={setCarouselApi}
        className="relative w-full flex items-center justify-center"
      >
        <CarouselContent className="ml-0">
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="pl-0">
              <div className="h-100 sm:h-140 md:h-100 lg:h-120 xl:h-140">
                <img
                  src={src}
                  alt={`${title ?? "Image"} ${idx + 1}`}
                  className="h-full w-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex sm:absolute left-7 top-1/2 -translate-y-1/2 -translate-x-1/2 size-10" />
        <CarouselNext className="hidden sm:flex sm:absolute right-7 top-1/2 -translate-y-1/2 translate-x-1/2 size-10" />
      </Carousel>

      <div className="flex gap-2">
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveImage(idx);
              carouselApi?.scrollTo(idx);
            }}
            className={cn(
              "h-12 w-12 overflow-hidden rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              activeImage === idx
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/60 hover:cursor-pointer"
            )}
          >
            <img
              src={src}
              alt={`${title ?? "Image"} ${idx + 1}`}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
