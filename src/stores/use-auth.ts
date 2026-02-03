import { create } from "zustand";
import { persist } from "zustand/middleware";

import { API_CONFIG } from "@/lib/apiConfig";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (params: {
    token: string;
    refreshToken?: string | null;
    user?: User | null;
  }) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AUTH_STORAGE_KEY = "auth-store";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: ({ token, refreshToken = null, user = null }) => {
        localStorage.setItem(API_CONFIG.authTokenKey, token);
        if (refreshToken) {
          localStorage.setItem(API_CONFIG.refreshTokenKey, refreshToken);
        }
        set({ token, refreshToken, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem(API_CONFIG.authTokenKey);
        localStorage.removeItem(API_CONFIG.refreshTokenKey);
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setUser: (user) => set((state) => ({ ...state, user })),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const mapTokenToAuthState = (
  token: string,
  user?: User | null,
  refreshToken?: string | null,
): Pick<AuthState, "token" | "user" | "isAuthenticated" | "refreshToken"> => ({
  token,
  user: user ?? null,
  refreshToken: refreshToken ?? null,
  isAuthenticated: Boolean(token),
});
