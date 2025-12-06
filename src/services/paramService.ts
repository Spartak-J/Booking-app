import { USE_MOCKS } from '@/config/constants';

export type Category = { id: string; name: string };
export type Amenity = { id: string; name: string };

const mockCategories: Category[] = [
  { id: 'cat-apt', name: 'Апартаменты' },
  { id: 'cat-house', name: 'Дом' },
  { id: 'cat-villa', name: 'Вилла' },
];

const mockAmenities: Amenity[] = [
  { id: 'wifi', name: 'Wi-Fi' },
  { id: 'parking', name: 'Парковка' },
  { id: 'kitchen', name: 'Кухня' },
  { id: 'ac', name: 'Кондиционер' },
];

export const paramService = {
  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCKS) return Promise.resolve(mockCategories);
    return [];
  },
  getAmenities: async (): Promise<Amenity[]> => {
    if (USE_MOCKS) return Promise.resolve(mockAmenities);
    return [];
  },
};
