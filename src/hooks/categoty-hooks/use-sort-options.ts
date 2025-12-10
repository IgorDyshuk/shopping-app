import { useMemo } from "react";

export type SortOption = { value: string; label: string };

export function useSortOptions() {
  return useMemo<SortOption[]>(
    () => [
      { value: "popularity", label: "Popularity" },
      { value: "rating", label: "Rating" },
      { value: "price-asc", label: "Price: Low to High" },
      { value: "price-desc", label: "Price: High to Low" },
    ],
    []
  );
}
