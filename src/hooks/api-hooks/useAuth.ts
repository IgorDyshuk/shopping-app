import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/use-auth";
import { profileApi } from "@/api/profile";
import { API_CONFIG } from "@/lib/apiConfig";
import type {
  LoginPayload,
  RegisterClientResponse,
  RegisterSellerPayload,
} from "@/types/auth";
import type {
  ClientProfile,
  CreateUserPayload,
  SellerProfile,
  User,
} from "@/types/user";

export const useLogin = () =>
  useMutation<User | null, Error, LoginPayload>({
    mutationFn: async (payload) => {
      try {
        const data = await authApi.login(payload);
        const authStore = useAuthStore.getState();
        localStorage.setItem(API_CONFIG.authTokenKey, data.access_token);
        localStorage.setItem(API_CONFIG.refreshTokenKey, data.refresh_token);
        authStore.login({
          token: data.access_token,
          refreshToken: data.refresh_token,
        });

        const roleHint = (data.role_id ?? "").toLowerCase();
        const roleFromLogin: User["role"] =
          roleHint.includes("seller") || roleHint.includes("admin")
            ? "seller"
            : roleHint.includes("buyer") || roleHint.includes("client")
              ? "buyer"
              : undefined;

        const tryClientProfile = async () => {
          try {
            const profile: ClientProfile = await profileApi.getClientMe();
            const profileUser: User = {
              id: payload.email,
              username: profile.username ?? payload.email,
              email: profile.email ?? payload.email,
              phone: profile.phone,
              role: "buyer",
              accepts_marketing: profile.accepts_marketing,
              password: payload.password,
              name: {
                firstname: profile.first_name,
                lastname: profile.last_name,
              },
            };
            authStore.setUser(profileUser);
            return profileUser;
          } catch {
            return null;
          }
        };

        const trySellerProfile = async () => {
          try {
            const profile: SellerProfile = await profileApi.getSellerMe();
            const profileUser: User = {
              id: payload.email,
              username: profile.username ?? payload.email,
              email: profile.email ?? payload.email,
              phone: profile.phone,
              role: "seller",
              company_name: profile.company_name,
              bank_details_id: profile.bank_details_id,
              is_verified: profile.is_verified,
              password: payload.password,
              name: {
                firstname: profile.first_name,
                lastname: profile.last_name,
              },
            };
            authStore.setUser(profileUser);
            return profileUser;
          } catch {
            return null;
          }
        };

        const profileOrder: Array<"client" | "seller"> =
          roleFromLogin === "seller"
            ? ["seller", "client"]
            : roleFromLogin === "buyer"
              ? ["client", "seller"]
              : ["client", "seller"];

        for (const kind of profileOrder) {
          const profileUser =
            kind === "seller"
              ? await trySellerProfile()
              : await tryClientProfile();
          if (profileUser) return profileUser;
        }

        // Minimal user fallback
        const fallbackUser: User = {
          id: payload.email,
          username: payload.email,
          email: payload.email,
          role: roleFromLogin,
          password: payload.password,
        };
        authStore.setUser(fallbackUser);
        return fallbackUser;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            throw new Error(
              "Network error: no response from identity service. Check URL/CORS/VPN.",
            );
          }

          const data = error.response?.data as {
            message?: string;
            detail?: unknown;
          };
          if (error.response?.status === 401 || error.response?.status === 403) {
            throw new Error("AUTH_INVALID_CREDENTIALS");
          }
          const detail = Array.isArray(data?.detail)
            ? data.detail
                .map((item: { msg?: string }) => item.msg)
                .filter(Boolean)
                .join("; ")
            : typeof data?.detail === "string"
              ? data.detail
              : "";
          const baseMessage = data?.message ?? error.message;
          const combined = detail
            ? `${baseMessage}${baseMessage ? ": " : ""}${detail}`
            : baseMessage;
          throw new Error(combined || "Validation error");
        }
        throw error as Error;
      }
    },
  });

export const useRegister = () =>
  useMutation<User, Error, CreateUserPayload>({
    mutationFn: async (variables) => {
      try {
        const clientPayload = {
          email: variables.email,
          password: variables.password,
          phone: variables.phone ?? "",
          accepts_marketing: false,
          first_name: variables.name?.firstname ?? "",
          last_name: variables.name?.lastname ?? "",
          username: variables.username,
        };

        const sellerPayload: RegisterSellerPayload | null =
          variables.role === "seller" && variables.company_name
            ? {
                ...clientPayload,
                company_name: variables.company_name,
              }
            : null;

        const data: RegisterClientResponse =
          variables.role === "seller"
            ? await authApi.registerSeller(
                sellerPayload as RegisterSellerPayload,
              )
            : await authApi.registerClient(clientPayload);

        // Immediately log in to obtain access token after successful registration
        const loginResponse = await authApi.login({
          email: variables.email,
          password: variables.password,
        });

        const newUser: User = {
          id: data.id,
          username: variables.username,
          email: data.email ?? variables.email,
          password: variables.password,
          phone: variables.phone,
          country: variables.country,
          role: variables.role,
          company_name: variables.company_name,
          accepts_marketing: false,
          name: variables.name,
        };

        const authStore = useAuthStore.getState();
        const token = loginResponse.access_token;
        localStorage.setItem(API_CONFIG.authTokenKey, token);
        localStorage.setItem(
          API_CONFIG.refreshTokenKey,
          loginResponse.refresh_token,
        );
        authStore.login({
          token,
          refreshToken: loginResponse.refresh_token,
          user: newUser,
        });

        return newUser;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            throw new Error(
              "Network error: no response from identity service. Check URL/CORS/VPN.",
            );
          }

          const data = error.response?.data as {
            message?: string;
            detail?: unknown;
          };
          const detail = Array.isArray(data?.detail)
            ? data.detail
                .map((item: { msg?: string }) => item.msg)
                .filter(Boolean)
                .join("; ")
            : typeof data?.detail === "string"
              ? data.detail
              : "";
          const baseMessage = data?.message ?? error.message;
          const combined = detail
            ? `${baseMessage}${baseMessage ? ": " : ""}${detail}`
            : baseMessage;
          throw new Error(combined || "Validation error");
        }
        throw error;
      }
    },
  });

export const useLogout = () =>
  useMutation<string | void, Error>({
    mutationFn: () => {
      const refreshToken = localStorage.getItem(API_CONFIG.refreshTokenKey);
      return authApi.logout(refreshToken || undefined);
    },
    onSettled: () => {
      const authStore = useAuthStore.getState();
      authStore.logout();
    },
  });
