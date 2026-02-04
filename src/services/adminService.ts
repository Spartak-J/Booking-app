import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { Booking, Offer, Payment, User } from '@/types';
import { mapBooking, mapOfferFull, mapUser } from '@/utils/apiAdapters';
import { offerService } from '@/services/offerService';

export const adminService = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.user.all);
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    return list.map(mapUser);
  },
  getUserById: async (id: string): Promise<User | null> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.user.byId(id));
    const payload = Array.isArray(data) ? data[0] : (data?.data ?? data);
    return payload ? mapUser(payload) : null;
  },
  getOffers: async (): Promise<Offer[]> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.offers.allRaw);
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    return list.map(mapOfferFull);
  },
  getOfferById: async (id: string): Promise<Offer | null> => {
    return offerService.getById(id);
  },
  getUserOffers: async (userId: string): Promise<Offer[]> => {
    const offers = await adminService.getOffers();
    return offers.filter((offer) => offer.ownerId === userId);
  },
  getBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.booking.all);
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    return list.map(mapBooking);
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
