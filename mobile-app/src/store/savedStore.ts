import { create } from 'zustand';
import { FavoritesRepository } from '@/data/favorites';

type SavedState = {
  savedIds: string[];
  favoriteIdsByOfferId: Record<string, string>;
  hydratedUserId: string | null;
  hydrateForUser: (userId: string) => Promise<void>;
  reset: () => void;
  toggleForUser: (userId: string, offerId: string) => Promise<void>;
  isSaved: (id: string) => boolean;
};

export const useSavedStore = create<SavedState>((set, get) => ({
  savedIds: [],
  favoriteIdsByOfferId: {},
  hydratedUserId: null,
  hydrateForUser: async (userId: string) => {
    if (!userId || get().hydratedUserId === userId) return;
    const items = await FavoritesRepository.getByUser(userId);
    const favoriteIdsByOfferId = items.reduce<Record<string, string>>((acc, item) => {
      acc[item.offerId] = item.id;
      return acc;
    }, {});
    set({
      hydratedUserId: userId,
      savedIds: items.map((item) => item.offerId),
      favoriteIdsByOfferId,
    });
  },
  reset: () =>
    set({
      savedIds: [],
      favoriteIdsByOfferId: {},
      hydratedUserId: null,
    }),
  toggleForUser: async (userId: string, offerId: string) => {
    if (!userId || !offerId) return;

    const { hydratedUserId, favoriteIdsByOfferId } = get();
    if (hydratedUserId !== userId) {
      await get().hydrateForUser(userId);
    }

    const currentFavoriteId = favoriteIdsByOfferId[offerId];

    if (currentFavoriteId) {
      await FavoritesRepository.remove(currentFavoriteId);
    } else {
      await FavoritesRepository.add(userId, offerId);
    }

    await get().hydrateForUser(userId);
    if (get().hydratedUserId !== userId) {
      const items = await FavoritesRepository.getByUser(userId);
      const refreshedMap = items.reduce<Record<string, string>>((acc, item) => {
        acc[item.offerId] = item.id;
        return acc;
      }, {});
      set({
        hydratedUserId: userId,
        savedIds: items.map((item) => item.offerId),
        favoriteIdsByOfferId: refreshedMap,
      });
    } else {
      const items = await FavoritesRepository.getByUser(userId);
      const refreshedMap = items.reduce<Record<string, string>>((acc, item) => {
        acc[item.offerId] = item.id;
        return acc;
      }, {});
      set({
        savedIds: items.map((item) => item.offerId),
        favoriteIdsByOfferId: refreshedMap,
      });
    }
  },
  isSaved: (id: string) => get().savedIds.includes(id),
}));
