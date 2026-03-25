import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services/postService";
import type { Post, PostsResponse } from "../types/post";
import { extractTags } from "../utils/postUtils";

type PostWithTags = Post & {
  tags?: string[];
};

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response: PostsResponse = await postService.getAllPosts(
          page,
          pageSize,
        );

        const listItems = response.data.items;
        setTotalCount(response.data.totalCount);

        const postsWithTags = await Promise.all(
          listItems.map(async (post) => {
            try {
              const detailResponse = await postService.getBySlug(post.slug);
              const { tags } = extractTags(detailResponse.data.content);

              return {
                ...post,
                tags,
              };
            } catch (err) {
              console.error(`Failed to load tags for post: ${post.slug}`, err);

              return {
                ...post,
                tags: [],
              };
            }
          }),
        );

        setPosts(postsWithTags);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [page, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="page-section">
      <div className="posts-header">
        <h1>Posts</h1>
        <p>
          Technical write-ups about how I built BlogApp with frontend, backend,
          and full stack development practices.
        </p>
      </div>

      {loading && (
        <div className="posts-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="post-card skeleton-card">
              <div className="post-card-body">
                <div className="skeleton skeleton-tag-row" />
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text short" />
                <div className="skeleton skeleton-link" />
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p>{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p>No posts available yet.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-body">
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="post-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="post-card-title">
                    <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {post.excerpt && (
                    <p className="post-card-excerpt">{post.excerpt}</p>
                  )}

                  <Link to={`/posts/${post.slug}`} className="read-more-link">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>

            <span className="pagination-info">
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={handleNext}
              disabled={page >= totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </section>
  );
}
