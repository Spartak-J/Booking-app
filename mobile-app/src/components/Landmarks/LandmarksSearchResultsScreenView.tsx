import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import { Landmark } from '@/services/landmarkService';
import { spacing, radius, useTheme } from '@/theme';
import { HeaderBar, MediaOverlayCard, ScreenContainer, Typography } from '@/ui';
import { s } from '@/utils/scale';
import fallbackCardImage from '@/assets/images/1.png';
import lvivBeerImage from '@/assets/images/lviv/beer.jpeg';
import lvivCostelImage from '@/assets/images/lviv/costel.jpeg';
import lvivHighImage from '@/assets/images/lviv/high.jpeg';
import lvivItalianImage from '@/assets/images/lviv/italian.jpeg';
import lvivRatushaImage from '@/assets/images/lviv/ratusha.jpeg';
import lvivTheaterImage from '@/assets/images/lviv/theater.jpeg';
import lvivToysImage from '@/assets/images/lviv/toys.jpeg';
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

const normalizeTitle = (value: string): string =>
  value
    .toLowerCase()
    .replace(/['’`"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getLvivShowcaseImage = (cityName: string, title: string) => {
  const isLviv = cityName.toLowerCase().includes('льв') || cityName.toLowerCase().includes('lviv');
  if (!isLviv) return undefined;

  const normalized = normalizeTitle(title);
  if (normalized.includes('музей') && normalized.includes('пив')) return lvivBeerImage;
  if ((normalized.includes('костел') || normalized.includes('кстел')) && normalized.includes('ельжб'))
    return lvivCostelImage;
  if (normalized.includes('висок') && normalized.includes('замок')) return lvivHighImage;
  if (normalized.includes('італій') && normalized.includes('дворик')) return lvivItalianImage;
  if (normalized.includes('ратуш')) return lvivRatushaImage;
  if (normalized.includes('театр') && (normalized.includes('опер') || normalized.includes('балет')))
    return lvivTheaterImage;
  if (normalized.includes('дворик') && normalized.includes('іграш')) return lvivToysImage;
  return lvivBeerImage;
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
  const { colors, tokens } = useTheme();
  const { t } = useTranslation();
  const headerTop = s(6);
  const cityTop = headerTop + s(41);
  const listTop = cityTop + s(36);
  const palette = useMemo(
    () => ({
      screenBg: tokens.bgScreen,
      text: tokens.textPrimary,
      icon: tokens.textPrimary,
    }),
    [tokens],
  );
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <ScreenContainer style={[styles.container, { backgroundColor: palette.screenBg }]} edges={[]}>
      <HeaderBar
        title={t('landmarks.title')}
        onBack={onBack}
        onSearch={onSearch}
        onMenu={onOpenMenu}
        style={[styles.header, { top: headerTop }]}
        titleStyle={styles.headerTitle}
        backStyle={styles.backButton}
        searchStyle={styles.searchButton}
        menuStyle={styles.menuButton}
        iconColor={palette.icon}
      />

      <Typography
        variant="h2"
        style={[styles.cityLabel, { color: palette.text, top: cityTop }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {cityName}
      </Typography>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={[styles.list, { marginTop: listTop }]}
      >
        {landmarks.map((item) => {
          const lvivImage = getLvivShowcaseImage(cityName, item.title);
          return (
          <MediaOverlayCard
            key={item.id}
            title={item.title}
            imageSource={lvivImage ?? item.image}
            fallbackImageSource={lvivImage ?? fallbackCardImage}
            onPress={() => onOpenLandmark(item.id)}
            style={styles.card}
            topRightAccessory={
              <MaterialCommunityIcons name="heart-outline" size={s(16)} color={palette.icon} />
            }
            bottomRightAccessory={
              <MaterialCommunityIcons name="dots-vertical" size={s(16)} color={palette.icon} />
            }
          />
          );
        })}
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
      borderRadius: 0,
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
      alignSelf: 'center',
      zIndex: 1,
    },
    list: {},
    listContent: {
      paddingHorizontal: 0,
      paddingBottom: spacing.xl,
      gap: s(10),
    },
    card: {
      width: s(371),
      height: s(188),
      alignSelf: 'center',
    },
  });

export default LandmarksSearchResultsScreenView;
