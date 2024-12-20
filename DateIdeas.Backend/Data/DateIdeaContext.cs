using Microsoft.EntityFrameworkCore;
using DateIdeasBackend.Models;

namespace DateIdeasBackend.Data
{
    public class DateIdeasContext : DbContext
    {
        public DateIdeasContext(DbContextOptions<DateIdeasContext> options) : base(options) { }

        public DbSet<DateIdea> DateIdeas { get; set; }
        public DbSet<Tag> Tags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DateIdea>()
                .HasMany(d => d.Tags)
                .WithMany(t => t.DateIdeas);

            base.OnModelCreating(modelBuilder);
        }
    }
}