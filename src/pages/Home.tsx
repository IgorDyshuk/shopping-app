import { useTranslation } from "react-i18next";

import { useProducts } from "@/hooks/api-hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { ItemsCarousel } from "@/components/products/ProductCarousel";
import { HomeSkeleton } from "@/components/layout/skeletons/HomeSkeleton";
import { useViewedProductsStore } from "@/stores/use-viewed-products";
import { TOP_BLOGGER_IDS } from "@/constants/blogger-ids";
import { useTopArtists } from "@/hooks/api-hooks/useArtists";
import { BloggerHomeCard } from "@/components/pages/Blogger/BloggerHomeCard";
import { ProductVariantCard } from "@/components/products/ProductVariantCard";
import { BloggerCard } from "@/components/pages/Blogger/BloggerCard";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";

function Home() {
  const { data: products, isLoading, isError } = useProducts();
  const {
    data: topArtists,
    isLoading: isArtistLoading,
    isError: isArtistError,
  } = useTopArtists(TOP_BLOGGER_IDS);
  const { t } = useTranslation(["home", "common"]);
  const viewedProducts = useViewedProductsStore(
    (state) => state.viewedProducts
  );
  const isMdOnly = useMediaQuery("(min-width: 768px) and (max-width: 1280px)");
  const isSmOnly = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  const productsArrivalsCount = isMdOnly ? 6 : 8;
  const bloggersArrivalsCount = isMdOnly ? (isSmOnly ? 6 : 8) : 10;
  const showSkeleton =
    isLoading || isArtistLoading || !topArtists || topArtists.length === 0;

  return (
    <section className="flex w-full flex-col gap-8 my-20 sm:my-22 md:my-24 lg:my-13 xl:my-15 2xl:my-30  ">
      <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20">
        {showSkeleton ? (
          <HomeSkeleton />
        ) : isError || isArtistError ? (
          <p className="text-destructive">{t("error")}</p>
        ) : (
          <>
            <ItemsCarousel
              title={t("")}
              items={(topArtists ?? []).filter(Boolean)}
              getItemKey={(artist, idx) => artist?.id ?? idx}
              autoplay
              loop
              perRow={{ base: 1, md: 2 }}
              controlsInline={false}
              renderItem={(artist) =>
                artist ? (
                  <BloggerHomeCard artist={artist} key={artist?.id} />
                ) : null
              }
            />

            <div className="flex flex-col gap-0 md:gap-1">
              <h1 className="text-2xl">{t("carousels.newArrivals")}</h1>
              <div className="flex overflow-x-auto py-3 md:py-6 md:grid md:grid-cols-3 md:gap-y-7 md:overflow-visible xl:grid-cols-4">
                {products?.slice(0, productsArrivalsCount).map((product) => (
                  <div
                    key={product.id}
                    className="min-w-60 sm:min-w-[280px] md:min-w-0"
                  >
                    <ProductVariantCard
                      variant="home"
                      inCarousel={false}
                      product={product}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">{t("carousels.popularBloggers")}</h1>
              <div className="flex overflow-x-auto gap-1 py-2 md:py-6 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {(topArtists ?? [])
                  .filter(Boolean)
                  .slice(0, bloggersArrivalsCount)
                  .map((artist, idx) => (
                    <div
                      key={artist?.id ?? idx}
                      className="min-w-[220px] sm:min-w-[260px] md:min-w-0"
                    >
                      <BloggerCard artist={artist} />
                    </div>
                  ))}
              </div>
            </div>

            <ItemsCarousel
              title={t("carousels.popularPicks")}
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, xs: 3, sm: 2, md: 3, lg: 4, xl: 4 }}
              peekNext={true}
              viewAllLink="#"
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
              title={t("carousels.trending")}
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, xs: 3, sm: 2, md: 3, lg: 4, xl: 4 }}
              peekNext={true}
              viewAllLink="#"
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
              title={t("carousels.howItWorks")}
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
              controlsInline={false}
              renderItem={(product) => <ProductCard product={product} />}
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
                <ProductVariantCard
                  variant="small"
                  product={product as any}
                />
              )}
            />
          )}
          </>
        )}
      </div>
    </section>
  );
}

export default Home;
