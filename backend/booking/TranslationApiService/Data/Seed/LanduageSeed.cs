using Microsoft.EntityFrameworkCore;
using TranslationApiService.Models;
using TranslationApiService.Models.Attraction;
using TranslationApiService.Models.Location;
using TranslationApiService.Models.Offer;

namespace TranslationApiService.Data.Seed
{
    public static class LanguageSeed
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            // Языки
            modelBuilder.Entity<Language>().HasData(
                new Language { id = 1, Code = "en", Name = "English", IsEnabled = true },
                new Language { id = 2, Code = "ru", Name = "Russian", IsEnabled = true },
                new Language { id = 3, Code = "uk", Name = "Ukrainian", IsEnabled = true }
            );

            // Переводы стран
            modelBuilder.Entity<CountryTranslation>().HasData(
             // Ukraine
             new CountryTranslation { id = 1, EntityId = 1, Lang = "en", Title = "Ukraine" },
             new CountryTranslation { id = 2, EntityId = 1, Lang = "uk", Title = "Україна" },

             // United States
             new CountryTranslation { id = 3, EntityId = 2, Lang = "en", Title = "United States" },
             new CountryTranslation { id = 4, EntityId = 2, Lang = "uk", Title = "США" },

             // Germany
             new CountryTranslation { id = 5, EntityId = 3, Lang = "en", Title = "Germany" },
             new CountryTranslation { id = 6, EntityId = 3, Lang = "uk", Title = "Німеччина" },

             // France
             new CountryTranslation { id = 7, EntityId = 4, Lang = "en", Title = "France" },
             new CountryTranslation { id = 8, EntityId = 4, Lang = "uk", Title = "Франція" },

             // United Kingdom
             new CountryTranslation { id = 9, EntityId = 5, Lang = "en", Title = "United Kingdom" },
             new CountryTranslation { id = 10, EntityId = 5, Lang = "uk", Title = "Велика Британія" },

             // Spain
             new CountryTranslation { id = 11, EntityId = 6, Lang = "en", Title = "Spain" },
             new CountryTranslation { id = 12, EntityId = 6, Lang = "uk", Title = "Іспанія" },

             // Poland
             new CountryTranslation { id = 13, EntityId = 7, Lang = "en", Title = "Poland" },
             new CountryTranslation { id = 14, EntityId = 7, Lang = "uk", Title = "Польща" }
         );



            modelBuilder.Entity<RegionTranslation>().HasData(

// =================== Україна ===================
// Kyiv (city with special status)
new RegionTranslation { id = 1, EntityId = 1, Lang = "en", Title = "Kyiv" },
new RegionTranslation { id = 2, EntityId = 1, Lang = "uk", Title = "Київ" },

// 1
new RegionTranslation { id = 3, EntityId = 2, Lang = "en", Title = "Vinnytsia Oblast" },
new RegionTranslation { id = 4, EntityId = 2, Lang = "uk", Title = "Вінницька область" },

// 2
new RegionTranslation { id = 5, EntityId = 3, Lang = "en", Title = "Volyn Oblast" },
new RegionTranslation { id = 6, EntityId = 3, Lang = "uk", Title = "Волинська область" },

// 3
new RegionTranslation { id = 7, EntityId = 4, Lang = "en", Title = "Dnipropetrovsk Oblast" },
new RegionTranslation { id = 8, EntityId = 4, Lang = "uk", Title = "Дніпропетровська область" },

// 4
new RegionTranslation { id = 9, EntityId = 5, Lang = "en", Title = "Donetsk Oblast" },
new RegionTranslation { id = 10, EntityId = 5, Lang = "uk", Title = "Донецька область" },

// 5
new RegionTranslation { id = 11, EntityId = 6, Lang = "en", Title = "Zhytomyr Oblast" },
new RegionTranslation { id = 12, EntityId = 6, Lang = "uk", Title = "Житомирська область" },

// 6
new RegionTranslation { id = 13, EntityId = 7, Lang = "en", Title = "Zakarpattia Oblast" },
new RegionTranslation { id = 14, EntityId = 7, Lang = "uk", Title = "Закарпатська область" },

// 7
new RegionTranslation { id = 15, EntityId = 8, Lang = "en", Title = "Zaporizhzhia Oblast" },
new RegionTranslation { id = 16, EntityId = 8, Lang = "uk", Title = "Запорізька область" },

// 8
new RegionTranslation { id = 17, EntityId = 9, Lang = "en", Title = "Ivano-Frankivsk Oblast" },
new RegionTranslation { id = 18, EntityId = 9, Lang = "uk", Title = "Івано-Франківська область" },

// 9
new RegionTranslation { id = 19, EntityId = 10, Lang = "en", Title = "Kyiv Oblast" },
new RegionTranslation { id = 20, EntityId = 10, Lang = "uk", Title = "Київська область" },

// 10
new RegionTranslation { id = 21, EntityId = 11, Lang = "en", Title = "Kirovohrad Oblast" },
new RegionTranslation { id = 22, EntityId = 11, Lang = "uk", Title = "Кіровоградська область" },

// 11
new RegionTranslation { id = 23, EntityId = 12, Lang = "en", Title = "Luhansk Oblast" },
new RegionTranslation { id = 24, EntityId = 12, Lang = "uk", Title = "Луганська область" },

// 12
new RegionTranslation { id = 25, EntityId = 13, Lang = "en", Title = "Lviv Oblast" },
new RegionTranslation { id = 26, EntityId = 13, Lang = "uk", Title = "Львівська область" },

// 13
new RegionTranslation { id = 27, EntityId = 14, Lang = "en", Title = "Mykolaiv Oblast" },
new RegionTranslation { id = 28, EntityId = 14, Lang = "uk", Title = "Миколаївська область" },

// 14
new RegionTranslation { id = 29, EntityId = 15, Lang = "en", Title = "Odesa Oblast" },
new RegionTranslation { id = 30, EntityId = 15, Lang = "uk", Title = "Одеська область" },

// 15
new RegionTranslation { id = 31, EntityId = 16, Lang = "en", Title = "Poltava Oblast" },
new RegionTranslation { id = 32, EntityId = 16, Lang = "uk", Title = "Полтавська область" },

// 16
new RegionTranslation { id = 33, EntityId = 17, Lang = "en", Title = "Rivne Oblast" },
new RegionTranslation { id = 34, EntityId = 17, Lang = "uk", Title = "Рівненська область" },

// 17
new RegionTranslation { id = 35, EntityId = 18, Lang = "en", Title = "Sumy Oblast" },
new RegionTranslation { id = 36, EntityId = 18, Lang = "uk", Title = "Сумська область" },

// 18
new RegionTranslation { id = 37, EntityId = 19, Lang = "en", Title = "Ternopil Oblast" },
new RegionTranslation { id = 38, EntityId = 19, Lang = "uk", Title = "Тернопільська область" },

// 19
new RegionTranslation { id = 39, EntityId = 20, Lang = "en", Title = "Kharkiv Oblast" },
new RegionTranslation { id = 40, EntityId = 20, Lang = "uk", Title = "Харківська область" },

// 20
new RegionTranslation { id = 41, EntityId = 21, Lang = "en", Title = "Kherson Oblast" },
new RegionTranslation { id = 42, EntityId = 21, Lang = "uk", Title = "Херсонська область" },

// 21
new RegionTranslation { id = 43, EntityId = 22, Lang = "en", Title = "Khmelnytskyi Oblast" },
new RegionTranslation { id = 44, EntityId = 22, Lang = "uk", Title = "Хмельницька область" },

// 22
new RegionTranslation { id = 45, EntityId = 23, Lang = "en", Title = "Cherkasy Oblast" },
new RegionTranslation { id = 46, EntityId = 23, Lang = "uk", Title = "Черкаська область" },

// 23
new RegionTranslation { id = 47, EntityId = 24, Lang = "en", Title = "Chernivtsi Oblast" },
new RegionTranslation { id = 48, EntityId = 24, Lang = "uk", Title = "Чернівецька область" },

// 24
new RegionTranslation { id = 49, EntityId = 25, Lang = "en", Title = "Chernihiv Oblast" },
new RegionTranslation { id = 50, EntityId = 25, Lang = "uk", Title = "Чернігівська область" },


             // =================== USA ===================
             new RegionTranslation { id = 53, EntityId = 27, Lang = "en", Title = "New York State" },
             new RegionTranslation { id = 54, EntityId = 27, Lang = "uk", Title = "Штат Нью-Йорк" },

             new RegionTranslation { id = 55, EntityId = 28, Lang = "en", Title = "California" },
             new RegionTranslation { id = 56, EntityId = 28, Lang = "uk", Title = "Каліфорнія" },

             new RegionTranslation { id = 57, EntityId = 29, Lang = "en", Title = "Illinois" },
             new RegionTranslation { id = 58, EntityId = 29, Lang = "uk", Title = "Іллінойс" },

             // =================== Germany ===================
             new RegionTranslation { id = 59, EntityId = 30, Lang = "en", Title = "Berlin" },
             new RegionTranslation { id = 60, EntityId = 30, Lang = "uk", Title = "Берлін" },

             new RegionTranslation { id = 61, EntityId = 31, Lang = "en", Title = "Bavaria" },
             new RegionTranslation { id = 62, EntityId = 31, Lang = "uk", Title = "Баварія" },

             new RegionTranslation { id = 63, EntityId = 32, Lang = "en", Title = "Hamburg" },
             new RegionTranslation { id = 64, EntityId = 32, Lang = "uk", Title = "Гамбург" },

             // =================== France ===================
             new RegionTranslation { id = 65, EntityId = 33, Lang = "en", Title = "Île-de-France" },
             new RegionTranslation { id = 66, EntityId = 33, Lang = "uk", Title = "Іль-де-Франс" },

             new RegionTranslation { id = 67, EntityId = 34, Lang = "en", Title = "Auvergne-Rhône-Alpes" },
             new RegionTranslation { id = 68, EntityId = 34, Lang = "uk", Title = "Овернь-Рона-Альпи" },

             new RegionTranslation { id = 69, EntityId = 35, Lang = "en", Title = "Provence-Alpes-Côte d'Azur" },
             new RegionTranslation { id = 70, EntityId = 35, Lang = "uk", Title = "Прованс-Альпи-Лазурний берег" },

             // =================== UK ===================
             new RegionTranslation { id = 71, EntityId = 36, Lang = "en", Title = "England (London)" },
             new RegionTranslation { id = 72, EntityId = 36, Lang = "uk", Title = "Англія (Лондон)" },

             new RegionTranslation { id = 73, EntityId = 37, Lang = "en", Title = "North West England" },
             new RegionTranslation { id = 74, EntityId = 37, Lang = "uk", Title = "Північно-Західна Англія" },

             new RegionTranslation { id = 75, EntityId = 38, Lang = "en", Title = "West Midlands" },
             new RegionTranslation { id = 76, EntityId = 38, Lang = "uk", Title = "Вест-Мідлендс" },

             // =================== Spain ===================
             new RegionTranslation { id = 77, EntityId = 39, Lang = "en", Title = "Community of Madrid" },
             new RegionTranslation { id = 78, EntityId = 39, Lang = "uk", Title = "Мадридська спільнота" },

             new RegionTranslation { id = 79, EntityId = 40, Lang = "en", Title = "Catalonia" },
             new RegionTranslation { id = 80, EntityId = 40, Lang = "uk", Title = "Каталонія" },

             new RegionTranslation { id = 81, EntityId = 41, Lang = "en", Title = "Valencian Community" },
             new RegionTranslation { id = 82, EntityId = 41, Lang = "uk", Title = "Валенсійська спільнота" },

             // =================== Poland ===================
             new RegionTranslation { id = 83, EntityId = 42, Lang = "en", Title = "Mazowieckie Voivodeship" },
             new RegionTranslation { id = 84, EntityId = 42, Lang = "uk", Title = "Мазовецьке воєводство" },

             new RegionTranslation { id = 85, EntityId = 43, Lang = "en", Title = "Lesser Poland Voivodeship" },
             new RegionTranslation { id = 86, EntityId = 43, Lang = "uk", Title = "Малопольське воєводство" },

             new RegionTranslation { id = 87, EntityId = 44, Lang = "en", Title = "Greater Poland Voivodeship" },
             new RegionTranslation { id = 88, EntityId = 44, Lang = "uk", Title = "Великопольське воєводство" }
         );



