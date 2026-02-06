import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

import { getColorTokens, getThemeColors, ThemeMode } from './tokens';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ReturnType<typeof getThemeColors>;
  tokens: ReturnType<typeof getColorTokens>;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => listener.remove();
  }, []);

  const resolvedMode = mode === 'system' ? systemScheme : mode;

  const tokens = useMemo(() => getColorTokens(resolvedMode), [resolvedMode]);
  const colors = useMemo(() => getThemeColors(resolvedMode), [resolvedMode]);

  const toggle = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      colors,
      tokens,
      setMode,
      toggle,
    }),
    [mode, colors, tokens, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
