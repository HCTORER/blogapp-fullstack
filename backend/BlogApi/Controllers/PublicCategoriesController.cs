using BlogApi.DTOs;
using BlogApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/public/categories")]
    public class PublicCategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public PublicCategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();

            return Ok(new ApiResponseDto<object>
            {
                Success = true,
                Message = "Categories fetched successfully.",
                Data = categories
            });
        }
    }
}