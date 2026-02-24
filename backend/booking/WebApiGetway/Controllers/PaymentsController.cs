using System.Collections.Concurrent;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using WebApiGetway.View;

namespace WebApiGetway.Controllers;

[ApiController]
[Route("Bff/payments")]
public class PaymentsController : ControllerBase
{
    private const string LiqPayCheckoutUrl = "https://www.liqpay.ua/api/3/checkout";
    private const string LiqPayApiUrl = "https://www.liqpay.ua/api/request";

    private static readonly ConcurrentDictionary<string, PaymentState> Payments = new();
    private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, SavedCardState>> CardsByUser = new();

    private readonly IConfiguration _configuration;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(IConfiguration configuration, ILogger<PaymentsController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] CreatePaymentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.BookingId) || request.Amount <= 0)
        {
            return BadRequest(new { message = "bookingId and amount are required." });
        }

        var publicKey = _configuration["LIQPAY_PUBLIC_KEY"];
        var privateKey = _configuration["LIQPAY_PRIVATE_KEY"];
        var serverUrl = _configuration["LIQPAY_SERVER_URL"];
        var resultUrl = ResolveResultUrl(request.ClientType);

        if (string.IsNullOrWhiteSpace(publicKey) || string.IsNullOrWhiteSpace(privateKey))
        {
            return StatusCode(500, new { message = "LIQPAY_PUBLIC_KEY / LIQPAY_PRIVATE_KEY are not configured." });
        }

        var orderId = $"order-{request.BookingId}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        var paymentId = orderId;

        var action = ResolveLiqPayAction(request.Method);
        var payTypes = ResolvePayTypes(request.Method);
        var amount = Math.Round(request.Amount, 2, MidpointRounding.AwayFromZero);

        var liqPayPayload = new Dictionary<string, object?>
        {
            ["public_key"] = publicKey,
            ["version"] = "3",
            ["action"] = action,
            ["amount"] = amount.ToString("0.00", CultureInfo.InvariantCulture),
            ["currency"] = string.IsNullOrWhiteSpace(request.Currency) ? "UAH" : request.Currency.ToUpperInvariant(),
            ["description"] = $"Booking payment for {request.BookingId}",
            ["order_id"] = orderId,
            ["server_url"] = serverUrl,
            ["result_url"] = resultUrl,
        };

        if (!string.IsNullOrWhiteSpace(payTypes))
        {
            liqPayPayload["paytypes"] = payTypes;
        }

        var json = JsonSerializer.Serialize(liqPayPayload);
        var data = Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
        var signature = BuildSignature(privateKey, data);

        Payments[paymentId] = new PaymentState
        {
            PaymentId = paymentId,
            BookingId = request.BookingId,
            Amount = amount,
            Currency = string.IsNullOrWhiteSpace(request.Currency) ? "UAH" : request.Currency.ToUpperInvariant(),
            Method = string.IsNullOrWhiteSpace(request.Method) ? "pay" : request.Method,
            Status = "created",
            LiqPayOrderId = orderId,
            CreatedAtUtc = DateTime.UtcNow,
        };

        var redirectUrl = $"{LiqPayCheckoutUrl}?data={Uri.EscapeDataString(data)}&signature={Uri.EscapeDataString(signature)}";

        return Ok(new
        {
            paymentId,
            status = "created",
            redirectUrl,
        });
    }

    [HttpPost("confirm-hold")]
    public IActionResult ConfirmHold([FromBody] ConfirmHoldRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PaymentId))
        {
            return BadRequest(new { message = "paymentId is required." });
        }

        if (!Payments.TryGetValue(request.PaymentId, out var state))
        {
            return NotFound(new { message = "Payment not found." });
        }

        state.Status = "paid";
        state.UpdatedAtUtc = DateTime.UtcNow;
        return Ok(new { paymentId = state.PaymentId, status = state.Status });
    }

    [HttpGet("status/{paymentId}")]
    public async Task<IActionResult> Status(string paymentId, CancellationToken cancellationToken)
    {
        if (!Payments.TryGetValue(paymentId, out var state))
        {
            return NotFound(new { message = "Payment not found." });
        }

        var details = await TryFetchStatusFromLiqPayAsync(state, cancellationToken);
        if (details != null)
        {
            UpdateStateFromLiqPayDetails(state, details);
            if (state.IsTokenization)
            {
                UpsertCardFromTokenizationState(state);
            }
        }

        return Ok(new
        {
            paymentId = state.PaymentId,
            status = state.Status,
        });
    }

    [HttpPost("tokenize/start")]
    public IActionResult StartTokenize([FromBody] TokenizeCardStartRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
        {
            return BadRequest(new { message = "userId is required." });
        }

        var publicKey = _configuration["LIQPAY_PUBLIC_KEY"];
        var privateKey = _configuration["LIQPAY_PRIVATE_KEY"];
        var serverUrl = _configuration["LIQPAY_SERVER_URL"];
        var resultUrl = ResolveResultUrl(request.ClientType);

        if (string.IsNullOrWhiteSpace(publicKey) || string.IsNullOrWhiteSpace(privateKey))
        {
            return StatusCode(500, new { message = "LIQPAY_PUBLIC_KEY / LIQPAY_PRIVATE_KEY are not configured." });
        }

        var paymentId = $"tok_{Guid.NewGuid():N}";
        var orderId = paymentId;

        var payload = new Dictionary<string, object?>
        {
            ["public_key"] = publicKey,
            ["version"] = "3",
            ["action"] = "pay",
            ["amount"] = "1.00",
            ["currency"] = "UAH",
            ["description"] = $"Card tokenization for user {request.UserId}",
            ["order_id"] = orderId,
            ["paytypes"] = "card",
            // Inference based on LiqPay docs/examples: request token for future recurring charges.
            ["recurringbytoken"] = "1",
            ["customer"] = request.UserId,
            ["server_url"] = serverUrl,
            ["result_url"] = resultUrl,
        };

        var data = Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload)));
        var signature = BuildSignature(privateKey, data);
        var redirectUrl = $"{LiqPayCheckoutUrl}?data={Uri.EscapeDataString(data)}&signature={Uri.EscapeDataString(signature)}";

        Payments[paymentId] = new PaymentState
        {
            PaymentId = paymentId,
            BookingId = $"tokenize-{request.UserId}",
            Amount = 1.00m,
            Currency = "UAH",
            Method = "tokenize",
            Status = "created",
            LiqPayOrderId = orderId,
            CreatedAtUtc = DateTime.UtcNow,
            IsTokenization = true,
            UserId = request.UserId,
            HolderName = string.IsNullOrWhiteSpace(request.HolderName) ? "Card Holder" : request.HolderName.Trim(),
        };

        return Ok(new
        {
            paymentId,
            status = "created",
            redirectUrl,
        });
    }

    [HttpGet("tokenize/status/{paymentId}")]
    public async Task<IActionResult> TokenizeStatus(string paymentId, CancellationToken cancellationToken)
    {
        if (!Payments.TryGetValue(paymentId, out var state) || !state.IsTokenization)
        {
            return NotFound(new { message = "Tokenization session not found." });
        }

        var details = await TryFetchStatusFromLiqPayAsync(state, cancellationToken);
        if (details != null)
        {
            UpdateStateFromLiqPayDetails(state, details);
            UpsertCardFromTokenizationState(state);
        }

        return Ok(new
        {
            paymentId = state.PaymentId,
            status = state.Status,
            cardToken = state.CardToken,
            card = state.CardId == null ? null : new
            {
                id = state.CardId,
                holderName = state.HolderName,
                numberMasked = state.NumberMasked,
                last4 = state.Last4,
                expiry = state.Expiry,
                brand = state.Brand,
                token = state.CardToken,
            },
        });
    }

    // LiqPay server callback. LiqPay sends form fields: data + signature.
    [HttpPost("callback")]
    [Consumes("application/x-www-form-urlencoded", "multipart/form-data")]
    public IActionResult Callback([FromForm] string data, [FromForm] string signature)
    {
        if (string.IsNullOrWhiteSpace(data) || string.IsNullOrWhiteSpace(signature))
        {
            return BadRequest("Missing callback payload.");
        }

        var privateKey = _configuration["LIQPAY_PRIVATE_KEY"];
        if (string.IsNullOrWhiteSpace(privateKey))
        {
            return StatusCode(500, "LiqPay key is not configured.");
        }

        var expected = BuildSignature(privateKey, data);
        if (!string.Equals(expected, signature, StringComparison.Ordinal))
        {
            _logger.LogWarning("LiqPay callback signature mismatch.");
            return Unauthorized("Invalid signature.");
        }

        string decodedJson;
        try
        {
            decodedJson = Encoding.UTF8.GetString(Convert.FromBase64String(data));
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to decode LiqPay callback payload.");
            return BadRequest("Invalid data.");
        }

        string? orderId = null;
        LiqPayStatusDetails? details = null;

        try
        {
            using var doc = JsonDocument.Parse(decodedJson);
            var root = doc.RootElement;
            orderId = TryReadString(root, "order_id");
            details = ParseLiqPayStatusDetails(root);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse LiqPay callback JSON.");
            return BadRequest("Invalid JSON.");
        }

        if (string.IsNullOrWhiteSpace(orderId))
        {
            return BadRequest("order_id is required.");
        }

        if (Payments.TryGetValue(orderId, out var state))
        {
            if (details != null)
            {
                UpdateStateFromLiqPayDetails(state, details);
            }
            if (state.IsTokenization)
            {
                UpsertCardFromTokenizationState(state);
            }
        }
        else
        {
            _logger.LogWarning("LiqPay callback for unknown order_id: {OrderId}", orderId);
        }

        // LiqPay expects plain response body.
        return Content("ok", "text/plain");
    }

    [HttpPost("tokenize")]
    public IActionResult Tokenize([FromBody] TokenizeCardByTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId) ||
            string.IsNullOrWhiteSpace(request.CardToken) ||
            string.IsNullOrWhiteSpace(request.Last4) ||
            string.IsNullOrWhiteSpace(request.Expiry))
        {
            return BadRequest(new { message = "userId, cardToken, last4 and expiry are required." });
        }

        var normalizedLast4 = new string(request.Last4.Where(char.IsDigit).ToArray());
        if (normalizedLast4.Length != 4)
        {
            return BadRequest(new { message = "Invalid last4." });
        }

        var userCards = CardsByUser.GetOrAdd(request.UserId, _ => new ConcurrentDictionary<string, SavedCardState>());

        // De-duplicate by token: keep one record per provider token.
        var existing = userCards.Values.FirstOrDefault(c =>
            string.Equals(c.Token, request.CardToken, StringComparison.Ordinal));

        if (existing != null)
        {
            foreach (var item in userCards.Values)
            {
                item.IsDefault = false;
            }
            existing.IsDefault = true;

            return Ok(new
            {
                card = new
                {
                    id = existing.Id,
                    holderName = existing.HolderName,
                    numberMasked = existing.NumberMasked,
                    last4 = existing.Last4,
                    expiry = existing.Expiry,
                    brand = existing.Brand,
                    isDefault = existing.IsDefault,
                    createdAt = existing.CreatedAtUtc.ToString("O", CultureInfo.InvariantCulture),
                    token = existing.Token,
                },
            });
        }

        var cardId = $"card_{Guid.NewGuid():N}";
        var now = DateTime.UtcNow;
        var normalizedBrand = string.IsNullOrWhiteSpace(request.Brand)
            ? "unknown"
            : request.Brand.Trim().ToLowerInvariant();
        var masked = string.IsNullOrWhiteSpace(request.NumberMasked)
            ? $"**** **** **** {normalizedLast4}"
            : request.NumberMasked.Trim();

        var card = new SavedCardState
        {
            Id = cardId,
            UserId = request.UserId,
            HolderName = string.IsNullOrWhiteSpace(request.HolderName) ? "Card Holder" : request.HolderName,
            Last4 = normalizedLast4,
            NumberMasked = masked,
            Expiry = request.Expiry,
            Brand = normalizedBrand,
            IsDefault = true,
            CreatedAtUtc = now,
            Token = request.CardToken,
        };

        foreach (var item in userCards.Values)
        {
            item.IsDefault = false;
        }
        userCards[cardId] = card;

        return Ok(new
        {
            card = new
            {
                id = card.Id,
                holderName = card.HolderName,
                numberMasked = card.NumberMasked,
                last4 = card.Last4,
                expiry = card.Expiry,
                brand = card.Brand,
                isDefault = card.IsDefault,
                createdAt = card.CreatedAtUtc.ToString("O", CultureInfo.InvariantCulture),
                token = card.Token,
            },
        });
    }

    [HttpGet("cards/{userId}")]
    public IActionResult Cards(string userId)
    {
        if (!CardsByUser.TryGetValue(userId, out var userCards))
        {
            return Ok(Array.Empty<object>());
        }

        var cards = userCards.Values
            .OrderByDescending(c => c.IsDefault)
            .ThenByDescending(c => c.CreatedAtUtc)
            .Select(c => new
            {
                id = c.Id,
                holderName = c.HolderName,
                numberMasked = c.NumberMasked,
                last4 = c.Last4,
                expiry = c.Expiry,
                brand = c.Brand,
                isDefault = c.IsDefault,
                createdAt = c.CreatedAtUtc.ToString("O", CultureInfo.InvariantCulture),
                token = c.Token,
            });

        return Ok(cards);
    }

    [HttpPost("charge-saved-card")]
    public async Task<IActionResult> ChargeSavedCard([FromBody] ChargeSavedCardRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.UserId) ||
            string.IsNullOrWhiteSpace(request.CardId) ||
            string.IsNullOrWhiteSpace(request.BookingId) ||
            request.Amount <= 0)
        {
            return BadRequest(new { message = "userId, cardId, bookingId and amount are required." });
        }

        if (!CardsByUser.TryGetValue(request.UserId, out var cards) || !cards.TryGetValue(request.CardId, out var card))
        {
            return NotFound(new { message = "Saved card not found for user." });
        }

        var publicKey = _configuration["LIQPAY_PUBLIC_KEY"];
        var privateKey = _configuration["LIQPAY_PRIVATE_KEY"];
        var serverUrl = _configuration["LIQPAY_SERVER_URL"];
        var resultUrl = ResolveResultUrl(request.ClientType);
        if (string.IsNullOrWhiteSpace(publicKey) || string.IsNullOrWhiteSpace(privateKey))
        {
            return StatusCode(500, new { message = "LIQPAY_PUBLIC_KEY / LIQPAY_PRIVATE_KEY are not configured." });
        }
        if (string.IsNullOrWhiteSpace(card.Token))
        {
            return BadRequest(new { message = "Saved card token is missing." });
        }

        var amount = Math.Round(request.Amount, 2, MidpointRounding.AwayFromZero);
        var orderId = $"saved-{request.BookingId}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        var paymentId = orderId;

        var payload = new Dictionary<string, object?>
        {
            ["public_key"] = publicKey,
            ["version"] = "3",
            ["action"] = "pay",
            ["amount"] = amount.ToString("0.00", CultureInfo.InvariantCulture),
            ["currency"] = string.IsNullOrWhiteSpace(request.Currency) ? "UAH" : request.Currency.ToUpperInvariant(),
            ["description"] = $"Saved card payment for {request.BookingId}",
            ["order_id"] = orderId,
            // Inference: LiqPay token-based charge request.
            ["card_token"] = card.Token,
            ["server_url"] = serverUrl,
            ["result_url"] = resultUrl,
        };

        var data = Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload)));
        var signature = BuildSignature(privateKey, data);

        var rawStatus = "created";
        try
        {
            using var client = new HttpClient();
            using var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["data"] = data,
                ["signature"] = signature,
            });
            using var response = await client.PostAsync(LiqPayApiUrl, content, cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(cancellationToken);
                using var doc = JsonDocument.Parse(body);
                rawStatus = TryReadString(doc.RootElement, "status") ?? "created";
            }
            else
            {
                rawStatus = "error";
            }
        }
        catch
        {
            rawStatus = "error";
        }

        var normalizedStatus = MapLiqPayStatus(rawStatus);
        Payments[paymentId] = new PaymentState
        {
            PaymentId = paymentId,
            BookingId = request.BookingId,
            Amount = amount,
            Currency = string.IsNullOrWhiteSpace(request.Currency) ? "UAH" : request.Currency.ToUpperInvariant(),
            Method = "saved-card",
            Status = normalizedStatus,
            RawStatus = rawStatus,
            LiqPayOrderId = orderId,
            CreatedAtUtc = DateTime.UtcNow,
        };

        return Ok(new
        {
            paymentId,
            status = normalizedStatus,
            redirectUrl = (string?)null,
        });
    }

    private async Task<LiqPayStatusDetails?> TryFetchStatusFromLiqPayAsync(PaymentState state, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(state.LiqPayOrderId))
        {
            return null;
        }

        var publicKey = _configuration["LIQPAY_PUBLIC_KEY"];
        var privateKey = _configuration["LIQPAY_PRIVATE_KEY"];
        if (string.IsNullOrWhiteSpace(publicKey) || string.IsNullOrWhiteSpace(privateKey))
        {
            return null;
        }

        try
        {
            var payload = new Dictionary<string, object?>
            {
                ["public_key"] = publicKey,
                ["version"] = "3",
                ["action"] = "status",
                ["order_id"] = state.LiqPayOrderId,
            };

            var json = JsonSerializer.Serialize(payload);
            var data = Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
            var signature = BuildSignature(privateKey, data);

            using var client = new HttpClient();
            using var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["data"] = data,
                ["signature"] = signature,
            });

            using var response = await client.PostAsync(LiqPayApiUrl, content, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            using var doc = JsonDocument.Parse(body);
            return ParseLiqPayStatusDetails(doc.RootElement);
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "LiqPay status fetch failed for payment {PaymentId}", state.PaymentId);
            return null;
        }
    }

    private static LiqPayStatusDetails ParseLiqPayStatusDetails(JsonElement root)
    {
        return new LiqPayStatusDetails
        {
            Status = TryReadString(root, "status"),
            CardToken = TryReadString(root, "card_token", "token"),
            NumberMasked = TryReadString(root, "sender_card_mask2", "card_mask"),
            CardType = TryReadString(root, "sender_card_type", "card_type"),
            ExpiryMonth = TryReadString(root, "card_exp_month", "exp_month"),
            ExpiryYear = TryReadString(root, "card_exp_year", "exp_year"),
        };
    }

    private static string? TryReadString(JsonElement root, params string[] propertyNames)
    {
        foreach (var name in propertyNames)
        {
            if (root.TryGetProperty(name, out var value))
            {
                return value.ValueKind == JsonValueKind.String ? value.GetString() : value.ToString();
            }
        }
        return null;
    }

    private static void UpdateStateFromLiqPayDetails(PaymentState state, LiqPayStatusDetails details)
    {
        state.RawStatus = details.Status;
        state.Status = MapLiqPayStatus(details.Status);
        state.UpdatedAtUtc = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(details.CardToken))
            state.CardToken = details.CardToken;
        if (!string.IsNullOrWhiteSpace(details.NumberMasked))
            state.NumberMasked = details.NumberMasked;
        if (!string.IsNullOrWhiteSpace(details.CardType))
            state.Brand = NormalizeCardType(details.CardType);
        state.Expiry = BuildExpiry(details.ExpiryMonth, details.ExpiryYear) ?? state.Expiry;

        if (string.IsNullOrWhiteSpace(state.Last4) && !string.IsNullOrWhiteSpace(state.NumberMasked))
        {
            var digits = new string(state.NumberMasked.Where(char.IsDigit).ToArray());
            if (digits.Length >= 4)
            {
                state.Last4 = digits[^4..];
            }
        }
    }

    private void UpsertCardFromTokenizationState(PaymentState state)
    {
        if (!state.IsTokenization || state.Status != "paid")
            return;
        if (string.IsNullOrWhiteSpace(state.UserId) || string.IsNullOrWhiteSpace(state.CardToken))
            return;

        var userCards = CardsByUser.GetOrAdd(state.UserId, _ => new ConcurrentDictionary<string, SavedCardState>());
        var existing = userCards.Values.FirstOrDefault(c =>
            string.Equals(c.Token, state.CardToken, StringComparison.Ordinal));
        if (existing != null)
        {
            foreach (var card in userCards.Values)
                card.IsDefault = false;
            existing.IsDefault = true;
            state.CardId = existing.Id;
            return;
        }

        foreach (var card in userCards.Values)
            card.IsDefault = false;

        var newCard = new SavedCardState
        {
            Id = $"card_{Guid.NewGuid():N}",
            UserId = state.UserId,
            HolderName = string.IsNullOrWhiteSpace(state.HolderName) ? "Card Holder" : state.HolderName,
            Last4 = string.IsNullOrWhiteSpace(state.Last4) ? "0000" : state.Last4,
            NumberMasked = string.IsNullOrWhiteSpace(state.NumberMasked)
                ? $"**** **** **** {state.Last4}"
                : state.NumberMasked,
            Expiry = string.IsNullOrWhiteSpace(state.Expiry) ? "--/--" : state.Expiry,
            Brand = string.IsNullOrWhiteSpace(state.Brand) ? "unknown" : state.Brand,
            IsDefault = true,
            CreatedAtUtc = DateTime.UtcNow,
            Token = state.CardToken,
        };

        userCards[newCard.Id] = newCard;
        state.CardId = newCard.Id;
    }

    private static string NormalizeCardType(string? cardType)
    {
        var v = cardType?.Trim().ToLowerInvariant();
        return v switch
        {
            "mc" => "mastercard",
            "mastercard" => "mastercard",
            "visa" => "visa",
            "amex" => "amex",
            _ => "unknown",
        };
    }

    private static string? BuildExpiry(string? month, string? year)
    {
        if (string.IsNullOrWhiteSpace(month) || string.IsNullOrWhiteSpace(year))
            return null;
        var m = month.PadLeft(2, '0');
        var y = year.Length > 2 ? year[^2..] : year.PadLeft(2, '0');
        return $"{m}/{y}";
    }

    private static string ResolveLiqPayAction(string? method) =>
        method switch
        {
            "hold" => "hold",
            "subscribe" => "subscribe",
            _ => "pay",
        };

    private string? ResolveResultUrl(string? clientType)
    {
        var requestedType = clientType?.Trim().ToLowerInvariant();
        var fallbackResultUrl = _configuration["LIQPAY_RESULT_URL"];
        var mobileResultUrl = _configuration["LIQPAY_RESULT_URL_MOBILE"];
        var webResultUrl = _configuration["LIQPAY_RESULT_URL_WEB"];

        return requestedType switch
        {
            "mobile" => FirstNonEmpty(mobileResultUrl, fallbackResultUrl, "mobileapp://payment/result"),
            "web" => FirstNonEmpty(webResultUrl, fallbackResultUrl),
            _ => FirstNonEmpty(fallbackResultUrl, webResultUrl, mobileResultUrl),
        };
    }

    private static string? FirstNonEmpty(params string?[] candidates) =>
        candidates.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value));

    private static string? ResolvePayTypes(string? method) =>
        method switch
        {
            "apay" => "apay",
            "gpay" => "gpay",
            _ => null,
        };

    private static string MapLiqPayStatus(string? liqPayStatus)
    {
        var s = liqPayStatus?.ToLowerInvariant();
        return s switch
        {
            "success" => "paid",
            "sandbox" => "paid",
            "subscribed" => "paid",
            "wait_accept" => "hold",
            "hold_wait" => "hold",
            "wait_secure" => "created",
            "processing" => "created",
            "reversed" => "failed",
            "failure" => "failed",
            "error" => "failed",
            "unsubscribed" => "cancelled",
            "cancelled" => "cancelled",
            _ => "created",
        };
    }

    private static string BuildSignature(string privateKey, string data)
    {
        var bytes = Encoding.UTF8.GetBytes(privateKey + data + privateKey);
        var hash = SHA1.HashData(bytes);
        return Convert.ToBase64String(hash);
    }

    private static string ResolveBrand(string normalizedCardNumber)
    {
        if (normalizedCardNumber.StartsWith("4", StringComparison.Ordinal)) return "visa";
        if (normalizedCardNumber.StartsWith("5", StringComparison.Ordinal)) return "mastercard";
        if (normalizedCardNumber.StartsWith("34", StringComparison.Ordinal) || normalizedCardNumber.StartsWith("37", StringComparison.Ordinal)) return "amex";
        return "unknown";
    }

    public sealed class CreatePaymentRequest
    {
        public string BookingId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "UAH";
        public string Method { get; set; } = "pay";
        public string ClientType { get; set; } = "web";
    }

    public sealed class ConfirmHoldRequest
    {
        public string PaymentId { get; set; } = string.Empty;
    }

    public sealed class ChargeSavedCardRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string CardId { get; set; } = string.Empty;
        public string BookingId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "UAH";
        public string ClientType { get; set; } = "web";
    }

    private sealed class PaymentState
    {
        public string PaymentId { get; set; } = string.Empty;
        public string BookingId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "UAH";
        public string Method { get; set; } = "pay";
        public string Status { get; set; } = "created";
        public string? RawStatus { get; set; }
        public string? LiqPayOrderId { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAtUtc { get; set; }
        public bool IsTokenization { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string HolderName { get; set; } = string.Empty;
        public string? CardToken { get; set; }
        public string Last4 { get; set; } = string.Empty;
        public string NumberMasked { get; set; } = string.Empty;
        public string Expiry { get; set; } = string.Empty;
        public string Brand { get; set; } = "unknown";
        public string? CardId { get; set; }
    }

    private sealed class SavedCardState
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string HolderName { get; set; } = string.Empty;
        public string NumberMasked { get; set; } = string.Empty;
        public string Last4 { get; set; } = string.Empty;
        public string Expiry { get; set; } = string.Empty;
        public string Brand { get; set; } = "unknown";
        public bool IsDefault { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public string Token { get; set; } = string.Empty;
    }

    private sealed class LiqPayStatusDetails
    {
        public string? Status { get; set; }
        public string? CardToken { get; set; }
        public string? NumberMasked { get; set; }
        public string? CardType { get; set; }
        public string? ExpiryMonth { get; set; }
        public string? ExpiryYear { get; set; }
    }
}
