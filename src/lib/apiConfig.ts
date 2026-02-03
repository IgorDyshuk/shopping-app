export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL ?? "https://fakestoreapi.com",
  identityBaseURL:
    import.meta.env.VITE_IDENTITY_API_URL ??
    "https://cow-peaceful-filly.ngrok-free.app",
  timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT ?? 10_000),
  authTokenKey: "auth_token",
  refreshTokenKey: "auth_refresh_token",
} as const;