            modelBuilder.Entity<CityTranslation>().HasData(

// =================== Україна ===================
// =================== Україна ===================
new CityTranslation
{
    id = 1,
    EntityId = 1,
    Lang = "uk",
    Title = "Київ",
    Description = "На території міста знаходиться близько 20 різних парків та зелених зон, 16 природних пам'яток та 2 ботанічні сади. У Києві зосереджено численні архітектурні пам'ятки, важливі для культури України.",
    History = "Київ є одним із найстаріших міст Східної Європи, заснований у V–VI століттях. Історично столиця Київської Русі, центр політичного, економічного та культурного життя України."
},

new CityTranslation
{
    id = 2,
    EntityId = 1,
    Lang = "en",
    Title = "Kyiv",
    Description = "The city has about 20 different parks and green areas, 16 natural monuments, and 2 botanical gardens. Kyiv hosts numerous architectural landmarks important for Ukraine's culture.",
    History = "Kyiv is one of the oldest cities in Eastern Europe, founded in the 5th–6th centuries. Historically the capital of Kievan Rus', it is the center of political, economic, and cultural life of Ukraine."
},

//--------------------Вінницька область---------------------------------------
new CityTranslation
{
    id = 3,
    EntityId = 2,
    Lang = "uk",
    Title = "Вінниця",
    Description = "На території міста знаходиться близько 20 різних парків та зелених зон, 16 природних пам'яток та 2 ботанічні сади.",
    History = "Вінниця вперше згадується у писемних джерелах у XIV столітті. Місто розвивалося як важливий торговий та адміністративний центр Поділля."
},

new CityTranslation
{
    id = 4,
    EntityId = 2,
    Lang = "en",
    Title = "Vinnytsia",
    Description = "The city has about 20 parks and green areas, 16 natural monuments, and 2 botanical gardens.",
    History = "Vinnytsia was first mentioned in written sources in the 14th century. The city developed as an important trading and administrative center of Podillia."
},

new CityTranslation
{
    id = 5,
    EntityId = 3,
    Lang = "uk",
    Title = "Жмеринка",
    Description = "Жмеринка має кілька історичних парків та культурних пам'яток, що відображають багату історію міста.",
    History = "Жмеринка була заснована у XVIII столітті як важлива залізнична станція на Поділлі та розвивалася разом з будівництвом залізниці."
},

new CityTranslation
{
    id = 6,
    EntityId = 3,
    Lang = "en",
    Title = "Zhmerinka",
    Description = "Zhmerinka has several historical parks and cultural landmarks reflecting the city's rich history.",
    History = "Zhmerinka was founded in the 18th century as an important railway station in Podillia and developed alongside the construction of the railway."
},

new CityTranslation
{
    id = 7,
    EntityId = 4,
    Lang = "uk",
    Title = "Могилів-Подільський",
    Description = "Місто відоме своїми зеленими зонами, історичними спорудами та річковими пейзажами на березі Дністра.",
    History = "Могилів-Подільський згадується з XVI століття. Історично був важливим торговим містом на Поділлі та прикордонним центром."
},

new CityTranslation
{
    id = 8,
    EntityId = 4,
    Lang = "en",
    Title = "Mohyliv-Podilskyi",
    Description = "The city is known for its green areas, historical buildings, and river landscapes on the Dniester bank.",
    History = "Mohyliv-Podilskyi has been mentioned since the 16th century. Historically, it was an important trading city in Podillia and a border center."
},


            //--------------------Волинська область---------------------------------------



new CityTranslation
{
    id = 11,
    EntityId = 6,
    Lang = "uk",
    Title = "Луцьк",
    Description = "Луцьк має численні історичні пам'ятки, парки та музеї, які відображають культурну спадщину Волині.",
    History = "Луцьк вперше згадується у літописах у XIV столітті. Місто розвивалося як важливий торговий та адміністративний центр регіону."
},
new CityTranslation
{
    id = 12,
    EntityId = 6,
    Lang = "en",
    Title = "Lutsk",
    Description = "Lutsk has numerous historical landmarks, parks, and museums reflecting Volyn's cultural heritage.",
    History = "Lutsk was first mentioned in chronicles in the 14th century. The city developed as an important trade and administrative center of the region."
},

new CityTranslation
{
    id = 13,
    EntityId = 7,
    Lang = "uk",
    Title = "Ковель",
    Description = "Ковель відомий своїми історичними будівлями, залізничним вузлом та зеленими зонами.",
    History = "Ковель вперше згадується у XV столітті. Місто розвивалося як важливий транспортний і торговий центр Волині."
},
new CityTranslation
{
    id = 14,
    EntityId = 7,
    Lang = "en",
    Title = "Kovel",
    Description = "Kovel is known for its historical buildings, railway junction, and green areas.",
    History = "Kovel was first mentioned in the 15th century. The city developed as an important transport and trade center of Volyn."
},

//--------------------Дніпропетровська область---------------------------------------

new CityTranslation
{
    id = 15,
    EntityId = 8,
    Lang = "uk",
    Title = "Дніпро",
    Description = "Дніпро має численні парки, набережні та промислові пам'ятки, важливі для економіки регіону.",
    History = "Дніпро було засноване у XVIII столітті як фортеця Катеринослав. Місто стало важливим промисловим центром України."
},
new CityTranslation
{
    id = 16,
    EntityId = 8,
    Lang = "en",
    Title = "Dnipro",
    Description = "Dnipro has numerous parks, embankments, and industrial landmarks important for the region's economy.",
    History = "Dnipro was founded in the 18th century as the fort of Katerynoslav. The city became an important industrial center of Ukraine."
},

new CityTranslation
{
    id = 17,
    EntityId = 9,
    Lang = "uk",
    Title = "Кривий Ріг",
    Description = "Кривий Ріг відомий своєю гірничо-металургійною промисловістю та протяжними зеленими зонами.",
    History = "Місто було засноване у XVIII столітті і стало ключовим центром металургійної промисловості України."
},
new CityTranslation
{
    id = 18,
    EntityId = 9,
    Lang = "en",
    Title = "Kryvyi Rih",
    Description = "Kryvyi Rih is known for its mining and metallurgical industry and extensive green areas.",
    History = "The city was founded in the 18th century and became a key center of Ukraine's metallurgical industry."
},

new CityTranslation
{
    id = 19,
    EntityId = 10,
    Lang = "uk",
    Title = "Кам’янське",
    Description = "Місто має численні промислові об’єкти та парки, що розташовані вздовж Дніпра.",
    History = "Кам’янське розвивалося як промисловий центр у XIX–XX століттях і стало важливим для економіки регіону."
},
new CityTranslation
{
    id = 20,
    EntityId = 10,
    Lang = "en",
    Title = "Kamianske",
    Description = "The city has numerous industrial facilities and parks along the Dnipro river.",
    History = "Kamianske developed as an industrial center in the 19th–20th centuries and became important for the region's economy."
},

new CityTranslation
{
    id = 21,
    EntityId = 11,
    Lang = "uk",
    Title = "Нікополь",
    Description = "Нікополь відомий своїми промисловими підприємствами та мальовничими берегами Дніпра.",
    History = "Місто було засноване у XVIII столітті та стало важливим центром металургійної та промислової діяльності."
},
new CityTranslation
{
    id = 22,
    EntityId = 11,
    Lang = "en",
    Title = "Nikopol",
    Description = "Nikopol is known for its industrial enterprises and picturesque Dnipro riverbanks.",
    History = "The city was founded in the 18th century and became an important center of metallurgical and industrial activity."
},



//--------------------Донецька область---------------------------------------

new CityTranslation
{
    id = 23,
    EntityId = 17,
    Lang = "en",
    Title = "Donetsk",
    Description = "Donetsk is an important industrial city with numerous parks and cultural landmarks.",
    History = "Donetsk was founded in 1869 as a mining settlement and developed into a major industrial center in Eastern Ukraine."
},
new CityTranslation
{
    id = 24,
    EntityId = 17,
    Lang = "uk",
    Title = "Донецьк",
    Description = "Донецьк — важливе промислове місто з численними парками та культурними пам’ятками.",
    History = "Донецьк було засновано у 1869 році як шахтарське поселення і він став важливим промисловим центром Східної України."
},

new CityTranslation
{
    id = 25,
    EntityId = 18,
    Lang = "en",
    Title = "Sloviansk",
    Description = "Sloviansk is known for its historical architecture, riverfronts, and cultural heritage.",
    History = "Sloviansk was founded in 1676 and developed as a regional trade and salt-mining center."
},
new CityTranslation
{
    id = 26,
    EntityId = 18,
    Lang = "uk",
    Title = "Слов’янськ",
    Description = "Слов’янськ відомий історичною архітектурою, набережними та культурною спадщиною.",
    History = "Слов’янськ було засновано у 1676 році і розвинулося як регіональний торговий та соляний центр."
},

new CityTranslation
{
    id = 27,
    EntityId = 19,
    Lang = "en",
    Title = "Kramatorsk",
    Description = "Kramatorsk is a key industrial city with parks, cultural sites, and modern infrastructure.",
    History = "Kramatorsk was founded in the late 19th century and grew rapidly as an industrial and railway hub."
},
new CityTranslation
{
    id = 28,
    EntityId = 19,
    Lang = "uk",
    Title = "Краматорськ",
    Description = "Краматорськ — ключове промислове місто з парками, культурними об’єктами та сучасною інфраструктурою.",
    History = "Краматорськ було засновано наприкінці XIX століття і швидко розвинулося як промисловий та залізничний центр."
},

//--------------------Житомирська область---------------------------------------

new CityTranslation
{
    id = 29,
    EntityId = 20,
    Lang = "en",
    Title = "Zhytomyr",
    Description = "Zhytomyr has many parks, museums, and historical buildings reflecting its rich heritage.",
    History = "Zhytomyr was founded in the 9th century and has been an important administrative and cultural center in the region."
},
new CityTranslation
{
    id = 30,
    EntityId = 20,
    Lang = "uk",
    Title = "Житомир",
    Description = "Житомир має численні парки, музеї та історичні будівлі, що відображають його багату спадщину.",
    History = "Житомир було засновано у IX столітті і він був важливим адміністративним та культурним центром регіону."
},

new CityTranslation
{
    id = 31,
    EntityId = 21,
    Lang = "en",
    Title = "Berdychiv",
    Description = "Berdychiv is famous for its historic architecture, churches, and Jewish heritage.",
    History = "Berdychiv was first mentioned in 1430 and became a prominent trade and cultural center."
},
new CityTranslation
{
    id = 32,
    EntityId = 21,
    Lang = "uk",
    Title = "Бердичів",
    Description = "Бердичів відомий історичною архітектурою, церквами та єврейською спадщиною.",
    History = "Бердичів вперше згадується у 1430 році і став видатним торговим та культурним центром."
},

new CityTranslation
{
    id = 33,
    EntityId = 22,
    Lang = "en",
    Title = "Korosten",
    Description = "Korosten has parks, museums, and ancient historical sites.",
    History = "Korosten dates back to the 9th century and was a significant city in Kievan Rus."
},
new CityTranslation
{
    id = 34,
    EntityId = 22,
    Lang = "uk",
    Title = "Коростень",
    Description = "Коростень має парки, музеї та давні історичні об’єкти.",
    History = "Коростень існує з IX століття і був важливим містом Київської Русі."
},

new CityTranslation
{
    id = 35,
    EntityId = 23,
    Lang = "en",
    Title = "Novohrad-Volynskyi (Zviahel)",
    Description = "Novohrad-Volynskyi has historical architecture, parks, and cultural landmarks.",
    History = "The city dates back to the 13th century and has been a regional administrative and trade center."
},
new CityTranslation
{
    id = 36,
    EntityId = 23,
    Lang = "uk",
    Title = "Новоград-Волинський (Звягель)",
    Description = "Новоград-Волинський має історичну архітектуру, парки та культурні об’єкти.",
    History = "Місто існує з XIII століття і було регіональним адміністративним та торговим центром."
},



//--------------------Закарпатська область---------------------------------------

new CityTranslation
{
    id = 37,
    EntityId = 24,
    Lang = "en",
    Title = "Uzhhorod",
    Description = "Uzhhorod is known for its historic center, parks, and cultural landmarks along the Uzh River.",
    History = "Uzhhorod was first mentioned in the 9th century and has been a key cultural and administrative center in Zakarpattia."
},
new CityTranslation
{
    id = 38,
    EntityId = 24,
    Lang = "uk",
    Title = "Ужгород",
    Description = "Ужгород відомий історичним центром, парками та культурними пам’ятками вздовж річки Уж.",
    History = "Ужгород вперше згадується у IX столітті і був важливим культурним та адміністративним центром Закарпаття."
},

new CityTranslation
{
    id = 39,
    EntityId = 25,
    Lang = "en",
    Title = "Mukachevo",
    Description = "Mukachevo features castles, parks, and historical landmarks reflecting its rich history.",
    History = "Mukachevo dates back to the 9th century and has been a regional hub for trade and culture."
},
new CityTranslation
{
    id = 40,
    EntityId = 25,
    Lang = "uk",
    Title = "Мукачево",
    Description = "Мукачево має замки, парки та історичні пам’ятки, що відображають його багату історію.",
    History = "Мукачево існує з IX століття і був регіональним центром торгівлі та культури."
},

new CityTranslation
{
    id = 41,
    EntityId = 26,
    Lang = "en",
    Title = "Khust",
    Description = "Khust is famous for its medieval castle, parks, and scenic views of the Carpathians.",
    History = "Khust was founded in the 11th century and became an important fortress and trade town in the region."
},
new CityTranslation
{
    id = 42,
    EntityId = 26,
    Lang = "uk",
    Title = "Хуст",
    Description = "Хуст відомий середньовічним замком, парками та мальовничими краєвидами Карпат.",
    History = "Хуст було засновано у XI столітті і він став важливою фортецею та торговим містом регіону."
},

new CityTranslation
{
    id = 43,
    EntityId = 27,
    Lang = "en",
    Title = "Berehove",
    Description = "Berehove is known for its wine culture, thermal baths, and historic architecture.",
    History = "Berehove has existed since the 14th century and developed as a center of viticulture and trade."
},
new CityTranslation
{
    id = 44,
    EntityId = 27,
    Lang = "uk",
    Title = "Берегове",
    Description = "Берегове відоме виноробством, термальними джерелами та історичною архітектурою.",
    History = "Берегове існує з XIV століття і розвивалося як центр виноробства та торгівлі."
},

//--------------------Запорізька область---------------------------------------

new CityTranslation
{
    id = 45,
    EntityId = 28,
    Lang = "en",
    Title = "Zaporizhzhia",
    Description = "Zaporizhzhia is famous for its industrial significance, Dnipro riverfront, and historical sites.",
    History = "Zaporizhzhia was founded in 1770 and is historically associated with the Zaporizhian Cossacks."
},
new CityTranslation
{
    id = 46,
    EntityId = 28,
    Lang = "uk",
    Title = "Запоріжжя",
    Description = "Запоріжжя відоме промисловим значенням, набережною Дніпра та історичними об’єктами.",
    History = "Запоріжжя було засноване у 1770 році та історично пов’язане з Запорізькими козаками."
},

new CityTranslation
{
    id = 47,
    EntityId = 29,
    Lang = "en",
    Title = "Melitopol",
    Description = "Melitopol features parks, cultural monuments, and is known as a gateway to the Sea of Azov.",
    History = "Melitopol was founded in 1784 and has been a regional trade and agricultural hub."
},
new CityTranslation
{
    id = 48,
    EntityId = 29,
    Lang = "uk",
    Title = "Мелітополь",
    Description = "Мелітополь має парки, культурні пам’ятки та відоме як ворота до Азовського моря.",
    History = "Мелітополь засновано у 1784 році і він був регіональним торговим та сільськогосподарським центром."
},

new CityTranslation
{
    id = 49,
    EntityId = 30,
    Lang = "en",
    Title = "Berdiansk",
    Description = "Berdiansk is a port city with beaches, resorts, and cultural heritage.",
    History = "Berdiansk was founded in 1673 and developed as a major port on the Sea of Azov."
},
new CityTranslation
{
    id = 50,
    EntityId = 30,
    Lang = "uk",
    Title = "Бердянськ",
    Description = "Бердянськ — портове місто з пляжами, курортами та культурною спадщиною.",
    History = "Бердянськ засновано у 1673 році і він розвинувся як важливий порт на Азовському морі."
},

new CityTranslation
{
    id = 51,
    EntityId = 31,
    Lang = "en",
    Title = "Enerhodar",
    Description = "Enerhodar is known for its hydroelectric power station and modern urban infrastructure.",
    History = "Enerhodar was founded in 1970 and became the center of Zaporizhzhia’s energy production."
},
new CityTranslation
{
    id = 52,
    EntityId = 31,
    Lang = "uk",
    Title = "Енергодар",
    Description = "Енергодар відоме ГЕС та сучасною міською інфраструктурою.",
    History = "Енергодар засновано у 1970 році і він став центром енергетичного виробництва Запорізької області."
},


//--------------------Івано-Франківська область---------------------------------------

new CityTranslation
{
    id = 53,
    EntityId = 32,
    Lang = "en",
    Title = "Ivano-Frankivsk",
    Description = "Ivano-Frankivsk is known for its vibrant cultural life, parks, and historic architecture in the heart of the Carpathians.",
    History = "Ivano-Frankivsk was founded in 1662 and has developed as a cultural and administrative center in western Ukraine."
},
new CityTranslation
{
    id = 54,
    EntityId = 32,
    Lang = "uk",
    Title = "Івано-Франківськ",
    Description = "Івано-Франківськ відомий яскравим культурним життям, парками та історичною архітектурою в серці Карпат.",
    History = "Івано-Франківськ було засновано у 1662 році і він розвинувся як культурний та адміністративний центр Західної України."
},

new CityTranslation
{
    id = 55,
    EntityId = 33,
    Lang = "en",
    Title = "Kalush",
    Description = "Kalush is famous for its industrial heritage, scenic landscapes, and historical landmarks.",
    History = "Kalush was first mentioned in the 15th century and became an important regional industrial town."
},
new CityTranslation
{
    id = 56,
    EntityId = 33,
    Lang = "uk",
    Title = "Калуш",
    Description = "Калуш відомий промисловою спадщиною, мальовничими пейзажами та історичними пам’ятками.",
    History = "Калуш вперше згадується у XV столітті і став важливим регіональним промисловим містом."
},

new CityTranslation
{
    id = 57,
    EntityId = 34,
    Lang = "en",
    Title = "Kolomyia",
    Description = "Kolomyia is known for its unique cultural heritage, museums, and picturesque streets.",
    History = "Kolomyia has a history dating back to the 13th century and is famous for its artistic and cultural traditions."
},
new CityTranslation
{
    id = 58,
    EntityId = 34,
    Lang = "uk",
    Title = "Коломия",
    Description = "Коломия відома унікальною культурною спадщиною, музеями та мальовничими вулицями.",
    History = "Коломия існує з XIII століття і відома своїми художніми та культурними традиціями."
},

new CityTranslation
{
    id = 59,
    EntityId = 35,
    Lang = "en",
    Title = "Yaremche",
    Description = "Yaremche is a popular mountain resort, known for waterfalls, hiking, and traditional Hutsul culture.",
    History = "Yaremche has been a tourist destination since the 19th century and preserves rich Hutsul traditions."
},
new CityTranslation
{
    id = 60,
    EntityId = 35,
    Lang = "uk",
    Title = "Яремче",
    Description = "Яремче — популярний гірський курорт, відомий водоспадами, пішохідними маршрутами та традиційною гуцульською культурою.",
    History = "Яремче було туристичним центром з XIX століття і зберігає багаті гуцульські традиції."
},

new CityTranslation
{
    id = 61,
    EntityId = 36,
    Lang = "en",
    Title = "Bukovel",
    Description = "Bukovel is Ukraine's largest ski resort, offering winter sports, hiking, and wellness facilities.",
    History = "Bukovel was established in 2000 and has become a leading mountain resort in the Carpathians."
},
new CityTranslation
{
    id = 62,
    EntityId = 36,
    Lang = "uk",
    Title = "Буковель",
    Description = "Буковель — найбільший гірськолижний курорт України, пропонує зимові види спорту, піші маршрути та оздоровчі послуги.",
    History = "Буковель засновано у 2000 році і він став провідним гірським курортом Карпат."
},

//--------------------Київська область---------------------------------------

new CityTranslation
{
    id = 63,
    EntityId = 37,
    Lang = "en",
    Title = "Bila Tserkva",
    Description = "Bila Tserkva is famous for its parks, botanical gardens, and historical architecture along the Ros River.",
    History = "Bila Tserkva was founded in 1032 and became an important regional cultural and administrative center."
},
new CityTranslation
{
    id = 64,
    EntityId = 37,
    Lang = "uk",
    Title = "Біла Церква",
    Description = "Біла Церква відома парками, ботанічними садами та історичною архітектурою вздовж річки Рось.",
    History = "Біла Церква була заснована у 1032 році і стала важливим регіональним культурним та адміністративним центром."
},

new CityTranslation
{
    id = 65,
    EntityId = 38,
    Lang = "en",
    Title = "Boryspil",
    Description = "Boryspil is a key transport hub with cultural landmarks, parks, and historical sites.",
    History = "Boryspil developed around the 12th century and is best known for its international airport."
},
new CityTranslation
{
    id = 66,
    EntityId = 38,
    Lang = "uk",
    Title = "Бориспіль",
    Description = "Бориспіль — важливий транспортний вузол з культурними пам’ятками, парками та історичними об’єктами.",
    History = "Бориспіль розвивався з XII століття і відомий міжнародним аеропортом."
},

new CityTranslation
{
    id = 67,
    EntityId = 39,
    Lang = "en",
    Title = "Brovary",
    Description = "Brovary is known for its industrial heritage, parks, and sports facilities near Kyiv.",
    History = "Brovary has been a key suburban city since the 16th century with industrial and residential development."
},
new CityTranslation
{
    id = 68,
    EntityId = 39,
    Lang = "uk",
    Title = "Бровари",
    Description = "Бровари відомі промисловою спадщиною, парками та спортивними об’єктами поблизу Києва.",
    History = "Бровари є важливим передмістям з XVI століття, з промисловим та житловим розвитком."
},

new CityTranslation
{
    id = 69,
    EntityId = 40,
    Lang = "en",
    Title = "Irpin",
    Description = "Irpin is famous for its green zones, riverfronts, and suburban lifestyle near Kyiv.",
    History = "Irpin developed in the early 20th century as a residential and recreational suburb of Kyiv."
},
new CityTranslation
{
    id = 70,
    EntityId = 40,
    Lang = "uk",
    Title = "Ірпінь",
    Description = "Ірпінь відомий зеленими зонами, набережними та передміським стилем життя поблизу Києва.",
    History = "Ірпінь розвивався на початку XX століття як житлове та рекреаційне передмістя Києва."
},

new CityTranslation
{
    id = 71,
    EntityId = 41,
    Lang = "en",
    Title = "Bucha",
    Description = "Bucha is known for its parks, modern residential areas, and suburban atmosphere near Kyiv.",
    History = "Bucha developed rapidly in the late 20th century as a modern suburb of Kyiv."
},
new CityTranslation
{
    id = 72,
    EntityId = 41,
    Lang = "uk",
    Title = "Буча",
    Description = "Буча відома парками, сучасними житловими районами та передміською атмосферою поблизу Києва.",
    History = "Буча швидко розвивалася у кінці XX століття як сучасне передмістя Києва."
},



//--------------------Кіровоградська область---------------------------------------

new CityTranslation
{
    id = 73,
    EntityId = 42,
    Lang = "en",
    Title = "Kropyvnytskyi",
    Description = "Kropyvnytskyi is an administrative and cultural center with numerous parks, theaters, and historical landmarks.",
    History = "Kropyvnytskyi was founded in 1754 as a fortress and has grown into the administrative center of Kirovohrad Oblast."
},
new CityTranslation
{
    id = 74,
    EntityId = 42,
    Lang = "uk",
    Title = "Кропивницький",
    Description = "Кропивницький — адміністративний та культурний центр з численними парками, театрами та історичними пам’ятками.",
    History = "Кропивницький було засновано у 1754 році як фортецю, і він виріс у адміністративний центр Кіровоградської області."
},

new CityTranslation
{
    id = 75,
    EntityId = 43,
    Lang = "en",
    Title = "Oleksandriya",
    Description = "Oleksandriya is known for its parks, botanical gardens, and industrial history.",
    History = "Oleksandriya developed in the 18th century and became a regional trade and industrial center."
},
new CityTranslation
{
    id = 76,
    EntityId = 43,
    Lang = "uk",
    Title = "Олександрія",
    Description = "Олександрія відома парками, ботанічними садами та промисловою історією.",
    History = "Олександрія розвивалася у XVIII столітті і стала регіональним торгово-промисловим центром."
},

new CityTranslation
{
    id = 77,
    EntityId = 44,
    Lang = "en",
    Title = "Svitlovodsk",
    Description = "Svitlovodsk is a city near the Dnipro River, famous for its hydroelectric power plant and lakes.",
    History = "Svitlovodsk was founded in the 1950s during the construction of the Kremenchuk Hydroelectric Power Plant."
},
new CityTranslation
{
    id = 78,
    EntityId = 44,
    Lang = "uk",
    Title = "Світловодськ",
    Description = "Світловодськ — місто біля Дніпра, відоме своєю гідроелектростанцією та озерами.",
    History = "Світловодськ було засновано у 1950-х роках під час будівництва Кременчуцької гідроелектростанції."
},

new CityTranslation
{
    id = 79,
    EntityId = 45,
    Lang = "en",
    Title = "Znamianka",
    Description = "Znamianka is an important railway hub with parks and cultural institutions.",
    History = "Znamianka developed in the late 19th century as a railway junction and industrial town."
},
new CityTranslation
{
    id = 80,
    EntityId = 45,
    Lang = "uk",
    Title = "Знам’янка",
    Description = "Знам’янка — важливий залізничний вузол з парками та культурними закладами.",
    History = "Знам’янка розвивалася наприкінці XIX століття як залізничний вузол та промислове місто."
},

//--------------------Луганська область---------------------------------------

new CityTranslation
{
    id = 81,
    EntityId = 46,
    Lang = "en",
    Title = "Lysychansk",
    Description = "Lysychansk is an industrial city on the Donets River, with parks and cultural institutions.",
    History = "Lysychansk was founded in the 18th century as a salt mining settlement and developed into an industrial city."
},
new CityTranslation
{
    id = 82,
    EntityId = 46,
    Lang = "uk",
    Title = "Лисичанськ",
    Description = "Лисичанськ — промислове місто на річці Сіверський Донець, з парками та культурними закладами.",
    History = "Лисичанськ було засновано у XVIII столітті як поселення соляних промислів і розвинулося в промислове місто."
},

new CityTranslation
{
    id = 83,
    EntityId = 47,
    Lang = "en",
    Title = "Severodonetsk",
    Description = "Severodonetsk is a modern industrial city, known for its chemical and manufacturing plants.",
    History = "Severodonetsk was founded in 1934 and grew as a center for chemical industry in eastern Ukraine."
},
new CityTranslation
{
    id = 84,
    EntityId = 47,
    Lang = "uk",
    Title = "Сєвєродонецьк",
    Description = "Сєвєродонецьк — сучасне промислове місто, відоме своїми хімічними та виробничими підприємствами.",
    History = "Сєвєродонецьк було засновано у 1934 році і розвинулося як центр хімічної промисловості на сході України."
},

new CityTranslation
{
    id = 85,
    EntityId = 48,
    Lang = "en",
    Title = "Alchevsk",
    Description = "Alchevsk is a steel-producing city with rich industrial history and cultural landmarks.",
    History = "Alchevsk was founded in the late 19th century around metallurgical plants."
},
new CityTranslation
{
    id = 86,
    EntityId = 48,
    Lang = "uk",
    Title = "Алчевськ",
    Description = "Алчевськ — місто металургійного виробництва з багатою промисловою історією та культурними пам’ятками.",
    History = "Алчевськ було засновано наприкінці XIX століття навколо металургійних заводів."
},

new CityTranslation
{
    id = 87,
    EntityId = 49,
    Lang = "en",
    Title = "Kramatorsk",
    Description = "Kramatorsk is an industrial and cultural center in Donetsk Oblast, with parks and historical sites.",
    History = "Kramatorsk developed in the late 19th century and became a key industrial hub in eastern Ukraine."
},
new CityTranslation
{
    id = 88,
    EntityId = 49,
    Lang = "uk",
    Title = "Краматорськ",
    Description = "Краматорськ — промисловий та культурний центр Донецької області, з парками та історичними об’єктами.",
    History = "Краматорськ розвивався наприкінці XIX століття і став важливим промисловим вузлом на сході України."
},

//--------------------Львівська область---------------------------------------

new CityTranslation
{
    id = 89,
    EntityId = 50,
    Lang = "en",
    Title = "Lviv",
    Description = "Lviv is a cultural and historical center with over 20 parks, 16 natural monuments, and 2 botanical gardens. The historic center is a UNESCO World Heritage Site, featuring the Opera House, Dominican Cathedral, City Hall, Powder Tower, Lychakiv Cemetery, Armenian Cathedral, and Bernardine Fortress.",
    History = "Lviv was founded in the 13th century by King Danylo of Galicia. Legend says it was named after his son Lev. The city developed as a multicultural center, strategically located on trade routes between Western Europe and the East."
},
new CityTranslation
{
    id = 90,
    EntityId = 50,
    Lang = "uk",
    Title = "Львів",
    Description = "Львів — культурний та історичний центр з понад 20 парками, 16 природними пам’ятками та 2 ботанічними садами. Історичний центр внесено до списку Світової спадщини ЮНЕСКО, включає Оперний театр, Домініканський собор, міську Ратушу, Порохову вежу, Личаківський цвинтар, Вірменський собор та Бернардинську фортецю.",
    History = "Львів засновано у XIII столітті королем Данилом Галицьким. За легендою, місто назване на честь його сина Лева. Львів розвивався як центр багатокультурного суспільства, стратегічно розташований на торгових шляхах між Західною Європою та Сходом."
},

new CityTranslation
{
    id = 91,
    EntityId = 51,
    Lang = "en",
    Title = "Drohobych",
    Description = "Drohobych is famous for its salt industry, historical churches, and cultural heritage.",
    History = "Drohobych has existed since the 12th century and developed as a trade and salt production center."
},
new CityTranslation
{
    id = 92,
    EntityId = 51,
    Lang = "uk",
    Title = "Дрогобич",
    Description = "Дрогобич відомий своєю соляною промисловістю, історичними церквами та культурною спадщиною.",
    History = "Дрогобич існує з XII століття і розвинувся як центр торгівлі та видобутку солі."
},

new CityTranslation
{
    id = 93,
    EntityId = 52,
    Lang = "en",
    Title = "Chervonohrad",
    Description = "Chervonohrad is a mining city with parks and cultural centers.",
    History = "Chervonohrad developed in the 20th century around coal mining operations."
},
new CityTranslation
{
    id = 94,
    EntityId = 52,
    Lang = "uk",
    Title = "Червоноград",
    Description = "Червоноград — місто шахтарського профілю з парками та культурними закладами.",
    History = "Червоноград розвивався у XX столітті навколо вугільних шахт."
},

new CityTranslation
{
    id = 95,
    EntityId = 53,
    Lang = "en",
    Title = "Stryi",
    Description = "Stryi is a regional administrative center with historical architecture and local parks.",
    History = "Stryi was first mentioned in the 14th century and became an important trade and cultural hub."
},
new CityTranslation
{
    id = 96,
    EntityId = 53,
    Lang = "uk",
    Title = "Стрий",
    Description = "Стрий — регіональний адміністративний центр з історичною архітектурою та місцевими парками.",
    History = "Стрий вперше згадується у XIV столітті і став важливим торговим та культурним центром."
},

new CityTranslation
{
    id = 97,
    EntityId = 54,
    Lang = "en",
    Title = "Truskavets",
    Description = "Truskavets is a famous spa and resort town known for its mineral waters and wellness centers.",
    History = "Truskavets has been known since the 19th century for its therapeutic mineral springs and health resorts."
},
new CityTranslation
{
    id = 98,
    EntityId = 54,
    Lang = "uk",
    Title = "Трускавець",
    Description = "Трускавець — відоме курортне місто, відоме мінеральними водами та оздоровчими центрами.",
    History = "Трускавець відомий з XIX століття своїми лікувальними мінеральними джерелами та курортами."
},

//--------------------Миколаївська область---------------------------------------

new CityTranslation
{
    id = 99,
    EntityId = 55,
    Lang = "en",
    Title = "Mykolaiv",
    Description = "Mykolaiv is a shipbuilding and river port city with parks, museums, and historical landmarks.",
    History = "Mykolaiv was founded in 1789 as a shipbuilding center and developed into an important port city on the Southern Bug River."
},
new CityTranslation
{
    id = 100,
    EntityId = 55,
    Lang = "uk",
    Title = "Миколаїв",
    Description = "Миколаїв — місто кораблебудування та річковий порт з парками, музеями та історичними пам’ятками.",
    History = "Миколаїв засновано у 1789 році як центр кораблебудування і розвинувся в важливий порт на річці Південний Буг."
},


            //--------------------Одеська область---------------------------------------

new CityTranslation
{
    id = 101,
    EntityId = 56,
    Lang = "en",
    Title = "Odesa",
    Description = "Odesa is a major port city on the Black Sea, known for its beaches, historic architecture, and vibrant cultural life.",
    History = "Founded in 1794, Odesa became a key trade and naval center, famous for its multicultural heritage and Potemkin Stairs."
},
new CityTranslation
{
    id = 102,
    EntityId = 56,
    Lang = "uk",
    Title = "Одеса",
    Description = "Одеса — великий портове місто на Чорному морі, відоме своїми пляжами, історичною архітектурою та яскравим культурним життям.",
    History = "Заснована у 1794 році, Одеса стала важливим торговим та морським центром, відомим своєю багатокультурною спадщиною та Потьомкінськими сходами."
},

new CityTranslation
{
    id = 103,
    EntityId = 57,
    Lang = "en",
    Title = "Izmail",
    Description = "Izmail is a historic Danube port city with a rich fortress heritage and river trade significance.",
    History = "Izmail gained prominence in the 18th century due to its strategic location on the Danube and strong fortifications."
},
new CityTranslation
{
    id = 104,
    EntityId = 57,
    Lang = "uk",
    Title = "Ізмаїл",
    Description = "Ізмаїл — історичне портове місто на Дунаї з багатою фортифікаційною спадщиною та значенням у річковій торгівлі.",
    History = "Ізмаїл набув значення у XVIII столітті через стратегічне розташування на Дунаї та потужні укріплення."
},

new CityTranslation
{
    id = 105,
    EntityId = 58,
    Lang = "en",
    Title = "Chornomorsk",
    Description = "Chornomorsk is a modern port city near Odesa, important for maritime transport and industry.",
    History = "Developed in the 20th century as a key maritime hub and industrial center."
},
new CityTranslation
{
    id = 106,
    EntityId = 58,
    Lang = "uk",
    Title = "Чорноморськ",
    Description = "Чорноморськ — сучасне портове місто поблизу Одеси, важливе для морських перевезень та промисловості.",
    History = "Місто розвивалося у XX столітті як важливий морський та промисловий центр."
},

new CityTranslation
{
    id = 107,
    EntityId = 59,
    Lang = "en",
    Title = "Bilhorod-Dnistrovskyi",
    Description = "Bilhorod-Dnistrovskyi is known for its medieval fortress, rich history, and proximity to the Dniester River.",
    History = "Founded in antiquity, it was a key settlement under various empires and a defensive stronghold."
},
new CityTranslation
{
    id = 108,
    EntityId = 59,
    Lang = "uk",
    Title = "Білгород-Дністровський",
    Description = "Білгород-Дністровський відомий своєю середньовічною фортецею, багатою історією та розташуванням біля Дністра.",
    History = "Засноване ще в античні часи, місто було важливим поселенням за різних імперій та оборонною фортецею."
},

new CityTranslation
{
    id = 109,
    EntityId = 60,
    Lang = "en",
    Title = "Podilsk",
    Description = "Podilsk is a regional administrative city with local industries and historical landmarks.",
    History = "Podilsk has developed as a regional hub since the 18th century, with growing trade and cultural significance."
},
new CityTranslation
{
    id = 110,
    EntityId = 60,
    Lang = "uk",
    Title = "Подільськ",
    Description = "Подільськ — регіональне адміністративне місто з місцевою промисловістю та історичними пам’ятками.",
    History = "Подільськ розвивався як регіональний центр з XVIII століття, набуваючи значення у торгівлі та культурі."
},

//--------------------Полтавська область---------------------------------------

new CityTranslation
{
    id = 111,
    EntityId = 61,
    Lang = "en",
    Title = "Poltava",
    Description = "Poltava is famous for its historical battle sites, architecture, and cultural heritage.",
    History = "Founded centuries ago, Poltava became historically famous for the 1709 Battle of Poltava, shaping Ukrainian and European history."
},
new CityTranslation
{
    id = 112,
    EntityId = 61,
    Lang = "uk",
    Title = "Полтава",
    Description = "Полтава відома своїми історичними полями битв, архітектурою та культурною спадщиною.",
    History = "Заснована століттями тому, Полтава стала відомою завдяки Полтавській битві 1709 року, що вплинула на українську та європейську історію."
},

new CityTranslation
{
    id = 113,
    EntityId = 62,
    Lang = "en",
    Title = "Kremenchuk",
    Description = "Kremenchuk is an industrial city on the Dnieper River with important manufacturing and port facilities.",
    History = "Developed as a river port and industrial hub since the 18th century, Kremenchuk plays a key role in regional trade."
},
new CityTranslation
{
    id = 114,
    EntityId = 62,
    Lang = "uk",
    Title = "Кременчук",
    Description = "Кременчук — промислове місто на Дніпрі з важливими виробничими та портовими об’єктами.",
    History = "Місто розвивалося як річковий порт та промисловий центр з XVIII століття, граючи ключову роль у регіональній торгівлі."
},

new CityTranslation
{
    id = 115,
    EntityId = 63,
    Lang = "en",
    Title = "Myrhorod",
    Description = "Myrhorod is known for its mineral waters, wellness resorts, and cultural landmarks.",
    History = "Since the 16th century, Myrhorod has been a center for spa tourism and cultural development."
},
new CityTranslation
{
    id = 116,
    EntityId = 63,
    Lang = "uk",
    Title = "Миргород",
    Description = "Миргород відомий своїми мінеральними водами, курортами та культурними пам’ятками.",
    History = "З XVI століття Миргород був центром курортного туризму та культурного розвитку."
},

new CityTranslation
{
    id = 117,
    EntityId = 64,
    Lang = "en",
    Title = "Lubny",
    Description = "Lubny is a historic city with architectural monuments, local crafts, and parks.",
    History = "Lubny has been inhabited since medieval times and developed as a cultural and trade center."
},
new CityTranslation
{
    id = 118,
    EntityId = 64,
    Lang = "uk",
    Title = "Лубни",
    Description = "Лубни — історичне місто з архітектурними пам’ятками, місцевими ремеслами та парками.",
    History = "Лубни заселені з середньовіччя і розвивалися як культурний та торговий центр."
},

//--------------------Рівненська область---------------------------------------

new CityTranslation
{
    id = 119,
    EntityId = 65,
    Lang = "en",
    Title = "Rivne",
    Description = "Rivne is a regional center known for its parks, cultural sites, and local industries.",
    History = "Rivne was first mentioned in historical records in the 13th century and developed as an administrative and cultural center in western Ukraine."
},
new CityTranslation
{
    id = 120,
    EntityId = 65,
    Lang = "uk",
    Title = "Рівне",
    Description = "Рівне — обласний центр, відомий своїми парками, культурними пам’ятками та місцевою промисловістю.",
    History = "Рівне вперше згадується у XIII столітті та розвивалося як адміністративний та культурний центр Західної України."
},

new CityTranslation
{
    id = 121,
    EntityId = 66,
    Lang = "en",
    Title = "Dubno",
    Description = "Dubno is famous for its medieval castle, historical landmarks, and annual cultural events.",
    History = "Dubno has a history dating back to the 11th century and was a strategic fortress city in Volhynia."
},
new CityTranslation
{
    id = 122,
    EntityId = 66,
    Lang = "uk",
    Title = "Дубно",
    Description = "Дубно відоме своєю середньовічною фортецею, історичними пам’ятками та щорічними культурними заходами.",
    History = "Дубно має історію, що сягає XI століття, і було стратегічним фортефікаційним містом Волині."
},

new CityTranslation
{
    id = 123,
    EntityId = 67,
    Lang = "en",
    Title = "Varash",
    Description = "Varash is an industrial town known for its nuclear power plant and regional economic significance.",
    History = "Varash was developed in the 20th century as a center for nuclear energy and industrial growth."
},
new CityTranslation
{
    id = 124,
    EntityId = 67,
    Lang = "uk",
    Title = "Вараш",
    Description = "Вараш — промислове місто, відоме своєю атомною електростанцією та економічним значенням для регіону.",
    History = "Вараш розвивався у XX столітті як центр ядерної енергетики та промислового розвитку."
},

new CityTranslation
{
    id = 125,
    EntityId = 68,
    Lang = "en",
    Title = "Ostroh",
    Description = "Ostroh is a historical city with a famous academy, ancient churches, and cultural heritage sites.",
    History = "Ostroh dates back to the 14th century and was a major center of education, culture, and Orthodox scholarship."
},
new CityTranslation
{
    id = 126,
    EntityId = 68,
    Lang = "uk",
    Title = "Острог",
    Description = "Острог — історичне місто з відомою академією, давніми церквами та культурними пам’ятками.",
    History = "Острог існує з XIV століття і був важливим центром освіти, культури та православної науки."
},

//--------------------Сумська область---------------------------------------

new CityTranslation
{
    id = 127,
    EntityId = 69,
    Lang = "en",
    Title = "Sumy",
    Description = "Sumy is a regional administrative center with cultural landmarks, parks, and industrial enterprises.",
    History = "Founded in the 17th century as a fortress city, Sumy became an important center of trade and culture in northeastern Ukraine."
},
new CityTranslation
{
    id = 128,
    EntityId = 69,
    Lang = "uk",
    Title = "Суми",
    Description = "Суми — обласний центр з культурними пам’ятками, парками та промисловими підприємствами.",
    History = "Засноване у XVII столітті як фортеця, місто Суми стало важливим центром торгівлі та культури на північному сході України."
},

new CityTranslation
{
    id = 129,
    EntityId = 70,
    Lang = "en",
    Title = "Konotop",
    Description = "Konotop is known for its historical battle sites, churches, and local cultural traditions.",
    History = "Konotop became famous after the 1659 battle and developed as a regional trade and military center."
},
new CityTranslation
{
    id = 130,
    EntityId = 70,
    Lang = "uk",
    Title = "Конотоп",
    Description = "Конотоп відоме історичними полями битв, церквами та місцевими культурними традиціями.",
    History = "Конотоп здобув популярність після битви 1659 року та розвивався як регіональний торговельний і військовий центр."
},

new CityTranslation
{
    id = 131,
    EntityId = 71,
    Lang = "en",
    Title = "Okhtyrka",
    Description = "Okhtyrka is a city with historical churches, parks, and a rich local history.",
    History = "Established in the 17th century, Okhtyrka was an important Cossack town and administrative center."
},
new CityTranslation
{
    id = 132,
    EntityId = 71,
    Lang = "uk",
    Title = "Охтирка",
    Description = "Охтирка — місто з історичними церквами, парками та багатою місцевою історією.",
    History = "Заснована у XVII столітті, Охтирка була важливим козацьким містом та адміністративним центром."
},

new CityTranslation
{
    id = 133,
    EntityId = 72,
    Lang = "en",
    Title = "Shostka",
    Description = "Shostka is an industrial city known for its chemical and manufacturing industries and local cultural sites.",
    History = "Shostka developed in the 18th-19th centuries as a center for chemical production and regional trade."
},
new CityTranslation
{
    id = 134,
    EntityId = 72,
    Lang = "uk",
    Title = "Шостка",
    Description = "Шостка — промислове місто, відоме хімічною та виробничою промисловістю, а також місцевими культурними пам’ятками.",
    History = "Шостка розвивалася у XVIII–XIX століттях як центр хімічного виробництва та регіональної торгівлі."
},


//--------------------Тернопільська область---------------------------------------

new CityTranslation
{
    id = 135,
    EntityId = 73,
    Lang = "en",
    Title = "Ternopil",
    Description = "Ternopil is a cultural and educational center in western Ukraine, known for its lakes, parks, and historical landmarks.",
    History = "Ternopil was founded in the 16th century as a defensive settlement and developed into an important regional center of trade, culture, and education."
},
new CityTranslation
{
    id = 136,
    EntityId = 73,
    Lang = "uk",
    Title = "Тернопіль",
    Description = "Тернопіль — культурний та освітній центр Західної України, відомий озерами, парками та історичними пам’ятками.",
    History = "Тернопіль заснований у XVI столітті як оборонне поселення та став важливим регіональним центром торгівлі, культури та освіти."
},

new CityTranslation
{
    id = 137,
    EntityId = 74,
    Lang = "en",
    Title = "Chortkiv",
    Description = "Chortkiv is famous for its architectural landmarks, churches, and rich cultural heritage.",
    History = "Chortkiv was first mentioned in the 15th century and developed as a key town in the historical region of Galicia."
},
new CityTranslation
{
    id = 138,
    EntityId = 74,
    Lang = "uk",
    Title = "Чортків",
    Description = "Чортків відомий архітектурними пам’ятками, церквами та багатою культурною спадщиною.",
    History = "Чортків вперше згадується у XV столітті та розвивався як важливе місто історичної Галичини."
},

new CityTranslation
{
    id = 139,
    EntityId = 75,
    Lang = "en",
    Title = "Kremenets",
    Description = "Kremenets is known for its historic castle, scenic hills, and educational institutions.",
    History = "Kremenets has a long history dating back to the 11th century and was a significant cultural and defensive center in the region."
},
new CityTranslation
{
    id = 140,
    EntityId = 75,
    Lang = "uk",
    Title = "Кременець",
    Description = "Кременець відомий історичною фортецею, мальовничими пагорбами та освітніми закладами.",
    History = "Кременець має давню історію з XI століття та був важливим культурним і оборонним центром регіону."
},

//--------------------Харківська область---------------------------------------

new CityTranslation
{
    id = 141,
    EntityId = 76,
    Lang = "en",
    Title = "Kharkiv",
    Description = "Kharkiv is a major industrial, cultural, and educational center in eastern Ukraine, known for theaters, universities, and parks.",
    History = "Kharkiv was founded in the mid-17th century as a fortress and grew into a major hub of trade, industry, and culture in eastern Ukraine."
},
new CityTranslation
{
    id = 142,
    EntityId = 76,
    Lang = "uk",
    Title = "Харків",
    Description = "Харків — великий промисловий, культурний та освітній центр Східної України, відомий театрами, університетами та парками.",
    History = "Харків заснований у середині XVII століття як фортеця і розвинувся у важливий центр торгівлі, промисловості та культури Східної України."
},

new CityTranslation
{
    id = 143,
    EntityId = 77,
    Lang = "en",
    Title = "Izium",
    Description = "Izium is known for its historical monuments, rivers, and strategic location in the Donbas region.",
    History = "Izium developed as a Cossack settlement and later became an important trade and military town in eastern Ukraine."
},
new CityTranslation
{
    id = 144,
    EntityId = 77,
    Lang = "uk",
    Title = "Ізюм",
    Description = "Ізюм відомий історичними пам’ятками, річками та стратегічним розташуванням у регіоні Донбас.",
    History = "Ізюм розвивався як козацьке поселення і згодом став важливим торговельним та військовим містом Східної України."
},

new CityTranslation
{
    id = 145,
    EntityId = 78,
    Lang = "en",
    Title = "Lozova",
    Description = "Lozova is a regional industrial town with historical sites and cultural traditions.",
    History = "Lozova grew during the 19th century as a railway hub and industrial center in eastern Ukraine."
},
new CityTranslation
{
    id = 146,
    EntityId = 78,
    Lang = "uk",
    Title = "Лозова",
    Description = "Лозова — регіональне промислове місто з історичними пам’ятками та культурними традиціями.",
    History = "Лозова розвивалася у XIX столітті як залізничний вузол та промисловий центр Східної України."
},

new CityTranslation
{
    id = 147,
    EntityId = 79,
    Lang = "en",
    Title = "Chuhuiv",
    Description = "Chuhuiv is known for its military history, cultural heritage, and regional significance.",
    History = "Chuhuiv was founded in the 17th century as a fortress and became a key Cossack and trade center."
},
new CityTranslation
{
    id = 148,
    EntityId = 79,
    Lang = "uk",
    Title = "Чугуїв",
    Description = "Чугуїв відомий військовою історією, культурною спадщиною та регіональним значенням.",
    History = "Чугуїв заснований у XVII столітті як фортеця і став важливим козацьким та торговельним центром."
},

//--------------------Херсонська область---------------------------------------

new CityTranslation
{
    id = 149,
    EntityId = 80,
    Lang = "en",
    Title = "Kherson",
    Description = "Kherson is a port city in southern Ukraine, located near the Dnipro River and the Black Sea, known for its parks and cultural landmarks.",
    History = "Kherson was founded in 1778 by the Russian Empire as a fortress and shipbuilding center. Over time, it developed into an important administrative and economic hub of southern Ukraine."
},
new CityTranslation
{
    id = 150,
    EntityId = 80,
    Lang = "uk",
    Title = "Херсон",
    Description = "Херсон — портове місто на півдні України, розташоване біля Дніпра та Чорного моря, відоме парками та культурними пам’ятками.",
    History = "Херсон заснований у 1778 році Російською імперією як фортеця та центр суднобудування. Згодом місто стало важливим адміністративним та економічним центром Півдня України."
},

new CityTranslation
{
    id = 151,
    EntityId = 81,
    Lang = "en",
    Title = "Nova Kakhovka",
    Description = "Nova Kakhovka is a modern city near the Kakhovka Reservoir, known for its hydroelectric power station and green spaces.",
    History = "Nova Kakhovka was established in 1952 during the construction of the Kakhovka Hydroelectric Power Plant and became a planned city for workers and engineers."
},
new CityTranslation
{
    id = 152,
    EntityId = 81,
    Lang = "uk",
    Title = "Нова Каховка",
    Description = "Нова Каховка — сучасне місто біля Каховського водосховища, відоме гідроелектростанцією та зеленими зонами.",
    History = "Нова Каховка заснована у 1952 році під час будівництва Каховської гідроелектростанції як планове місто для робітників та інженерів."
},

new CityTranslation
{
    id = 153,
    EntityId = 82,
    Lang = "en",
    Title = "Kakhovka",
    Description = "Kakhovka is a historic city on the Dnipro River, known for its cultural sites, water sports, and proximity to the Kakhovka Reservoir.",
    History = "Kakhovka was founded in the late 18th century as a fortress and later developed as a regional trade and cultural center."
},
new CityTranslation
{
    id = 154,
    EntityId = 82,
    Lang = "uk",
    Title = "Каховка",
    Description = "Каховка — історичне місто на Дніпрі, відоме культурними пам’ятками, водними видами спорту та близькістю до Каховського водосховища.",
    History = "Каховка заснована наприкінці XVIII століття як фортеця і згодом розвинулася як регіональний торговельний та культурний центр."
},

//--------------------Хмельницька область---------------------------------------

new CityTranslation
{
    id = 155,
    EntityId = 83,
    Lang = "en",
    Title = "Khmelnytskyi",
    Description = "Khmelnytskyi is an industrial and cultural center in western Ukraine, featuring parks, theaters, and universities.",
    History = "Khmelnytskyi was founded in the 15th century and developed as a regional trade and administrative hub. The city was renamed after the Ukrainian Hetman Bohdan Khmelnytsky in the 20th century."
},
new CityTranslation
{
    id = 156,
    EntityId = 83,
    Lang = "uk",
    Title = "Хмельницький",
    Description = "Хмельницький — промисловий та культурний центр Західної України, з парками, театрами та університетами.",
    History = "Хмельницький заснований у XV столітті та розвинувся як регіональний торговельний та адміністративний центр. Місто було назване на честь українського гетьмана Богдана Хмельницького у XX столітті."
},

new CityTranslation
{
    id = 157,
    EntityId = 84,
    Lang = "en",
    Title = "Kamianets-Podilskyi",
    Description = "Kamianets-Podilskyi is famous for its medieval castle, historic old town, and scenic canyon views.",
    History = "Kamianets-Podilskyi dates back to the 11th century and was a major defensive and administrative center in Podilia."
},
new CityTranslation
{
    id = 158,
    EntityId = 84,
    Lang = "uk",
    Title = "Кам’янець-Подільський",
    Description = "Кам’янець-Подільський відомий середньовічною фортецею, історичним старим містом та мальовничими каньйонними пейзажами.",
    History = "Кам’янець-Подільський існує з XI століття і був важливим оборонним та адміністративним центром Поділля."
},

new CityTranslation
{
    id = 159,
    EntityId = 85,
    Lang = "en",
    Title = "Shepetivka",
    Description = "Shepetivka is a regional transport and industrial town with cultural landmarks and parks.",
    History = "Shepetivka developed in the 19th century as a railway hub and became an important local economic and administrative center."
},
new CityTranslation
{
    id = 160,
    EntityId = 85,
    Lang = "uk",
    Title = "Шепетівка",
    Description = "Шепетівка — регіональне транспортне та промислове місто з культурними пам’ятками та парками.",
    History = "Шепетівка розвивалася у XIX столітті як залізничний вузол і стала важливим місцевим економічним та адміністративним центром."
},
//--------------------Черкаська область---------------------------------------

new CityTranslation
{
    id = 161,
    EntityId = 86,
    Lang = "en",
    Title = "Cherkasy",
    Description = "Cherkasy is a regional center on the Dnipro River, known for parks, museums, and cultural landmarks.",
    History = "Cherkasy was first mentioned in the 13th century. It grew as a trade and administrative hub in central Ukraine, playing an important role in regional history."
},
new CityTranslation
{
    id = 162,
    EntityId = 86,
    Lang = "uk",
    Title = "Черкаси",
    Description = "Черкаси — обласний центр на Дніпрі, відомий парками, музеями та культурними пам’ятками.",
    History = "Черкаси вперше згадані у XIII столітті. Місто розвивалося як торговельний та адміністративний центр Центральної України, відіграючи важливу роль у регіональній історії."
},

new CityTranslation
{
    id = 163,
    EntityId = 87,
    Lang = "en",
    Title = "Uman",
    Description = "Uman is famous for its Sofiyivka Park, cultural heritage, and annual tourism attractions.",
    History = "Uman was founded in the 17th century and became known for its gardens and historical architecture."
},
new CityTranslation
{
    id = 164,
    EntityId = 87,
    Lang = "uk",
    Title = "Умань",
    Description = "Умань відома парком «Софіївка», культурною спадщиною та туристичними пам’ятками.",
    History = "Умань заснована у XVII столітті і стала відомою своїми садами та історичною архітектурою."
},

new CityTranslation
{
    id = 165,
    EntityId = 88,
    Lang = "en",
    Title = "Smila",
    Description = "Smila is an industrial and transport town on the Dnipro River, with cultural and natural sites.",
    History = "Smila developed in the 19th century as a local industrial center and river port."
},
new CityTranslation
{
    id = 166,
    EntityId = 88,
    Lang = "uk",
    Title = "Сміла",
    Description = "Сміла — промислове та транспортне місто на Дніпрі, з культурними та природними об’єктами.",
    History = "Сміла розвивалася у XIX столітті як місцевий промисловий центр та річковий порт."
},

//--------------------Чернівецька область---------------------------------------

new CityTranslation
{
    id = 167,
    EntityId = 89,
    Lang = "en",
    Title = "Chernivtsi",
    Description = "Chernivtsi is a cultural and educational hub in western Ukraine, known for its architecture and universities.",
    History = "Chernivtsi was founded in the 15th century and became an important center of education and culture, often called 'Little Vienna'."
},
new CityTranslation
{
    id = 168,
    EntityId = 89,
    Lang = "uk",
    Title = "Чернівці",
    Description = "Чернівці — культурний та освітній центр Західної України, відомий архітектурою та університетами.",
    History = "Чернівці засновані у XV столітті та стали важливим центром освіти та культури, часто їх називають «Маленька Відень»."
},

new CityTranslation
{
    id = 169,
    EntityId = 90,
    Lang = "en",
    Title = "Khotyn",
    Description = "Khotyn is famous for its medieval fortress, historic center, and scenic views of the Dniester River.",
    History = "Khotyn dates back to the 10th century and was a strategic fortress throughout regional conflicts."
},
new CityTranslation
{
    id = 170,
    EntityId = 90,
    Lang = "uk",
    Title = "Хотин",
    Description = "Хотин відомий середньовічною фортецею, історичним центром та мальовничими краєвидами Дністра.",
    History = "Хотин існує з X століття і був стратегічною фортецею під час численних регіональних конфліктів."
},

new CityTranslation
{
    id = 171,
    EntityId = 91,
    Lang = "en",
    Title = "Novodnistrovsk",
    Description = "Novodnistrovsk is a modern town on the Dniester River, known for its hydroelectric power plant and reservoirs.",
    History = "Novodnistrovsk was founded in the 1970s during the construction of the Dniester Hydroelectric Power Plant."
},
new CityTranslation
{
    id = 172,
    EntityId = 91,
    Lang = "uk",
    Title = "Новодністровськ",
    Description = "Новодністровськ — сучасне місто на Дністрі, відоме гідроелектростанцією та водосховищами.",
    History = "Новодністровськ заснований у 1970-х роках під час будівництва Дністровської ГЕС."
},

//--------------------Чернігівська область---------------------------------------

new CityTranslation
{
    id = 173,
    EntityId = 92,
    Lang = "en",
    Title = "Chernihiv",
    Description = "Chernihiv is an ancient city in northern Ukraine, with cathedrals, monasteries, and historical landmarks.",
    History = "Chernihiv was founded over a thousand years ago and became one of the main centers of Kievan Rus."
},
new CityTranslation
{
    id = 174,
    EntityId = 92,
    Lang = "uk",
    Title = "Чернігів",
    Description = "Чернігів — давнє місто на півночі України, з соборами, монастирями та історичними пам’ятками.",
    History = "Чернігів заснований понад тисячу років тому і став одним із головних центрів Київської Русі."
},

new CityTranslation
{
    id = 175,
    EntityId = 93,
    Lang = "en",
    Title = "Nizhyn",
    Description = "Nizhyn is known for its historic architecture, churches, and traditional cultural heritage.",
    History = "Nizhyn developed in the 17th century as a trade town and later became an educational center."
},
new CityTranslation
{
    id = 176,
    EntityId = 93,
    Lang = "uk",
    Title = "Ніжин",
    Description = "Ніжин відомий історичною архітектурою, церквами та традиційною культурною спадщиною.",
    History = "Ніжин розвивався у XVII столітті як торгове місто, згодом став освітнім центром."
},

new CityTranslation
{
    id = 177,
    EntityId = 94,
    Lang = "en",
    Title = "Pryluky",
    Description = "Pryluky is a regional town with historic churches, local museums, and green spaces.",
    History = "Pryluky was first mentioned in the 12th century and developed as a local administrative and trade hub."
},
new CityTranslation
{
    id = 178,
    EntityId = 94,
    Lang = "uk",
    Title = "Прилуки",
    Description = "Прилуки — регіональне місто з історичними церквами, місцевими музеями та зеленими зонами.",
    History = "Прилуки вперше згадані у XII столітті і розвивалися як місцевий адміністративний та торговельний центр."
},






// =================== USA ===================

new CityTranslation
{
    id = 179,
    EntityId = 95,
    Lang = "en",
    Title = "New York",
    Description = "New York City is the largest city in the USA, famous for its skyline, Broadway theaters, and cultural diversity.",
    History = "Founded in 1624 as a Dutch settlement called New Amsterdam, it became New York in 1664 and grew into a major economic and cultural hub."
},
new CityTranslation
{
    id = 180,
    EntityId = 95,
    Lang = "uk",
    Title = "Нью-Йорк",
    Description = "Нью-Йорк — найбільше місто США, відоме своїм горизонтом, театрами Бродвею та культурним розмаїттям.",
    History = "Засноване у 1624 році як голландське поселення Нью-Амстердам, стало Нью-Йорком у 1664 році і перетворилося на важливий економічний та культурний центр."
},

new CityTranslation
{
    id = 181,
    EntityId = 96,
    Lang = "en",
    Title = "Los Angeles",
    Description = "Los Angeles is known for Hollywood, entertainment industry, beaches, and diverse neighborhoods.",
    History = "Founded in 1781, Los Angeles grew rapidly during the 20th century, becoming the center of film, television, and cultural innovation."
},
new CityTranslation
{
    id = 182,
    EntityId = 96,
    Lang = "uk",
    Title = "Лос-Анджелес",
    Description = "Лос-Анджелес відомий Голлівудом, індустрією розваг, пляжами та різноманітними районами.",
    History = "Засноване у 1781 році, Лос-Анджелес швидко розвивалося у XX столітті, ставши центром кіно, телебачення та культурних інновацій."
},

new CityTranslation
{
    id = 183,
    EntityId = 97,
    Lang = "en",
    Title = "Chicago",
    Description = "Chicago is a major city on Lake Michigan, famous for its architecture, deep-dish pizza, and jazz music.",
    History = "Founded in 1833, Chicago became a major transportation and industrial hub in the 19th century, rebuilding rapidly after the Great Fire of 1871."
},
new CityTranslation
{
    id = 184,
    EntityId = 97,
    Lang = "uk",
    Title = "Чикаго",
    Description = "Чикаго — велике місто на озері Мічиган, відоме архітектурою, піцою deep-dish та джазовою музикою.",
    History = "Засноване у 1833 році, Чикаго стало важливим транспортним та промисловим центром у XIX столітті, швидко відновившись після Великої пожежі 1871 року."
},

// =================== Germany ===================

new CityTranslation
{
    id = 185,
    EntityId = 98,
    Lang = "en",
    Title = "Berlin",
    Description = "Berlin is the capital of Germany, known for its history, modern culture, museums, and landmarks like the Brandenburg Gate.",
    History = "Berlin has a rich history dating back to the 13th century and became the capital of unified Germany in 1871."
},
new CityTranslation
{
    id = 186,
    EntityId = 98,
    Lang = "uk",
    Title = "Берлін",
    Description = "Берлін — столиця Німеччини, відомий історією, сучасною культурою, музеями та пам’ятками, такими як Бранденбурзькі ворота.",
    History = "Берлін має багату історію, що сягає XIII століття, і став столицею об’єднаної Німеччини у 1871 році."
},

new CityTranslation
{
    id = 187,
    EntityId = 99,
    Lang = "en",
    Title = "Munich",
    Description = "Munich is famous for its beer culture, Oktoberfest festival, historical architecture, and vibrant arts scene.",
    History = "Founded in 1158, Munich grew into the capital of Bavaria and a major cultural and economic center."
},
new CityTranslation
{
    id = 188,
    EntityId = 99,
    Lang = "uk",
    Title = "Мюнхен",
    Description = "Мюнхен відомий пивною культурою, фестивалем Октоберфест, історичною архітектурою та яскравим мистецьким життям.",
    History = "Заснований у 1158 році, Мюнхен став столицею Баварії та важливим культурним і економічним центром."
},

new CityTranslation
{
    id = 189,
    EntityId = 100,
    Lang = "en",
    Title = "Hamburg",
    Description = "Hamburg is a major port city in northern Germany, known for its harbor, canals, and vibrant cultural scene.",
    History = "Founded in the 9th century, Hamburg became a member of the Hanseatic League and developed into a major trading hub."
},
new CityTranslation
{
    id = 190,
    EntityId = 100,
    Lang = "uk",
    Title = "Гамбург",
    Description = "Гамбург — велике портове місто на півночі Німеччини, відоме своїм портом, каналами та яскравим культурним життям.",
    History = "Заснований у IX столітті, Гамбург став членом Ганзейського союзу і розвинувся в значний торговельний центр."
},

// =================== France ===================

new CityTranslation
{
    id = 191,
    EntityId = 101,
    Lang = "en",
    Title = "Paris",
    Description = "Paris is the capital of France, famous for the Eiffel Tower, art museums, fashion, and romantic atmosphere.",
    History = "Founded in the 3rd century BC by the Parisii tribe, Paris became a major center of culture, politics, and economy over the centuries."
},
new CityTranslation
{
    id = 192,
    EntityId = 101,
    Lang = "uk",
    Title = "Париж",
    Description = "Париж — столиця Франції, відомий Ейфелевою вежею, художніми музеями, модою та романтичною атмосферою.",
    History = "Заснований у III столітті до н.е. племенем паризіїв, Париж згодом став важливим культурним, політичним та економічним центром."
},

new CityTranslation
{
    id = 193,
    EntityId = 102,
    Lang = "en",
    Title = "Lyon",
    Description = "Lyon is known for its historical and architectural landmarks, gastronomy, and vibrant cultural scene.",
    History = "Founded by the Romans in 43 BC as Lugdunum, Lyon became a major center of commerce and silk production."
},
new CityTranslation
{
    id = 194,
    EntityId = 102,
    Lang = "uk",
    Title = "Ліон",
    Description = "Ліон відомий історичними та архітектурними пам’ятками, гастрономією та яскравим культурним життям.",
    History = "Заснований римлянами у 43 році до н.е. як Лугдунум, Ліон став важливим центром торгівлі та виробництва шовку."
},

new CityTranslation
{
    id = 195,
    EntityId = 103,
    Lang = "en",
    Title = "Marseille",
    Description = "Marseille is a major port city in southern France, famous for its Old Port, diverse culture, and Mediterranean cuisine.",
    History = "Founded around 600 BC by Greek settlers from Phocaea, Marseille grew into a strategic port and commercial hub."
},
new CityTranslation
{
    id = 196,
    EntityId = 103,
    Lang = "uk",
    Title = "Марсель",
    Description = "Марсель — велике портове місто на півдні Франції, відоме Старим портом, різноманітною культурою та середземноморською кухнею.",
    History = "Засноване близько 600 року до н.е. грецькими колоністами з Фокей, Марсель став стратегічним портом і торговельним центром."
},

// =================== UK ===================

new CityTranslation
{
    id = 197,
    EntityId = 104,
    Lang = "en",
    Title = "London",
    Description = "London is the capital of the UK, known for its historic landmarks, cultural institutions, and financial district.",
    History = "Founded by the Romans as Londinium in 43 AD, London has grown into a global cultural, political, and economic hub."
},
new CityTranslation
{
    id = 198,
    EntityId = 104,
    Lang = "uk",
    Title = "Лондон",
    Description = "Лондон — столиця Великої Британії, відомий історичними пам’ятками, культурними установами та фінансовим центром.",
    History = "Заснований римлянами як Лондиніум у 43 році н.е., Лондон перетворився на глобальний культурний, політичний та економічний центр."
},

new CityTranslation
{
    id = 199,
    EntityId = 105,
    Lang = "en",
    Title = "Manchester",
    Description = "Manchester is famous for its industrial heritage, music scene, football culture, and universities.",
    History = "Manchester grew rapidly during the Industrial Revolution as a major textile manufacturing city."
},
new CityTranslation
{
    id = 200,
    EntityId = 105,
    Lang = "uk",
    Title = "Манчестер",
    Description = "Манчестер відомий промисловою спадщиною, музичною сценою, футбольною культурою та університетами.",
    History = "Манчестер швидко розвивався під час промислової революції як великий центр текстильної промисловості."
},

new CityTranslation
{
    id = 201,
    EntityId = 106,
    Lang = "en",
    Title = "Birmingham",
    Description = "Birmingham is a major city in England, known for its manufacturing history, canals, and vibrant arts and music scene.",
    History = "Birmingham expanded rapidly in the 18th and 19th centuries as an industrial powerhouse, shaping modern England’s economy."
},
new CityTranslation
{
    id = 202,
    EntityId = 106,
    Lang = "uk",
    Title = "Бірмінгем",
    Description = "Бірмінгем — велике місто в Англії, відоме промисловою історією, каналами та яскравим мистецьким і музичним життям.",
    History = "Бірмінгем швидко розвивався у XVIII–XIX століттях як промисловий центр, формуючи сучасну економіку Англії."
},


// =================== Spain ===================

new CityTranslation
{
    id = 203,
    EntityId = 107,
    Lang = "en",
    Title = "Madrid",
    Description = "Madrid is the capital of Spain, famous for its royal palace, museums, and vibrant cultural life.",
    History = "Founded in the 9th century as a fortress town, Madrid became the capital of Spain in 1561 and has been a major political and cultural center since."
},
new CityTranslation
{
    id = 204,
    EntityId = 107,
    Lang = "uk",
    Title = "Мадрид",
    Description = "Мадрид — столиця Іспанії, відомий королівським палацом, музеями та яскравим культурним життям.",
    History = "Заснований у IX столітті як фортеця, Мадрид став столицею Іспанії у 1561 році та з тих пір є важливим політичним і культурним центром."
},

new CityTranslation
{
    id = 205,
    EntityId = 108,
    Lang = "en",
    Title = "Barcelona",
    Description = "Barcelona is a coastal city in Spain, famous for its architecture by Antoni Gaudí, beaches, and lively cultural scene.",
    History = "Founded by the Romans as Barcino, Barcelona grew into a major medieval trading hub and later a center of art, culture, and commerce."
},
new CityTranslation
{
    id = 206,
    EntityId = 108,
    Lang = "uk",
    Title = "Барселона",
    Description = "Барселона — прибережне місто Іспанії, відоме архітектурою Антоніо Гауді, пляжами та активним культурним життям.",
    History = "Заснована римлянами як Барсіно, Барселона перетворилася на важливий середньовічний торговельний центр, а пізніше — на центр мистецтва, культури та торгівлі."
},

new CityTranslation
{
    id = 207,
    EntityId = 109,
    Lang = "en",
    Title = "Valencia",
    Description = "Valencia is a port city on Spain’s southeastern coast, known for its City of Arts and Sciences and historic old town.",
    History = "Founded as a Roman colony in 138 BC, Valencia has a rich history of commerce, culture, and architecture."
},
new CityTranslation
{
    id = 208,
    EntityId = 109,
    Lang = "uk",
    Title = "Валенсія",
    Description = "Валенсія — портове місто на південному сході Іспанії, відоме Містом мистецтв і наук та історичним старим містом.",
    History = "Заснована як римська колонія у 138 році до н.е., Валенсія має багату історію торгівлі, культури та архітектури."
},

// =================== Poland ===================

new CityTranslation
{
    id = 209,
    EntityId = 110,
    Lang = "en",
    Title = "Warsaw",
    Description = "Warsaw is the capital of Poland, known for its historic old town, Royal Castle, and modern urban landscape.",
    History = "Founded in the 13th century, Warsaw became Poland’s capital in 1596 and has undergone major rebuilding after World War II."
},
new CityTranslation
{
    id = 210,
    EntityId = 110,
    Lang = "uk",
    Title = "Варшава",
    Description = "Варшава — столиця Польщі, відома історичним старим містом, Королівським замком та сучасним міським ландшафтом.",
    History = "Заснована у XIII столітті, Варшава стала столицею Польщі у 1596 році і була відновлена після значних руйнувань під час Другої світової війни."
},

new CityTranslation
{
    id = 211,
    EntityId = 111,
    Lang = "en",
    Title = "Krakow",
    Description = "Krakow is a historic city in Poland, famous for its medieval old town, Wawel Castle, and vibrant cultural life.",
    History = "Founded in the 7th century, Krakow was the royal capital of Poland until 1596 and remains a cultural and academic center."
},
new CityTranslation
{
    id = 212,
    EntityId = 111,
    Lang = "uk",
    Title = "Краків",
    Description = "Краків — історичне місто в Польщі, відоме середньовічним старим містом, Вавельським замком та яскравим культурним життям.",
    History = "Заснований у VII столітті, Краків був королівською столицею Польщі до 1596 року та залишається культурним і науковим центром."
},

new CityTranslation
{
    id = 213,
    EntityId = 112,
    Lang = "en",
    Title = "Poznan",
    Description = "Poznan is a major city in western Poland, known for its renaissance old town, trade fairs, and universities.",
    History = "Founded in the 10th century, Poznan became an important political, commercial, and cultural hub in Poland."
},
new CityTranslation
{
    id = 214,
    EntityId = 112,
    Lang = "uk",
    Title = "Познань",
    Description = "Познань — велике місто на заході Польщі, відоме ренесансним старим містом, ярмарками та університетами.",
    History = "Заснована у X столітті, Познань стала важливим політичним, торговельним та культурним центром Польщі."
}

        );


