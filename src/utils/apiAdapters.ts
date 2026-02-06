import { DEFAULT_LANG } from '@/config/constants';
import { Role, User, Offer, City, Booking, Review, OwnerProfile, Room } from '@/types';
import { useLanguageStore } from '@/store/languageStore';

const STATUS_MAP: Record<string, Booking['status']> = {
  pending: 'pending',
  active: 'active',
  confirmed: 'active',
  completed: 'completed',
  cancelled: 'cancelled',
  canceled: 'cancelled',
};

export const getApiLang = () => {
  try {
    const lang = useLanguageStore.getState().language;
    return lang ?? DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};

export const mapRole = (role?: string): Role => {
  const normalized = (role ?? '').toLowerCase();
  if (normalized === 'owner') return 'owner';
  if (normalized === 'admin' || normalized === 'superadmin') return 'admin';
  return 'user';
};

export const mapUser = (input: any): User => ({
  id: String(input?.id ?? input?.userId ?? ''),
  email: input?.email ?? input?.username ?? '',
  name: input?.username ?? input?.name ?? 'User',
  phone: input?.phoneNumber,
  role: mapRole(input?.roleName),
});

const pickNumber = (value: any, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const mapOwnerProfile = (input: any): OwnerProfile | undefined => {
  if (!input) return undefined;
  return {
    id: String(input?.id ?? input?.ownerId ?? ''),
    name: input?.name ?? input?.fullName ?? 'Власник',
    avatarUrl: input?.avatarUrl ?? input?.avatar ?? input?.photoUrl,
    reviewsCount: pickNumber(input?.reviewsCount ?? input?.reviews ?? 0, 0),
    rating: pickNumber(input?.rating ?? input?.score ?? 0, 0),
    yearsHosting: pickNumber(input?.yearsHosting ?? input?.experienceYears ?? 0, 0),
    languages: input?.languages ?? input?.language ?? 'Розмовляє українською',
  };
};

const mapRooms = (input: any): Room[] | undefined => {
  const list = Array.isArray(input) ? input : input?.items;
  if (!Array.isArray(list)) return undefined;
  return list.map((room: any, index: number) => ({
    id: String(room?.id ?? room?.roomId ?? `room-${index}`),
    title: room?.title ?? room?.name ?? 'Номер',
    price: pickNumber(room?.price ?? room?.pricePerNight ?? room?.pricePerDay ?? 0, 0),
    image: room?.image ?? room?.imageUrl ?? room?.photoUrl,
  }));
};

export const mapOfferShort = (input: any): Offer => {
  const rentObjRaw = Array.isArray(input?.rentObj) ? input.rentObj[0] : input?.rentObj;
  const images =
    rentObjRaw?.imagesUrl ??
    rentObjRaw?.images?.map((img: any) => img?.url ?? img) ??
    (rentObjRaw?.mainImageUrl ? [rentObjRaw.mainImageUrl] : []);

  const city: City = {
    id: String(rentObjRaw?.cityId ?? ''),
    name: input?.cityTitle ?? rentObjRaw?.cityTitle ?? `City #${rentObjRaw?.cityId ?? ''}`,
    country: input?.countryTitle ?? '',
  };

  return {
    id: String(input?.id ?? ''),
    title: input?.title ?? 'Без названия',
    description: input?.description ?? '',
    city,
    address: rentObjRaw?.address ?? '',
    pricePerNight: pickNumber(input?.pricePerDay ?? input?.orderPrice),
    rating: input?.rating ? pickNumber(input?.rating) : undefined,
    guests: pickNumber(input?.guestCount ?? rentObjRaw?.bedsCount ?? rentObjRaw?.roomCount ?? 1, 1),
    bedrooms: pickNumber(rentObjRaw?.bedroomsCount ?? rentObjRaw?.roomCount ?? 1, 1),
    amenities: [],
    images,
    ownerId: String(input?.ownerId ?? ''),
    owner: mapOwnerProfile(input?.owner ?? input?.ownerProfile),
    isActive: true,
    highlights: [],
    rooms: undefined,
  };
};

export const mapOfferFull = (input: any): Offer => {
  const base = mapOfferShort(input);
  const rentObjRaw = Array.isArray(input?.rentObj) ? input.rentObj[0] : input?.rentObj;
  const images =
    rentObjRaw?.imagesUrl ??
    rentObjRaw?.images?.map((img: any) => img?.url ?? img) ??
    (rentObjRaw?.mainImageUrl ? [rentObjRaw.mainImageUrl] : base.images);

  return {
    ...base,
    description: input?.description ?? base.description,
    images,
    amenities:
      rentObjRaw?.paramValues?.map((p: any) => p?.paramItemTitle ?? p?.title).filter(Boolean) ?? [],
    owner: mapOwnerProfile(input?.owner ?? input?.ownerProfile) ?? base.owner,
    rooms: mapRooms(input?.rooms ?? input?.roomTypes ?? input?.roomList),
  };
};

export const mapBooking = (input: any): Booking => ({
  id: String(input?.id ?? ''),
  offerId: String(input?.offerId ?? ''),
  userId: String(input?.clientId ?? input?.userId ?? ''),
  checkIn: input?.startDate ?? input?.start ?? '',
  checkOut: input?.endDate ?? input?.end ?? '',
  guests: pickNumber(input?.guests ?? 1, 1),
  totalPrice: pickNumber(
    input?.totalPrice ?? input?.orderPrice ?? input?.taxAmount ?? input?.price,
    0,
  ),
  status: STATUS_MAP[(input?.status ?? '').toLowerCase()] ?? 'pending',
  paymentType: undefined,
});

export const mapReview = (input: any): Review => ({
  id: String(input?.id ?? ''),
  userName: input?.userName ?? input?.username ?? 'User',
  rating: pickNumber(input?.overallRating ?? input?.rating ?? 0, 0),
  comment: input?.title ?? input?.description ?? '',
  createdAt: input?.createdAt ?? new Date().toISOString(),
  offerId: String(input?.offerId ?? ''),
  bookingId: input?.orderId ? String(input.orderId) : undefined,
  status: input?.isApproved === false ? 'pending' : 'published',
});

// Example adapter for user data
export const adaptUser = (apiUser: any) => {
  if (!apiUser) {
    return null;
  }

  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    // Add other fields as needed
  };
};

// Example adapter for order data
export const adaptOrder = (apiOrder: any) => {
  if (!apiOrder) {
    return null;
  }

  return {
    id: apiOrder.id,
    title: apiOrder.offer_title,
    date: new Date(apiOrder.start_date),
    // Add other fields as needed
  };
};
