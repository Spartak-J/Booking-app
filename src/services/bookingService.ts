import apiClient from '@/api/client';
import { USE_MOCKS } from '@/config/constants';
import { ApiResponse, Booking, PaginatedResponse } from '@/types';
import { mockBookings, mockOffers } from '@/utils/mockData';
import { getAuthState } from '@/store/authStore';
import { ENDPOINTS } from '@/config/endpoints';

type CreateBookingPayload = {
  offerId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export const bookingService = {
  create: async (payload: CreateBookingPayload) => {
    if (USE_MOCKS) {
      const newBooking: Booking = {
        id: `booking-${mockBookings.length + 1}`,
        userId: getAuthState().user?.id ?? 'user-1',
        totalPrice: 0,
        status: 'pending',
        ...payload,
      };
      mockBookings.push(newBooking);
      return Promise.resolve(newBooking);
    }
    const { data } = await apiClient.post<ApiResponse<Booking>>(ENDPOINTS.booking.create, payload);
    return data.data;
  },
  getUserBookings: async (userId: string) => {
    if (USE_MOCKS) {
      const items = mockBookings.filter((b) => b.userId === userId || userId === '');
      return Promise.resolve({ items, total: items.length });
    }
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      ENDPOINTS.booking.user(userId),
    );
    return data.data;
  },
  getOwnerBookings: async (ownerId: string) => {
    if (USE_MOCKS) {
      const offerIds = mockOffers.filter((o) => o.ownerId === ownerId).map((o) => o.id);
      const items = mockBookings.filter((b) => offerIds.includes(b.offerId));
      return Promise.resolve({ items, total: items.length });
    }
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      ENDPOINTS.booking.owner(ownerId),
    );
    return data.data;
  },
  getById: async (bookingId: string) => {
    if (USE_MOCKS) {
      return Promise.resolve(mockBookings.find((b) => b.id === bookingId));
    }
    const { data } = await apiClient.get<ApiResponse<Booking>>(ENDPOINTS.booking.byId(bookingId));
    return data.data;
  },
  cancel: async (bookingId: string) => {
    if (USE_MOCKS) {
      const idx = mockBookings.findIndex((b) => b.id === bookingId);
      if (idx !== -1) mockBookings[idx].status = 'cancelled';
      return Promise.resolve();
    }
    await apiClient.delete(ENDPOINTS.booking.delete(bookingId));
  },
};
