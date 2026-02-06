import { Hotel, Owner, Review } from '../types';
import { HOTELS } from './hotels.mock';
import { OWNERS } from './owners.mock';
import { REVIEWS } from './reviews.mock';

// Mock repository. Replace these implementations with API calls later without changing UI consumers.
export const HotelsRepository = {
  async getAll(): Promise<Hotel[]> {
    return Promise.resolve(HOTELS);
  },

  async getById(id: string): Promise<Hotel | undefined> {
    return Promise.resolve(HOTELS.find((hotel) => hotel.id === id));
  },

  async getHotels(): Promise<Hotel[]> {
    return Promise.resolve(HOTELS);
  },

  async getHotelById(id: string): Promise<Hotel | undefined> {
    return Promise.resolve(HOTELS.find((hotel) => hotel.id === id));
  },

  async getOwner(ownerId: string): Promise<Owner | undefined> {
    return Promise.resolve(OWNERS.find((owner) => owner.id === ownerId));
  },

  async getReviewsByHotel(hotelId: string): Promise<Review[]> {
    return Promise.resolve(REVIEWS.filter((review) => review.hotelId === hotelId));
  },
};

export const OwnerRepository = {
  async getAll(): Promise<Owner[]> {
    return Promise.resolve(OWNERS);
  },

  async getById(id: string): Promise<Owner | undefined> {
    return Promise.resolve(OWNERS.find((owner) => owner.id === id));
  },
};

export const ReviewRepository = {
  async getAll(): Promise<Review[]> {
    return Promise.resolve(REVIEWS);
  },

  async getById(id: string): Promise<Review | undefined> {
    return Promise.resolve(REVIEWS.find((review) => review.id === id));
  },

  async getByHotelId(hotelId: string): Promise<Review[]> {
    return Promise.resolve(REVIEWS.filter((review) => review.hotelId === hotelId));
  },
};
