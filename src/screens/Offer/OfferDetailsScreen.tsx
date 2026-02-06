// Screen: OfferDetailsScreen. Used in: RootNavigator.
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import OfferDetailsScreenView from '@/components/Offer/OfferDetailsScreenView';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { offerService } from '@/services/offerService';
import { Routes } from '@/navigation/routes';
import { AppLayout } from '@/layout/AppLayout';

type Route = RouteProp<RootStackParamList, 'OfferDetails'>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const OfferDetailsScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Navigation>();

  const { data: offer, isLoading } = useQuery({
    queryKey: ['offer', params.offerId],
    queryFn: () => offerService.getById(params.offerId),
  });

  return (
    <AppLayout variant="stack">
      <OfferDetailsScreenView
        offer={offer}
        isLoading={isLoading}
        onBack={() => navigation.goBack()}
        onOpenGallery={(offerId) => navigation.navigate(Routes.OfferGallery, { offerId })}
        onBook={(offerId) => navigation.navigate(Routes.Booking, { offerId })}
      />
    </AppLayout>
  );
};

export default OfferDetailsScreen;
