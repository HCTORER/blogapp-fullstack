import { api } from "../api/axios";
import type { PostsResponse, SinglePostResponse } from "../types/post";

export const postService = {
  getAllPosts: async (
    page: number,
    pageSize: number,
  ): Promise<PostsResponse> => {
    const response = await api.get(
      `/public/posts?page=${page}&pageSize=${pageSize}`,
    );
    return response.data;
  },

  getBySlug: async (slug: string): Promise<SinglePostResponse> => {
    const response = await api.get(`/public/posts/${slug}`);
    return response.data;
  },
};
