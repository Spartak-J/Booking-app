// Component: PopularCities. Used in: HomeScreen.tsx.
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Typography } from '@/ui';
import { useTranslation } from '@/i18n';
import { s } from '@/utils/scale';
import { PopularCitiesCarousel } from '@/components/Home/PopularCitiesCarousel';
import type { CityCard } from './types';

type PopularCitiesProps = {
  data: CityCard[];
  onOpenCity: (cityName: string) => void;
};

export const PopularCities: React.FC<PopularCitiesProps> = ({ data, onOpenCity }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.block}>
      <Typography variant="h2" tone="primary">
        {t('home.popularCities')}
      </Typography>
      <PopularCitiesCarousel data={data} onOpenCity={onOpenCity} />
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    gap: s(10),
    marginHorizontal: s(20),
  },
});

export default PopularCities;
