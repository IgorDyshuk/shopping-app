import axios from "axios";

import { API_CONFIG } from "@/lib/apiConfig";
import type {
  LoginResponse,
  LoginPayload,
  RegisterClientPayload,
  RegisterClientResponse,
  RegisterSellerPayload,
  RefreshPayload,
  RefreshResponse,
  LogoutResponse,
} from "@/types/auth";

const identityBase = API_CONFIG.identityBaseURL.replace(/\/+$/, "");
const registerPath = "/identity/register/client";
const registerSellerPath = "/identity/register/seller";
const loginPath = "/identity/login";
const refreshPath = "/identity/refresh";
const logoutPath = "/identity/logout";
const useProxy =
  import.meta.env.VITE_IDENTITY_USE_PROXY !== undefined
    ? import.meta.env.VITE_IDENTITY_USE_PROXY === "true"
    : import.meta.env.DEV;

const NGROK_SKIP_HEADER = { "ngrok-skip-browser-warning": "true" };

export const authApi = {
  login: async (payload: LoginPayload) => {
    const url = useProxy ? loginPath : `${identityBase}${loginPath}`;
    return axios
      .post<LoginResponse>(url, payload, {
        timeout: API_CONFIG.timeoutMs,
        headers: NGROK_SKIP_HEADER,
      })
      .then((res) => res.data);
  },
  registerClient: async (payload: RegisterClientPayload) => {
    const url = useProxy ? registerPath : `${identityBase}${registerPath}`;
    // In dev we rely on Vite proxy (see vite.config.ts) to avoid CORS
    return axios
      .post<RegisterClientResponse>(url, payload, {
        timeout: API_CONFIG.timeoutMs,
        headers: NGROK_SKIP_HEADER,
      })
      .then((res) => res.data);
  },
  registerSeller: async (payload: RegisterSellerPayload) => {
    const url = useProxy
      ? registerSellerPath
      : `${identityBase}${registerSellerPath}`;
    return axios
      .post<RegisterClientResponse>(url, payload, {
        timeout: API_CONFIG.timeoutMs,
        headers: NGROK_SKIP_HEADER,
      })
      .then((res) => res.data);
  },
  refresh: async (payload: RefreshPayload = {}) => {
    const url = useProxy ? refreshPath : `${identityBase}${refreshPath}`;
    return axios
      .post<RefreshResponse>(url, payload, {
        timeout: API_CONFIG.timeoutMs,
        headers: NGROK_SKIP_HEADER,
      })
      .then((res) => res.data);
  },
  logout: async (refreshToken?: string) => {
    const url = useProxy ? logoutPath : `${identityBase}${logoutPath}`;
    const accessToken = localStorage.getItem(API_CONFIG.authTokenKey);
    const tokenForHeader = refreshToken || accessToken || "";
    return axios
      .post<LogoutResponse>(
        url,
        refreshToken ? { refresh_token: refreshToken } : {},
        {
          timeout: API_CONFIG.timeoutMs,
          headers: {
            ...NGROK_SKIP_HEADER,
            ...(tokenForHeader
              ? { Authorization: `Bearer ${tokenForHeader}` }
              : {}),
          },
        }
      )
      .then((res) => res.data);
  },
};
