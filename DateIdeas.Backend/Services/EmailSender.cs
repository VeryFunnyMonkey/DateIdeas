using DateIdeas.Backend.Services;
using DateIdeasBackend.Data;
using DateIdeasBackend.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

public class EmailSender : IEmailSender
{
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPass;
    private readonly string _fromEmail;

    public EmailSender(string smtpHost, int smtpPort, string smtpUser, string smtpPass, string fromEmail)
    {
        _smtpHost = smtpHost;
        _smtpPort = smtpPort;
        _smtpUser = smtpUser;
        _smtpPass = smtpPass;
        _fromEmail = fromEmail;
    }

    public async Task SendEmailAsync(Email email)
    {
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("Date Ideas", _fromEmail));
        emailMessage.To.Add(new MailboxAddress("", email.To));
        emailMessage.Subject = email.Subject;
        emailMessage.Body = new TextPart("html") { Text = email.Body };

        using (var client = new SmtpClient())
        {
            await client.ConnectAsync(_smtpHost, _smtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpUser, _smtpPass);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }
    }
}
