import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { ProductCard } from "@/components/products/ProductCard";
import { ProductSkeleton } from "@/components/layout/skeletons/ProductSkeleton";
import { ProductCharacteristics } from "@/components/pages/ProductPage/ProductCharacteristics";
import { ProductActionCard } from "@/components/pages/ProductPage/ProductActionCard";
import { ProductSizePicker } from "@/components/pages/ProductPage/ProductSizePicker";
import { ProductInfoAccordion } from "@/components/pages/ProductPage/ProductInfoAccordion";
import { ProductHeadingCard } from "@/components/pages/ProductPage/ProductHeadingCard";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";

function ProductPage() {
  const { id, category = "" } = useParams<{ id: string; category: string }>();
  const productId = useMemo(() => Number(id), [id]);
  const addViewedProduct = useViewedProductsStore(
    (state) => state.addViewedProduct
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const {
    data: product,
    isLoading,
    isError,
  } = useProduct(Number.isFinite(productId) ? productId : undefined);
  const { t } = useTranslation("common");

  const { data: products } = useFilteredProduct(category);

  const viewedProducts = useViewedProductsStore(
    (state) => state.viewedProducts
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

  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (!selectedSize && sizeOptions.length) {
      setSelectedSize(sizeOptions[2].id);
    }
  }, [sizeOptions, selectedSize]);

  const handleFavoriteToggle = (next: boolean) => {
    setIsFavorite(next);
    toast.success(next ? "Added to favorites" : "Removed from favorites", {
      description: product?.title,
    });
  };

  const galleryImages = useMemo(() => {
    if (!product?.image) return [];
    return Array.from({ length: 5 }).map(() => product.image);
  }, [product?.image]);

  const characteristics = useMemo(
    () => [
      { label: "Brand", value: "nike" },
      { label: "Розмір", value: selectedSize || "—" },
      { label: "Колір", value: "Темний синій" },
      { label: "Матеріал", value: "Бавовна / поліестер" },
      { label: "Состояние", value: "нове" },
      { label: "Країна-виробник товару", value: "Україна" },
    ],
    [selectedSize]
  );

  return (
    <section className="w-full my-18 xl:my-20">
      <Breadcrumb>
        <BreadcrumbList className="hidden md:flex">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/catalog">{t("breadcrumb.catalog")}</Link>
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
        <section className="flex flex-col gap-10 mt-2 sm:mt-4 xl:mt-6 ">
          <div className="grid w-full gap-2 md:grid-cols-2 items-start">
            {isSmallScreen && (
              <ProductHeadingCard
                title={product?.title}
                rating={product?.rating}
                code={product?.id}
              />
            )}

            <Card className="border-0 md:border pt-3 md:py-0">
              <CardContent className="p-2 md:p-4">
                <ProductGallery images={galleryImages} title={product?.title} />
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
              />

              <ProductSizePicker
                options={sizeOptions}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />

              <ProductInfoAccordion />
            </div>
          </div>

          <ItemsCarousel
            title={"От этого же блогера"}
            items={products ?? []}
            getItemKey={(product) => product.id}
            perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 6 }}
            peekNext
            controlsInline
            renderItem={(product) => <ProductCard product={product as any} />}
          />

          <div className="flex flex-col gap-2">
            <Card className="p-4">
              <CardContent className="px-0">
                <div className="grid gap-3 md:grid-cols-[1fr_2fr] md:items-start">
                  <div className="text-2xl font-semibold">Опис</div>
                  <div className="text-sm leading-relaxed text-foreground">
                    {product?.description ||
                      "Детальний опис товару буде доданий пізніше."}
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProductCharacteristics items={characteristics} />
          </div>

          {viewedProducts.length > 0 && (
            <ItemsCarousel
              title={t("carousels.recentlyViewed", { ns: "common" })}
              items={viewedProducts}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 6 }}
              peekNext
              controlsInline
              renderItem={(product) => <ProductCard product={product as any} />}
            />
          )}
        </section>
      )}

      {/* <pre className="max-h-[480px] overflow-auto rounded bg-muted p-3 text-xs leading-relaxed">
        {JSON.stringify(product, null, 2)}
      </pre> */}
    </section>
  );
}

export default ProductPage;
