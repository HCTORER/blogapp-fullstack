using BlogApi.DTOs;
using BlogApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/public/posts")]
    public class PublicPostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PublicPostsController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublishedPosts(int page = 1, int pageSize = 5)
        {
            var result = await _postService.GetPublishedPostsAsync(page, pageSize);

            return Ok(new ApiResponseDto<object>
            {
                Success = true,
                Message = "Posts fetched successfully.",
                Data = result
            });
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetPublishedPostBySlug(string slug)
        {
            var post = await _postService.GetPublishedPostBySlugAsync(slug);

            if (post == null)
            {
                return NotFound(new ApiResponseDto<object>
                {
                    Success = false,
                    Message = "Post not found.",
                    Data = null
                });
            }

            return Ok(new ApiResponseDto<object>
            {
                Success = true,
                Message = "Post fetched successfully.",
                Data = post
            });
        }
    }
}