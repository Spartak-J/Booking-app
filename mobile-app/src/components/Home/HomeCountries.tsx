// Component: HomeCountries. Used in: HomeScreen.tsx.
import React, { useMemo } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Typography } from '@/ui';
import { radius, withOpacity } from '@/theme';
import { useTheme } from '@/theme';
import { s } from '@/utils/scale';
import luggageImage from '@/assets/images/luggage.png';
import type { CountryBubble } from './types';

type HomeCountriesProps = {
  data: CountryBubble[];
};

export const HomeCountries: React.FC<HomeCountriesProps> = ({ data }) => {
  const { colors } = useTheme();
  const palette = useMemo(() => getPalette(colors), [colors]);
  const isDark = colors.background === colors.bgDark;
  const labelPositions = useMemo(() => getLabelPositions(), []);
  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Typography variant="h2" tone="primary">
          Подорожі не лише Україною
        </Typography>
      </View>
      <View style={styles.countriesBlock}>
        <Image source={luggageImage} style={styles.countriesArt} />
        {data.map((bubble) => (
          <React.Fragment key={bubble.id}>
            <View
              style={[
                styles.countryBubble,
                {
                  width: bubble.size,
                  height: bubble.size,
                  left: bubble.x,
                  top: bubble.y,
                },
              ]}
            >
              <ImageBackground
                source={bubble.image}
                style={styles.countryImage}
                imageStyle={styles.countryImageStyle}
              />
            </View>
            {labelPositions[bubble.id] ? (
              <View style={[styles.countryLabel, labelPositions[bubble.id]]}>
                {bubble.id !== 'italy' && bubble.id !== 'germany' && (
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={s(12)}
                    color={
                      !isDark && (bubble.id === 'spain' || bubble.id === 'germany')
                        ? palette.accent
                        : palette.text
                    }
                  />
                )}
                <Typography variant="caption" tone="primary">
                  {bubble.name}
                </Typography>
                {(bubble.id === 'italy' || bubble.id === 'germany') && (
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={s(12)}
                    color={!isDark && bubble.id === 'germany' ? palette.accent : palette.text}
                  />
                )}
              </View>
            ) : null}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const getPalette = (colors: Record<string, string>) => ({
  text: colors.textPrimary ?? colors.text,
  surface: colors.surface,
  surfaceSoft: withOpacity(colors.surface ?? colors.background, 0.6),
  accent: colors.accentSoft ?? colors.primary,
});

const getLabelPositions = (): Record<string, { left: number; top: number }> => ({
  france: { left: s(85), top: s(47) },
  italy: { left: s(255), top: s(35) },
  spain: { left: s(71), top: s(240) },
  germany: { left: s(271), top: s(231) },
});

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    block: {
      width: s(412),
      height: s(262),
      alignSelf: 'center',
      position: 'relative',
    },
    header: {
      width: s(304),
      paddingVertical: s(5),
      paddingHorizontal: 0,
      marginLeft: s(20),
      position: 'absolute',
      top: 0,
    },
    countriesBlock: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    countriesArt: {
      position: 'absolute',
      width: s(220),
      height: s(200),
      left: s(103),
      top: s(44),
    },
    countryBubble: {
      position: 'absolute',
      borderRadius: radius.round,
      overflow: 'hidden',
      backgroundColor: palette.surface,
    },
    countryImage: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    countryImageStyle: {
      borderRadius: radius.round,
    },
    countryLabel: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(4),
      paddingHorizontal: s(0),
      paddingVertical: s(0),
      backgroundColor: 'transparent',
      borderRadius: 0,
    },
  });

export default HomeCountries;
