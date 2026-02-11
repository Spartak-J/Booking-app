export type Hotel = {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  description: string;
  amenities: string[];
  ownerId: string;
  image?: string;
  images?: string[];
};

export type Owner = {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
};

export type Review = {
  id: string;
  hotelId: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type BookingStatus = 'active' | 'cancelled' | 'pending' | 'completed';

export type Booking = {
  id: string;
  hotelId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
};

export type UserRole = 'user' | 'owner' | 'admin';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  city?: string;
  rating?: number;
  isBlocked?: boolean;
  birthDate?: string;
  country?: string;
  ownerDescription?: string;
};
