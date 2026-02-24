import React, { useMemo } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';

import HomeHeader from '@/components/Home/HomeHeader';
import OfferLocationMap from '@/components/Offer/OfferLocationMap';
import { Landmark } from '@/services/landmarkService';
import { spacing, radius } from '@/theme';
import { useTheme } from '@/theme';
import { Button, ScreenContainer, Typography } from '@/ui';
import { useTranslation } from '@/i18n';
import { SCREEN_WIDTH } from '@/utils/scale';
import fallbackCardImage from '@/assets/images/1.png';
import lvivBeerImage from '@/assets/images/lviv/beer.jpeg';
import lvivCostelImage from '@/assets/images/lviv/costel.jpeg';
import lvivHighImage from '@/assets/images/lviv/high.jpeg';
import lvivItalianImage from '@/assets/images/lviv/italian.jpeg';
import lvivRatushaImage from '@/assets/images/lviv/ratusha.jpeg';
import lvivTheaterImage from '@/assets/images/lviv/theater.jpeg';
import lvivToysImage from '@/assets/images/lviv/toys.jpeg';

type Props = {
  landmark?: Landmark;
  cityName?: string;
  fallbackLatitude?: number;
  fallbackLongitude?: number;
  onBack: () => void;
  onFindStay: () => void;
};

const normalizeTitle = (value: string): string =>
  value
    .toLowerCase()
    .replace(/['’`"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const resolveLandmarkImage = (cityName?: string, title?: string, remoteImage?: Landmark['image']) => {
  const safeTitle = title ?? '';
  const safeCity = cityName ?? '';
  const isLviv = safeCity.toLowerCase().includes('льв') || safeCity.toLowerCase().includes('lviv');

  if (isLviv) {
    const normalized = normalizeTitle(safeTitle);
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
  }

  return remoteImage ?? fallbackCardImage;
};

export const LandmarkDetailScreenView: React.FC<Props> = ({
  landmark,
  cityName,
  fallbackLatitude,
  fallbackLongitude,
  onBack,
  onFindStay,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const resolvedImageSource = useMemo(
    () => resolveLandmarkImage(cityName, landmark?.title, landmark?.image),
    [cityName, landmark?.image, landmark?.title],
  );

  return (
    <ImageBackground source={resolvedImageSource} style={styles.background} resizeMode="cover">
      <ScreenContainer
        style={styles.container}
        edges={[]}
        withBackground={false}
        withKeyboardAvoiding={false}
        contentContainerStyle={styles.containerContent}
      >
        <View style={styles.headerFullBleed}>
          <HomeHeader
            mode="titleOnly"
            title={cityName ?? t('landmarks.title')}
            onBack={onBack}
            showMenu={false}
            showSearch={false}
            heroImageSource={resolvedImageSource}
            heroHeight={240}
            topInset={0}
          />
        </View>

        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
          <View style={styles.content}>
            <Typography variant="h2" style={styles.title} numberOfLines={2}>
              {landmark?.title}
            </Typography>

            {landmark?.description ? (
              <Typography variant="body" style={styles.description}>
                {landmark.description}
              </Typography>
            ) : null}

            <Button style={styles.cta} variant="primary" onPress={onFindStay}>
              <Typography variant="menu" style={styles.ctaText}>
                {t('landmarks.findStayNearby')}
              </Typography>
            </Button>
          </View>

          <View style={styles.mapWrap}>
            <OfferLocationMap
              latitude={landmark?.latitude ?? fallbackLatitude}
              longitude={landmark?.longitude ?? fallbackLongitude}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    </ImageBackground>
  );
};

const getStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    background: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.transparent,
    },
    containerContent: {
      flex: 1,
    },
    headerFullBleed: {
      width: SCREEN_WIDTH + spacing.lg * 2,
      alignSelf: 'center',
      marginHorizontal: -spacing.lg,
    },
    bodyScroll: {
      flex: 1,
    },
    bodyContent: {
      paddingBottom: spacing.xl,
    },
    content: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.md,
      gap: spacing.md,
    },
    title: {
      color: colors.textPrimary,
    },
    description: {
      color: colors.textSecondary,
    },
    cta: {
      alignSelf: 'center',
      width: '100%',
      borderRadius: radius.lg,
    },
    ctaText: {
      color: colors.textOnAccent,
    },
    mapWrap: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.lg,
    },
  });

export default LandmarkDetailScreenView;
