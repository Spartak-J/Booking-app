// Component: SpecialOffers. Used in: HomeScreen.tsx.
import React, { useMemo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { Button, Typography } from '@/ui';
import { radius, withOpacity, useTheme } from '@/theme';
import { s } from '@/utils/scale';
import type { OfferPromo } from './types';

type SpecialOffersProps = {
  data: OfferPromo[];
  onPress?: (id: string) => void;
};

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ data, onPress }) => {
  const { colors, tokens } = useTheme();
  const palette = useMemo(() => getPalette(colors), [colors]);
  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <View style={styles.block}>
      <View style={styles.headerRow}>
        <Typography variant="h2" style={[styles.headerText, { color: tokens.textPrimary }]}>
          Ми також пропонуємо
        </Typography>
      </View>
      <View style={styles.cardsLayer}>
        {data.map((promo, index) => (
          <Button
            key={promo.id}
            variant="ghost"
            style={[
              styles.card,
              styles.cardButton,
              index === 0 ? styles.cardLeft : styles.cardRight,
            ]}
            onPress={() => onPress?.(promo.id)}
          >
            <ImageBackground
              source={promo.image}
              style={styles.image}
              imageStyle={styles.imageStyle}
              resizeMode="cover"
            >
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="arrow-top-right"
                  size={s(16)}
                  color={palette.primary}
                />
              </View>
              <View style={styles.labelWrap}>
                <BlurView intensity={25} tint="light" style={styles.labelBlur} />
                <Typography variant="offerLabel" tone="onAccent" style={styles.labelText}>
                  {promo.title}
                </Typography>
              </View>
            </ImageBackground>
          </Button>
        ))}
      </View>
    </View>
  );
};

const getPalette = (colors: Record<string, string>) => ({
  primary: colors.primary,
  transparent: colors.transparent,
  surfaceGlass: withOpacity(colors.black ?? '#000', 0.35),
  textOverlay: colors.white ?? '#FFFFFF',
});

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    block: {
      position: 'relative',
      alignSelf: 'center',
      width: s(412),
      height: s(200),
    },
    headerText: {
      color: palette.textOverlay,
    },
    headerRow: {
      position: 'absolute',
      left: s(20),
      top: s(-5),
      width: s(259),
      paddingVertical: s(5),
      paddingHorizontal: 0,
      justifyContent: 'center',
    },
    cardsLayer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    card: {
      position: 'absolute',
      borderRadius: radius.md,
      overflow: 'hidden',
    },
    cardButton: {
      padding: 0,
      borderWidth: 0,
      backgroundColor: palette.transparent,
    },
    cardLeft: {
      width: s(210),
      height: s(120),
      left: 0,
      top: s(50),
    },
    cardRight: {
      width: s(210),
      height: s(120),
      right: 0,
      top: s(50),
    },
    image: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
    },
    imageStyle: {
      borderRadius: radius.md,
    },
    arrow: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: s(16),
      height: s(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: s(11),
      height: s(21),
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.surfaceGlass,
      overflow: 'hidden',
    },
    labelBlur: {
      ...StyleSheet.absoluteFillObject,
    },
    labelText: {
      textAlign: 'center',
      color: palette.textOverlay,
    },
  });

export default SpecialOffers;
