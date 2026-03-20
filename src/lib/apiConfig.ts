const DEFAULT_FAKESTORE_URL = "https://fakestoreapi.com";
const DEFAULT_IDENTITY_URL = "https://cow-peaceful-filly.ngrok-free.app";

const readEnvUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const readEnvBoolean = (value: unknown): boolean | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return undefined;
};

const joinUrlPath = (base: string, path: string) => {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const appBase = import.meta.env.BASE_URL.replace(/\/+$/, "");

const withAppBase = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!appBase || appBase === "/") return normalizedPath;
  return `${appBase}${normalizedPath}`;
};

const identityBaseURL =
  readEnvUrl(import.meta.env.VITE_IDENTITY_API_URL) ?? DEFAULT_IDENTITY_URL;

const identityProxyFlag = readEnvBoolean(import.meta.env.VITE_IDENTITY_USE_PROXY);
const useIdentityProxy = identityProxyFlag ?? import.meta.env.DEV;

const includeNgrokSkipHeader =
  readEnvBoolean(import.meta.env.VITE_INCLUDE_NGROK_SKIP_HEADER) ?? false;
const identityHeaders = includeNgrokSkipHeader
  ? ({ "ngrok-skip-browser-warning": "true" } as const)
  : ({} as const);

const buildIdentityUrl = (path: string) =>
  useIdentityProxy ? withAppBase(path) : joinUrlPath(identityBaseURL, path);

const identityRequestConfig = useIdentityProxy ? ({ baseURL: "" } as const) : {};

const baseURL = readEnvUrl(import.meta.env.VITE_API_URL) ?? DEFAULT_FAKESTORE_URL;

export const API_CONFIG = {
  baseURL,
  identityBaseURL,
  useIdentityProxy,
  buildIdentityUrl,
  identityRequestConfig,
  identityHeaders,
  timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT ?? 10_000),
  authTokenKey: "auth_token",
  refreshTokenKey: "auth_refresh_token",
} as const;
