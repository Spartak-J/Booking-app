import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import type { AdminHotel } from '@/services/adminHotelsService';
import { useTranslation } from '@/i18n';
import { fonts, radius, spacing, typography, useTheme } from '@/theme';
import { Button, HeaderBar, Typography } from '@/ui';
import { getHotelImageSource } from '@/data/hotels/hotelImages.mock';
import KeysBackground from '@/components/layout/KeysBackground';
import { s } from '@/utils/scale';

type Props = {
  offer: AdminHotel;
  onBack: () => void;
  onMenu: () => void;
  onWrite: () => void;
  onBlock: () => void;
};

const formatRating = (value: number) => value.toFixed(1).replace('.', ',');

const buildBulletPoints = (text: string) =>
  text
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

const buildShortAddress = (address: string, city: string) => {
  const mainPart = address.split(',')[0]?.trim();
  return `${mainPart ?? address}, ${city}`;
};

const AdminOfferDetailsScreenView: React.FC<Props> = ({
  offer,
  onBack,
  onMenu,
  onWrite,
  onBlock,
}) => {
  const { t } = useTranslation();
  const { tokens, mode } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const bullets = useMemo(() => buildBulletPoints(offer.description), [offer.description]);

  return (
    <View style={styles.screen}>
      <KeysBackground variant={mode === 'dark' ? 'black' : 'yellow'} bottomOffset={s(48)} />

      <HeaderBar
        title={t('admin.offers.title')}
        onBack={onBack}
        onMenu={onMenu}
        showBack
        showMenu
        showSearch={false}
      />

      <View style={styles.content}>
        <Typography variant="h1" tone="primary" style={styles.title}>
          {offer.name}
        </Typography>

        <ImageBackground source={getHotelImageSource(offer)} style={styles.image} imageStyle={styles.imageStyle}>
          <View style={styles.ratingBadge}>
            <Typography variant="subtitle" tone="primary" style={styles.ratingText}>
              {formatRating(offer.rating)}
            </Typography>
            <MaterialCommunityIcons name="star" size={s(16)} color={tokens.textPrimary} />
          </View>
        </ImageBackground>

        <View style={styles.bullets}>
          {bullets.map((item, index) => (
            <Typography key={`${offer.id}-bullet-${index}`} variant="body" tone="primary">
              {`\u2022 ${item}`}
            </Typography>
          ))}
        </View>

        <View style={styles.metaRow}>
          <Typography variant="subtitle" tone="primary">
            {`${offer.reviewsCount} ${t('admin.offers.reviews')}`}
          </Typography>
          <Typography variant="subtitle" tone="primary" style={styles.address}>
            {buildShortAddress(offer.address, offer.city)}
          </Typography>
        </View>

        <View style={styles.contactPanel}>
          <Typography variant="h1" tone="primary">
            {offer.owner?.phone ?? '-'}
          </Typography>
          <Typography variant="h1" tone="primary">
            {offer.owner?.email ?? '-'}
          </Typography>
        </View>

        <View style={styles.actions}>
          <Button
            title={t('admin.offers.write')}
            onPress={onWrite}
            variant="ghost"
            style={styles.writeButton}
            textStyle={styles.writeButtonText}
          />
          <Button
            title={t('admin.offers.block')}
            onPress={onBlock}
            variant="ghost"
            style={styles.blockButton}
            textStyle={styles.blockButtonText}
          />
        </View>
      </View>
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      zIndex: 2,
    },
    title: {
      textAlign: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      fontFamily: fonts.MontserratAlternatesBold,
      ...(typography.h1 as object),
    },
    image: {
      width: '100%',
      height: s(230),
      borderRadius: radius.xl,
      overflow: 'hidden',
      justifyContent: 'flex-start',
    },
    imageStyle: {
      borderRadius: radius.xl,
      resizeMode: 'cover',
    },
    ratingBadge: {
      margin: spacing.md,
      alignSelf: 'flex-start',
      borderRadius: radius.round,
      backgroundColor: tokens.bgScreen,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    ratingText: {
      fontFamily: fonts.MontserratAlternatesSemiBold,
    },
    bullets: {
      marginTop: spacing.md,
      gap: spacing.xs,
      minHeight: s(64),
    },
    metaRow: {
      marginTop: spacing.xs,
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    address: {
      textDecorationLine: 'underline',
      flexShrink: 1,
      textAlign: 'right',
    },
    contactPanel: {
      marginHorizontal: -spacing.lg,
      marginBottom: spacing.lg,
      backgroundColor: tokens.bgSurface,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    actions: {
      marginTop: 'auto',
      marginBottom: spacing.xl,
      flexDirection: 'row',
      gap: spacing.md,
    },
    writeButton: {
      flex: 1,
      borderWidth: 2,
      borderColor: tokens.success,
      backgroundColor: tokens.bgScreen,
      minHeight: s(50),
    },
    writeButtonText: {
      color: tokens.success,
      fontFamily: fonts.MontserratAlternatesBold,
      ...(typography.subtitle as object),
    },
    blockButton: {
      flex: 1,
      borderWidth: 2,
      borderColor: tokens.error,
      backgroundColor: tokens.bgScreen,
      minHeight: s(50),
    },
    blockButtonText: {
      color: tokens.error,
      fontFamily: fonts.MontserratAlternatesBold,
      ...(typography.subtitle as object),
    },
  });

export default AdminOfferDetailsScreenView;
