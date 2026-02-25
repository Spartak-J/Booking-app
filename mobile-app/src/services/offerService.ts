import apiClient from '@/api/client';
import { Offer, PropertyType } from '@/types';
import { ENDPOINTS } from '@/config/endpoints';
import { USE_MOCKS_SEARCH } from '@/config/constants';
import { getApiLang, mapOfferFull, mapOfferShort } from '@/utils/apiAdapters';
import { getAuthState } from '@/store/authStore';
import { cityService } from '@/services/cityService';
import { paramService } from '@/services/paramService';
import { mockOffers } from '@/utils/mockData';
import { BookingRepository } from '@/data/bookings';
import { isOfferAvailableForDates } from '@/services/bookingAvailability';
import { toUserFacingApiError } from '@/utils/apiError';

export type OfferFilters = {
  cityId?: string;
  cityName?: string;
  categoryId?: string;
  amenities?: string[];
  dates?: { from: string; to: string };
  guests?: number;
  sort?: 'recommended' | 'center' | 'priceAsc' | 'priceDesc' | 'ratingAsc' | 'ratingDesc';
  priceFrom?: number;
  priceTo?: number;
  propertyType?: PropertyType;
  ratingMin?: number;
  distanceKm?: number;
  district?: string;
  bookingRule?: string;
  lodgingType?: string;
  freeCancellation?: boolean;
  onlyActive?: boolean;
};

const normalizeText = (value?: string | null) => (value ?? '').trim().toLowerCase();

const debugOfferSource = (message: string, payload?: Record<string, unknown>) => {
  if (!__DEV__) return;
  if (payload) {
    console.debug(`[offerService] ${message}`, payload);
    return;
  }
  console.debug(`[offerService] ${message}`);
};

const findMockOfferMatch = (offer: Partial<Offer>): Offer | undefined => {
  const title = normalizeText(offer.title);
  const cityName = normalizeText(offer.city?.name);

  if (title) {
    const byTitle = mockOffers.find((item) => normalizeText(item.title) === title);
    if (byTitle) return byTitle;
  }

  if (cityName) {
    const byCity = mockOffers.find(
      (item) =>
        normalizeText(item.city.name) === cityName &&
        (offer.bedrooms ? item.bedrooms === offer.bedrooms : true),
    );
    if (byCity) return byCity;
  }

  return undefined;
};

const mergeOfferWithMock = (apiOffer: Offer, mockOffer?: Offer): Offer => {
  if (!mockOffer) return apiOffer;

  return {
    ...apiOffer,
    title: apiOffer.title?.trim() ? apiOffer.title : mockOffer.title,
    description: apiOffer.description?.trim() ? apiOffer.description : mockOffer.description,
    city: {
      id: apiOffer.city?.id || mockOffer.city.id,
      name: apiOffer.city?.name || mockOffer.city.name,
      country: apiOffer.city?.country || mockOffer.city.country,
    },
    address: apiOffer.address?.trim() ? apiOffer.address : mockOffer.address,
    pricePerNight: apiOffer.pricePerNight > 0 ? apiOffer.pricePerNight : mockOffer.pricePerNight,
    rating: apiOffer.rating ?? mockOffer.rating,
    guests: apiOffer.guests > 0 ? apiOffer.guests : mockOffer.guests,
    maxGuests: (apiOffer.maxGuests ?? 0) > 0 ? apiOffer.maxGuests : mockOffer.maxGuests,
    stock: (apiOffer.stock ?? 0) > 0 ? apiOffer.stock : mockOffer.stock,
    bedrooms: apiOffer.bedrooms > 0 ? apiOffer.bedrooms : mockOffer.bedrooms,
    amenities: apiOffer.amenities?.length ? apiOffer.amenities : mockOffer.amenities,
    images: apiOffer.images?.length ? apiOffer.images : mockOffer.images,
    ownerId: apiOffer.ownerId || mockOffer.ownerId,
    owner: apiOffer.owner ?? mockOffer.owner,
    highlights: apiOffer.highlights?.length ? apiOffer.highlights : mockOffer.highlights,
    reviews: apiOffer.reviews?.length ? apiOffer.reviews : mockOffer.reviews,
    rooms: apiOffer.rooms?.length ? apiOffer.rooms : mockOffer.rooms,
  };
};

