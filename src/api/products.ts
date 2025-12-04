import { api } from "./client";
import type {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
} from "@/types/product";

const basePath = "/products";

export const productApi = {
  list: async () => api.get<Product[]>(basePath).then((res) => res.data),
  getById: async (id: number) =>
    api.get<Product>(`${basePath}/${id}`).then((res) => res.data),
  create: async (payload: ProductCreatePayload) =>
    api.post<Product>(basePath, payload).then((res) => res.data),
  update: async ({ id, ...payload }: ProductUpdatePayload) =>
    api.put<Product>(`${basePath}/${id}`, payload).then((res) => res.data),
  remove: async (id: number) =>
    api.delete<Product>(`${basePath}/${id}`).then((res) => res.data),
};