            modelBuilder.Entity<DistrictTranslation>().HasData(

                // =================== УКРАЇНА ===================
                // Київ
                new DistrictTranslation { id = 1, EntityId = 1, Lang = "en", Title = "Shevchenkivskyi District" },
                new DistrictTranslation { id = 2, EntityId = 1, Lang = "uk", Title = "Шевченківський район" },
                new DistrictTranslation { id = 3, EntityId = 2, Lang = "en", Title = "Pecherskyi District" },
                new DistrictTranslation { id = 4, EntityId = 2, Lang = "uk", Title = "Печерський район" },
                new DistrictTranslation { id = 5, EntityId = 3, Lang = "en", Title = "Podilskyi District" },
                new DistrictTranslation { id = 6, EntityId = 3, Lang = "uk", Title = "Подільський район" },

                // Львів
                new DistrictTranslation { id = 7, EntityId = 4, Lang = "en", Title = "Halytskyi District" },
                new DistrictTranslation { id = 8, EntityId = 4, Lang = "uk", Title = "Галицький район" },
                new DistrictTranslation { id = 9, EntityId = 5, Lang = "en", Title = "Frankivskyi District" },
                new DistrictTranslation { id = 10, EntityId = 5, Lang = "uk", Title = "Франківський район" },
                new DistrictTranslation { id = 11, EntityId = 6, Lang = "en", Title = "Zaliznychnyi District" },
                new DistrictTranslation { id = 12, EntityId = 6, Lang = "uk", Title = "Залізничний район" },

                // Одеса
                new DistrictTranslation { id = 13, EntityId = 7, Lang = "en", Title = "Primorskyi District" },
                new DistrictTranslation { id = 14, EntityId = 7, Lang = "uk", Title = "Приморський район" },
                new DistrictTranslation { id = 15, EntityId = 8, Lang = "en", Title = "Malynovskyi District" },
                new DistrictTranslation { id = 16, EntityId = 8, Lang = "uk", Title = "Малиновський район" },
                new DistrictTranslation { id = 17, EntityId = 9, Lang = "en", Title = "Kyivskyi District" },
                new DistrictTranslation { id = 18, EntityId = 9, Lang = "uk", Title = "Київський район" },

                // Харків
                new DistrictTranslation { id = 19, EntityId = 10, Lang = "en", Title = "Kharkivskyi District" },
                new DistrictTranslation { id = 20, EntityId = 10, Lang = "uk", Title = "Харківський район" },
                new DistrictTranslation { id = 21, EntityId = 11, Lang = "en", Title = "Saltivskyi District" },
                new DistrictTranslation { id = 22, EntityId = 11, Lang = "uk", Title = "Салтівський район" },
                new DistrictTranslation { id = 23, EntityId = 12, Lang = "en", Title = "Osnovianskyi District" },
                new DistrictTranslation { id = 24, EntityId = 12, Lang = "uk", Title = "Основ'янський район" },

                // Дніпро
                new DistrictTranslation { id = 25, EntityId = 13, Lang = "en", Title = "Sobornyi District" },
                new DistrictTranslation { id = 26, EntityId = 13, Lang = "uk", Title = "Соборний район" },
                new DistrictTranslation { id = 27, EntityId = 14, Lang = "en", Title = "Shevchenkivskyi District" },
                new DistrictTranslation { id = 28, EntityId = 14, Lang = "uk", Title = "Шевченківський район" },
                new DistrictTranslation { id = 29, EntityId = 15, Lang = "en", Title = "Central District" },
                new DistrictTranslation { id = 30, EntityId = 15, Lang = "uk", Title = "Центральний район" },

                // Запоріжжя
                new DistrictTranslation { id = 31, EntityId = 16, Lang = "en", Title = "Zavodskyi District" },
                new DistrictTranslation { id = 32, EntityId = 16, Lang = "uk", Title = "Заводський район" },
                new DistrictTranslation { id = 33, EntityId = 17, Lang = "en", Title = "Oleksandrivskyi District" },
                new DistrictTranslation { id = 34, EntityId = 17, Lang = "uk", Title = "Олександрівський район" },
                new DistrictTranslation { id = 35, EntityId = 18, Lang = "en", Title = "Komunarskyi District" },
                new DistrictTranslation { id = 36, EntityId = 18, Lang = "uk", Title = "Комунарський район" },

                // Івано-Франківськ
                new DistrictTranslation { id = 37, EntityId = 19, Lang = "en", Title = "City Center" },
                new DistrictTranslation { id = 38, EntityId = 19, Lang = "uk", Title = "Центр міста" },
                new DistrictTranslation { id = 39, EntityId = 20, Lang = "en", Title = "Prykarpattia District" },
                new DistrictTranslation { id = 40, EntityId = 20, Lang = "uk", Title = "Прикарпатський район" },
                new DistrictTranslation { id = 41, EntityId = 21, Lang = "en", Title = "North District" },
                new DistrictTranslation { id = 42, EntityId = 21, Lang = "uk", Title = "Північний район" },

                // Чернівці
                new DistrictTranslation { id = 43, EntityId = 22, Lang = "en", Title = "City Center" },
                new DistrictTranslation { id = 44, EntityId = 22, Lang = "uk", Title = "Центр міста" },
                new DistrictTranslation { id = 45, EntityId = 23, Lang = "en", Title = "East District" },
                new DistrictTranslation { id = 46, EntityId = 23, Lang = "uk", Title = "Східний район" },
                new DistrictTranslation { id = 47, EntityId = 24, Lang = "en", Title = "South District" },
                new DistrictTranslation { id = 48, EntityId = 24, Lang = "uk", Title = "Південний район" },


            // Рівне
            new DistrictTranslation { id = 55, EntityId = 25, Lang = "en", Title = "Central" },
            new DistrictTranslation { id = 56, EntityId = 25, Lang = "uk", Title = "Центр" },
            new DistrictTranslation { id = 57, EntityId = 26, Lang = "en", Title = "East" },
            new DistrictTranslation { id = 58, EntityId = 26, Lang = "uk", Title = "Схід" },
            new DistrictTranslation { id = 59, EntityId = 27, Lang = "en", Title = "West" },
            new DistrictTranslation { id = 60, EntityId = 27, Lang = "uk", Title = "Захід" },

            // Вінниця
            new DistrictTranslation { id = 61, EntityId = 28, Lang = "en", Title = "Central" },
            new DistrictTranslation { id = 62, EntityId = 28, Lang = "uk", Title = "Центр" },
            new DistrictTranslation { id = 63, EntityId = 29, Lang = "en", Title = "North" },
            new DistrictTranslation { id = 64, EntityId = 29, Lang = "uk", Title = "Північ" },
            new DistrictTranslation { id = 65, EntityId = 30, Lang = "en", Title = "South" },
            new DistrictTranslation { id = 66, EntityId = 30, Lang = "uk", Title = "Південь" },

            // Черкаси
            new DistrictTranslation { id = 67, EntityId = 31, Lang = "en", Title = "Central" },
            new DistrictTranslation { id = 68, EntityId = 31, Lang = "uk", Title = "Центр" },
            new DistrictTranslation { id = 69, EntityId = 32, Lang = "en", Title = "North" },
            new DistrictTranslation { id = 70, EntityId = 32, Lang = "uk", Title = "Північ" },
            new DistrictTranslation { id = 71, EntityId = 33, Lang = "en", Title = "South" },
            new DistrictTranslation { id = 72, EntityId = 33, Lang = "uk", Title = "Південь" },

            // Полтава
            new DistrictTranslation { id = 73, EntityId = 34, Lang = "en", Title = "Central" },
            new DistrictTranslation { id = 74, EntityId = 34, Lang = "uk", Title = "Центр" },
            new DistrictTranslation { id = 75, EntityId = 35, Lang = "en", Title = "North" },
            new DistrictTranslation { id = 76, EntityId = 35, Lang = "uk", Title = "Північ" },
            new DistrictTranslation { id = 77, EntityId = 36, Lang = "en", Title = "South" },
            new DistrictTranslation { id = 78, EntityId = 36, Lang = "uk", Title = "Південь" },

            // Кропивницький
            new DistrictTranslation { id = 79, EntityId = 37, Lang = "en", Title = "Central" },
            new DistrictTranslation { id = 80, EntityId = 37, Lang = "uk", Title = "Центр" },
            new DistrictTranslation { id = 81, EntityId = 38, Lang = "en", Title = "East" },
            new DistrictTranslation { id = 82, EntityId = 38, Lang = "uk", Title = "Схід" },
            new DistrictTranslation { id = 83, EntityId = 39, Lang = "en", Title = "West" },
            new DistrictTranslation { id = 84, EntityId = 39, Lang = "uk", Title = "Захід" },

            // Миколаїв
            new DistrictTranslation { id = 85, EntityId = 40, Lang = "en", Title = "Central" },
            new DistrictTranslation { id = 86, EntityId = 40, Lang = "uk", Title = "Центр" },
            new DistrictTranslation { id = 87, EntityId = 41, Lang = "en", Title = "North" },
            new DistrictTranslation { id = 88, EntityId = 41, Lang = "uk", Title = "Північ" },
            new DistrictTranslation { id = 89, EntityId = 42, Lang = "en", Title = "South" },
            new DistrictTranslation { id = 90, EntityId = 42, Lang = "uk", Title = "Південь" },

            // Херсон
            new DistrictTranslation { id = 91, EntityId = 43, Lang = "en", Title = "Central" },
            new DistrictTranslation { id = 92, EntityId = 43, Lang = "uk", Title = "Центр" },
            new DistrictTranslation { id = 93, EntityId = 44, Lang = "en", Title = "North" },
            new DistrictTranslation { id = 94, EntityId = 44, Lang = "uk", Title = "Північ" },
            new DistrictTranslation { id = 95, EntityId = 45, Lang = "en", Title = "South" },
            new DistrictTranslation { id = 96, EntityId = 45, Lang = "uk", Title = "Південь" },

            // Луцьк
            new DistrictTranslation { id = 97, EntityId = 46, Lang = "en", Title = "Central" },
            new DistrictTranslation { id = 98, EntityId = 46, Lang = "uk", Title = "Центр" },
            new DistrictTranslation { id = 99, EntityId = 47, Lang = "en", Title = "North" },
            new DistrictTranslation { id = 100, EntityId = 47, Lang = "uk", Title = "Північ" },
            new DistrictTranslation { id = 101, EntityId = 48, Lang = "en", Title = "South" },
            new DistrictTranslation { id = 102, EntityId = 48, Lang = "uk", Title = "Південь" },
            // =================== DistrictTranslation ===================

            // New York
            new DistrictTranslation { id = 103, EntityId = 49, Lang = "en", Title = "Manhattan" },
            new DistrictTranslation { id = 104, EntityId = 49, Lang = "uk", Title = "Манхеттен" },
            new DistrictTranslation { id = 105, EntityId = 50, Lang = "en", Title = "Brooklyn" },
            new DistrictTranslation { id = 106, EntityId = 50, Lang = "uk", Title = "Бруклін" },
            new DistrictTranslation { id = 107, EntityId = 51, Lang = "en", Title = "Queens" },
            new DistrictTranslation { id = 108, EntityId = 51, Lang = "uk", Title = "Квінс" },

            // Los Angeles
            new DistrictTranslation { id = 109, EntityId = 52, Lang = "en", Title = "Hollywood" },
            new DistrictTranslation { id = 110, EntityId = 52, Lang = "uk", Title = "Голлівуд" },
            new DistrictTranslation { id = 111, EntityId = 53, Lang = "en", Title = "Downtown LA" },
            new DistrictTranslation { id = 112, EntityId = 53, Lang = "uk", Title = "Центр ЛА" },
            new DistrictTranslation { id = 113, EntityId = 54, Lang = "en", Title = "Santa Monica" },
            new DistrictTranslation { id = 114, EntityId = 54, Lang = "uk", Title = "Санта-Моніка" },

            // Chicago
            new DistrictTranslation { id = 115, EntityId = 106, Lang = "en", Title = "Loop" },
            new DistrictTranslation { id = 116, EntityId = 106, Lang = "uk", Title = "Луп" },
            new DistrictTranslation { id = 117, EntityId = 107, Lang = "en", Title = "Lincoln Park" },
            new DistrictTranslation { id = 118, EntityId = 107, Lang = "uk", Title = "Лінкольн-Парк" },
            new DistrictTranslation { id = 119, EntityId = 108, Lang = "en", Title = "South Side" },
            new DistrictTranslation { id = 120, EntityId = 108, Lang = "uk", Title = "Південна частина" },

            // Berlin
            new DistrictTranslation { id = 121, EntityId = 109, Lang = "en", Title = "Mitte" },
            new DistrictTranslation { id = 122, EntityId = 109, Lang = "uk", Title = "Мітте" },
            new DistrictTranslation { id = 123, EntityId = 110, Lang = "en", Title = "Charlottenburg" },
            new DistrictTranslation { id = 124, EntityId = 110, Lang = "uk", Title = "Шарлоттенбург" },
            new DistrictTranslation { id = 125, EntityId = 111, Lang = "en", Title = "Kreuzberg" },
            new DistrictTranslation { id = 126, EntityId = 111, Lang = "uk", Title = "Кройцберг" },

            // Munich
            new DistrictTranslation { id = 127, EntityId = 112, Lang = "en", Title = "Altstadt" },
            new DistrictTranslation { id = 128, EntityId = 112, Lang = "uk", Title = "Старе місто" },
            new DistrictTranslation { id = 129, EntityId = 113, Lang = "en", Title = "Schwabing" },
            new DistrictTranslation { id = 130, EntityId = 113, Lang = "uk", Title = "Швабінг" },
            new DistrictTranslation { id = 131, EntityId = 114, Lang = "en", Title = "Maxvorstadt" },
            new DistrictTranslation { id = 132, EntityId = 114, Lang = "uk", Title = "Максфорштадт" },

            // Hamburg
            new DistrictTranslation { id = 133, EntityId = 115, Lang = "en", Title = "Altstadt" },
            new DistrictTranslation { id = 134, EntityId = 115, Lang = "uk", Title = "Старе місто" },
            new DistrictTranslation { id = 135, EntityId = 116, Lang = "en", Title = "St. Pauli" },
            new DistrictTranslation { id = 136, EntityId = 116, Lang = "uk", Title = "Санкт-Паулі" },
            new DistrictTranslation { id = 137, EntityId = 117, Lang = "en", Title = "Altona" },
            new DistrictTranslation { id = 138, EntityId = 117, Lang = "uk", Title = "Альтона" },

            // Paris
            new DistrictTranslation { id = 139, EntityId = 118, Lang = "en", Title = "Montmartre" },
            new DistrictTranslation { id = 140, EntityId = 118, Lang = "uk", Title = "Монмартр" },
            new DistrictTranslation { id = 141, EntityId = 119, Lang = "en", Title = "Latin Quarter" },
            new DistrictTranslation { id = 142, EntityId = 119, Lang = "uk", Title = "Латинський квартал" },
            new DistrictTranslation { id = 143, EntityId = 120, Lang = "en", Title = "Marais" },
            new DistrictTranslation { id = 144, EntityId = 120, Lang = "uk", Title = "Маре" },

            // Lyon
            new DistrictTranslation { id = 145, EntityId = 121, Lang = "en", Title = "Presqu'île" },
            new DistrictTranslation { id = 146, EntityId = 121, Lang = "uk", Title = "Преск’іль" },
            new DistrictTranslation { id = 147, EntityId = 122, Lang = "en", Title = "Croix-Rousse" },
            new DistrictTranslation { id = 148, EntityId = 122, Lang = "uk", Title = "Круа-Рус" },
            new DistrictTranslation { id = 149, EntityId = 123, Lang = "en", Title = "Part-Dieu" },
            new DistrictTranslation { id = 150, EntityId = 123, Lang = "uk", Title = "Пар-Дьє" },


            // Marseille
            new DistrictTranslation { id = 151, EntityId = 124, Lang = "en", Title = "Old Port" },
            new DistrictTranslation { id = 152, EntityId = 124, Lang = "uk", Title = "Старий порт" },
            new DistrictTranslation { id = 153, EntityId = 125, Lang = "en", Title = "Le Panier" },
            new DistrictTranslation { id = 154, EntityId = 125, Lang = "uk", Title = "Ле Пан’є" },
            new DistrictTranslation { id = 155, EntityId = 126, Lang = "en", Title = "La Joliette" },
            new DistrictTranslation { id = 156, EntityId = 126, Lang = "uk", Title = "Ла Жольєт" },

            // London
            new DistrictTranslation { id = 157, EntityId = 127, Lang = "en", Title = "Camden" },
            new DistrictTranslation { id = 158, EntityId = 127, Lang = "uk", Title = "Кемден" },
            new DistrictTranslation { id = 159, EntityId = 128, Lang = "en", Title = "Westminster" },
            new DistrictTranslation { id = 160, EntityId = 128, Lang = "uk", Title = "Вестмінстер" },
            new DistrictTranslation { id = 161, EntityId = 129, Lang = "en", Title = "Greenwich" },
            new DistrictTranslation { id = 162, EntityId = 129, Lang = "uk", Title = "Грінвіч" },

            // Manchester
            new DistrictTranslation { id = 163, EntityId = 130, Lang = "en", Title = "Salford" },
            new DistrictTranslation { id = 164, EntityId = 130, Lang = "uk", Title = "Салфорд" },
            new DistrictTranslation { id = 165, EntityId = 131, Lang = "en", Title = "Didsbury" },
            new DistrictTranslation { id = 166, EntityId = 131, Lang = "uk", Title = "Дідсбері" },
            new DistrictTranslation { id = 167, EntityId = 132, Lang = "en", Title = "Cheetham Hill" },
            new DistrictTranslation { id = 168, EntityId = 132, Lang = "uk", Title = "Чітем-Гілл" },

            // Birmingham
            new DistrictTranslation { id = 169, EntityId = 133, Lang = "en", Title = "City Centre" },
            new DistrictTranslation { id = 170, EntityId = 133, Lang = "uk", Title = "Центр міста" },
            new DistrictTranslation { id = 171, EntityId = 134, Lang = "en", Title = "Edgbaston" },
            new DistrictTranslation { id = 172, EntityId = 134, Lang = "uk", Title = "Еджбастон" },
            new DistrictTranslation { id = 173, EntityId = 135, Lang = "en", Title = "Selly Oak" },
            new DistrictTranslation { id = 174, EntityId = 135, Lang = "uk", Title = "Селлі-Оук" },

            // Madrid
            new DistrictTranslation { id = 175, EntityId = 136, Lang = "en", Title = "Centro" },
            new DistrictTranslation { id = 176, EntityId = 136, Lang = "uk", Title = "Центро" },
            new DistrictTranslation { id = 177, EntityId = 137, Lang = "en", Title = "Salamanca" },
            new DistrictTranslation { id = 178, EntityId = 137, Lang = "uk", Title = "Саламанка" },
            new DistrictTranslation { id = 179, EntityId = 138, Lang = "en", Title = "Chamartín" },
            new DistrictTranslation { id = 180, EntityId = 138, Lang = "uk", Title = "Чамартін" },

            // Barcelona
            new DistrictTranslation { id = 181, EntityId = 139, Lang = "en", Title = "Eixample" },
            new DistrictTranslation { id = 182, EntityId = 139, Lang = "uk", Title = "Ейшампле" },
            new DistrictTranslation { id = 183, EntityId = 140, Lang = "en", Title = "Gràcia" },
            new DistrictTranslation { id = 184, EntityId = 140, Lang = "uk", Title = "Грасія" },
            new DistrictTranslation { id = 185, EntityId = 141, Lang = "en", Title = "Ciutat Vella" },
            new DistrictTranslation { id = 186, EntityId = 141, Lang = "uk", Title = "С’юта Велья" },

            // Valencia
            new DistrictTranslation { id = 187, EntityId = 142, Lang = "en", Title = "El Carmen" },
            new DistrictTranslation { id = 188, EntityId = 142, Lang = "uk", Title = "Ель Кармен" },
            new DistrictTranslation { id = 189, EntityId = 143, Lang = "en", Title = "Ruzafa" },
            new DistrictTranslation { id = 190, EntityId = 143, Lang = "uk", Title = "Русaфа" },
            new DistrictTranslation { id = 191, EntityId = 144, Lang = "en", Title = "Benimaclet" },
            new DistrictTranslation { id = 192, EntityId = 144, Lang = "uk", Title = "Бенімаcлет" },

            // Warsaw
            new DistrictTranslation { id = 193, EntityId = 145, Lang = "en", Title = "Śródmieście" },
            new DistrictTranslation { id = 194, EntityId = 145, Lang = "uk", Title = "Шродмієстє" },
            new DistrictTranslation { id = 195, EntityId = 146, Lang = "en", Title = "Praga-Północ" },
            new DistrictTranslation { id = 196, EntityId = 146, Lang = "uk", Title = "Прага-Північ" },
            new DistrictTranslation { id = 197, EntityId = 147, Lang = "en", Title = "Wola" },
            new DistrictTranslation { id = 198, EntityId = 147, Lang = "uk", Title = "Воля" },

            // Krakow
            new DistrictTranslation { id = 199, EntityId = 148, Lang = "en", Title = "Old Town" },
            new DistrictTranslation { id = 200, EntityId = 148, Lang = "uk", Title = "Старе місто" },
            new DistrictTranslation { id = 201, EntityId = 149, Lang = "en", Title = "Kazimierz" },
            new DistrictTranslation { id = 202, EntityId = 149, Lang = "uk", Title = "Казімєж" },
            new DistrictTranslation { id = 203, EntityId = 150, Lang = "en", Title = "Podgórze" },
            new DistrictTranslation { id = 204, EntityId = 150, Lang = "uk", Title = "Подгуже" },

            // Poznan
            new DistrictTranslation { id = 205, EntityId = 151, Lang = "en", Title = "Stare Miasto" },
            new DistrictTranslation { id = 206, EntityId = 151, Lang = "uk", Title = "Старе місто" },
            new DistrictTranslation { id = 207, EntityId = 152, Lang = "en", Title = "Grunwald" },
            new DistrictTranslation { id = 208, EntityId = 152, Lang = "uk", Title = "Грюнвальд" },
            new DistrictTranslation { id = 209, EntityId = 153, Lang = "en", Title = "Jeżyce" },
            new DistrictTranslation { id = 210, EntityId = 153, Lang = "uk", Title = "Єжице" }

        );


