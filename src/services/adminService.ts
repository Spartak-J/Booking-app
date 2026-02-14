import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { Booking, Offer, Payment } from '@/types';
import { mapBooking, mapOfferFull } from '@/utils/apiAdapters';
import { offerService } from '@/services/offerService';
import { usersAdminService } from '@/services/admin';

export const adminService = {
  getUsers: usersAdminService.getUsers,
  getUserById: usersAdminService.getUserById,
  toggleUserBlocked: usersAdminService.toggleUserBlocked,
  getOffers: async (): Promise<Offer[]> => {
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.offers.allRaw);
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      return list.map(mapOfferFull);
    } catch (error) {
      console.warn('[adminService.getOffers] API fallback to empty list', error);
      return [];
    }
  },
  getOfferById: async (id: string): Promise<Offer | null> => {
    return offerService.getById(id);
  },
  getUserOffers: async (userId: string): Promise<Offer[]> => {
    const offers = await adminService.getOffers();
    return offers.filter((offer) => offer.ownerId === userId);
  },
  getBookings: async (): Promise<Booking[]> => {
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.booking.all);
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      return list.map(mapBooking);
    } catch (error) {
      console.warn('[adminService.getBookings] API fallback to empty list', error);
      return [];
    }
  },
  getBookingsByUser: async (userId: string): Promise<Booking[]> => {
    const bookings = await adminService.getBookings();
    return bookings.filter((booking) => booking.userId === userId);
  },
  getBookingsByOffer: async (offerId: string): Promise<Booking[]> => {
    const bookings = await adminService.getBookings();
    return bookings.filter((booking) => booking.offerId === offerId);
  },
  getPayments: async (): Promise<Payment[]> => [],
};
