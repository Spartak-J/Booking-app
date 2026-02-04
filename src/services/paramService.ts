import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang } from '@/utils/apiAdapters';
import { USE_MOCKS } from '@/config/constants';
import { mockOffers } from '@/utils/mockData';

export type Category = { id: string; name: string };
export type Amenity = { id: string; name: string };

export const paramService = {
  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCKS) return [];
    const lang = getApiLang();
    const { data } = await apiClient.get<any>(ENDPOINTS.params.categories(lang));
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    return list.map((item) => ({
      id: String(item?.id ?? item?.categoryId ?? ''),
      name: item?.title ?? item?.name ?? 'Без названия',
    }));
  },
  getAmenities: async (): Promise<Amenity[]> => {
    if (USE_MOCKS) {
      const unique = new Set<string>();
      mockOffers.forEach((offer) => offer.amenities.forEach((item) => unique.add(item)));
      return Array.from(unique).map((name, idx) => ({ id: String(idx + 1), name }));
    }
    const lang = getApiLang();
    const { data } = await apiClient.get<any>(ENDPOINTS.params.items(lang));
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    return list.map((item) => ({
      id: String(item?.id ?? item?.paramItemId ?? ''),
      name: item?.title ?? item?.name ?? 'Без названия',
    }));
  },
};
