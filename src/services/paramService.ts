import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang } from '@/utils/apiAdapters';
import { USE_MOCKS } from '@/config/constants';
import { OWNER_AMENITIES_MOCK } from '@/data/hotels/amenities.mock';

export type Category = { id: string; name: string };
export type Amenity = { id: string; name: string };

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
      return OWNER_AMENITIES_MOCK.map((name, idx) => ({ id: String(idx + 1), name }));
    }
    const lang = getApiLang();
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.params.items(lang));
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      return list.map((item) => ({
        id: String(item?.id ?? item?.paramItemId ?? ''),
        name: item?.title ?? item?.name ?? 'Без названия',
      }));
    } catch (error) {
      console.warn('[paramService.getAmenities] API fallback to empty list', error);
      return [];
    }
  },
};
