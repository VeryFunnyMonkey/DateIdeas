using System.ComponentModel.DataAnnotations;

namespace DateIdeasBackend.Models
{
    public class DateIdea
    {
        public int Id { get; set; }
        [Required]
        public required string Title { get; set; }
        public string? Location { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public bool? Keep { get; set; }
        [Required]
        public required bool IsCompleted { get; set; }
        public List<Tag> Tags { get; set;} = [];
        [Required]
        public required string UserId { get; set; }
    }
}