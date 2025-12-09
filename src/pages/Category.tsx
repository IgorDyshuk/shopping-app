import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { HomeSkeleton } from "@/components/layout/skeletons/HomeSkeleton";
import { CategorySkeleton } from "@/components/layout/skeletons/CategorySkeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { useFilteredProduct } from "@/hooks/useProducts";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";

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
  const [sortBy, setSortBy] = useState("popularity");
  const [layout, setLayout] = useState<"dense" | "spacious">("dense");
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const copy = [...products];
    switch (sortBy) {
      case "price-asc":
        return copy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return copy.sort((a, b) => b.price - a.price);
      case "rating":
        return copy.sort(
          (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)
        );
      case "popularity":
        return copy.sort(
          (a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0)
        );
      default:
        return copy;
    }
  }, [products, sortBy]);

  useEffect(() => {
    if (isSmallScreen) {
      setLayout("spacious");
    }
  }, [isSmallScreen]);

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

      {isLoading ? (
        <CategorySkeleton />
      ) : isError ? (
        <p className="text-destructive">Failed to load products.</p>
      ) : !sortedProducts || sortedProducts.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="flex flex-col gap-4 my-7.5">
          <div>
            <h1 className="text-3xl font-semibold">{capitalizedCategory}</h1>
            <p className="text-muted-foreground">
              Products filtered by category: {decodedCategory || "all"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="hidden sm:block text-sm text-muted-foreground mb-2">
              Found {sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "item" : "items"}
            </p>
            <div className="flex  flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <NativeSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <NativeSelectOption value="price-asc">
                  Price: Low to High
                </NativeSelectOption>
                <NativeSelectOption value="price-desc">
                  Price: High to Low
                </NativeSelectOption>
                <NativeSelectOption value="rating">Rating</NativeSelectOption>
                <NativeSelectOption value="popularity">
                  Popularity
                </NativeSelectOption>
              </NativeSelect>
              <div className="hidden md:inline-flex overflow-hidden rounded-md border">
                <Button
                  type="button"
                  variant={layout === "spacious" ? "secondary" : "ghost"}
                  // size="icon-lg"
                  className="rounded-none"
                  onClick={() => setLayout("spacious")}
                >
                  <ListChevronsDownUp />
                </Button>
                <Button
                  type="button"
                  variant={layout === "dense" ? "secondary" : "ghost"}
                  // size="icon-lg"
                  className="rounded-none border-r"
                  onClick={() => setLayout("dense")}
                >
                  <ListChevronsUpDown />
                </Button>
              </div>
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-4 ${
              layout === "dense"
                ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* <pre className="max-h-[480px] overflow-auto rounded bg-muted p-3 text-xs leading-relaxed">
               {JSON.stringify(products, null, 2)}
             </pre> */}
        </div>
      )}
    </section>
  );
}

export default Category;
