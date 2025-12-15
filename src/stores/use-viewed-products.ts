import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types/product";

type ViewedProduct = Pick<
  Product,
  "id" | "title" | "price" | "image" | "category" | "description"
>;

type ViewedProductsState = {
  viewedProducts: ViewedProduct[];
  addViewedProduct: (product: Product) => void;
  clearViewedProducts: () => void;
};

const MAX_ITEMS = 20;

export const useViewedProductsStore = create<ViewedProductsState>()(
  persist(
    (set, get) => ({
      viewedProducts: [],
      addViewedProduct: (product) => {
        const current = get().viewedProducts;
        const exists = current.find((item) => item.id === product.id);
        const filtered = exists
          ? current.filter((item) => item.id !== product.id)
          : current;

        const next: ViewedProduct = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
        };

        const updated = [next, ...filtered].slice(0, MAX_ITEMS);
        set({ viewedProducts: updated });
      },
      clearViewedProducts: () => set({ viewedProducts: [] }),
    }),
    {
      name: "viewed-products",
    }
  )
);
