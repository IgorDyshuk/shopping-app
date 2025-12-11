import { useMemo } from "react";

import type { FilterOption } from "@/components/categories/CategoryFilters";

export type ChipItem = {
  key: string;
  label: string;
  onClear: () => void;
};

type UseFilterChipsParams = {
  categoryOptions: FilterOption[];
  sizeOptions: FilterOption[];
  conditionOptions: FilterOption[];
  categorySet: Set<string>;
  sizeSet: Set<string>;
  conditionSet: Set<string>;
  genderOptions?: FilterOption[];
  genderSet?: Set<string>;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  priceLabel: string;
  onClearPrice: () => void;
  makeClearCategory: (id: string) => () => void;
  makeClearSize: (id: string) => () => void;
  makeClearCondition: (id: string) => () => void;
  makeClearGender?: (id: string) => () => void;
  getLabel: (opt?: FilterOption) => string;
};

export function useFilterChips({
  categoryOptions,
  sizeOptions,
  conditionOptions,
  categorySet,
  sizeSet,
  conditionSet,
  genderOptions,
  genderSet,
  priceRange,
  minPrice,
  maxPrice,
  priceLabel,
  onClearPrice,
  makeClearCategory,
  makeClearSize,
  makeClearCondition,
  makeClearGender,
  getLabel,
}: UseFilterChipsParams) {
  return useMemo<ChipItem[]>(() => {
    const items: ChipItem[] = [];

    Array.from(categorySet).forEach((id) => {
      const label = getLabel(categoryOptions.find((opt) => opt.id === id)) || id;
      items.push({
        key: `cat-${id}`,
        label,
        onClear: makeClearCategory(id),
      });
    });

    Array.from(sizeSet).forEach((id) => {
      const label = getLabel(sizeOptions.find((opt) => opt.id === id)) || id;
      items.push({
        key: `size-${id}`,
        label,
        onClear: makeClearSize(id),
      });
    });

    Array.from(conditionSet).forEach((id) => {
      const label =
        getLabel(conditionOptions.find((opt) => opt.id === id)) || id;
      items.push({
        key: `condition-${id}`,
        label,
        onClear: makeClearCondition(id),
      });
    });

    if (genderOptions && genderSet && makeClearGender) {
      Array.from(genderSet).forEach((id) => {
        const label = getLabel(genderOptions.find((opt) => opt.id === id)) || id;
        items.push({
          key: `gender-${id}`,
          label,
          onClear: makeClearGender(id),
        });
      });
    }

    const hasPrice = priceRange[0] !== minPrice || priceRange[1] !== maxPrice;
    if (hasPrice) {
      items.push({
        key: "price",
        label: priceLabel,
        onClear: onClearPrice,
      });
    }

    return items;
  }, [
    categorySet,
    sizeSet,
    conditionSet,
    genderSet,
    priceRange,
    minPrice,
    maxPrice,
    categoryOptions,
    sizeOptions,
    conditionOptions,
    genderOptions,
    onClearPrice,
    makeClearCategory,
    makeClearSize,
    makeClearCondition,
    makeClearGender,
    getLabel,
    priceLabel,
  ]);
}
