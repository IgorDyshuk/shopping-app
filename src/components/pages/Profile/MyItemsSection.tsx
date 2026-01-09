import { MyItemCard } from "@/components/pages/Profile/MyItemCard";
import type { Product } from "@/types/product";

type MyItemsSectionProps = {
  products: Product[];
  isLoading: boolean;
  loadingText: string;
  emptyText: string;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

export function MyItemsSection({
  products,
  isLoading,
  loadingText,
  emptyText,
  onEdit,
  onDelete,
}: MyItemsSectionProps) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{loadingText}</p>;
  }

  return (
    <div className="space-y-3">
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-2 gap-y-5 md:gap-y-7 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <MyItemCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
