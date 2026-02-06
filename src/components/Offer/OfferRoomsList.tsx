// Component: OfferRoomsList. Used in: OfferDetailsScreen.tsx.
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { CachedImage } from '@/components/CachedImage';
import { useTheme } from '@/theme';
import { Room } from '@/types';
import { formatPrice } from '@/utils/price';
import { Button, Typography } from '@/ui';
import { getColorTokens, radius } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

type OfferRoomsListProps = {
  rooms: Room[];
  onBook?: (room: Room) => void;
};

export const OfferRoomsList = ({ rooms, onBook }: OfferRoomsListProps) => {
  const { colors, mode } = useTheme();
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const styles = useMemo(() => getStyles(colors, tokens, isDark), [colors, tokens, isDark]);

  if (!rooms.length) return null;

  return (
    <View style={styles.container}>
      {rooms.map((room) => (
        <View key={room.id} style={styles.roomCard}>
          <View style={styles.roomContent}>
            <Typography variant="caption" tone="primary" style={styles.roomTitle}>
              {room.title}
            </Typography>
            <Button
              title="Забронювати"
              variant="primary"
              size="small"
              style={styles.bookButton}
              onPress={() => onBook?.(room)}
            />
          </View>
          <View style={styles.imageWrap}>
            {room.image ? (
              <CachedImage uri={room.image} style={styles.roomImage} />
            ) : (
              <View style={styles.roomImageFallback} />
            )}
            <View style={styles.imageDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.priceTag}>
              <Typography variant="caption" style={styles.priceText}>
                UAH {formatPrice(room.price, 'UAH', false)}
              </Typography>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const getStyles = (colors: any, tokens: ReturnType<typeof getColorTokens>, isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: s(20),
      gap: s(24),
    },
    roomCard: {
      width: '100%',
      height: s(151),
      borderRadius: radius.md,
      backgroundColor: isDark ? colors.bgCard : colors.surfaceLight,
      overflow: 'hidden',
      position: 'relative',
    },
    roomContent: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '52%',
      padding: s(10),
      justifyContent: 'space-between',
    },
    roomTitle: {
      fontWeight: '600',
      fontSize: s(12),
      lineHeight: s(15),
      color: colors.textPrimary,
    },
    bookButton: {
      height: s(35),
      backgroundColor: colors.primary,
      borderRadius: radius.sm,
    },
    imageWrap: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '48%',
    },
    roomImage: {
      width: '100%',
      height: '100%',
      borderRadius: radius.md,
    },
    roomImageFallback: {
      width: '100%',
      height: '100%',
      borderRadius: radius.md,
      backgroundColor: colors.border,
    },
    imageDots: {
      position: 'absolute',
      top: s(6),
      left: s(6),
      flexDirection: 'row',
      gap: s(4),
      backgroundColor: colors.surfaceWarm,
      paddingHorizontal: s(6),
      paddingVertical: s(3),
      borderRadius: s(10),
    },
    dot: {
      width: s(6),
      height: s(6),
      borderRadius: s(3),
      backgroundColor: tokens.iconPrimary,
    },
    priceTag: {
      position: 'absolute',
      right: s(6),
      top: s(6),
      backgroundColor: colors.accentSoftAlt,
      paddingHorizontal: s(6),
      paddingVertical: s(3),
      borderRadius: radius.sm,
    },
    priceText: {
      fontWeight: '700',
      fontSize: s(12),
      lineHeight: s(16),
      color: colors.primary,
    },
  });
