import axios from "axios";
import { toast } from "sonner";

import { authApi } from "@/api/auth";
import { API_CONFIG } from "@/lib/apiConfig";
import i18n from "@/i18n";
import { useAuthStore } from "@/stores/use-auth";
import type { User } from "@/types/user";

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeoutMs,
});

const refreshPath = "/identity/refresh";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let lastUnauthorizedToastAt = 0;
const UNAUTHORIZED_TOAST_COOLDOWN_MS = 5000;

const notifyUnauthorized = () => {
  const now = Date.now();
  if (now - lastUnauthorizedToastAt > UNAUTHORIZED_TOAST_COOLDOWN_MS) {
    lastUnauthorizedToastAt = now;
    toast.error(
      i18n.t("auth.sessionExpired", {
        defaultValue: "Session expired. Please log in again.",
      }),
    );
  }
  useAuthStore.getState().logout();
};

const mapRoleIdToUserRole = (roleId?: string): User["role"] => {
  const roleHint = (roleId ?? "").toLowerCase();
  if (roleHint.includes("seller") || roleHint.includes("admin")) return "seller";
  if (roleHint.includes("buyer") || roleHint.includes("client")) return "buyer";
  return undefined;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.authTokenKey);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      // Lightweight console logging for debugging failed API calls
      // Network errors have no response; log config and message
      if (!error.response) {
        console.warn("[API][network]", {
          url: error.config?.url,
          method: error.config?.method,
          message: error.message,
        });
      } else {
        console.warn("[API][error]", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
    const originalRequest = error.config as Record<string, any>;
    const isAuthRoute =
      originalRequest?.url?.includes("/identity/login") ||
      originalRequest?.url?.includes("/identity/register") ||
      originalRequest?.url?.includes(refreshPath);

    if (
      error.response?.status === 401 &&
      !isAuthRoute &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      const tryRefresh = async (): Promise<string | null> => {
        const refreshToken =
          localStorage.getItem(API_CONFIG.refreshTokenKey) ?? null;
        if (!refreshToken) return null;

        if (isRefreshing && refreshPromise) {
          return refreshPromise;
        }

        isRefreshing = true;

        refreshPromise = authApi
          .refresh({ refresh_token: refreshToken })
          .then((res) => {
            const { access_token, refresh_token, role_id } = res;
            const authStore = useAuthStore.getState();
            const currentUser = authStore.user;
            const roleFromRefresh = mapRoleIdToUserRole(role_id);
            const nextUser =
              currentUser && roleFromRefresh
                ? { ...currentUser, role: roleFromRefresh }
                : currentUser;

            authStore.login({
              token: access_token,
              refreshToken: refresh_token,
              user: nextUser ?? null,
            });
            return access_token;
          })
          .catch(() => null)
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });

        return refreshPromise;
      };

      return tryRefresh().then((newToken) => {
        if (!newToken) {
          notifyUnauthorized();
          return Promise.reject(error);
        }
        // retry original request with new token
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    if (error.response?.status === 401 && !isAuthRoute) {
      notifyUnauthorized();
    }

    return Promise.reject(error);
  }
);

export type ApiResponse<T> = T;
