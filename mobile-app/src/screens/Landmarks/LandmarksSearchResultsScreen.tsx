import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Animated, Easing } from 'react-native';

import LandmarksSearchResultsScreenView from '@/components/Landmarks/LandmarksSearchResultsScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { landmarkService } from '@/services/landmarkService';
import { s } from '@/utils/scale';

const OVERLAY_ANIMATION_DURATION = 250;

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type ScreenRoute = RouteProp<RootStackParamList, Routes.LandmarksSearchResults>;

export const LandmarksSearchResultsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ScreenRoute>();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnimation = useMemo(() => new Animated.Value(0), []);

  const { data: cities = [] } = useQuery({
    queryKey: ['landmarks-cities'],
    queryFn: () => landmarkService.getCities(),
  });

  const resolvedCity = useMemo(() => {
    const cityIdParam = String(route.params?.cityId ?? '');
    const cityNameParam = String(route.params?.cityName ?? '');
    const byId = cities.find((city) => String(city.id) === cityIdParam);
    if (byId) return byId;
    const byName = cities.find((city) => city.name === cityNameParam);
    if (byName) return byName;
    return cities.find((city) => city.id === '13') ?? cities[0];
  }, [cities, route.params?.cityId, route.params?.cityName]);

  const { data: landmarks = [] } = useQuery({
    queryKey: ['landmarks-by-city', resolvedCity?.id],
    queryFn: () => landmarkService.getLandmarksByCity(resolvedCity?.id),
    enabled: Boolean(resolvedCity?.id),
  });

  const animateOverlay = (anim: Animated.Value, open: boolean, onComplete?: () => void) => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: OVERLAY_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => onComplete?.());
  };

  const openMenu = () => {
    setMenuOpen(true);
    menuAnimation.setValue(0);
    animateOverlay(menuAnimation, true);
  };

  const closeMenu = () => {
    animateOverlay(menuAnimation, false, () => setMenuOpen(false));
  };

  return (
    <AppLayout variant="stack" header={false}>
      <LandmarksSearchResultsScreenView
        cityName={resolvedCity?.name ?? ''}
        landmarks={landmarks}
        menuOpen={menuOpen}
        menuAnimationStyle={{
          opacity: menuAnimation,
          transform: [
            {
              translateY: menuAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-s(64), 0],
              }),
            },
          ],
        }}
        onBack={() => navigation.goBack()}
        onSearch={() => navigation.navigate(Routes.Landmarks)}
        onOpenMenu={openMenu}
        onCloseMenu={closeMenu}
        onOpenLandmark={(landmarkId) => navigation.navigate(Routes.LandmarkDetail, { landmarkId })}
      />
    </AppLayout>
  );
};

export default LandmarksSearchResultsScreen;