            //modelBuilder.Entity<AttractionTranslation>().HasData(

            //// =================== Київ ===================
            //// --- District 1 ---
            //new AttractionTranslation { id = 1, EntityId = 1, Lang = "en", Title = "Sofia Square", Description = "Historic square with Saint Sophia Cathedral", Address = "Sofiiska Square, Kyiv" },
            //new AttractionTranslation { id = 2, EntityId = 2, Lang = "en", Title = "Golden Gate", Description = "Ancient city gate and museum", Address = "Zoloti Vorota, Kyiv" },
            //new AttractionTranslation { id = 3, EntityId = 3, Lang = "en", Title = "St. Michael's Square", Description = "Square with St. Michael's Golden-Domed Monastery", Address = "Mykhailivska Square, Kyiv" },
            //new AttractionTranslation { id = 4, EntityId = 4, Lang = "en", Title = "Andriyivskyi Descent", Description = "Historic descent with art galleries and shops", Address = "Andriyivskyi Uzviz, Kyiv" },
            //new AttractionTranslation { id = 5, EntityId = 5, Lang = "en", Title = "National Museum of History of Ukraine", Description = "Museum showcasing Ukrainian history", Address = "National Museum of History of Ukraine, Kyiv" },

            //new AttractionTranslation { id = 6, EntityId = 1, Lang = "uk", Title = "Софійська площа", Description = "Історична площа із Софійським собором", Address = "Софійська площа, Київ" },
            //new AttractionTranslation { id = 7, EntityId = 2, Lang = "uk", Title = "Золоті ворота", Description = "Старовинні міські ворота та музей", Address = "Золоті ворота, Київ" },
            //new AttractionTranslation { id = 8, EntityId = 3, Lang = "uk", Title = "Михайлівська площа", Description = "Площа з Михайлівським Золотоверхим монастирем", Address = "Михайлівська площа, Київ" },
            //new AttractionTranslation { id = 9, EntityId = 4, Lang = "uk", Title = "Андріївський узвіз", Description = "Історичний узвіз з художніми галереями та крамницями", Address = "Андріївський узвіз, Київ" },
            //new AttractionTranslation { id = 10, EntityId = 5, Lang = "uk", Title = "Національний музей історії України", Description = "Музей, що демонструє історію України", Address = "Національний музей історії України, Київ" },

