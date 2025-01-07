using System.ComponentModel.DataAnnotations;

namespace DateIdeasBackend.Models
{
    public class DateIdea
    {
        public int Id { get; set; }
        [Required]
        public required string Title { get; set; }
        public string? Location { get; set; }
        public DateTime? Date { get; set; }
        public List<Tag> Tags { get; set;} = [];
        [Required]
        public required string UserId { get; set; }
    }
}