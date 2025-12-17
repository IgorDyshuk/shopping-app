import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterOption = {
  id: string;
  label: string;
  labelKey?: string;
};

type CategoryFiltersProps = {
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
  onCategoryToggle: (id: string, checked: boolean) => void;
  onSizeToggle: (id: string, checked: boolean) => void;
  onConditionToggle: (id: string, checked: boolean) => void;
  onGenderToggle?: (id: string, checked: boolean) => void;
  onPriceChange: (min: number, max: number) => void;
  className?: string;
};

export function CategoryFilters({
  categoryOptions,
  sizeOptions,
  conditionOptions,
  genderOptions = [],
  activeCategoryFilters,
  activeSizeFilters,
  activeConditionFilters,
  activeGenderFilters,
  priceRange,
  minPrice,
  maxPrice,
  onCategoryToggle,
  onSizeToggle,
  onConditionToggle,
  onGenderToggle,
  onPriceChange,
}: CategoryFiltersProps) {
  const { t } = useTranslation("category");

  return (
    <aside
      className={cn("space-y-5 rounded-xl border bg-sidebar/50 p-4 shadow-sm")}
    >
      <h2 className="text-lg font-semibold">{t("filters.header")}</h2>

      {genderOptions.length > 0 && activeGenderFilters && onGenderToggle && (
        <div className="space-y-3 rounded-lg border border-dashed p-3">
          <p className="text-sm font-medium text-muted-foreground">
            {t("filters.gender")}
          </p>
          <div className="space-y-2">
            {genderOptions.map((filter) => {
              const label = filter.labelKey ? t(filter.labelKey) : filter.label;
              return (
                <label
                  key={filter.id}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <Checkbox
                    id={`gender-${filter.id}`}
                    checked={activeGenderFilters.has(filter.id)}
                    onCheckedChange={(val) =>
                      onGenderToggle(filter.id, Boolean(val))
                    }
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <p className="text-sm font-medium text-muted-foreground">
          {t("filters.category")}
        </p>
        <div className="space-y-2">
          {categoryOptions.map((filter) => {
            const label = filter.labelKey ? t(filter.labelKey) : filter.label;
            return (
              <label
                key={filter.id}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <Checkbox
                  id={`cat-${filter.id}`}
                  checked={activeCategoryFilters.has(filter.id)}
                  onCheckedChange={(val) =>
                    onCategoryToggle(filter.id, Boolean(val))
                  }
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <p className="text-sm font-medium text-muted-foreground">
          {t("filters.size")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {sizeOptions.map((filter) => {
            const label = filter.labelKey ? t(filter.labelKey) : filter.label;
            return (
              <label
                key={filter.id}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <Checkbox
                  id={`size-${filter.id}`}
                  checked={activeSizeFilters.has(filter.id)}
                  onCheckedChange={(val) =>
                    onSizeToggle(filter.id, Boolean(val))
                  }
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium text-muted-foreground">
            {t("filters.price")}
          </p>
          <span className="text-xs text-muted-foreground">
            {t("filters.range", {
              min: priceRange[0].toFixed(0),
              max: priceRange[1].toFixed(0),
            })}
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Input
            type="number"
            min={minPrice}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) =>
              onPriceChange(Number(e.target.value), priceRange[1])
            }
            className="h-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-sm text-muted-foreground text-center">—</span>
          <Input
            type="number"
            min={priceRange[0]}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) =>
              onPriceChange(priceRange[0], Number(e.target.value))
            }
            className="h-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <Slider
          value={priceRange}
          min={minPrice}
          max={maxPrice || 0}
          step={1}
          minStepsBetweenThumbs={1}
          onValueChange={(value) =>
            onPriceChange(value[0], value[1] ?? value[0])
          }
          className="py-2"
          disabled={minPrice === maxPrice}
        />
      </div>

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <p className="text-sm font-medium text-muted-foreground">
          {t("filters.condition")}
        </p>
        <div className="space-y-2">
          {conditionOptions.map((filter) => {
            const label = filter.labelKey ? t(filter.labelKey) : filter.label;
            return (
              <label
                key={filter.id}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <Checkbox
                  id={`condition-${filter.id}`}
                  checked={activeConditionFilters.has(filter.id)}
                  onCheckedChange={(val) =>
                    onConditionToggle(filter.id, Boolean(val))
                  }
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
