import { api } from "./client";
import type { AuthToken, LoginPayload } from "@/types/auth";

const basePath = "/auth";

export const authApi = {
  login: async (payload: LoginPayload) =>
    api.post<AuthToken>(`${basePath}/login`, payload).then((res) => res.data),
};
