// Screen: LandmarksScreen. Used in: RootNavigator.
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import { useTheme, withOpacity } from '@/theme';
import { HeaderBar, ScreenContainer } from '@/ui';
import backgroundMuseum from '@/assets/images/background_museum.png';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;
const OVERLAY_ANIMATION_DURATION = 250;

export const LandmarksScreen = () => {
  const navigation = useNavigation<any>();
  // TODO: move theming to UI layer
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark';
  const palette = useMemo(
    () => ({
      text: isDark ? colors.surfaceLight : colors.textPrimary,
      headerIcon: isDark ? colors.surfaceLight : colors.textPrimary,
      footerBg: isDark ? colors.bgDark : colors.surfaceLight,
      footerIcon: isDark ? colors.surfaceLight : colors.black,
    }),
    [colors, isDark],
  );
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnimation = useMemo(() => new Animated.Value(0), []);

  const animateOverlay = (anim: Animated.Value, open: boolean, onComplete?: () => void) => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: OVERLAY_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => onComplete?.());
  };

  const openMenu = () => {
    setMenuOpen(true);
    menuAnimation.setValue(0);
    animateOverlay(menuAnimation, true);
  };

  const closeMenu = () => {
    animateOverlay(menuAnimation, false, () => setMenuOpen(false));
  };

  const openSearchResults = () => navigation.navigate('LandmarksSearchResults');

  return (
    <ScreenContainer style={styles.container} edges={[]}>
      <Image source={backgroundMuseum} style={styles.background} />

      <HeaderBar
        title="Визначні пам’ятки"
        onBack={() => navigation.goBack()}
        onMenu={openMenu}
        style={styles.header}
        titleStyle={styles.headerTitle}
        backStyle={styles.backButton}
        menuStyle={styles.menuButton}
      />

      <View style={styles.inlineSearch}>
        <View style={styles.inlineSearchCity}>
          <Text
            style={styles.inlineSearchCityText}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Львів
          </Text>
        </View>
        <Pressable style={styles.inlineSearchButton} onPress={openSearchResults}>
          <MaterialCommunityIcons name="magnify" size={s(18)} color={colors.surfaceLight} />
        </Pressable>
      </View>

      <View style={[styles.bottomNav, { backgroundColor: palette.footerBg }]}>
        <View style={[styles.navBack, { backgroundColor: palette.footerIcon }]} />
        <View style={[styles.navHome, { backgroundColor: palette.footerIcon }]} />
        <View style={[styles.navOverview, { backgroundColor: palette.footerIcon }]} />
      </View>

      <HomeMenuSheet
        visible={menuOpen}
        onClose={closeMenu}
        animatedStyle={{
          opacity: menuAnimation,
          transform: [
            {
              translateY: menuAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-s(64), 0],
              }),
            },
          ],
        }}
        items={MENU_ITEMS}
      />
    </ScreenContainer>
  );
};

const getStyles = (colors: any) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgDark,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      width: SCREEN_WIDTH,
      height: '100%',
      resizeMode: 'cover',
      zIndex: 0,
    },
    header: {
      position: 'absolute',
      width: s(412),
      height: s(36),
      left: 0,
      top: s(43),
      zIndex: 2,
    },
    headerTitle: {
      position: 'absolute',
      left: s(141),
      top: s(10),
      fontSize: s(15),
      lineHeight: s(18),
      fontWeight: '600',
      fontFamily: 'MontserratAlternates-SemiBold',
    },
    backButton: {
      position: 'absolute',
      left: s(19),
      top: s(12),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuButton: {
      position: 'absolute',
      right: s(11),
      top: s(2),
      width: s(32),
      height: s(32),
      borderRadius: s(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    inlineSearch: {
      position: 'absolute',
      width: s(372),
      height: s(50),
      left: s(19),
      top: s(91),
      borderRadius: s(20),
      borderWidth: 1,
      borderColor: colors.surfaceLight,
      backgroundColor: withOpacity(colors.bgCard, 0.4),
      justifyContent: 'center',
      zIndex: 1,
    },
    inlineSearchCity: {
      position: 'absolute',
      left: s(38),
      top: s(15),
      height: s(20),
      justifyContent: 'center',
    },
    inlineSearchCityText: {
      fontSize: s(14),
      lineHeight: s(17),
      fontWeight: '500',
      fontFamily: 'MontserratAlternates-Medium',
      color: colors.surfaceLight,
    },
    inlineSearchButton: {
      position: 'absolute',
      right: s(8),
      top: s(9),
      width: s(32),
      height: s(32),
      borderRadius: s(16),
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomNav: {
      position: 'absolute',
      width: s(412),
      height: s(48),
      left: 0,
      bottom: 0,
    },
    navBack: {
      position: 'absolute',
      width: s(44),
      height: s(44),
      left: s(136),
      top: s(2),
      backgroundColor: 'transparent',
    },
    navHome: {
      position: 'absolute',
      width: s(44),
      height: s(44),
      left: s(182),
      top: s(2),
      backgroundColor: 'transparent',
      borderRadius: s(22),
    },
    navOverview: {
      position: 'absolute',
      width: s(16),
      height: s(16),
      left: s(276),
      top: s(16),
      backgroundColor: 'transparent',
      borderRadius: s(2),
    },
  });
