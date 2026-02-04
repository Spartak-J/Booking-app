import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang, mapReview } from '@/utils/apiAdapters';
import { Review } from '@/types';
import { getAuthState } from '@/store/authStore';
import { USE_MOCKS } from '@/config/constants';
import { mockReviews } from '@/utils/mockData';

type ReviewPayload = {
  bookingId: string;
  offerId: string;
  rating: number;
  comment: string;
};

export const reviewService = {
  getByOfferId: async (offerId: string) => {
    if (USE_MOCKS) {
      return mockReviews.filter((review) => review.offerId === offerId);
    }
    const lang = getApiLang();
    const { data } = await apiClient.post<any>(ENDPOINTS.reviews.byOffer(offerId, lang));
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    return list.map(mapReview);
  },
  getByBookingId: async (bookingId: string) => {
    if (USE_MOCKS) {
      return mockReviews.find((review) => review.bookingId === bookingId);
    }
    const lang = getApiLang();
    const userReviews = await reviewService.getByUser(lang);
    return userReviews.find((review) => review.bookingId === bookingId);
  },
  getByUser: async (lang?: string) => {
    if (USE_MOCKS) return mockReviews;
    const resolvedLang = lang ?? getApiLang();
    const { data } = await apiClient.post<any>(ENDPOINTS.reviews.byUser(resolvedLang));
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    return list.map(mapReview);
  },
  create: async (payload: ReviewPayload) => {
    if (USE_MOCKS) {
      return {
        id: `mock-review-${Date.now()}`,
        offerId: payload.offerId,
        bookingId: payload.bookingId,
        userName: 'Guest',
        rating: payload.rating,
        comment: payload.comment,
        createdAt: new Date().toISOString(),
        status: 'published',
      };
    }
    const lang = getApiLang();
    const rating = payload.rating;
    const body = {
      comment: payload.comment,
      staff: rating,
      facilities: rating,
      cleanliness: rating,
      comfort: rating,
      valueForMoney: rating,
      location: rating,
      createdAt: new Date().toISOString(),
      isApproved: true,
    };
    const { data } = await apiClient.post<any>(ENDPOINTS.reviews.create(payload.bookingId), body, {
      params: { lang },
    });
    const result = Array.isArray(data) ? data[0] : (data?.data ?? data);
    return mapReview({ ...result, offerId: payload.offerId, orderId: payload.bookingId });
  },
  update: async (id: string, payload: Pick<Review, 'rating' | 'comment'>, bookingId?: string) => {
    if (USE_MOCKS) {
      const existing = mockReviews.find((review) => review.id === id);
      return {
        id,
        offerId: existing?.offerId ?? 'offer-1',
        bookingId: bookingId ?? existing?.bookingId ?? 'booking-1',
        userName: existing?.userName ?? 'Guest',
        rating: payload.rating,
        comment: payload.comment,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        status: 'published',
      };
    }
    const lang = getApiLang();
    const rating = payload.rating;
    const body = {
      comment: payload.comment,
      staff: rating,
      facilities: rating,
      cleanliness: rating,
      comfort: rating,
      valueForMoney: rating,
      location: rating,
      createdAt: new Date().toISOString(),
      isApproved: true,
    };
    const orderId = bookingId ?? '';
    const { data } = await apiClient.post<any>(ENDPOINTS.reviews.update(orderId, id, lang), body, {
      params: { lang },
    });
    const result = Array.isArray(data) ? data[0] : (data?.data ?? data);
    return mapReview(result);
  },
  remove: async (id: string, bookingId?: string) => {
    if (USE_MOCKS) return;
    const userId = getAuthState().user?.id;
    if (!userId) throw new Error('Не удалось определить пользователя');
    const orderId = bookingId ?? id;
    await apiClient.delete(ENDPOINTS.reviews.delete(userId, orderId, id));
  },
};
