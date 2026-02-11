// Screen: HomeScreen
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import HomeScreenView from '@/components/Home/HomeScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { landmarkService } from '@/services/landmarkService';
import { OfferFilters } from '@/services/offerService';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<Navigation>();

  const handleSearch = (filters: OfferFilters) => {
    navigation.navigate(Routes.SearchResults, { filters });
  };

  const handleOpenCity = async (cityName: string) => {
    const city = (await landmarkService.findCityByQuery(cityName)) ?? (await landmarkService.getDefaultCity());
    navigation.navigate(Routes.LandmarksCity, {
      cityId: city?.id,
      cityName: city?.name ?? cityName,
    });
  };

  return (
    <AppLayout variant="tab" header={false}>
      <HomeScreenView
        onSearch={handleSearch}
        onOpenCity={handleOpenCity}
        onOpenLandmarks={() => navigation.navigate(Routes.Landmarks)}
        onOpenOffer={(offerId) => navigation.navigate(Routes.OfferDetails, { offerId })}
      />
    </AppLayout>
  );
};

export default HomeScreen;
