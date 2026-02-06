// Component: BookingPaymentMethod. Used in: BookingScreen.tsx.
import React, { useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { Typography } from '@/ui';
import { radius } from '@/theme';
import { useAuthStore } from '@/store/authStore';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

type Props = {
  value: PaymentMethod;
  onChange: (next: PaymentMethod) => void;
};

export type PaymentMethod = 'card' | 'paypal' | 'googlePay' | 'applePay' | 'cash';

export const BookingPaymentMethod = ({ value, onChange }: Props) => {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const userName = useAuthStore((state) => state.user?.name);
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const options: Array<{ id: PaymentMethod; label: string }> = [
    { id: 'card', label: 'Visa/Mastercard' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'googlePay', label: 'Google Pay' },
    { id: 'applePay', label: 'Apple Pay' },
    { id: 'cash', label: 'Оплата на місці' },
  ];

  return (
    <View style={styles.container}>
      <Typography variant="subtitle" tone="primary" style={styles.title}>
        {t('booking.paymentType')}
      </Typography>
      <View style={styles.card}>
        <View style={styles.options}>
          {options.map((option) => {
            const selected = option.id === value;
            return (
              <Pressable
                key={option.id}
                onPress={() => onChange(option.id)}
                style={styles.optionRow}
              >
                <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
                  {selected ? <View style={styles.radioInner} /> : null}
                </View>
                <Typography variant="body" style={styles.optionLabel}>
                  {option.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
        {value === 'card' && (
          <View style={styles.savedCard}>
            <Typography variant="caption" style={styles.cardNumber}>
              **** **** **** 9101
            </Typography>
            <View style={styles.cardMeta}>
              <Typography variant="caption" style={styles.cardName}>
                {userName || 'Ірина Брицька'}
              </Typography>
              <Typography variant="caption" style={styles.cardExpiry}>
                01/2029
              </Typography>
            </View>
            <View style={styles.cardBrand}>
              <View
                style={[styles.brandCircle, { backgroundColor: colors.paymentMastercardOrange }]}
              />
              <View
                style={[
                  styles.brandCircle,
                  styles.brandCircleOverlap,
                  { backgroundColor: colors.paymentMastercardRed },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      gap: s(12),
    },
    title: {
      fontSize: s(20),
      fontWeight: '600',
    },
    card: {
      backgroundColor: isDark ? colors.bgCard : colors.surfaceLight,
      borderRadius: radius.md,
      padding: s(12),
      borderWidth: 1,
      borderColor: colors.border,
      gap: s(12),
    },
    options: {
      gap: s(10),
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
    },
    optionLabel: {
      color: colors.textPrimary,
      fontSize: s(16),
    },
    radioOuter: {
      width: s(20),
      height: s(20),
      borderRadius: s(10),
      borderWidth: 1,
      borderColor: colors.textPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterActive: {
      borderWidth: 2,
    },
    radioInner: {
      width: s(8),
      height: s(8),
      borderRadius: s(4),
      backgroundColor: colors.textPrimary,
    },
    savedCard: {
      borderRadius: radius.md,
      padding: s(12),
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: isDark ? colors.bgDark : colors.surfaceLightDarker,
      gap: s(6),
    },
    cardNumber: {
      color: colors.textPrimary,
      fontSize: s(14),
    },
    cardMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardName: {
      color: colors.textPrimary,
      fontSize: s(13),
    },
    cardExpiry: {
      color: colors.textPrimary,
      fontSize: s(13),
    },
    cardBrand: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    brandCircle: {
      width: s(16),
      height: s(16),
      borderRadius: s(8),
    },
    brandCircleOverlap: {
      marginLeft: s(-6),
    },
  });
