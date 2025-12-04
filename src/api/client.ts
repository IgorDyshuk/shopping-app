import axios from "axios";

import { API_CONFIG } from "@/lib/apiConfig";

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeoutMs,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.authTokenKey);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling can be added here (logging, notifications, etc.)

export type ApiResponse<T> = T;
