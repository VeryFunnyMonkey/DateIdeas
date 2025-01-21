using DateIdeasBackend.Models;

namespace DateIdeas.Backend.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(Email email);
    }
}