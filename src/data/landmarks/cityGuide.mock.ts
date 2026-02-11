import lvivImage from '@/assets/images/lviv.png';
import museumImage from '@/assets/images/museum.png';

export type CityGuide = {
  cityId: string;
  heroImage: any;
  bottomImage: any;
  historyTitle: string;
  historyText: string;
  cultureTitle: string;
  cultureText: string;
};

const DEFAULT_GUIDE: CityGuide = {
  cityId: 'default',
  heroImage: lvivImage,
  bottomImage: museumImage,
  historyTitle: 'Трохи історії',
  historyText:
    'Місто має багату історію, формувалося століттями та поєднує різні культурні традиції.',
  cultureTitle: 'Архітектурне та культурне надбання',
  cultureText:
    'У місті зосереджені визначні пам’ятки, музеї та локації, які варто відвідати під час подорожі.',
};

export const CITY_GUIDES: CityGuide[] = [
  {
    cityId: 'city-2',
    heroImage: lvivImage,
    bottomImage: museumImage,
    historyTitle: 'Трохи історії',
    historyText:
      'Львів отримав свою назву завдяки князеві Данилові Галицькому, який назвав місто на честь свого сина Лева. Перша згадка про Львів відноситься до 1256 року.',
    cultureTitle: 'Архітектурне та культурне надбання',
    cultureText:
      "На території міста є парки, ботанічні сади та велика кількість архітектурних пам'яток. Історичний центр Львова внесено до списку Світової спадщини ЮНЕСКО.",
  },
];

export const getCityGuideByCityId = (cityId?: string): CityGuide => {
  if (!cityId) return DEFAULT_GUIDE;
  return CITY_GUIDES.find((item) => item.cityId === cityId) ?? DEFAULT_GUIDE;
};
