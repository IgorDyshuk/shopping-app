import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  bordered?: boolean;
};

export function ProductCard({ product, bordered = false }: ProductCardProps) {
  return (
    <article
      className={`group flex h-full flex-col gap-0.5 sm:gap-1 rounded-lg bg-card p-3 sm:p-4 hover:cursor-pointer ${
        bordered ? "border" : ""
      }`}
    >
      <div className="relative mb-0 xl:mb-1 w-full rounded-md bg-white">
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
