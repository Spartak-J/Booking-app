import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { getAuthState } from '@/store/authStore';
import { getApiLang } from '@/utils/apiAdapters';
import { toUserFacingApiError } from '@/utils/apiError';

type FavoriteHistoryItem = {
  offerId?: number | string;
  OfferId?: number | string;
  isFavorites?: boolean;
  IsFavorites?: boolean;
};

const readArray = (payload: any): FavoriteHistoryItem[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const toOfferId = (item: FavoriteHistoryItem): string => {
  const raw = item.offerId ?? item.OfferId ?? '';
  return String(raw);
};

const isFavorite = (item: FavoriteHistoryItem): boolean => {
  return item.isFavorites === true || item.IsFavorites === true;
};

export const favoritesService = {
  async getFavoriteOfferIds(): Promise<string[]> {
    const token = getAuthState().token;
    if (!token) {
      return [];
    }
    const lang = getApiLang();
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.user.historyOffers(lang));
      const list = readArray(data);
      return list.filter(isFavorite).map(toOfferId).filter(Boolean);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        return [];
      }
      throw toUserFacingApiError(error, 'Не удалось загрузить избранные объявления.');
    }
  },
  async addFavoriteOffer(offerId: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.user.addFavoriteOffer(offerId));
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось добавить объявление в избранное.');
    }
  },
};
