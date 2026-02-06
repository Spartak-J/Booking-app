// Component: OfferDetailsHeader. Used in: OfferDetailsScreen.tsx.
import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { CachedImage } from '@/components/CachedImage';
import { useTheme } from '@/theme';
import { Offer } from '@/types';
import { Button, IconButton, Typography } from '@/ui';
import { getColorTokens, radius } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const resolveAmenityIcon = (value: string): IconName | undefined => {
  const v = value.toLowerCase();
  if (v.includes('wi-fi') || v.includes('wifi')) return 'wifi';
  if (v.includes('кондиционер') || v.includes('кондиціонер') || v.includes('ac'))
    return 'air-conditioner';
  if (v.includes('телев')) return 'television';
  if (v.includes('прал') || v.includes('стир')) return 'washing-machine';
  if (v.includes('праск') || v.includes('утюг')) return 'iron';
  if (v.includes('робоч') || v.includes('desk')) return 'desk';
  if (v.includes('твар') || v.includes('pet')) return 'paw';
  if (v.includes('чайник') || v.includes('kettle')) return 'kettle';
  if (v.includes('парков')) return 'parking';
  if (v.includes('балкон')) return 'balcony';
  if (v.includes('терас')) return 'balcony';
  if (v.includes('кухн')) return 'stove';
  if (v.includes('односп')) return 'bed-single';
  if (v.includes('двосп')) return 'bed-double';
  return undefined;
};

type OfferDetailsHeaderProps = {
  offer: Offer;
  onBack: () => void;
  onSearch?: () => void;
  onGallery?: () => void;
  onMenu?: () => void;
  renderOwnerInfo?: React.ReactNode;
};

