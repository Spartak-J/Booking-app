import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { API_BASE_URL } from '@/config/constants';
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

const toCoord = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value.trim().replace(',', '.'));
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const LOCALHOST_SET = new Set(['localhost', '127.0.0.1', '::1']);

const getApiBaseUrlParts = (): URL | null => {
  try {
    return new URL(API_BASE_URL);
  } catch {
    return null;
  }
};

const toAbsoluteImageUrl = (value: string): string => {
  const normalizedValue = value.trim();
  if (/^https?:\/\//i.test(normalizedValue)) {
    try {
      const current = new URL(normalizedValue);
      if (!LOCALHOST_SET.has(current.hostname)) return normalizedValue;
      const apiBase = getApiBaseUrlParts();
      if (!apiBase) return normalizedValue;
      current.protocol = apiBase.protocol;
      current.hostname = apiBase.hostname;
      current.port = apiBase.port;
      return current.toString();
    } catch {
      return normalizedValue;
    }
  }
  const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = normalizedValue.startsWith('/') ? normalizedValue : `/${normalizedValue}`;
  return `${normalizedBase}${normalizedPath}`;
};

const toImageSource = (item: Record<string, any>) => {
  const direct =
    item?.imageUrl_Main ??
    item?.ImageUrl_Main ??
    item?.imageUrlMain ??
    item?.ImageUrlMain ??
    item?.image ??
    item?.Image;
  if (typeof direct === 'string' && direct.length > 0) return { uri: toAbsoluteImageUrl(direct) };
  const images = item?.images ?? item?.Images;
  const first = Array.isArray(images) ? images[0] : undefined;
  const url = first?.url ?? first?.Url ?? first?.imageUrl ?? first?.ImageUrl;
  if (typeof url === 'string' && url.length > 0) return { uri: toAbsoluteImageUrl(url) };
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
  latitude: toCoord(item?.latitude ?? item?.Latitude ?? item?.lat ?? item?.Lat),
  longitude: toCoord(item?.longitude ?? item?.Longitude ?? item?.lng ?? item?.Lng),
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
      const normalizedCityId = String(cityId);
      const byRequestedCity = mapped.filter(
        (item: Landmark) => !item.cityId || String(item.cityId) === normalizedCityId,
      );
      const apiResult = byRequestedCity.length ? byRequestedCity : mapped;
      return apiResult.length ? apiResult : getLandmarksByCity(normalizedCityId);
    } catch (error) {
      console.warn('[landmarkService.getLandmarksByCity] API fallback to mock', error);
      return getLandmarksByCity(String(cityId));
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
