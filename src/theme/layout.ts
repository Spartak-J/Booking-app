import { TextStyle } from 'react-native';

import { s } from '@/utils/scale';

export const fonts = {
  Cagliostro: 'Cagliostro-Regular',
  MontserratAlternates: 'MontserratAlternates-Regular',
  MontserratAlternatesMedium: 'MontserratAlternates-Medium',
  MontserratAlternatesSemiBold: 'MontserratAlternates-SemiBold',
  MontserratAlternatesBold: 'MontserratAlternates-Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  xxl: 30,
  round: 9999,
};

export const fontSizes = {
  caption: 12,
  body: 14,
  subtitle: 16,
  h2: 20,
  h1: 24,
  overline: 10,
};

export const typography = {
  h1: {
    fontFamily: fonts.MontserratAlternatesBold,
    fontSize: fontSizes.h1,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: fonts.MontserratAlternatesSemiBold,
    fontSize: fontSizes.subtitle,
    lineHeight: 22,
  },
  h2: {
    fontFamily: fonts.MontserratAlternatesSemiBold,
    fontSize: fontSizes.h2,
    lineHeight: 26,
    fontWeight: '600',
  },
  body: {
    fontFamily: fonts.MontserratAlternates,
    fontSize: fontSizes.body,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.MontserratAlternatesMedium,
    fontSize: fontSizes.caption,
    lineHeight: 16,
  },
  overline: {
    fontFamily: fonts.MontserratAlternatesSemiBold,
    fontSize: fontSizes.overline,
    lineHeight: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
  },
  menu: {
    fontFamily: fonts.MontserratAlternatesMedium,
    fontSize: fontSizes.subtitle,
    lineHeight: 20,
  },
  menuOption: {
    fontFamily: fonts.MontserratAlternates,
    fontSize: fontSizes.subtitle,
    lineHeight: 20,
  },
  chip: {
    fontFamily: fonts.MontserratAlternatesMedium,
    fontSize: 14,
    lineHeight: 17,
  },
  offerLabel: {
    fontFamily: fonts.MontserratAlternatesSemiBold,
    fontSize: 15,
    lineHeight: 18,
  },
  calendarTitle: {
    fontFamily: fonts.MontserratAlternatesSemiBold,
    fontSize: 16,
    lineHeight: 20,
  },
  calendarWeekday: {
    fontFamily: fonts.MontserratAlternatesBold,
    fontSize: 16,
    lineHeight: 20,
  },
  calendarDay: {
    fontFamily: fonts.MontserratAlternatesMedium,
    fontSize: 16,
    lineHeight: 20,
  },
  calendarApply: {
    fontFamily: fonts.MontserratAlternatesBold,
    fontSize: 20,
    lineHeight: 24,
  },
  guestsTitle: {
    fontFamily: fonts.MontserratAlternatesBold,
    fontSize: 16,
    lineHeight: 20,
  },
  guestsLabel: {
    fontFamily: fonts.MontserratAlternatesMedium,
    fontSize: 16,
    lineHeight: 20,
  },
  guestsCount: {
    fontFamily: fonts.MontserratAlternatesMedium,
    fontSize: 18,
    lineHeight: 22,
  },
  guestsHint: {
    fontFamily: fonts.MontserratAlternates,
    fontSize: 12,
    lineHeight: 15,
  },
  guestsApply: {
    fontFamily: fonts.MontserratAlternatesBold,
    fontSize: 20,
    lineHeight: 24,
  },
  optionLg: {
    fontFamily: fonts.MontserratAlternatesBold,
    fontSize: s(22),
    lineHeight: s(28),
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  buttonMd: {
    fontFamily: fonts.MontserratAlternatesBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  searchChip: {
    fontFamily: fonts.MontserratAlternatesBold,
    fontSize: 12,
    lineHeight: 15,
  },
};

export const layout = {
  spacing,
  radius,
  typography,
  fontSizes,
  fonts,
};

export type Layout = typeof layout;
