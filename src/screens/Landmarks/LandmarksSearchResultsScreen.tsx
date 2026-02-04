// Screen: LandmarksSearchResultsScreen. Used in: RootNavigator.
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Animated, Easing, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import { useTheme, withOpacity } from '@/theme';
import { HeaderBar, ScreenContainer } from '@/ui';
import { s } from '@/utils/scale';
import landmarkImage1 from '@/assets/images/1.png';
import landmarkImage2 from '@/assets/images/2.png';
import landmarkImage3 from '@/assets/images/3.png';
import landmarkImage4 from '@/assets/images/4.png';
import landmarkImage5 from '@/assets/images/5.png';

const OVERLAY_ANIMATION_DURATION = 250;

const LANDMARKS = [
  { id: '1', title: 'Музей пивоварні', image: landmarkImage1 },
  { id: '2', title: 'Театр опери та балету імені Соломії Крушельницької', image: landmarkImage2 },
  { id: '3', title: 'Італійський Дворик', image: landmarkImage3 },
  { id: '4', title: 'Костел Ельжбети', image: landmarkImage4 },
  { id: '5', title: 'Високий замок', image: landmarkImage5 },
  { id: '6', title: 'Дворик Іграшок', image: landmarkImage1 },
  { id: '7', title: 'Ратуша', image: landmarkImage2 },
];

export const LandmarksSearchResultsScreen = () => {
  const navigation = useNavigation<any>();
  // TODO: move theming to UI layer
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark';
  const palette = useMemo(
    () => ({
      screenBg: isDark ? colors.bgDark : colors.surfaceLight,
      headerBg: isDark ? colors.bgDark : colors.surfaceLight,
      text: isDark ? colors.surfaceLight : colors.textPrimary,
      headerIcon: isDark ? colors.surfaceLight : colors.textPrimary,
      cardLabelBg: withOpacity(colors.black, 0.1),
      cardLabelText: colors.surfaceLight,
      footerBg: isDark ? colors.bgDark : colors.surfaceLight,
      footerIcon: isDark ? colors.surfaceLight : colors.black,
    }),
    [colors, isDark],
  );

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

  const goToSearch = () => navigation.navigate('Landmarks');

  return (
    <ScreenContainer style={[styles.container, { backgroundColor: palette.screenBg }]} edges={[]}>
      <HeaderBar
        title="Визначні пам’ятки"
        onBack={() => navigation.goBack()}
        onSearch={goToSearch}
        onMenu={openMenu}
        style={styles.header}
        titleStyle={styles.headerTitle}
        backStyle={styles.backButton}
        searchStyle={styles.searchButton}
        menuStyle={styles.menuButton}
      />

      <Text
        style={[styles.cityLabel, { color: palette.text }]}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        allowFontScaling
        maxFontSizeMultiplier={1.2}
      >
        Львів
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      >
        {LANDMARKS.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={[styles.cardLabel, { backgroundColor: palette.cardLabelBg }]}>
              <Text
                style={[styles.cardLabelText, { color: palette.cardLabelText }]}
                numberOfLines={2}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                {item.title}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

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

// LEGACY STYLES: contains hardcoded typography values
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    width: s(412),
    height: s(36),
    left: 0,
    top: s(43),
    zIndex: 2,
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
  headerTitle: {
    position: 'absolute',
    left: s(117),
    top: s(9),
    fontSize: s(15),
    lineHeight: s(18),
    fontWeight: '600',
    fontFamily: 'MontserratAlternates-SemiBold',
  },
  searchButton: {
    position: 'absolute',
    right: s(52),
    top: s(6),
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
  cityLabel: {
    position: 'absolute',
    top: s(94),
    alignSelf: 'center',
    fontSize: s(20),
    lineHeight: s(24),
    fontWeight: '600',
    fontFamily: 'MontserratAlternates-SemiBold',
    zIndex: 1,
  },
  list: {
    marginTop: s(130),
  },
  listContent: {
    paddingHorizontal: s(19),
    paddingBottom: s(80),
    gap: s(10),
  },
  card: {
    width: s(371),
    height: s(188),
    borderRadius: s(10),
    overflow: 'hidden',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  cardLabel: {
    position: 'absolute',
    left: s(7),
    bottom: s(6),
    borderRadius: s(10),
    paddingVertical: s(6),
    paddingHorizontal: s(10),
  },
  cardLabelText: {
    fontSize: s(14),
    lineHeight: s(17),
    fontWeight: '700',
    fontFamily: 'MontserratAlternates-Bold',
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
  },
  navHome: {
    position: 'absolute',
    width: s(44),
    height: s(44),
    left: s(182),
    top: s(2),
    borderRadius: s(22),
  },
  navOverview: {
    position: 'absolute',
    width: s(16),
    height: s(16),
    left: s(276),
    top: s(16),
    borderRadius: s(2),
  },
});

export default LandmarksSearchResultsScreen;
