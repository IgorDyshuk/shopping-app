export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL ?? "https://fakestoreapi.com",
  timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT ?? 10_000),
  authTokenKey: "auth_token",
} as const;
