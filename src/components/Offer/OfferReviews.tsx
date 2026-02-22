// Component: OfferReviews. Used in: OfferDetailsScreen.tsx.
import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/theme';
import { Review } from '@/types';
import { Typography } from '@/ui';
import { getColorTokens, radius, typography } from '@/theme';
import { useTranslation } from '@/i18n';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

type OfferReviewsProps = {
  reviews?: Review[];
};

export const OfferReviews = ({ reviews = [] }: OfferReviewsProps) => {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const isDark = mode === 'dark';
  const styles = useMemo(() => getStyles(colors, tokens, isDark), [colors, tokens, isDark]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const sourceReviews: Review[] = reviews;
  const visibleReviews = showAllReviews ? sourceReviews : sourceReviews.slice(0, 1);

  return (
    <View style={styles.reviewSection}>
      <Typography variant="h2" style={styles.reviewTitle}>
        {t('offer.reviews')}
      </Typography>
      {sourceReviews.length === 0 ? (
        <Typography variant="caption" style={styles.emptyText}>
          {t('offer.reviews.empty')}
        </Typography>
      ) : (
        <View style={styles.reviewContainer}>
          {visibleReviews.map((review, index) => (
            <View key={`${review.id ?? index}`} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={[styles.avatar, styles.avatarColor]} />
                <View style={styles.headerMeta}>
                  <Typography variant="caption" style={styles.userName}>
                    {review.userName}
                  </Typography>
                  <View style={styles.stars}>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <MaterialCommunityIcons
                        key={`${review.id}-star-${starIndex}`}
                        name="star"
                        size={s(10)}
                        color={colors.primary}
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Typography variant="caption" style={styles.reviewText}>
                {review.comment}
              </Typography>
            </View>
          ))}
        </View>
      )}
      {sourceReviews.length > 1 && (
        <Pressable onPress={() => setShowAllReviews((prev) => !prev)} style={styles.expandControl}>
          <View style={styles.expandLine} />
        </Pressable>
      )}
    </View>
  );
};

const getStyles = (colors: any, tokens: ReturnType<typeof getColorTokens>, isDark: boolean) =>
  StyleSheet.create({
    reviewSection: {
      marginTop: s(24),
      gap: s(10),
      backgroundColor: isDark ? colors.bgDarkAlt : colors.surfaceWarm,
      borderRadius: radius.lg,
      paddingVertical: s(12),
      paddingHorizontal: s(14),
    },
    reviewTitle: {
      fontSize: s(14),
      color: colors.textPrimary,
    },
    reviewContainer: {
      gap: s(12),
    },
    emptyText: {
      color: colors.textSecondary,
    },
    reviewCard: {
      height: s(150),
      borderRadius: radius.lg,
      backgroundColor: isDark ? colors.bgDarkAlt : colors.surfaceLight,
      paddingHorizontal: s(12),
      paddingVertical: s(12),
      gap: s(8),
      justifyContent: 'center',
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
    },
    avatar: {
      width: s(32),
      height: s(32),
      borderRadius: radius.md,
    },
    avatarColor: {
      backgroundColor: colors.error,
    },
    headerMeta: {
      gap: s(4),
    },
    userName: {
      fontFamily: typography.subtitle.fontFamily,
      fontSize: s(13),
      color: colors.textPrimary,
    },
    stars: {
      flexDirection: 'row',
      gap: s(2),
    },
    reviewText: {
      fontSize: s(11),
      lineHeight: s(13),
      color: colors.textPrimary,
    },
    expandControl: {
      alignItems: 'center',
      paddingTop: s(6),
    },
    expandLine: {
      width: s(127),
      height: s(3),
      borderRadius: s(3),
      backgroundColor: isDark ? colors.bgCard : colors.bgDarkAlt,
    },
  });
