import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { profileApi } from "@/api/profile";
import type {
  ClientProfile,
  ClientProfileUpdatePayload,
  SellerBankDetailsPayload,
  SellerProfile,
  SellerProfileUpdatePayload,
  SellerProfileUpdateResponse,
} from "@/types/user";

export const useClientProfile = () =>
  useQuery<ClientProfile>({
    queryKey: ["client-profile", "me"],
    queryFn: profileApi.getClientMe,
  });

export const useSellerProfile = () =>
  useQuery<SellerProfile>({
    queryKey: ["seller-profile", "me"],
    queryFn: profileApi.getSellerMe,
  });

const parseMutationError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Network error: no response from identity service.";
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
    return detail
      ? `${baseMessage}${baseMessage ? ": " : ""}${detail}`
      : (baseMessage ?? "Request failed");
  }

  if (error instanceof Error) return error.message;
  return "Request failed";
};

export const useCreateSellerBankDetails = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, SellerBankDetailsPayload>({
    mutationFn: async (payload) => {
      try {
        return await profileApi.createSellerBankDetails(payload);
      } catch (error) {
        throw new Error(parseMutationError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-profile", "me"] });
    },
  });
};

export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ClientProfile, Error, ClientProfileUpdatePayload>({
    mutationFn: async (payload) => {
      try {
        return await profileApi.updateClientProfile(payload);
      } catch (error) {
        throw new Error(parseMutationError(error));
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["client-profile", "me"] }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey[0] === "products",
        }),
      ]);
    },
  });
};

export const useUpdateSellerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<SellerProfileUpdateResponse, Error, SellerProfileUpdatePayload>({
    mutationFn: async (payload) => {
      try {
        return await profileApi.updateSellerProfile(payload);
      } catch (error) {
        throw new Error(parseMutationError(error));
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["seller-profile", "me"] }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey[0] === "products",
        }),
      ]);
    },
  });
};
