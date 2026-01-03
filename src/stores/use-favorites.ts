import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          const exists = state.ids.includes(id);
          return {
            ids: exists
              ? state.ids.filter((current) => current !== id)
              : [...state.ids, id],
          };
        }),
      add: (id) =>
        set((state) =>
          state.ids.includes(id) ? state : { ids: [...state.ids, id] }
        ),
      remove: (id) =>
        set((state) => ({ ids: state.ids.filter((current) => current !== id) })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "favorites-storage",
      partialize: (state) => ({ ids: state.ids }),
    }
  )
);
