// Component: Recommendations. Used in: HomeScreen.tsx.
import React, { useMemo } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { IconButton, Typography } from '@/ui';
import { radius, withOpacity, useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { s } from '@/utils/scale';
import type { RecommendationCard } from './types';
import { useSavedStore } from '@/store/savedStore';
import { useAuthStore } from '@/store/authStore';

type RecommendationsProps = {
  data: RecommendationCard[];
  onOpenOffer: (offerId: string) => void;
};

export const Recommendations: React.FC<RecommendationsProps> = ({ data, onOpenOffer }) => {
  const { colors, tokens } = useTheme();
  const { t } = useTranslation();
  const hydrateForUser = useSavedStore((s) => s.hydrateForUser);
  const resetSaved = useSavedStore((s) => s.reset);
  const toggleForUser = useSavedStore((s) => s.toggleForUser);
  const savedIds = useSavedStore((s) => s.savedIds);
  const userId = useAuthStore((s) => s.user?.id);
  const palette = useMemo(() => getPalette(colors, tokens), [colors, tokens]);
  const styles = useMemo(() => getStyles(palette), [palette]);

  React.useEffect(() => {
    if (userId) {
      void hydrateForUser(userId);
      return;
    }
    resetSaved();
  }, [hydrateForUser, resetSaved, userId]);

  return (
    <View style={styles.block}>
      <Typography variant="h2" style={{ color: tokens.textPrimary }}>
        {t('home.recommendationsTitle')}
      </Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {data.map((item) => {
          const isSaved = savedIds.includes(item.offerId);

          return (
            <Pressable key={item.id} style={styles.card} onPress={() => onOpenOffer(item.offerId)}>
              <ImageBackground
                source={item.image}
                style={styles.image}
                imageStyle={styles.imageStyle}
              >
                <View style={styles.ratingBadge}>
                  <MaterialCommunityIcons name="star" size={s(10)} color={palette.textOverlay} />
                  <Typography variant="caption" style={styles.ratingText}>
                    {item.rating}
                  </Typography>
                </View>
                <IconButton
                  onPress={() => {
                    if (!userId) return;
                    void toggleForUser(userId, item.offerId);
                  }}
                  icon={
                    <MaterialCommunityIcons
                      name={isSaved ? 'heart' : 'heart-outline'}
                      size={s(14)}
                      color={palette.textOverlay}
                    />
                  }
                  variant="ghost"
                  size="sm"
                  style={styles.favoriteButton}
                  preserveIconColor
                />
                <View style={styles.labelWrap}>
                  <Typography variant="caption" style={styles.labelText}>
                    {item.name}
                  </Typography>
                  {item.maxGuests ? (
                    <Typography variant="caption" style={styles.capacityText}>
                      {`${t('common.upTo')} ${item.maxGuests} ${t('bookings.guests').toLowerCase()}`}
                    </Typography>
                  ) : null}
                </View>
              </ImageBackground>
            </Pressable>
          );
        })}
        <View style={styles.moreCard}>
          <Typography variant="caption" tone="primary">
            {t('home.more')}
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
};

const getPalette = (colors: Record<string, string>, tokens: Record<string, string>) => ({
  textOverlay: colors.onPrimary ?? tokens.textOnAccent,
  badgeBg: withOpacity(tokens.overlay, 0.45),
  border: tokens.textPrimary,
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
      backgroundColor: palette.badgeBg,
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
    ratingText: {
      color: palette.textOverlay,
    },
    labelWrap: {
      alignSelf: 'stretch',
      paddingVertical: s(6),
      paddingHorizontal: s(6),
      borderBottomLeftRadius: radius.md,
      borderBottomRightRadius: radius.md,
      overflow: 'hidden',
    },
    labelText: {
      fontSize: s(13),
      lineHeight: s(16),
      fontWeight: '600',
      color: palette.textOverlay,
    },
    capacityText: {
      color: palette.textOverlay,
      opacity: 0.9,
    },
    moreCard: {
      width: s(133),
      height: s(259),
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: palette.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Recommendations;
