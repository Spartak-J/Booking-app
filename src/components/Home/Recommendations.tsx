// Component: Recommendations. Used in: HomeScreen.tsx.
import React, { useMemo } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { IconButton, Typography } from '@/ui';
import { radius, withOpacity } from '@/theme';
import { useTheme } from '@/theme';
import { s } from '@/utils/scale';
import type { RecommendationCard } from './types';

type RecommendationsProps = {
  data: RecommendationCard[];
};

export const Recommendations: React.FC<RecommendationsProps> = ({ data }) => {
  const { colors } = useTheme();
  const palette = useMemo(() => getPalette(colors), [colors]);
  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <View style={styles.block}>
      <Typography variant="h2" tone="primary">
        Рекомендації готелей
      </Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <ImageBackground
              source={item.image}
              style={styles.image}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.ratingBadge}>
                <MaterialCommunityIcons name="star" size={s(10)} color={palette.text} />
                <Typography variant="caption" tone="primary">
                  {item.rating}
                </Typography>
              </View>
              <IconButton
                onPress={() => {}}
                icon={
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={s(14)}
                    color={palette.surface}
                  />
                }
                variant="ghost"
                size="sm"
                style={styles.favoriteButton}
              />
              <View style={styles.labelWrap}>
                <BlurView intensity={25} tint="light" style={styles.labelBlur} />
                <Typography variant="caption" tone="onAccent" style={styles.labelText}>
                  {item.name}
                </Typography>
              </View>
            </ImageBackground>
          </View>
        ))}
        <View style={styles.moreCard}>
          <Typography variant="caption" tone="primary">
            Більше
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
};

const getPalette = (colors: Record<string, string>) => ({
  text: colors.textPrimary ?? colors.text,
  surface: colors.surface,
  surfaceGlassStrong: withOpacity(colors.surface ?? colors.background, 0.12),
});

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    block: {
      gap: s(10),
      marginHorizontal: s(20),
    },
    list: {
      gap: s(10),
      paddingVertical: s(6),
      paddingRight: s(16),
    },
    card: {
      width: s(133),
      height: s(259),
      borderRadius: radius.md,
      overflow: 'hidden',
    },
    image: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    imageStyle: {
      borderRadius: radius.md,
    },
    ratingBadge: {
      position: 'absolute',
      top: s(6),
      left: s(6),
      backgroundColor: palette.surface,
      borderRadius: radius.round,
      paddingHorizontal: s(6),
      paddingVertical: s(2),
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(4),
    },
    favoriteButton: {
      position: 'absolute',
      top: s(6),
      right: s(6),
    },
    labelWrap: {
      alignSelf: 'stretch',
      paddingVertical: s(6),
      paddingHorizontal: s(6),
      backgroundColor: palette.surfaceGlassStrong,
      borderBottomLeftRadius: radius.md,
      borderBottomRightRadius: radius.md,
      overflow: 'hidden',
    },
    labelBlur: {
      ...StyleSheet.absoluteFillObject,
    },
    labelText: {
      fontSize: s(13),
      lineHeight: s(16),
      fontWeight: '600',
    },
    moreCard: {
      width: s(133),
      height: s(259),
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: palette.text,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Recommendations;
