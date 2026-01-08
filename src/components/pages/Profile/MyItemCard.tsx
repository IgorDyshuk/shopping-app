import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/types/product";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/stores/use-favorites";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";

type MyItemCardProps = {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

export function MyItemCard({ product, onEdit, onDelete }: MyItemCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "profile"]);
  const { ids, toggle } = useFavoritesStore();
  const isFavorite = ids.includes(product.id);
  const isBelowMd = useMediaQuery("(max-width: 767px)");

  const productUrl = useMemo(
    () => `/category/${encodeURIComponent(product.category)}/${product.id}`,
    [product.category, product.id]
  );

  const handleFavoriteToggle = (next: boolean) => {
    toggle(product.id);
    toast.message(next ? t("favorites.added") : t("favorites.removed"), {
      description: product.title,
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product);
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
          <div className="absolute right-px sm:right-1 top-px sm:top-1 z-10 flex items-center gap-1">
            <Toggle
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              pressed={isFavorite}
              onPressedChange={handleFavoriteToggle}
              value="heart"
              variant={"default"}
              size={"lg"}
              className="transition-all duration-150 bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 hover:cursor-pointer opacity-100"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Heart className="size-4" />
            </Toggle>
            <div className="flex gap-1 opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleEdit}
                title={t("myItems.edit", {
                  ns: "profile",
                  defaultValue: "Edit",
                })}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleDelete}
                title={t("myItems.delete", {
                  ns: "profile",
                  defaultValue: "Delete",
                })}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

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
