import apiClient from '@/api/client';
import { Booking, Offer, PaymentType } from '@/types';
import { ENDPOINTS } from '@/config/endpoints';
import { getApiLang, mapBooking } from '@/utils/apiAdapters';
import { USE_MOCKS } from '@/config/constants';
import { mockBookings, mockOffers } from '@/utils/mockData';
import { HotelsRepository } from '@/data/hotels';
import { BookingRepository } from '@/data/bookings';
import { Hotel } from '@/data/types';

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

type CreateBookingPayload = {
  offerId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  paymentType?: PaymentType;
  userId?: string;
};

export const bookingService = {
  create: async (payload: CreateBookingPayload) => {
    if (USE_MOCKS) {
      const offer = mockOffers.find((item) => item.id === payload.offerId);
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
        status: 'active',
        paymentType: payload.paymentType ?? 'card',
      };
      await BookingRepository.addBooking(booking);
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
        mockBookings
          .filter((item) => item.userId === userId)
          .map(async (item) => {
            const offer = mockOffers.find((o) => o.id === item.offerId);
            const hotel = await findHotelForOffer(offer);
            return {
              ...item,
              hotelId: hotel?.id ?? item.hotelId,
              status: computeStatus(item.checkOut),
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
  getOwnerBookings: async (ownerId: string) => {
    if (USE_MOCKS) {
      const ownerOfferIds = mockOffers.filter((o) => o.ownerId === ownerId).map((o) => o.id);
      const items = mockBookings.filter((b) => ownerOfferIds.includes(b.offerId));
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

    const items = orders.filter((o) => ownerOfferIds.includes(String(o?.offerId))).map(mapBooking);
    return { items, total: items.length };
  },
  getById: async (bookingId: string) => {
    if (USE_MOCKS) {
      const booking = mockBookings.find((item) => item.id === bookingId);
      if (!booking) return undefined;
      const offer = mockOffers.find((o) => o.id === booking.offerId);
      const hotel = await findHotelForOffer(offer);
      return {
        ...booking,
        hotelId: hotel?.id ?? booking.hotelId,
        status: computeStatus(booking.checkOut),
      };
    }
    const { data } = await apiClient.get<any>(ENDPOINTS.booking.byId(bookingId));
    const response = Array.isArray(data) ? data[0] : (data?.data ?? data);
    return response ? mapBooking(response) : undefined;
  },
  cancel: async (bookingId: string) => {
    if (USE_MOCKS) return;
    const lang = getApiLang();
    await apiClient.post(ENDPOINTS.booking.updateStatus(bookingId), null, {
      params: { orderState: 'Cancelled', lang },
    });
  },
  updateStatus: async (bookingId: string, status: Booking['status']) => {
    if (USE_MOCKS) {
      const booking = mockBookings.find((item) => item.id === bookingId);
      return booking ? { ...booking, status } : undefined;
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
