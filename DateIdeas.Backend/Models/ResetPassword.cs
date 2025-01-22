namespace DateIdeasBackend.Models
{
    public class ResetPassword
    {
        public required string Email { get; set; }
        public string Token { get; set; }
        public required string Password { get; set; }
    }
}