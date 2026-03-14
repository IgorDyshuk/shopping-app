import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/use-auth";
import { API_CONFIG } from "@/lib/apiConfig";
import type { RefreshPayload, RefreshResponse } from "@/types/auth";
import type { User } from "@/types/user";

const mapRoleIdToUserRole = (roleId?: string): User["role"] => {
  const roleHint = (roleId ?? "").toLowerCase();
  if (roleHint.includes("seller") || roleHint.includes("admin")) return "seller";
  if (roleHint.includes("buyer") || roleHint.includes("client")) return "buyer";
  return undefined;
};

export const useRefreshToken = () =>
  useMutation<RefreshResponse, Error, RefreshPayload | void>({
    mutationFn: (payload) => {
      const refreshToken =
        payload?.refresh_token ??
        localStorage.getItem(API_CONFIG.refreshTokenKey) ??
        undefined;
      if (!refreshToken) {
        return Promise.reject(new Error("Refresh token is missing"));
      }
      return authApi.refresh({ refresh_token: refreshToken });
    },
    onSuccess: (data) => {
      const authStore = useAuthStore.getState();
      const roleFromRefresh = mapRoleIdToUserRole(data.role_id);
      const nextUser =
        authStore.user && roleFromRefresh
          ? { ...authStore.user, role: roleFromRefresh }
          : authStore.user;
      authStore.login({
        token: data.access_token,
        refreshToken: data.refresh_token,
        user: nextUser,
      });
    },
  });
