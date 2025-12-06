import { colors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
};

export const theme = {
  colors,
  spacing,
  radius,
};

export type Theme = typeof theme;
