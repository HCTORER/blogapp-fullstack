import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { postService } from "../services/postService";
import type { Post } from "../types/post";

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const extractTags = (content?: string): string[] => {
    if (!content) return [];

    const match = content.match(/\[TAGS\](.*?)\[\/TAGS\]/s);
    if (!match) return [];

    return match[1]
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const removeTagsBlock = (content?: string): string => {
    if (!content) return "";

    return content.replace(/\[TAGS\](.*?)\[\/TAGS\]/s, "").trim();
  };

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError("Post slug is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await postService.getBySlug(slug);
        setPost(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const tags = useMemo(() => extractTags(post?.content), [post?.content]);
  const cleanedContent = useMemo(
    () => removeTagsBlock(post?.content),
    [post?.content],
  );

  if (loading) {
    return (
      <section className="page-section">
        <div className="skeleton-detail">
          <div className="skeleton skeleton-detail-title" />
          <div className="skeleton skeleton-tag-row" />
          <div className="skeleton skeleton-detail-excerpt" />
          <div className="skeleton skeleton-divider" />
          <div className="skeleton skeleton-detail-line" />
          <div className="skeleton skeleton-detail-line" />
          <div className="skeleton skeleton-detail-line short" />
          <div className="skeleton skeleton-detail-line" />
          <div className="skeleton skeleton-detail-line medium" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section">
        <p>{error}</p>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="page-section">
        <p>Post not found.</p>
      </section>
    );
  }

  return (
    <section className="page-section">
      <h1>{post.title}</h1>

      {tags.length > 0 && (
        <div style={{ marginTop: "12px", marginBottom: "16px" }}>
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                padding: "6px 10px",
                marginRight: "8px",
                marginBottom: "8px",
                backgroundColor: "#eef2ff",
                color: "#3730a3",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {post.excerpt && (
        <p style={{ marginTop: "12px", color: "#555", lineHeight: "1.6" }}>
          {post.excerpt}
        </p>
      )}

      <hr
        style={{
          margin: "24px 0",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
      />

      {cleanedContent && (
        <div
          style={{ lineHeight: "1.8", color: "#222", whiteSpace: "pre-line" }}
        >
          {cleanedContent}
        </div>
      )}
    </section>
  );
}
