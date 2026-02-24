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
    queryFn: async () => (await landmarkService.getLandmarkById(route.params?.landmarkId)) ?? null,
  });

  const { data: city } = useQuery({
    queryKey: ['landmark-city', landmark?.cityId],
    queryFn: async () => (await landmarkService.findCityById(landmark?.cityId)) ?? null,
    enabled: Boolean(landmark?.cityId),
  });

  const { data: cityGuide } = useQuery({
    queryKey: ['landmark-city-guide', landmark?.cityId],
    queryFn: () => landmarkService.getCityGuideByCityId(landmark?.cityId),
    enabled: Boolean(landmark?.cityId),
  });

  return (
    <AppLayout variant="stack" header={false} edges={['left', 'right']}>
      <LandmarkDetailScreenView
        landmark={landmark ?? undefined}
        cityName={city?.name ?? undefined}
        fallbackLatitude={cityGuide?.latitude}
        fallbackLongitude={cityGuide?.longitude}
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
