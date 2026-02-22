// Component: SortSheet. Used in: SearchResultsScreen.tsx.
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import { OfferFilters } from '@/services/offerService';
import { radius, typography } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';
import { Typography } from '@/ui';

type SortOption = {
  id: NonNullable<OfferFilters['sort']>;
  label: string;
  size?: number;
};

const SORT_OPTIONS: SortOption[] = [
  { id: 'recommended', label: 'Наші рекомендації', size: 15 },
  { id: 'center', label: 'Блище до центра міста' },
  { id: 'priceAsc', label: 'Ціна (спочатку найнижча)' },
  { id: 'priceDesc', label: 'Ціна (спочатку найвища)' },
  { id: 'ratingAsc', label: 'Оцінка (за зростанням)' },
  { id: 'ratingDesc', label: 'Оцінка (за спаданням)' },
];

type Props = {
  value?: OfferFilters['sort'];
  onChange: (next?: OfferFilters['sort']) => void;
};

export const SortSheet: React.FC<Props> = ({ value, onChange }) => {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark';
  const palette = useMemo(
    () => ({
      sheetBg: isDark
        ? (colors.bgCard ?? colors.bgDark)
        : (colors.surfaceWarm ?? colors.surfaceLight),
      text: isDark
        ? (colors.surfaceLight ?? colors.textPrimary)
        : (colors.textPrimary ?? colors.text),
      rule: isDark
        ? (colors.surfaceLight ?? colors.textPrimary)
        : (colors.textPrimary ?? colors.text),
      checkboxBorder: isDark
        ? (colors.surfaceLight ?? colors.textPrimary)
        : (colors.textPrimary ?? colors.text),
      checkboxFill: isDark
        ? (colors.surfaceLight ?? colors.textPrimary)
        : (colors.textPrimary ?? colors.text),
      handle: isDark ? (colors.surfaceLight ?? colors.textPrimary) : colors.muted,
    }),
    [colors, isDark],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <Typography variant="h1" style={styles.title}>
        Сортувати
      </Typography>
      <View style={styles.rule} />
      <View style={styles.list}>
        {SORT_OPTIONS.map((option) => {
          const isActive = value === option.id;
          return (
            <Pressable
              key={option.id}
              style={styles.row}
              onPress={() => onChange(isActive ? undefined : option.id)}
            >
              <Typography
                variant="chip"
                style={[styles.label, option.size ? { fontSize: s(option.size) } : undefined]}
              >
                {option.label}
              </Typography>
              <View style={styles.checkbox}>
                {isActive && <View style={styles.checkboxFill} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = (palette: {
  sheetBg: string;
  text: string;
  rule: string;
  checkboxBorder: string;
  checkboxFill: string;
  handle: string;
}) =>
  StyleSheet.create({
    container: {
      width: SCREEN_WIDTH,
      minHeight: s(365),
      backgroundColor: palette.sheetBg,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      paddingTop: s(10),
      paddingBottom: s(18),
      paddingHorizontal: s(16),
    },
    handle: {
      width: s(37),
      height: s(3),
      borderRadius: radius.round,
      backgroundColor: palette.handle,
      alignSelf: 'center',
      marginBottom: s(8),
    },
    title: {
      textAlign: 'center',
      color: palette.text,
    },
    rule: {
      width: s(304),
      borderTopWidth: 3,
      borderColor: palette.rule,
      alignSelf: 'center',
      marginTop: s(10),
    },
    list: {
      marginTop: s(18),
      gap: s(6),
    },
    row: {
      height: s(40),
      paddingHorizontal: s(4),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      color: palette.text,
      fontFamily: typography.chip.fontFamily,
      fontSize: s(16),
    },
    checkbox: {
      width: s(24),
      height: s(24),
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: palette.checkboxBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxFill: {
      width: s(12),
      height: s(12),
      borderRadius: s(3),
      backgroundColor: palette.checkboxFill,
    },
  });

export default SortSheet;
