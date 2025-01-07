using System.ComponentModel.DataAnnotations;

namespace DateIdeasBackend.Models
{
    public class Tag
    {
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }

        public List<DateIdea> DateIdeas { get; set;} = [];
    }
}