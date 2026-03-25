import { api } from "../api/axios";
import type { CreatePostRequest } from "../types/post";

export const adminPostService = {
  getAll: async () => {
    const res = await api.get("/admin/posts");
    console.log("RAW ADMIN POSTS RESPONSE:", res.data);
    return res.data;
  },

  create: async (payload: CreatePostRequest) => {
    const res = await api.post("/admin/posts", payload);
    return res.data;
  },

  update: async (id: number, payload: CreatePostRequest) => {
    const res = await api.put(`/admin/posts/${id}`, payload);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/admin/posts/${id}`);
    return res.data;
  },
};
