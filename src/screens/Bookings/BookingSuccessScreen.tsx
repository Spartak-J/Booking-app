// Screen: BookingSuccessScreen. Used in: RootNavigator.
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import BookingSuccessScreenView from '@/components/Bookings/BookingSuccessScreenView';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { ScreenContainer } from '@/ui';

type Route = RouteProp<RootStackParamList, Routes.BookingSuccess>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const BookingSuccessScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Navigation>();

  const handleBack = () => {
    if (params.offerId) {
      navigation.navigate(Routes.OfferDetails, { offerId: params.offerId });
      return;
    }
    navigation.goBack();
  };

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <BookingSuccessScreenView onBack={handleBack} />
    </ScreenContainer>
  );
};

export default BookingSuccessScreen;
