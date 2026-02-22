import { HOTELS } from '@/data/hotels/hotels.mock';
import { OWNERS } from '@/data/hotels/owners.mock';
import { REVIEWS } from '@/data/hotels/reviews.mock';
import type { Hotel, Owner } from '@/data/types';

export type AdminOffer = Hotel & {
  owner?: Owner;
  reviewsCount: number;
};

const withMeta = (hotel: Hotel): AdminOffer => ({
  ...hotel,
  owner: OWNERS.find((entry) => entry.id === hotel.ownerId),
  reviewsCount: REVIEWS.filter((entry) => entry.hotelId === hotel.id).length,
});

export const offersAdminService = {
  getAll: async (): Promise<AdminOffer[]> => {
    return HOTELS.map(withMeta);
  },

  getById: async (id: string): Promise<AdminOffer | null> => {
    const hotel = HOTELS.find((entry) => entry.id === id);
    return hotel ? withMeta(hotel) : null;
  },
};
