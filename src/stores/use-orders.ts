import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PlacedOrder } from "@/types/orderConformation";

type OrdersState = {
  orders: PlacedOrder[];
  addOrder: (order: Omit<PlacedOrder, "id" | "createdAt">) => PlacedOrder;
  clear: () => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => {
        const newOrder: PlacedOrder = {
          ...order,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },
      clear: () => set({ orders: [] }),
    }),
    {
      name: "orders-history",
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
