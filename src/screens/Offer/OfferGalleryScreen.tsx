// Screen: OfferGalleryScreen. Used in: RootNavigator.
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ImageSourcePropType } from 'react-native';

import OfferGalleryScreenView from '@/components/Offer/OfferGalleryScreenView';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { offerService } from '@/services/offerService';
import { AppLayout } from '@/layout/AppLayout';

type Route = RouteProp<RootStackParamList, 'OfferGallery'>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const OfferGalleryScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { params } = useRoute<Route>();

  const { data: offer } = useQuery({
    queryKey: ['offer', params.offerId],
    queryFn: () => offerService.getById(params.offerId),
  });

  const images: ImageSourcePropType[] = (offer?.images ?? []).map((uri) => ({ uri }));

  return (
    <AppLayout variant="stack">
      <OfferGalleryScreenView
        images={images}
        onBack={() => navigation.goBack()}
        onSearch={() => undefined}
      />
    </AppLayout>
  );
};

export default OfferGalleryScreen;
