import { Appearance } from 'react-native';

import { palette } from './palette';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorTokens = {
  bgScreen: string;
  bgHeader: string;
  bgCard: string;
  bgPanel: string;
  bgField: string;
  bgSurface: string;
  bgSurfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textOnAccent: string;
  iconPrimary: string;
  accent: string;
  border: string;
  borderSubtle: string;
  borderStrong: string;
  overlay: string;
  success: string;
  warning: string;
  error: string;
  brandMastercardOrange: string;
  brandMastercardRed: string;
  brandMastercardCenter: string;
  brandPaypalBlue: string;
  brandPaypalCyan: string;
  brandAppleBlack: string;
  brandAppleBlackAlt: string;
};

const resolveMode = (mode: ThemeMode) => {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return mode;
};

export const getColorTokens = (
  modeOrColors: ThemeMode | Record<string, unknown> = 'light',
  modeOverride?: ThemeMode,
): ColorTokens => {
  const mode = typeof modeOrColors === 'string' ? modeOrColors : (modeOverride ?? 'light');
  const isDark = resolveMode(mode) === 'dark';

  return {
    bgScreen: isDark ? palette.navy900 : palette.sand150,
    bgHeader: isDark ? palette.navy900 : palette.sand150,
    bgCard: isDark ? palette.navy850 : palette.sand100,
    bgPanel: isDark ? palette.navy800 : palette.sand200,
    bgField: isDark ? palette.navy800 : palette.sand100,
    bgSurface: isDark ? palette.navy900 : palette.sand100,
    bgSurfaceAlt: isDark ? palette.navy800 : palette.sand150,
    textPrimary: isDark ? palette.sand100 : palette.navy900,
    textSecondary: isDark ? palette.gray300 : palette.gray500,
    textOnAccent: isDark ? palette.sand100 : palette.navy900,
    iconPrimary: isDark ? palette.sand100 : palette.navy900,
    accent: palette.orange500,
    border: isDark ? palette.sand100 : palette.navy900,
    borderSubtle: isDark ? palette.gray600 : palette.gray200,
    borderStrong: isDark ? palette.sand100 : palette.navy900,
    overlay: palette.overlay,
    success: palette.green600,
    warning: palette.yellow500,
    error: palette.red600,
    brandMastercardOrange: palette.mastercardOrange,
    brandMastercardRed: palette.mastercardRed,
    brandMastercardCenter: palette.mastercardCenter,
    brandPaypalBlue: palette.paypalBlue,
    brandPaypalCyan: palette.paypalCyan,
    brandAppleBlack: palette.appleBlack,
    brandAppleBlackAlt: palette.appleBlackAlt,
  };
};

export type ThemeColors = {
  primary: string;
  bgDark: string;
  bgDarkAlt: string;
  bgCard: string;
  surfaceLight: string;
  surfaceLightDarker: string;
  surfaceWarm: string;
  surfaceAccent: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  heroGradientStart: string;
  heroGradientEnd: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textPrimary: string;
  textSecondary: string;
  muted: string;
  border: string;
  onPrimary: string;
  transparent: string;
  overlay: string;
  success: string;
  warning: string;
  error: string;
  white: string;
  black: string;
  accentSoft: string;
  accentSoftAlt: string;
  avatarBg: string;
  paymentMastercardOrange: string;
  paymentMastercardRed: string;
  paymentMastercardCenter: string;
  paymentPaypalBlue: string;
  paymentPaypalCyan: string;
  paymentAppleBlack: string;
  paymentAppleBlackAlt: string;
};

export const getThemeColors = (mode: ThemeMode = 'light'): ThemeColors => {
  const isDark = resolveMode(mode) === 'dark';

  return {
    primary: palette.orange500,
    bgDark: palette.navy900,
    bgDarkAlt: palette.navy800,
    bgCard: palette.navy850,
    surfaceLight: palette.sand100,
    surfaceLightDarker: palette.sand150,
    surfaceWarm: palette.sand200,
    surfaceAccent: palette.sand300,
    gradientStart: palette.sand150,
    gradientMid: palette.blueGray600,
    gradientEnd: palette.navy900,
    heroGradientStart: '#837E7E',
    heroGradientEnd: '#1D1C1C',
    secondary: palette.navy850,
    accent: palette.accentBlue,
    background: isDark ? palette.navy900 : palette.backgroundDefault,
    surface: isDark ? palette.navy850 : palette.white,
    text: isDark ? palette.sand100 : palette.textDefault,
    textPrimary: isDark ? palette.sand100 : palette.navy900,
    textSecondary: isDark ? palette.gray300 : palette.gray500,
    muted: isDark ? palette.gray300 : palette.gray500,
    border: isDark ? palette.gray600 : palette.gray200,
    onPrimary: palette.white,
    transparent: palette.transparent,
    overlay: palette.overlay,
    success: palette.green600,
    warning: palette.yellow500,
    error: palette.red600,
    white: palette.white,
    black: palette.black,
    accentSoft: palette.orange300,
    accentSoftAlt: palette.orange200,
    avatarBg: palette.cyan200,
    paymentMastercardOrange: palette.mastercardOrange,
    paymentMastercardRed: palette.mastercardRed,
    paymentMastercardCenter: palette.mastercardCenter,
    paymentPaypalBlue: palette.paypalBlue,
    paymentPaypalCyan: palette.paypalCyan,
    paymentAppleBlack: palette.appleBlack,
    paymentAppleBlackAlt: palette.appleBlackAlt,
  };
};
