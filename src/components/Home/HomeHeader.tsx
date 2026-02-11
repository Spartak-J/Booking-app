// Component: HomeHeader. Used in: HomeScreen.tsx.
import React, { useMemo } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button, HeaderBar, IconButton, Typography } from '@/ui';
import { radius, typography, withOpacity } from '@/theme';
import { useTheme } from '@/theme';
import { s } from '@/utils/scale';
import heroImage from '@/assets/images/1.png';

type HomeHeaderProps = {
  mode?: 'search' | 'titleOnly';
  title?: string;
  heroCityLabel?: string;
  heroCityPlaceholder?: string;
  onChangeCity?: (value: string) => void;
  heroDateLabel?: string;
  heroGuestLabel?: string;
  onOpenMenu?: () => void;
  onOpenDatePicker?: () => void;
  onOpenGuests?: () => void;
  onSearch?: () => void;
  onBack?: () => void;
  showMenu?: boolean;
  showSearch?: boolean;
  heroImageSource?: ImageSourcePropType;
  heroHeight?: number;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  mode = 'search',
  title,
  heroCityLabel,
  heroCityPlaceholder,
  onChangeCity,
  heroDateLabel,
  heroGuestLabel,
  onOpenMenu,
  onOpenDatePicker,
  onOpenGuests,
  onSearch,
  onBack,
  showMenu = true,
  showSearch = false,
  heroImageSource = heroImage,
  heroHeight = s(132),
}) => {
  const { colors } = useTheme();
  const isDark = colors.background === colors.bgDark;
  const palette = useMemo(() => getPalette(colors, isDark), [colors, isDark]);
  const styles = useMemo(() => getStyles(palette, heroHeight), [palette, heroHeight]);
  const labelTone = isDark ? 'onAccent' : 'primary';
  const isTitleOnly = mode === 'titleOnly';
  const handleChangeCity = onChangeCity ?? (() => {});
  const handleOpenDatePicker = onOpenDatePicker ?? (() => {});
  const handleOpenGuests = onOpenGuests ?? (() => {});
  const handleSearch = onSearch ?? (() => {});
  const handleOpenMenu = onOpenMenu ?? (() => {});
  const handleBack = onBack ?? (() => {});

  return (
    <View style={styles.heroContainer}>
      <LinearGradient colors={palette.baseGradient} style={styles.hero}>
        <ImageBackground
          source={heroImageSource}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <LinearGradient colors={palette.overlayGradient} style={styles.heroOverlay} />
          {isTitleOnly ? (
            <HeaderBar
              title={title}
              onBack={handleBack}
              onSearch={showSearch ? handleSearch : undefined}
              onMenu={showMenu ? handleOpenMenu : undefined}
              showBack
              showSearch={showSearch}
              showMenu={showMenu}
              style={styles.titleHeader}
              titleStyle={styles.titleHeaderText}
              backStyle={styles.titleHeaderBack}
              searchStyle={styles.titleHeaderSearch}
              menuStyle={styles.titleHeaderMenu}
            />
          ) : (
            <>
              <HeaderBar
                onMenu={handleOpenMenu}
                showMenu
                showBack={false}
                style={styles.searchHeader}
                menuStyle={styles.searchHeaderMenuButton}
              />
              <View style={styles.searchCard}>
                <View style={styles.searchRow}>
                  <View style={[styles.searchSection, styles.searchCity, styles.searchButtonBase]}>
                    <View style={styles.searchSectionContent}>
                      <MaterialCommunityIcons name="map-marker" size={s(13)} color={palette.text} />
                      <TextInput
                        value={heroCityLabel}
                        onChangeText={handleChangeCity}
                        placeholder={heroCityPlaceholder}
                        placeholderTextColor={palette.muted}
                        style={styles.cityInput}
                        multiline={false}
                      />
                    </View>
                  </View>
                  <View style={styles.searchDivider} />
                  <Button
                    variant="ghost"
                    style={[styles.searchSection, styles.searchDate, styles.searchButtonBase]}
                    onPress={handleOpenDatePicker}
                  >
                    <View style={styles.searchSectionContent}>
                      <MaterialCommunityIcons name="calendar" size={s(13)} color={palette.text} />
                      <Typography
                        variant="chip"
                        tone={labelTone}
                        numberOfLines={1}
                        style={styles.searchText}
                      >
                        {heroDateLabel || '07.01-12.01'}
                      </Typography>
                    </View>
                  </Button>
                  <View style={styles.searchDivider} />
                  <Button
                    variant="ghost"
                    style={[styles.searchSection, styles.searchGuests, styles.searchButtonBase]}
                    onPress={handleOpenGuests}
                  >
                    <View style={styles.searchSectionContent}>
                      <MaterialCommunityIcons
                        name="account-group"
                        size={s(14)}
                        color={palette.text}
                      />
                      <Typography
                        variant="chip"
                        tone={labelTone}
                        numberOfLines={1}
                        style={styles.searchText}
                      >
                        {heroGuestLabel || '2 дорослих'}
                      </Typography>
                    </View>
                  </Button>
                  <IconButton
                    onPress={handleSearch}
                    icon={
                      <MaterialCommunityIcons name="magnify" size={s(16)} color={palette.surface} />
                    }
                    variant="filled"
                    size="sm"
                    style={styles.searchButton}
                  />
                </View>
              </View>
            </>
          )}
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

const getPalette = (colors: Record<string, string>, isDark: boolean) => {
  const text = colors.textPrimary ?? colors.text;
  const surface = colors.surface;
  const overlay = colors.overlay ?? colors.bgDark ?? text;
  const lightSurface = colors.surfaceLight ?? surface;
  const lightSurfaceDarker = colors.surfaceLightDarker ?? surface;
  const darkSurface = colors.bgCard ?? overlay;
  const heroGradientStart = colors.heroGradientStart ?? lightSurfaceDarker;
  const heroGradientEnd = colors.heroGradientEnd ?? darkSurface;
  return {
    text,
    surface,
    overlayGradient: isDark
      ? ([withOpacity(lightSurface, 0), withOpacity(colors.bgDark ?? overlay, 0.9)] as const)
      : ([withOpacity(lightSurface, 0), withOpacity(lightSurface, 0.9)] as const),
    baseGradient: [heroGradientStart, heroGradientEnd] as const,
    searchBorder: isDark ? (colors.surfaceLight ?? colors.onPrimary) : text,
    searchBg: isDark ? withOpacity(darkSurface, 0.4) : withOpacity(lightSurface, 0.4),
    menuBg: isDark ? darkSurface : lightSurface,
    menuIcon: isDark ? (colors.surfaceLight ?? colors.onPrimary) : text,
    divider: isDark ? (colors.surfaceLight ?? colors.onPrimary) : text,
    muted: colors.textSecondary ?? colors.muted ?? text,
    backgroundFallback: isDark ? (colors.bgDark ?? overlay) : lightSurfaceDarker,
  };
};

const getStyles = (palette: ReturnType<typeof getPalette>, heroHeight: number) =>
  StyleSheet.create({
    heroContainer: {
      width: s(412),
      height: heroHeight,
      alignSelf: 'center',
      marginBottom: s(10),
    },
    hero: {
      width: '100%',
      height: '100%',
      borderRadius: 0,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    heroImageStyle: {
      borderRadius: 0,
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    menuButton: {
      width: s(32),
      height: s(32),
      borderRadius: radius.round,
      backgroundColor: palette.menuBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleHeader: {
      position: 'absolute',
      left: s(20),
      right: s(20),
      top: s(12),
      height: s(36),
      backgroundColor: 'transparent',
      borderRadius: 0,
    },
    titleHeaderText: {
      color: palette.text,
    },
    titleHeaderBack: {
      width: s(32),
      height: s(32),
      borderRadius: radius.round,
      backgroundColor: palette.menuBg,
    },
    titleHeaderMenu: {
      width: s(32),
      height: s(32),
      borderRadius: radius.round,
      backgroundColor: palette.menuBg,
    },
    titleHeaderSearch: {
      width: s(32),
      height: s(32),
      borderRadius: radius.round,
      backgroundColor: palette.menuBg,
    },
    searchHeader: {
      position: 'absolute',
      left: s(20),
      right: s(20),
      top: s(13),
      height: s(32),
      backgroundColor: 'transparent',
      borderRadius: 0,
    },
    searchHeaderMenuButton: {
      width: s(32),
      height: s(32),
      borderRadius: radius.round,
      backgroundColor: palette.menuBg,
    },
    searchCard: {
      position: 'absolute',
      left: s(20),
      top: s(76),
      width: s(372),
      height: s(50),
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: palette.searchBorder,
      backgroundColor: palette.searchBg,
      paddingHorizontal: s(10),
      paddingVertical: s(6),
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(4),
    },
    searchButtonBase: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    searchCity: {
      width: s(93),
      height: s(20),
    },
    searchDate: {
      width: s(89),
      height: s(20),
    },
    searchGuests: {
      width: s(87),
      height: s(20),
    },
    searchSectionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(4),
      flex: 1,
      overflow: 'hidden',
      justifyContent: 'center',
    },
    searchText: {
      flexShrink: 1,
      textAlign: 'left',
    },
    searchDivider: {
      width: 1,
      height: s(40),
      backgroundColor: palette.divider,
      marginHorizontal: s(6),
    },
    cityInput: {
      padding: 0,
      margin: 0,
      color: palette.text,
      ...(typography.chip as object),
      flexShrink: 1,
      minWidth: 0,
      maxWidth: s(72),
      textAlign: 'left',
    },
    searchButton: {
      width: s(32),
      height: s(32),
      borderRadius: radius.round,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: s(6),
    },
  });

export default HomeHeader;
