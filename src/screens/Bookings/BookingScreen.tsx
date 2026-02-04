// Screen: BookingScreen. Used in: RootNavigator.
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import BookingScreenView from '@/components/Bookings/BookingScreenView';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { offerService } from '@/services/offerService';
import { ScreenContainer } from '@/ui';

type Route = RouteProp<RootStackParamList, Routes.Booking>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const BookingScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Navigation>();

  const { data: offer, isLoading } = useQuery({
    queryKey: ['offer', params.offerId],
    queryFn: () => offerService.getById(params.offerId),
  });

  return (
    <ScreenContainer edges={['top', 'left', 'right', 'bottom']}>
      <BookingScreenView
        offerId={params.offerId}
        offer={offer}
        isLoading={isLoading}
        onBack={() => navigation.goBack()}
        onBookingSuccess={({ bookingId, offerId, offerTitle, totalPrice }) =>
          navigation.replace(Routes.BookingSuccess, {
            bookingId,
            offerId,
            offerTitle,
            totalPrice,
          })
        }
      />
    </ScreenContainer>
  );
};

export default BookingScreen;
