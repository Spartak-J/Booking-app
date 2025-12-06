import { Booking, Offer, User } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  email: 'demo@booking.com',
  name: 'Demo User',
  role: 'user',
};

export const mockOffers: Offer[] = [
  {
    id: 'offer-1',
    title: 'Уютные апартаменты в центре',
    description: 'Просторные апартаменты рядом с набережной.',
    city: { id: 'city-1', name: 'Одесса', country: 'Украина' },
    address: 'Дерибасовская, 1',
    pricePerNight: 120,
    rating: 4.7,
    guests: 2,
    bedrooms: 1,
    amenities: ['Wi-Fi', 'Кондиционер', 'Парковка'],
    images: ['https://picsum.photos/seed/offer1/600/400'],
    ownerId: 'owner-1',
    isActive: true,
  },
  {
    id: 'offer-2',
    title: 'Домик у моря',
    description: 'Панорамный вид на море, терасса и гриль.',
    city: { id: 'city-2', name: 'Батуми', country: 'Грузия' },
    address: 'Набережная, 25',
    pricePerNight: 90,
    rating: 4.5,
    guests: 4,
    bedrooms: 2,
    amenities: ['Wi-Fi', 'Парковка', 'Кухня'],
    images: ['https://picsum.photos/seed/offer2/600/400'],
    ownerId: 'owner-1',
    isActive: true,
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    offerId: 'offer-1',
    userId: 'user-1',
    checkIn: new Date().toISOString(),
    checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    guests: 2,
    totalPrice: 360,
    status: 'active',
  },
  {
    id: 'booking-2',
    offerId: 'offer-2',
    userId: 'user-1',
    checkIn: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    checkOut: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    guests: 4,
    totalPrice: 360,
    status: 'pending',
  },
];
