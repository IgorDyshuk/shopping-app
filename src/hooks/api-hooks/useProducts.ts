import { useQuery } from "@tanstack/react-query";

import { productApi } from "@/api/products";
import type { Product } from "@/types/product";

export const useProducts = () =>
  useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: productApi.list,
  });

export const useProduct = (id?: number) => {
  const fallbackId = id && id > 0 ? id : 1;
  return useQuery<Product>({
    queryKey: ["products", fallbackId],
    queryFn: () => productApi.getById(fallbackId),
    enabled: true,
  });
};

export const useFilteredProduct = (filter?: string) => {
  return useQuery<Product[]>({
    queryKey: ["products", "filter", filter],
    queryFn: async () => {
      const products = await productApi.list();
      const q = filter?.trim().toLowerCase();
      if (!q) return products;
      const words = q.split(/\s+/).filter(Boolean);

      return products.filter((p) => {
        const haystack = JSON.stringify(p).toLowerCase();
        return words.every((word) =>
          new RegExp(
            `\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`
          ).test(haystack)
        );
      });
    },
  });
};
