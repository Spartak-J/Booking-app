// Component: homeNavigationData. Used in: RootNavigator.tsx, LandmarksScreen.tsx, HomeScreen.tsx….
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { FooterNavItem, MenuItem } from './types';

const makeIcon = (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) => {
  const IconComponent = ({ size, color }: { size: number; color: string }) =>
    React.createElement(MaterialCommunityIcons, { name, size, color });
  IconComponent.displayName = `MenuIcon(${String(name)})`;
  return IconComponent;
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 'language', label: 'Мова', Icon: makeIcon('star-outline') },
  { id: 'currency', label: 'Валюта', Icon: makeIcon('currency-usd') },
  { id: 'theme', label: 'Тема', Icon: makeIcon('weather-sunny') },
  { id: 'help', label: 'Допомога', Icon: makeIcon('help-circle-outline') },
  { id: 'about', label: 'Про нас', Icon: makeIcon('heart-outline') },
  { id: 'contacts', label: 'Контакти', Icon: makeIcon('phone-outline') },
  { id: 'bookings', label: 'Бронювання', Icon: makeIcon('bookmark-outline') },
  { id: 'saved', label: 'Збережене', Icon: makeIcon('star-outline') },
  { id: 'messages', label: 'Повідомлення', Icon: makeIcon('message-outline') },
];

export const BOTTOM_NAV_ITEMS: FooterNavItem[] = [
  { id: 'home', label: 'Головна', Icon: makeIcon('home-outline') },
  { id: 'messages', label: 'Повідомлення', Icon: makeIcon('message-outline') },
  { id: 'bookings', label: 'Мої подорожі', Icon: makeIcon('bookmark-outline') },
  { id: 'profile', label: 'Профіль', Icon: makeIcon('account-outline') },
];
