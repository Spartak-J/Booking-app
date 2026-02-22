import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import { Landmark } from '@/services/landmarkService';
import { spacing, radius, useTheme, withOpacity } from '@/theme';
import { Button, HeaderBar, ScreenContainer, Typography } from '@/ui';
import { s } from '@/utils/scale';
import backgroundLandmarks from '@/assets/images/landmarks_bg.jpg';
import { useTranslation } from '@/i18n';

type Props = {
  cityName: string;
  landmarks: Landmark[];
  menuOpen: boolean;
  menuAnimationStyle?: any;
  onBack: () => void;
  onSearch: () => void;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onOpenLandmark: (landmarkId: string) => void;
};

export const LandmarksSearchResultsScreenView: React.FC<Props> = ({
  cityName,
  landmarks,
  menuOpen,
  menuAnimationStyle,
  onBack,
  onSearch,
  onOpenMenu,
  onCloseMenu,
  onOpenLandmark,
}) => {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const isDark = mode === 'dark';
  const palette = useMemo(
    () => ({
      screenBg: isDark ? colors.bgDark : colors.surfaceLight,
      text: isDark ? colors.surfaceLight : colors.textPrimary,
      cardLabelBg: withOpacity(colors.black, 0.1),
      cardLabelText: colors.surfaceLight,
      footerBg: isDark ? colors.bgDark : colors.surfaceLight,
      footerIcon: isDark ? colors.surfaceLight : colors.black,
    }),
    [colors, isDark],
  );
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <ScreenContainer style={[styles.container, { backgroundColor: palette.screenBg }]} edges={[]}>
      <Image source={backgroundLandmarks} style={styles.background} />
      <HeaderBar
        title={t('landmarks.title')}
        onBack={onBack}
        onSearch={onSearch}
        onMenu={onOpenMenu}
        style={styles.header}
        titleStyle={styles.headerTitle}
        backStyle={styles.backButton}
        searchStyle={styles.searchButton}
        menuStyle={styles.menuButton}
      />

      <Typography
        variant="h2"
        style={[styles.cityLabel, { color: palette.text }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {cityName}
      </Typography>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      >
        {landmarks.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onPress={() => onOpenLandmark(item.id)}
            style={styles.card}
          >
            <Image source={item.image} style={styles.cardImage} />
            <View style={[styles.cardLabel, { backgroundColor: palette.cardLabelBg }]}>
              <Typography
                variant="subtitle"
                style={[styles.cardLabelText, { color: palette.cardLabelText }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Typography>
            </View>
          </Button>
        ))}
      </ScrollView>

      <View style={[styles.bottomNav, { backgroundColor: palette.footerBg }]}>
        <View style={[styles.navBack, { backgroundColor: palette.footerIcon }]} />
        <View style={[styles.navHome, { backgroundColor: palette.footerIcon }]} />
        <View style={[styles.navOverview, { backgroundColor: palette.footerIcon }]} />
      </View>

      <HomeMenuSheet
        visible={menuOpen}
        onClose={onCloseMenu}
        animatedStyle={menuAnimationStyle}
        items={MENU_ITEMS}
      />
    </ScreenContainer>
  );
};

const getStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      resizeMode: 'cover',
      zIndex: 0,
    },
    header: {
      position: 'absolute',
      width: '100%',
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
      backgroundColor: withOpacity(colors.bgCard, 0.6),
      borderRadius: radius.round,
    },
    headerTitle: {
      position: 'absolute',
      left: s(117),
      top: s(9),
      color: colors.textPrimary,
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
      zIndex: 1,
    },
    list: {
      marginTop: s(130),
    },
    listContent: {
      paddingHorizontal: s(19),
      paddingBottom: s(80),
      gap: spacing.sm,
    },
    card: {
      width: s(371),
      height: s(188),
      borderRadius: radius.lg,
      overflow: 'hidden',
      backgroundColor: colors.bgCard,
    },
    cardImage: {
      ...StyleSheet.absoluteFillObject,
      resizeMode: 'cover',
    },
    cardLabel: {
      position: 'absolute',
      left: s(7),
      bottom: s(6),
      borderRadius: radius.md,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    cardLabelText: {
      fontSize: s(14),
      lineHeight: s(17),
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
      borderRadius: radius.round,
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

export default LandmarksSearchResultsScreenView;
