import landmark1 from '@/assets/images/1.png';
import landmark2 from '@/assets/images/2.png';
import landmark3 from '@/assets/images/3.png';
import landmark4 from '@/assets/images/4.png';
import landmark5 from '@/assets/images/5.png';

export type Landmark = {
  id: string;
  cityId: string;
  title: string;
  image: any;
  description?: string;
  latitude?: number;
  longitude?: number;
};

const BASE: Landmark[] = [
  {
    id: 'lm-lviv-1',
    cityId: '13',
    title: 'Музей пивоварні',
    image: landmark1,
    description:
      'Музей історії львівського пива в самому центрі міста: дегустаційний зал, колекція артефактів і панорамний вид на старе місто.',
    latitude: 49.841,
    longitude: 24.0316,
  },
  {
    id: 'lm-lviv-2',
    cityId: '13',
    title: 'Театр опери та балету імені Соломії Крушельницької',
    image: landmark2,
    description:
      'Один із найгарніших театрів Європи: неоренесансний фасад, мармурові зали, багатий репертуар опер та балетів. Побудований у 1900 році.',
    latitude: 49.8442,
    longitude: 24.0269,
  },
  {
    id: 'lm-lviv-3',
    cityId: '13',
    title: 'Італійський Дворик',
    image: landmark3,
    description:
      'Кам’яний дворик XVI століття з аркадами та кав’ярнями. Затишне місце для фото і вечірніх концертів просто неба.',
    latitude: 49.8415,
    longitude: 24.0316,
  },
  {
    id: 'lm-lviv-4',
    cityId: '13',
    title: 'Костел Ельжбети',
    image: landmark4,
    description: 'Неоготичний храм із вежами та оглядовим майданчиком, звідки видно увесь центр Львова.',
    latitude: 49.8386,
    longitude: 24.0058,
  },
  {
    id: 'lm-lviv-5',
    cityId: '13',
    title: 'Високий замок',
    image: landmark5,
    description: 'Пагорб з оглядовим майданчиком і залишками фортеці. Найкращий захід сонця над Львовом.',
    latitude: 49.8482,
    longitude: 24.0397,
  },
  { id: 'lm-lviv-6', cityId: '13', title: 'Дворик Іграшок', image: landmark1 },
  { id: 'lm-lviv-7', cityId: '13', title: 'Ратуша', image: landmark2 },

  // Одеса
  { id: 'lm-odesa-1', cityId: '54', title: 'Одеський театр опери та балету', image: landmark2 },
  { id: 'lm-odesa-2', cityId: '54', title: 'Дерибасівська площа', image: landmark3 },
  { id: 'lm-odesa-3', cityId: '54', title: 'Потьомкінські сходи', image: landmark4 },

  // Київ
  { id: 'lm-kyiv-1', cityId: '1', title: 'Софія Київська', image: landmark5 },
  { id: 'lm-kyiv-2', cityId: '1', title: 'Андріївський узвіз', image: landmark1 },
  { id: 'lm-kyiv-3', cityId: '1', title: 'Музей історії України', image: landmark2 },
];

export const getLandmarksByCity = (cityId?: string): Landmark[] => {
  if (!cityId) return [];
  const filtered = BASE.filter((item) => item.cityId === cityId);
  return filtered;
};

export const LANDMARKS = BASE;
