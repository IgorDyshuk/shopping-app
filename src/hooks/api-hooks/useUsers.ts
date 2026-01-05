import { useQuery } from "@tanstack/react-query";

import { userApi } from "@/api/users";
import type { User } from "@/types/user";

export const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: userApi.list,
  });
