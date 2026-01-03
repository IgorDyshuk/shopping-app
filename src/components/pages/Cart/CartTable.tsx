import type { TFunction } from "i18next";

import { Card, CardContent } from "@/components/ui/card";
import { CartLineItem } from "./CartLineItem";
import {
  accessorySizeOptions,
  defaultSizeOptions,
  sneakerSizeOptions,
} from "@/constants/filters-presets";
import type { Product } from "@/types/product";

type CartEntry = {
  product: Product;
  quantity: number;
  size?: string;
};

type CartTableProps = {
  items: CartEntry[];
  favoriteIds: number[];
  onAdd: (product: Product, size?: string) => void;
  onRemove: (productId: number, size?: string) => void;
  onRemoveLine: (productId: number, size?: string) => void;
  onUpdateSize: (productId: number, prevSize: string | undefined, next: string) => void;
  onToggleFavorite: (productId: number) => void;
  t: TFunction<["cart", "common"]>;
};

const resolveSizePreset = (category?: string) => {
  const lower = (category || "").toLowerCase();
  if (lower.includes("sneaker") || lower.includes("shoe")) return "sneakers";
  if (lower.includes("access")) return "accessories";
  return "clothing";
};

const getSizeOptions = (preset: string) => {
  if (preset === "sneakers") return sneakerSizeOptions;
  if (preset === "accessories") return accessorySizeOptions;
  return defaultSizeOptions;
};

export function CartTable({
  items,
  favoriteIds,
  onAdd,
  onRemove,
  onRemoveLine,
  onUpdateSize,
  onToggleFavorite,
  t,
}: CartTableProps) {
  return (
    <Card className="rounded-md py-0 font-normal h-fit">
      <CardContent className="p-0">
        <table className="w-full">
          <tbody className="divide-y">
            {items.map(({ product, quantity, size }) => {
              const preset = resolveSizePreset(product.category);
              const sizeOptions = getSizeOptions(preset);
              const currentSize = size ?? sizeOptions[0]?.id;
              return (
                <CartLineItem
                  key={`${product.id}-${size ?? "default"}`}
                  product={product}
                  quantity={quantity}
                  size={size}
                  currentSize={currentSize}
                  sizeOptions={sizeOptions}
                  isFavorite={favoriteIds.includes(product.id)}
                  onAdd={() => onAdd(product, currentSize)}
                  onRemove={() => onRemove(product.id, currentSize)}
                  onRemoveLine={() => onRemoveLine(product.id, currentSize)}
                  onSizeChange={(next) =>
                    onUpdateSize(product.id, currentSize, next)
                  }
                  onToggleFavorite={() => onToggleFavorite(product.id)}
                  t={t}
                />
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
