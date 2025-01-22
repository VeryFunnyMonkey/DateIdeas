using DateIdeas.Backend.Services;
using DateIdeasBackend.Data;
using DateIdeasBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DateIdeas.Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;

        private readonly string frontendUrl;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailSender emailSender, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _configuration = configuration;
            frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? _configuration["FRONTEND_URL"] ?? "http://frontend:3000";
        }

       // POST: /register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var emailConfirmationRequired = _userManager.Options.SignIn.RequireConfirmedEmail;
                if (emailConfirmationRequired)
                {
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var callbackUrl = Url.Action(nameof(ConfirmEmail), "Auth", new { userId = user.Id, code }, protocol: HttpContext.Request.Scheme);

                    var email = new Email
                    {
                        To = user.Email,
                        Subject = "Confirm your email",
                        Body = $"Please confirm your account by <a href='{callbackUrl}'>clicking here</a>."
                    };

                    await _emailSender.SendEmailAsync(email);

                    return Ok(new { message = "Registration successful. Please check your email to confirm your account.", emailConfirmationRequired });
                }
                else
                    return Ok(new { message = "Registration successful.", emailConfirmationRequired });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        // GET: /confirmemail
        [HttpGet("confirmemail")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return BadRequest("Invalid email confirmation request.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{userId}'.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                return Ok("Email confirmed successfully.");
            }

            return BadRequest("Error confirming your email.");
        }

        // POST: /forgotpassword
        [HttpPost("forgotpassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ForgotPassword model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user is not null && await _userManager.IsEmailConfirmedAsync(user))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var callbackUrl = $"{frontendUrl}/resetpassword?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";

                Console.WriteLine(token);

                var email = new Email
                {
                    To = model.Email,
                    Subject = "Reset Password",
                    Body = $"Please reset your password by clicking here: <a href='{callbackUrl}'>link</a>"
                };
                
                await _emailSender.SendEmailAsync(email);
            }

            // var callbackUrl = Url.Action("ResetPassword", "Auth", new { token, email = user.Email }, protocol: HttpContext.Request.Scheme);
            // var callbackUrl = $"{frontendUrl}/resetpassword?token={token}&email={user.Email}";

            return Ok("Password reset link has been sent to your email.");
        }

        [HttpPost("resetpassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(ResetPassword model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest("User not found");

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            Console.WriteLine(result);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return BadRequest(ModelState);
            }

            return Ok("Password has been reset successfully.");
        }

        // POST: /logout
        [HttpPost("logout")]
        public async Task<IActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Signed out successfully" });
        }
    }
}