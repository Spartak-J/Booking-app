import apiClient from '@/api/client';
import { City } from '@/types';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang } from '@/utils/apiAdapters';
import { USE_MOCKS } from '@/config/constants';
import { mockOffers } from '@/utils/mockData';

export const cityService = {
  getAll: async (): Promise<City[]> => {
    if (USE_MOCKS) {
      const map = new Map<string, City>();
      mockOffers.forEach((offer) => {
        if (!map.has(offer.city.id)) {
          map.set(offer.city.id, offer.city);
        }
      });
      return Array.from(map.values());
    }
    const lang = getApiLang();
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.locations.cities(lang));
      const citiesRaw: any[] = Array.isArray(data) ? data : (data?.data ?? []);

      return citiesRaw.map((city) => ({
        id: String(city?.id ?? ''),
        name: city?.title ?? city?.name ?? `City #${city?.id ?? ''}`,
        country: city?.countryTitle ?? city?.country ?? '',
      }));
    } catch (error) {
      console.warn('[cityService.getAll] API fallback to empty list', error);
      return [];
    }
  },
};
