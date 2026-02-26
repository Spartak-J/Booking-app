import { Booking } from '@/types';
import { BOOKINGS } from './bookings.mock';

// Mock repository. Replace with API calls later without changing UI consumers.
export const BookingRepository = {
  async getAll(): Promise<Booking[]> {
    return Promise.resolve(BOOKINGS);
  },

  async getById(id: string): Promise<Booking | undefined> {
    return Promise.resolve(BOOKINGS.find((booking) => booking.orderId === id || booking.id === id));
  },

  async getByHotelId(hotelId: string): Promise<Booking[]> {
    return Promise.resolve(BOOKINGS.filter((booking) => booking.hotelId === hotelId));
  },

  async getByUserId(userId: string): Promise<Booking[]> {
    return Promise.resolve(BOOKINGS.filter((booking) => booking.userId === userId));
  },

  async addBooking(booking: Booking): Promise<Booking> {
    BOOKINGS.unshift(booking);
    return Promise.resolve(booking);
  },

  async updateStatus(id: string, status: Booking['status']): Promise<Booking | undefined> {
    const index = BOOKINGS.findIndex((booking) => booking.orderId === id || booking.id === id);
    if (index < 0) return Promise.resolve(undefined);
    BOOKINGS[index] = { ...BOOKINGS[index], status };
    return Promise.resolve(BOOKINGS[index]);
  },
};
