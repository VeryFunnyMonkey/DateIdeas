using DateIdeasBackend.Models;

namespace DateIdeas.Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(Email email);
    }
}