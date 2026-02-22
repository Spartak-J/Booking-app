import { Booking } from '@/types';
import { bookingService } from '@/services/bookingService';

export const ownerBookingsService = {
  getOwnerBookings: async (
    ownerId: string,
    filters?: { from?: string; to?: string; offerId?: string },
  ) => {
    return bookingService.getOwnerBookings(ownerId, filters);
  },

  updateStatus: async (bookingId: string, status: Booking['status']) => {
    return bookingService.updateStatus(bookingId, status);
  },
};