const getMockOffersByFilters = async (filters: OfferFilters = {}) => {
  let items = [...mockOffers];
  if (filters.cityId) {
    items = items.filter((item) => item.city.id === filters.cityId);
  } else if (filters.cityName) {
    items = items.filter(
      (item) => item.city.name.toLowerCase() === filters.cityName?.toLowerCase(),
    );
  }
  if (filters.guests) {
    items = items.filter((item) => (item.maxGuests ?? item.guests) >= (filters.guests ?? 1));
  }
  if (filters.dates?.from && filters.dates?.to) {
    const bookings = await BookingRepository.getAll();
    items = items.filter((item) =>
      isOfferAvailableForDates(
        item.id,
        filters.dates!.from,
        filters.dates!.to,
        bookings,
        item.stock ?? 1,
      ),
    );
  }
  if (filters.amenities?.length) {
    const hasAmenity = (offerAmenities: string[] = [], id: string) => {
      const normalized = offerAmenities.map((value) => value.toLowerCase());
      const includesAny = (targets: string[]) =>
        targets.some((target) => normalized.some((value) => value.includes(target)));
      switch (id) {
        case 'wifi':
          return includesAny(['wi-fi', 'wifi']);
        case 'tv':
          return includesAny(['тв', 'телев']);
        case 'washer':
          return includesAny(['стирал', 'праль']);
        case 'kettle':
          return includesAny(['чайник']);
        case 'iron':
          return includesAny(['утюг', 'праск']);
        case 'desk':
          return includesAny(['рабоч', 'робоч']);
        case 'pets':
          return includesAny(['тварин', 'живот']);
        case 'ac':
          return includesAny(['кондицион', 'кондиц']);
        case 'parking':
          return includesAny(['парков']);
        default:
          return true;
      }
    };
    items = items.filter((item) =>
      filters.amenities?.every((id) => hasAmenity(item.amenities, id)),
    );
  }
  if (filters.priceFrom !== undefined) {
    items = items.filter((item) => item.pricePerNight >= (filters.priceFrom ?? 0));
  }
  if (filters.priceTo !== undefined) {
    items = items.filter((item) => item.pricePerNight <= (filters.priceTo ?? Infinity));
  }
  if (filters.propertyType) {
    items = items.filter((item) => item.type === filters.propertyType);
  }
  if (filters.categoryId) {
    const categoryMap: Record<string, Offer['type'] | undefined> = {
      hostel: 'apartment',
      studio: 'apartment',
      room: 'apartment',
    };
    const mappedType = categoryMap[filters.categoryId];
    if (mappedType) {
      items = items.filter((item) => item.type === mappedType);
    }
  }
  if (filters.ratingMin !== undefined) {
    items = items.filter((item) => (item.rating ?? 0) >= filters.ratingMin!);
  }
  if (filters.freeCancellation) {
    items = items.filter((item) =>
      (item.highlights ?? []).some(
        (value) =>
          value.toLowerCase().includes('бесплат') || value.toLowerCase().includes('безкоштов'),
      ),
    );
  }
  if (filters.bookingRule) {
    const highlightMatch = (targets: string[]) => (value: string) =>
      targets.some((target) => value.includes(target));
    const normalizedHighlights = (offer: Offer) =>
      (offer.highlights ?? []).map((value) => value.toLowerCase());
    const rule = filters.bookingRule;
    items = items.filter((offer) => {
      const highlights = normalizedHighlights(offer);
      if (rule === 'freeCancel') {
        return highlights.some(highlightMatch(['бесплат', 'безкоштов']));
      }
      if (rule === 'payNow') {
        return highlights.some(highlightMatch(['оплата зараз', 'pay now', 'онлайн']));
      }
      if (rule === 'payBefore') {
        return highlights.some(highlightMatch(['перед приїзд', 'предоплат', 'advance']));
      }
      if (rule === 'payOnArrival') {
        return highlights.some(highlightMatch(['на місці', 'на месте', 'оплата на месте']));
      }
      return true;
    });
  }
  if (filters.district) {
    const textMatch = (item: Offer) =>
      `${item.title} ${item.description ?? ''} ${item.address ?? ''}`.toLowerCase();
    const districtTokens: Record<string, string[]> = {
      center: ['центр', 'centre', 'center'],
      favorite: ['улюблен', 'любим'],
      rynok: ['ринок', 'рынок'],
      svobody: ['свобод', 'svobody'],
    };
    const tokens = districtTokens[filters.district] ?? [];
    if (tokens.length > 0) {
      items = items.filter((item) => tokens.some((token) => textMatch(item).includes(token)));
    }
  }
  if (filters.distanceKm) {
    items = items.filter((item) => {
      const text = `${item.title} ${item.description ?? ''}`.toLowerCase();
      const distance =
        text.includes('центр') || text.includes('centre') || text.includes('center')
          ? 1
          : text.includes('ринок') || text.includes('рынок')
            ? 3
            : 5;
      return distance <= (filters.distanceKm ?? 5);
    });
  }
  if (filters.lodgingType) {
    items = items.filter((item) => {
      if (filters.lodgingType === 'balcony') {
        return (item.amenities ?? []).some((value) => value.toLowerCase().includes('балкон'));
      }
      if (filters.lodgingType === 'terrace') {
        return (item.description ?? '').toLowerCase().includes('терас');
      }
      if (filters.lodgingType === 'kitchen') {
        return (item.amenities ?? []).some((value) => value.toLowerCase().includes('кухн'));
      }
      if (filters.lodgingType === 'single') return (item.bedrooms ?? 0) <= 1;
      if (filters.lodgingType === 'double') return (item.bedrooms ?? 0) >= 2;
      return true;
    });
  }
  if (filters.sort === 'priceAsc') {
    items.sort((a, b) => a.pricePerNight - b.pricePerNight);
  }
  if (filters.sort === 'priceDesc') {
    items.sort((a, b) => b.pricePerNight - a.pricePerNight);
  }
  if (filters.sort === 'ratingAsc') {
    items.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
  }
  if (filters.sort === 'ratingDesc') {
    items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }
  return { items, total: items.length };
};

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toPositiveInt = (value: unknown): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const rounded = Math.trunc(parsed);
  return rounded > 0 ? rounded : null;
};

