import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import BookingFailureScreenView from '@/components/Bookings/BookingFailureScreenView';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { AppLayout } from '@/layout/AppLayout';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, Routes.BookingFailure>;

export const BookingFailureScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { params } = useRoute<Route>();

  return (
    <AppLayout variant="stack">
      <BookingFailureScreenView
        onBack={() => navigation.navigate(Routes.Main, { screen: 'Bookings' })}
        message={params?.message}
        onRetry={() => {
          if (params?.offerId) {
            navigation.replace(Routes.Booking, { offerId: params.offerId });
            return;
          }
          navigation.navigate(Routes.Main, { screen: 'Bookings' });
        }}
        onHome={() => navigation.navigate(Routes.Main, { screen: 'Home' })}
      />
    </AppLayout>
  );
};

export default BookingFailureScreen;
