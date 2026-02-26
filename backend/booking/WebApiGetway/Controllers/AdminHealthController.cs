using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;

namespace WebApiGetway.Controllers
{
    [ApiController]
    [Route("Bff/admin")]
    public class AdminHealthController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;

        public AdminHealthController(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
        }

        [HttpGet("health")]
        public async Task<IActionResult> GetHealth()
        {
            var internalChecks = new List<ServiceCheck>
            {
                new("gateway", "API Gateway", null),
            };

            var results = new List<HealthResult>();

            foreach (var check in internalChecks)
            {
                if (check.ClientName is null)
                {
                    results.Add(new HealthResult
                    {
                        Id = check.Id,
                        Name = check.Name,
                        Category = "bff",
                        Status = "ok",
                        LatencyMs = 0,
                    });
                    continue;
                }

                results.Add(await ProbeService(check));
            }

            var externalChecks = await Task.WhenAll(
                ProbeDatabase(),
                ProbeRabbitMq(),
                ProbePayPal(),
                ProbeLiqPay(),
                ProbeLogsStorage()
            );

            results.AddRange(externalChecks);

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
                    Category = "bff",
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
                    Category = "bff",
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
                    Category = "bff",
                    Status = "down",
                    Message = ex.Message,
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds,
                };
            }
        }

        private async Task<HealthResult> ProbeDatabase()
        {
            var host = _configuration["POSTGRES_HOST"] ?? _configuration["DB_HOST"] ?? "postgres";
            var portRaw = _configuration["POSTGRES_PORT"] ?? _configuration["DB_PORT"] ?? "5432";
            var database = _configuration["POSTGRES_DB"] ?? _configuration["DB_NAME"] ?? "postgres";
            var username = _configuration["POSTGRES_USER"] ?? _configuration["DB_USER"] ?? "postgres";
            var password = _configuration["POSTGRES_PASSWORD"] ?? _configuration["DB_PASSWORD"] ?? "postgrespw";
            var port = int.TryParse(portRaw, out var p) ? p : 5432;

            var connectionString = new NpgsqlConnectionStringBuilder
            {
                Host = host,
                Port = port,
                Database = database,
                Username = username,
                Password = password,
                Timeout = 3,
                CommandTimeout = 3,
                SslMode = SslMode.Disable
            }.ConnectionString;

            var stopwatch = Stopwatch.StartNew();
            try
            {
                await using var connection = new NpgsqlConnection(connectionString);
                await connection.OpenAsync();
                await using var command = new NpgsqlCommand("SELECT 1", connection);
                await command.ExecuteScalarAsync();
                stopwatch.Stop();
                return new HealthResult
                {
                    Id = "db",
                    Name = "PostgreSQL",
                    Category = "db",
                    Status = "ok",
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return new HealthResult
                {
                    Id = "db",
                    Name = "PostgreSQL",
                    Category = "db",
                    Status = "down",
                    Message = ex.Message,
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
        }

        private async Task<HealthResult> ProbeRabbitMq()
        {
            var host = _configuration["RABBITMQ_HOST"] ?? "rabbitmq";
            var portRaw = _configuration["RABBITMQ_PORT"] ?? "5672";
            var port = int.TryParse(portRaw, out var p) ? p : 5672;

            var stopwatch = Stopwatch.StartNew();
            try
            {
                using var tcpClient = new TcpClient();
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
                await tcpClient.ConnectAsync(host, port, cts.Token);
                stopwatch.Stop();
                return new HealthResult
                {
                    Id = "rabbitmq",
                    Name = "RabbitMQ",
                    Category = "rabbit",
                    Status = "ok",
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return new HealthResult
                {
                    Id = "rabbitmq",
                    Name = "RabbitMQ",
                    Category = "rabbit",
                    Status = "down",
                    Message = ex.Message,
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
        }

        private async Task<HealthResult> ProbePayPal()
        {
            var baseUrl = _configuration["PAYPAL_BASE_URL"] ?? _configuration["PAYPAL_API_BASE"];
            if (string.IsNullOrWhiteSpace(baseUrl))
            {
                return new HealthResult
                {
                    Id = "paypal",
                    Name = "PayPal",
                    Category = "payments",
                    Status = "degraded",
                    Message = "PAYPAL_BASE_URL is not configured",
                    LatencyMs = 0
                };
            }

            var endpoint = $"{baseUrl.TrimEnd('/')}/v1/oauth2/token";
            return await ProbeHttpReachability("paypal", "PayPal", endpoint, HttpMethod.Post, true);
        }

        private async Task<HealthResult> ProbeLiqPay()
        {
            var liqPayUrl = "https://www.liqpay.ua/api/request";
            var publicKey = _configuration["LIQPAY_PUBLIC_KEY"];
            var privateKey = _configuration["LIQPAY_PRIVATE_KEY"];
            if (string.IsNullOrWhiteSpace(publicKey) || string.IsNullOrWhiteSpace(privateKey))
            {
                return new HealthResult
                {
                    Id = "liqpay",
                    Name = "LiqPay",
                    Category = "payments",
                    Status = "degraded",
                    Message = "LiqPay keys are not configured",
                    LatencyMs = 0
                };
            }

            return await ProbeHttpReachability("liqpay", "LiqPay", liqPayUrl, HttpMethod.Get, false);
        }

        private async Task<HealthResult> ProbeLogsStorage()
        {
            var directoryPath = ResolveLogsDirectory();
            var stopwatch = Stopwatch.StartNew();

            try
            {
                Directory.CreateDirectory(directoryPath);
                var markerFile = Path.Combine(directoryPath, ".healthcheck-write-test");
                await System.IO.File.WriteAllTextAsync(markerFile, DateTime.UtcNow.ToString("O"));
                System.IO.File.Delete(markerFile);

                stopwatch.Stop();
                return new HealthResult
                {
                    Id = "logs",
                    Name = "Logs Storage",
                    Category = "logs",
                    Status = "ok",
                    Message = directoryPath,
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return new HealthResult
                {
                    Id = "logs",
                    Name = "Logs Storage",
                    Category = "logs",
                    Status = "down",
                    Message = ex.Message,
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
        }

        private async Task<HealthResult> ProbeHttpReachability(
            string id,
            string name,
            string url,
            HttpMethod method,
            bool useFormBody)
        {
            var stopwatch = Stopwatch.StartNew();
            try
            {
                using var request = new HttpRequestMessage(method, url);
                if (useFormBody)
                {
                    request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
                    {
                        ["grant_type"] = "client_credentials"
                    });
                }

                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                using var client = new HttpClient();
                using var response = await client.SendAsync(request, cts.Token);
                stopwatch.Stop();

                var status = response.StatusCode == HttpStatusCode.Unauthorized
                    || response.StatusCode == HttpStatusCode.Forbidden
                    || response.StatusCode == HttpStatusCode.MethodNotAllowed
                    || response.IsSuccessStatusCode
                    ? "ok"
                    : "degraded";

                return new HealthResult
                {
                    Id = id,
                    Name = name,
                    Category = id is "paypal" or "liqpay" ? "payments" : "bff",
                    Status = status,
                    Message = $"HTTP {(int)response.StatusCode}",
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return new HealthResult
                {
                    Id = id,
                    Name = name,
                    Category = id is "paypal" or "liqpay" ? "payments" : "bff",
                    Status = "down",
                    Message = ex.Message,
                    LatencyMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
        }

        private string ResolveLogsDirectory()
        {
            var currencyRatesFilePath = _configuration["CURRENCY_RATES_FILE_PATH"];
            if (!string.IsNullOrWhiteSpace(currencyRatesFilePath))
            {
                var fullPath = Path.IsPathRooted(currencyRatesFilePath)
                    ? currencyRatesFilePath
                    : Path.Combine(Directory.GetCurrentDirectory(), currencyRatesFilePath);
                var directory = Path.GetDirectoryName(fullPath);
                if (!string.IsNullOrWhiteSpace(directory))
                {
                    return directory;
                }
            }

            return Path.Combine(Directory.GetCurrentDirectory(), "data");
        }

        private sealed record ServiceCheck(string Id, string Name, string? ClientName);

        private sealed class HealthResult
        {
            public string Id { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string Category { get; set; } = "bff";
            public string Status { get; set; } = "unknown";
            public string? Message { get; set; }
            public int LatencyMs { get; set; }
        }
    }
}
