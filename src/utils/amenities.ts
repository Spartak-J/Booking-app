import { MaterialCommunityIcons } from '@expo/vector-icons';

export type AmenityOption = {
  id: string;
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export const AMENITY_OPTIONS: AmenityOption[] = [
  { id: 'wifi', label: 'WI-FI', icon: 'wifi' },
  { id: 'tv', label: 'Телевізор', icon: 'television' },
  { id: 'iron', label: 'Праска', icon: 'iron' },
  { id: 'washer', label: 'Пральна машина', icon: 'washing-machine' },
  { id: 'desk', label: 'Робочий стіл', icon: 'desk' },
  { id: 'pets', label: 'Можна з тваринами', icon: 'paw' },
  { id: 'ac', label: 'Кондиціонер', icon: 'air-conditioner' },
  { id: 'kettle', label: 'Електичний чайник', icon: 'kettle' },
  { id: 'parking', label: 'Безкоштовна парковка', icon: 'parking' },
];

export const resolveAmenityIcon = (value: string): AmenityOption['icon'] | undefined => {
  const v = value.toLowerCase();
  if (v.includes('wi-fi') || v.includes('wifi')) return 'wifi';
  if (v.includes('телев') || v.includes('tv')) return 'television';
  if (v.includes('праск') || v.includes('утюг')) return 'iron';
  if (v.includes('прал') || v.includes('стир') || v.includes('машин')) return 'washing-machine';
  if (v.includes('робоч') || v.includes('desk')) return 'desk';
  if (v.includes('твар') || v.includes('pet')) return 'paw';
  if (v.includes('кондиционер') || v.includes('кондиціонер') || v.includes('ac'))
    return 'air-conditioner';
  if (v.includes('чайник') || v.includes('kettle') || v.includes('каво')) return 'kettle';
  if (v.includes('парков')) return 'parking';
  return undefined;
};
