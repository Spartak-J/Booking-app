import React, { useCallback, useContext, useMemo } from 'react';

import { getColorTokens, getThemeColors } from './tokens';
import { ThemeContext } from './ThemeProvider';

export const AdminLightThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const parentTheme = useContext(ThemeContext);

  const noopSetMode = useCallback(() => undefined, []);
  const noopToggle = useCallback(() => undefined, []);

  const value = useMemo(() => {
    if (!parentTheme) return null;
    return {
      ...parentTheme,
      mode: 'light' as const,
      colors: getThemeColors('light'),
      tokens: getColorTokens('light'),
      setMode: noopSetMode,
      toggle: noopToggle,
    };
  }, [noopSetMode, noopToggle, parentTheme]);

  if (!value) {
    return <>{children}</>;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default AdminLightThemeProvider;
