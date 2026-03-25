import { api } from "../api/axios";
import type { CategoriesResponse, CreateCategoryRequest } from "../types/post";

export const adminCategoryService = {
  getAll: async (): Promise<CategoriesResponse> => {
    const response = await api.get("/admin/categories");
    return response.data;
  },

  create: async (payload: CreateCategoryRequest) => {
    const response = await api.post("/admin/categories", payload);
    return response.data;
  },
};
