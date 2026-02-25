using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebApiGetway.Controllers
{
    [ApiController]
    [Route("Bff/admin")]
    public class AdminHealthController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;

        public AdminHealthController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        [HttpGet("health")]
        public async Task<IActionResult> GetHealth()
        {
            var checks = new List<ServiceCheck>
            {
                new("gateway", "API Gateway", null),
                new("db", "PostgreSQL", "UserApiService"),
                new("user", "User API", "UserApiService"),
                new("offer", "Offer API", "OfferApiService"),
                new("location", "Location API", "LocationApiService"),
                new("order", "Order API", "OrderApiService"),
                new("review", "Review API", "ReviewApiService"),
                new("attraction", "Attraction API", "AttractionApiService"),
                new("translation", "Translation API", "TranslationApiService"),
                new("statistic", "Statistic API", "StatisticApiService"),
            };

            var results = new List<HealthResult>();

            foreach (var check in checks)
            {
                if (check.ClientName is null)
                {
                    results.Add(new HealthResult
                    {
                        Id = check.Id,
                        Name = check.Name,
                        Status = "ok",
                        LatencyMs = 0,
                    });
                    continue;
                }

                results.Add(await ProbeService(check));
            }

            return Ok(new
            {
                checkedAt = DateTime.UtcNow.ToString("O"),
                services = results
            });
        }

        private async Task<HealthResult> ProbeService(ServiceCheck check)
        {
            var client = _clientFactory.CreateClient(check.ClientName!);
            var stopwatch = Stopwatch.StartNew();

            try
            {
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
                var response = await client.GetAsync("/health", cts.Token);
                stopwatch.Stop();

                var status = response.IsSuccessStatusCode ? "ok" : "degraded";
                var message = response.IsSuccessStatusCode
                    ? null
                    : $"HTTP {(int)response.StatusCode}";

                return new HealthResult
                {
                    Id = check.Id,
                    Name = check.Name,
                    Status = status,
                    Message = message,
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds,
                };
            }
            catch (TaskCanceledException)
            {
                stopwatch.Stop();
                return new HealthResult
                {
                    Id = check.Id,
                    Name = check.Name,
                    Status = "down",
                    Message = "timeout",
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds,
                };
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return new HealthResult
                {
                    Id = check.Id,
                    Name = check.Name,
                    Status = "down",
                    Message = ex.Message,
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds,
                };
            }
        }

        private sealed record ServiceCheck(string Id, string Name, string? ClientName);

        private sealed class HealthResult
        {
            public string Id { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string Status { get; set; } = "unknown";
            public string? Message { get; set; }
            public int LatencyMs { get; set; }
        }
    }
}
