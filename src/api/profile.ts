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

const clientProfilePath = "/profiles/client/me";
const clientProfileUpdatePath = "/profiles/client";
const sellerProfilePath = "/profiles/seller/me";
const sellerProfileUpdatePath = "/profiles/seller";
const sellerBankDetailsPath = "/profiles/seller/me/bank-details";

export const profileApi = {
  getClientMe: async () => {
    const url = API_CONFIG.buildIdentityUrl(clientProfilePath);
    const response = await api.get<ClientProfile>(url, {
      timeout: API_CONFIG.timeoutMs,
      ...API_CONFIG.identityRequestConfig,
      headers: API_CONFIG.identityHeaders,
    });
    return response.data;
  },
  getSellerMe: async () => {
    const url = API_CONFIG.buildIdentityUrl(sellerProfilePath);
    const response = await api.get<SellerProfile>(url, {
      timeout: API_CONFIG.timeoutMs,
      ...API_CONFIG.identityRequestConfig,
      headers: API_CONFIG.identityHeaders,
    });
    return response.data;
  },
  updateClientProfile: async (payload: ClientProfileUpdatePayload) => {
    const url = API_CONFIG.buildIdentityUrl(clientProfileUpdatePath);
    const response = await api.patch<ClientProfile>(url, payload, {
      timeout: API_CONFIG.timeoutMs,
      ...API_CONFIG.identityRequestConfig,
      headers: {
        ...API_CONFIG.identityHeaders,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  updateSellerProfile: async (payload: SellerProfileUpdatePayload) => {
    const url = API_CONFIG.buildIdentityUrl(sellerProfileUpdatePath);
    const response = await api.patch<SellerProfileUpdateResponse>(url, payload, {
      timeout: API_CONFIG.timeoutMs,
      ...API_CONFIG.identityRequestConfig,
      headers: {
        ...API_CONFIG.identityHeaders,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  createSellerBankDetails: async (payload: SellerBankDetailsPayload) => {
    const url = API_CONFIG.buildIdentityUrl(sellerBankDetailsPath);
    const response = await api.post<string>(url, payload, {
      timeout: API_CONFIG.timeoutMs,
      ...API_CONFIG.identityRequestConfig,
      headers: {
        ...API_CONFIG.identityHeaders,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};
