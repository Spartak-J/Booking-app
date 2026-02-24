import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang } from '@/utils/apiAdapters';
import { USE_MOCKS } from '@/config/constants';
import { OWNER_AMENITIES_MOCK } from '@/data/hotels/amenities.mock';

export type Category = { id: string; name: string };
export type Amenity = { id: string; name: string };

const AMENITY_SECTION_LABELS = [
  'тип розміщення',
  'тип размещения',
  'ціни',
  'цены',
  'зручності',
  'удобства',
  'житло з',
  'жилье с',
  "оцінка об'єкту",
  'оценка объекта',
  'відстань від центра',
  'расстояние от центра',
  'правила бронювання',
  'правила бронирования',
  'район',
];

const normalize = (value?: string | null) => (value ?? '').trim().toLowerCase();

const toMockAmenities = (): Amenity[] =>
  OWNER_AMENITIES_MOCK.map((name, idx) => ({ id: String(idx + 1), name }));

const normalizeAmenities = (list: any[]): Amenity[] => {
  const map = new Map<string, Amenity>();

  list.forEach((item, index) => {
    const id = String(item?.id ?? item?.paramItemId ?? index + 1);
    const name = String(item?.title ?? item?.name ?? '').trim();
    if (!name) return;
    const normalizedName = normalize(name);
    if (!normalizedName) return;
    if (AMENITY_SECTION_LABELS.includes(normalizedName)) return;
    if (!map.has(normalizedName)) {
      map.set(normalizedName, { id, name });
    }
  });

  return Array.from(map.values());
};

export const paramService = {
  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCKS) return [];
    const lang = getApiLang();
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.params.categories(lang));
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      return list.map((item) => ({
        id: String(item?.id ?? item?.categoryId ?? ''),
        name: item?.title ?? item?.name ?? 'Без названия',
      }));
    } catch (error) {
      console.warn('[paramService.getCategories] API fallback to empty list', error);
      return [];
    }
  },
  getAmenities: async (): Promise<Amenity[]> => {
    if (USE_MOCKS) {
      return toMockAmenities();
    }
    const lang = getApiLang();
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.params.items(lang));
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      const normalized = normalizeAmenities(list);
      if (normalized.length > 0) return normalized;
      return toMockAmenities();
    } catch (error) {
      console.warn('[paramService.getAmenities] API fallback to mock list', error);
      return toMockAmenities();
    }
  },
};
