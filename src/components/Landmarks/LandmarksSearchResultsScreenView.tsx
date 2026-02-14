import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import { Landmark } from '@/services/landmarkService';
import { spacing, radius, useTheme } from '@/theme';
import { Button, HeaderBar, ScreenContainer, Typography } from '@/ui';
import { s } from '@/utils/scale';
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
      cardLabelText: colors.surfaceLight,
      footerBg: isDark ? colors.bgDark : colors.surfaceLight,
      footerIcon: isDark ? colors.surfaceLight : colors.black,
    }),
    [colors, isDark],
  );
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <ScreenContainer style={[styles.container, { backgroundColor: palette.screenBg }]} edges={[]}>
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
            <View style={styles.cardLabel}>
              <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFillObject} />
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
    header: {
      position: 'absolute',
      width: '100%',
      height: s(36),
      left: 0,
      top: 0,
      zIndex: 2,
    },
    backButton: {
      position: 'absolute',
      left: s(19),
      top: s(6),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
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
      top: s(58),
      alignSelf: 'center',
      zIndex: 1,
    },
    list: {
      marginTop: s(94),
    },
    listContent: {
      paddingHorizontal: s(19),
      paddingBottom: s(24),
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
      overflow: 'hidden',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    cardLabelText: {
      fontSize: s(14),
      lineHeight: s(17),
    },
  });

export default LandmarksSearchResultsScreenView;