const isRemoteImage = (value?: string) => /^https?:\/\//i.test((value ?? '').trim());

const splitAddress = (address?: string) => {
  const source = (address ?? '').trim();
  if (!source) {
    return { street: '', houseNumber: '1' };
  }
  const match = source.match(/^(.*?)(\d+[a-zA-Z\u0410-\u044f\/\-]*)$/);
  if (!match) {
    return { street: source, houseNumber: '1' };
  }
  const street = (match[1] ?? '').trim().replace(/[,\s]+$/, '');
  const houseNumber = (match[2] ?? '').trim() || '1';
  return {
    street: street || source,
    houseNumber,
  };
};

const buildDefaultDetailsParams = () => {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  return {
    startDate: today.toISOString(),
    endDate: tomorrow.toISOString(),
    guests: '2',
    adults: '2',
    children: '0',
    rooms: '1',
    userDiscountPercent: '0',
  };
};

const extractApiPayload = (data: any) => Array.isArray(data) ? data[0] : (data?.data?.[0] ?? data?.data ?? data);

const resolveCreatedOfferId = (data: any): number | null => {
  if (typeof data === 'number') return data;
  if (typeof data === 'string') {
    const parsed = Number(data);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const candidate = data?.id ?? data?.offerId ?? data?.idOffer ?? data?.data?.id ?? data?.data?.offerId;
  return toPositiveInt(candidate);
};

const uploadOfferImages = async (offerId: number, images?: string[]) => {
  const localImages = (images ?? []).filter((uri) => uri && !isRemoteImage(uri));
  if (!localImages.length) return;

  const formData = new FormData();
  localImages.forEach((uri, index) => {
    formData.append('files', {
      uri,
      name: `offer-${offerId}-${index + 1}.jpg`,
      type: 'image/jpeg',
    } as any);
  });

  await apiClient.post(`/Bff/img/booking-offer/${offerId}/add`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

type OfferRuntimeMeta = {
  offerId?: number;
  rentObjId?: number;
  countryId?: number;
  regionId?: number;
  cityId?: number;
  districtId?: number;
  postcode?: string;
  latitude?: number;
  longitude?: number;
};

const fetchOfferRuntimeMeta = async (id: string, lang: string): Promise<OfferRuntimeMeta> => {
  try {
    const { data } = await apiClient.get<any>(ENDPOINTS.offers.fullById(id, lang), {
      params: buildDefaultDetailsParams(),
    });
    const raw = extractApiPayload(data);
    const rentObj = Array.isArray(raw?.rentObj) ? raw.rentObj[0] : raw?.rentObj;
    return {
      offerId: toPositiveInt(raw?.id ?? id) ?? undefined,
      rentObjId: toPositiveInt(rentObj?.id) ?? undefined,
      countryId: toPositiveInt(rentObj?.countryId) ?? undefined,
      regionId: toPositiveInt(rentObj?.regionId) ?? undefined,
      cityId: toPositiveInt(rentObj?.cityId) ?? undefined,
      districtId: toPositiveInt(rentObj?.districtId) ?? undefined,
      postcode: (rentObj?.postcode ?? '').toString().trim() || undefined,
      latitude: Number.isFinite(Number(rentObj?.latitude)) ? Number(rentObj.latitude) : undefined,
      longitude: Number.isFinite(Number(rentObj?.longitude)) ? Number(rentObj.longitude) : undefined,
    };
  } catch {
    return {};
  }
};

const buildBffOfferPayload = async (
  payload: Partial<Offer>,
  options: { lang: string; existing?: OfferRuntimeMeta; offerId?: number } = { lang: 'en' },
) => {
  const lang = options.lang;
  const existing = options.existing ?? {};
  const address = payload.address?.trim() ?? '';
  const { street, houseNumber } = splitAddress(address);

  const amenitiesCatalog = await paramService.getAmenities();
  const amenityIdByName = new Map(
    amenitiesCatalog.map((item) => [normalizeText(item.name), toPositiveInt(item.id) ?? 0]),
  );
  const amenityParamIds = Array.from(
    new Set(
      (payload.amenities ?? [])
        .map((name) => amenityIdByName.get(normalizeText(name)) ?? 0)
        .filter((id) => id > 0),
    ),
  );

  let resolvedCityId =
    toPositiveInt(payload.city?.id) ??
    existing.cityId ??
    null;
  if (!resolvedCityId) {
    const cities = await cityService.getAll();
    resolvedCityId = toPositiveInt(cities[0]?.id) ?? 1;
  }

  const offerId = options.offerId ?? existing.offerId ?? 0;
  const rentObjId = existing.rentObjId ?? 0;
  const remoteImages = (payload.images ?? []).filter((uri) => isRemoteImage(uri));

  return {
    id: offerId,
    Title: payload.title?.trim() || 'Новий обʼєкт',
    Description: payload.description?.trim() || '',
    TitleInfo: (payload.description?.trim() || '').slice(0, 120),
    PricePerDay: toNumber(payload.pricePerNight, 0),
    PricePerWeek: null,
    PricePerMonth: null,
    Tax: null,
    MinRentDays: 1,
    AllowPets: false,
    AllowSmoking: false,
    AllowChildren: true,
    AllowParties: false,
    MaxGuests: toNumber(payload.maxGuests ?? payload.guests, 1),
    CheckInTime: '11:00:00',
    CheckOutTime: '15:00:00',
    OwnerId: toPositiveInt(payload.ownerId) ?? undefined,
    RentObj: {
      id: rentObjId,
      OfferId: offerId,
      CountryId: existing.countryId ?? 1,
      RegionId: existing.regionId ?? 1,
      CityId: resolvedCityId,
      DistrictId: existing.districtId ?? 1,
      CountryTitle: payload.city?.country || '',
      CityTitle: payload.city?.name || '',
      CityLatitude: null,
      CityLongitude: null,
      Latitude: existing.latitude ?? 0,
      Longitude: existing.longitude ?? 0,
      Street: street,
      HouseNumber: houseNumber,
      Postcode: existing.postcode ?? '00000',
      RoomCount: toNumber(payload.bedrooms, 1),
      LivingRoomCount: 0,
      BathroomCount: 1,
      Area: 0,
      TotalBedsCount: toNumber(payload.guests, 1),
      SingleBedsCount: 1,
      DoubleBedsCount: 1,
      HasBabyCrib: false,
      ParamValues: amenityParamIds.map((paramItemId) => ({
        id: 0,
        RentObjId: rentObjId,
        ParamItemId: paramItemId,
        ValueBool: true,
        ValueInt: 0,
        ValueString: '',
      })),
      Images: remoteImages.map((url) => ({
        id: 0,
        Url: url,
        RentObjId: rentObjId,
      })),
    },
  };
};

export const offerService = {
  getAll: async (filters: OfferFilters = {}) => {
    if (USE_MOCKS_SEARCH) {
      return getMockOffersByFilters(filters);
    }
    const lang = getApiLang();
    const params: Record<string, string | number> = {};
    const cities = !filters.cityId ? await cityService.getAll() : [];
    if (filters.cityId) {
      params.cityId = filters.cityId;
    } else if (filters.cityName) {
      const matched = cities.find(
        (city) => city.name.toLowerCase() === filters.cityName?.toLowerCase(),
      );
      if (matched) params.cityId = matched.id;
    } else if (cities.length > 0) {
      params.cityId = cities[0].id;
    }
    const adults = Math.max(1, filters.guests ?? 1);
    const children = 0;
    const rooms = 1;
    params.guests = adults + children;
    params.adults = adults;
    params.children = children;
    params.rooms = rooms;
    if (filters.dates?.from && filters.dates?.to) {
      params.startDate = filters.dates.from;
      params.endDate = filters.dates.to;
    }
    if (!params.startDate || !params.endDate) {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      params.startDate = params.startDate ?? today.toISOString();
      params.endDate = params.endDate ?? tomorrow.toISOString();
    }
    const token = getAuthState().token;
    const endpoint = token
      ? ENDPOINTS.offers.searchShort(lang)
      : ENDPOINTS.offers.searchPublic(lang);
    if (!params.cityId) return { items: [], total: 0 };
    try {
      const { data } = await apiClient.get<any>(endpoint, {
        params: token ? params : { ...params, userDiscountPercent: 0 },
      });
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      if (list.length === 0) {
        return getMockOffersByFilters(filters);
      }
      const items = list.map((raw) => {
        const mapped = mapOfferShort(raw);
        const mockMatch = findMockOfferMatch(mapped);
        const merged = mergeOfferWithMock(mapped, mockMatch);
        debugOfferSource('getAll item resolved', {
          offerId: merged.id,
          mode: mockMatch ? 'api+mock-merge' : 'api',
          hasApiImages: Boolean(mapped.images?.length),
          hasMergedImages: Boolean(merged.images?.length),
        });
        return merged;
      });
      return { items, total: items.length };
    } catch (error) {
      console.warn('[offerService.getAll] API fallback to mock list', error);
      debugOfferSource('getAll fallback to mock list (api error)', {
        reason: 'api_error',
      });
      return getMockOffersByFilters(filters);
    }
  },
  getById: async (id: string) => {
    if (USE_MOCKS_SEARCH) {
      const offer = mockOffers.find((item) => item.id === id);
      if (!offer) throw new Error('Предложение не найдено');
      return offer;
    }
    const lang = getApiLang();
    const params: Record<string, string> = {};
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    params.startDate = today.toISOString();
    params.endDate = tomorrow.toISOString();
    params.guests = '2';
    params.adults = '2';
    params.children = '0';
    params.rooms = '1';
    params.userDiscountPercent = '0';

    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.offers.fullById(id, lang), { params });
      const payload = Array.isArray(data) ? data[0] : (data?.data?.[0] ?? data?.data ?? data);
      if (!payload) throw new Error('Предложение не найдено');
      const mapped = mapOfferFull(payload);
      const mockMatch = mockOffers.find((item) => item.id === id) ?? findMockOfferMatch(mapped);
      const merged = mergeOfferWithMock(mapped, mockMatch);
      debugOfferSource('getById resolved', {
        offerId: id,
        mode: mockMatch ? 'api+mock-merge' : 'api',
        hasApiRooms: Boolean(mapped.rooms?.length),
        hasMergedRooms: Boolean(merged.rooms?.length),
        hasApiAmenities: Boolean(mapped.amenities?.length),
        hasMergedAmenities: Boolean(merged.amenities?.length),
      });
      return merged;
    } catch (error) {
      const mockOffer = mockOffers.find((item) => item.id === id);
      if (mockOffer) {
        console.warn('[offerService.getById] API fallback to mock offer', error);
        debugOfferSource('getById fallback to mock offer (api error)', {
          offerId: id,
          reason: 'api_error',
        });
        return mockOffer;
      }
      throw toUserFacingApiError(error, 'Не удалось загрузить предложение.');
    }
  },
  create: async (payload: Partial<Offer>): Promise<Offer> => {
    if (USE_MOCKS_SEARCH) {
      const offer: Offer = {
        id: `mock-offer-${Date.now()}`,
        title: payload.title ?? 'Новый объект',
        description: payload.description ?? '',
        city: payload.city ?? { id: 'city-1', name: 'Одесса', country: 'Украина' },
        address: payload.address ?? '',
        pricePerNight: payload.pricePerNight ?? 100,
        rating: payload.rating ?? 4.8,
        guests: payload.guests ?? 2,
        maxGuests: payload.maxGuests ?? payload.guests ?? 2,
        stock: payload.stock ?? 1,
        bedrooms: payload.bedrooms ?? 1,
        amenities: payload.amenities ?? [],
        images: payload.images ?? [],
        ownerId: payload.ownerId ?? 'owner-1',
        owner: payload.owner,
        isActive: payload.isActive ?? true,
        type: payload.type ?? 'apartment',
        highlights: payload.highlights ?? [],
        reviews: payload.reviews ?? [],
        rooms: payload.rooms ?? [],
      };
      mockOffers.unshift(offer);
      return offer;
    }
    const lang = getApiLang();
    const requestPayload = await buildBffOfferPayload(payload, { lang });
    try {
      const { data } = await apiClient.post<any>(
        `/Bff/create/booking-offer?lang=${encodeURIComponent(lang)}`,
        requestPayload,
      );
      const createdId = resolveCreatedOfferId(data);
      if (!createdId) {
        throw new Error('BFF did not return created offer id');
      }
      await uploadOfferImages(createdId, payload.images);
      const saved = await offerService.getById(String(createdId));
      return saved;
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось создать объявление.');
    }
  },
  update: async (id: string, payload: Partial<Offer>): Promise<Offer> => {
    if (USE_MOCKS_SEARCH) {
      const index = mockOffers.findIndex((item) => item.id === id);
      const existing = index >= 0 ? mockOffers[index] : undefined;
      if (!existing) throw new Error('Предложение не найдено');
      const updated: Offer = {
        ...existing,
        ...payload,
        city: payload.city ?? existing.city,
        amenities: payload.amenities ?? existing.amenities,
        images: payload.images ?? existing.images,
        reviews: payload.reviews ?? existing.reviews ?? [],
        rooms: payload.rooms ?? existing.rooms ?? [],
      };
      mockOffers[index] = updated;
      return updated;
    }
    const lang = getApiLang();
    const existingMeta = await fetchOfferRuntimeMeta(id, lang);
    const requestPayload = await buildBffOfferPayload(payload, {
      lang,
      existing: existingMeta,
      offerId: toPositiveInt(id) ?? existingMeta.offerId ?? 0,
    });
    try {
      await apiClient.post<any>(
        `/Bff/update/booking-offer?lang=${encodeURIComponent(lang)}`,
        requestPayload,
      );
      const offerId = toPositiveInt(id) ?? existingMeta.offerId;
      if (offerId) {
        await uploadOfferImages(offerId, payload.images);
      }
      const saved = await offerService.getById(id);
      return saved;
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось обновить объявление.');
    }
  },
  remove: async (id: string): Promise<void> => {
    if (USE_MOCKS_SEARCH) {
      const index = mockOffers.findIndex((item) => item.id === id);
      if (index >= 0) {
        mockOffers.splice(index, 1);
      }
      return;
    }
    throw new Error('Удаление объявлений через мобильное приложение пока не подключено к API');
  },
};
