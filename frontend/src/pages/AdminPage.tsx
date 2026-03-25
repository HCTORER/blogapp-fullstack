import { useEffect, useState } from "react";
import { adminPostService } from "../services/adminPostService";
import { adminCategoryService } from "../services/adminCategoryService";
import type { Category, Post } from "../types/post";
import { extractTags } from "../utils/postUtils";

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [postError, setPostError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [categoryName, setCategoryName] = useState("");

  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const createSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const loadPosts = async () => {
    try {
      setPostError("");
      setLoadingPosts(true);

      const response = await adminPostService.getAll();
      console.log("Admin posts response:", response);

      const safeResponse = response as
        | {
            data?:
              | {
                  items?: Post[];
                }
              | Post[];
            items?: Post[];
          }
        | Post[];

      let items: Post[] = [];

      if (Array.isArray(safeResponse)) {
        items = safeResponse;
      } else if (Array.isArray(safeResponse?.data)) {
        items = safeResponse.data;
      } else if (
        safeResponse &&
        typeof safeResponse === "object" &&
        "items" in safeResponse &&
        Array.isArray(safeResponse.items)
      ) {
        items = safeResponse.items;
      } else if (
        safeResponse &&
        typeof safeResponse === "object" &&
        safeResponse.data &&
        typeof safeResponse.data === "object" &&
        "items" in safeResponse.data &&
        Array.isArray(safeResponse.data.items)
      ) {
        items = safeResponse.data.items;
      }

      setPosts(items);
    } catch (err) {
      console.error(err);
      setPostError("Failed to load admin posts.");
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoryError("");
      setLoadingCategories(true);

      const response = await adminCategoryService.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error(err);
      setCategoryError("Failed to load categories.");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const resetPostForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategoryId("");
    setIsPublished(true);
    setEditingPostId(null);
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      await adminCategoryService.create({
        name: categoryName,
        slug: createSlug(categoryName),
      });

      setCategoryName("");
      await loadCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to create category.");
    }
  };

  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      alert("Title, excerpt and content are required.");
      return;
    }

    if (!categoryId) {
      alert("Please select a category.");
      return;
    }

    const payload = {
      title,
      excerpt,
      content,
      slug: createSlug(title),
      isPublished,
      categoryId: Number(categoryId),
    };

    try {
      if (editingPostId) {
        await adminPostService.update(editingPostId, payload);
      } else {
        await adminPostService.create(payload);
      }

      resetPostForm();
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to save post.");
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setTitle(post.title ?? "");
    setExcerpt(post.excerpt ?? "");
    setContent(post.content ?? "");
    setCategoryId(post.categoryId ? String(post.categoryId) : "");
    setIsPublished(post.isPublished ?? true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeletePost = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) return;

    try {
      await adminPostService.delete(id);

      if (editingPostId === id) {
        resetPostForm();
      }

      await loadPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, []);

  return (
    <section className="page-section">
      <h1>Admin Dashboard</h1>

      <div style={{ display: "grid", gap: "32px" }}>
        <div>
          <h2 style={{ marginBottom: "12px" }}>Create Category</h2>

          <form
            onSubmit={handleCreateCategory}
            style={{ marginBottom: "16px" }}
          >
            <input
              type="text"
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />

            <button
              type="submit"
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#111",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Create Category
            </button>
          </form>

          {loadingCategories && <p>Loading categories...</p>}
          {categoryError && <p>{categoryError}</p>}

          {!loadingCategories && categories.length === 0 && (
            <p>No categories yet.</p>
          )}

          {!loadingCategories && categories.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {categories.map((category) => (
                <span
                  key={category.id}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ marginBottom: "12px" }}>
            {editingPostId ? "Edit Post" : "Create Post"}
          </h2>

          <form onSubmit={handleSubmitPost} style={{ marginBottom: "24px" }}>
            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />

            <input
              type="text"
              placeholder="Short excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />

            <textarea
              placeholder="Post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Publish immediately
            </label>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#111",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {editingPostId ? "Update Post" : "Create Post"}
              </button>

              {editingPostId && (
                <button
                  type="button"
                  onClick={resetPostForm}
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    color: "#111",
                    cursor: "pointer",
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 style={{ marginBottom: "12px" }}>Admin Posts</h2>

          {loadingPosts && <p>Loading posts...</p>}
          {postError && <p>{postError}</p>}

          {!loadingPosts && !postError && posts.length === 0 && (
            <p>No posts in admin yet.</p>
          )}

          {!loadingPosts && posts.length > 0 && (
            <div>
              {posts.map((post) => {
                const { tags, cleanContent } = extractTags(post.content);

                return (
                  <div
                    key={post.id}
                    style={{
                      marginBottom: "16px",
                      padding: "16px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                    }}
                  >
                    <h3 style={{ marginBottom: "10px" }}>{post.title}</h3>

                    {post.excerpt && (
                      <p style={{ marginBottom: "10px", color: "#555" }}>
                        {post.excerpt}
                      </p>
                    )}

                    {tags.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              display: "inline-block",
                              padding: "6px 10px",
                              marginRight: "6px",
                              marginBottom: "6px",
                              borderRadius: "999px",
                              backgroundColor: "#eef2ff",
                              color: "#3730a3",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {cleanContent && (
                      <p
                        style={{
                          marginBottom: "12px",
                          lineHeight: "1.7",
                          color: "#222",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {cleanContent}
                      </p>
                    )}

                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <button
                        type="button"
                        onClick={() => handleEditPost(post)}
                        style={{
                          padding: "8px 14px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "#f59e0b",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        style={{
                          padding: "8px 14px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
