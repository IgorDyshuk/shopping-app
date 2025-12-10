import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { API_CONFIG } from "@/lib/apiConfig";
import type { AuthToken, LoginPayload } from "@/types/auth";

export const useLogin = () =>
  useMutation<AuthToken, unknown, LoginPayload>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem(API_CONFIG.authTokenKey, data.token);
    },
  });
