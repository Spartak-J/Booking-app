import apiClient from '@/api/client';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang, mapReview } from '@/utils/apiAdapters';
import { Review } from '@/types';
import { getAuthState } from '@/store/authStore';
import { USE_MOCKS } from '@/config/constants';
import { mockOffers, mockReviews } from '@/utils/mockData';
import { BookingRepository } from '@/data/bookings';
import { toUserFacingApiError } from '@/utils/apiError';

type ReviewPayload = {
  bookingId: string;
  offerId: string;
  rating: number;
  comment: string;
};

const isEligibleCheckoutDate = (checkOut: string) => {
  const checkoutDate = new Date(checkOut);
  if (Number.isNaN(checkoutDate.getTime())) return false;
  checkoutDate.setHours(0, 0, 0, 0);
  checkoutDate.setDate(checkoutDate.getDate() + 1);

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime() >= checkoutDate.getTime();
};

export const reviewService = {
  canLeaveReview: async (bookingId: string, userId?: string) => {
    if (!USE_MOCKS) return { allowed: true as const };

    const currentUserId = userId ?? getAuthState().user?.id;
    if (!currentUserId) return { allowed: false as const, reason: 'auth.book.message' };

    const booking = await BookingRepository.getById(bookingId);
    if (!booking) return { allowed: false as const, reason: 'bookings.notFound' };
    if (booking.userId !== currentUserId) {
      return { allowed: false as const, reason: 'bookings.review.notAllowed' };
    }
    if (booking.status !== 'completed') {
      return { allowed: false as const, reason: 'bookings.review.notAllowed' };
    }
    if (!isEligibleCheckoutDate(booking.checkOut)) {
      return { allowed: false as const, reason: 'bookings.review.afterCheckout' };
    }
    return { allowed: true as const };
  },
  getByOfferId: async (offerId: string) => {
    if (USE_MOCKS) {
      return mockReviews.filter((review) => review.offerId === offerId);
    }
    const lang = getApiLang();
    try {
      const { data } = await apiClient.post<any>(ENDPOINTS.reviews.byOffer(offerId, lang));
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      return list.map(mapReview);
    } catch (error) {
      console.warn('[reviewService.getByOfferId] API fallback to empty list', error);
      return [];
    }
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
    try {
      const { data } = await apiClient.post<any>(ENDPOINTS.reviews.byUser(resolvedLang));
      const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      return list.map(mapReview);
    } catch (error) {
      console.warn('[reviewService.getByUser] API fallback to empty list', error);
      return [];
    }
  },
  create: async (payload: ReviewPayload) => {
    if (USE_MOCKS) {
      const eligibility = await reviewService.canLeaveReview(payload.bookingId);
      if (!eligibility.allowed) {
        throw new Error(eligibility.reason);
      }

      const authUser = getAuthState().user;
      const review: Review = {
        id: `mock-review-${Date.now()}`,
        offerId: payload.offerId,
        bookingId: payload.bookingId,
        userName: authUser?.name ?? 'Guest',
        rating: payload.rating,
        comment: payload.comment,
        createdAt: new Date().toISOString(),
        status: 'published',
      };
      mockReviews.unshift(review);

      const offer = mockOffers.find((item) => item.id === payload.offerId);
      if (offer) {
        offer.reviews = [review, ...(offer.reviews ?? [])];
      }

      return review;
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
    try {
      const { data } = await apiClient.post<any>(
        ENDPOINTS.reviews.create(payload.bookingId),
        body,
        {
          params: { lang },
        },
      );
      const result = Array.isArray(data) ? data[0] : (data?.data ?? data);
      return mapReview({ ...result, offerId: payload.offerId, orderId: payload.bookingId });
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось создать отзыв.');
    }
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
    try {
      const { data } = await apiClient.post<any>(
        ENDPOINTS.reviews.update(orderId, id, lang),
        body,
        {
          params: { lang },
        },
      );
      const result = Array.isArray(data) ? data[0] : (data?.data ?? data);
      return mapReview(result);
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось обновить отзыв.');
    }
  },
  remove: async (id: string, bookingId?: string) => {
    if (USE_MOCKS) return;
    const userId = getAuthState().user?.id;
    if (!userId) throw new Error('Не удалось определить пользователя');
    const orderId = bookingId ?? id;
    try {
      await apiClient.delete(ENDPOINTS.reviews.delete(userId, orderId, id));
    } catch (error) {
      throw toUserFacingApiError(error, 'Не удалось удалить отзыв.');
    }
  },
};
