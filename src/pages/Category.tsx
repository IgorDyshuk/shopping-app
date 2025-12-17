import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CategorySkeleton } from "@/components/layout/skeletons/CategorySkeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilters } from "@/components/categories/CategoryFilters";
import { useFilteredProduct } from "@/hooks/api-hooks/useProducts";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDownUp,
  ListChevronsDownUp,
  ListChevronsUpDown,
} from "lucide-react";
import { CategoryFiltersDrawer } from "@/components/categories/CategoryFiltersDrawer";
import {
  accessorySizeOptions,
  conditionOptions,
  defaultSizeOptions,
  presetCategoryOptions,
  sneakerSizeOptions,
  genderOptions,
} from "@/constants/filters-presets";
import { FilterChips } from "@/components/categories/FilterChips";
import { useFilterChips } from "@/hooks/category-hooks/use-filter-chips";
import { useSortOptions } from "@/hooks/category-hooks/use-sort-options";
import { deriveCategoryId } from "@/utils/derive-product-category";

function Category() {
  const { category = "" } = useParams<{ category: string }>();
  const { t } = useTranslation(["category", "common"]);
  const decodedCategory = useMemo(
    () => decodeURIComponent(category),
    [category]
  );
  const categoryNameKey = useMemo(() => {
    const lower = decodedCategory.toLowerCase();
    if (lower.includes("men")) return "categories.men";
    if (lower.includes("women")) return "categories.women";
    if (lower.includes("electron")) return "categories.electronics";
    if (lower.includes("jewel")) return "categories.jewelery";
    if (lower.includes("cloth")) return "categories.clothing";
    return "categories.default";
  }, [decodedCategory]);

  const capitalizedCategory = useMemo(() => {
    const key = categoryNameKey;
    if (key) return t(key);
    if (!decodedCategory) return t("categories.default");
    return decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);
  }, [decodedCategory, categoryNameKey, t]);

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

  const genderOptionsForCategory = useMemo(() => {
    const lower = decodedCategory.toLowerCase();
    if (lower.includes("men") || lower.includes("women")) return [];
    return presetKey === "clothing" ? genderOptions : [];
  }, [presetKey, decodedCategory]);

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
  const [activeGenderFilters, setActiveGenderFilters] = useState<Set<string>>(
    () => new Set()
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const isFilterDrawer = useMediaQuery("(max-width: 1023px)");

  const deriveSize = (id: number) => sizeOptions[id % sizeOptions.length].id;
  const deriveCondition = (id: number) =>
    conditionOptions[id % conditionOptions.length].id;
  const getProductGender = (p: { category?: string }) => {
    const cat = p.category?.toLowerCase() ?? "";
    if (cat.includes("women")) return "women";
    if (cat.includes("men")) return "men";
    return "unisex";
  };

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

  const activeFiltersCount = useMemo(() => {
    const priceFiltered =
      maxPrice > minPrice &&
      (priceRange[0] !== minPrice || priceRange[1] !== maxPrice);
    return (
      activeCategoryFilters.size +
      activeSizeFilters.size +
      activeConditionFilters.size +
      activeGenderFilters.size +
      (priceFiltered ? 1 : 0)
    );
  }, [
    activeCategoryFilters.size,
    activeSizeFilters.size,
    activeConditionFilters.size,
    activeGenderFilters.size,
    priceRange,
    minPrice,
    maxPrice,
  ]);

  const chips = useFilterChips({
    categoryOptions,
    sizeOptions,
    conditionOptions,
    categorySet: activeCategoryFilters,
    sizeSet: activeSizeFilters,
    conditionSet: activeConditionFilters,
    genderOptions: genderOptionsForCategory,
    genderSet: activeGenderFilters,
    priceRange,
    minPrice,
    maxPrice,
    priceLabel: t("filters.range", {
      min: priceRange[0].toFixed(0),
      max: priceRange[1].toFixed(0),
    }),
    onClearPrice: () => setPriceRange([minPrice, maxPrice]),
    makeClearCategory: (id) => () =>
      setActiveCategoryFilters((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    makeClearSize: (id) => () =>
      setActiveSizeFilters((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    makeClearCondition: (id) => () =>
      setActiveConditionFilters((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    makeClearGender: (id) => () =>
      setActiveGenderFilters((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    getLabel: useCallback(
      (opt?: { label: string; labelKey?: string }) =>
        opt ? (opt.labelKey ? t(opt.labelKey) : opt.label) : "",
      [t]
    ),
  });

  const sortOptions = useSortOptions();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const hasCategoryFilters = activeCategoryFilters.size > 0;
    const hasPriceRange =
      priceRange[0] !== minPrice || priceRange[1] !== maxPrice;
    const hasSizeFilters = activeSizeFilters.size > 0;
    const hasConditionFilters = activeConditionFilters.size > 0;
    const hasGenderFilters = activeGenderFilters.size > 0;

    return products.filter((p) => {
      const categoryId = deriveCategoryId(p);

      const categoryPass =
        !hasCategoryFilters || activeCategoryFilters.has(categoryId);

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

      const genderPass =
        !hasGenderFilters || activeGenderFilters.has(getProductGender(p));

      return (
        categoryPass && pricePass && sizePass && conditionPass && genderPass
      );
    });
  }, [
    products,
    activeCategoryFilters,
    activeSizeFilters,
    activeConditionFilters,
    activeGenderFilters,
    priceRange,
    minPrice,
    maxPrice,
    deriveCondition,
    deriveSize,
    getProductGender,
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
              <Link to="/">{t("breadcrumb.home", { ns: "common" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/catalog">
                {t("breadcrumb.catalog", { ns: "common" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {capitalizedCategory || t("categories.default")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <CategorySkeleton />
      ) : isError ? (
        <p className="text-destructive">{t("loadingError")}</p>
      ) : (
        <div className="flex flex-col gap-6 my-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">{capitalizedCategory}</h1>
              <p className="text-muted-foreground">
                {t("subtitle", { category: decodedCategory || "all" })}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center md:items-end">
              <div className="flex items-center gap-3">
                {isFilterDrawer && (
                  <CategoryFiltersDrawer
                    label={[
                      activeFiltersCount ? `(${activeFiltersCount})` : "",
                      `${sortedProducts.length} ${
                        sortedProducts.length === 1
                          ? t("items.singular")
                          : t("items.plural")
                      }`,
                    ]}
                    open={filtersOpen}
                    onOpenChange={setFiltersOpen}
                    categoryOptions={categoryOptions}
                    sizeOptions={sizeOptions}
                    conditionOptions={conditionOptions}
                    genderOptions={genderOptionsForCategory}
                    activeCategoryFilters={activeCategoryFilters}
                    activeSizeFilters={activeSizeFilters}
                    activeConditionFilters={activeConditionFilters}
                    activeGenderFilters={activeGenderFilters}
                    priceRange={priceRange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onApply={({
                      categories,
                      sizes,
                      conditions,
                      genders,
                      priceRange,
                    }) => {
                      setActiveCategoryFilters(categories);
                      setActiveSizeFilters(sizes);
                      setActiveConditionFilters(conditions);
                      setActiveGenderFilters(genders ?? new Set());
                      setPriceRange(priceRange);
                    }}
                  />
                )}
                {!isFilterDrawer && (
                  <>
                    <p className="hidden sm:block text-sm text-muted-foreground">
                      {t("found", {
                        count: sortedProducts.length,
                        itemLabel:
                          sortedProducts.length === 1
                            ? t("items.singular")
                            : t("items.plural"),
                      })}
                    </p>
                    <FilterChips
                      chips={chips}
                      onClearAll={() => {
                        setActiveCategoryFilters(new Set());
                        setActiveSizeFilters(new Set());
                        setActiveConditionFilters(new Set());
                        setActiveGenderFilters(new Set());
                        setPriceRange([minPrice, maxPrice]);
                      }}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="min-w-[60px] justify-start gap-2 px-4 py-2"
                    >
                      <ArrowDownUp
                        className="size-5 lg:size-6 text-primary"
                        strokeWidth={2.5}
                      />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="">{t("sortedLabel")}</span>
                        <span className="text-muted-foreground text-xs">
                          {
                            sortOptions.find(
                              (option) => option.value === sortBy
                            )?.label
                          }
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={
                          sortBy === option.value
                            ? "font-medium text-primary"
                            : undefined
                        }
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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

            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
              {!isFilterDrawer && (
                <CategoryFilters
                  categoryOptions={categoryOptions}
                  sizeOptions={sizeOptions}
                  conditionOptions={conditionOptions}
                  genderOptions={genderOptionsForCategory}
                  activeCategoryFilters={activeCategoryFilters}
                  activeSizeFilters={activeSizeFilters}
                  activeConditionFilters={activeConditionFilters}
                  activeGenderFilters={activeGenderFilters}
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
                  onGenderToggle={(id, checked) =>
                    setActiveGenderFilters((prev) => {
                      const next = new Set(prev);
                      if (checked) next.add(id);
                      else next.delete(id);
                      return next;
                    })
                  }
                  onPriceChange={updatePriceRange}
                />
              )}
              <div className="space-y-4">
                <div
                  className={`grid grid-cols-2 gap-0 md:gap-2 ${
                    layout === "dense"
                      ? "md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                      : "md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  }`}
                >
                  {sortedProducts.length === 0 ? (
                    <div className="col-span-full rounded-lg border border-dashed bg-muted/40 px-4 py-8 text-center text-muted-foreground">
                      {t("empty")}
                    </div>
                  ) : (
                    sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  )}
                </div>

                {/* <pre className="max-h-[480px] overflow-auto rounded bg-muted p-3 text-xs leading-relaxed">
                  {JSON.stringify(products, null, 2)}
                </pre> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Category;
