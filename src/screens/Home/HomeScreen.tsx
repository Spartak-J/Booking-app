// Screen: HomeScreen
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import HomeScreenView from '@/components/Home/HomeScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { OfferFilters } from '@/services/offerService';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<Navigation>();

  const handleSearch = (filters: OfferFilters) => {
    navigation.navigate(Routes.SearchResults, { filters });
  };

  return (
    <AppLayout variant="tab" header={false}>
      <HomeScreenView
        onSearch={handleSearch}
        onOpenLandmarks={() => navigation.navigate(Routes.Landmarks)}
      />
    </AppLayout>
  );
};

export default HomeScreen;
