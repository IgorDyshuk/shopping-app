import { create } from "zustand";
import { persist } from "zustand/middleware";

export const LANGUAGE_STORAGE_KEY = "language-preference";

type LanguageState = {
  language: string;
  setLanguage: (language: string) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language: string) => set({ language }),
    }),
    { name: LANGUAGE_STORAGE_KEY }
  )
);
