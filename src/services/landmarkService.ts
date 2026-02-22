import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { USE_MOCKS_SEARCH } from '@/config/constants';
import { cityService } from '@/services/cityService';
import { CityGuide, getLocalCityGuide } from '@/data/landmarks/cityGuide.local';
import {
  LANDMARKS,
  Landmark as LandmarkItem,
  getLandmarksByCity,
} from '@/data/landmarks/landmarks.mock';
import { getApiLang } from '@/utils/apiAdapters';

export type LandmarkCity = {
  id: string;
  name: string;
  country: string;
};

export type Landmark = LandmarkItem;
export type LandmarkCityGuide = CityGuide;

const FALLBACK_CITIES = [
  { id: '13', name: 'Львів', country: 'Україна' },
  { id: '1', name: 'Київ', country: 'Україна' },
  { id: '54', name: 'Одеса', country: 'Україна' },
];

const toImageSource = (item: Record<string, any>) => {
  const direct = item?.imageUrl_Main ?? item?.ImageUrl_Main ?? item?.image ?? item?.Image;
  if (typeof direct === 'string' && direct.length > 0) return { uri: direct };
  const images = item?.images ?? item?.Images;
  const first = Array.isArray(images) ? images[0] : undefined;
  const url = first?.url ?? first?.Url ?? first?.imageUrl ?? first?.ImageUrl;
  if (typeof url === 'string' && url.length > 0) return { uri: url };
  return LANDMARKS[0]?.image;
};

const mapAttraction = (item: Record<string, any>): Landmark => ({
  id: String(item?.id ?? item?.Id ?? ''),
  cityId: String(item?.cityId ?? item?.CityId ?? ''),
  title: String(item?.title ?? item?.Title ?? ''),
  description:
    (item?.description ?? item?.Description)
      ? String(item?.description ?? item?.Description)
      : undefined,
  image: toImageSource(item),
});

export const landmarkService = {
  async getCities(): Promise<LandmarkCity[]> {
    if (USE_MOCKS_SEARCH) return FALLBACK_CITIES;
    const cities = await cityService.getAll();
    return cities.length ? cities : FALLBACK_CITIES;
  },

  async findCityById(cityId?: string): Promise<LandmarkCity | undefined> {
    if (!cityId) return undefined;
    const cities = await landmarkService.getCities();
    return cities.find((city) => String(city.id) === String(cityId));
  },

  async findCityByName(name?: string): Promise<LandmarkCity | undefined> {
    if (!name) return undefined;
    const cities = await landmarkService.getCities();
    return cities.find((city) => city.name.toLowerCase() === name.toLowerCase());
  },

  async findCityByQuery(query: string): Promise<LandmarkCity | undefined> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return undefined;
    const cities = await landmarkService.getCities();
    return cities.find((city) => city.name.toLowerCase().includes(normalized));
  },

  async getLandmarksByCity(cityId?: string): Promise<Landmark[]> {
    if (!cityId) return [];
    if (USE_MOCKS_SEARCH) return getLandmarksByCity(cityId);
    const lang = getApiLang();
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.attractions.byCity(cityId, lang));
      const rawList = Array.isArray(data) ? data : (data?.data ?? []);
      const mapped = rawList
        .map((item: Record<string, any>) => mapAttraction(item))
        .filter((x: Landmark) => Boolean(x.id) && Boolean(x.title));
      return mapped.length ? mapped : getLandmarksByCity(cityId);
    } catch (error) {
      console.warn('[landmarkService.getLandmarksByCity] API fallback to mock', error);
      return getLandmarksByCity(cityId);
    }
  },

  async getLandmarkById(landmarkId?: string): Promise<Landmark | undefined> {
    if (!landmarkId) return undefined;
    if (USE_MOCKS_SEARCH) return LANDMARKS.find((landmark) => landmark.id === landmarkId);
    const lang = getApiLang();
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.attractions.byId(landmarkId, lang));
      const rawList = Array.isArray(data) ? data : (data?.data ?? []);
      const first = rawList[0];
      if (!first) return LANDMARKS.find((landmark) => landmark.id === landmarkId);
      return mapAttraction(first);
    } catch (error) {
      console.warn('[landmarkService.getLandmarkById] API fallback to mock', error);
      return LANDMARKS.find((landmark) => landmark.id === landmarkId);
    }
  },

  async getCityGuideByCityId(cityId?: string): Promise<LandmarkCityGuide> {
    const city = await landmarkService.findCityById(cityId);
    return getLocalCityGuide({ cityId, cityName: city?.name });
  },

  async getDefaultCity(): Promise<LandmarkCity> {
    const cities = await landmarkService.getCities();
    return (
      cities.find((city) => city.name.toLowerCase().includes('льв')) ??
      cities.find((city) => city.id === '13') ??
      cities[0]
    );
  },
};
