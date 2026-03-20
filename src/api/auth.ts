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

const registerPath = "/identity/register/client";
const registerSellerPath = "/identity/register/seller";
const loginPath = "/identity/login";
const refreshPath = "/identity/refresh";
const logoutPath = "/identity/logout";

export const authApi = {
  login: async (payload: LoginPayload) => {
    const url = API_CONFIG.buildIdentityUrl(loginPath);
    return axios
      .post<LoginResponse>(url, payload, {
        timeout: API_CONFIG.timeoutMs,
        headers: API_CONFIG.identityHeaders,
      })
      .then((res) => res.data);
  },
  registerClient: async (payload: RegisterClientPayload) => {
    const url = API_CONFIG.buildIdentityUrl(registerPath);
    // In dev we rely on Vite proxy (see vite.config.ts) to avoid CORS
    return axios
      .post<RegisterClientResponse>(url, payload, {
        timeout: API_CONFIG.timeoutMs,
        headers: API_CONFIG.identityHeaders,
      })
      .then((res) => res.data);
  },
  registerSeller: async (payload: RegisterSellerPayload) => {
    const url = API_CONFIG.buildIdentityUrl(registerSellerPath);
    return axios
      .post<RegisterClientResponse>(url, payload, {
        timeout: API_CONFIG.timeoutMs,
        headers: API_CONFIG.identityHeaders,
      })
      .then((res) => res.data);
  },
  refresh: async (payload: RefreshPayload) => {
    const url = API_CONFIG.buildIdentityUrl(refreshPath);
    return axios
      .post<RefreshResponse>(url, payload, {
        timeout: API_CONFIG.timeoutMs,
        headers: {
          ...API_CONFIG.identityHeaders,
          Authorization: `Bearer ${payload.refresh_token}`,
        },
      })
      .then((res) => res.data);
  },
  logout: async (refreshToken?: string) => {
    const url = API_CONFIG.buildIdentityUrl(logoutPath);
    const accessToken = localStorage.getItem(API_CONFIG.authTokenKey);
    const tokenForHeader = refreshToken || accessToken || "";
    return axios
      .post<LogoutResponse>(
        url,
        refreshToken ? { refresh_token: refreshToken } : {},
        {
          timeout: API_CONFIG.timeoutMs,
          headers: {
            ...API_CONFIG.identityHeaders,
            ...(tokenForHeader
              ? { Authorization: `Bearer ${tokenForHeader}` }
              : {}),
          },
        }
      )
      .then((res) => res.data);
  },
};
