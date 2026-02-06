// Component: PastBookingDetails. Used in: PastBookingDetailsScreen.tsx.
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HeaderBar, IconButton, Typography } from '@/ui';
import { useTheme, withOpacity } from '@/theme';
import { getColorTokens } from '@/theme';
import { s } from '@/utils/scale';
import { Hotel, Owner, Review } from '@/data/types';
import { resolveAmenityIcon } from '@/utils/amenities';
import { useTranslation } from '@/i18n';

import placeholderImage from '@/assets/images/1.png';

type PastBookingDetailsProps = {
  onBack?: () => void;
  booking: {
    id: string;
    hotelId?: string;
    title: string;
    image: number;
    dates?: string;
    price?: string;
    location?: string;
    rating?: string;
    infoText?: string;
    amenities?: string[];
  };
  hotel?: Hotel;
  owner?: Owner;
  reviews?: Review[];
  onLeaveReview?: () => void;
};

export const PastBookingDetails: React.FC<PastBookingDetailsProps> = ({
  onBack,
  onLeaveReview,
  booking,
  hotel,
  owner,
  reviews,
}) => {
  const { colors, mode } = useTheme();
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const isDark = mode === 'dark' || colors.background === colors.bgDark;
  const { t } = useTranslation();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const amenities = hotel?.amenities ?? booking.amenities ?? [];
  const ratingTextValue = hotel?.rating
    ? hotel.rating.toFixed(1).replace('.', ',')
    : (booking.rating ?? '8,1');
  const palette = useMemo(
    () => ({
      background: colors.background,
      panel: isDark ? colors.bgCard : colors.surfaceLight,
      section: isDark ? colors.bgDarkAlt : colors.surfaceWarm,
      text: colors.textPrimary,
      accent: tokens.accent,
      success: tokens.success,
      line: isDark ? colors.bgCard : colors.bgDarkAlt,
      icon: colors.textPrimary,
      starInactive: withOpacity(colors.textPrimary, 0.4),
    }),
    [isDark, colors, tokens.accent, tokens.success],
  );
  const styles = useMemo(() => getStyles(palette), [palette]);

  return (
    <View style={styles.root}>
      <HeaderBar
        title={t('bookingDetails.title')}
        onBack={onBack}
        backIconName="chevron-left"
        backIconSize={s(20)}
        style={styles.header}
        titleStyle={styles.headerTitle}
        backStyle={styles.backButton}
      />
      {onLeaveReview ? (
        <IconButton
          onPress={onLeaveReview}
          icon={
            <MaterialCommunityIcons
              name="message-text-outline"
              size={s(18)}
              color={palette.icon}
            />
          }
          circular
          bordered
          dimension={s(32)}
          style={styles.reviewButton}
          preserveIconColor
        />
      ) : null}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Typography style={styles.statusText} numberOfLines={1} ellipsizeMode="tail">
          {t('bookings.status.completed')}
        </Typography>

        <View style={styles.card}>
          <Image source={booking.image ?? placeholderImage} style={styles.cardImage} />
          <Typography style={styles.hotelName} numberOfLines={2} ellipsizeMode="tail">
            {hotel?.name ?? booking.title}
          </Typography>
          <View style={styles.row}>
            <MaterialCommunityIcons name="map-marker" size={s(13)} color={palette.icon} />
            <Typography style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
              {hotel?.address ?? booking.location ?? t('common.unknown')}
            </Typography>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="star" size={s(13)} color={palette.icon} />
            <Typography style={styles.ratingText} numberOfLines={1} ellipsizeMode="tail">
              {ratingTextValue}
            </Typography>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="calendar-blank" size={s(13)} color={palette.icon} />
            <Typography style={styles.datesText} numberOfLines={1} ellipsizeMode="tail">
              {booking.dates ?? t('common.unknown')}
            </Typography>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Typography style={styles.priceLabel}>{t('common.price')}</Typography>
          <Typography style={styles.priceValue}>{booking.price ?? t('common.unknown')}</Typography>
        </View>

        <View style={styles.amenitiesSection}>
          <Typography style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
            {t('offer.amenities')}
          </Typography>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.amenitiesScroll}
          >
            {amenities.map((item) => {
              const iconName = resolveAmenityIcon(item);
              return (
                <View key={item} style={styles.amenityIcon}>
                  {iconName ? (
                    <MaterialCommunityIcons name={iconName} size={s(14)} color={palette.icon} />
                  ) : (
                    <View style={styles.amenityDot} />
                  )}
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setIsInfoOpen((prev) => !prev)}
            activeOpacity={0.7}
            style={styles.infoToggle}
          >
            <View style={styles.infoLine} />
          </TouchableOpacity>
          {isInfoOpen ? (
            <Typography style={styles.infoText}>
              {hotel?.description ??
                booking.infoText ??
                'Сніданок врахований, 1 ванна кімната, 1 двоспальне ліжко або 2 односпальних.'}
            </Typography>
          ) : null}
        </View>

        <View style={styles.reviews}>
          <Typography style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
            {t('offer.reviews')}
          </Typography>
          {(reviews && reviews.length
            ? isReviewsOpen
              ? reviews
              : reviews.slice(0, 1)
            : [
                {
                  id: 'review-fallback',
                  author: 'Олена',
                  rating: 5,
                  text: t('reviews.fallbackText'),
                },
              ]
          ).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Typography style={styles.reviewAvatarText}>
                    {review.author ? review.author[0]?.toUpperCase() : 'О'}
                  </Typography>
                </View>
                <View style={styles.reviewMeta}>
                  <Typography style={styles.reviewAuthor} numberOfLines={1} ellipsizeMode="tail">
                    {review.author ?? 'Олена'}
                  </Typography>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <MaterialCommunityIcons
                        key={`${review.id}-star-${index}`}
                        name={index < (review.rating ?? 5) ? 'star' : 'star-outline'}
                        size={s(12)}
                        color={index < (review.rating ?? 5) ? palette.icon : palette.starInactive}
                      />
                    ))}
                    <Typography
                      style={styles.reviewRatingText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {review.rating ?? 5}
                    </Typography>
                  </View>
                </View>
              </View>
              <Typography style={styles.reviewText}>{review.text}</Typography>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => setIsReviewsOpen((prev) => !prev)}
            activeOpacity={0.7}
            style={styles.reviewsToggle}
          >
            <View style={styles.sectionLine} />
          </TouchableOpacity>
        </View>

        <View style={styles.contact}>
          <Typography style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
            {t('bookingDetails.contact')}
          </Typography>
          <View style={styles.contactRow}>
            <View style={styles.iconDot} />
            <Typography style={styles.contactText} numberOfLines={1} ellipsizeMode="middle">
              {owner?.phone ?? '+3 8068 907 97 97'}
            </Typography>
          </View>
          <View style={styles.contactRow}>
            <View style={styles.iconDot} />
            <Typography style={styles.contactText} numberOfLines={1} ellipsizeMode="middle">
              {owner?.email ?? 'urbanhotel@gmail.com'}
            </Typography>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (palette: {
  background: string;
  panel: string;
  section: string;
  text: string;
  accent: string;
  success: string;
  line: string;
  icon: string;
  starInactive: string;
}) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      height: s(36),
      backgroundColor: palette.background,
    },
    backButton: {
      position: 'absolute',
      left: s(8),
      top: s(6),
      width: s(24),
      height: s(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: palette.text,
      fontSize: s(16),
      fontWeight: '700',
    },
    reviewButton: {
      position: 'absolute',
      right: s(16),
      top: s(6),
    },
    content: {
      paddingHorizontal: s(22),
      paddingBottom: s(32),
    },
    statusText: {
      marginTop: s(8),
      color: palette.success,
      fontSize: s(20),
      fontWeight: '700',
    },
    card: {
      marginTop: s(12),
      backgroundColor: palette.panel,
      borderRadius: s(10),
      padding: s(14),
    },
    ratingText: {
      color: palette.icon,
      fontSize: s(14),
    },
    cardImage: {
      position: 'absolute',
      right: s(12),
      top: s(12),
      width: s(80),
      height: s(80),
      borderRadius: s(20),
    },
    hotelName: {
      color: palette.text,
      fontSize: s(20),
      fontWeight: '700',
      marginTop: s(6),
      marginBottom: s(8),
      paddingRight: s(110),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
      marginTop: s(6),
      paddingRight: s(110),
    },
    iconDot: {
      width: s(14),
      height: s(14),
      borderRadius: s(7),
      backgroundColor: palette.icon,
    },
    addressText: {
      color: palette.text,
      fontSize: s(14),
      flexShrink: 1,
    },
    datesText: {
      color: palette.text,
      fontSize: s(14),
      fontWeight: '500',
      flexShrink: 1,
    },
    amenitiesTitle: {
      marginTop: s(14),
      color: palette.text,
      fontSize: s(16),
      fontWeight: '700',
    },
    amenitiesSection: {
      marginTop: s(16),
      backgroundColor: palette.section,
      borderRadius: s(10),
      padding: s(12),
    },
    amenitiesScroll: {
      marginTop: s(10),
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
    },
    amenityIcon: {
      width: s(24),
      height: s(24),
      borderRadius: s(12),
      borderWidth: 1,
      borderColor: palette.icon,
      alignItems: 'center',
      justifyContent: 'center',
    },
    amenityDot: {
      width: s(6),
      height: s(6),
      borderRadius: s(3),
      backgroundColor: palette.icon,
    },
    priceRow: {
      marginTop: s(16),
      backgroundColor: palette.section,
      borderRadius: s(10),
      paddingHorizontal: s(12),
      paddingVertical: s(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    priceLabel: {
      color: palette.text,
      fontSize: s(16),
      fontWeight: '700',
    },
    priceValue: {
      color: palette.text,
      fontSize: s(16),
      fontWeight: '600',
    },
    reviews: {
      marginTop: s(16),
      backgroundColor: palette.section,
      borderRadius: s(10),
      padding: s(12),
    },
    infoText: {
      marginTop: s(10),
      color: palette.text,
      fontSize: s(14),
      lineHeight: s(17),
    },
    infoLine: {
      marginTop: s(12),
      height: s(3),
      backgroundColor: palette.line,
      borderRadius: s(2),
      width: '50%',
      alignSelf: 'center',
    },
    infoToggle: {
      marginTop: s(12),
    },
    sectionTitle: {
      color: palette.text,
      fontSize: s(16),
      fontWeight: '700',
    },
    sectionLine: {
      marginTop: s(8),
      height: s(3),
      backgroundColor: palette.line,
      borderRadius: s(2),
      width: '50%',
      alignSelf: 'center',
    },
    reviewsToggle: {
      marginTop: s(8),
    },
    reviewCard: {
      marginTop: s(12),
      backgroundColor: palette.panel,
      borderRadius: s(20),
      padding: s(12),
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: s(8),
      marginBottom: s(6),
    },
    reviewMeta: {
      flex: 1,
    },
    reviewAvatar: {
      width: s(24),
      height: s(24),
      borderRadius: s(10),
      backgroundColor: palette.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reviewAvatarText: {
      color: palette.text,
      fontSize: s(12),
      fontWeight: '600',
    },
    reviewAuthor: {
      color: palette.text,
      fontSize: s(13),
      fontWeight: '700',
      flexShrink: 1,
    },
    reviewStars: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(4),
      marginTop: s(4),
    },
    reviewRatingText: {
      color: palette.text,
      fontSize: s(12),
      fontWeight: '600',
    },
    reviewText: {
      color: palette.text,
      fontSize: s(12),
      lineHeight: s(15),
    },
    contact: {
      marginTop: s(16),
      backgroundColor: palette.section,
      borderRadius: s(10),
      padding: s(12),
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
      marginTop: s(10),
    },
    contactText: {
      color: palette.text,
      fontSize: s(14),
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
  });

export default PastBookingDetails;
