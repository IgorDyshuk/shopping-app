import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CatalogSkeleton } from "@/components/layout/skeletons/CatalogSkeleton";
import { ItemsCarousel } from "@/components/products/ProductCarousel";
import { useFilteredProduct } from "@/hooks/api-hooks/useProducts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CATALOG_CATEGORIES } from "@/constants/catalog-categories";
import { useViewedProductsStore } from "@/stores/use-viewed-products";
import { ProductVariantCard } from "@/components/products/ProductVariantCard";

function Catalog() {
  const menCategory = CATALOG_CATEGORIES.men;
  const womenCategory = CATALOG_CATEGORIES.women;
  const clothingCategory = CATALOG_CATEGORIES.clothing;
  const electronicsCategory = CATALOG_CATEGORIES.electronics;
  const jeweleryCategory = CATALOG_CATEGORIES.jewelery;
  const { t } = useTranslation(["catalog", "common"]);

  const {
    data: menClothes,
    isLoading,
    isError,
  } = useFilteredProduct(menCategory);
  const { data: clothingAll } = useFilteredProduct(clothingCategory);
  const { data: womenClothes } = useFilteredProduct(womenCategory);
  const { data: electronics } = useFilteredProduct(electronicsCategory);
  const { data: jewelery } = useFilteredProduct(jeweleryCategory);

  const viewedProducts = useViewedProductsStore(
    (state) => state.viewedProducts
  );

  return (
    <section className="w-full my-18 xl:my-19">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home", { ns: "common" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {t("breadcrumb.catalog", { ns: "common" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-8 mt-3 xl:mt-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        {isLoading ? (
          <CatalogSkeleton />
        ) : isError ? (
          <p className="text-destructive">{t("error")}</p>
        ) : !menClothes ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20">
            <ItemsCarousel
              title={t("sections.clothing")}
              items={clothingAll ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, xs: 3, sm: 2, md: 3, lg: 4, xl: 4 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(clothingCategory)}`}
              controlsInline
              disableMobileCarousel
              renderItem={(product) => (
                <ProductVariantCard
                  variant="home"
                  inCarousel
                  key={product.id}
                  product={product}
                />
              )}
            />

            <ItemsCarousel
              title={t("sections.men")}
              items={menClothes ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, xs: 3, sm: 2, md: 3, lg: 4, xl: 4 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(menCategory)}`}
              controlsInline
              disableMobileCarousel
              renderItem={(product) => (
                <ProductVariantCard
                  variant="home"
                  inCarousel
                  key={product.id}
                  product={product}
                />
              )}
            />

            <ItemsCarousel
              title={t("sections.women")}
              items={womenClothes ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, xs: 3, sm: 2, md: 3, lg: 4, xl: 4 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(womenCategory)}`}
              controlsInline
              disableMobileCarousel
              renderItem={(product) => (
                <ProductVariantCard
                  variant="home"
                  inCarousel
                  key={product.id}
                  product={product}
                />
              )}
            />

            <ItemsCarousel
              title={t("sections.electronics")}
              items={electronics ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, xs: 3, sm: 2, md: 3, lg: 4, xl: 4 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(
                electronicsCategory
              )}`}
              controlsInline
              disableMobileCarousel
              renderItem={(product) => (
                <ProductVariantCard
                  variant="home"
                  inCarousel
                  key={product.id}
                  product={product}
                />
              )}
            />

            <ItemsCarousel
              title={t("sections.jewelery")}
              items={jewelery ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, xs: 3, sm: 2, md: 3, lg: 4, xl: 4 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(jeweleryCategory)}`}
              controlsInline
              disableMobileCarousel
              renderItem={(product) => (
                <ProductVariantCard
                  variant="home"
                  inCarousel
                  key={product.id}
                  product={product}
                />
              )}
            />
            {viewedProducts.length > 0 && (
              <ItemsCarousel
                title={t("carousels.recentlyViewed", { ns: "common" })}
                items={viewedProducts}
                getItemKey={(product) => product.id}
                perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 6 }}
                peekNext
                controlsInline
                renderItem={(product) => (
                  <ProductVariantCard variant="small" product={product} />
                )}
              />
            )}
            {/* <pre className="max-h-[480px] overflow-auto rounded bg-muted p-3 text-xs leading-relaxed">
              {JSON.stringify(products, null, 2)}
            </pre> */}
          </div>
        )}
      </div>
    </section>
  );
}

export default Catalog;
