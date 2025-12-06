import React, { useEffect, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, radius } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatDateRange } from '@/utils/date';
import { formatPrice } from '@/utils/price';
import { Booking } from '@/types';

type Props = {
  booking: Booking;
  onPress?: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
};

export const BookingCard: React.FC<Props> = ({ booking, onPress, onCancel, cancelLabel }) => {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const anim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, [anim]);

  return (
    <Animated.View style={[styles.card, { opacity: anim }]}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.row}>
          <Text style={styles.title}>{booking.offerId}</Text>
          <Text style={styles.status}>{booking.status}</Text>
        </View>
        <Text style={styles.muted}>{formatDateRange(booking.checkIn, booking.checkOut)}</Text>
        <Text style={styles.price}>{formatPrice(booking.totalPrice)}</Text>
      </Pressable>
      {onCancel && (
        <Pressable
          onPress={onCancel}
          style={[styles.button, { backgroundColor: colors.error ?? '#dc2626' }]}
        >
          <Text style={styles.buttonText}>{cancelLabel ?? 'Отменить'}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    pressable: {
      gap: spacing.xs,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    status: {
      color: colors.primary,
      fontWeight: '600',
    },
    muted: {
      color: colors.muted,
    },
    price: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
    button: {
      marginTop: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });
