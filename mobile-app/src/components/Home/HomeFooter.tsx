// Component: HomeFooter. Used in: RootNavigator.tsx.
import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, Typography } from '@/ui';
import { radius } from '@/theme';
import { useTheme } from '@/theme';
import { s, SCREEN_WIDTH } from '@/utils/scale';
import homeBlack from '@/assets/images/home_black.png';
import homeWhite from '@/assets/images/home_white.png';
import homeOrange from '@/assets/images/home_orange.png';
import messageBlack from '@/assets/images/message_black.png';
import messageWhite from '@/assets/images/message_white.png';
import messageOrange from '@/assets/images/message_orange.png';
import bookingBlack from '@/assets/images/booking_black.png';
import bookingWhite from '@/assets/images/booking_white.png';
import bookingOrange from '@/assets/images/booking_orange.png';
import profileBlack from '@/assets/images/profile_black.png';
import profileWhite from '@/assets/images/profile_white.png';
import profileOrange from '@/assets/images/profile_orange.png';
import type { FooterNavItem } from './types';

type HomeFooterProps = {
  items: FooterNavItem[];
  activeId?: FooterNavItem['id'];
  bottomInset?: number;
};

const FOOTER_WIDTH = s(412);
const FOOTER_HEIGHT = s(50);

const NAV_BOTTOM_OFFSET = s(0);
const NAV_LAYOUT = {
  home: {
    width: s(43),
    height: s(39),
    left: s((412 - 43) / 2 - 155.5),
    top: s((50 - 39) / 2 - 0.5) - NAV_BOTTOM_OFFSET,
  },
  messages: {
    width: s(76),
    height: s(41),
    left: s((412 - 76) / 2 - 52),
    top: s((50 - 41) / 2 - 0.5) - NAV_BOTTOM_OFFSET,
  },
  bookings: {
    width: s(71),
    height: s(39),
    left: s((412 - 71) / 2 + 57.5),
    top: s((50 - 39) / 2 - 0.5) - NAV_BOTTOM_OFFSET,
  },
  profile: {
    width: s(44),
    height: s(39),
    left: s((412 - 44) / 2 + 155),
    top: s((50 - 39) / 2 - 0.5) - NAV_BOTTOM_OFFSET,
  },
};

const getIconSource = (id: FooterNavItem['id'], isDark: boolean, isActive: boolean) => {
  if (id === 'home') return isActive ? homeOrange : isDark ? homeWhite : homeBlack;
  if (id === 'messages') return isActive ? messageOrange : isDark ? messageWhite : messageBlack;
  if (id === 'bookings') return isActive ? bookingOrange : isDark ? bookingWhite : bookingBlack;
  if (id === 'profile') return isActive ? profileOrange : isDark ? profileWhite : profileBlack;
  return isDark ? homeWhite : homeBlack;
};

const getPalette = (mode: string, colors: Record<string, string>) => ({
  bg:
    mode === 'dark'
      ? (colors.bgCard ?? colors.surface)
      : (colors.surfaceWarm ?? colors.surfaceLightDarker ?? colors.surface),
  label:
    mode === 'dark'
      ? (colors.surfaceLight ?? colors.onPrimary)
      : (colors.textPrimary ?? colors.text),
  transparent: colors.transparent,
});

export const HomeFooter: React.FC<HomeFooterProps> = ({
  items,
  activeId = 'home',
  bottomInset = 0,
}) => {
  const { colors, mode } = useTheme();
  const palette = useMemo(() => getPalette(mode, colors), [mode, colors]);
  const styles = useMemo(() => getStyles(palette), [palette]);
  const isDark = mode === 'dark';

  return (
    <View style={[styles.container, { paddingBottom: bottomInset, backgroundColor: palette.bg }]}>
      <View style={styles.bottomNav}>
      {items.map((item) => {
        const layout = NAV_LAYOUT[item.id as keyof typeof NAV_LAYOUT];
        const isActive = item.id === activeId;
        return (
          <Button
            key={item.id}
            variant="ghost"
            style={[styles.navItem, layout, isActive ? styles.navItemActive : {}]}
            onPress={item.onPress ?? (() => {})}
          >
            <Image
              source={getIconSource(item.id, isDark, isActive)}
              style={isActive ? styles.navIconActive : styles.navIcon}
            />
            {!isActive && (
              <Typography
                variant="caption"
                style={styles.navLabel}
                tone="primary"
                numberOfLines={1}
                ellipsizeMode="clip"
                adjustsFontSizeToFit
                minimumFontScale={0.72}
              >
                {item.label}
              </Typography>
            )}
          </Button>
        );
      })}
      </View>
    </View>
  );
};

const getStyles = (palette: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    container: {
      width: FOOTER_WIDTH,
      left: (SCREEN_WIDTH - FOOTER_WIDTH) / 2,
      borderRadius: radius.md,
      overflow: 'hidden',
    },
    bottomNav: {
      width: FOOTER_WIDTH,
      height: FOOTER_HEIGHT,
      backgroundColor: palette.bg,
    },
    navItem: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      paddingHorizontal: 0,
      padding: 0,
      borderWidth: 0,
      backgroundColor: palette.transparent,
    },
    navItemActive: {
      borderRadius: radius.xl,
    },
    navIcon: {
      width: s(24),
      height: s(24),
      resizeMode: 'contain',
    },
    navIconActive: {
      width: s(42),
      height: s(42),
      resizeMode: 'contain',
    },
    navLabel: {
      marginTop: s(4),
      textAlign: 'center',
      maxWidth: s(110),
      color: palette.label,
      fontSize: s(11),
      lineHeight: s(12),
    },
  });

export default HomeFooter;
