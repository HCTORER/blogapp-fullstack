using BlogApi.DTOs;
using BlogApi.Models;

namespace BlogApi.Services.Interfaces
{
    public interface IPostService
    {
        Task<List<BlogPost>> GetAllPostsAsync();
        Task<BlogPost?> GetPostByIdAsync(int id);
        Task<BlogPost> CreatePostAsync(CreatePostDto dto);
        Task<BlogPost?> UpdatePostAsync(int id, UpdatePostDto dto);
        Task<bool> DeletePostAsync(int id);
        Task<PagedResultDto<PostListItemDto>> GetPublishedPostsAsync(int page, int pageSize);
        Task<PostDetailDto?> GetPublishedPostBySlugAsync(string slug);
    }
}