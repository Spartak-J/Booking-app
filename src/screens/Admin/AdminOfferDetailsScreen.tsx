// Screen: AdminOfferDetailsScreen. Used in: (no direct imports found).
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/BackButton';
import { spacing } from '@/theme';
import { Booking, Offer, Review } from '@/types';
import { adminService } from '@/services/adminService';
import { formatPrice } from '@/utils/price';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Button, Card, Loader, ScreenContainer, Typography } from '@/ui';

type AdminOfferDetailsRoute = RouteProp<RootStackParamList, 'AdminOfferDetails'>;

export const AdminOfferDetailsScreen = () => {
  const route = useRoute<AdminOfferDetailsRoute>();
  // TODO: move theming to UI layer
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const { offerId } = route.params;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [offerData, bookingData] = await Promise.all([
        adminService.getOfferById(offerId),
        adminService.getBookingsByOffer(offerId),
      ]);
      setOffer(offerData);
      setReviews(offerData?.reviews ?? []);
      setBookings(bookingData);
      setLoading(false);
    };
    load();
  }, [offerId]);

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(t('reviewModal.delete'), '', [
      { text: t('reviewModal.cancel'), style: 'cancel' },
      {
        text: t('reviewModal.delete'),
        style: 'destructive',
        onPress: () => {
          setReviews((prev) => prev.filter((review) => review.id !== reviewId));
          Alert.alert(t('bookings.reviewDeleted'));
        },
      },
    ]);
  };

  return (
    <ScreenContainer style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton />
        <Typography variant="h2" tone="primary">
          {offer?.title ?? t('admin.offers')}
        </Typography>
        {offer && (
          <Card style={styles.offerCard} padding="lg">
            <Typography variant="caption" tone="primary">
              {offer.description}
            </Typography>
            <Typography variant="caption" tone="secondary">
              {offer.city.name}, {offer.city.country}
            </Typography>
            <Typography variant="caption" tone="secondary">
              {offer.address}
            </Typography>
            <Typography variant="caption" tone="secondary">
              {formatPrice(offer.pricePerNight)} / {t('offer.pricePerNight')} · {offer.guests}{' '}
              {t('bookings.guests')}
            </Typography>
          </Card>
        )}

        <View style={styles.section}>
          <Typography variant="h2" tone="primary">
            {t('offer.reviews')}
          </Typography>
          {loading ? (
            <Loader variant="skeleton" height={90} />
          ) : reviews.length === 0 ? (
            <Typography variant="caption" tone="secondary" style={styles.emptyText}>
              {t('offer.reviews.empty')}
            </Typography>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} style={styles.reviewCard} padding="md">
                <Typography variant="body" tone="primary">
                  {review.userName}
                </Typography>
                <Typography variant="caption" tone="secondary">
                  {review.rating} ★ · {review.createdAt}
                </Typography>
                <Typography variant="caption" tone="primary">
                  {review.comment}
                </Typography>
                {review.reply && (
                  <Typography variant="caption" tone="accent">
                    {t('offer.ownerReply')}: {review.reply}
                  </Typography>
                )}
                <View style={styles.reviewFooter}>
                  {review.status && (
                    <Typography variant="caption" tone="secondary">
                      {review.status}
                    </Typography>
                  )}
                  <Button
                    title={t('reviewModal.delete')}
                    variant="ghost"
                    style={styles.reviewAction}
                    textStyle={styles.reviewActionText}
                    onPress={() => handleDeleteReview(review.id)}
                  />
                </View>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Typography variant="h2" tone="primary">
            {t('admin.rentals')}
          </Typography>
          {loading ? (
            <Typography variant="caption" tone="secondary" style={styles.emptyText}>
              {t('admin.empty')}
            </Typography>
          ) : bookings.length === 0 ? (
            <Typography variant="caption" tone="secondary" style={styles.emptyText}>
              {t('admin.empty')}
            </Typography>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} style={styles.bookingRow} padding="md">
                <Typography variant="body" tone="primary">
                  {booking.id}
                </Typography>
                <Typography variant="caption" tone="secondary">
                  {new Date(booking.checkIn).toLocaleDateString()} —{' '}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" tone="accent">
                  {t(`bookings.status.${booking.status}`)}
                </Typography>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const getStyles = (colors: any) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    heading: {},
    offerCard: {
      gap: spacing.xs,
    },
    section: {
      gap: spacing.sm,
    },
    reviewCard: {
      gap: spacing.xs,
    },
    reviewFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    reviewAction: {
      paddingHorizontal: 0,
    },
    reviewActionText: {
      color: colors.error,
    },
    emptyText: {
      fontStyle: 'italic',
    },
    bookingRow: {
      gap: spacing.xs,
    },
  });
