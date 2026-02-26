// Component: BookingDetailsScreenView. Used in: BookingDetailsScreen.
import React, { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingService } from '@/services/bookingService';
import { formatDateRange } from '@/utils/date';
import { formatPrice } from '@/utils/price';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { Button, Card, Loader, Typography } from '@/ui';
import { spacing, radius } from '@/theme';
import type { Booking } from '@/types';

type BookingDetailsScreenViewProps = {
  booking?: Booking;
  bookingId: string;
  onBack: () => void;
};

export const BookingDetailsScreenView: React.FC<BookingDetailsScreenViewProps> = ({
  booking,
  bookingId,
  onBack,
}) => {
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      Alert.alert(t('bookings.cancel'), t('bookings.cancelProgress'));
    },
  });

  if (!booking) {
    return (
      <View style={styles.container}>
        <View style={styles.empty}>
          <Loader variant="skeleton" height={120} />
          <Typography variant="caption" tone="secondary">
            {t('bookingDetails.notFound')}
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backWrapper}>
        <Button
          title={`← ${t('nav.back')}`}
          variant="ghost"
          size="small"
          style={styles.backButton}
          onPress={onBack}
        />
      </View>
      <Typography variant="h2" tone="primary">
        {t('nav.bookingDetails')} {bookingId}
      </Typography>
      <Card style={styles.card} padding="lg">
        <Typography variant="caption" tone="secondary">
          {t('bookingDetails.offer')}
        </Typography>
        <Typography variant="body" tone="primary">
          {booking.offerId}
        </Typography>
        <Typography variant="caption" tone="secondary">
          {t('bookingDetails.dates')}
        </Typography>
        <Typography variant="body" tone="primary">
          {formatDateRange(booking.checkIn, booking.checkOut)}
        </Typography>
        <Typography variant="caption" tone="secondary">
          {t('bookings.guests')}
        </Typography>
        <Typography variant="body" tone="primary">
          {booking.guests}
        </Typography>
        {booking.paymentType && (
          <>
            <Typography variant="caption" tone="secondary">
              {t('bookings.payment')}
            </Typography>
            <Typography variant="body" tone="primary">
              {booking.paymentType}
            </Typography>
          </>
        )}
        <Typography variant="caption" tone="secondary">
          {t('common.price.total')}
        </Typography>
        <Typography variant="body" tone="primary">
          {formatPrice(booking.totalPrice)}
        </Typography>
        <Typography variant="caption" tone="secondary">
          {t('bookingDetails.status')}
        </Typography>
        <Typography variant="body" tone="primary">
          {booking.status}
        </Typography>
      </Card>
      {booking.status !== 'cancelled' && (
        <Button
          title={cancelMutation.isPending ? t('bookings.cancelProgress') : t('bookings.cancel')}
          variant="ghost"
          style={styles.cancel}
          textStyle={styles.cancelText}
          onPress={() =>
            Alert.alert(t('bookings.confirm.cancel.title'), t('bookings.confirm.cancel.message'), [
              { text: t('bookings.confirm.no'), style: 'cancel' },
              {
                text: t('bookings.confirm.yes'),
                style: 'destructive',
                onPress: () => cancelMutation.mutate(booking.orderId),
              },
            ])
          }
        />
      )}
    </View>
  );
};

const getStyles = (colors: any) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
      gap: spacing.md,
    },
    card: {
      borderRadius: radius.lg,
      gap: spacing.xs,
    },
    empty: {
      gap: spacing.sm,
    },
    cancel: {
      backgroundColor: colors.error,
    },
    cancelText: {
      color: colors.onPrimary,
    },
    backWrapper: {
      marginBottom: spacing.sm,
    },
    backButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: 'flex-start',
    },
  });

export default BookingDetailsScreenView;
