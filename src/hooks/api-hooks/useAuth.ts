import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/use-auth";
import { userApi } from "@/api/users";
import { API_CONFIG } from "@/lib/apiConfig";
import type { AuthToken, LoginPayload } from "@/types/auth";
import type { CreateUserPayload, User } from "@/types/user";

export const useLogin = () =>
  useMutation<AuthToken, unknown, LoginPayload>({
    mutationFn: authApi.login,
    onSuccess: async (data, variables) => {
      localStorage.setItem(API_CONFIG.authTokenKey, data.token);
      const authStore = useAuthStore.getState();
      authStore.login({ token: data.token });

      try {
        const users = await userApi.list();
        const matched = users.find((user) => {
          const byUsername = user.username === variables.username;
          const byEmail =
            user.email?.toLowerCase() === variables.username.toLowerCase();
          return byUsername || byEmail;
        });
        if (matched) {
          authStore.setUser(matched);
          return;
        }
      } catch {
        // ignore, fallback below
      }

      // Fallback: store minimal info from the login form
      authStore.setUser({
        id: -1,
        username: variables.username,
        email: "",
      });
    },
  });

export const useRegister = () =>
  useMutation<User, unknown, CreateUserPayload>({
    mutationFn: userApi.create,
    onSuccess: (data) => {
      console.debug("[useRegister] user created", data);
      // Keep user in auth store for immediate UI updates if needed
      useAuthStore.getState().setUser(data);
    },
  });
