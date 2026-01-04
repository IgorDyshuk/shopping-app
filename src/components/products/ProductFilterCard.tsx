import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Toggle } from "@/components/ui/toggle";
import type { Product } from "@/types/product";
import { useFavoritesStore } from "@/stores/use-favorites";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";

type ProductCardProps = {
  product: Product;
};

export function ProductFilterCard({ product }: ProductCardProps) {
  const { ids, toggle } = useFavoritesStore();
  const isFavorite = ids.includes(product.id);
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const productUrl = useMemo(
    () => `/category/${encodeURIComponent(product.category)}/${product.id}`,
    [product.category, product.id]
  );

  const isBelowMd = useMediaQuery("(max-width: 767px)");

  const handleFavoriteToggle = (next: boolean) => {
    toggle(product.id);
    toast.message(next ? t("favorites.added") : t("favorites.removed"), {
      description: product.title,
    });
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(productUrl)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(productUrl);
        }
      }}
      className="group relative flex h-full z-0 hover:z-20 hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 opacity-0 rounded-md bg-card transition-all transition-150 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(0,0,0,0.18)]"
      />
      <div className="relative z-10 flex h-full w-full flex-col gap-2 pr-1.5 md:p-1">
        <div className="relative flex h-full w-full flex-col gap-2">
          <Toggle
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            pressed={isFavorite}
            onPressedChange={handleFavoriteToggle}
            value="heart"
            variant={"default"}
            size={"lg"}
            className={`absolute right-px sm:right-1 top-px sm:top-1 z-10 transition-all duration-150 bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 hover:cursor-pointer ${
              isBelowMd || isFavorite
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Heart className="size-4" />
          </Toggle>
          <div className="relative py-9 md:py-10 px-8 sm:px-6 xl:px-10 xl:mb-1 w-full rounded-sm bg-[#f0f0f3] md:bg-[#f7f7f7] flex justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="h-42 sm:h-48 md:h-53 lg:h-59 xl:h-64 2xl:h-70 w-fit object-contain transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 font-base">
            <div className="flex flex-col flex-1">
              <p className="text-sm line-clamp-1">{product.title}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{product.price.toFixed(2)}$</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
