using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace WebApiGetway.Service;

public sealed class CurrencyRatesScheduler : BackgroundService
{
    private static readonly int[] RunHours = { 9, 12, 18 };

    private readonly ILogger<CurrencyRatesScheduler> _logger;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly IHttpClientFactory _httpClientFactory;

    public CurrencyRatesScheduler(
        ILogger<CurrencyRatesScheduler> logger,
        IConfiguration configuration,
        IWebHostEnvironment environment,
        IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _configuration = configuration;
        _environment = environment;
        _httpClientFactory = httpClientFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var nowUtc = DateTime.UtcNow;
            var nextRunUtc = GetNextRunUtc(nowUtc);
            var delay = nextRunUtc - nowUtc;
            if (delay < TimeSpan.Zero)
            {
                delay = TimeSpan.FromMinutes(1);
            }

            _logger.LogInformation("Currency scheduler sleeping for {Delay}. Next run at {NextRunUtc}.", delay, nextRunUtc);

            try
            {
                await Task.Delay(delay, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }

            if (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            try
            {
                await UpdateRatesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Currency scheduler update failed.");
            }
        }
    }

    private async Task UpdateRatesAsync(CancellationToken cancellationToken)
    {
        var requestUrl = BuildPrivatBankUrl();
        if (string.IsNullOrWhiteSpace(requestUrl))
        {
            _logger.LogWarning("Currency scheduler skipped: missing PrivatBank URL.");
            return;
        }

        var client = _httpClientFactory.CreateClient("CurrencyRates");
        using var response = await client.GetAsync(requestUrl, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Currency scheduler failed. HTTP {Status} for {Url}.", response.StatusCode, requestUrl);
            return;
        }

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var parsedRates = ParsePrivatBankRates(json);
        if (parsedRates.Count == 0)
        {
            _logger.LogWarning("Currency scheduler received empty rates.");
            return;
        }

        var payload = new CurrencyRatesFileDto
        {
            BaseCurrency = "UAH",
            SupportedCurrencies = parsedRates.Keys.OrderBy(k => k).ToList(),
            Rates = parsedRates,
            UpdatedAtUtc = DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture),
            Source = requestUrl,
            Disclaimer = "Rates from PrivatBank (coursid=11)."
        };

        var path = ResolveRatesFilePath();
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        var output = JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(path, output, cancellationToken);

        _logger.LogInformation("Currency rates updated: {Path}", path);
    }

    private string? BuildPrivatBankUrl()
    {
        var baseUrl = _configuration["PRIVATBANK_API_URL"]?.Trim();
        var endpoint = _configuration["PRIVATBANK_EXCHANGE_ENDPOINT"]?.Trim();
        if (string.IsNullOrWhiteSpace(baseUrl) && string.IsNullOrWhiteSpace(endpoint))
        {
            return "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";
        }

        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            return endpoint;
        }

        if (string.IsNullOrWhiteSpace(endpoint))
        {
            return baseUrl;
        }

        if (baseUrl.EndsWith("/", StringComparison.Ordinal) && endpoint.StartsWith("/", StringComparison.Ordinal))
        {
            return baseUrl + endpoint[1..];
        }

        if (!baseUrl.EndsWith("/", StringComparison.Ordinal) && !endpoint.StartsWith("/", StringComparison.Ordinal))
        {
            return baseUrl + "/" + endpoint;
        }

        return baseUrl + endpoint;
    }

    private string ResolveRatesFilePath()
    {
        var configuredPath = _configuration["CURRENCY_RATES_FILE_PATH"];
        if (!string.IsNullOrWhiteSpace(configuredPath))
        {
            return configuredPath;
        }

        return Path.Combine(_environment.ContentRootPath, "data", "currency-rates.json");
    }

    private static Dictionary<string, decimal> ParsePrivatBankRates(string json)
    {
        var rates = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase)
        {
            ["UAH"] = 1m
        };

        try
        {
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.ValueKind != JsonValueKind.Array)
            {
                return rates;
            }

            foreach (var item in doc.RootElement.EnumerateArray())
            {
                var ccy = item.TryGetProperty("ccy", out var ccyProp) ? ccyProp.GetString() : null;
                var baseCcy = item.TryGetProperty("base_ccy", out var baseProp) ? baseProp.GetString() : null;
                var saleRaw = item.TryGetProperty("sale", out var saleProp) ? saleProp.GetString() : null;

                if (string.IsNullOrWhiteSpace(ccy) || string.IsNullOrWhiteSpace(baseCcy) || string.IsNullOrWhiteSpace(saleRaw))
                {
                    continue;
                }

                if (!decimal.TryParse(saleRaw, NumberStyles.Any, CultureInfo.InvariantCulture, out var sale))
                {
                    continue;
                }

                if (!string.Equals(baseCcy, "UAH", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                rates[ccy.ToUpperInvariant()] = sale;
            }
        }
        catch
        {
            return rates;
        }

        return rates;
    }

    private DateTime GetNextRunUtc(DateTime utcNow)
    {
        var tz = ResolveTimeZone();
        var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, tz);
        var today = localNow.Date;

        foreach (var hour in RunHours)
        {
            var candidateLocal = today.AddHours(hour);
            if (candidateLocal > localNow)
            {
                return TimeZoneInfo.ConvertTimeToUtc(candidateLocal, tz);
            }
        }

        var nextDayLocal = today.AddDays(1).AddHours(RunHours[0]);
        return TimeZoneInfo.ConvertTimeToUtc(nextDayLocal, tz);
    }

    private TimeZoneInfo ResolveTimeZone()
    {
        var tzId = _configuration["CURRENCY_SCHEDULE_TIME_ZONE"];
        if (string.IsNullOrWhiteSpace(tzId))
        {
            tzId = "Europe/Kyiv";
        }

        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(tzId);
        }
        catch (TimeZoneNotFoundException)
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById("Europe/Kiev");
            }
            catch
            {
                return TimeZoneInfo.Utc;
            }
        }
    }

    private sealed class CurrencyRatesFileDto
    {
        public string? BaseCurrency { get; set; }
        public List<string>? SupportedCurrencies { get; set; }
        public Dictionary<string, decimal>? Rates { get; set; }
        public string? UpdatedAtUtc { get; set; }
        public string? Source { get; set; }
        public string? Disclaimer { get; set; }
    }
}
