import React, { useEffect, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, radius } from '@/theme';
import { Offer } from '@/types';
import { formatPrice } from '@/utils/price';
import { useThemeColors } from '@/hooks/useThemeColors';

import { CachedImage } from './CachedImage';

type Props = {
  offer: Offer;
  onPress?: () => void;
};

export const OfferCard: React.FC<Props> = ({ offer, onPress }) => {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const anim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, [anim]);
  const cover = offer.images?.[0];
  return (
    <Animated.View style={{ opacity: anim }}>
      <Pressable onPress={onPress} style={styles.card}>
        {cover ? (
          <CachedImage uri={cover} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={styles.imageFallbackText}>Фото</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{offer.title}</Text>
          <Text style={styles.muted}>
            {offer.city.name}, {offer.city.country}
          </Text>
          <Text style={styles.price}>{formatPrice(offer.pricePerNight)} / ночь</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: 'hidden',
      marginBottom: spacing.lg,
      borderColor: colors.border,
      borderWidth: 1,
    },
    image: {
      height: 160,
      width: '100%',
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
      padding: spacing.lg,
      gap: spacing.sm,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    muted: {
      color: colors.muted,
    },
    price: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
  });
