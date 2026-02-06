// Component: types. Used in: (no direct imports found).
import type { ImageSourcePropType } from 'react-native';

export type CityCard = {
  id: string;
  name: string;
  image: ImageSourcePropType;
};

export type RecommendationCard = {
  id: string;
  name: string;
  rating: string;
  image: ImageSourcePropType;
};

export type OfferPromo = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

export type CountryBubble = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  size: number;
  x: number;
  y: number;
};

export type MenuItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
};

export type FooterNavItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  onPress?: () => void;
};
