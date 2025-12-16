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
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/pages/ProductPage/RatingStars";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  accessorySizeOptions,
  defaultSizeOptions,
  sneakerSizeOptions,
} from "@/constants/filters-presets";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductGallery } from "@/components/pages/ProductPage/ProductGallery";
import { ItemsCarousel } from "@/components/products/ProductCarousel";
import { ProductCard } from "@/components/products/ProductCard";

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

  useEffect(() => {
    if (!selectedSize && sizeOptions.length) {
      setSelectedSize(sizeOptions[0].id);
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
    <section className="w-full my-16 sm:my-16 md:my-17 lg:my-17 xl:my-18 2xl:my-18">
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
        <p className="text-destructive">loading</p>
      ) : isError ? (
        <p className="text-destructive">error</p>
      ) : (
        <section className="flex flex-col gap-10 mt-6">
          <div className="grid w-full gap-2 lg:grid-cols-2 items-start">
            <Card>
              <CardContent className="p-4">
                <ProductGallery images={galleryImages} title={product?.title} />
              </CardContent>
            </Card>
            <div className="flex flex-col gap-2">
              <Card className="p-4">
                <CardTitle className="text-lg">{product?.title}</CardTitle>
                <CardContent className="w-full px-0 flex justify-between">
                  <div className="flex items-center gap-2">
                    {product?.rating?.rate ? (
                      <>
                        <RatingStars value={product.rating.rate} />
                        <span className="text-sm font-medium">
                          {product.rating.rate.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({product.rating.count})
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No rating
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Код: {product?.id}
                  </div>
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardContent className="w-full px-0 flex flex-col justify-between">
                  <div className="text-xs md:text-sm px-4 pb-3 flex w-full justify-between item">
                    <div>
                      <span className="text-muted-foreground"> Продавець:</span>{" "}
                      sdsffs
                    </div>
                    <ChevronRight
                      size={20}
                      className="transition-colors duration-150 hover:text-primary hover:cursor-pointer"
                    />
                  </div>
                  <Separator className="w-full bg-muted-foreground" />
                  <div className="px-4 pt-3 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-5">
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm text-primary">
                          Є в наявности
                        </span>
                        <span className="text-3xl">{product?.price} $</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button className="bg-primary">
                          <ShoppingCart /> Купити
                        </Button>
                        <Toggle
                          aria-label={
                            isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                          pressed={isFavorite}
                          onPressedChange={handleFavoriteToggle}
                          variant="outline"
                          size="lg"
                          className="rounded-full bg-muted/90 hover:bg-chart-1 data-[state=on]:bg-rose-100 data-[state=on]:text-rose-600 transition-colors duration-150 hover:cursor-pointer"
                        >
                          <Heart className="size-5" />
                        </Toggle>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardContent className="px-0">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs md:text-sm text-muted-foreground">
                      Розмір
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((opt) => (
                        <Button
                          key={opt.id}
                          type="button"
                          variant={
                            selectedSize === opt.id ? "default" : "outline"
                          }
                          size="sm"
                          className="min-w-16"
                          onClick={() => setSelectedSize(opt.id)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="px-4 py-0">
                <CardContent className="px-0">
                  <Accordion
                    type="single"
                    collapsible={true}
                    className="w-full"
                    defaultValue="item-1"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Product Information</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        <p>
                          Our flagship product combines cutting-edge technology
                          with sleek design. Built with premium materials, it
                          offers unparalleled performance and reliability.
                        </p>
                        <p>
                          Key features include advanced processing capabilities,
                          and an intuitive user interface designed for both
                          beginners and experts.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Shipping Details</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        <p>
                          We offer worldwide shipping through trusted courier
                          partners. Standard delivery takes 3-5 business days,
                          while express shipping ensures delivery within 1-2
                          business days.
                        </p>
                        <p>
                          All orders are carefully packaged and fully insured.
                          Track your shipment in real-time through our dedicated
                          tracking portal.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Return Policy</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        <p>
                          We stand behind our products with a comprehensive
                          30-day return policy. If you&apos;re not completely
                          satisfied, simply return the item in its original
                          condition.
                        </p>
                        <p>
                          Our hassle-free return process includes free return
                          shipping and full refunds processed within 48 hours of
                          receiving the returned item.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
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

            <Card className="p-4">
              <CardContent className="px-0">
                <div className="grid gap-4 md:grid-cols-[1fr_2fr] items-start">
                  <div className="text-2xl font-semibold">Характеристики</div>
                  <div>
                    {characteristics.map(({ label, value }) => (
                      <div className="grid gap-3 md:grid-cols-[1fr_1fr] items-start text-sm leading-relaxed">
                        <div key={label} className={`flex gap-3 py-2 `}>
                          <span className="text-muted-foreground">{label}</span>
                          <span className="flex-1 border-b border-dashed border-border/70" />
                        </div>
                        <div
                          key={label}
                          className={`grid grid-cols-[1fr_auto] md:grid-cols-[1fr] gap-2 py-2 `}
                        >
                          <span className="text-foreground text-right md:text-left">
                            {value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
