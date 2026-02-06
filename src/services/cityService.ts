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
    const [citiesRes, translationsRes] = await Promise.all([
      apiClient.get<any>(ENDPOINTS.locations.cities),
      apiClient.get<any>(ENDPOINTS.locations.cityTranslations(lang)),
    ]);

    const citiesRaw: any[] = Array.isArray(citiesRes.data)
      ? citiesRes.data
      : (citiesRes.data?.data ?? []);
    const translations: any[] = Array.isArray(translationsRes.data)
      ? translationsRes.data
      : (translationsRes.data?.data ?? []);

    const titleMap = new Map(
      translations.map((t) => [String(t?.entityId ?? t?.id ?? ''), t?.title ?? t?.name ?? '']),
    );

    return citiesRaw.map((city) => ({
      id: String(city?.id ?? ''),
      name: titleMap.get(String(city?.id ?? '')) ?? `City #${city?.id ?? ''}`,
      country: '',
    }));
  },
};
