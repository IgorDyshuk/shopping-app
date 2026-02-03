import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/use-auth";
import { API_CONFIG } from "@/lib/apiConfig";
import type { RefreshPayload, RefreshResponse } from "@/types/auth";

export const useRefreshToken = () =>
  useMutation<RefreshResponse, Error, RefreshPayload | void>({
    mutationFn: (payload) => authApi.refresh(payload ?? {}),
    onSuccess: (data) => {
      const authStore = useAuthStore.getState();
      localStorage.setItem(API_CONFIG.authTokenKey, data.access_token);
      localStorage.setItem(API_CONFIG.refreshTokenKey, data.refresh_token);
      authStore.login({
        token: data.access_token,
        refreshToken: data.refresh_token,
        user: authStore.user,
      });
    },
  });
