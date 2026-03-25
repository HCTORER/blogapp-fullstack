import { api } from "../api/axios";
import type { LoginRequest } from "../types/auth";

export const authService = {
  login: async (payload: LoginRequest) => {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },
};
