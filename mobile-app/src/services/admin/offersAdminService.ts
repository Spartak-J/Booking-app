import { HOTELS } from '@/data/hotels/hotels.mock';
import { OWNERS } from '@/data/hotels/owners.mock';
import { REVIEWS } from '@/data/hotels/reviews.mock';
import type { Hotel, Owner } from '@/data/types';
import { offerService } from '@/services/offerService';
import { usersAdminService } from '@/services/admin/usersAdminService';

export type AdminOffer = Hotel & {
  owner?: Owner;
  reviewsCount: number;
};

const withMeta = (hotel: Hotel): AdminOffer => ({
  ...hotel,
  owner: OWNERS.find((entry) => entry.id === hotel.ownerId),
  reviewsCount: REVIEWS.filter((entry) => entry.hotelId === hotel.id).length,
});

const mapOfferToAdminOffer = (
  offer: {
    id: string;
    title: string;
    city?: { name?: string };
    address?: string;
    rating?: number;
    description?: string;
    amenities?: string[];
    ownerId?: string;
    reviews?: unknown[];
  },
  ownerById: Map<string, Owner>,
): AdminOffer => ({
  id: offer.id,
  name: offer.title || 'Оголошення',
  city: offer.city?.name || '-',
  address: offer.address || '-',
  rating: typeof offer.rating === 'number' ? offer.rating : 0,
  description: offer.description || '',
  amenities: offer.amenities ?? [],
  ownerId: offer.ownerId || '',
  owner: ownerById.get(offer.ownerId || ''),
  reviewsCount: Array.isArray(offer.reviews) ? offer.reviews.length : 0,
});

export const offersAdminService = {
  getAll: async (): Promise<AdminOffer[]> => {
    try {
      const [{ items }, users] = await Promise.all([
        offerService.getAll({ onlyActive: false }),
        usersAdminService.getUsers(),
      ]);

      if (items.length > 0) {
        const ownerById = new Map<string, Owner>(
          users.map((user) => [
            user.id,
            {
              id: user.id,
              name: user.name,
              phone: user.phone,
              email: user.email,
            },
          ]),
        );
        return items.map((item) => mapOfferToAdminOffer(item as any, ownerById));
      }
    } catch (error) {
      console.warn('[offersAdminService.getAll] API fallback to mocks', error);
    }
    return HOTELS.map(withMeta);
  },

  getById: async (id: string): Promise<AdminOffer | null> => {
    const hotel = HOTELS.find((entry) => entry.id === id);
    return hotel ? withMeta(hotel) : null;
  },
};
