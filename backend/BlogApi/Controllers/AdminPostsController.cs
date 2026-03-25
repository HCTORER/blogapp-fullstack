using BlogApi.DTOs;
using BlogApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/admin/posts")]
    [Authorize(Roles = "Admin")]
    public class AdminPostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public AdminPostsController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postService.GetAllPostsAsync();
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(int id)
        {
            var post = await _postService.GetPostByIdAsync(id);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            return Ok(post);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost(CreatePostDto dto)
        {
            var post = await _postService.CreatePostAsync(dto);

            return Ok(new ApiResponseDto<object>
            {
                Success = true,
                Message = "Post created successfully.",
                Data = post
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, UpdatePostDto dto)
        {
            var post = await _postService.UpdatePostAsync(id, dto);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            return Ok(post);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            await _postService.DeletePostAsync(id);

            return Ok(new ApiResponseDto<object>
            {
                Success = true,
                Message = "Post deleted successfully.",
                Data = null
            });
        }
    }
}