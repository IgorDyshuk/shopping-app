import { api } from "./client";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "@/types/user";

const basePath = "/users";

export const userApi = {
  list: async () => api.get<User[]>(basePath).then((res) => res.data),
  getById: async (id: number) =>
    api.get<User>(`${basePath}/${id}`).then((res) => res.data),
  create: async (payload: CreateUserPayload) =>
    api.post<User>(basePath, payload).then((res) => res.data),
  update: async (payload: UpdateUserPayload) =>
    api.put<User>(`${basePath}/${payload.id}`, payload).then((res) => res.data),
  remove: async (id: number) =>
    api.delete<User>(`${basePath}/${id}`).then((res) => res.data),
};
