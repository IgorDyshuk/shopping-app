import { Link } from "react-router-dom";

import { HomeSkeleton } from "@/components/layout/skeletons/HomeSkeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { ItemsCarousel } from "@/components/products/ProductCarousel";
import { useFilteredProduct } from "@/hooks/useProducts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Catalog() {
  const menCategory = "men's clothing";
  const womenCategory = "women's clothing";
  const electronicsCategory = "electronics";
  const jeweleryCategory = "jewelery";

  const {
    data: menClothes,
    isLoading,
    isError,
  } = useFilteredProduct(menCategory);
  const { data: womenClothes } = useFilteredProduct(womenCategory);
  const { data: electronics } = useFilteredProduct(electronicsCategory);
  const { data: jewelery } = useFilteredProduct(jeweleryCategory);

  return (
    <section className="w-full my-16 sm:my-16 md:my-17 lg:my-17 xl:my-18 2xl:my-18">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Catalog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-8 my-7.5">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Catalog</h1>
          <p className="text-muted-foreground">All we have</p>
        </div>

        {isLoading ? (
          <HomeSkeleton />
        ) : isError ? (
          <p className="text-destructive">Failed to load product.</p>
        ) : !menClothes ? (
          <p className="text-muted-foreground">No products found.</p>
        ) : (
          <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20">
            <ItemsCarousel
              title="Men's clothing"
              items={menClothes ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 5 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(menCategory)}`}
              controlsInline
              renderItem={(product) => <ProductCard product={product} />}
            />
            <ItemsCarousel
              title="Women's clothing"
              items={womenClothes ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 5 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(womenCategory)}`}
              controlsInline
              renderItem={(product) => <ProductCard product={product} />}
            />
            <ItemsCarousel
              title="Electronics"
              items={electronics ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 5 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(
                electronicsCategory
              )}`}
              controlsInline
              renderItem={(product) => <ProductCard product={product} />}
            />
            <ItemsCarousel
              title="Jewelerys"
              items={jewelery ?? []}
              getItemKey={(product) => product.id}
              perRow={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 5 }}
              peekNext={true}
              viewAllLink={`/category/${encodeURIComponent(jeweleryCategory)}`}
              controlsInline
              renderItem={(product) => <ProductCard product={product} />}
            />
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
