using DateIdeasBackend.Hubs;
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

// Add services to the container.
builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddSignalR();

// Configure SQLite
builder.Services.AddDbContext<DateIdeasBackend.Data.DateIdeasContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DateIdeasContext")));

var app = builder.Build();

// Ensure the database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DateIdeasBackend.Data.DateIdeasContext>();
    context.Database.EnsureCreated(); // This will create the database if it doesn't exist
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();
app.MapHub<DateIdeasHub>("/hubs/dateIdeas");

app.Run();