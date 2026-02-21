import lvivImage from '@/assets/images/popular/lviv.png';
import kyivImage from '@/assets/images/popular/kyiv.png';
import odessaImage from '@/assets/images/popular/odessa.png';
import yaremcheImage from '@/assets/images/popular/yaremche.png';
import uzhgorodImage from '@/assets/images/popular/uzhgorod.png';
import chernivtsiImage from '@/assets/images/popular/chernivtsi.png';
import ifImage from '@/assets/images/popular/if.png';
import kpImage from '@/assets/images/popular/kp.png';
import lutskImage from '@/assets/images/popular/lutsk.png';
import bukovelImage from '@/assets/images/popular/bukovel.png';
import museumImage from '@/assets/images/museum.png';

export type CityGuide = {
  cityId: string;
  cityName: string;
  latitude: number;
  longitude: number;
  heroImage: any;
  bottomImage: any;
  historyTitle: string;
  historyText: string;
  cultureTitle: string;
  cultureText: string;
  aliases: string[];
};

type GuideResolverInput = {
  cityId?: string;
  cityName?: string;
};

const HISTORY_TITLE = 'Трохи історії';
const CULTURE_TITLE = 'Архітектурне та культурне надбання';

const DEFAULT_GUIDE: CityGuide = {
  cityId: 'default',
  cityName: 'Львів',
  latitude: 49.8397,
  longitude: 24.0297,
  heroImage: lvivImage,
  bottomImage: museumImage,
  historyTitle: HISTORY_TITLE,
  historyText:
    'Місто має багату історію, формувалося століттями та поєднує різні культурні традиції.',
  cultureTitle: CULTURE_TITLE,
  cultureText:
    'У місті зосереджені визначні пам’ятки, музеї та локації, які варто відвідати під час подорожі.',
  aliases: ['львів', 'львов', 'lviv'],
};

export const CITY_GUIDES_LOCAL: CityGuide[] = [
  {
    cityId: '13',
    cityName: 'Львів',
    latitude: 49.8397,
    longitude: 24.0297,
    heroImage: lvivImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Львів — історичне місто з архітектурою різних епох, центр торгівлі та культури Західної України.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Історичний центр Львова внесено до списку Світової спадщини ЮНЕСКО; місто відоме музеями, театрами та кавовою культурою.',
    aliases: ['львів', 'львов', 'lviv'],
  },
  {
    cityId: '1',
    cityName: 'Київ',
    latitude: 50.4501,
    longitude: 30.5234,
    heroImage: kyivImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Київ — одне з найдавніших міст Східної Європи, важливий політичний та культурний центр.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Місто поєднує історичні памʼятки, сучасні простори, набережні Дніпра та велику кількість музеїв.',
    aliases: ['київ', 'киев', 'kyiv', 'kiev'],
  },
  {
    cityId: '54',
    cityName: 'Одеса',
    latitude: 46.4825,
    longitude: 30.7233,
    heroImage: odessaImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Одеса сформувалася як портове місто з багатонаціональною історією та унікальним південним колоритом.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Місто відоме Приморським бульваром, театром опери, морським узбережжям і різноманітною гастрономією.',
    aliases: ['одеса', 'одесса', 'odesa', 'odessa'],
  },
  {
    cityId: '43',
    cityName: 'Яремче',
    latitude: 48.4486,
    longitude: 24.5564,
    heroImage: yaremcheImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Яремче — карпатський курорт із природними ландшафтами, гірськими маршрутами та традиційною гуцульською культурою.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Популярні локації: водоспад Пробій, сувенірні ринки, оглядові майданчики та пішохідні екомаршрути.',
    aliases: ['яремче', 'yaremche'],
  },
  {
    cityId: '31',
    cityName: 'Ужгород',
    latitude: 48.6208,
    longitude: 22.2879,
    heroImage: uzhgorodImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Ужгород — найзахідніше обласне місто України з багатою історією прикордонного регіону.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Відомий Ужгородським замком, сакуровими алеями, старовинними кварталами та музеями просто неба.',
    aliases: ['ужгород', 'uzhgorod', 'uzhhorod'],
  },
  {
    cityId: '95',
    cityName: 'Чернівці',
    latitude: 48.2915,
    longitude: 25.9403,
    heroImage: chernivtsiImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Чернівці розвивалися як важливий культурний центр Буковини з європейськими архітектурними традиціями.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Головна перлина міста — резиденція митрополитів (нині університет), а також камерні вулички та театральна традиція.',
    aliases: ['чернівці', 'черновцы', 'chernivtsi'],
  },
  {
    cityId: '35',
    cityName: 'Івано-Франківськ',
    latitude: 48.9226,
    longitude: 24.7111,
    heroImage: ifImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Івано-Франківськ заснований як фортеця Станіславів і зберіг історичний центр із ратушею та пішохідними вулицями.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Місто є воротами до Карпат, поєднує урбаністичний ритм, фестивалі та близькість до природних туристичних маршрутів.',
    aliases: ['івано-франківськ', 'ивано-франковск', 'ivano-frankivsk', 'if'],
  },
  {
    cityId: '111',
    cityName: "Кам'янець-Подільський",
    latitude: 48.6766,
    longitude: 26.5852,
    heroImage: kpImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      "Кам'янець-Подільський — історичне місто-фортеця з унікальним каньйоном річки Смотрич та багатовіковою спадщиною.",
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Місто відоме середньовічною фортецею, фестивалями повітряних куль і збереженим старим містом.',
    aliases: ["кам'янець-подільський", 'каменец-подольский', 'камянець-подільськ', 'kp'],
  },
  {
    cityId: '6',
    cityName: 'Луцьк',
    latitude: 50.7472,
    longitude: 25.3254,
    heroImage: lutskImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Луцьк — давній центр Волині, місто з тривалою історією та важливою роллю у розвитку регіону.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Символ міста — замок Любарта; також Луцьк має затишний історичний центр і сучасні культурні події.',
    aliases: ['луцьк', 'луцк', 'lutsk'],
  },
  {
    cityId: 'bukovel',
    cityName: 'Буковель',
    latitude: 48.3636,
    longitude: 24.4168,
    heroImage: bukovelImage,
    bottomImage: museumImage,
    historyTitle: HISTORY_TITLE,
    historyText:
      'Буковель — один із найбільших гірських курортів України, що активно розвивається як всесезонний напрямок.',
    cultureTitle: CULTURE_TITLE,
    cultureText:
      'Взимку курорт пропонує лижну інфраструктуру, а влітку — озера, веломаршрути, SPA і гірські активності.',
    aliases: ['буковель', 'bukovel'],
  },
];

const normalize = (value?: string) => (value ? value.trim().toLowerCase() : '');

export const getLocalCityGuide = ({ cityId, cityName }: GuideResolverInput): CityGuide => {
  const normalizedId = normalize(cityId);
  const normalizedName = normalize(cityName);

  if (normalizedId) {
    const byId = CITY_GUIDES_LOCAL.find((item) => normalize(item.cityId) === normalizedId);
    if (byId) return byId;
  }

  if (normalizedName) {
    const byName = CITY_GUIDES_LOCAL.find((item) => {
      const names = [item.cityName, ...item.aliases].map(normalize);
      return names.includes(normalizedName);
    });
    if (byName) return byName;
  }

  return DEFAULT_GUIDE;
};
