import { useQuery } from "@tanstack/react-query";

import { profileApi } from "@/api/profile";
import type { ClientProfile } from "@/types/user";

export const useClientProfile = () =>
  useQuery<ClientProfile>({
    queryKey: ["client-profile", "me"],
    queryFn: profileApi.getClientMe,
  });
