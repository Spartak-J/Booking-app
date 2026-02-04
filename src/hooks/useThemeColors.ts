import { useTheme } from '@/theme';

export const useThemeColors = () => {
  const { colors, mode, toggle, setMode } = useTheme();
  return { colors, mode, toggle, setMode };
};
