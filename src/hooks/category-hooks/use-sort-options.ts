import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type SortOption = { value: string; label: string };

export function useSortOptions() {
  const { t } = useTranslation("category");
  return useMemo<SortOption[]>(
    () => [
      { value: "popularity", label: t("sorting.popularity") },
      { value: "rating", label: t("sorting.rating") },
      { value: "price-asc", label: t("sorting.priceAsc") },
      { value: "price-desc", label: t("sorting.priceDesc") },
    ],
    [t]
  );
}
