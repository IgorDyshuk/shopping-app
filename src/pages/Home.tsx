import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { ItemsCarousel } from "@/components/products/ProductCarousel";
import { HomeSkeleton } from "@/components/layout/skeletons/HomeSkeleton";

function Home() {
  const { data: products, isLoading, isError } = useProducts();

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 mt-6 md:mt-8 xl:mt-10 2xl:mt-12 px-3">
      <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20">
        {isLoading ? (
          <HomeSkeleton />
        ) : isError ? (
          <p className="text-destructive">Failed to load products.</p>
        ) : (
          <>
            <ItemsCarousel
              title="Products"
              items={products ?? []}
              getItemKey={(product) => product.id}
              autoplay
              perRow={{ base: 1 }}
              controlsInline={false}
              renderItem={(product) => (
                <ProductCard product={product} bordered />
              )}
            />

            <ItemsCarousel
              title="Popular picks"
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, sm: 2, md: 3, lg: 4, xl: 6 }}
              peekNext={true}
              controlsInline
              renderItem={(product) => <ProductCard product={product} />}
            />

            <ItemsCarousel
              title="Trending now"
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, sm: 2, md: 2, lg: 2, xl: 2 }}
              controlsInline
              renderItem={(product) => <ProductCard product={product} />}
            />

            <ItemsCarousel
              title="New arrivals"
              items={products ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, sm: 2, md: 3, lg: 4, xl: 6 }}
              peekNext={true}
              controlsInline
              renderItem={(product) => <ProductCard product={product} />}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default Home;
