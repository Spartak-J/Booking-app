import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import LandmarksScreenView from '@/components/Landmarks/LandmarksScreenView';
import { AppLayout } from '@/layout/AppLayout';
import { Routes } from '@/navigation/routes';
import { landmarkService } from '@/services/landmarkService';
import { s } from '@/utils/scale';
import backgroundMuseum from '@/assets/images/background_museum.png';

const OVERLAY_ANIMATION_DURATION = 250;

export const LandmarksScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnimation = useMemo(() => new Animated.Value(0), []);
  const [cityQuery, setCityQuery] = useState('');

  const { data: cities = [] } = useQuery({
    queryKey: ['landmarks-cities'],
    queryFn: () => landmarkService.getCities(),
  });

  const defaultCity = useMemo(() => {
    const routeCityById = cities.find((city) => city.id === route.params?.cityId);
    if (routeCityById) return routeCityById;
    const routeCityByName = cities.find((city) => city.name === route.params?.cityName);
    if (routeCityByName) return routeCityByName;
    return cities.find((city) => city.id === 'city-2') ?? cities[0];
  }, [cities, route.params?.cityId, route.params?.cityName]);

  React.useEffect(() => {
    if (!cityQuery && defaultCity?.name) {
      setCityQuery(defaultCity.name);
    }
  }, [cityQuery, defaultCity?.name]);

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

  const openSearchResults = async () => {
    const matchedCity =
      (await landmarkService.findCityByQuery(cityQuery)) ??
      defaultCity ??
      (await landmarkService.getDefaultCity());
    navigation.navigate(Routes.LandmarksSearchResults, {
      cityId: matchedCity?.id,
      cityName: matchedCity?.name,
    });
  };

  return (
    <AppLayout variant="tab" header={false} edges={['left', 'right']}>
      <View style={styles.container}>
        <Image source={backgroundMuseum} style={styles.background} />
        <LandmarksScreenView
          cityQuery={cityQuery}
          onCityQueryChange={setCityQuery}
          onBack={() => navigation.goBack()}
          onMenu={openMenu}
          onSearch={openSearchResults}
          menuSheet={
            <HomeMenuSheet
              visible={menuOpen}
              onClose={closeMenu}
              animatedStyle={{
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
              items={MENU_ITEMS}
            />
          }
        />
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default LandmarksScreen;
