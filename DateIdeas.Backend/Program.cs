using DateIdeas.Backend.Services;
using DateIdeasBackend.Data;
using DateIdeasBackend.Hubs;
using DateIdeasBackend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Get the frontend URL from environment variables or use a default
var frontendUrl = builder.Configuration["FRONTEND_URL"] ?? "http://frontend:3000";

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins(frontendUrl)
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
});

builder.Logging.AddConsole();

// Add services to the container.
builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddSignalR();
builder.Services.AddHostedService<DateIdeaExpirationHandlerService>();

builder.Services.AddIdentityApiEndpoints<ApplicationUser>(options => 
{ 
    options.User.RequireUniqueEmail = true; 
    // options.Password.RequireNonAlphanumeric = false;
    options.SignIn.RequireConfirmedEmail = true; 
})
    .AddEntityFrameworkStores<DateIdeasContext>();

// Add email service - get the email config settings from appsettings.json
builder.Services.AddTransient<IEmailSender, EmailSender>(serviceProvider =>
{
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();
    var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? configuration["EmailSettings:SmtpHost"];
    var smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? configuration["EmailSettings:SmtpPort"]);
    var smtpUser = Environment.GetEnvironmentVariable("SMTP_USER") ?? configuration["EmailSettings:SmtpUser"];
    var smtpPass = Environment.GetEnvironmentVariable("SMTP_PASS") ?? configuration["EmailSettings:SmtpPass"];
    var fromEmail = Environment.GetEnvironmentVariable("FROM_EMAIL") ?? configuration["EmailSettings:FromEmail"];
    
    return new EmailSender(smtpHost, smtpPort, smtpUser, smtpPass, fromEmail);
});

// Configure SQLite
builder.Services.AddDbContext<DateIdeasContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DateIdeasContext")));

var app = builder.Build();

// Ensure the database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DateIdeasContext>();
    context.Database.EnsureCreated(); // This will create the database if it doesn't exist
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGroup("/AuthApi").MapIdentityApi<ApplicationUser>();

app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();
app.MapHub<DateIdeasHub>("/hubs/dateIdeas");

app.Run();