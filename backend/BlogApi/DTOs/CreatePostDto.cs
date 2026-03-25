using System.ComponentModel.DataAnnotations;

namespace BlogApi.DTOs
{
    public class CreatePostDto
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(300)]
        public string Excerpt { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Slug { get; set; } = string.Empty;

        public bool IsPublished { get; set; } = false;

        [Required]
        public int CategoryId { get; set; }
    }
}