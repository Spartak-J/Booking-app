export type Role = 'user' | 'owner' | 'admin';
export type PropertyType = 'hotel' | 'apartment' | 'house';
export type PaymentType = 'card' | 'cash' | 'online';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  offerId: string;
  reply?: string;
  status?: 'published' | 'pending' | 'hidden';
  bookingId?: string;
}

export interface OwnerProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  reviewsCount: number;
  rating: number;
  yearsHosting: number;
  languages: string;
}

export interface Room {
  id: string;
  title: string;
  price: number;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  role: Role;
  countryId?: number;
  discount?: number;
  city?: string;
  rating?: number;
  isBlocked?: boolean;
  birthDate?: string;
  country?: string;
  ownerDescription?: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  city: City;
  address: string;
  pricePerNight: number;
  rating?: number;
  guests: number;
  maxGuests?: number;
  stock?: number;
  bedrooms: number;
  amenities: string[];
  images: string[];
  ownerId: string;
  owner?: OwnerProfile;
  isActive: boolean;
  type?: PropertyType;
  reviews?: Review[];
  highlights?: string[];
  rooms?: Room[];
}

export interface Booking {
  id: string;
  offerId: string;
  hotelId?: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'active' | 'cancelled' | 'pending' | 'completed';
  paymentType?: PaymentType;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  offerId: string;
  amount: number;
  method: PaymentType;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
