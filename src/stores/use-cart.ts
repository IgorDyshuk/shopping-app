import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types/product";

type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
};

type CartState = {
  items: CartItem[];
  totalCount: number;
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: number, size?: string) => void;
  removeLine: (productId: number, size?: string) => void;
  updateItemSize: (
    productId: number,
    fromSize: string | undefined,
    toSize: string
  ) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalCount: 0,
      addItem: (product, qty = 1, size) => {
        set((state) => {
          const nextItems = [...state.items];
          const idx = nextItems.findIndex(
            (item) =>
              item.product.id === product.id &&
              (size ? item.size === size : true)
          );
          if (idx >= 0) {
            nextItems[idx] = {
              ...nextItems[idx],
              quantity: nextItems[idx].quantity + qty,
              size: nextItems[idx].size ?? size,
            };
          } else {
            nextItems.push({ product, quantity: qty, size });
          }
          return {
            items: nextItems,
            totalCount: state.totalCount + qty,
          };
        });
      },
      removeItem: (productId, size) => {
        set((state) => {
          let removed = 0;
          const nextItems = state.items
            .map((item) => {
              const match =
                item.product.id === productId &&
                (size ? item.size === size : true);
              if (match) {
                const nextQty = item.quantity - 1;
                removed = 1;
                return { ...item, quantity: nextQty };
              }
              return item;
            })
            .filter((item) => item.quantity > 0);
          return { items: nextItems, totalCount: state.totalCount - removed };
        });
      },
      removeLine: (productId, size) => {
        set((state) => {
          const matchItem = state.items.find(
            (item) =>
              item.product.id === productId &&
              (size ? item.size === size : true)
          );
          const removedCount = matchItem?.quantity ?? 0;
          return {
            items: state.items.filter(
              (item) =>
                !(
                  item.product.id === productId &&
                  (size ? item.size === size : true)
                )
            ),
            totalCount: state.totalCount - removedCount,
          };
        });
      },
      updateItemSize: (productId, fromSize, toSize) => {
        set((state) => {
          const nextItems = [...state.items];
          const fromIdx = nextItems.findIndex(
            (item) =>
              item.product.id === productId &&
              (fromSize ? item.size === fromSize : true)
          );
          if (fromIdx === -1) return state;

          const existingIdx = nextItems.findIndex(
            (item, idx) =>
              idx !== fromIdx &&
              item.product.id === productId &&
              item.size === toSize
          );

          if (existingIdx >= 0) {
            // merge quantities into existing size
            nextItems[existingIdx] = {
              ...nextItems[existingIdx],
              quantity:
                nextItems[existingIdx].quantity + nextItems[fromIdx].quantity,
            };
            nextItems.splice(fromIdx, 1);
          } else {
            nextItems[fromIdx] = {
              ...nextItems[fromIdx],
              size: toSize,
            };
          }

          return { items: nextItems };
        });
      },
      clear: () => set({ items: [], totalCount: 0 }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        totalCount: state.totalCount,
      }),
    }
  )
);
