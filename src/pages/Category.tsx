import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { CategorySkeleton } from "@/components/layout/skeletons/CategorySkeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilters } from "@/components/categories/CategoryFilters";
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
  const defaultSizeOptions = [
    { id: "XS", label: "XS" },
    { id: "S", label: "S" },
    { id: "M", label: "M" },
    { id: "L", label: "L" },
    { id: "XL", label: "XL" },
  ];

  const sneakerSizeOptions = [
    { id: "EU36", label: "EU 36" },
    { id: "EU38", label: "EU 38" },
    { id: "EU40", label: "EU 40" },
    { id: "EU42", label: "EU 42" },
    { id: "EU44", label: "EU 44" },
  ];

  const accessorySizeOptions = [
    { id: "ONE", label: "One size" },
    { id: "S", label: "Small" },
    { id: "M", label: "Medium" },
    { id: "L", label: "Large" },
  ];

  const conditionOptions = [
    { id: "new", label: "New" },
    { id: "used", label: "Pre-owned" },
  ];

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
  const presetKey = useMemo(() => {
    const lower = decodedCategory.toLowerCase();
    if (lower.includes("cloth")) return "clothing";
    if (lower.includes("shoe") || lower.includes("sneaker")) return "sneakers";
    if (lower.includes("access")) return "accessories";
    return "default";
  }, [decodedCategory]);

  const presetCategoryOptions = useMemo(
    () => ({
      clothing: [
        { id: "tops", label: "Tops" },
        { id: "outerwear", label: "Outerwear" },
        { id: "bottoms", label: "Bottoms" },
        { id: "dresses", label: "Dresses" },
        { id: "sets", label: "Sets" },
      ],
      sneakers: [
        { id: "lifestyle", label: "Lifestyle" },
        { id: "running", label: "Running" },
        { id: "basketball", label: "Basketball" },
        { id: "trail", label: "Trail / Hiking" },
      ],
      accessories: [
        { id: "bags", label: "Bags" },
        { id: "hats", label: "Hats & Caps" },
        { id: "jewelry", label: "Jewelry" },
        { id: "tech", label: "Tech accessories" },
      ],
    }),
    []
  );

  const categoryOptions = useMemo(() => {
    if (presetKey === "clothing") return presetCategoryOptions.clothing;
    if (presetKey === "sneakers") return presetCategoryOptions.sneakers;
    if (presetKey === "accessories") return presetCategoryOptions.accessories;

    return [
      ...new Set(
        (products ?? []).map((p) => p.category || "Other").filter(Boolean)
      ),
    ].map((value) => ({
      id: value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    }));
  }, [presetKey, presetCategoryOptions, products]);

  const sizeOptions = useMemo(() => {
    if (presetKey === "sneakers") return sneakerSizeOptions;
    if (presetKey === "accessories") return accessorySizeOptions;
    return defaultSizeOptions;
  }, [presetKey]);
  const [sortBy, setSortBy] = useState("popularity");
  const [layout, setLayout] = useState<"dense" | "spacious">("dense");
  const [activeCategoryFilters, setActiveCategoryFilters] = useState<
    Set<string>
  >(() => new Set());
  const [activeSizeFilters, setActiveSizeFilters] = useState<Set<string>>(
    () => new Set()
  );
  const [activeConditionFilters, setActiveConditionFilters] = useState<
    Set<string>
  >(() => new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const deriveSize = (id: number) => sizeOptions[id % sizeOptions.length].id;
  const deriveCondition = (id: number) =>
    conditionOptions[id % conditionOptions.length].id;

  const [minPrice, maxPrice] = useMemo(() => {
    if (!products || products.length === 0) return [0, 0];
    const prices = products.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  useEffect(() => {
    if (minPrice === 0 && maxPrice === 0) return;
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const updatePriceRange = (nextMin: number, nextMax: number) => {
    if (minPrice === 0 && maxPrice === 0) return;
    const clampedMin = Math.max(minPrice, Math.min(nextMin, maxPrice));
    const clampedMax = Math.min(maxPrice, Math.max(nextMax, minPrice));
    if (clampedMin > clampedMax) {
      setPriceRange([clampedMax, clampedMax]);
    } else {
      setPriceRange([clampedMin, clampedMax]);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const hasCategoryFilters = activeCategoryFilters.size > 0;
    const hasPriceRange =
      priceRange[0] !== minPrice || priceRange[1] !== maxPrice;
    const hasSizeFilters = activeSizeFilters.size > 0;
    const hasConditionFilters = activeConditionFilters.size > 0;

    return products.filter((p) => {
      const categoryPass =
        !hasCategoryFilters || activeCategoryFilters.has(p.category);

      const pricePass =
        !hasPriceRange ||
        (p.price >= priceRange[0] && p.price <= priceRange[1]);

      const sizePass =
        !hasSizeFilters ||
        Array.from(activeSizeFilters).some(
          (id) => deriveSize(p.id) === id || !id
        );

      const conditionPass =
        !hasConditionFilters ||
        Array.from(activeConditionFilters).some(
          (id) => deriveCondition(p.id) === id || !id
        );

      return categoryPass && pricePass && sizePass && conditionPass;
    });
  }, [
    products,
    activeCategoryFilters,
    activeSizeFilters,
    activeConditionFilters,
    priceRange,
    minPrice,
    maxPrice,
    deriveCondition,
    deriveSize,
  ]);

  const sortedProducts = useMemo(() => {
    if (!filteredProducts) return [];
    const copy = [...filteredProducts];
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
  }, [filteredProducts, sortBy]);

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
      ) : (
        <div className="flex flex-col gap-6 my-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">{capitalizedCategory}</h1>
              <p className="text-muted-foreground">
                Products filtered by category: {decodedCategory || "all"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end">
              <p className="hidden sm:block text-sm text-muted-foreground mb-2">
                Found {sortedProducts.length}{" "}
                {sortedProducts.length === 1 ? "item" : "items"}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
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
                    className="rounded-none"
                    onClick={() => setLayout("spacious")}
                  >
                    <ListChevronsDownUp />
                  </Button>
                  <Button
                    type="button"
                    variant={layout === "dense" ? "secondary" : "ghost"}
                    className="rounded-none border-r"
                    onClick={() => setLayout("dense")}
                  >
                    <ListChevronsUpDown />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-8">
              <CategoryFilters
                categoryOptions={categoryOptions}
                sizeOptions={sizeOptions}
                conditionOptions={conditionOptions}
                activeCategoryFilters={activeCategoryFilters}
                activeSizeFilters={activeSizeFilters}
                activeConditionFilters={activeConditionFilters}
                priceRange={priceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onCategoryToggle={(id, checked) =>
                  setActiveCategoryFilters((prev) => {
                    const next = new Set(prev);
                    if (checked) next.add(id);
                    else next.delete(id);
                    return next;
                  })
                }
                onSizeToggle={(id, checked) =>
                  setActiveSizeFilters((prev) => {
                    const next = new Set(prev);
                    if (checked) next.add(id);
                    else next.delete(id);
                    return next;
                  })
                }
                onConditionToggle={(id, checked) =>
                  setActiveConditionFilters((prev) => {
                    const next = new Set(prev);
                    if (checked) next.add(id);
                    else next.delete(id);
                    return next;
                  })
                }
                onPriceChange={updatePriceRange}
                className="self-start lg:sticky lg:top-24"
              />
              <div className="space-y-4">
                <div
                  className={`grid grid-cols-2 gap-4 ${
                    layout === "dense"
                      ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                      : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }`}
                >
                  {sortedProducts.length === 0 ? (
                    <div className="col-span-full rounded-lg border border-dashed bg-muted/40 px-4 py-8 text-center text-muted-foreground">
                      No products found for these filters.
                    </div>
                  ) : (
                    sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Category;
