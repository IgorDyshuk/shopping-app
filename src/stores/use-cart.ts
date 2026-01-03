import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types/product";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  removeLine: (productId: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, qty = 1) => {
        set((state) => {
          const nextItems = [...state.items];
          const idx = nextItems.findIndex(
            (item) => item.product.id === product.id
          );
          if (idx >= 0) {
            nextItems[idx] = {
              ...nextItems[idx],
              quantity: nextItems[idx].quantity + qty,
            };
          } else {
            nextItems.push({ product, quantity: qty });
          }
          return { items: nextItems };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          const nextItems = state.items
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0);
          return { items: nextItems };
        });
      },
      removeLine: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
