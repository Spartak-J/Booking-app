import apiClient from '@/api/client';
import { USE_MOCKS } from '@/config/constants';
import { ApiResponse, Offer, PaginatedResponse } from '@/types';
import { mockOffers } from '@/utils/mockData';
import { getAuthState } from '@/store/authStore';
import { ENDPOINTS } from '@/config/endpoints';

export type OfferFilters = {
  cityId?: string;
  cityName?: string;
  categoryId?: string;
  amenities?: string[];
  dates?: { from: string; to: string };
  guests?: number;
  sort?: 'price' | 'popularity' | 'rating';
};

export const offerService = {
  getAll: async (filters: OfferFilters = {}) => {
    if (USE_MOCKS) {
      let items = [...mockOffers];
      if (filters.cityName) {
        items = items.filter((o) =>
          o.city.name.toLowerCase().includes(filters.cityName!.toLowerCase()),
        );
      }
      if (filters.guests) {
        items = items.filter((o) => o.guests >= (filters.guests ?? 0));
      }
      if (filters.sort === 'price') items = items.sort((a, b) => a.pricePerNight - b.pricePerNight);
      if (filters.sort === 'rating')
        items = items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      if (filters.amenities && filters.amenities.length) {
        items = items.filter((o) => filters.amenities!.every((a) => o.amenities.includes(a)));
      }
      return Promise.resolve({ items, total: items.length });
    }
    const params: Record<string, string | number> = {};
    if (filters.cityId) params.cityId = filters.cityId;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.guests) params.guests = filters.guests;
    if (filters.sort) params.sort = filters.sort;
    if (filters.dates) {
      params.from = filters.dates.from;
      params.to = filters.dates.to;
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Offer>>>(
      ENDPOINTS.rent.list,
      { params },
    );
    return data.data;
  },
  getById: async (id: string) => {
    if (USE_MOCKS) {
      const offer = mockOffers.find((o) => o.id === id);
      if (!offer) throw new Error('Offer not found');
      return Promise.resolve(offer);
    }
    const { data } = await apiClient.get<ApiResponse<Offer>>(ENDPOINTS.rent.byId(id));
    return data.data;
  },
  create: async (payload: Partial<Offer>) => {
    if (USE_MOCKS) {
      const newOffer: Offer = {
        ...mockOffers[0],
        ...payload,
        id: `offer-${mockOffers.length + 1}`,
        title: payload.title ?? 'Новый объект',
        images: payload.images ?? mockOffers[0].images,
        ownerId: payload.ownerId ?? getAuthState().user?.id ?? 'owner-1',
        isActive: true,
      };
      mockOffers.push(newOffer);
      return Promise.resolve(newOffer);
    }
    const { data } = await apiClient.post<ApiResponse<Offer>>(ENDPOINTS.rent.create, payload);
    return data.data;
  },
  update: async (id: string, payload: Partial<Offer>) => {
    if (USE_MOCKS) {
      const idx = mockOffers.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error('Offer not found');
      mockOffers[idx] = { ...mockOffers[idx], ...payload };
      return Promise.resolve(mockOffers[idx]);
    }
    const { data } = await apiClient.patch<ApiResponse<Offer>>(ENDPOINTS.rent.update(id), payload);
    return data.data;
  },
  remove: async (id: string) => {
    if (USE_MOCKS) {
      const idx = mockOffers.findIndex((o) => o.id === id);
      if (idx !== -1) mockOffers.splice(idx, 1);
      return Promise.resolve();
    }
    await apiClient.delete(ENDPOINTS.rent.delete(id));
  },
};
