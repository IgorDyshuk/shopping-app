import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/use-cart";
import { useFavoritesStore } from "@/stores/use-favorites";
import { CartTable } from "@/components/pages/Cart/CartTable";
import { CartTotals } from "@/components/pages/Cart/CartTotals";
import { ItemsCarousel } from "@/components/products/ProductCarousel";
import { ProductSmallHomeCard } from "@/components/products/ProductSmallHomeCard";
import { useViewedProductsStore } from "@/stores/use-viewed-products";
import { toast } from "sonner";

function CartPage() {
  const { t } = useTranslation(["cart", "common"]);
  const { items, addItem, removeItem, removeLine, clear, updateItemSize } =
    useCartStore();
  const { ids: favoriteIds, toggle: toggleFavoriteId } = useFavoritesStore();
  const viewedProducts = useViewedProductsStore(
    (state) => state.viewedProducts
  );

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
        0
      ),
    [items]
  );

  const handleRemove = (productId: number, size?: string) => {
    const target = items.find(
      (item) => item.product.id === productId && item.size === size
    );
    removeItem(productId, size);
    if (target && target.quantity <= 1) {
      toast.message(t("removed"), { description: target.product.title });
    }
  };

  return (
    <section className="w-full my-18 xl:my-19 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home", { ns: "common" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{t("title")}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
        </div>

        {items.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[3fr_1fr] items-start">
            <CartTable
              items={items}
              favoriteIds={favoriteIds}
              onAdd={(product, size) => addItem(product, 1, size)}
              onRemove={handleRemove}
              onRemoveLine={(productId, size) => removeLine(productId, size)}
              onUpdateSize={updateItemSize}
              onToggleFavorite={toggleFavoriteId}
              t={t}
            />

            <div className="flex flex-col gap-1">
              <CartTotals total={total} t={t} />
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
                onClick={clear}
              >
                <X className="size-3" />
                {t("clear")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-15 sm:mt-18 md:mt-22 xl:mt-25">
        {viewedProducts.length > 0 && (
          <ItemsCarousel
            title={t("carousels.recentlyViewed", { ns: "common" })}
            items={viewedProducts}
            getItemKey={(product) => product.id}
            perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 6 }}
            peekNext
            controlsInline
            renderItem={(product) => <ProductSmallHomeCard product={product} />}
          />
        )}
      </div>
    </section>
  );
}

export default CartPage;
