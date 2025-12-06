import { useThemeStore } from '@/store/themeStore';

export const useThemeColors = () => {
  const { colors, mode, toggle, setMode } = useThemeStore();
  return { colors, mode, toggle, setMode };
};
