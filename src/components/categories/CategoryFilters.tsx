import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterOption = {
  id: string;
  label: string;
};

type CategoryFiltersProps = {
  categoryOptions: FilterOption[];
  sizeOptions: FilterOption[];
  conditionOptions: FilterOption[];
  activeCategoryFilters: Set<string>;
  activeSizeFilters: Set<string>;
  activeConditionFilters: Set<string>;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  onCategoryToggle: (id: string, checked: boolean) => void;
  onSizeToggle: (id: string, checked: boolean) => void;
  onConditionToggle: (id: string, checked: boolean) => void;
  onPriceChange: (min: number, max: number) => void;
  className?: string;
};

export function CategoryFilters({
  categoryOptions,
  sizeOptions,
  conditionOptions,
  activeCategoryFilters,
  activeSizeFilters,
  activeConditionFilters,
  priceRange,
  minPrice,
  maxPrice,
  onCategoryToggle,
  onSizeToggle,
  onConditionToggle,
  onPriceChange,
  className,
}: CategoryFiltersProps) {
  return (
    <aside
      className={cn(
        "space-y-5 rounded-xl border bg-sidebar/50 p-4 shadow-sm",
        className
      )}
    >
      <h2 className="text-lg font-semibold">Фильтры</h2>

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <p className="text-sm font-medium text-muted-foreground">Категория</p>
        <div className="space-y-2">
          {categoryOptions.map((filter) => (
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
              {filter.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <p className="text-sm font-medium text-muted-foreground">Размер</p>
        <div className="grid grid-cols-2 gap-2">
          {sizeOptions.map((filter) => (
            <label
              key={filter.id}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <Checkbox
                id={`size-${filter.id}`}
                checked={activeSizeFilters.has(filter.id)}
                onCheckedChange={(val) => onSizeToggle(filter.id, Boolean(val))}
              />
              {filter.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium text-muted-foreground">Цена</p>
          <span className="text-xs text-muted-foreground">
            ${priceRange[0].toFixed(0)} – ${priceRange[1].toFixed(0)}
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
        <p className="text-sm font-medium text-muted-foreground">Состояние</p>
        <div className="space-y-2">
          {conditionOptions.map((filter) => (
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
              {filter.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
