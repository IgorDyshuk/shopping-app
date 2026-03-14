import { api } from "./client";
import { API_CONFIG } from "@/lib/apiConfig";
import type {
  ClientProfile,
  ClientProfileUpdatePayload,
  SellerBankDetailsPayload,
  SellerProfile,
  SellerProfileUpdatePayload,
  SellerProfileUpdateResponse,
} from "@/types/user";

const identityBase = API_CONFIG.identityBaseURL.replace(/\/+$/, "");
const clientProfilePath = "/profiles/client/me";
const clientProfileUpdatePath = "/profiles/client";
const sellerProfilePath = "/profiles/seller/me";
const sellerProfileUpdatePath = "/profiles/seller";
const sellerBankDetailsPath = "/profiles/seller/me/bank-details";
const useProxy =
  import.meta.env.VITE_IDENTITY_USE_PROXY !== undefined
    ? import.meta.env.VITE_IDENTITY_USE_PROXY === "true"
    : import.meta.env.DEV;

const NGROK_SKIP_HEADER = { "ngrok-skip-browser-warning": "true" };

export const profileApi = {
  getClientMe: async () => {
    const url = useProxy ? clientProfilePath : `${identityBase}${clientProfilePath}`;
    const response = await api.get<ClientProfile>(url, {
      timeout: API_CONFIG.timeoutMs,
      // Bypass fakestore baseURL when proxying through Vite
      ...(useProxy ? { baseURL: "" } : {}),
      headers: NGROK_SKIP_HEADER,
    });
    return response.data;
  },
  getSellerMe: async () => {
    const url = useProxy ? sellerProfilePath : `${identityBase}${sellerProfilePath}`;
    const response = await api.get<SellerProfile>(url, {
      timeout: API_CONFIG.timeoutMs,
      ...(useProxy ? { baseURL: "" } : {}),
      headers: NGROK_SKIP_HEADER,
    });
    return response.data;
  },
  updateClientProfile: async (payload: ClientProfileUpdatePayload) => {
    const url = useProxy
      ? clientProfileUpdatePath
      : `${identityBase}${clientProfileUpdatePath}`;
    const response = await api.patch<ClientProfile>(url, payload, {
      timeout: API_CONFIG.timeoutMs,
      ...(useProxy ? { baseURL: "" } : {}),
      headers: {
        ...NGROK_SKIP_HEADER,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  updateSellerProfile: async (payload: SellerProfileUpdatePayload) => {
    const url = useProxy
      ? sellerProfileUpdatePath
      : `${identityBase}${sellerProfileUpdatePath}`;
    const response = await api.patch<SellerProfileUpdateResponse>(url, payload, {
      timeout: API_CONFIG.timeoutMs,
      ...(useProxy ? { baseURL: "" } : {}),
      headers: {
        ...NGROK_SKIP_HEADER,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  createSellerBankDetails: async (payload: SellerBankDetailsPayload) => {
    const url = useProxy
      ? sellerBankDetailsPath
      : `${identityBase}${sellerBankDetailsPath}`;
    const response = await api.post<string>(url, payload, {
      timeout: API_CONFIG.timeoutMs,
      ...(useProxy ? { baseURL: "" } : {}),
      headers: {
        ...NGROK_SKIP_HEADER,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};
