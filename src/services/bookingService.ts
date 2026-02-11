import apiClient from '@/api/client';
import { Booking, Offer, PaymentType } from '@/types';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang, mapBooking } from '@/utils/apiAdapters';
import { USE_MOCKS } from '@/config/constants';
import { mockOffers } from '@/utils/mockData';
import { BOOKINGS } from '@/data/bookings/bookings.mock';
import { HotelsRepository } from '@/data/hotels';
import { BookingRepository } from '@/data/bookings';
import { Hotel } from '@/data/types';
import { messageService } from '@/services/messages';
import { isOfferAvailableForDates } from '@/services/bookingAvailability';

let cachedHotels: Hotel[] | null = null;

const normalize = (value: string) => value.trim().toLowerCase();

const getHotelsCached = async () => {
  if (!cachedHotels) {
    cachedHotels = await HotelsRepository.getHotels();
  }
  return cachedHotels;
};

const findHotelForOffer = async (offer?: Offer) => {
  if (!offer) return undefined;
  const hotels = await getHotelsCached();
  const byName = hotels.find((hotel) => normalize(hotel.name) === normalize(offer.title));
  if (byName) return byName;
  const byAddress = hotels.find((hotel) => normalize(hotel.address) === normalize(offer.address));
  if (byAddress) return byAddress;
  const byCity = hotels.find(
    (hotel) => normalize(hotel.city) === normalize(offer.city?.name ?? ''),
  );
  return byCity ?? hotels[0];
};

const computeStatus = (checkOut: string): Booking['status'] =>
  new Date(checkOut).getTime() < Date.now() ? 'completed' : 'active';

const resolveStatus = (booking: Booking): Booking['status'] => {
  if (booking.status === 'cancelled') return 'cancelled';
  if (booking.status === 'pending') return 'pending';
  return computeStatus(booking.checkOut);
};

type CreateBookingPayload = {
  offerId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  paymentType?: PaymentType;
  userId?: string;
};

type OwnerBookingsFilters = {
  from?: string;
  to?: string;
  offerId?: string;
};

const parseDateStart = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const parseDateEnd = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(23, 59, 59, 999);
  return date;
};

const matchesDateRange = (booking: Booking, filters?: OwnerBookingsFilters) => {
  if (!filters?.from || !filters?.to) return true;

  const filterFrom = parseDateStart(filters.from);
  const filterTo = parseDateEnd(filters.to);
  if (!filterFrom || !filterTo) return true;

  const rangeStart = filterFrom <= filterTo ? filterFrom : filterTo;
  const rangeEnd = filterFrom <= filterTo ? filterTo : filterFrom;

  const bookingStart = parseDateStart(booking.checkIn);
  const bookingEnd = parseDateEnd(booking.checkOut);
  if (!bookingStart || !bookingEnd) return false;

  return bookingStart <= rangeEnd && bookingEnd >= rangeStart;
};

const matchesOffer = (booking: Booking, filters?: OwnerBookingsFilters) => {
  if (!filters?.offerId) return true;
  return booking.offerId === filters.offerId;
};

