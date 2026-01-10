import { ProductVariantCard } from "@/components/products/ProductVariantCard";
import type { Product } from "@/types/product";

type FavoritesSectionProps = {
  products: Product[];
  isLoading: boolean;
  emptyText: string;
  loadingText: string;
};

export function FavoritesSection({
  products,
  isLoading,
  emptyText,
  loadingText,
}: FavoritesSectionProps) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{loadingText}</p>;
  }

  if (!products.length) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-y-5 md:gap-y-7 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductVariantCard
          key={product.id}
          product={product}
          variant="filter"
        />
      ))}
    </div>
  );
}
