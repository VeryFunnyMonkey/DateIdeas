using Microsoft.AspNetCore.Mvc;
using DateIdeasBackend.Models;
using DateIdeas.Backend.Services;

namespace DateIdeasBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailSender _emailSender;

        public EmailController(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] Email email)
        {
            // Validate input
            if (string.IsNullOrEmpty(email.To) || string.IsNullOrEmpty(email.Subject) || string.IsNullOrEmpty(email.Body))
            {
                return BadRequest("To, Subject, and Body fields are required.");
            }

            try
            {
                // Send the email
                await _emailSender.SendEmailAsync(email);
                return Ok("Email sent successfully!");
            }
            catch (Exception ex)
            {
                // Log the error (consider adding a logging service)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