export const bookingService = {
  create: async (payload: CreateBookingPayload) => {
    if (USE_MOCKS) {
      const offer = mockOffers.find((item) => item.id === payload.offerId);
      const allBookings = await BookingRepository.getAll();
      const isAvailable = isOfferAvailableForDates(
        payload.offerId,
        payload.checkIn,
        payload.checkOut,
        allBookings,
        offer?.stock ?? 1,
      );
      if (!isAvailable) {
        throw new Error('booking.unavailable');
      }
      const hotel = await findHotelForOffer(offer);
      const nights = Math.max(
        1,
        Math.ceil(
          (new Date(payload.checkOut).getTime() - new Date(payload.checkIn).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      const booking: Booking = {
        id: `mock-booking-${Date.now()}`,
        offerId: payload.offerId,
        hotelId: hotel?.id,
        userId: payload.userId ?? 'user-1',
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        guests: payload.guests,
        totalPrice: (offer?.pricePerNight ?? 100) * nights,
        status: 'pending',
        paymentType: payload.paymentType ?? 'card',
      };
      await BookingRepository.addBooking(booking); // сохраняем в мок-репозиторий, чтобы показать в "Мої бронювання"
      return booking;
    }
    const lang = getApiLang();
    const request = {
      offerId: Number(payload.offerId),
      guests: payload.guests,
      startDate: payload.checkIn,
      endDate: payload.checkOut,
      clientNote: '',
    };
    const { data } = await apiClient.post<any>(ENDPOINTS.booking.create, request, {
      params: { lang },
    });
    const response = Array.isArray(data) ? data[0] : (data?.data ?? data?.order ?? data);
    return mapBooking(response);
  },
  getUserBookings: async (userId: string) => {
    if (USE_MOCKS) {
      const items = await Promise.all(
        BOOKINGS
          .filter((item) => item.userId === userId)
          .map(async (item) => {
            const offer = mockOffers.find((o) => o.id === item.offerId);
            const hotel = await findHotelForOffer(offer);
            return {
              ...item,
              hotelId: hotel?.id ?? item.hotelId,
              status: resolveStatus(item),
            };
          }),
      );
      return { items, total: items.length };
    }
    const { data } = await apiClient.get<any>(ENDPOINTS.booking.all);
    const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
    const items = list
      .filter((order) => String(order?.clientId ?? order?.userId) === userId)
      .map(mapBooking);
    return { items, total: items.length };
  },
  getOwnerBookings: async (ownerId: string, filters?: OwnerBookingsFilters) => {
    if (USE_MOCKS) {
      const ownerOfferIds = mockOffers.filter((o) => o.ownerId === ownerId).map((o) => o.id);
      const source = await BookingRepository.getAll();
      const items = source
        .filter((b) => ownerOfferIds.includes(b.offerId))
        .filter((b) => matchesOffer(b, filters))
        .filter((b) => matchesDateRange(b, filters));
      return { items, total: items.length };
    }
    const ordersRes = await apiClient.get<any>(ENDPOINTS.booking.all);
    const orders: any[] = Array.isArray(ordersRes.data)
      ? ordersRes.data
      : (ordersRes.data?.data ?? []);

    const offersRes = await apiClient.get<any>(ENDPOINTS.offers.allRaw);
    const offers: any[] = Array.isArray(offersRes.data)
      ? offersRes.data
      : (offersRes.data?.data ?? []);
    const ownerOfferIds = offers
      .filter((o) => String(o?.ownerId ?? '') === ownerId)
      .map((o) => String(o?.id));

    const items = orders
      .filter((o) => ownerOfferIds.includes(String(o?.offerId)))
      .map(mapBooking)
      .filter((booking) => matchesOffer(booking, filters))
      .filter((booking) => matchesDateRange(booking, filters));
    return { items, total: items.length };
  },
  getById: async (bookingId: string) => {
    if (USE_MOCKS) {
      const booking = BOOKINGS.find((item) => item.id === bookingId);
      if (!booking) return undefined;
      const offer = mockOffers.find((o) => o.id === booking.offerId);
      const hotel = await findHotelForOffer(offer);
      return {
        ...booking,
        hotelId: hotel?.id ?? booking.hotelId,
        status: resolveStatus(booking),
      };
    }
    const { data } = await apiClient.get<any>(ENDPOINTS.booking.byId(bookingId));
    const response = Array.isArray(data) ? data[0] : (data?.data ?? data);
    return response ? mapBooking(response) : undefined;
  },
  cancel: async (bookingId: string) => {
    if (USE_MOCKS) {
      const booking = await BookingRepository.updateStatus(bookingId, 'cancelled');
      if (booking?.userId) {
        await messageService.addMessage({
          userId: booking.userId,
          title: 'Статус бронювання змінено',
          body: 'Ваше бронювання скасовано.',
          tone: 'error',
        });
      }
      return;
    }
    const lang = getApiLang();
    await apiClient.post(ENDPOINTS.booking.updateStatus(bookingId), null, {
      params: { orderState: 'Cancelled', lang },
    });
  },
  updateStatus: async (bookingId: string, status: Booking['status']) => {
    if (USE_MOCKS) {
      const booking = await BookingRepository.updateStatus(bookingId, status);
      if (booking?.userId) {
        const body =
          status === 'cancelled'
            ? 'Ваше бронювання скасовано власником.'
            : 'Ваше бронювання підтверджено власником.';
        await messageService.addMessage({
          userId: booking.userId,
          title: 'Статус бронювання змінено',
          body,
          tone: status === 'cancelled' ? 'error' : 'success',
        });
      }
      return booking;
    }
    const lang = getApiLang();
    const statusValue = status === 'cancelled' ? 'Cancelled' : status;
    const { data } = await apiClient.post<any>(ENDPOINTS.booking.updateStatus(bookingId), null, {
      params: { orderState: statusValue, lang },
    });
    const response = Array.isArray(data) ? data[0] : (data?.data ?? data);
    return mapBooking(response ?? {});
  },
};
