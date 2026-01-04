import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFilteredProduct, useProduct } from "@/hooks/api-hooks/useProducts";
import { useViewedProductsStore } from "@/stores/use-viewed-products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  accessorySizeOptions,
  defaultSizeOptions,
  sneakerSizeOptions,
} from "@/constants/filters-presets";
import { ProductGallery } from "@/components/pages/ProductPage/ProductGallery";
import { ItemsCarousel } from "@/components/products/ProductCarousel";
import { ProductSkeleton } from "@/components/layout/skeletons/ProductSkeleton";
import { ProductCharacteristics } from "@/components/pages/ProductPage/ProductCharacteristics";
import { ProductActionCard } from "@/components/pages/ProductPage/ProductActionCard";
import { ProductSizePicker } from "@/components/pages/ProductPage/ProductSizePicker";
import { ProductInfoAccordion } from "@/components/pages/ProductPage/ProductInfoAccordion";
import { ProductSectionsNav } from "@/components/pages/ProductPage/ProductSectionsNav";
import { ProductHeadingCard } from "@/components/pages/ProductPage/ProductHeadingCard";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";
import { ProductSmallHomeCard } from "@/components/products/ProductSmallHomeCard";
import { ProductHomeCard } from "@/components/products/ProductHomeCard";
import { useCartStore } from "@/stores/use-cart";
import { useFavoritesStore } from "@/stores/use-favorites";
import type { Product as ProductType } from "@/types/product";

