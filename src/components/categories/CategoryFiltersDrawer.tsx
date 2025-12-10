import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { FilterOption } from "./CategoryFilters";
import { CategoryFilters } from "./CategoryFilters";
import { Funnel } from "lucide-react";

type CategoryFiltersDrawerProps = {
  label: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryOptions: FilterOption[];
  sizeOptions: FilterOption[];
  conditionOptions: FilterOption[];
  activeCategoryFilters: Set<string>;
  activeSizeFilters: Set<string>;
  activeConditionFilters: Set<string>;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  onApply: (payload: {
    categories: Set<string>;
    sizes: Set<string>;
    conditions: Set<string>;
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
  activeCategoryFilters,
  activeSizeFilters,
  activeConditionFilters,
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
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 0,
  ]);

  useEffect(() => {
    if (open) {
      setTempCategoryFilters(new Set(activeCategoryFilters));
      setTempSizeFilters(new Set(activeSizeFilters));
      setTempConditionFilters(new Set(activeConditionFilters));
      setTempPriceRange(priceRange);
    }
  }, [
    open,
    activeCategoryFilters,
    activeSizeFilters,
    activeConditionFilters,
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
      priceRange: tempPriceRange,
    });
    onOpenChange(false);
  };

  const displayLabel = Array.isArray(label) ? label[0] ?? "Filters" : label;
  const descLabel = Array.isArray(label) ? label[1] ?? "" : "";

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
            <span className="">Filters {displayLabel}</span>
            <span className="text-muted-foreground text-xs">{descLabel}</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="px-4 pt-4 pb-0">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto px-4 pb-4">
          <CategoryFilters
            categoryOptions={categoryOptions}
            sizeOptions={sizeOptions}
            conditionOptions={conditionOptions}
            activeCategoryFilters={tempCategoryFilters}
            activeSizeFilters={tempSizeFilters}
            activeConditionFilters={tempConditionFilters}
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
