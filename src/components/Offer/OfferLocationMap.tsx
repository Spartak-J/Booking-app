import React, { useMemo } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';

import { useTranslation } from '@/i18n';
import { useTheme, radius, spacing } from '@/theme';
import { Typography } from '@/ui';
import { s } from '@/utils/scale';

type OfferLocationMapProps = {
  latitude?: number | string;
  longitude?: number | string;
};

const buildExternalMapUrl = (latitude: number, longitude: number) =>
  `https://www.google.com/maps?q=${latitude},${longitude}`;

const toCoordNumber = (value?: number | string): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.trim().replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const hasValidCoords = (latitude?: number | string, longitude?: number | string) => {
  const lat = toCoordNumber(latitude);
  const lon = toCoordNumber(longitude);
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  );
};

const hasGoogleMapsApiKey = () => {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return true;
  const expoConfig = Constants.expoConfig as
    | {
        android?: { config?: { googleMaps?: { apiKey?: string } } };
        ios?: { config?: { googleMapsApiKey?: string } };
      }
    | undefined;
  if (Platform.OS === 'android') {
    return Boolean(expoConfig?.android?.config?.googleMaps?.apiKey);
  }
  return Boolean(expoConfig?.ios?.config?.googleMapsApiKey);
};

export const OfferLocationMap: React.FC<OfferLocationMapProps> = ({ latitude, longitude }) => {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  if (!hasValidCoords(latitude, longitude)) {
    return null;
  }

  const lat = toCoordNumber(latitude)!;
  const lon = toCoordNumber(longitude)!;
  const externalMapUrl = buildExternalMapUrl(lat, lon);
  const canRenderNativeMap = hasGoogleMapsApiKey();

  const handleOpenMap = async () => {
    const supported = await Linking.canOpenURL(externalMapUrl);
    if (!supported) {
      Alert.alert(t('booking.error'), t('offer.details.mapPreview'));
      return;
    }
    await Linking.openURL(externalMapUrl);
  };

  return (
    <View style={styles.section}>
      <Typography variant="h2" tone="primary">
        {t('offer.details.mapLabel')}
      </Typography>

      <Pressable onPress={handleOpenMap} style={styles.preview}>
        {canRenderNativeMap ? (
          <View style={styles.previewFallback}>
            <Typography variant="body" tone="primary">
              {`${lat.toFixed(4)}, ${lon.toFixed(4)}`}
            </Typography>
            <Typography variant="caption" tone="secondary">
              {t('offer.details.openMap')}
            </Typography>
          </View>
        ) : (
          <View style={styles.previewFallback}>
            <Typography variant="body" tone="primary">
              {`${lat.toFixed(4)}, ${lon.toFixed(4)}`}
            </Typography>
            <Typography variant="caption" tone="secondary">
              {t('offer.details.openMap')}
            </Typography>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    section: {
      gap: spacing.sm,
      marginTop: spacing.md,
      marginBottom: spacing.md,
    },
    preview: {
      borderRadius: radius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.bgPanel,
    },
    previewMap: {
      width: '100%',
      height: s(184),
    },
    previewFallback: {
      width: '100%',
      height: s(184),
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      backgroundColor: tokens.bgSurfaceAlt,
      paddingHorizontal: spacing.md,
    },
  });

export default OfferLocationMap;
