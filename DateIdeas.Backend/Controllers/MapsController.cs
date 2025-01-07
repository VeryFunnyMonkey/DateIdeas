using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DateIdeasBackend.Controllers
{
    [Route("api/maps")]
    [ApiController]
    [Authorize]
    public class MapsController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public MapsController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet("places/autocomplete")]
        public async Task<IActionResult> GetAutocomplete([FromQuery] string query)
        {
            var apiKey = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY") ?? _configuration["GOOGLE_MAPS_API_KEY"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return BadRequest("API key is missing");
            }
            
            var url = $"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={query}&key={apiKey}";

            using (var client = new HttpClient())
            {
                var response = await client.GetStringAsync(url);
                return Content(response, "application/json");
            }
        }
    }
}
