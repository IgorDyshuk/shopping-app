import axios from "axios";

import { API_CONFIG } from "@/lib/apiConfig";

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeoutMs,
});

const identityBase = (API_CONFIG.identityBaseURL ?? "").replace(/\/+$/, "");
const refreshPath = "/identity/refresh";
const useProxy =
  import.meta.env.VITE_IDENTITY_USE_PROXY !== undefined
    ? import.meta.env.VITE_IDENTITY_USE_PROXY === "true"
    : import.meta.env.DEV;
const NGROK_SKIP_HEADER = { "ngrok-skip-browser-warning": "true" };

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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
        const refreshUrl = useProxy
          ? refreshPath
          : `${identityBase}${refreshPath}`;

        refreshPromise = axios
          .post<{ access_token: string; refresh_token: string }>(
            refreshUrl,
            { refresh_token: refreshToken },
            {
              baseURL: useProxy ? "" : undefined,
              timeout: API_CONFIG.timeoutMs,
              headers: {
                ...NGROK_SKIP_HEADER,
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          )
          .then((res) => {
            const { access_token, refresh_token } = res.data;
            localStorage.setItem(API_CONFIG.authTokenKey, access_token);
            localStorage.setItem(API_CONFIG.refreshTokenKey, refresh_token);
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
          return Promise.reject(error);
        }
        // retry original request with new token
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);

export type ApiResponse<T> = T;
