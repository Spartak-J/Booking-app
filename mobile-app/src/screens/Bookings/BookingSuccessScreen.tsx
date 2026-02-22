// Screen: BookingSuccessScreen. Used in: RootNavigator.
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import BookingSuccessScreenView from '@/components/Bookings/BookingSuccessScreenView';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { AppLayout } from '@/layout/AppLayout';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const BookingSuccessScreen = () => {
  const navigation = useNavigation<Navigation>();

  const handleBack = () => {
    navigation.navigate(Routes.Main, { screen: 'Bookings' });
  };

  const handleHome = () => {
    navigation.navigate(Routes.Main, { screen: 'Home' });
  };

  return (
    <AppLayout variant="stack">
      <BookingSuccessScreenView onBack={handleBack} onHome={handleHome} />
    </AppLayout>
  );
};

export default BookingSuccessScreen;
