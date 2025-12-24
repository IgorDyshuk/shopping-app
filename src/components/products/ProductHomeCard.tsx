import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Toggle } from "@/components/ui/toggle";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductHomeCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const productUrl = useMemo(
    () => `/category/${encodeURIComponent(product.category)}/${product.id}`,
    [product.category, product.id]
  );

  const handleFavoriteToggle = (next: boolean) => {
    setIsFavorite(next);
    toast.success(next ? t("favorites.added") : t("favorites.removed"), {
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
        className="pointer-events-none absolute -inset-2 opacity-0 rounded-md bg-card transition-all transition-150 group-hover:opacity-100 group-hover:shadow-[0_0_28px_rgba(0,0,0,0.18)]"
      />
      <div className="relative z-10 flex h-full w-full flex-col gap-2 p-1">
        <div className="relative flex h-full w-full flex-col gap-2">
          <Toggle
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            pressed={isFavorite}
            onPressedChange={handleFavoriteToggle}
            variant="outline"
            size="sm"
            className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-150 rounded-full bg-muted hover:bg-chart-1 data-[state=on]:bg-rose-100 data-[state=on]:text-rose-600 hover:cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Heart className="size-4" />
          </Toggle>
          <div className="relative py-6 md:py-18 px-8 sm:px-6 xl:px-10 xl:mb-1 w-full rounded-sm bg-[#f0f0f3] md:bg-[#f7f7f7] flex justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="h-60 sm:h-51 md:h-57 lg:h-63 xl:h-69 2xl:h-75 w-fit object-contain transition-transform duration-300"
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
