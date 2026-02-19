import { useQuery } from "@tanstack/react-query";

import { profileApi } from "@/api/profile";
import type { ClientProfile, SellerProfile } from "@/types/user";

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
