namespace WebApiGetway.View
{
    public class TokenizeCardByTokenRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string CardToken { get; set; } = string.Empty;
        public string Last4 { get; set; } = string.Empty;
        public string Expiry { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string NumberMasked { get; set; } = string.Empty;
        public string HolderName { get; set; } = string.Empty;
    }
}
