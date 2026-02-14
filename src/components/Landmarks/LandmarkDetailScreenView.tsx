import React, { useMemo } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

import { Landmark } from '@/services/landmarkService';
import { spacing, radius } from '@/theme';
import { useTheme, withOpacity } from '@/theme';
import { Button, HeaderBar, ScreenContainer, Typography } from '@/ui';
import backgroundFallback from '@/assets/images/landmarks_bg.jpg';
import { useTranslation } from '@/i18n';

type Props = {
  landmark?: Landmark;
  cityName?: string;
  onBack: () => void;
  onFindStay: () => void;
};

export const LandmarkDetailScreenView: React.FC<Props> = ({
  landmark,
  cityName,
  onBack,
  onFindStay,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <ScreenContainer scroll style={styles.container} edges={[]}>
      <View style={styles.heroWrapper}>
        <ImageBackground
          source={landmark?.image ?? backgroundFallback}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.gradientTop} />
          <View style={styles.gradientBottom} />
          <HeaderBar
            title={cityName ?? t('landmarks.title')}
            onBack={onBack}
            style={styles.header}
            titleStyle={styles.headerTitle}
            backStyle={styles.backButton}
          />
        </ImageBackground>
      </View>

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

        <View style={styles.mapCard}>
          <Typography variant="subtitle" style={styles.mapTitle}>
            {cityName ? `${t('landmarks.mapPrefix')} ${cityName}` : t('landmarks.map')}
          </Typography>
          <Image source={backgroundFallback} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.mapOverlay}>
            <Typography variant="menu" style={styles.mapOverlayText}>
              {t('landmarks.objectLocation')}
            </Typography>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const getStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    heroWrapper: {
      height: 340,
      width: '100%',
    },
    hero: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    gradientTop: {
      ...StyleSheet.absoluteFillObject,
      height: 160,
      backgroundColor: withOpacity(colors.surface, 0.05),
    },
    gradientBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 140,
      backgroundColor: withOpacity(colors.surface, 0.85),
    },
    header: {
      marginTop: 0,
      paddingHorizontal: spacing.md,
    },
    headerTitle: {
      color: colors.textPrimary,
    },
    backButton: {
      backgroundColor: withOpacity(colors.bgCard, 0.6),
      borderRadius: radius.round,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      paddingTop: spacing.lg,
      gap: spacing.md,
      marginTop: -spacing.xl,
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
    mapCard: {
      marginTop: spacing.lg,
      borderRadius: radius.lg,
      overflow: 'hidden',
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 220,
    },
    mapTitle: {
      padding: spacing.md,
      color: colors.textPrimary,
    },
    mapImage: {
      width: '100%',
      height: 170,
    },
    mapOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: withOpacity(colors.black, 0.2),
      justifyContent: 'flex-end',
      padding: spacing.md,
    },
    mapOverlayText: {
      color: colors.surfaceLight,
    },
  });

export default LandmarkDetailScreenView;
