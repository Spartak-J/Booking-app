import { Offer } from '@/types';
import { OfferFilters, offerService } from '@/services/offerService';

export const ownerOffersService = {
  getOwnerOffers: async (ownerId?: string, filters: OfferFilters = {}) => {
    const result = await offerService.getAll(filters);
    if (!ownerId) {
      return { items: result.items, total: result.total };
    }
    const items = result.items.filter((item) => item.ownerId === ownerId);
    return { items, total: items.length };
  },

  getById: async (offerId: string) => {
    return offerService.getById(offerId);
  },

  create: async (payload: Partial<Offer>) => {
    return offerService.create(payload);
  },

  update: async (offerId: string, payload: Partial<Offer>) => {
    return offerService.update(offerId, payload);
  },
};
