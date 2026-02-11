// Component: HomeMenuSheet. Used in: LandmarksScreen.tsx, HomeScreen.tsx, SearchResultsScreen.tsx….
import React, { useMemo, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Modal, Typography } from '@/ui';
import { radius, withOpacity } from '@/theme';
import { useTheme } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';
import type { MenuItem } from './types';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';

type HomeMenuSheetProps = {
  visible: boolean;
  onClose: () => void;
  animatedStyle: Animated.AnimatedProps<Record<string, any>>;
  items: MenuItem[];
};

export const HomeMenuSheet: React.FC<HomeMenuSheetProps> = ({
  visible,
  onClose,
  animatedStyle,
  items,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, mode, setMode } = useTheme();
  const palette = useMemo(() => getPalette(colors, mode === 'dark'), [colors, mode]);
  const styles = useMemo(() => getStyles(palette), [palette]);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Українська');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('UAH');

  const handleClose = () => {
    setLanguageOpen(false);
    setCurrencyOpen(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      variant="dialog"
      position="top"
      overlayOpacity={palette.overlayOpacity}
      contentStyle={styles.modalContent}
    >
      <Animated.View style={[styles.menuSheet, animatedStyle]}>
        <View style={styles.menuHeader}>
          <Typography variant="h2" tone="primary">
            Меню
          </Typography>
        </View>

        <View style={styles.menuList}>
          {items.map((item) => {
            const isLanguage = item.id === 'language';
            const isCurrency = item.id === 'currency';
            const isTheme = item.id === 'theme';
            const isMessages = item.id === 'messages';
            const isBookings = item.id === 'bookings';
            const isAbout = item.id === 'about';
            const isSaved = item.id === 'saved';

            return (
              <View key={item.id} style={styles.menuItemWrap}>
                <Button
                  variant="ghost"
                  style={styles.menuItem}
                  onPress={() => {
                    if (isLanguage) {
                      setLanguageOpen((prev) => !prev);
                      setCurrencyOpen(false);
                    } else if (isCurrency) {
                      setCurrencyOpen((prev) => !prev);
                      setLanguageOpen(false);
                    } else if (isTheme) {
                      setMode(mode === 'dark' ? 'light' : 'dark');
                    } else if (isMessages) {
                      handleClose();
                      (navigation as any).navigate(Routes.Main, { screen: 'Notifications' });
                    } else if (isBookings) {
                      handleClose();
                      (navigation as any).navigate(Routes.Main, { screen: 'Bookings' });
                    } else if (isAbout) {
                      handleClose();
                      navigation.navigate(Routes.AboutCenter);
                    } else if (isSaved) {
                      handleClose();
                      navigation.navigate(Routes.Saved);
                    }
                  }}
                >
                  <View style={styles.menuItemContent}>
                    <item.Icon size={s(16)} color={palette.text} />
                    <Typography variant="menu" tone="primary">
                      {item.label}
                    </Typography>
                  </View>
                  {(isLanguage || isCurrency) && (
                    <View style={styles.menuAction}>
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={s(14)}
                        color={palette.text}
                      />
                    </View>
                  )}
                  {isTheme && (
                    <View style={styles.themeToggle}>
                      <View
                        style={[
                          styles.themeThumb,
                          mode === 'dark' ? styles.themeThumbDark : styles.themeThumbLight,
                        ]}
                      />
                    </View>
                  )}
                </Button>
                {isLanguage && languageOpen && (
                  <View style={styles.dropdownPanel}>
                    {LANGUAGE_OPTIONS.map((label) => (
                      <Button
                        key={label}
                        variant="ghost"
                        style={[
                          styles.dropdownItem,
                          label === selectedLanguage
                            ? styles.dropdownItemActive
                            : styles.dropdownItemInactive,
                        ]}
                        onPress={() => setSelectedLanguage(label)}
                      >
                        <Typography
                          variant="menuOption"
                          style={label === selectedLanguage ? styles.dropdownItemTextActive : styles.dropdownItemText}
                          numberOfLines={1}
                        >
                          {label}
                        </Typography>
                      </Button>
                    ))}
                  </View>
                )}
                {isCurrency && currencyOpen && (
                  <View style={[styles.dropdownPanel, styles.currencyPanel]}>
                    {CURRENCY_OPTIONS.map((label) => (
                      <Button
                        key={label}
                        variant="ghost"
                        style={[
                          styles.dropdownItemWide,
                          label === selectedCurrency
                            ? styles.dropdownItemActive
                            : styles.dropdownItemInactive,
                        ]}
                        onPress={() => setSelectedCurrency(label)}
                      >
                        <Typography
                          variant="caption"
                          style={label === selectedCurrency ? styles.dropdownItemTextActive : styles.dropdownItemText}
                          numberOfLines={1}
                        >
                          {label}
                        </Typography>
                      </Button>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.menuHandle} />
      </Animated.View>
    </Modal>
  );
};

const getPalette = (colors: Record<string, string>, isDark: boolean) => {
  const text = colors.textPrimary ?? colors.text;
  const surface = colors.surface;
  const overlay = colors.overlay ?? colors.bgDark ?? text;
  const shadow = colors.bgDark ?? text;
  const sheetLight = colors.surfaceWarm ?? colors.surfaceLightDarker ?? surface;
  const dropdown = isDark
    ? (colors.bgCard ?? colors.bgDark ?? surface)
    : (colors.surfaceAccent ?? colors.surfaceLight ?? surface);
  const dropdownActiveBg = isDark
    ? (colors.surfaceLightDarker ?? colors.surface ?? surface)
    : (colors.surfaceLightDarker ?? colors.surface ?? surface);

  return {
    text,
    accent: colors.primary,
    overlay,
    overlayOpacity: isDark ? 0.7 : 0.5,
    menuSheetBg: isDark ? (colors.bgDark ?? surface) : sheetLight,
    dropdownBg: dropdown,
    dropdownActiveBg,
    shadow,
    transparent: colors.transparent,
    border: colors.border,
    toggleBg: isDark
      ? (colors.surfaceLightDarker ?? surface)
      : (colors.bgCard ?? colors.bgDark ?? surface),
    toggleThumb: isDark
      ? (colors.bgCard ?? colors.bgDark ?? surface)
      : (colors.surfaceLight ?? colors.onPrimary),
  };
};

const LANGUAGE_OPTIONS = [
  'Українська',
  'English',
  'Deutsch',
  'Polski',
  'Español',
  'Italiano',
  'Français',
  'Čeština',
  'Türkçe',
];

const CURRENCY_OPTIONS = ['UAH', 'USD', 'EUR', 'GBP', 'PLN', 'CHF', 'CAD'];

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    modalContent: {
      backgroundColor: palette.transparent,
      padding: 0,
    },
    menuSheet: {
      width: s(412),
      minHeight: s(477),
      alignSelf: 'center',
      borderBottomLeftRadius: radius.md,
      borderBottomRightRadius: radius.md,
      backgroundColor: palette.menuSheetBg,
      shadowColor: palette.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
      paddingBottom: s(18),
    },
    menuHeader: {
      paddingHorizontal: s(24),
      paddingTop: s(16),
      paddingBottom: s(8),
    },
    menuList: {
      paddingHorizontal: s(24),
      paddingTop: s(10),
      gap: s(10),
    },
    menuItemWrap: {
      width: '100%',
      gap: s(8),
    },
    menuItem: {
      width: '100%',
      paddingVertical: s(5),
      paddingHorizontal: s(10),
      alignItems: 'flex-start',
      borderRadius: radius.md,
      backgroundColor: palette.transparent,
      borderWidth: 0,
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
    },
    menuAction: {
      position: 'absolute',
      right: s(24),
      width: s(30),
      height: s(30),
      borderRadius: radius.round,
      borderWidth: 1,
      borderColor: palette.text,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeToggle: {
      position: 'absolute',
      right: s(24),
      width: s(36),
      height: s(20),
      borderRadius: radius.xl,
      backgroundColor: palette.toggleBg,
      paddingHorizontal: s(2),
      justifyContent: 'center',
    },
    themeThumb: {
      width: s(16),
      height: s(16),
      borderRadius: radius.round,
      backgroundColor: palette.toggleThumb,
    },
    themeThumbLight: {
      alignSelf: 'flex-start',
    },
    themeThumbDark: {
      alignSelf: 'flex-end',
    },
    dropdownPanel: {
      width: s(412),
      height: s(121),
      backgroundColor: palette.dropdownBg,
      paddingHorizontal: s(14),
      paddingVertical: s(7),
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: s(10),
      rowGap: s(5),
      alignSelf: 'center',
    },
    currencyPanel: {
      height: s(170),
      paddingHorizontal: s(6),
      paddingVertical: s(15),
      columnGap: s(12),
      rowGap: s(10),
    },
    dropdownItem: {
      width: s(106),
      height: s(30),
      borderRadius: radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
    },
    dropdownItemWide: {
      width: s(106),
      height: s(30),
      borderRadius: radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
    },
    dropdownItemActive: {
      backgroundColor: withOpacity(palette.accent, 0.18),
      borderColor: palette.accent,
      borderWidth: 1,
    },
    dropdownItemInactive: {
      backgroundColor: palette.transparent,
    },
    dropdownItemTextActive: {
      color: palette.text,
    },
    dropdownItemText: {
      color: palette.text,
    },
    menuHandle: {
      position: 'absolute',
      width: s(37),
      height: s(3),
      borderRadius: radius.md,
      left: (SCREEN_WIDTH - s(37)) / 2,
      bottom: s(6),
      backgroundColor: palette.border,
    },
  });

export default HomeMenuSheet;
