import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useProduct } from "@/hooks/api-hooks/useProducts";
import { useViewedProductsStore } from "@/stores/use-viewed-products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ProductPage() {
  const { id, category = "" } = useParams<{ id: string; category: string }>();
  const productId = useMemo(() => Number(id), [id]);
  const addViewedProduct = useViewedProductsStore(
    (state) => state.addViewedProduct
  );

  const {
    data: product,
    isLoading,
    isError,
  } = useProduct(Number.isFinite(productId) ? productId : undefined);
  const { t } = useTranslation("common");

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

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isLoading ? "Loading..." : product?.title ?? "Product"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[320px_minmax(0,1fr)] md:items-start md:gap-6">
              <div className="flex items-center justify-center rounded-lg border bg-muted p-4">
                {isLoading ? (
                  <div className="h-64 w-full animate-pulse rounded bg-muted-foreground/20" />
                ) : product?.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-64 w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">No image</div>
                )}
              </div>

              <div className="space-y-4">
                {isError && (
                  <p className="text-destructive">
                    Failed to load product details.
                  </p>
                )}
                {!isLoading && product && (
                  <>
                    <p className="text-lg font-semibold">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Category: {product.category}
                    </div>
                    {product.rating && (
                      <div className="text-sm text-muted-foreground">
                        Rating: {product.rating.rate} ({product.rating.count}{" "}
                        reviews)
                      </div>
                    )}
                    <div className="flex gap-3">
                      <Button variant="default">Add to cart</Button>
                      <Button variant="outline">Add to wishlist</Button>
                    </div>
                  </>
                )}
                {isLoading && (
                  <div className="space-y-2">
                    <div className="h-6 w-40 animate-pulse rounded bg-muted-foreground/20" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/20" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted-foreground/20" />
                    <div className="h-10 w-48 animate-pulse rounded bg-muted-foreground/20" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ProductPage;
