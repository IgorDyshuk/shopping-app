import { api } from "./client";
import { API_CONFIG } from "@/lib/apiConfig";
import type { ClientProfile } from "@/types/user";

const identityBase = API_CONFIG.identityBaseURL.replace(/\/+$/, "");
const profilePath = "/profiles/client/me";
const useProxy =
  import.meta.env.VITE_IDENTITY_USE_PROXY !== undefined
    ? import.meta.env.VITE_IDENTITY_USE_PROXY === "true"
    : import.meta.env.DEV;

const NGROK_SKIP_HEADER = { "ngrok-skip-browser-warning": "true" };

export const profileApi = {
  getClientMe: async () => {
    const url = useProxy ? profilePath : `${identityBase}${profilePath}`;
    const response = await api.get<ClientProfile>(url, {
      timeout: API_CONFIG.timeoutMs,
      // Bypass fakestore baseURL when proxying through Vite
      ...(useProxy ? { baseURL: "" } : {}),
      headers: NGROK_SKIP_HEADER,
    });
    return response.data;
  },
};