            //// --- District 2 ---
            //new AttractionTranslation { id = 11, EntityId = 6, Lang = "en", Title = "Shevchenko Park", Description = "Central city park with monuments and greenery", Address = "Shevchenko Park, Kyiv" },
            //new AttractionTranslation { id = 12, EntityId = 7, Lang = "en", Title = "Kyiv University", Description = "Historic university in the heart of the city", Address = "Kyiv University, Kyiv" },
            //new AttractionTranslation { id = 13, EntityId = 8, Lang = "en", Title = "Hryshko National Botanical Garden", Description = "Large botanical garden with diverse plant collections", Address = "Hryshko National Botanical Garden, Kyiv" },
            //new AttractionTranslation { id = 14, EntityId = 9, Lang = "en", Title = "Kontraktova Square", Description = "Historic square in Podil district", Address = "Kontraktova Square, Kyiv" },
            //new AttractionTranslation { id = 15, EntityId = 10, Lang = "en", Title = "St. Michael's Cathedral", Description = "Famous golden-domed cathedral in Kyiv", Address = "St. Michael's Cathedral, Kyiv" },

            //new AttractionTranslation { id = 16, EntityId = 6, Lang = "uk", Title = "Парк Шевченка", Description = "Центральний парк міста з пам’ятниками та зеленими зонами", Address = "Парк Шевченка, Київ" },
            //new AttractionTranslation { id = 17, EntityId = 7, Lang = "uk", Title = "Київський університет", Description = "Історичний університет у центрі міста", Address = "Київський університет, Київ" },
            //new AttractionTranslation { id = 18, EntityId = 8, Lang = "uk", Title = "Ботанічний сад ім. Гришка", Description = "Великий ботанічний сад із різноманітними колекціями рослин", Address = "Ботанічний сад ім. Гришка, Київ" },
            //new AttractionTranslation { id = 19, EntityId = 9, Lang = "uk", Title = "Контрактова площа", Description = "Історична площа в районі Поділ", Address = "Контрактова площа, Київ" },
            //new AttractionTranslation { id = 20, EntityId = 10, Lang = "uk", Title = "Михайлівський собор", Description = "Відомий Золотоверхий собор у Києві", Address = "Михайлівський собор, Київ" },

            //// --- District 3 ---
            //new AttractionTranslation { id = 21, EntityId = 11, Lang = "en", Title = "Poshtova Square", Description = "Historic square near the Dnipro river", Address = "Poshtova Square, Kyiv" },
            //new AttractionTranslation { id = 22, EntityId = 12, Lang = "en", Title = "Museum of the History of Kyiv", Description = "Museum showcasing the history of the city", Address = "Museum of the History of Kyiv, Kyiv" },
            //new AttractionTranslation { id = 23, EntityId = 13, Lang = "en", Title = "Dnipro Embankment", Description = "Riverfront promenade along the Dnipro river", Address = "Dnipro Embankment, Kyiv" },
            //new AttractionTranslation { id = 24, EntityId = 14, Lang = "en", Title = "Water Museum", Description = "Museum dedicated to water supply and technologies", Address = "Water Museum, Kyiv" },
            //new AttractionTranslation { id = 25, EntityId = 15, Lang = "en", Title = "Paton Bridge", Description = "Famous bridge across the Dnipro river", Address = "Paton Bridge, Kyiv" },

            //new AttractionTranslation { id = 26, EntityId = 11, Lang = "uk", Title = "Поштова площа", Description = "Історична площа біля річки Дніпро", Address = "Поштова площа, Київ" },
            //new AttractionTranslation { id = 27, EntityId = 12, Lang = "uk", Title = "Музей історії Києва", Description = "Музей, що демонструє історію міста", Address = "Музей історії Києва, Київ" },
            //new AttractionTranslation { id = 28, EntityId = 13, Lang = "uk", Title = "Набережна Дніпра", Description = "Прогулянкова набережна вздовж річки Дніпро", Address = "Набережна Дніпра, Київ" },
            //new AttractionTranslation { id = 29, EntityId = 14, Lang = "uk", Title = "Музей води", Description = "Музей, присвячений водопостачанню та технологіям", Address = "Музей води, Київ" },
            //new AttractionTranslation { id = 30, EntityId = 15, Lang = "uk", Title = "Міст Патона", Description = "Відомий міст через річку Дніпро", Address = "Міст Патона, Київ" },


            //// =================== Ужгород ===================
            //// --- District 4 ---
            //new AttractionTranslation { id = 31, EntityId = 16, Lang = "en", Title = "Uzhgorod Castle", Description = "Historic castle overlooking the city", Address = "Uzhgorod Castle, Uzhgorod" },
            //new AttractionTranslation { id = 32, EntityId = 17, Lang = "en", Title = "Uzhgorod Cathedral", Description = "Main cathedral of the city", Address = "Uzhgorod Cathedral, Uzhgorod" },
            //new AttractionTranslation { id = 33, EntityId = 18, Lang = "en", Title = "UzhNU Botanical Garden", Description = "Botanical garden of Uzhgorod National University", Address = "UzhNU Botanical Garden, Uzhgorod" },
            //new AttractionTranslation { id = 34, EntityId = 19, Lang = "en", Title = "Theatre Square", Description = "Central square with cafes and theaters", Address = "Theatre Square, Uzhgorod" },
            //new AttractionTranslation { id = 35, EntityId = 20, Lang = "en", Title = "Museum of Folk Architecture of Zakarpattia", Description = "Open-air museum of traditional architecture", Address = "Museum of Folk Architecture of Zakarpattia, Uzhgorod" },

            //new AttractionTranslation { id = 36, EntityId = 16, Lang = "uk", Title = "Ужгородський замок", Description = "Історичний замок із видом на місто", Address = "Ужгородський замок, Ужгород" },
            //new AttractionTranslation { id = 37, EntityId = 17, Lang = "uk", Title = "Кафедральний собор Ужгорода", Description = "Головний собор міста", Address = "Кафедральний собор Ужгорода" },
            //new AttractionTranslation { id = 38, EntityId = 18, Lang = "uk", Title = "Ботанічний сад УжНУ", Description = "Ботанічний сад Ужгородського національного університету", Address = "Ботанічний сад УжНУ, Ужгород" },
            //new AttractionTranslation { id = 39, EntityId = 19, Lang = "uk", Title = "Площа Театральна", Description = "Центральна площа з кафе та театрами", Address = "Площа Театральна, Ужгород" },
            //new AttractionTranslation { id = 40, EntityId = 20, Lang = "uk", Title = "Музей народної архітектури Закарпаття", Description = "Музей просто неба традиційної архітектури", Address = "Музей народної архітектури Закарпаття, Ужгород" },

            //// =================== Львів ===================
            //// --- District 7 ---
            //new AttractionTranslation { id = 41, EntityId = 21, Lang = "en", Title = "Rynok Square", Description = "Historic central square of Lviv", Address = "Rynok Square, Lviv" },
            //new AttractionTranslation { id = 42, EntityId = 22, Lang = "en", Title = "Lviv Opera", Description = "Famous opera house in Lviv", Address = "Lviv Opera, Lviv" },
            //new AttractionTranslation { id = 43, EntityId = 23, Lang = "en", Title = "High Castle", Description = "Historic hill with panoramic city views", Address = "High Castle, Lviv" },
            //new AttractionTranslation { id = 44, EntityId = 24, Lang = "en", Title = "Lviv Museum of History of Religion", Description = "Museum dedicated to religious history", Address = "Lviv Museum of History of Religion, Lviv" },
            //new AttractionTranslation { id = 45, EntityId = 25, Lang = "en", Title = "Ivan Franko Park", Description = "City park named after the poet Ivan Franko", Address = "Ivan Franko Park, Lviv" },

            //new AttractionTranslation { id = 46, EntityId = 21, Lang = "uk", Title = "Площа Ринок", Description = "Історична центральна площа Львова", Address = "Площа Ринок, Львів" },
            //new AttractionTranslation { id = 47, EntityId = 22, Lang = "uk", Title = "Львівська опера", Description = "Відомий оперний театр Львова", Address = "Львівська опера, Львів" },
            //new AttractionTranslation { id = 48, EntityId = 23, Lang = "uk", Title = "Високий замок", Description = "Історичний пагорб з панорамним видом на місто", Address = "Високий замок, Львів" },
            //new AttractionTranslation { id = 49, EntityId = 24, Lang = "uk", Title = "Львівський музей історії релігії", Description = "Музей, присвячений історії релігії", Address = "Львівський музей історії релігії, Львів" },
            //new AttractionTranslation { id = 50, EntityId = 25, Lang = "uk", Title = "Парк імені Івана Франка", Description = "Міський парк імені поета Івана Франка", Address = "Парк імені Івана Франка, Львів" },

            //// =================== Одеса ===================
            //// --- District 10 ---
            //new AttractionTranslation { id = 51, EntityId = 26, Lang = "en", Title = "Deribasivska Street", Description = "Famous pedestrian street in Odesa", Address = "Deribasivska Street, Odesa" },
            //new AttractionTranslation { id = 52, EntityId = 27, Lang = "en", Title = "Odesa Opera and Ballet Theatre", Description = "Historic opera house of Odesa", Address = "Odesa Opera and Ballet Theatre, Odesa" },
            //new AttractionTranslation { id = 53, EntityId = 28, Lang = "en", Title = "Potemkin Stairs", Description = "Iconic giant stairway overlooking the harbor", Address = "Potemkin Stairs, Odesa" },
            //new AttractionTranslation { id = 54, EntityId = 29, Lang = "en", Title = "Odesa Port", Description = "Major commercial and tourist port", Address = "Odesa Port, Odesa" },
            //new AttractionTranslation { id = 55, EntityId = 30, Lang = "en", Title = "Primorsky Boulevard", Description = "Famous boulevard along the coastline", Address = "Primorsky Boulevard, Odesa" },

            //new AttractionTranslation { id = 56, EntityId = 26, Lang = "uk", Title = "Вулиця Дерибасівська", Description = "Відома пішохідна вулиця Одеси", Address = "Дерибасівська вулиця, Одеса" },
            //new AttractionTranslation { id = 57, EntityId = 27, Lang = "uk", Title = "Одеський театр опери та балету", Description = "Історичний оперний театр Одеси", Address = "Одеський театр опери та балету, Одеса" },
            //new AttractionTranslation { id = 58, EntityId = 28, Lang = "uk", Title = "Потьомкінські сходи", Description = "Знакові сходи з видом на порт", Address = "Потьомкінські сходи, Одеса" },
            //new AttractionTranslation { id = 59, EntityId = 29, Lang = "uk", Title = "Одеський порт", Description = "Великий комерційний та туристичний порт", Address = "Одеський порт, Одеса" },
            //new AttractionTranslation { id = 60, EntityId = 30, Lang = "uk", Title = "Приморський бульвар", Description = "Відомий бульвар уздовж узбережжя", Address = "Приморський бульвар, Одеса" },

            //// =================== Тернопіль ===================
            //// --- District 13 ---
            //new AttractionTranslation { id = 61, EntityId = 31, Lang = "en", Title = "Ternopil Castle", Description = "Historic castle in Ternopil", Address = "Ternopil Castle, Ternopil" },
            //new AttractionTranslation { id = 62, EntityId = 32, Lang = "en", Title = "Ternopil Lake", Description = "Famous lake in the city center", Address = "Ternopil Lake, Ternopil" },
            //new AttractionTranslation { id = 63, EntityId = 33, Lang = "en", Title = "Heroes of Euromaidan Square", Description = "Central square commemorating Euromaidan", Address = "Heroes of Euromaidan Square, Ternopil" },
            //new AttractionTranslation { id = 64, EntityId = 34, Lang = "en", Title = "Museum of Education", Description = "Museum dedicated to the history of education", Address = "Museum of Education, Ternopil" },
            //new AttractionTranslation { id = 65, EntityId = 35, Lang = "en", Title = "Dominican Church", Description = "Historic church in the city center", Address = "Dominican Church, Ternopil" },

            //new AttractionTranslation { id = 66, EntityId = 31, Lang = "uk", Title = "Тернопільський замок", Description = "Історичний замок у Тернополі", Address = "Тернопільський замок, Тернопіль" },
            //new AttractionTranslation { id = 67, EntityId = 32, Lang = "uk", Title = "Тернопільський став", Description = "Відоме озеро в центрі міста", Address = "Тернопільський став, Тернопіль" },
            //new AttractionTranslation { id = 68, EntityId = 33, Lang = "uk", Title = "Площа Героїв Євромайдану", Description = "Центральна площа, присвячена подіям Євромайдану", Address = "Площа Героїв Євромайдану, Тернопіль" },
            //new AttractionTranslation { id = 69, EntityId = 34, Lang = "uk", Title = "Музей освіти", Description = "Музей, присвячений історії освіти", Address = "Музей освіти, Тернопіль" },
            //new AttractionTranslation { id = 70, EntityId = 35, Lang = "uk", Title = "Домініканський костел", Description = "Історичний костел у центрі міста", Address = "Домініканський костел, Тернопіль" },

            //// =================== Миколаїв ===================
            //// --- District 14 ---
            //new AttractionTranslation { id = 71, EntityId = 36, Lang = "en", Title = "Mykolaiv Shipyard", Description = "Famous shipbuilding plant in Mykolaiv", Address = "Mykolaiv Shipyard, Mykolaiv" },
            //new AttractionTranslation { id = 72, EntityId = 37, Lang = "en", Title = "Mykolaiv Zoo", Description = "City zoo with diverse animals", Address = "Mykolaiv Zoo, Mykolaiv" },
            //new AttractionTranslation { id = 73, EntityId = 38, Lang = "en", Title = "Soborna Street", Description = "Central street in Mykolaiv", Address = "Soborna Street, Mykolaiv" },
            //new AttractionTranslation { id = 74, EntityId = 39, Lang = "en", Title = "Catherine II Monument", Description = "Monument dedicated to Catherine the Great", Address = "Catherine II Monument, Mykolaiv" },
            //new AttractionTranslation { id = 75, EntityId = 40, Lang = "en", Title = "Mykolaiv Regional Museum", Description = "Regional museum with historical exhibits", Address = "Mykolaiv Regional Museum, Mykolaiv" },

            //new AttractionTranslation { id = 76, EntityId = 36, Lang = "uk", Title = "Миколаївський кораблебудівний завод", Description = "Відомий кораблебудівний завод у Миколаєві", Address = "Миколаївський кораблебудівний завод, Миколаїв" },
            //new AttractionTranslation { id = 77, EntityId = 37, Lang = "uk", Title = "Миколаївський зоопарк", Description = "Міський зоопарк з різноманітними тваринами", Address = "Миколаївський зоопарк, Миколаїв" },
            //new AttractionTranslation { id = 78, EntityId = 38, Lang = "uk", Title = "Вулиця Соборна", Description = "Центральна вулиця Миколаєва", Address = "Вулиця Соборна, Миколаїв" },
            //new AttractionTranslation { id = 79, EntityId = 39, Lang = "uk", Title = "Пам’ятник Катерині II", Description = "Пам’ятник Катерині II", Address = "Пам’ятник Катерині II, Миколаїв" },
            //new AttractionTranslation { id = 80, EntityId = 40, Lang = "uk", Title = "Миколаївський обласний краєзнавчий музей", Description = "Обласний музей з історичними експонатами", Address = "Миколаївський обласний краєзнавчий музей, Миколаїв" },

