// Component: OfferGalleryScreenView. Used in: OfferGalleryScreen.
import React, { useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import { useTheme } from '@/theme';
import { HeaderBar, Typography } from '@/ui';
import { radius } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';
import { useTranslation } from '@/i18n';

import img1 from '@/assets/images/1.png';
import img2 from '@/assets/images/2.png';
import img3 from '@/assets/images/3.png';
import img4 from '@/assets/images/4.png';
import img5 from '@/assets/images/5.png';

const OVERLAY_ANIMATION_DURATION = 250;
const FALLBACK_IMAGES: ImageSourcePropType[] = [img1, img2, img3, img4, img5];

type OfferGalleryScreenViewProps = {
  images?: ImageSourcePropType[];
  onBack: () => void;
  onSearch: () => void;
};

export const OfferGalleryScreenView: React.FC<OfferGalleryScreenViewProps> = ({
  images,
  onBack,
  onSearch,
}) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const isDark = mode === 'dark';
  const palette = useMemo(
    () => ({
      screenBg: isDark ? colors.bgDark : colors.surfaceLight,
      headerBg: isDark ? colors.bgDark : colors.surfaceLight,
      headerIcon: isDark ? colors.surfaceLight : colors.textPrimary,
    }),
    [colors, isDark],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);
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

  const galleryImages = images && images.length ? images : FALLBACK_IMAGES;
  const getImage = (index: number) => galleryImages[index % galleryImages.length];

  return (
    <View style={styles.container}>
      <HeaderBar
        onBack={onBack}
        onSearch={onSearch}
        onMenu={openMenu}
        style={styles.header}
        backStyle={styles.headerButton}
        searchStyle={styles.headerSearch}
        menuStyle={styles.headerMenu}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: s(120) + insets.bottom }]}
      >
        <Image source={getImage(0)} style={styles.imageLarge} />
        <View style={styles.row}>
          <Image source={getImage(1)} style={styles.imageSmall} />
          <Image source={getImage(2)} style={styles.imageSmall} />
        </View>
        <Image source={getImage(3)} style={styles.imageLarge} />
        <View style={styles.row}>
          <Image source={getImage(4)} style={styles.imageSmall} />
          <Image source={getImage(5)} style={styles.imageSmall} />
        </View>
        <Image source={getImage(6)} style={styles.imageLarge} />
        <View style={styles.row}>
          <Image source={getImage(7)} style={styles.imageSmall} />
          <Image source={getImage(8)} style={styles.imageSmall} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: s(4) + insets.bottom }]}>
        <View style={styles.footerRow}>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="home-outline" size={s(22)} color={palette.headerIcon} />
            <Typography
              variant="caption"
              tone="primary"
              style={styles.footerLabel}
              numberOfLines={1}
            >
              {t('offer.footer.home')}
            </Typography>
          </View>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons
              name="message-outline"
              size={s(22)}
              color={palette.headerIcon}
            />
            <Typography
              variant="caption"
              tone="primary"
              style={styles.footerLabel}
              numberOfLines={1}
            >
              {t('offer.footer.messages')}
            </Typography>
          </View>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={s(22)}
              color={palette.headerIcon}
            />
            <Typography
              variant="caption"
              tone="primary"
              style={styles.footerLabel}
              numberOfLines={1}
            >
              {t('offer.footer.bookings')}
            </Typography>
          </View>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons
              name="account-outline"
              size={s(22)}
              color={palette.headerIcon}
            />
            <Typography
              variant="caption"
              tone="primary"
              style={styles.footerLabel}
              numberOfLines={1}
            >
              {t('offer.footer.profile')}
            </Typography>
          </View>
        </View>
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
    </View>
  );
};

const getStyles = (palette: { screenBg: string; headerBg: string; headerIcon: string }) =>
  // LEGACY VIEW — UI pending redesign
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.screenBg,
    },
    header: {
      position: 'absolute',
      top: s(43),
      left: 0,
      width: SCREEN_WIDTH,
      height: s(36),
      backgroundColor: palette.headerBg,
      zIndex: 2,
    },
    headerButton: {
      position: 'absolute',
      left: s(19),
      top: s(9),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerSearch: {
      position: 'absolute',
      right: s(58),
      top: s(6),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerMenu: {
      position: 'absolute',
      right: s(20),
      top: s(2),
      width: s(32),
      height: s(32),
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingTop: s(88),
      paddingHorizontal: s(20),
      gap: s(20),
    },
    imageLarge: {
      width: s(372),
      height: s(230),
      borderRadius: radius.md,
    },
    row: {
      width: s(372),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    imageSmall: {
      width: s(176),
      height: s(110),
      borderRadius: radius.md,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: s(50),
      backgroundColor: palette.headerBg,
      paddingHorizontal: s(20),
      paddingTop: s(4),
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    footerItem: {
      alignItems: 'center',
      gap: s(2),
      width: s(76),
    },
    footerLabel: {
      fontSize: s(10),
      flexWrap: 'nowrap',
    },
  });

export default OfferGalleryScreenView;
