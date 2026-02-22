namespace WebApiGetway.View;

public sealed class TokenizeCardByTokenRequest
{
    public string UserId { get; set; } = string.Empty;
    public string HolderName { get; set; } = string.Empty;
    public string CardToken { get; set; } = string.Empty;
    public string Last4 { get; set; } = string.Empty;
    public string Expiry { get; set; } = string.Empty;
    public string Brand { get; set; } = "unknown";
    public string NumberMasked { get; set; } = string.Empty;
    public bool SaveCard { get; set; } = true;
}