            //// =================== Херсон ===================
            //// --- District 15 ---
            //new AttractionTranslation { id = 81, EntityId = 41, Lang = "en", Title = "Kherson Regional Museum", Description = "Regional museum with historical exhibits", Address = "Kherson Regional Museum, Kherson" },
            //new AttractionTranslation { id = 82, EntityId = 42, Lang = "en", Title = "Kherson Sea Port", Description = "Major maritime port in Kherson", Address = "Kherson Sea Port, Kherson" },
            //new AttractionTranslation { id = 83, EntityId = 43, Lang = "en", Title = "Holy Trinity Cathedral", Description = "Historic cathedral in Kherson", Address = "Holy Trinity Cathedral, Kherson" },
            //new AttractionTranslation { id = 84, EntityId = 44, Lang = "en", Title = "Glory Park", Description = "Popular park in Kherson", Address = "Glory Park, Kherson" },
            //new AttractionTranslation { id = 85, EntityId = 45, Lang = "en", Title = "Ushakova Street", Description = "Central street in Kherson", Address = "Ushakova Street, Kherson" },

            //new AttractionTranslation { id = 86, EntityId = 41, Lang = "uk", Title = "Херсонський обласний краєзнавчий музей", Description = "Обласний музей з історичними експонатами", Address = "Херсонський обласний краєзнавчий музей, Херсон" },
            //new AttractionTranslation { id = 87, EntityId = 42, Lang = "uk", Title = "Херсонський морський порт", Description = "Великий морський порт Херсона", Address = "Херсонський морський порт, Херсон" },
            //new AttractionTranslation { id = 88, EntityId = 43, Lang = "uk", Title = "Кафедральний собор Святої Трійці", Description = "Історичний кафедральний собор у Херсоні", Address = "Кафедральний собор Святої Трійці, Херсон" },
            //new AttractionTranslation { id = 89, EntityId = 44, Lang = "uk", Title = "Парк Слави", Description = "Популярний парк у Херсоні", Address = "Парк Слави, Херсон" },
            //new AttractionTranslation { id = 90, EntityId = 45, Lang = "uk", Title = "Вулиця Ушакова", Description = "Центральна вулиця Херсона", Address = "Вулиця Ушакова, Херсон" },

            //// =================== Луганськ (Сєвєродонецьк) ===================
            //// --- District 16 ---
            //new AttractionTranslation { id = 91, EntityId = 46, Lang = "en", Title = "Severodonetsk City Park", Description = "Central park in Severodonetsk", Address = "Severodonetsk City Park, Severodonetsk" },
            //new AttractionTranslation { id = 92, EntityId = 47, Lang = "en", Title = "Severodonetsk Museum of Local History", Description = "Museum showcasing regional history", Address = "Severodonetsk Museum of Local History, Severodonetsk" },
            //new AttractionTranslation { id = 93, EntityId = 48, Lang = "en", Title = "Peace Square", Description = "Main city square in Severodonetsk", Address = "Peace Square, Severodonetsk" },
            //new AttractionTranslation { id = 94, EntityId = 49, Lang = "en", Title = "Severodonetsk Regional Theater", Description = "Local theater for performances and shows", Address = "Severodonetsk Regional Theater, Severodonetsk" },
            //new AttractionTranslation { id = 95, EntityId = 50, Lang = "en", Title = "Mиру Street", Description = "Central street in Severodonetsk", Address = "Mиру Street, Severodonetsk" },

            //new AttractionTranslation { id = 96, EntityId = 46, Lang = "uk", Title = "Сєвєродонецький міський парк", Description = "Центральний парк у Сєвєродонецьку", Address = "Сєвєродонецький міський парк, Сєвєродонецьк" },
            //new AttractionTranslation { id = 97, EntityId = 47, Lang = "uk", Title = "Краєзнавчий музей Сєвєродонецька", Description = "Музей регіональної історії", Address = "Краєзнавчий музей Сєвєродонецька, Сєвєродонецьк" },
            //new AttractionTranslation { id = 98, EntityId = 48, Lang = "uk", Title = "Площа Миру", Description = "Головна площа міста Сєвєродонецьк", Address = "Площа Миру, Сєвєродонецьк" },
            //new AttractionTranslation { id = 99, EntityId = 49, Lang = "uk", Title = "Сєвєродонецький краєзнавчий театр", Description = "Місцевий театр для вистав та шоу", Address = "Сєвєродонецький краєзнавчий театр, Сєвєродонецьк" },
            //new AttractionTranslation { id = 100, EntityId = 50, Lang = "uk", Title = "Вулиця Миру", Description = "Центральна вулиця Сєвєродонецька", Address = "Вулиця Миру, Сєвєродонецьк" },

            //// =================== Рівне ===================
            //// --- District 49 ---
            //new AttractionTranslation { id = 101, EntityId = 51, Lang = "en", Title = "Rivne Regional Museum", Description = "Regional museum showcasing history", Address = "Rivne Regional Museum, Rivne" },
            //new AttractionTranslation { id = 102, EntityId = 52, Lang = "en", Title = "Shevchenko Park", Description = "Popular park in Rivne", Address = "Shevchenko Park, Rivne" },
            //new AttractionTranslation { id = 103, EntityId = 53, Lang = "en", Title = "Amber Museum", Description = "Museum dedicated to amber artifacts", Address = "Amber Museum, Rivne" },
            //new AttractionTranslation { id = 104, EntityId = 54, Lang = "en", Title = "Independence Square", Description = "Central square of Rivne", Address = "Independence Square, Rivne" },
            //new AttractionTranslation { id = 105, EntityId = 55, Lang = "en", Title = "Soborna Street", Description = "Central street in Rivne", Address = "Soborna Street, Rivne" },

            //new AttractionTranslation { id = 106, EntityId = 51, Lang = "uk", Title = "Рівненський краєзнавчий музей", Description = "Обласний музей з історичними експонатами", Address = "Рівненський краєзнавчий музей, Рівне" },
            //new AttractionTranslation { id = 107, EntityId = 52, Lang = "uk", Title = "Парк ім. Шевченка", Description = "Популярний парк у Рівному", Address = "Парк ім. Шевченка, Рівне" },
            //new AttractionTranslation { id = 108, EntityId = 53, Lang = "uk", Title = "Музей бурштину", Description = "Музей, присвячений бурштиновим експонатам", Address = "Музей бурштину, Рівне" },
            //new AttractionTranslation { id = 109, EntityId = 54, Lang = "uk", Title = "Площа Незалежності", Description = "Центральна площа Рівного", Address = "Площа Незалежності, Рівне" },
            //new AttractionTranslation { id = 110, EntityId = 55, Lang = "uk", Title = "Вулиця Соборна", Description = "Центральна вулиця Рівного", Address = "Вулиця Соборна, Рівне" },

            //// =================== Рівне (DistrictId = 50) ===================
            //new AttractionTranslation { id = 111, EntityId = 56, Lang = "en", Title = "Rivne Academic Ukrainian Music and Drama Theater", Description = "Major theater in Rivne for drama and music performances", Address = "Rivne Academic Ukrainian Music and Drama Theater, Rivne" },
            //new AttractionTranslation { id = 112, EntityId = 57, Lang = "en", Title = "Soborna Street", Description = "Central street in Rivne", Address = "Soborna Street, Rivne" },
            //new AttractionTranslation { id = 113, EntityId = 58, Lang = "en", Title = "Rivne Regional Library", Description = "Main public library in Rivne", Address = "Rivne Regional Library, Rivne" },
            //new AttractionTranslation { id = 114, EntityId = 59, Lang = "en", Title = "Youth Park", Description = "Popular park for recreation in Rivne", Address = "Youth Park, Rivne" },
            //new AttractionTranslation { id = 115, EntityId = 60, Lang = "en", Title = "Rivne Puppet Theater", Description = "Regional theater for puppet shows", Address = "Rivne Puppet Theater, Rivne" },

            //new AttractionTranslation { id = 116, EntityId = 56, Lang = "uk", Title = "Рівненський академічний український музично-драматичний театр", Description = "Головний театр Рівного для драматичних і музичних вистав", Address = "Рівненський академічний український музично-драматичний театр, Рівне" },
            //new AttractionTranslation { id = 117, EntityId = 57, Lang = "uk", Title = "Вулиця Соборна", Description = "Центральна вулиця Рівного", Address = "Вулиця Соборна, Рівне" },
            //new AttractionTranslation { id = 118, EntityId = 58, Lang = "uk", Title = "Рівненська обласна бібліотека", Description = "Головна публічна бібліотека Рівного", Address = "Рівненська обласна бібліотека, Рівне" },
            //new AttractionTranslation { id = 119, EntityId = 59, Lang = "uk", Title = "Парк Молоді", Description = "Популярний парк для відпочинку у Рівному", Address = "Парк Молоді, Рівне" },
            //new AttractionTranslation { id = 120, EntityId = 60, Lang = "uk", Title = "Рівненський академічний обласний театр ляльок", Description = "Обласний театр ляльок", Address = "Рівненський академічний обласний театр ляльок, Рівне" },

            //// =================== Луцьк (DistrictId = 52) ===================
            //new AttractionTranslation { id = 121, EntityId = 61, Lang = "en", Title = "Lubart's Castle", Description = "Historic castle in the center of Lutsk", Address = "Lubart's Castle, Lutsk" },
            //new AttractionTranslation { id = 122, EntityId = 62, Lang = "en", Title = "Lesi Ukrainky Street", Description = "Main street in Lutsk", Address = "Lesi Ukrainky Street, Lutsk" },
            //new AttractionTranslation { id = 123, EntityId = 63, Lang = "en", Title = "Lutsk Museum", Description = "Museum showcasing the history of Lutsk", Address = "Lutsk Museum, Lutsk" },
            //new AttractionTranslation { id = 124, EntityId = 64, Lang = "en", Title = "Lesi Ukrainky Park", Description = "City park named after Lesia Ukrainka", Address = "Lesi Ukrainky Park, Lutsk" },
            //new AttractionTranslation { id = 125, EntityId = 65, Lang = "en", Title = "Holy Trinity Cathedral", Description = "Historic cathedral in Lutsk", Address = "Holy Trinity Cathedral, Lutsk" },

            //new AttractionTranslation { id = 126, EntityId = 61, Lang = "uk", Title = "Замок Любарта", Description = "Історичний замок у центрі Луцька", Address = "Замок Любарта, Луцьк" },
            //new AttractionTranslation { id = 127, EntityId = 62, Lang = "uk", Title = "Вулиця Лесі Українки", Description = "Головна вулиця Луцька", Address = "Вулиця Лесі Українки, Луцьк" },
            //new AttractionTranslation { id = 128, EntityId = 63, Lang = "uk", Title = "Луцький музей", Description = "Музей історії Луцька", Address = "Луцький музей, Луцьк" },
            //new AttractionTranslation { id = 129, EntityId = 64, Lang = "uk", Title = "Парк імені Лесі Українки", Description = "Міський парк імені Лесі Українки", Address = "Парк імені Лесі Українки, Луцьк" },
            //new AttractionTranslation { id = 130, EntityId = 65, Lang = "uk", Title = "Собор Святої Трійці", Description = "Історичний собор у Луцьку", Address = "Собор Святої Трійці, Луцьк" },

            //// =================== Чернівці(DistrictId = 55) ===================
            //// --- District 55 ---
            //new AttractionTranslation { id = 131, EntityId = 66, Lang = "en", Title = "Yuriy Fedkovych Chernivtsi National University", Description = "Historic university in Chernivtsi", Address = "Yuriy Fedkovych Chernivtsi National University, Chernivtsi" },
            //new AttractionTranslation { id = 132, EntityId = 67, Lang = "en", Title = "Olha Kobylianska Street", Description = "Famous street in Chernivtsi", Address = "Olha Kobylianska Street, Chernivtsi" },
            //new AttractionTranslation { id = 133, EntityId = 68, Lang = "en", Title = "Central Square", Description = "Main square of Chernivtsi", Address = "Central Square, Chernivtsi" },
            //new AttractionTranslation { id = 134, EntityId = 69, Lang = "en", Title = "Chernivtsi Regional Museum", Description = "Regional museum with historical exhibits", Address = "Chernivtsi Regional Museum, Chernivtsi" },
            //new AttractionTranslation { id = 135, EntityId = 70, Lang = "en", Title = "Zhovtnevyi Park", Description = "Popular park in Chernivtsi", Address = "Zhovtnevyi Park, Chernivtsi" },

            //new AttractionTranslation { id = 136, EntityId = 66, Lang = "uk", Title = "Чернівецький національний університет імені Юрія Федьковича", Description = "Історичний університет у Чернівцях", Address = "Чернівецький національний університет імені Юрія Федьковича, Чернівці" },
            //new AttractionTranslation { id = 137, EntityId = 67, Lang = "uk", Title = "Вулиця Ольги Кобилянської", Description = "Відома вулиця Чернівців", Address = "Вулиця Ольги Кобилянської, Чернівці" },
            //new AttractionTranslation { id = 138, EntityId = 68, Lang = "uk", Title = "Площа Центральна", Description = "Головна площа Чернівців", Address = "Площа Центральна, Чернівці" },
            //new AttractionTranslation { id = 139, EntityId = 69, Lang = "uk", Title = "Чернівецький обласний краєзнавчий музей", Description = "Обласний музей з історичними експонатами", Address = "Чернівецький обласний краєзнавчий музей, Чернівці" },
            //new AttractionTranslation { id = 140, EntityId = 70, Lang = "uk", Title = "Парк Жовтневий", Description = "Популярний парк у Чернівцях", Address = "Парк Жовтневий, Чернівці" },

            //// =================== Житомир (DistrictId = 58) ===================
            //new AttractionTranslation { id = 141, EntityId = 71, Lang = "en", Title = "Zhytomyr Museum of Cosmonautics", Description = "Museum dedicated to space exploration and cosmonautics", Address = "Zhytomyr Museum of Cosmonautics, Zhytomyr" },
            //new AttractionTranslation { id = 142, EntityId = 72, Lang = "en", Title = "Mykhailivska Street", Description = "Central street in Zhytomyr", Address = "Mykhailivska Street, Zhytomyr" },
            //new AttractionTranslation { id = 143, EntityId = 73, Lang = "en", Title = "Palace of Culture", Description = "Cultural center and event venue in Zhytomyr", Address = "Palace of Culture, Zhytomyr" },
            //new AttractionTranslation { id = 144, EntityId = 74, Lang = "en", Title = "Holy Sophia Cathedral", Description = "Historic cathedral in Zhytomyr", Address = "Holy Sophia Cathedral, Zhytomyr" },
            //new AttractionTranslation { id = 145, EntityId = 75, Lang = "en", Title = "Yuri Gagarin Park", Description = "Popular park named after Yuri Gagarin", Address = "Yuri Gagarin Park, Zhytomyr" },

            //new AttractionTranslation { id = 146, EntityId = 71, Lang = "uk", Title = "Житомирський музей космонавтики", Description = "Музей, присвячений космічним дослідженням та космонавтиці", Address = "Житомирський музей космонавтики, Житомир" },
            //new AttractionTranslation { id = 147, EntityId = 72, Lang = "uk", Title = "Вулиця Михайлівська", Description = "Центральна вулиця Житомира", Address = "Вулиця Михайлівська, Житомир" },
            //new AttractionTranslation { id = 148, EntityId = 73, Lang = "uk", Title = "Палац Культури", Description = "Культурний центр та місце проведення заходів у Житомирі", Address = "Палац Культури, Житомир" },
            //new AttractionTranslation { id = 149, EntityId = 74, Lang = "uk", Title = "Собор Святої Софії", Description = "Історичний собор у Житомирі", Address = "Собор Святої Софії, Житомир" },
            //new AttractionTranslation { id = 150, EntityId = 75, Lang = "uk", Title = "Парк ім. Юрія Гагаріна", Description = "Популярний парк, названий на честь Юрія Гагаріна", Address = "Парк ім. Юрія Гагаріна, Житомир" },

            //// =================== Житомир (DistrictId = 59) ===================
            //new AttractionTranslation { id = 151, EntityId = 76, Lang = "en", Title = "Zhytomyr Regional Art Museum", Description = "Museum featuring regional and national art collections", Address = "Zhytomyr Regional Art Museum, Zhytomyr" },
            //new AttractionTranslation { id = 152, EntityId = 77, Lang = "en", Title = "Kyivska Street", Description = "Central street in Zhytomyr", Address = "Kyivska Street, Zhytomyr" },
            //new AttractionTranslation { id = 153, EntityId = 78, Lang = "en", Title = "Zhytomyr History Museum", Description = "Museum showcasing the history of Zhytomyr", Address = "Zhytomyr History Museum, Zhytomyr" },
            //new AttractionTranslation { id = 154, EntityId = 79, Lang = "en", Title = "Zhytomyr Botanical Garden", Description = "Botanical garden with diverse plant collections", Address = "Zhytomyr Botanical Garden, Zhytomyr" },
            //new AttractionTranslation { id = 155, EntityId = 80, Lang = "en", Title = "Polissya Stadium", Description = "Local sports stadium in Zhytomyr", Address = "Polissya Stadium, Zhytomyr" },

            //new AttractionTranslation { id = 156, EntityId = 76, Lang = "uk", Title = "Житомирський обласний художній музей", Description = "Музей з регіональними та національними художніми колекціями", Address = "Житомирський обласний художній музей, Житомир" },
            //new AttractionTranslation { id = 157, EntityId = 77, Lang = "uk", Title = "Вулиця Київська", Description = "Центральна вулиця Житомира", Address = "Вулиця Київська, Житомир" },
            //new AttractionTranslation { id = 158, EntityId = 78, Lang = "uk", Title = "Музей історії міста Житомир", Description = "Музей, що демонструє історію Житомира", Address = "Музей історії міста Житомир, Житомир" },
            //new AttractionTranslation { id = 159, EntityId = 79, Lang = "uk", Title = "Житомирський ботанічний сад", Description = "Ботанічний сад з різноманітними колекціями рослин", Address = "Житомирський ботанічний сад, Житомир" },
            //new AttractionTranslation { id = 160, EntityId = 80, Lang = "uk", Title = "Стадіон 'Полісся'", Description = "Місцевий спортивний стадіон у Житомирі", Address = "Стадіон 'Полісся', Житомир" },

            //// =================== Суми (DistrictId = 61) ===================
            //new AttractionTranslation { id = 161, EntityId = 81, Lang = "en", Title = "Sumy Academic Drama and Musical Comedy Theater", Description = "Major theater for drama and musical performances in Sumy", Address = "Sumy Academic Drama and Musical Comedy Theater, Sumy" },
            //new AttractionTranslation { id = 162, EntityId = 82, Lang = "en", Title = "Voskresenska Street", Description = "Central street in Sumy", Address = "Voskresenska Street, Sumy" },
            //new AttractionTranslation { id = 163, EntityId = 83, Lang = "en", Title = "Sumy Regional Art Museum", Description = "Museum with regional art collections", Address = "Sumy Regional Art Museum, Sumy" },
            //new AttractionTranslation { id = 164, EntityId = 84, Lang = "en", Title = "Kozhedub Park", Description = "Park named after famous pilot Kozhedub", Address = "Kozhedub Park, Sumy" },
            //new AttractionTranslation { id = 165, EntityId = 85, Lang = "en", Title = "Sumy Regional Philharmonic", Description = "Philharmonic hall with concerts and events", Address = "Sumy Regional Philharmonic, Sumy" },

            //new AttractionTranslation { id = 166, EntityId = 81, Lang = "uk", Title = "Сумський академічний театр драми та музичної комедії", Description = "Головний театр для драматичних та музичних вистав у Сумах", Address = "Сумський академічний театр драми та музичної комедії, Суми" },
            //new AttractionTranslation { id = 167, EntityId = 82, Lang = "uk", Title = "Вулиця Воскресенська", Description = "Центральна вулиця Сум", Address = "Вулиця Воскресенська, Суми" },
            //new AttractionTranslation { id = 168, EntityId = 83, Lang = "uk", Title = "Сумський обласний художній музей", Description = "Музей з регіональними художніми колекціями", Address = "Сумський обласний художній музей, Суми" },
            //new AttractionTranslation { id = 169, EntityId = 84, Lang = "uk", Title = "Парк ім. Кожедуба", Description = "Парк, названий на честь відомого пілота Кожедуба", Address = "Парк ім. Кожедуба, Суми" },
            //new AttractionTranslation { id = 170, EntityId = 85, Lang = "uk", Title = "Сумська обласна філармонія", Description = "Філармонія для концертів та заходів", Address = "Сумська обласна філармонія, Суми" },

            //// =================== Кропивницький (DistrictId = 64) ===================
            //new AttractionTranslation { id = 171, EntityId = 86, Lang = "en", Title = "Kropyvnytskyi Regional Art Museum", Description = "Museum showcasing regional and national art", Address = "Kropyvnytskyi Regional Art Museum, Kropyvnytskyi" },
            //new AttractionTranslation { id = 172, EntityId = 87, Lang = "en", Title = "Velyka Perspektyvna Street", Description = "Main street in Kropyvnytskyi", Address = "Velyka Perspektyvna Street, Kropyvnytskyi" },
            //new AttractionTranslation { id = 173, EntityId = 88, Lang = "en", Title = "Kropyvnytskyi Academic Theater named after M. Kropyvnytskyi", Description = "Historic theater for drama performances", Address = "Kropyvnytskyi Academic Theater, Kropyvnytskyi" },
            //new AttractionTranslation { id = 174, EntityId = 89, Lang = "en", Title = "Kovalivskyi Park", Description = "Popular park in the city center", Address = "Kovalivskyi Park, Kropyvnytskyi" },
            //new AttractionTranslation { id = 175, EntityId = 90, Lang = "en", Title = "Kropyvnytskyi History Museum", Description = "Museum showcasing the history of Kropyvnytskyi", Address = "Kropyvnytskyi History Museum, Kropyvnytskyi" },

            //new AttractionTranslation { id = 176, EntityId = 86, Lang = "uk", Title = "Кіровоградський обласний художній музей", Description = "Музей з регіональними та національними художніми колекціями", Address = "Кіровоградський обласний художній музей, Кропивницький" },
            //new AttractionTranslation { id = 177, EntityId = 87, Lang = "uk", Title = "Вулиця Велика Перспективна", Description = "Головна вулиця Кропивницького", Address = "Вулиця Велика Перспективна, Кропивницький" },
            //new AttractionTranslation { id = 178, EntityId = 88, Lang = "uk", Title = "Кіровоградський академічний театр ім. М. Кропивницького", Description = "Історичний театр для драматичних вистав", Address = "Кіровоградський академічний театр, Кропивницький" },
            //new AttractionTranslation { id = 179, EntityId = 89, Lang = "uk", Title = "Парк Ковалівський", Description = "Популярний парк у центрі міста", Address = "Парк Ковалівський, Кропивницький" },
            //new AttractionTranslation { id = 180, EntityId = 90, Lang = "uk", Title = "Музей історії міста Кропивницький", Description = "Музей, що демонструє історію Кропивницького", Address = "Музей історії міста Кропивницький, Кропивницький" },

            //// =================== Вінниця (DistrictId = 67) ===================
            //new AttractionTranslation { id = 181, EntityId = 91, Lang = "en", Title = "Vinnytsia State Academic Musical Drama Theater named after Sadovsky", Description = "Theater for musical and dramatic performances", Address = "Vinnytsia State Academic Musical Drama Theater, Vinnytsia" },
            //new AttractionTranslation { id = 182, EntityId = 92, Lang = "en", Title = "Soborna Street", Description = "Central street in Vinnytsia", Address = "Soborna Street, Vinnytsia" },
            //new AttractionTranslation { id = 183, EntityId = 93, Lang = "en", Title = "Mykola Pirogov Museum-Estate", Description = "Museum dedicated to the famous surgeon and scientist Pirogov", Address = "Mykola Pirogov Museum-Estate, Vinnytsia" },
            //new AttractionTranslation { id = 184, EntityId = 94, Lang = "en", Title = "Leontovych Park", Description = "Park named after composer Leontovych", Address = "Leontovych Park, Vinnytsia" },
            //new AttractionTranslation { id = 185, EntityId = 95, Lang = "en", Title = "Vinnytsia Regional Museum", Description = "Museum featuring regional history and culture", Address = "Vinnytsia Regional Museum, Vinnytsia" },

