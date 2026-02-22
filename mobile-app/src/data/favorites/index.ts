import { FAVORITES, type FavoriteItem } from './favorites.mock';

// Mock repository for favorites. Swap implementations to API calls later.
let store: FavoriteItem[] = [...FAVORITES];

export const FavoritesRepository = {
  async getByUser(userId: string): Promise<FavoriteItem[]> {
    return store.filter((item) => item.userId === userId);
  },

  async add(userId: string, offerId: string): Promise<FavoriteItem> {
    const exists = store.find((f) => f.userId === userId && f.offerId === offerId);
    if (exists) return exists;
    const item: FavoriteItem = {
      id: `fav-${Date.now()}`,
      offerId,
      userId,
      createdAt: new Date().toISOString(),
    };
    store = [item, ...store];
    return item;
  },

  async remove(id: string): Promise<void> {
    store = store.filter((item) => item.id !== id);
  },
};

export type { FavoriteItem };
