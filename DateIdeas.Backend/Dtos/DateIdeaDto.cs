using System.ComponentModel.DataAnnotations;

namespace DateIdeasBackend.Dtos
{
    public class CreateDateIdeaDto
    {
        [Required]
        public required string Title { get; set; }
        public string? Location { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public bool? Keep { get; set; }
        [Required]
        public required bool IsCompleted { get; set; }
        public List<int>? TagIds { get; set;}
    }

        public class DateIdeaDto
    {
        public int Id { get; set; }
        [Required]
        public required string Title { get; set; }
        public string? Location { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public bool? Keep { get; set; }
        [Required]
        public required bool IsCompleted { get; set; }
        public List<TagDto>? Tags { get; set;}
    }

        public class UpdateDateIdeaDto
    {
        [Required]
        public required string Title { get; set; }
        public string? Location { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public bool? Keep { get; set; }
        [Required]
        public required bool IsCompleted { get; set; }
        public List<int>? TagIds { get; set;}
    }
}