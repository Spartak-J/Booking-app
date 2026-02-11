// Component: OfferCard. Used in: AdminUserDetailsScreen.tsx, SearchResultsScreen.tsx, SavedScreen.tsx.
import React, { useEffect, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { getColorTokens, spacing, radius } from '@/theme';
import { Offer } from '@/types';
import { formatPrice } from '@/utils/price';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { useSavedStore } from '@/store/savedStore';
import { useAuthStore } from '@/store/authStore';

import { CachedImage } from './CachedImage';

type Props = {
  offer: Offer;
  onPress?: () => void;
};

export const OfferCard: React.FC<Props> = ({ offer, onPress }) => {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const styles = useMemo(() => getStyles(colors, tokens, isDark), [colors, tokens, isDark]);
  const { t } = useTranslation();
  const hydrateForUser = useSavedStore((s) => s.hydrateForUser);
  const resetSaved = useSavedStore((s) => s.reset);
  const toggleForUser = useSavedStore((s) => s.toggleForUser);
  const isSaved = useSavedStore((s) => s.isSaved(offer.id));
  const userId = useAuthStore((s) => s.user?.id);
  const anim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, [anim]);

  useEffect(() => {
    if (userId) {
      void hydrateForUser(userId);
      return;
    }
    resetSaved();
  }, [hydrateForUser, resetSaved, userId]);
  const cover = offer.images?.[0];
  const maxGuests = offer.maxGuests ?? offer.guests;
  const capacityLabel = `${t('common.upTo')} ${maxGuests} ${t('bookings.guests').toLowerCase()}`;
  return (
    <Animated.View style={{ opacity: anim }}>
      <Pressable onPress={onPress} style={styles.card}>
        <View style={styles.media}>
          {cover ? (
            <CachedImage uri={cover} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imageFallback]}>
              <Text style={styles.imageFallbackText}>{t('common.photo')}</Text>
            </View>
          )}
          {offer.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {offer.rating.toFixed(1)}</Text>
            </View>
          )}
          <Pressable
            style={styles.save}
            onPress={(event) => {
              event.stopPropagation();
              if (!userId) return;
              void toggleForUser(userId, offer.id);
            }}
          >
            <Text style={styles.saveText}>{isSaved ? '♥' : '♡'}</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {offer.title}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.fromLabel}>{t('common.from')}</Text>
              <Text style={styles.price}>{formatPrice(offer.pricePerNight, 'UAH', false)}</Text>
              <Text style={styles.currency}>₴</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.location} numberOfLines={1}>
              {offer.address ? `${offer.address}, ${offer.city.name}` : offer.city.name}
            </Text>
          </View>
          <Text style={styles.capacityText}>{capacityLabel}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const getStyles = (colors: any, tokens: ReturnType<typeof getColorTokens>, isDark: boolean) =>
  StyleSheet.create({
    card: {
      backgroundColor: isDark ? tokens.bgPanel : (colors.surfaceLightDarker ?? colors.surface),
      borderRadius: radius.lg,
      overflow: 'hidden',
      marginBottom: spacing.lg,
    },
    media: {
      position: 'relative',
    },
    image: {
      height: 188,
      width: '100%',
      borderRadius: 10,
    },
    ratingBadge: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: colors.surfaceLight,
      borderRadius: 14,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    ratingText: {
      fontSize: 12,
      fontFamily: 'MontserratAlternates-SemiBold',
      color: colors.textPrimary,
    },
    save: {
      position: 'absolute',
      right: 10,
      top: 8,
      zIndex: 2,
      backgroundColor: colors.surfaceLight,
      borderRadius: 14,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    saveText: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    imageFallback: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.border,
    },
    imageFallbackText: {
      color: colors.muted,
    },
    content: {
      padding: spacing.md,
      gap: spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 16,
      fontFamily: 'MontserratAlternates-Bold',
      color: colors.textPrimary ?? colors.text,
    },
    location: {
      fontSize: 13,
      textDecorationLine: 'underline',
      fontFamily: 'MontserratAlternates-Regular',
      color: colors.textPrimary ?? colors.text,
    },
    capacityText: {
      fontSize: 12,
      fontFamily: 'MontserratAlternates-Regular',
      color: colors.textSecondary ?? colors.muted,
    },
    fromLabel: {
      fontSize: 13,
      fontFamily: 'MontserratAlternates-Regular',
      color: colors.textPrimary ?? colors.text,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: spacing.xs,
    },
    price: {
      fontSize: 18,
      fontFamily: 'MontserratAlternates-Bold',
      color: colors.textPrimary ?? colors.text,
    },
    currency: {
      fontSize: 16,
      fontFamily: 'MontserratAlternates-Regular',
      color: colors.textPrimary ?? colors.text,
    },
  });
