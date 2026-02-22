// Component: homeData. Used in: HomeScreen.tsx.
import { s } from '@/utils/scale';
import franceImage from '@/assets/images/france.png';
import germanyImage from '@/assets/images/germany.png';
import italyImage from '@/assets/images/italy.png';
import spainImage from '@/assets/images/spain.png';

import transferImage from '@/assets/images/transfer.png';
import museumImage from '@/assets/images/museum.png';

import type { CityCard, RecommendationCard, OfferPromo, CountryBubble } from './types';

export const CITY_CARDS: CityCard[] = [
  {
    id: 'lviv',
    name: 'Львів',
    image: { uri: 'https://images.unsplash.com/photo-1542327897-37e45aee7185?w=400' },
  },
  {
    id: 'kamianets',
    name: "Кам'янець-Подільський",
    image: { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
  },
  {
    id: 'yaremche',
    name: 'Яремче',
    image: { uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400' },
  },
  {
    id: 'lutsk',
    name: 'Луцьк',
    image: { uri: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400' },
  },
  {
    id: 'ivano',
    name: 'Івано-Франківськ',
    image: { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
  },
  {
    id: 'kyiv',
    name: 'Київ',
    image: { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
  },
  {
    id: 'odesa',
    name: 'Одеса',
    image: { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
  },
  {
    id: 'bukovel',
    name: 'Буковель',
    image: { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
  },
  {
    id: 'uzhhorod',
    name: 'Ужгород',
    image: { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
  },
  {
    id: 'chernivtsi',
    name: 'Чернівці',
    image: { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
  },
];

export const RECOMMENDATIONS: RecommendationCard[] = [
  {
    id: 'jam',
    offerId: 'offer-1',
    name: 'Jam Hotel',
    rating: '8,2',
    maxGuests: 2,
    image: { uri: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210d4?w=400' },
  },
  {
    id: 'bnb',
    offerId: 'offer-2',
    name: 'B&B Apartment',
    rating: '9,7',
    maxGuests: 4,
    image: { uri: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400' },
  },
  {
    id: 'atmosfera',
    offerId: 'offer-3',
    name: 'Atmosfera Hotel',
    rating: '9,8',
    maxGuests: 3,
    image: { uri: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400' },
  },
  {
    id: 'lumen',
    offerId: 'offer-4',
    name: 'Lumen Living',
    rating: '9,8',
    maxGuests: 6,
    image: { uri: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400' },
  },
  {
    id: 'fest',
    offerId: 'offer-5',
    name: '!FEST Hotel',
    rating: '9,7',
    maxGuests: 2,
    image: { uri: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400' },
  },
  {
    id: 'gallery',
    offerId: 'offer-6',
    name: 'Hotel GALLERY 21',
    rating: '9,4',
    maxGuests: 2,
    image: { uri: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400' },
  },
];

export const OFFER_PROMOS: OfferPromo[] = [
  {
    id: 'transfer',
    title: 'Трансфер',
    image: transferImage,
  },
  {
    id: 'landmarks',
    title: 'Визначні пам’ятки',
    image: museumImage,
  },
];

export const COUNTRY_BUBBLES: CountryBubble[] = [
  {
    id: 'france',
    name: 'Франція',
    image: franceImage,
    size: s(130),
    x: s(-14),
    y: s(47),
  },
  {
    id: 'italy',
    name: 'Італія',
    image: italyImage,
    size: s(130),
    x: s(302),
    y: s(29),
  },
  {
    id: 'spain',
    name: 'Іспанія',
    image: spainImage,
    size: s(120),
    x: s(-17),
    y: s(137),
  },
  {
    id: 'germany',
    name: 'Німеччина',
    image: germanyImage,
    size: s(120),
    x: s(322),
    y: s(131),
  },
];