            //new AttractionTranslation { id = 186, EntityId = 91, Lang = "uk", Title = "Вінницький державний академічний музично-драматичний театр ім. Садовського", Description = "Театр для музичних та драматичних вистав", Address = "Вінницький державний академічний музично-драматичний театр, Вінниця" },
            //new AttractionTranslation { id = 187, EntityId = 92, Lang = "uk", Title = "Вулиця Соборна", Description = "Центральна вулиця Вінниці", Address = "Вулиця Соборна, Вінниця" },
            //new AttractionTranslation { id = 188, EntityId = 93, Lang = "uk", Title = "Музей-садиба Миколи Пирогова", Description = "Музей, присвячений відомому хірургу та вченому Пирогову", Address = "Музей-садиба Миколи Пирогова, Вінниця" },
            //new AttractionTranslation { id = 189, EntityId = 94, Lang = "uk", Title = "Парк ім. Леонтовича", Description = "Парк, названий на честь композитора Леонтовича", Address = "Парк ім. Леонтовича, Вінниця" },
            //new AttractionTranslation { id = 190, EntityId = 95, Lang = "uk", Title = "Вінницький обласний краєзнавчий музей", Description = "Музей з регіональної історії та культури", Address = "Вінницький обласний краєзнавчий музей, Вінниця" },

            //// =================== Харків (DistrictId = 70) ===================
            //new AttractionTranslation { id = 191, EntityId = 96, Lang = "en", Title = "Kharkiv National Academic Opera and Ballet Theater", Description = "Major venue for opera and ballet performances", Address = "Kharkiv National Academic Opera and Ballet Theater, Kharkiv" },
            //new AttractionTranslation { id = 192, EntityId = 97, Lang = "en", Title = "Freedom Square", Description = "Central square in Kharkiv", Address = "Freedom Square, Kharkiv" },
            //new AttractionTranslation { id = 193, EntityId = 98, Lang = "en", Title = "Kharkiv Art Museum", Description = "Museum featuring regional and national art", Address = "Kharkiv Art Museum, Kharkiv" },
            //new AttractionTranslation { id = 194, EntityId = 99, Lang = "en", Title = "Gorky Park", Description = "Popular park in Kharkiv", Address = "Gorky Park, Kharkiv" },
            //new AttractionTranslation { id = 195, EntityId = 100, Lang = "en", Title = "Kharkiv Historical Museum", Description = "Museum showcasing the history of Kharkiv", Address = "Kharkiv Historical Museum, Kharkiv" },

            //new AttractionTranslation { id = 196, EntityId = 96, Lang = "uk", Title = "Харківський національний академічний театр опери та балету", Description = "Головний майданчик для оперних та балетних вистав", Address = "Харківський національний академічний театр опери та балету, Харків" },
            //new AttractionTranslation { id = 197, EntityId = 97, Lang = "uk", Title = "Площа Свободи", Description = "Центральна площа Харкова", Address = "Площа Свободи, Харків" },
            //new AttractionTranslation { id = 198, EntityId = 98, Lang = "uk", Title = "Харківський художній музей", Description = "Музей з регіональними та національними художніми колекціями", Address = "Харківський художній музей, Харків" },
            //new AttractionTranslation { id = 199, EntityId = 99, Lang = "uk", Title = "Парк Горького", Description = "Популярний парк у Харкові", Address = "Парк Горького, Харків" },
            //new AttractionTranslation { id = 200, EntityId = 100, Lang = "uk", Title = "Харківський історичний музей", Description = "Музей, що демонструє історію Харкова", Address = "Харківський історичний музей, Харків" },

            //// =================== Харків (DistrictId = 71) ===================
            //new AttractionTranslation { id = 201, EntityId = 101, Lang = "en", Title = "Kharkiv State Circus", Description = "Venue for circus performances and events", Address = "Kharkiv State Circus, Kharkiv" },
            //new AttractionTranslation { id = 202, EntityId = 102, Lang = "en", Title = "Sumska Street", Description = "Main street in Kharkiv", Address = "Sumska Street, Kharkiv" },
            //new AttractionTranslation { id = 203, EntityId = 103, Lang = "en", Title = "Kharkiv Planetarium", Description = "Planetarium with astronomy exhibitions and shows", Address = "Kharkiv Planetarium, Kharkiv" },
            //new AttractionTranslation { id = 204, EntityId = 104, Lang = "en", Title = "Taras Shevchenko Park", Description = "Park named after the famous poet Shevchenko", Address = "Taras Shevchenko Park, Kharkiv" },
            //new AttractionTranslation { id = 205, EntityId = 105, Lang = "en", Title = "Kharkiv Literary Museum", Description = "Museum dedicated to literary figures of Kharkiv", Address = "Kharkiv Literary Museum, Kharkiv" },

            //new AttractionTranslation { id = 206, EntityId = 101, Lang = "uk", Title = "Харківський державний цирк", Description = "Майданчик для циркових вистав та заходів", Address = "Харківський державний цирк, Харків" },
            //new AttractionTranslation { id = 207, EntityId = 102, Lang = "uk", Title = "Вулиця Сумська", Description = "Головна вулиця Харкова", Address = "Вулиця Сумська, Харків" },
            //new AttractionTranslation { id = 208, EntityId = 103, Lang = "uk", Title = "Харківський планетарій", Description = "Планетарій з астрономічними виставками та шоу", Address = "Харківський планетарій, Харків" },
            //new AttractionTranslation { id = 209, EntityId = 104, Lang = "uk", Title = "Парк імені Т.Г. Шевченка", Description = "Парк, названий на честь відомого поета Шевченка", Address = "Парк імені Т.Г. Шевченка, Харків" },
            //new AttractionTranslation { id = 210, EntityId = 105, Lang = "uk", Title = "Харківський літературний музей", Description = "Музей, присвячений літературним діячам Харкова", Address = "Харківський літературний музей, Харків" }

            //    // --- New York ---
            //    new AttractionTranslation { id = 1, EntityId = 1, Lang = "en", Title = "Statue of Liberty", Description = "Iconic national monument" },
            //    new AttractionTranslation { id = 2, EntityId = 1, Lang = "ru", Title = "Статуя Свободы", Description = "Знаменитый национальный памятник" },
            //    new AttractionTranslation { id = 3, EntityId = 2, Lang = "en", Title = "Central Park", Description = "Famous urban park" },
            //    new AttractionTranslation { id = 4, EntityId = 2, Lang = "ru", Title = "Центральный парк", Description = "Известный городской парк" },
            //    new AttractionTranslation { id = 5, EntityId = 3, Lang = "en", Title = "Times Square", Description = "Major commercial intersection" },
            //    new AttractionTranslation { id = 6, EntityId = 3, Lang = "ru", Title = "Таймс-сквер", Description = "Крупная торговая площадь" },
            //    new AttractionTranslation { id = 7, EntityId = 4, Lang = "en", Title = "Brooklyn Bridge", Description = "Historic bridge" },
            //    new AttractionTranslation { id = 8, EntityId = 4, Lang = "ru", Title = "Бруклинский мост", Description = "Исторический мост" },
            //    new AttractionTranslation { id = 9, EntityId = 5, Lang = "en", Title = "Empire State Building", Description = "102-story skyscraper" },
            //    new AttractionTranslation { id = 10, EntityId = 5, Lang = "ru", Title = "Эмпайр-стейт-билдинг", Description = "102-этажный небоскрёб" },

            //    // --- Los Angeles ---
            //    new AttractionTranslation { id = 11, EntityId = 6, Lang = "en", Title = "Hollywood Sign", Description = "Famous landmark" },
            //    new AttractionTranslation { id = 12, EntityId = 6, Lang = "ru", Title = "Знак Голливуда", Description = "Знаковая достопримечательность" },
            //    new AttractionTranslation { id = 13, EntityId = 7, Lang = "en", Title = "Santa Monica Pier", Description = "Historic pier" },
            //    new AttractionTranslation { id = 14, EntityId = 7, Lang = "ru", Title = "Пирс Санта-Моники", Description = "Исторический пирс" },
            //    new AttractionTranslation { id = 15, EntityId = 8, Lang = "en", Title = "Griffith Observatory", Description = "Observatory with city views" },
            //    new AttractionTranslation { id = 16, EntityId = 8, Lang = "ru", Title = "Обсерватория Гриффита", Description = "Обсерватория с видом на город" },
            //    new AttractionTranslation { id = 17, EntityId = 9, Lang = "en", Title = "Getty Center", Description = "Art museum" },
            //    new AttractionTranslation { id = 18, EntityId = 9, Lang = "ru", Title = "Центр Гетти", Description = "Художественный музей" },
            //    new AttractionTranslation { id = 19, EntityId = 10, Lang = "en", Title = "Venice Beach", Description = "Famous beach area" },
            //    new AttractionTranslation { id = 20, EntityId = 10, Lang = "ru", Title = "Пляж Венеции", Description = "Знаменитый пляж" },

            //    // --- Chicago ---
            //    new AttractionTranslation { id = 21, EntityId = 11, Lang = "en", Title = "Millennium Park", Description = "Public park with art installations" },
            //    new AttractionTranslation { id = 22, EntityId = 11, Lang = "ru", Title = "Парк Тысячелетия", Description = "Общественный парк с арт-объектами" },
            //    new AttractionTranslation { id = 23, EntityId = 12, Lang = "en", Title = "Art Institute of Chicago", Description = "Famous art museum" },
            //    new AttractionTranslation { id = 24, EntityId = 12, Lang = "ru", Title = "Чикагский институт искусств", Description = "Известный художественный музей" },
            //    new AttractionTranslation { id = 25, EntityId = 13, Lang = "en", Title = "Navy Pier", Description = "Pier with attractions and restaurants" },
            //    new AttractionTranslation { id = 26, EntityId = 13, Lang = "ru", Title = "Нэйви-Пир", Description = "Пирс с аттракционами и ресторанами" },
            //    new AttractionTranslation { id = 27, EntityId = 14, Lang = "en", Title = "Willis Tower", Description = "Iconic skyscraper" },
            //    new AttractionTranslation { id = 28, EntityId = 14, Lang = "ru", Title = "Виллис-Тауэр", Description = "Знаковый небоскрёб" },
            //    new AttractionTranslation { id = 29, EntityId = 15, Lang = "en", Title = "Lincoln Park Zoo", Description = "Historic zoo" },
            //    new AttractionTranslation { id = 30, EntityId = 15, Lang = "ru", Title = "Зоопарк Линкольн-Парк", Description = "Исторический зоопарк" },

            //    // --- Germany ---
            //    new AttractionTranslation { id = 31, EntityId = 16, Lang = "en", Title = "Brandenburg Gate", Description = "Historic monument" },
            //    new AttractionTranslation { id = 32, EntityId = 16, Lang = "ru", Title = "Бранденбургские ворота", Description = "Исторический памятник" },
            //    new AttractionTranslation { id = 33, EntityId = 17, Lang = "en", Title = "Berlin Wall Memorial", Description = "Remains of Berlin Wall" },
            //    new AttractionTranslation { id = 34, EntityId = 17, Lang = "ru", Title = "Мемориал Берлинской стены", Description = "Остатки Берлинской стены" },
            //    new AttractionTranslation { id = 35, EntityId = 18, Lang = "en", Title = "Museum Island", Description = "Group of museums" },
            //    new AttractionTranslation { id = 36, EntityId = 18, Lang = "ru", Title = "Остров музеев", Description = "Группа музеев" },
            //    new AttractionTranslation { id = 37, EntityId = 19, Lang = "en", Title = "Alexanderplatz", Description = "Central square" },
            //    new AttractionTranslation { id = 38, EntityId = 19, Lang = "ru", Title = "Александерплац", Description = "Центральная площадь" },
            //    new AttractionTranslation { id = 39, EntityId = 20, Lang = "en", Title = "Checkpoint Charlie", Description = "Historic border crossing" },
            //    new AttractionTranslation { id = 40, EntityId = 20, Lang = "ru", Title = "Чекпойнт Чарли", Description = "Исторический пограничный переход" },

            //    // --- Germany (continued) ---
            //    new AttractionTranslation { id = 41, EntityId = 21, Lang = "en", Title = "Marienplatz", Description = "Central square" },
            //    new AttractionTranslation { id = 42, EntityId = 21, Lang = "ru", Title = "Мариенплац", Description = "Центральная площадь" },
            //    new AttractionTranslation { id = 43, EntityId = 22, Lang = "en", Title = "English Garden", Description = "Large public park" },
            //    new AttractionTranslation { id = 44, EntityId = 22, Lang = "ru", Title = "Английский сад", Description = "Большой городской парк" },
            //    new AttractionTranslation { id = 45, EntityId = 23, Lang = "en", Title = "Nymphenburg Palace", Description = "Historic palace" },
            //    new AttractionTranslation { id = 46, EntityId = 23, Lang = "ru", Title = "Дворец Нимфенбург", Description = "Исторический дворец" },
            //    new AttractionTranslation { id = 47, EntityId = 24, Lang = "en", Title = "BMW Museum", Description = "Automobile museum" },
            //    new AttractionTranslation { id = 48, EntityId = 24, Lang = "ru", Title = "Музей BMW", Description = "Музей автомобилей" },
            //    new AttractionTranslation { id = 49, EntityId = 25, Lang = "en", Title = "Olympiapark", Description = "Sports and entertainment complex" },
            //    new AttractionTranslation { id = 50, EntityId = 25, Lang = "ru", Title = "Олимпийский парк", Description = "Спортивный и развлекательный комплекс" },

            //    new AttractionTranslation { id = 51, EntityId = 26, Lang = "en", Title = "Miniatur Wunderland", Description = "Largest model railway" },
            //    new AttractionTranslation { id = 52, EntityId = 26, Lang = "ru", Title = "Миниатюрная страна чудес", Description = "Самая большая модель железной дороги" },
            //    new AttractionTranslation { id = 53, EntityId = 27, Lang = "en", Title = "Port of Hamburg", Description = "Famous port area" },
            //    new AttractionTranslation { id = 54, EntityId = 27, Lang = "ru", Title = "Гамбургский порт", Description = "Известная портовая зона" },
            //    new AttractionTranslation { id = 55, EntityId = 28, Lang = "en", Title = "Elbphilharmonie", Description = "Concert hall" },
            //    new AttractionTranslation { id = 56, EntityId = 28, Lang = "ru", Title = "Эльбская филармония", Description = "Концертный зал" },
            //    new AttractionTranslation { id = 57, EntityId = 29, Lang = "en", Title = "St. Michael's Church", Description = "Historic church" },
            //    new AttractionTranslation { id = 58, EntityId = 29, Lang = "ru", Title = "Церковь Св. Михаила", Description = "Историческая церковь" },
            //    new AttractionTranslation { id = 59, EntityId = 30, Lang = "en", Title = "Speicherstadt", Description = "Warehouse district" },
            //    new AttractionTranslation { id = 60, EntityId = 30, Lang = "ru", Title = "Спайхерштадт", Description = "Складской район" },

            //// --- France ---
            //    new AttractionTranslation { id = 61, EntityId = 31, Lang = "en", Title = "Eiffel Tower", Description = "Famous tower in Paris" },
            //    new AttractionTranslation { id = 62, EntityId = 31, Lang = "ru", Title = "Эйфелева башня", Description = "Знаменитая башня в Париже" },
            //    new AttractionTranslation { id = 63, EntityId = 32, Lang = "en", Title = "Louvre Museum", Description = "World famous museum" },
            //    new AttractionTranslation { id = 64, EntityId = 32, Lang = "ru", Title = "Лувр", Description = "Мировой известный музей" },
            //    new AttractionTranslation { id = 65, EntityId = 33, Lang = "en", Title = "Notre-Dame Cathedral", Description = "Historic cathedral" },
            //    new AttractionTranslation { id = 66, EntityId = 33, Lang = "ru", Title = "Собор Нотр-Дам", Description = "Исторический собор" },
            //    new AttractionTranslation { id = 67, EntityId = 34, Lang = "en", Title = "Montmartre", Description = "Historic district" },
            //    new AttractionTranslation { id = 68, EntityId = 34, Lang = "ru", Title = "Монмартр", Description = "Исторический район" },
            //    new AttractionTranslation { id = 69, EntityId = 35, Lang = "en", Title = "Champs-Élysées", Description = "Famous avenue" },
            //    new AttractionTranslation { id = 70, EntityId = 35, Lang = "ru", Title = "Елисейские поля", Description = "Знаменитая улица" },

            //    new AttractionTranslation { id = 71, EntityId = 36, Lang = "en", Title = "Basilica of Notre-Dame de Fourvière", Description = "Historic church" },
            //    new AttractionTranslation { id = 72, EntityId = 36, Lang = "ru", Title = "Базилика Нотр-Дам-де-Фурвьер", Description = "Историческая церковь" },
            //    new AttractionTranslation { id = 73, EntityId = 37, Lang = "en", Title = "Parc de la Tête d'Or", Description = "Large urban park" },
            //    new AttractionTranslation { id = 74, EntityId = 37, Lang = "ru", Title = "Парк Тет-д'Ор", Description = "Большой городской парк" },
            //    new AttractionTranslation { id = 75, EntityId = 38, Lang = "en", Title = "Vieux Lyon", Description = "Historic district" },
            //    new AttractionTranslation { id = 76, EntityId = 38, Lang = "ru", Title = "Старый Лион", Description = "Исторический район" },
            //    new AttractionTranslation { id = 77, EntityId = 39, Lang = "en", Title = "Musée des Beaux-Arts", Description = "Art museum" },
            //    new AttractionTranslation { id = 78, EntityId = 39, Lang = "ru", Title = "Музей изящных искусств", Description = "Художественный музей" },
            //    new AttractionTranslation { id = 79, EntityId = 40, Lang = "en", Title = "Place Bellecour", Description = "City square" },
            //    new AttractionTranslation { id = 80, EntityId = 40, Lang = "ru", Title = "Площадь Белькур", Description = "Городская площадь" },

            //    // --- France / Marseille ---
            //    new AttractionTranslation { id = 81, EntityId = 41, Lang = "en", Title = "Old Port of Marseille", Description = "Historic harbor area" },
            //    new AttractionTranslation { id = 82, EntityId = 41, Lang = "ru", Title = "Старый порт Марселя", Description = "Историческая портовая зона" },
            //    new AttractionTranslation { id = 83, EntityId = 42, Lang = "en", Title = "Basilique Notre-Dame de la Garde", Description = "Historic basilica" },
            //    new AttractionTranslation { id = 84, EntityId = 42, Lang = "ru", Title = "Базилика Нотр-Дам-де-ла-Гард", Description = "Историческая базилика" },
            //    new AttractionTranslation { id = 85, EntityId = 43, Lang = "en", Title = "Château d'If", Description = "Island fortress" },
            //    new AttractionTranslation { id = 86, EntityId = 43, Lang = "ru", Title = "Замок Иф", Description = "Островная крепость" },
            //    new AttractionTranslation { id = 87, EntityId = 44, Lang = "en", Title = "La Canebière", Description = "Historic street" },
            //    new AttractionTranslation { id = 88, EntityId = 44, Lang = "ru", Title = "Ля Канебиер", Description = "Историческая улица" },
            //    new AttractionTranslation { id = 89, EntityId = 45, Lang = "en", Title = "Palais Longchamp", Description = "Fountain and palace" },
            //    new AttractionTranslation { id = 90, EntityId = 45, Lang = "ru", Title = "Пале Лоншан", Description = "Фонтан и дворец" },

            //    // EntityId 46–50 (London)
            //    new AttractionTranslation { id = 91, EntityId = 46, Lang = "en", Title = "Tower of London", Description = "Historic castle and former prison" },
            //    new AttractionTranslation { id = 92, EntityId = 46, Lang = "ru", Title = "Тауэр", Description = "Исторический замок и бывшая тюрьма" },
            //    new AttractionTranslation { id = 93, EntityId = 47, Lang = "en", Title = "Buckingham Palace", Description = "Royal residence" },
            //    new AttractionTranslation { id = 94, EntityId = 47, Lang = "ru", Title = "Букингемский дворец", Description = "Королевская резиденция" },
            //    new AttractionTranslation { id = 95, EntityId = 48, Lang = "en", Title = "London Eye", Description = "Giant Ferris wheel" },
            //    new AttractionTranslation { id = 96, EntityId = 48, Lang = "ru", Title = "Лондонский глаз", Description = "Огромное колесо обозрения" },
            //    new AttractionTranslation { id = 97, EntityId = 49, Lang = "en", Title = "British Museum", Description = "World-famous museum" },
            //    new AttractionTranslation { id = 98, EntityId = 49, Lang = "ru", Title = "Британский музей", Description = "Знаменитый музей мира" },
            //    new AttractionTranslation { id = 99, EntityId = 50, Lang = "en", Title = "St. Paul's Cathedral", Description = "Famous cathedral" },
            //    new AttractionTranslation { id = 100, EntityId = 50, Lang = "ru", Title = "Собор Святого Павла", Description = "Знаменитый собор" },

            //    // EntityId 51–55 (Manchester)
            //    new AttractionTranslation { id = 101, EntityId = 51, Lang = "en", Title = "Old Trafford", Description = "Football stadium" },
            //    new AttractionTranslation { id = 102, EntityId = 51, Lang = "ru", Title = "Олд Траффорд", Description = "Футбольный стадион" },
            //    new AttractionTranslation { id = 103, EntityId = 52, Lang = "en", Title = "Manchester Cathedral", Description = "Historic cathedral" },
            //    new AttractionTranslation { id = 104, EntityId = 52, Lang = "ru", Title = "Манчестерский собор", Description = "Исторический собор" },
            //    new AttractionTranslation { id = 105, EntityId = 53, Lang = "en", Title = "John Rylands Library", Description = "Historic library" },
            //    new AttractionTranslation { id = 106, EntityId = 53, Lang = "ru", Title = "Библиотека Джона Райлэндса", Description = "Историческая библиотека" },
            //    new AttractionTranslation { id = 107, EntityId = 54, Lang = "en", Title = "Science and Industry Museum", Description = "Museum of science" },
            //    new AttractionTranslation { id = 108, EntityId = 54, Lang = "ru", Title = "Музей науки и промышленности", Description = "Музей науки" },
            //    new AttractionTranslation { id = 109, EntityId = 55, Lang = "en", Title = "Castlefield", Description = "Historic area with canals" },
            //    new AttractionTranslation { id = 110, EntityId = 55, Lang = "ru", Title = "Каслфилд", Description = "Исторический район с каналами" },

            //    // EntityId 56–60 (Birmingham)
            //    new AttractionTranslation { id = 111, EntityId = 56, Lang = "en", Title = "Birmingham Museum & Art Gallery", Description = "Art museum" },
            //    new AttractionTranslation { id = 112, EntityId = 56, Lang = "ru", Title = "Музей и художественная галерея Бирмингема", Description = "Художественный музей" },
            //    new AttractionTranslation { id = 113, EntityId = 57, Lang = "en", Title = "Cadbury World", Description = "Chocolate-themed attraction" },
            //    new AttractionTranslation { id = 114, EntityId = 57, Lang = "ru", Title = "Кэдбери Уорлд", Description = "Аттракцион о шоколаде" },
            //    new AttractionTranslation { id = 115, EntityId = 58, Lang = "en", Title = "Birmingham Botanical Gardens", Description = "Botanical gardens" },
            //    new AttractionTranslation { id = 116, EntityId = 58, Lang = "ru", Title = "Ботанические сады Бирмингема", Description = "Ботанические сады" },
            //    new AttractionTranslation { id = 117, EntityId = 59, Lang = "en", Title = "Thinktank Birmingham Science Museum", Description = "Science museum" },
            //    new AttractionTranslation { id = 118, EntityId = 59, Lang = "ru", Title = "Научный музей Тинктанк", Description = "Научный музей" },
            //    new AttractionTranslation { id = 119, EntityId = 60, Lang = "en", Title = "Jewellery Quarter", Description = "Historic jewelry district" },
            //    new AttractionTranslation { id = 120, EntityId = 60, Lang = "ru", Title = "Ювелирный квартал", Description = "Исторический ювелирный район" },

            //    // EntityId 61–65 (Madrid)
            //    new AttractionTranslation { id = 121, EntityId = 61, Lang = "en", Title = "Royal Palace of Madrid", Description = "Official residence of the Spanish royal family" },
            //    new AttractionTranslation { id = 122, EntityId = 61, Lang = "ru", Title = "Королевский дворец Мадрида", Description = "Официальная резиденция испанской королевской семьи" },
            //    new AttractionTranslation { id = 123, EntityId = 62, Lang = "en", Title = "Plaza Mayor", Description = "Historic city square" },
            //    new AttractionTranslation { id = 124, EntityId = 62, Lang = "ru", Title = "Пласа-Майор", Description = "Историческая городская площадь" },
            //    new AttractionTranslation { id = 125, EntityId = 63, Lang = "en", Title = "Puerta del Sol", Description = "Famous city square" },
            //    new AttractionTranslation { id = 126, EntityId = 63, Lang = "ru", Title = "Пуэрта-дель-Соль", Description = "Знаменитая городская площадь" },
            //    new AttractionTranslation { id = 127, EntityId = 64, Lang = "en", Title = "Retiro Park", Description = "Large public park" },
            //    new AttractionTranslation { id = 128, EntityId = 64, Lang = "ru", Title = "Парк Ретиро", Description = "Большой общественный парк" },
            //    new AttractionTranslation { id = 129, EntityId = 65, Lang = "en", Title = "Temple of Debod", Description = "Ancient Egyptian temple" },
            //    new AttractionTranslation { id = 130, EntityId = 65, Lang = "ru", Title = "Храм Дебод", Description = "Древний египетский храм" },

