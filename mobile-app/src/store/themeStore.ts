import { Appearance } from 'react-native';
import { create } from 'zustand';

import { colors as lightColors } from '@/theme/colors';

const darkColors = {
  ...lightColors,
  background: lightColors.bgDark,
  surface: lightColors.bgCard,
  text: lightColors.surfaceLight,
  textPrimary: lightColors.surfaceLight,
  textSecondary: '#cbd5e1',
  overlay: lightColors.overlay,
  muted: '#cbd5e1', // A lighter gray for dark mode
  border: '#334155', // A lighter border for dark mode
};

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeState = {
  mode: ThemeMode;
  colors: typeof lightColors;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const getColorsForMode = (mode: ThemeMode) => {
  if (mode === 'light') return lightColors;
  if (mode === 'dark') return darkColors;
  return Appearance.getColorScheme() === 'dark' ? darkColors : lightColors;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',
  colors: getColorsForMode('light'),
  toggle: () => {
    const nextMode = get().mode === 'light' ? 'dark' : 'light';
    set({ mode: nextMode, colors: getColorsForMode(nextMode) });
  },
  setMode: (mode) => set({ mode, colors: getColorsForMode(mode) }),
}));

Appearance.addChangeListener(({ colorScheme }) => {
  const mode = useThemeStore.getState().mode;
  if (mode === 'system') {
    useThemeStore.setState({ colors: colorScheme === 'dark' ? darkColors : lightColors });
  }
});
