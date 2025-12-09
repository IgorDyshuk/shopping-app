import { useState } from "react";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Toggle } from "@/components/ui/toggle";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  bordered?: boolean;
};

export function ProductCard({ product, bordered = false }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = (next: boolean) => {
    setIsFavorite(next);
    toast.success(next ? "Added to favorites" : "Removed from favorites", {
      description: product.title,
    });
  };

  return (
    <article
      className={`group flex h-full flex-col gap-0.5 sm:gap-1 rounded-lg bg-card p-3 sm:p-4 hover:cursor-pointer  ${
        bordered ? "border" : ""
      }`}
    >
      <div className="relative mb-0 xl:mb-1 w-full rounded-md bg-white">
        <Toggle
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          pressed={isFavorite}
          onPressedChange={handleFavoriteToggle}
          variant="outline"
          size="sm"
          className="absolute right-1 top-1 z-10 rounded-full bg-white/90 hover:bg-white data-[state=on]:bg-rose-100 data-[state=on]:text-rose-600 hover:cursor-pointer"
        >
          <Heart className="size-4" />
        </Toggle>
        <img
          src={product.image}
          alt={product.title}
          className="h-20 sm:h-25 md:h-30 xl:h-40 w-full object-contain p-3 sm:p-4 transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col gap-0 xl:gap-1 flex-1">
        <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
          {product.description}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base sm:text-lg font-semibold">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </article>
  );
}