            //    // EntityId 66–70 (Barcelona)
            //    new AttractionTranslation { id = 131, EntityId = 66, Lang = "en", Title = "Sagrada Familia", Description = "Famous basilica by Gaudi" },
            //    new AttractionTranslation { id = 132, EntityId = 66, Lang = "ru", Title = "Саграда Фамилия", Description = "Знаменитая базилика Гауди" },
            //    new AttractionTranslation { id = 133, EntityId = 67, Lang = "en", Title = "Park Güell", Description = "Public park with Gaudi architecture" },
            //    new AttractionTranslation { id = 134, EntityId = 67, Lang = "ru", Title = "Парк Гуэль", Description = "Общественный парк с архитектурой Гауди" },
            //    new AttractionTranslation { id = 135, EntityId = 68, Lang = "en", Title = "Casa Batlló", Description = "Modernist building by Gaudi" },
            //    new AttractionTranslation { id = 136, EntityId = 68, Lang = "ru", Title = "Каса Бальо", Description = "Модернистское здание Гауди" },
            //    new AttractionTranslation { id = 137, EntityId = 69, Lang = "en", Title = "La Rambla", Description = "Famous street" },
            //    new AttractionTranslation { id = 138, EntityId = 69, Lang = "ru", Title = "Ла Рамбла", Description = "Знаменитая улица" },
            //    new AttractionTranslation { id = 139, EntityId = 70, Lang = "en", Title = "Gothic Quarter", Description = "Historic city center" },
            //    new AttractionTranslation { id = 140, EntityId = 70, Lang = "ru", Title = "Готический квартал", Description = "Исторический центр города" },

            //    // EntityId 71–75 (Valencia)
            //    new AttractionTranslation { id = 141, EntityId = 71, Lang = "en", Title = "City of Arts and Sciences", Description = "Modern architectural complex" },
            //    new AttractionTranslation { id = 142, EntityId = 71, Lang = "ru", Title = "Город искусств и наук", Description = "Современный архитектурный комплекс" },
            //    new AttractionTranslation { id = 143, EntityId = 72, Lang = "en", Title = "Valencia Cathedral", Description = "Historic cathedral" },
            //    new AttractionTranslation { id = 144, EntityId = 72, Lang = "ru", Title = "Собор Валенсии", Description = "Исторический собор" },
            //    new AttractionTranslation { id = 145, EntityId = 73, Lang = "en", Title = "Central Market", Description = "Historic market hall" },
            //    new AttractionTranslation { id = 146, EntityId = 73, Lang = "ru", Title = "Центральный рынок", Description = "Исторический рынок" },
            //    new AttractionTranslation { id = 147, EntityId = 74, Lang = "en", Title = "Turia Gardens", Description = "Public gardens in former riverbed" },
            //    new AttractionTranslation { id = 148, EntityId = 74, Lang = "ru", Title = "Сады Турия", Description = "Общественные сады на месте бывшего русла реки" },
            //    new AttractionTranslation { id = 149, EntityId = 75, Lang = "en", Title = "Silk Exchange", Description = "Historic building" },
            //    new AttractionTranslation { id = 150, EntityId = 75, Lang = "ru", Title = "Биржа шелка", Description = "Историческое здание" },

            //    // EntityId 76–80 (Warsaw)
            //    new AttractionTranslation { id = 151, EntityId = 76, Lang = "en", Title = "Old Town Warsaw", Description = "Historic city center" },
            //    new AttractionTranslation { id = 152, EntityId = 76, Lang = "ru", Title = "Старый город Варшавы", Description = "Исторический центр города" },
            //    new AttractionTranslation { id = 153, EntityId = 77, Lang = "en", Title = "Royal Castle", Description = "Historic royal residence" },
            //    new AttractionTranslation { id = 154, EntityId = 77, Lang = "ru", Title = "Королевский замок", Description = "Историческая королевская резиденция" },
            //    new AttractionTranslation { id = 155, EntityId = 78, Lang = "en", Title = "Palace of Culture and Science", Description = "Tall historic building" },
            //    new AttractionTranslation { id = 156, EntityId = 78, Lang = "ru", Title = "Дворец культуры и науки", Description = "Высокое историческое здание" },
            //    new AttractionTranslation { id = 157, EntityId = 79, Lang = "en", Title = "Łazienki Park", Description = "Large city park" },
            //    new AttractionTranslation { id = 158, EntityId = 79, Lang = "ru", Title = "Лазенки", Description = "Большой городской парк" },
            //    new AttractionTranslation { id = 159, EntityId = 80, Lang = "en", Title = "Warsaw Uprising Museum", Description = "Museum dedicated to WWII uprising" },
            //    new AttractionTranslation { id = 160, EntityId = 80, Lang = "ru", Title = "Музей Варшавского восстания", Description = "Музей, посвященный восстанию во Второй мировой" },

            //    // EntityId 81–85 (Krakow)
            //    new AttractionTranslation { id = 161, EntityId = 81, Lang = "en", Title = "Wawel Castle", Description = "Historic royal castle" },
            //    new AttractionTranslation { id = 162, EntityId = 81, Lang = "ru", Title = "Вавельский замок", Description = "Исторический королевский замок" },
            //    new AttractionTranslation { id = 163, EntityId = 82, Lang = "en", Title = "Main Market Square", Description = "Central city square" },
            //    new AttractionTranslation { id = 164, EntityId = 82, Lang = "ru", Title = "Главная рыночная площадь", Description = "Центральная площадь города" },
            //    new AttractionTranslation { id = 165, EntityId = 83, Lang = "en", Title = "St. Mary's Basilica", Description = "Famous historic church" },
            //    new AttractionTranslation { id = 166, EntityId = 83, Lang = "ru", Title = "Базилика Святой Марии", Description = "Знаменитая историческая церковь" },
            //    new AttractionTranslation { id = 167, EntityId = 84, Lang = "en", Title = "Kazimierz District", Description = "Historic Jewish quarter" },
            //    new AttractionTranslation { id = 168, EntityId = 84, Lang = "ru", Title = "Казимеж", Description = "Исторический еврейский квартал" },
            //    new AttractionTranslation { id = 169, EntityId = 85, Lang = "en", Title = "Schindler's Factory", Description = "Museum in former factory" },
            //    new AttractionTranslation { id = 170, EntityId = 85, Lang = "ru", Title = "Фабрика Шиндлера", Description = "Музей в бывшей фабрике" },

            //    // EntityId 86–90 (Gdansk)
            //    new AttractionTranslation { id = 171, EntityId = 86, Lang = "en", Title = "Old Town Gdansk", Description = "Historic city center" },
            //    new AttractionTranslation { id = 172, EntityId = 86, Lang = "ru", Title = "Старый город Гданьска", Description = "Исторический центр города" },
            //    new AttractionTranslation { id = 173, EntityId = 87, Lang = "en", Title = "St. Mary's Church", Description = "Large historic church" },
            //    new AttractionTranslation { id = 174, EntityId = 87, Lang = "ru", Title = "Базилика Святой Марии", Description = "Большая историческая церковь" },
            //    new AttractionTranslation { id = 175, EntityId = 88, Lang = "en", Title = "Neptune Fountain", Description = "Famous city fountain" },
            //    new AttractionTranslation { id = 176, EntityId = 88, Lang = "ru", Title = "Фонтан Нептуна", Description = "Знаменитый городской фонтан" },
            //    new AttractionTranslation { id = 177, EntityId = 89, Lang = "en", Title = "Long Market", Description = "Historic market street" },
            //    new AttractionTranslation { id = 178, EntityId = 89, Lang = "ru", Title = "Длинный рынок", Description = "Историческая торговая улица" },
            //    new AttractionTranslation { id = 179, EntityId = 90, Lang = "en", Title = "European Solidarity Centre", Description = "Museum and cultural center" },
            //    new AttractionTranslation { id = 180, EntityId = 90, Lang = "ru", Title = "Центр европейской солидарности", Description = "Музей и культурный центр" },

            //    // EntityId 91–95
            //    new AttractionTranslation { id = 181, EntityId = 91, Lang = "en", Title = "Old Market Square", Description = "Central square of Poznan" },
            //    new AttractionTranslation { id = 182, EntityId = 91, Lang = "ru", Title = "Старая рыночная площадь", Description = "Центральная площадь Познани" },
            //    new AttractionTranslation { id = 183, EntityId = 92, Lang = "en", Title = "Poznan Town Hall", Description = "Historic town hall" },
            //    new AttractionTranslation { id = 184, EntityId = 92, Lang = "ru", Title = "Ратуша Познани", Description = "Историческая ратуша" },
            //    new AttractionTranslation { id = 185, EntityId = 93, Lang = "en", Title = "St. Peter and Paul Cathedral", Description = "Historic cathedral" },
            //    new AttractionTranslation { id = 186, EntityId = 93, Lang = "ru", Title = "Кафедральный собор Святых Петра и Павла", Description = "Исторический собор" },
            //    new AttractionTranslation { id = 187, EntityId = 94, Lang = "en", Title = "Imperial Castle", Description = "Historic castle" },
            //    new AttractionTranslation { id = 188, EntityId = 94, Lang = "ru", Title = "Императорский замок", Description = "Исторический замок" },
            //    new AttractionTranslation { id = 189, EntityId = 95, Lang = "en", Title = "Citadel Park", Description = "Public park with monuments" },
            //    new AttractionTranslation { id = 190, EntityId = 95, Lang = "ru", Title = "Парк Цитадель", Description = "Общественный парк с памятниками" }

           //  );


            // Сиды категорий с переводами
            modelBuilder.Entity<ParamsCategoryTranslation>().HasData(
                new ParamsCategoryTranslation { id = 1, EntityId = 1, Lang = "en", Title = "Type of accommodation" },
                new ParamsCategoryTranslation { id = 2, EntityId = 1, Lang = "uk", Title = "Тип розміщення" },

                new ParamsCategoryTranslation { id = 3, EntityId = 2, Lang = "en", Title = "Prices" },
                new ParamsCategoryTranslation { id = 4, EntityId = 2, Lang = "uk", Title = "Ціни" },

                new ParamsCategoryTranslation { id = 5, EntityId = 3, Lang = "en", Title = "Amenities" },
                new ParamsCategoryTranslation { id = 6, EntityId = 3, Lang = "uk", Title = "Зручності" },

                new ParamsCategoryTranslation { id = 7, EntityId = 4, Lang = "en", Title = "Housing with" },
                new ParamsCategoryTranslation { id = 8, EntityId = 4, Lang = "uk", Title = "Житло з" },

                new ParamsCategoryTranslation { id = 9, EntityId = 5, Lang = "en", Title = "Object evaluation" },
                new ParamsCategoryTranslation { id = 10, EntityId = 5, Lang = "uk", Title = "Оцінка об'єкту" },

                new ParamsCategoryTranslation { id = 11, EntityId = 6, Lang = "en", Title = "Distance from the center" },
                new ParamsCategoryTranslation { id = 12, EntityId = 6, Lang = "uk", Title = "Відстань від центра" },

                new ParamsCategoryTranslation { id = 13, EntityId = 7, Lang = "en", Title = "Booking rules" },
                new ParamsCategoryTranslation { id = 14, EntityId = 7, Lang = "uk", Title = "Правила бронювання" },

                new ParamsCategoryTranslation { id = 15, EntityId = 8, Lang = "en", Title = "Area" },
                new ParamsCategoryTranslation { id = 16, EntityId = 8, Lang = "uk", Title = "Район" },

                new ParamsCategoryTranslation { id = 17, EntityId = 9, Lang = "en", Title = "Amenities and Services" },
                new ParamsCategoryTranslation { id = 18, EntityId = 9, Lang = "uk", Title = "Зручності та послуги" },

                new ParamsCategoryTranslation { id = 19, EntityId = 10, Lang = "en", Title = "View" },
                new ParamsCategoryTranslation { id = 20, EntityId = 10, Lang = "uk", Title = "Вид на" },

                new ParamsCategoryTranslation { id = 21, EntityId = 11, Lang = "en", Title = "Private Bathroom" },
                new ParamsCategoryTranslation { id = 22, EntityId = 11, Lang = "uk", Title = "Власна ванна кімната" }

            );


            // Сиды параметров с переводами
            modelBuilder.Entity<ParamItemTranslation>().HasData(
               // Тип розміщення / Type of accommodation
                new ParamItemTranslation { id = 1, EntityId = 1, Lang = "en", Title = "Hotel" },
                new ParamItemTranslation { id = 2, EntityId = 1, Lang = "uk", Title = "Готель" },

                new ParamItemTranslation { id = 3, EntityId = 2, Lang = "en", Title = "Hostel" },
                new ParamItemTranslation { id = 4, EntityId = 2, Lang = "uk", Title = "Хостел" },

                new ParamItemTranslation { id = 5, EntityId = 3, Lang = "en", Title = "Studio" },
                new ParamItemTranslation { id = 6, EntityId = 3, Lang = "uk", Title = "Студія" },

                new ParamItemTranslation { id = 7, EntityId = 4, Lang = "en", Title = "Apartment / Flat" },
                new ParamItemTranslation { id = 8, EntityId = 4, Lang = "uk", Title = "Апартаменти / Квартира" },

                new ParamItemTranslation { id = 9, EntityId = 5, Lang = "en", Title = "Private house" },
                new ParamItemTranslation { id = 10, EntityId = 5, Lang = "uk", Title = "Приватний будинок" },

                new ParamItemTranslation { id = 11, EntityId = 6, Lang = "en", Title = "Room" },
                new ParamItemTranslation { id = 12, EntityId = 6, Lang = "uk", Title = "Кімната" },


                    // Зручності / Amenities
                new ParamItemTranslation { id = 15, EntityId = 8, Lang = "en", Title = "Wi-Fi" },
                new ParamItemTranslation { id = 16, EntityId = 8, Lang = "uk", Title = "Wi-Fi" },

                new ParamItemTranslation { id = 17, EntityId = 9, Lang = "en", Title = "Air conditioning" },
                new ParamItemTranslation { id = 18, EntityId = 9, Lang = "uk", Title = "Кондиціонер" },

                new ParamItemTranslation { id = 19, EntityId = 10, Lang = "en", Title = "TV" },
                new ParamItemTranslation { id = 20, EntityId = 10, Lang = "uk", Title = "Телевізор" },

                new ParamItemTranslation { id = 21, EntityId = 11, Lang = "en", Title = "Work desk" },
                new ParamItemTranslation { id = 22, EntityId = 11, Lang = "uk", Title = "Робочий стіл" },

                new ParamItemTranslation { id = 23, EntityId = 12, Lang = "en", Title = "Pets allowed" },
                new ParamItemTranslation { id = 24, EntityId = 12, Lang = "uk", Title = "Можна з тваринами" },

                new ParamItemTranslation { id = 25, EntityId = 13, Lang = "en", Title = "Free parking" },
                new ParamItemTranslation { id = 26, EntityId = 13, Lang = "uk", Title = "Безкоштовна парковка" },

                new ParamItemTranslation { id = 27, EntityId = 14, Lang = "en", Title = "Washing machine" },
                new ParamItemTranslation { id = 28, EntityId = 14, Lang = "uk", Title = "Пральна машина" },

                new ParamItemTranslation { id = 29, EntityId = 15, Lang = "en", Title = "Iron" },
                new ParamItemTranslation { id = 30, EntityId = 15, Lang = "uk", Title = "Праска" },

                new ParamItemTranslation { id = 31, EntityId = 16, Lang = "en", Title = "Electric kettle" },
                new ParamItemTranslation { id = 32, EntityId = 16, Lang = "uk", Title = "Електричний чайник" },


              //Житло з/Housing with
                new ParamItemTranslation { id = 33, EntityId = 17, Lang = "en", Title = "Balcony" },
                new ParamItemTranslation { id = 34, EntityId = 17, Lang = "uk", Title = "Балкон" },

                new ParamItemTranslation { id = 35, EntityId = 18, Lang = "en", Title = "Terrace" },
                new ParamItemTranslation { id = 36, EntityId = 18, Lang = "uk", Title = "Тераса" },

                new ParamItemTranslation { id = 37, EntityId = 19, Lang = "en", Title = "Kitchen" },
                new ParamItemTranslation { id = 38, EntityId = 19, Lang = "uk", Title = "Кухня" },

                new ParamItemTranslation { id = 39, EntityId = 20, Lang = "en", Title = "Single bed" },
                new ParamItemTranslation { id = 40, EntityId = 20, Lang = "uk", Title = "Односпальне" },

                new ParamItemTranslation { id = 41, EntityId = 21, Lang = "en", Title = "Double bed" },
                new ParamItemTranslation { id = 42, EntityId = 21, Lang = "uk", Title = "Двоспальне" },



                // "Оцінка об'єкту / Object evaluation

                new ParamItemTranslation { id = 43, EntityId = 22, Lang = "en", Title = "Pretty good 5+" },
                new ParamItemTranslation { id = 44, EntityId = 22, Lang = "uk", Title = "Досить чудово 5+" },

                new ParamItemTranslation { id = 45, EntityId = 23, Lang = "en", Title = "Good 7+" },
                new ParamItemTranslation { id = 46, EntityId = 23, Lang = "uk", Title = "Добре 7+" },

                new ParamItemTranslation { id = 47, EntityId = 24, Lang = "en", Title = "Excellent 9+" },
                new ParamItemTranslation { id = 48, EntityId = 24, Lang = "uk", Title = "Чудово 9+" },

                new ParamItemTranslation { id = 49, EntityId = 25, Lang = "en", Title = "Very good 8+" },
                new ParamItemTranslation { id = 50, EntityId = 25, Lang = "uk", Title = "Дуже добре 8+" },


                // Відстань від центра / Distance from center

                new ParamItemTranslation { id = 51, EntityId = 26, Lang = "en", Title = "Less than 1 km" },
                new ParamItemTranslation { id = 52, EntityId = 26, Lang = "uk", Title = "Менше 1 км" },

                new ParamItemTranslation { id = 53, EntityId = 27, Lang = "en", Title = "Less than 3 km" },
                new ParamItemTranslation { id = 54, EntityId = 27, Lang = "uk", Title = "Менше 3 км" },

                new ParamItemTranslation { id = 55, EntityId = 28, Lang = "en", Title = "Less than 5 km" },
                new ParamItemTranslation { id = 56, EntityId = 28, Lang = "uk", Title = "Менше 5 км" },


                //Правила бронювання / Booking rules

                new ParamItemTranslation { id = 57, EntityId = 29, Lang = "en", Title = "Free cancellation" },
                new ParamItemTranslation { id = 58, EntityId = 29, Lang = "uk", Title = "Безкоштовне скасування" },

                new ParamItemTranslation { id = 59, EntityId = 30, Lang = "en", Title = "Pay now" },
                new ParamItemTranslation { id = 60, EntityId = 30, Lang = "uk", Title = "Оплата зараз" },

                new ParamItemTranslation { id = 61, EntityId = 31, Lang = "en", Title = "Pay at the property before arrival" },
                new ParamItemTranslation { id = 62, EntityId = 31, Lang = "uk", Title = "Оплата помешканню перед приїздом" },

                new ParamItemTranslation { id = 63, EntityId = 32, Lang = "en", Title = "Pay on site" },
                new ParamItemTranslation { id = 64, EntityId = 32, Lang = "uk", Title = "Оплата на місці" },


                //Район / Area

                // Ціни / Prices
                new ParamItemTranslation { id = 65, EntityId = 33, Lang = "en", Title = "From" },
                new ParamItemTranslation { id = 66, EntityId = 33, Lang = "uk", Title = "Від" },

                new ParamItemTranslation { id = 67, EntityId = 34, Lang = "en", Title = "To" },
                new ParamItemTranslation { id = 68, EntityId = 34, Lang = "uk", Title = "До" },


               // зручності та послуги

                new ParamItemTranslation { id = 69, EntityId = 35, Lang = "en", Title = "Wooden or parquet floor" },
                new ParamItemTranslation { id = 70, EntityId = 35, Lang = "uk", Title = "Дерев'яна або паркетна підлога" },

                new ParamItemTranslation { id = 71, EntityId = 36, Lang = "en", Title = "Bed linen" },
                new ParamItemTranslation { id = 72, EntityId = 36, Lang = "uk", Title = "Білизна" },

                new ParamItemTranslation { id = 73, EntityId = 37, Lang = "en", Title = "Socket near the bed" },
                new ParamItemTranslation { id = 74, EntityId = 37, Lang = "uk", Title = "Розетка біля ліжка" },

                new ParamItemTranslation { id = 75, EntityId = 38, Lang = "en", Title = "Desk" },
                new ParamItemTranslation { id = 76, EntityId = 38, Lang = "uk", Title = "Робочий стіл" },

                new ParamItemTranslation { id = 77, EntityId = 39, Lang = "en", Title = "Television" },
                new ParamItemTranslation { id = 78, EntityId = 39, Lang = "uk", Title = "Телевізор" },

                new ParamItemTranslation { id = 79, EntityId = 40, Lang = "en", Title = "Ironing equipment" },
                new ParamItemTranslation { id = 80, EntityId = 40, Lang = "uk", Title = "Праcувальне приладдя" },

                new ParamItemTranslation { id = 81, EntityId = 41, Lang = "en", Title = "Coffee maker / kettle" },
                new ParamItemTranslation { id = 82, EntityId = 41, Lang = "uk", Title = "Кавоварка/чайник" },

                new ParamItemTranslation { id = 83, EntityId = 42, Lang = "en", Title = "Iron" },
                new ParamItemTranslation { id = 84, EntityId = 42, Lang = "uk", Title = "Праска" },

                new ParamItemTranslation { id = 85, EntityId = 43, Lang = "en", Title = "Heating" },
                new ParamItemTranslation { id = 86, EntityId = 43, Lang = "uk", Title = "Опалення" },

                new ParamItemTranslation { id = 87, EntityId = 44, Lang = "en", Title = "Television with flat screen" },
                new ParamItemTranslation { id = 88, EntityId = 44, Lang = "uk", Title = "Телевізор із плоским екраном" },

                new ParamItemTranslation { id = 89, EntityId = 45, Lang = "en", Title = "Electric kettle" },
                new ParamItemTranslation { id = 90, EntityId = 45, Lang = "uk", Title = "Електричний чайник" },

                new ParamItemTranslation { id = 91, EntityId = 46, Lang = "en", Title = "Cable channels" },
                new ParamItemTranslation { id = 92, EntityId = 46, Lang = "uk", Title = "Кабельні канали" },

                new ParamItemTranslation { id = 93, EntityId = 47, Lang = "en", Title = "Wardrobe or closet" },
                new ParamItemTranslation { id = 94, EntityId = 47, Lang = "uk", Title = "Шафа або гардероб" },

                new ParamItemTranslation { id = 95, EntityId = 48, Lang = "en", Title = "Stairs for access to upper floors" },
                new ParamItemTranslation { id = 96, EntityId = 48, Lang = "uk", Title = "Сходи для доступу до верхніх поверхів" },

                new ParamItemTranslation { id = 97, EntityId = 49, Lang = "en", Title = "Clothes hanger" },
                new ParamItemTranslation { id = 98, EntityId = 49, Lang = "uk", Title = "Вішалка для одягу" },

                // вид на
                new ParamItemTranslation { id = 99, EntityId = 50, Lang = "en", Title = "View of landmarks" },
                new ParamItemTranslation { id = 100, EntityId = 50, Lang = "uk", Title = "Вид на визначні пам'ятки" },

                new ParamItemTranslation { id = 101, EntityId = 51, Lang = "en", Title = "City view" },
                new ParamItemTranslation { id = 102, EntityId = 51, Lang = "uk", Title = "Вид на місто" },

               // власна ванна кімната
                new ParamItemTranslation { id = 103, EntityId = 52, Lang = "en", Title = "Toilet" },
                new ParamItemTranslation { id = 104, EntityId = 52, Lang = "uk", Title = "Туалет" },

                new ParamItemTranslation { id = 105, EntityId = 53, Lang = "en", Title = "Bathtub or shower" },
                new ParamItemTranslation { id = 106, EntityId = 53, Lang = "uk", Title = "Ванна чи душ" },

                new ParamItemTranslation { id = 107, EntityId = 54, Lang = "en", Title = "Towels" },
                new ParamItemTranslation { id = 108, EntityId = 54, Lang = "uk", Title = "Рушники" },

                new ParamItemTranslation { id = 109, EntityId = 55, Lang = "en", Title = "Hairdryer" },
                new ParamItemTranslation { id = 110, EntityId = 55, Lang = "uk", Title = "Фен" },

                new ParamItemTranslation { id = 111, EntityId = 56, Lang = "en", Title = "Toilet paper" },
                new ParamItemTranslation { id = 112, EntityId = 56, Lang = "uk", Title = "Папір туалетний" }

            );


        }
    }
}
