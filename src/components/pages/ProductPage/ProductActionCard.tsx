import { ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";

type ProductActionCardProps = {
  price?: number;
  inStockLabel?: string;
  sellerName?: string;
  isFavorite: boolean;
  onFavoriteToggle: (next: boolean) => void;
};

export function ProductActionCard({
  price,
  inStockLabel,
  sellerName = "sdsffs",
  isFavorite,
  onFavoriteToggle,
}: ProductActionCardProps) {
  const { t } = useTranslation("product");
  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  const sellerLabel = t("seller");
  const stockLabel = inStockLabel ?? t("inStock");
  const buyLabel = t("buy");

  return (
    <Card className="py-4">
      <CardContent className="w-full px-0 flex flex-col justify-between">
        <div className="text-xs md:text-sm px-4 pb-3 flex w-full justify-between item">
          <div>
            <span className="text-muted-foreground">{sellerLabel}:</span>{" "}
            {sellerName}
          </div>
          <ChevronRight
            size={20}
            className="transition-colors duration-150 hover:text-primary hover:cursor-pointer"
          />
        </div>
        <Separator className="w-full bg-muted" />
        <div className="px-4 pt-3 flex flex-col gap-3">
          <div
            className={`flex flex-wrap items-center gap-5 ${
              isSmallScreen ? "justify-between" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="text-xs md:text-sm text-primary">
                {stockLabel}
              </span>
              <span className="text-3xl">
                {price !== undefined ? `${price} $` : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!isSmallScreen && (
                <Button className="bg-primary">
                  <ShoppingCart /> {buyLabel}
                </Button>
              )}
              <Toggle
                aria-label={
                  isFavorite ? t("favorites.removed") : t("favorites.added")
                }
                pressed={isFavorite}
                onPressedChange={onFavoriteToggle}
                variant="outline"
                size="lg"
                className="rounded-full bg-muted/90 hover:bg-chart-1 data-[state=on]:bg-rose-100 data-[state=on]:text-rose-600 transition-colors duration-150 hover:cursor-pointer"
              >
                <Heart className="size-5" />
              </Toggle>
            </div>
          </div>
          {isSmallScreen && (
            <Button className="bg-primary">
              <ShoppingCart /> {buyLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