function ProductPage() {
  const { id, category = "" } = useParams<{ id: string; category: string }>();
  const productId = useMemo(() => Number(id), [id]);
  const {
    data: product,
    isLoading,
    isError,
  } = useProduct(Number.isFinite(productId) ? productId : undefined);
  const [searchParams] = useSearchParams();
  const { data: products } = useFilteredProduct(category);

  const { t } = useTranslation(["product", "common"]);
  const addCartItem = useCartStore((state) => state.addItem);
  const removeCartItem = useCartStore((state) => state.removeItem);
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavoriteId = useFavoritesStore((state) => state.toggle);

  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [manualSize, setManualSize] = useState(false);

  const viewedProducts = useViewedProductsStore(
    (state) => state.viewedProducts
  );
  const addViewedProduct = useViewedProductsStore(
    (state) => state.addViewedProduct
  );

  const sectionLinks = useMemo(
    () => [
      { id: "overview", label: t("sections.overview") },
      {
        id: "description",
        label: t("sections.description"),
      },
      {
        id: "characteristics",
        label: t("sections.characteristics"),
      },
      { id: "related", label: t("sections.related") },
    ],
    [t]
  );

  const categoryLabel = useMemo(() => {
    if (!category) return t("breadcrumb.catalog");
    return (
      decodeURIComponent(category).charAt(0).toUpperCase() +
      decodeURIComponent(category).slice(1)
    );
  }, [category, t]);

  useEffect(() => {
    if (product && !isLoading && !isError) {
      addViewedProduct(product);
    }
  }, [product, isLoading, isError, addViewedProduct]);

  const sizePreset = useMemo(() => {
    const cat = (product?.category || category || "").toLowerCase();
    if (cat.includes("sneaker") || cat.includes("shoe")) return "sneakers";
    if (cat.includes("access")) return "accessories";
    return "clothing";
  }, [product?.category, category]);

  const sizeOptions = useMemo(() => {
    if (sizePreset === "sneakers") return sneakerSizeOptions;
    if (sizePreset === "accessories") return accessorySizeOptions;
    return defaultSizeOptions;
  }, [sizePreset]);

  const cartItems = useCartStore((state) => state.items);
  const cartMatchedSize = useMemo(() => {
    const match = cartItems.find((item) => item.product.id === productId);
    return match?.size;
  }, [cartItems, productId]);

  useEffect(() => {
    setManualSize(false);
  }, [productId]);

  useEffect(() => {
    if (manualSize) return;
    if (!sizeOptions.length) return;

    const paramSize = searchParams.get("size");
    if (paramSize && sizeOptions.some((opt) => opt.id === paramSize)) {
      if (selectedSize !== paramSize) setSelectedSize(paramSize);
      return;
    }

    if (
      cartMatchedSize &&
      sizeOptions.some((opt) => opt.id === cartMatchedSize)
    ) {
      if (selectedSize !== cartMatchedSize) setSelectedSize(cartMatchedSize);
      return;
    }

    if (!selectedSize) {
      setSelectedSize(sizeOptions[2].id);
    }
  }, [sizeOptions, selectedSize, searchParams, cartMatchedSize, manualSize]);

  const isFavorite = favoriteIds.includes(productId);

  const handleFavoriteToggle = (next: boolean) => {
    if (!productId) return;
    toggleFavoriteId(productId);
    toast.message(
      next
        ? t("favorites.added", { ns: "common" })
        : t("favorites.removed", { ns: "common" }),
      {
        description: product?.title,
      }
    );
  };

  const galleryImages = useMemo(() => {
    if (!product?.image) return [];
    return Array.from({ length: 5 }).map(() => product.image);
  }, [product]);

  const characteristics = useMemo(
    () => [
      { label: t("characteristics.brand"), value: "Nike" },
      {
        label: t("characteristics.condition"),
        value: "нове",
      },
      {
        label: t("characteristics.size"),
        value: selectedSize || "—",
      },
      {
        label: t("characteristics.material"),
        value: "бавовна",
      },
      {
        label: t("characteristics.stock"),
        value: "13 одиниць",
      },
    ],
    [selectedSize, t]
  );

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addCartItem(product, 1, selectedSize);
    toast.message(
      t("addedToCart", { ns: "product", defaultValue: "Added to cart" }),
      { description: product.title }
    );
  }, [addCartItem, product, selectedSize, t]);

  const cartQuantity =
    cartItems.find(
      (item) =>
        item.product.id === productId &&
        (!selectedSize || item.size === selectedSize)
    )?.quantity ?? 0;

  const handleIncrement = useCallback(() => {
    if (!product) return;
    addCartItem(product, 1, selectedSize);
  }, [addCartItem, product, selectedSize]);

  const handleDecrement = useCallback(() => {
    if (!product) return;
    removeCartItem(product.id, selectedSize);
    if (cartQuantity <= 1) {
      toast.message(t("removedFromCart"), { description: product.title });
    }
  }, [cartQuantity, product, selectedSize, removeCartItem, t]);

  return (
    <section className="w-full my-18 xl:my-19">
      <Breadcrumb>
        <BreadcrumbList className="hidden md:flex">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home", { ns: "common" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/catalog">
                {t("breadcrumb.catalog", { ns: "common" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/category/${encodeURIComponent(category)}`}>
                    {categoryLabel}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              {product?.title ?? t("breadcrumb.product")}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>

        <BreadcrumbList className="md:hidden">
          {category && (
            <>
              <BreadcrumbSeparator className="rotate-180" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/category/${encodeURIComponent(category)}`}>
                    {categoryLabel}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <ProductSkeleton />
      ) : isError ? (
        <p className="text-destructive">error</p>
      ) : (
        <section className="flex flex-col gap-2 mt-3 xl:mt-4">
          <ProductSectionsNav sections={sectionLinks} />
          <div className="flex flex-col gap-2">
            <div
              id="overview"
              className="grid w-full gap-2 md:grid-cols-2 items-start scroll-mt-28"
            >
              {isSmallScreen && (
                <ProductHeadingCard
                  title={product?.title}
                  rating={product?.rating}
                  code={product?.id}
                />
              )}

              <Card className="border-0 md:border pt-3 md:py-0">
                <CardContent className="p-2 md:p-4">
                  <ProductGallery
                    images={galleryImages}
                    title={product?.title}
                  />
                </CardContent>
              </Card>
              <div className="flex flex-col gap-2">
                {!isSmallScreen && (
                  <ProductHeadingCard
                    title={product?.title}
                    rating={product?.rating}
                    code={product?.id}
                  />
                )}

                <ProductActionCard
                  price={product?.price}
                  isFavorite={isFavorite}
                  onFavoriteToggle={handleFavoriteToggle}
                  onAddToCart={handleAddToCart}
                  quantity={cartQuantity}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                />

                <ProductSizePicker
                  options={sizeOptions}
                  selected={selectedSize}
                  onSelect={(id) => {
                    setManualSize(true);
                    setSelectedSize(id);
                  }}
                />

                <ProductInfoAccordion />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <div></div>
            <div id="related" className="scroll-mt-28">
              <ItemsCarousel
                title={t("sections.related")}
                items={products ?? []}
                getItemKey={(product) => product.id}
                perRow={{ base: 2, xs: 3, sm: 3, md: 3, lg: 3, xl: 4 }}
                peekNext
                disableMobileCarousel
                controlsInline
                renderItem={(product: ProductType) => (
                  <ProductHomeCard inCarousel product={product} />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Card id="description" className="p-4 scroll-mt-28">
                <CardContent className="px-0">
                  <div className="grid gap-3 md:grid-cols-[1fr_2fr] md:items-start">
                    <div className="text-2xl font-semibold">
                      {t("sections.description")}
                    </div>
                    <div className="text-sm leading-relaxed text-foreground">
                      {product?.description || t("descriptionFallback")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div id="characteristics" className="scroll-mt-28">
                <ProductCharacteristics
                  items={characteristics}
                  title={t("sections.characteristics")}
                />
              </div>
            </div>

            {viewedProducts.length > 0 && (
              <ItemsCarousel
                title={t("carousels.recentlyViewed", { ns: "common" })}
                items={viewedProducts}
                getItemKey={(product) => product.id}
                perRow={{ base: 2, xs: 3, sm: 4, md: 5, lg: 5, xl: 5 }}
                peekNext
                controlsInline
                renderItem={(product: ProductType) => (
                  <ProductSmallHomeCard product={product} />
                )}
              />
            )}
          </div>
        </section>
      )}

      {/* <pre className="max-h-[480px] overflow-auto rounded bg-muted p-3 text-xs leading-relaxed">
        {JSON.stringify(product, null, 2)}
      </pre> */}
    </section>
  );
}

export default ProductPage;
