using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace WebApiGetway.Controllers;

[ApiController]
[Route("Bff/currency")]
public sealed class CurrencyController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<CurrencyController> _logger;

    public CurrencyController(
        IConfiguration configuration,
        IWebHostEnvironment environment,
        IHttpClientFactory httpClientFactory,
        ILogger<CurrencyController> logger)
    {
        _configuration = configuration;
        _environment = environment;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet("rates")]
    public async Task<IActionResult> GetRates([FromQuery] bool forceRefresh = false, CancellationToken cancellationToken = default)
    {
        bool? refreshSucceeded = null;
        string? refreshError = null;

        if (forceRefresh)
        {
            try
            {
                await UpdateRatesAsync(cancellationToken);
                refreshSucceeded = true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Manual currency rates refresh failed.");
                refreshSucceeded = false;
                refreshError = ex.Message;
            }
        }

        var path = ResolveRatesFilePath();
        CurrencyRatesFileDto payload;

        if (!System.IO.File.Exists(path))
        {
            payload = BuildFallbackPayload();
            if (forceRefresh && refreshSucceeded == true)
            {
                refreshSucceeded = false;
                refreshError = "Rates file not found after refresh.";
            }
        }
        else
        {
            var json = await System.IO.File.ReadAllTextAsync(path, cancellationToken);
            payload = JsonSerializer.Deserialize<CurrencyRatesFileDto>(json) ?? BuildFallbackPayload();
        }

        payload.RefreshSucceeded = refreshSucceeded;
        payload.RefreshError = refreshError;

        return Ok(payload);
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

    private static CurrencyRatesFileDto BuildFallbackPayload()
    {
        return new CurrencyRatesFileDto
        {
            BaseCurrency = "UAH",
            SupportedCurrencies = new List<string> { "UAH" },
            Rates = new Dictionary<string, decimal> { ["UAH"] = 1m },
            UpdatedAtUtc = DateTime.UtcNow.ToString("O"),
            Source = "fallback",
            Disclaimer = "Fallback rates; file not found."
        };
    }

    private async Task UpdateRatesAsync(CancellationToken cancellationToken)
    {
        var requestUrl = BuildPrivatBankUrl();
        if (string.IsNullOrWhiteSpace(requestUrl))
        {
            _logger.LogWarning("Currency update skipped: missing PrivatBank URL.");
            return;
        }

        var client = _httpClientFactory.CreateClient("CurrencyRates");
        using var response = await client.GetAsync(requestUrl, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Currency update failed. HTTP {Status} for {Url}.", response.StatusCode, requestUrl);
            return;
        }

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var parsedRates = ParsePrivatBankRates(json);
        if (parsedRates.Count == 0)
        {
            _logger.LogWarning("Currency update received empty rates.");
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
        await System.IO.File.WriteAllTextAsync(path, output, cancellationToken);
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

    private sealed class CurrencyRatesFileDto
    {
        public string? BaseCurrency { get; set; }
        public List<string>? SupportedCurrencies { get; set; }
        public Dictionary<string, decimal>? Rates { get; set; }
        public string? UpdatedAtUtc { get; set; }
        public string? Source { get; set; }
        public string? Disclaimer { get; set; }
        public bool? RefreshSucceeded { get; set; }
        public string? RefreshError { get; set; }
    }
}
