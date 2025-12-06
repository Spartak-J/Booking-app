export type Role = 'user' | 'owner';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  role: Role;
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
  bedrooms: number;
  amenities: string[];
  images: string[];
  ownerId: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  offerId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'active' | 'cancelled' | 'pending';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
