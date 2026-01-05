import { create } from "zustand";
import { persist } from "zustand/middleware";

import { API_CONFIG } from "@/lib/apiConfig";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (params: { token: string; user?: User | null }) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AUTH_STORAGE_KEY = "auth-store";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: ({ token, user = null }) => {
        localStorage.setItem(API_CONFIG.authTokenKey, token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem(API_CONFIG.authTokenKey);
        set({ token: null, user: null, isAuthenticated: false });
      },
      setUser: (user) => set((state) => ({ ...state, user })),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const mapTokenToAuthState = (
  token: string,
  user?: User | null
): Pick<AuthState, "token" | "user" | "isAuthenticated"> => ({
  token,
  user: user ?? null,
  isAuthenticated: Boolean(token),
});
