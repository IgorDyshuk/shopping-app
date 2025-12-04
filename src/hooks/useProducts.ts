import { useQuery } from "@tanstack/react-query";

import { productApi } from "@/api/products";
import type { Product } from "@/types/product";

export const useProducts = () =>
  useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: productApi.list,
  });

export const useProduct = (id?: number) =>
  useQuery<Product>({
    queryKey: ["products", id],
    queryFn: () => productApi.getById(id as number),
    enabled: Boolean(id),
  });
