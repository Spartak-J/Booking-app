// Screen: BookingDetailsScreen. Used in: RootNavigator.
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import BookingDetailsScreenView from '@/components/Bookings/BookingDetailsScreenView';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { bookingService } from '@/services/bookingService';
import { AppLayout } from '@/layout/AppLayout';

type Route = RouteProp<RootStackParamList, Routes.BookingDetails>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const BookingDetailsScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Navigation>();

  const { data } = useQuery({
    queryKey: ['booking', params.bookingId],
    queryFn: () => bookingService.getById(params.bookingId),
  });

  return (
    <AppLayout variant="stack">
      <BookingDetailsScreenView
        booking={data}
        bookingId={params.bookingId}
        onBack={() => navigation.goBack()}
      />
    </AppLayout>
  );
};

export default BookingDetailsScreen;
