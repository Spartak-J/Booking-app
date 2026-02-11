import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import LandmarkDetailScreenView from '@/components/Landmarks/LandmarkDetailScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { landmarkService } from '@/services/landmarkService';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type ScreenRoute = RouteProp<RootStackParamList, Routes.LandmarkDetail>;

export const LandmarkDetailScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ScreenRoute>();

  const { data: landmark } = useQuery({
    queryKey: ['landmark', route.params?.landmarkId],
    queryFn: () => landmarkService.getLandmarkById(route.params?.landmarkId),
  });

  const { data: city } = useQuery({
    queryKey: ['landmark-city', landmark?.cityId],
    queryFn: () => landmarkService.findCityById(landmark?.cityId),
    enabled: Boolean(landmark?.cityId),
  });

  return (
    <AppLayout variant="stack" header={false}>
      <LandmarkDetailScreenView
        landmark={landmark}
        cityName={city?.name}
        onBack={() => navigation.goBack()}
        onFindStay={() =>
          navigation.navigate(Routes.SearchResults, {
            filters: {
              cityName: city?.name,
              onlyActive: true,
            },
          })
        }
      />
    </AppLayout>
  );
};

export default LandmarkDetailScreen;
