// Mock избранного: offerId + userId.
export type FavoriteItem = {
  id: string;
  offerId: string;
  userId: string;
  createdAt: string;
};

export const FAVORITES: FavoriteItem[] = [
  {
    id: 'fav-1',
    offerId: 'offer-1',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fav-2',
    offerId: 'offer-2',
    userId: 'user-1',
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
];
