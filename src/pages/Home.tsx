import { useTranslation } from "react-i18next";

import { useProducts } from "@/hooks/api-hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { ItemsCarousel } from "@/components/products/ProductCarousel";
import { HomeSkeleton } from "@/components/layout/skeletons/HomeSkeleton";
import { useViewedProductsStore } from "@/stores/use-viewed-products";
import { TOP_BLOGGER_IDS } from "@/constants/blogger-ids";
import { useTopArtists } from "@/hooks/api-hooks/useArtists";
import { BloggerHomeCard } from "@/components/pages/Blogger/BloggerHomeCard";

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
  const showSkeleton =
    isLoading || isArtistLoading || !topArtists || topArtists.length === 0;

  return (
    <section className="flex w-full flex-col gap-8 my-20 sm:my-22 md:my-24 lg:my-26 xl:my-28 2xl:my-30">
      <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20">
        {showSkeleton ? (
          <HomeSkeleton />
        ) : isError || isArtistError ? (
          <p className="text-destructive">{t("error")}</p>
        ) : (
          <>
            <ItemsCarousel
              title={t("carousels.popularBloggers")}
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

            <ItemsCarousel
              title={t("carousels.popularPicks")}
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 5 }}
              peekNext={true}
              viewAllLink="#"
              controlsInline
              renderItem={(product) => <ProductCard product={product} />}
            />

            <ItemsCarousel
              title={t("carousels.trending")}
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 3, sm: 3, md: 3, lg: 3, xl: 3 }}
              viewAllLink="#"
              controlsInline
              loop
              renderItem={(product) => <ProductCard product={product} />}
            />

            <ItemsCarousel
              title={t("carousels.howItWorks")}
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
              controlsInline={false}
              renderItem={(product) => <ProductCard product={product} />}
            />

            <ItemsCarousel
              title={t("carousels.newArrivals")}
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, sm: 2, md: 3, lg: 4, xl: 6 }}
              peekNext={true}
              viewAllLink="#"
              controlsInline
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
                  <ProductCard product={product as any} />
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
