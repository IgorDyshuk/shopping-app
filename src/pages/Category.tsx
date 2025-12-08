import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { HomeSkeleton } from "@/components/layout/skeletons/HomeSkeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { useFilteredProduct } from "@/hooks/useProducts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Category() {
  const { category = "" } = useParams<{ category: string }>();
  const decodedCategory = useMemo(
    () => decodeURIComponent(category),
    [category]
  );
  const capitalizedCategory = useMemo(() => {
    if (!decodedCategory) return "Category";
    return decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);
  }, [decodedCategory]);

  const {
    data: products,
    isLoading,
    isError,
  } = useFilteredProduct(decodedCategory);

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
            <BreadcrumbLink asChild>
              <Link to="/catalog">Catalog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{decodedCategory || "Category"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2 my-7.5">
        <h1 className="text-3xl font-semibold">{capitalizedCategory}</h1>
        <p className="text-muted-foreground">
          Products filtered by category: {decodedCategory || "all"}
        </p>
      </div>

      {isLoading ? (
        <HomeSkeleton />
      ) : isError ? (
        <p className="text-destructive">Failed to load products.</p>
      ) : !products || products.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Category;
