// Component: BookingTripPurpose. Used in: BookingScreen.tsx.
import React, { useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { Typography } from '@/ui';
import { radius } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

type TripPurpose = 'leisure' | 'work';

type Props = {
  value: TripPurpose;
  onChange: (next: TripPurpose) => void;
};

export const BookingTripPurpose = ({ value, onChange }: Props) => {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const options: Array<{ id: TripPurpose; label: string }> = [
    { id: 'leisure', label: t('booking.purpose.leisure') },
    { id: 'work', label: t('booking.purpose.work') },
  ];

  return (
    <View style={styles.container}>
      <Typography variant="subtitle" tone="primary" style={styles.title}>
        {t('booking.sectionPurpose')}
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
  });
