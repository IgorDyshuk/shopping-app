import { ChevronRight, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
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
  onAddToCart?: () => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
};

export function ProductActionCard({
  price,
  inStockLabel,
  sellerName = "sdsffs",
  isFavorite,
  onFavoriteToggle,
  onAddToCart,
  quantity = 0,
  onIncrement,
  onDecrement,
}: ProductActionCardProps) {
  const { t } = useTranslation("product");
  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  const sellerLabel = t("seller");
  const stockLabel = inStockLabel ?? t("inStock");
  const buyLabel = t("buy");
  const canBuy = Boolean(onAddToCart);
  const showCounter = quantity > 0;

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
        <div className="px-4 pt-3 flex flex-col gap-5">
          <div
            className={`flex flex-wrap items-center gap-10 ${
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
              {!isSmallScreen &&
                (showCounter ? (
                  <div className="flex items-center gap-2 bg-muted rounded-md font-semibold px-2 py-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onDecrement}
                      className="h-8 w-8"
                    >
                      <Minus className="size-4" strokeWidth={3} />
                    </Button>
                    <span className="text-center text-sm min-w-8">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onIncrement}
                      className="h-8 w-8"
                    >
                      <Plus className="size-4" strokeWidth={3} />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="bg-primary"
                    variant={"default"}
                    onClick={onAddToCart}
                    disabled={!canBuy}
                  >
                    <span className="px-3 flex items-center gap-2">
                      <ShoppingCart /> {buyLabel}
                    </span>
                  </Button>
                ))}
              <Toggle
                aria-label={
                  isFavorite ? t("favorites.removed") : t("favorites.added")
                }
                pressed={isFavorite}
                onPressedChange={onFavoriteToggle}
                value="heart"
                variant={"default"}
                size={"lg"}
                className="bg-transparent data-[state=on]:*:[svg]:fill-red-500 
            data-[state=off]:*:[svg]:stroke-black/60 data-[state=on]:*:[svg]:stroke-red-500 
            hover:cursor-pointer hover:data-[state=off]:*:[svg]:stroke-black 
            transition-colors duration-150"
              >
                <Heart className="size-5" />
              </Toggle>
            </div>
          </div>
          {isSmallScreen &&
            (showCounter ? (
              <div className="flex items-center justify-between  bg-muted rounded-md font-semibold px-2 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDecrement}
                  className="h-8 w-8"
                >
                  <Minus className="size-4" strokeWidth={3} />
                </Button>
                <span className="text-center text-sm min-w-8">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onIncrement}
                  className="h-8 w-8"
                >
                  <Plus className="size-4" strokeWidth={3} />
                </Button>
              </div>
            ) : (
              <Button
                className="bg-primary"
                onClick={onAddToCart}
                disabled={!canBuy}
              >
                <ShoppingCart /> {buyLabel}
              </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
