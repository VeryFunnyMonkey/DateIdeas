using System.ComponentModel.DataAnnotations;

namespace DateIdeasBackend.Dtos
{
    public class CreateTagDto
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string userId { get; set; }
    }

    public class TagDto
    {
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string userId { get; set; }
    }

        public class UpdateTagDto
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string userId { get; set; }
    }

}