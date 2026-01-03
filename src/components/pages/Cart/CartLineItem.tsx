import { Link } from "react-router-dom";
import type { TFunction } from "i18next";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { AnimatedNumber } from "./AnimatedNumber";

type SizeOption = { id: string; label: string };

type CartLineItemProps = {
  product: {
    id: number;
    title: string;
    image: string;
    price?: number;
    category: string;
  };
  quantity: number;
  size?: string;
  currentSize: string;
  sizeOptions: SizeOption[];
  isFavorite: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onRemoveLine: () => void;
  onSizeChange: (next: string) => void;
  onToggleFavorite: () => void;
  t: TFunction<["cart", "common"]>;
};

export function CartLineItem({
  product,
  quantity,
  size,
  currentSize,
  sizeOptions,
  isFavorite,
  onAdd,
  onRemove,
  onRemoveLine,
  onSizeChange,
  onToggleFavorite,
  t,
}: CartLineItemProps) {
  const productUrl = `/category/${encodeURIComponent(product.category)}/${
    product.id
  }?size=${encodeURIComponent(currentSize ?? "")}`;

  return (
    <tr
      key={`${product.id}-${size ?? "default"}`}
      className="align-top grid grid-cols-[1fr_auto] gap-3 sm:table-row"
    >
      <td className="pt-5 sm:py-5 pl-5 sm:px-5 order-1 sm:order-0 sm:table-cell w-full">
        <div className="flex items-start gap-5">
          <Link
            to={productUrl}
            className="h-22 md:h-25 w-22 md:w-25 my-0 sm:my-2 rounded-md shrink-0 flex items-center justify-center overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          </Link>

          <div className="flex flex-col flex-1 min-w-0">
            <Link to={productUrl}>
              <span className="line-clamp-2">{product.title}</span>
            </Link>

            <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
              {sizeOptions.map((opt) => (
                <Button
                  key={opt.id}
                  variant={currentSize === opt.id ? "default" : "ghost"}
                  size="xs"
                  className="h-6 sm:h-7 w-6 sm:w-7 p-2 rounded-sm"
                  onClick={() => onSizeChange(opt.id)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </td>
      <td className="py-2 sm:py-5 px-5 xl:px-10 2xl:px-20 order-3 sm:order-0 sm:table-cell">
        <div className="flex flex-col items-start sm:items-center  gap-0.5">
          <div className="flex items-center gap-1 bg-muted rounded-sm font-semibold ">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="p-0"
            >
              <Minus className="size-4" strokeWidth={3} />
            </Button>
            <span className="text-center text-sm min-w-3">{quantity}</span>
            <Button variant="ghost" size="sm" onClick={onAdd} className="p-0">
              <Plus className="size-4" strokeWidth={3} />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground block px-1 sm:px-0">
            {t("perItem", { value: product.price?.toFixed(2) ?? "—" })}
          </span>
        </div>
      </td>
      <td className="py-0 sm:py-5 pr-5 sm:px-5 order-4 sm:order-0 sm:table-cell text-right sm:text-left justify-self-end sm:justify-self-auto">
        <AnimatedNumber
          value={(product.price ?? 0) * quantity}
          className="font-normal whitespace-nowrap"
        />
      </td>
      <td className="pt-5 sm:py-5 pr-3 sm:px-3 order-2 sm:order-0 sm:table-cell justify-self-end sm:justify-self-auto">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onRemoveLine}
            title={t("removeItem")}
            className="flex items-center justify-center hover:cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <Trash2 className="size-5" />
          </button>
          <Toggle
            aria-label={
              isFavorite
                ? t("favorites.removed", { ns: "common" })
                : t("favorites.added", { ns: "common" })
            }
            pressed={isFavorite}
            onPressedChange={onToggleFavorite}
            className="hover:cursor-pointer text-muted-foreground hover:text-foreground hover:bg-chart-1 data-[state=on]:bg-rose-100 data-[state=on]:text-rose-600 transition-colors duration-150"
          >
            <Heart className="size-5" />
          </Toggle>
        </div>
      </td>
    </tr>
  );
}
