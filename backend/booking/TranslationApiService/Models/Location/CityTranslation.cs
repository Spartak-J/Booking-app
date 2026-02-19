using Globals.Models;

namespace TranslationApiService.Models.Location
{
    public class CityTranslation :TranslationEntityBase
    {
       
        public string Title { get; set; }

        public string? Description { get; set; }
        public string? History { get; set; }
    }
}
