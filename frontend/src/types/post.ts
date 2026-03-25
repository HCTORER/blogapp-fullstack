export type Post = {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  slug: string;
  isPublished?: boolean;
  categoryId?: number;
};

export type PostsResponse = {
  success: boolean;
  message: string;
  data: {
    items: Post[];
    totalCount: number;
    page: number;
    pageSize: number;
  };
};

export type SinglePostResponse = {
  success: boolean;
  message: string;
  data: Post;
};

export type CreatePostRequest = {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  isPublished: boolean;
  categoryId: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type CategoriesResponse = {
  success: boolean;
  message: string;
  data: Category[];
};

export type CreateCategoryRequest = {
  name: string;
  slug: string;
};
