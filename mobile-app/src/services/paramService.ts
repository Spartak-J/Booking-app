import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang } from '@/utils/apiAdapters';
import { USE_MOCKS } from '@/config/constants';
import { OWNER_AMENITIES_MOCK } from '@/data/hotels/amenities.mock';

export type Category = { id: string; name: string };
export type Amenity = { id: string; name: string };
export type OwnerAmenitySectionKey =
  | 'accommodationType'
  | 'amenities'
  | 'housingWith'
  | 'bookingRules'
  | 'freeCancellation';
export type OwnerAmenitySection = {
  key: OwnerAmenitySectionKey;
  title: string;
  items: Amenity[];
};
export type OwnerAmenitySectionsResponse = {
  sections: OwnerAmenitySection[];
  hasPetsAllowedOption: boolean;
};

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
const FREE_CANCELLATION_LABELS = ['безкоштовне скасування', 'free cancellation'];
const PETS_ALLOWED_LABELS = ['можна з тваринами', 'pets allowed'];

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

const mapCategoryItems = (category: any): Amenity[] => {
  const list: any[] = Array.isArray(category?.items) ? category.items : [];
  return normalizeAmenities(list);
};

const splitBookingRuleItems = (items: Amenity[]) => {
  const freeCancellation: Amenity[] = [];
  const bookingRules: Amenity[] = [];

  items.forEach((item) => {
    const title = normalize(item.name);
    if (FREE_CANCELLATION_LABELS.some((label) => title.includes(label))) {
      freeCancellation.push(item);
      return;
    }
    bookingRules.push(item);
  });

  return { bookingRules, freeCancellation };
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
  getOwnerAmenitySections: async (): Promise<OwnerAmenitySectionsResponse> => {
    if (USE_MOCKS) {
      return {
        sections: [
          { key: 'amenities', title: 'Зручності', items: toMockAmenities() },
        ],
        hasPetsAllowedOption: false,
      };
    }

    const lang = getApiLang();
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.params.categories(lang));
      const categories: any[] = Array.isArray(data) ? data : (data?.data ?? []);

      const accommodationTypeCategory = categories.find((item) => String(item?.id) === '1');
      const amenitiesCategory = categories.find((item) => String(item?.id) === '3');
      const housingWithCategory = categories.find((item) => String(item?.id) === '4');
      const bookingRulesCategory = categories.find((item) => String(item?.id) === '7');

      const accommodationTypeItems = mapCategoryItems(accommodationTypeCategory);
      const amenitiesItems = mapCategoryItems(amenitiesCategory);
      const housingWithItems = mapCategoryItems(housingWithCategory);
      const bookingItems = mapCategoryItems(bookingRulesCategory);
      const { bookingRules, freeCancellation } = splitBookingRuleItems(bookingItems);

      const sections: OwnerAmenitySection[] = [];
      const addSection = (section: OwnerAmenitySection) => {
        if (section.items.length > 0) {
          sections.push(section);
        }
      };

      addSection({
        key: 'accommodationType',
        title: String(accommodationTypeCategory?.title ?? accommodationTypeCategory?.name ?? 'Тип розміщення'),
        items: accommodationTypeItems,
      });
      addSection({
        key: 'amenities',
        title: String(amenitiesCategory?.title ?? amenitiesCategory?.name ?? 'Зручності'),
        items: amenitiesItems,
      });
      addSection({
        key: 'housingWith',
        title: String(housingWithCategory?.title ?? housingWithCategory?.name ?? 'Житло з'),
        items: housingWithItems,
      });
      addSection({
        key: 'bookingRules',
        title: String(bookingRulesCategory?.title ?? bookingRulesCategory?.name ?? 'Правила бронювання'),
        items: bookingRules,
      });
      addSection({
        key: 'freeCancellation',
        title: freeCancellation.length > 0 ? freeCancellation[0].name : 'Безкоштовне скасування',
        items: freeCancellation,
      });

      const hasPetsAllowedOption = amenitiesItems.some((item) => {
        const title = normalize(item.name);
        return PETS_ALLOWED_LABELS.some((label) => title.includes(label));
      });

      return { sections, hasPetsAllowedOption };
    } catch (error) {
      console.warn('[paramService.getOwnerAmenitySections] API fallback to mock list', error);
      return {
        sections: [{ key: 'amenities', title: 'Зручності', items: toMockAmenities() }],
        hasPetsAllowedOption: false,
      };
    }
  },
};
