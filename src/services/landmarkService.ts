import { CITIES } from '@/data/cities/cities.mock';
import { CityGuide, getCityGuideByCityId } from '@/data/landmarks/cityGuide.mock';
import {
  LANDMARKS,
  Landmark as LandmarkItem,
  getLandmarksByCity,
} from '@/data/landmarks/landmarks.mock';

export type LandmarkCity = {
  id: string;
  name: string;
  country: string;
};

export type Landmark = LandmarkItem;
export type LandmarkCityGuide = CityGuide;

export const landmarkService = {
  async getCities(): Promise<LandmarkCity[]> {
    return CITIES;
  },

  async findCityById(cityId?: string): Promise<LandmarkCity | undefined> {
    if (!cityId) return undefined;
    return CITIES.find((city) => city.id === cityId);
  },

  async findCityByName(name?: string): Promise<LandmarkCity | undefined> {
    if (!name) return undefined;
    return CITIES.find((city) => city.name.toLowerCase() === name.toLowerCase());
  },

  async findCityByQuery(query: string): Promise<LandmarkCity | undefined> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return undefined;
    return CITIES.find((city) => city.name.toLowerCase().includes(normalized));
  },

  async getLandmarksByCity(cityId?: string): Promise<Landmark[]> {
    return getLandmarksByCity(cityId);
  },

  async getLandmarkById(landmarkId?: string): Promise<Landmark | undefined> {
    if (!landmarkId) return undefined;
    return LANDMARKS.find((landmark) => landmark.id === landmarkId);
  },

  async getCityGuideByCityId(cityId?: string): Promise<LandmarkCityGuide> {
    return getCityGuideByCityId(cityId);
  },

  async getDefaultCity(): Promise<LandmarkCity> {
    return CITIES.find((city) => city.id === 'city-2') ?? CITIES[0];
  },
};
