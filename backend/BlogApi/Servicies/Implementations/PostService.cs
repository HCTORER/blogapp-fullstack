using BlogApi.Data;
using BlogApi.DTOs;
using BlogApi.Exceptions;
using BlogApi.Models;
using BlogApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services.Implementations
{
    public class PostService : IPostService
    {
        private readonly AppDbContext _context;

        public PostService(AppDbContext context)
        {
            _context = context;
        }

        // ADMIN: All posts
        public async Task<List<BlogPost>> GetAllPostsAsync()
        {
            return await _context.BlogPosts
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        // ADMIN: Single post by id
        public async Task<BlogPost?> GetPostByIdAsync(int id)
        {
            return await _context.BlogPosts.FindAsync(id);
        }

        // ADMIN: Create post
        public async Task<BlogPost> CreatePostAsync(CreatePostDto dto)
        {
            var slugExists = await _context.BlogPosts
                .AnyAsync(x => x.Slug == dto.Slug);

            if (slugExists)
            {
                throw new BadRequestException("A post with the same slug already exists.");
            }

            var post = new BlogPost
            {
                Title = dto.Title,
                Excerpt = dto.Excerpt,
                Content = dto.Content,
                Slug = dto.Slug,
                IsPublished = dto.IsPublished,
                CategoryId = dto.CategoryId,
                CreatedAt = DateTime.UtcNow
            };

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            return post;
        }

        // ADMIN: Update post
        public async Task<BlogPost?> UpdatePostAsync(int id, UpdatePostDto dto)
        {
            var post = await _context.BlogPosts.FindAsync(id);

            if (post == null)
            {
                throw new NotFoundException("Post not found.");
            }

            var slugExists = await _context.BlogPosts
                .AnyAsync(x => x.Slug == dto.Slug && x.Id != id);

            if (slugExists)
            {
                throw new BadRequestException("Another post with the same slug already exists.");
            }

            post.Title = dto.Title;
            post.Excerpt = dto.Excerpt;
            post.Content = dto.Content;
            post.Slug = dto.Slug;
            post.IsPublished = dto.IsPublished;
            post.CategoryId = dto.CategoryId;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return post;
        }

        // ADMIN: Delete post
        public async Task<bool> DeletePostAsync(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);

            if (post == null)
            {
                throw new NotFoundException("Post not found.");
            }

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            return true;
        }

        // PUBLIC: Published posts with pagination
        public async Task<PagedResultDto<PostListItemDto>> GetPublishedPostsAsync(int page, int pageSize)
        {
            var query = _context.BlogPosts
                .Include(x => x.Category)
                .Where(x => x.IsPublished);

            var totalCount = await query.CountAsync();

            var posts = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new PostListItemDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Excerpt = x.Excerpt,
                    Slug = x.Slug,
                    CategoryName = x.Category != null ? x.Category.Name : "",
                    CategorySlug = x.Category != null ? x.Category.Slug : "",
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return new PagedResultDto<PostListItemDto>
            {
                Items = posts,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        // PUBLIC: Published post detail by slug
        public async Task<PostDetailDto?> GetPublishedPostBySlugAsync(string slug)
        {
            return await _context.BlogPosts
                .Include(x => x.Category)
                .Where(x => x.IsPublished && x.Slug == slug)
                .Select(x => new PostDetailDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Excerpt = x.Excerpt,
                    Content = x.Content,
                    Slug = x.Slug,
                    CategoryName = x.Category != null ? x.Category.Name : "",
                    CategorySlug = x.Category != null ? x.Category.Slug : "",
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }
    }
}