export const OfferDetailsHeader = ({
  offer,
  onBack,
  onSearch,
  onGallery,
  onMenu,
  renderOwnerInfo,
}: OfferDetailsHeaderProps) => {
  const { colors, mode } = useTheme();
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const styles = useMemo(() => getStyles(colors, tokens, isDark), [colors, tokens, isDark]);
  const [showFull, setShowFull] = useState(false);
  const handleSearch = onSearch ?? (() => {});
  const handleGallery = onGallery ?? (() => {});
  const handleMenu = onMenu ?? (() => {});

  const mainImage = offer.images?.[0];
  const thumbnails = offer.images?.slice(1, 4) ?? [];

  return (
    <View>
      <View style={styles.headerRow}>
        <IconButton
          onPress={onBack}
          icon={
            <MaterialCommunityIcons name="arrow-left" size={s(18)} color={tokens.iconPrimary} />
          }
          variant="ghost"
          size="sm"
          style={styles.headerIconButton}
        />
        <View style={styles.headerActions}>
          <IconButton
            onPress={handleSearch}
            icon={<MaterialCommunityIcons name="magnify" size={s(16)} color={tokens.iconPrimary} />}
            variant="ghost"
            size="sm"
            style={styles.headerIconButton}
          />
          <IconButton
            onPress={handleMenu}
            icon={<MaterialCommunityIcons name="menu" size={s(20)} color={tokens.iconPrimary} />}
            variant="ghost"
            size="sm"
            style={styles.headerIconButton}
          />
        </View>
      </View>

      {mainImage ? (
        <CachedImage uri={mainImage} style={styles.mainImage} />
      ) : (
        <View style={styles.mainImageFallback} />
      )}

      <View style={styles.galleryRow}>
        {thumbnails.map((item) => (
          <CachedImage key={item} uri={item} style={styles.galleryThumb} />
        ))}
        <Button
          title="Галерея"
          variant="ghost"
          size="small"
          style={styles.galleryButton}
          onPress={handleGallery}
        />
      </View>

      <Typography variant="h1" tone="primary" style={styles.title}>
        {offer.title}
      </Typography>
      <Typography variant="body" tone="primary" style={styles.location}>
        {offer.city.name}, {offer.city.country}
      </Typography>

      <View style={styles.descriptionBlock}>
        <Typography variant="body" tone="primary" numberOfLines={showFull ? undefined : 6}>
          <Typography variant="body" tone="primary" style={styles.descriptionBold}>
            Інформація про цей готель
          </Typography>{' '}
          {offer.description}
        </Typography>
        {offer.description?.length > 200 && (
          <Button
            title={showFull ? 'Менше' : 'Більше'}
            variant="ghost"
            size="small"
            onPress={() => setShowFull((prev) => !prev)}
          />
        )}
      </View>
      {renderOwnerInfo}

      <View style={styles.sectionRow}>
        <View style={styles.sectionCol}>
          <Typography variant="h2" tone="primary" style={styles.sectionTitle}>
            Зручності
          </Typography>
          <View style={styles.amenitiesBox}>
            {offer.amenities.slice(0, 4).map((item) => {
              const iconName = resolveAmenityIcon(item);
              return (
                <View key={item} style={styles.amenityPill}>
                  {iconName ? (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={s(16)}
                      color={tokens.iconPrimary}
                    />
                  ) : (
                    <View style={styles.amenityIconDot} />
                  )}
                </View>
              );
            })}
            <View style={styles.amenityDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>
        <View style={styles.sectionCol}>
          <Typography variant="h2" tone="primary" style={styles.sectionTitle}>
            Розташування
          </Typography>
          <View style={styles.locationBox}>
            <Typography variant="caption" tone="primary" style={styles.locationText}>
              {offer.address}
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: any, tokens: ReturnType<typeof getColorTokens>, isDark: boolean) =>
  StyleSheet.create({
    headerRow: {
      height: s(36),
      marginTop: s(6),
      marginBottom: s(8),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerIconButton: {
      width: s(32),
      height: s(32),
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
    },
    mainImage: {
      width: '100%',
      height: s(235),
      borderRadius: radius.md,
    },
    mainImageFallback: {
      width: '100%',
      height: s(235),
      borderRadius: radius.md,
      backgroundColor: colors.border,
    },
    galleryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: s(14),
      alignItems: 'center',
    },
    galleryThumb: {
      width: s(80),
      height: s(45),
      borderRadius: radius.md,
    },
    galleryButton: {
      width: s(80),
      height: s(45),
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      borderRadius: radius.md,
    },
    title: {
      marginTop: s(20),
    },
    location: {
      marginTop: s(6),
      textDecorationLine: 'underline',
    },
    descriptionBlock: {
      marginTop: s(15),
      gap: s(8),
    },
    descriptionBold: {},
    sectionRow: {
      flexDirection: 'row',
      gap: s(20),
      marginTop: s(24),
    },
    sectionCol: {
      flex: 1,
      gap: s(12),
    },
    sectionTitle: {
      fontSize: s(20),
    },
    amenitiesBox: {
      height: s(84),
      backgroundColor: isDark ? colors.bgCard : colors.accentSoftAlt,
      borderRadius: radius.md,
      paddingHorizontal: s(8),
      paddingVertical: s(8),
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(8),
      alignContent: 'center',
      justifyContent: 'center',
    },
    amenityPill: {
      width: s(40),
      height: s(26),
      borderRadius: s(13),
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? colors.bgCard : colors.accentSoftAlt,
    },
    amenityIconDot: {
      width: s(10),
      height: s(10),
      borderRadius: s(5),
      backgroundColor: tokens.iconPrimary,
    },
    amenityDots: {
      flexDirection: 'row',
      gap: s(4),
      alignItems: 'center',
      justifyContent: 'center',
      width: s(46),
      height: s(26),
      borderRadius: s(13),
      borderWidth: 1,
      borderColor: tokens.borderStrong,
      backgroundColor: isDark ? colors.bgCard : colors.accentSoftAlt,
    },
    dot: {
      width: s(7),
      height: s(7),
      borderRadius: s(3.5),
      backgroundColor: tokens.iconPrimary,
    },
    locationBox: {
      height: s(85),
      backgroundColor: isDark ? colors.bgDarkAlt : colors.accentSoft,
      borderRadius: radius.md,
      paddingHorizontal: s(10),
      paddingVertical: s(10),
      justifyContent: 'center',
    },
    locationText: {
      textDecorationLine: 'underline',
      fontSize: s(11),
      lineHeight: s(13),
    },
  });
