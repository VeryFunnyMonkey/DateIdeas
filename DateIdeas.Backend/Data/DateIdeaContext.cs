using Microsoft.EntityFrameworkCore;
using DateIdeasBackend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace DateIdeasBackend.Data
{
    public class DateIdeasContext : IdentityDbContext<ApplicationUser>
    {
        public DateIdeasContext(DbContextOptions<DateIdeasContext> options) : base(options) { }

        public DbSet<DateIdea> DateIdeas { get; set; }
        public DbSet<Tag> Tags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DateIdea>()
                .HasMany(d => d.Tags)
                .WithMany(t => t.DateIdeas);
            
            modelBuilder.Entity<DateIdea>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(d => d.UserId);

            modelBuilder.Entity<Tag>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(t => t.UserId);

            base.OnModelCreating(modelBuilder);
        }
    }
}