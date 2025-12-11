import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { FilterOption } from "./CategoryFilters";
import { CategoryFilters } from "./CategoryFilters";
import { FilterChips } from "./FilterChips";
import { useFilterChips } from "@/hooks/category-hooks/use-filter-chips";
import { Funnel } from "lucide-react";

type CategoryFiltersDrawerProps = {
  label: [string, string];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryOptions: FilterOption[];
  sizeOptions: FilterOption[];
  conditionOptions: FilterOption[];
  genderOptions?: FilterOption[];
  activeCategoryFilters: Set<string>;
  activeSizeFilters: Set<string>;
  activeConditionFilters: Set<string>;
  activeGenderFilters?: Set<string>;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  onApply: (payload: {
    categories: Set<string>;
    sizes: Set<string>;
    conditions: Set<string>;
    genders?: Set<string>;
    priceRange: [number, number];
  }) => void;
};

export function CategoryFiltersDrawer({
  label,
  open,
  onOpenChange,
  categoryOptions,
  sizeOptions,
  conditionOptions,
  genderOptions,
  activeCategoryFilters,
  activeSizeFilters,
  activeConditionFilters,
  activeGenderFilters,
  priceRange,
  minPrice,
  maxPrice,
  onApply,
}: CategoryFiltersDrawerProps) {
  const [tempCategoryFilters, setTempCategoryFilters] = useState<Set<string>>(
    () => new Set()
  );
  const [tempSizeFilters, setTempSizeFilters] = useState<Set<string>>(
    () => new Set()
  );
  const [tempConditionFilters, setTempConditionFilters] = useState<Set<string>>(
    () => new Set()
  );
  const [tempGenderFilters, setTempGenderFilters] = useState<Set<string>>(
    () => new Set()
  );
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 0,
  ]);

  useEffect(() => {
    if (open) {
      setTempCategoryFilters(new Set(activeCategoryFilters));
      setTempSizeFilters(new Set(activeSizeFilters));
      setTempConditionFilters(new Set(activeConditionFilters));
      setTempGenderFilters(new Set(activeGenderFilters ?? []));
      setTempPriceRange(priceRange);
    }
  }, [
    open,
    activeCategoryFilters,
    activeSizeFilters,
    activeConditionFilters,
    activeGenderFilters,
    priceRange,
  ]);

  const updateTempPriceRange = (nextMin: number, nextMax: number) => {
    if (minPrice === 0 && maxPrice === 0) return;
    const clampedMin = Math.max(minPrice, Math.min(nextMin, maxPrice));
    const clampedMax = Math.min(maxPrice, Math.max(nextMax, minPrice));
    if (clampedMin > clampedMax) {
      setTempPriceRange([clampedMax, clampedMax]);
    } else {
      setTempPriceRange([clampedMin, clampedMax]);
    }
  };

  const handleApply = () => {
    onApply({
      categories: new Set(tempCategoryFilters),
      sizes: new Set(tempSizeFilters),
      conditions: new Set(tempConditionFilters),
      genders: new Set(tempGenderFilters),
      priceRange: tempPriceRange,
    });
    onOpenChange(false);
  };

  const chips = useFilterChips({
    categoryOptions,
    sizeOptions,
    conditionOptions,
    categorySet: tempCategoryFilters,
    sizeSet: tempSizeFilters,
    conditionSet: tempConditionFilters,
    genderOptions,
    genderSet: tempGenderFilters,
    priceRange: tempPriceRange,
    minPrice,
    maxPrice,
    onClearPrice: () => setTempPriceRange([minPrice, maxPrice]),
    makeClearCategory: (id) => () =>
      setTempCategoryFilters((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    makeClearSize: (id) => () =>
      setTempSizeFilters((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    makeClearCondition: (id) => () =>
      setTempConditionFilters((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    makeClearGender:
      genderOptions && tempGenderFilters
        ? (id) => () =>
            setTempGenderFilters((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            })
        : undefined,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="min-w-[60px] justify-start gap-2 px-4 py-2"
        >
          <Funnel className="size-5 lg:size-6 text-primary" strokeWidth={2.5} />
          <div className="flex flex-col items-start leading-tight">
            <span className="">Filters {label[0]}</span>
            <span className="text-muted-foreground text-xs">{label[1]}</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex-1 overflow-auto px-4 pb-4">
          <div className="pb-2">
            <FilterChips
              chips={chips}
              onClearAll={() => {
                const emptySet = new Set<string>();
                setTempCategoryFilters(emptySet);
                setTempSizeFilters(emptySet);
                setTempConditionFilters(emptySet);
                setTempGenderFilters(new Set());
                setTempPriceRange([minPrice, maxPrice]);
              }}
            />
          </div>
          <CategoryFilters
            categoryOptions={categoryOptions}
            sizeOptions={sizeOptions}
            conditionOptions={conditionOptions}
            genderOptions={genderOptions}
            activeCategoryFilters={tempCategoryFilters}
            activeSizeFilters={tempSizeFilters}
            activeConditionFilters={tempConditionFilters}
            activeGenderFilters={tempGenderFilters}
            priceRange={tempPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryToggle={(id, checked) =>
              setTempCategoryFilters((prev) => {
                const next = new Set(prev);
                if (checked) next.add(id);
                else next.delete(id);
                return next;
              })
            }
            onSizeToggle={(id, checked) =>
              setTempSizeFilters((prev) => {
                const next = new Set(prev);
                if (checked) next.add(id);
                else next.delete(id);
                return next;
              })
            }
              onConditionToggle={(id, checked) =>
                setTempConditionFilters((prev) => {
                  const next = new Set(prev);
                  if (checked) next.add(id);
                  else next.delete(id);
                  return next;
                })
              }
            onGenderToggle={(id, checked) =>
              setTempGenderFilters((prev) => {
                const next = new Set(prev);
                if (checked) next.add(id);
                else next.delete(id);
                return next;
              })
            }
            onPriceChange={updateTempPriceRange}
            className="sticky top-0"
          />
        </div>
        <SheetFooter className="border-t bg-background">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 max-[480px]:w-full"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1 max-[480px]:w-full" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
