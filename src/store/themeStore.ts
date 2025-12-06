import { create } from 'zustand';

import { colors as lightColors } from '@/theme/colors';

const darkColors = {
  ...lightColors,
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f8fafc',
  muted: '#cbd5e1',
  border: '#334155',
};

type ThemeMode = 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  colors: typeof lightColors;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',
  colors: lightColors,
  toggle: () => {
    const nextMode = get().mode === 'light' ? 'dark' : 'light';
    set({
      mode: nextMode,
      colors: nextMode === 'light' ? lightColors : darkColors,
    });
  },
  setMode: (mode) =>
    set({
      mode,
      colors: mode === 'light' ? lightColors : darkColors,
    }),
}));
