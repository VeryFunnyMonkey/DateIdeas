using AutoMapper;
using DateIdeasBackend.Data;
using DateIdeasBackend.Hubs;
using DateIdeasBackend.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace DateIdeasBackend.Services
{
    public class DateIdeaExpirationHandlerService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DateIdeaExpirationHandlerService> _logger;
        private readonly IMapper _mapper;
        private readonly IHubContext<DateIdeasHub> _hubContext;

        public DateIdeaExpirationHandlerService(IServiceProvider serviceProvider, ILogger<DateIdeaExpirationHandlerService> logger, IMapper mapper, IHubContext<DateIdeasHub> hubContext)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Check for updates
                    var delay = await CheckAndUpdateDateIdeasAsync(stoppingToken);

                    // Wait until the next check
                    _logger.LogInformation("Next check in {Delay}ms", delay);
                    await Task.Delay(delay, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Task cancelled.");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred in DateIdeasTaskService.");
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Retry after a delay
                }
            }
        }

        private async Task<int> CheckAndUpdateDateIdeasAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<DateIdeasContext>();

            var currentTime = DateTime.UtcNow;

            // Get outdated DateIdeas
            var outdatedDateIdeas = dbContext.DateIdeas
                .Where(d => d.ScheduledDate != null && d.ScheduledDate < currentTime);

            // Update outdated DateIdeas
            foreach (var dateIdea in outdatedDateIdeas)
            {
                _logger.LogInformation("Outdated DateIdea found: {DateIdeaId}", dateIdea.Id);
                // return dateIdea to the pool if it's marked to keep
                if (dateIdea.Keep == true)
                {
                    dateIdea.ScheduledDate = null; // Disable scheduling
                }
                else
                {
                    dateIdea.IsCompleted = true; // Mark as completed
                    dateIdea.ScheduledDate = null; // Disable scheduling
                }
                await dbContext.SaveChangesAsync(cancellationToken);
                await _hubContext.Clients.Group(dateIdea.UserId).SendAsync("UpdateDateIdea", _mapper.Map<DateIdeaDto>(dateIdea));
            }

            var delay = (int)TimeSpan.FromMinutes(1).TotalMilliseconds;

            return delay;
        }
    }
}