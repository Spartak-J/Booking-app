import { Booking } from '@/types';
import { mockBookings } from '@/utils/mockData';

// Mock repository. Replace with API calls later without changing UI consumers.
export const BookingRepository = {
  async getAll(): Promise<Booking[]> {
    return Promise.resolve(mockBookings);
  },

  async getById(id: string): Promise<Booking | undefined> {
    return Promise.resolve(mockBookings.find((booking) => booking.id === id));
  },

  async getByHotelId(hotelId: string): Promise<Booking[]> {
    return Promise.resolve(mockBookings.filter((booking) => booking.hotelId === hotelId));
  },

  async getByUserId(userId: string): Promise<Booking[]> {
    return Promise.resolve(mockBookings.filter((booking) => booking.userId === userId));
  },

  async addBooking(booking: Booking): Promise<Booking> {
    mockBookings.unshift(booking);
    return Promise.resolve(booking);
  },
};
