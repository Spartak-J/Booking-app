import { withOpacity } from './colorUtils';
import { spacing, radius, fonts, fontSizes, typography } from './layout';
import { palette } from './palette';
import { getColorTokens, getThemeColors } from './tokens';

// utils
export { withOpacity } from './colorUtils';

// layout tokens
export { spacing, radius, fonts, fontSizes, typography } from './layout';

// palette & tokens
export { palette } from './palette';
export { getColorTokens, getThemeColors } from './tokens';

// theme runtime
export { ThemeProvider } from './ThemeProvider';
export { AdminLightThemeProvider } from './AdminLightThemeProvider';
export { useTheme } from './useTheme';

// motion
export const motion = {
  carousel: {
    scale: { min: 0.92, max: 1 },
    opacity: { min: 0.8, max: 1 },
  },
};

// sizes (декоративные, допускаются числа)
export const sizes = {
  decorativeBubble: {
    sm: 80,
    md: 100,
    lg: 120,
  },
  decorativeBubbleImage: {
    width: 113,
    height: 141,
    offsetTop: -11,
  },
  carouselCity: {
    item: 110,
    itemActive: 164,
    height: 144,
    heightActive: 192,
    labelPad: 6,
    labelPadActive: 10,
    offsetX: 7,
    offsetY: 14,
    shadowOffsetX: 13,
    shadowOffsetY: 11,
    shadowBlur: 4.5,
  },
};

// legacy aliases (если нужны)
export const spacingTokens = spacing;
export const typographyTokens = typography;

// full theme object
export const theme = {
  palette,
  spacing,
  radius,
  sizes,
  fonts,
  fontSizes,
  typography,
  motion,
  withOpacity,
  getColorTokens,
  getThemeColors,
};

export type Theme = typeof theme;
