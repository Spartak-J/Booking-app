// Screen: AdminUserDetailsScreen. Used in: (no direct imports found).
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/BackButton';
import { OfferCard } from '@/components/OfferCard';
import { spacing, radius } from '@/theme';
import { Booking, Offer, User } from '@/types';
import { adminService } from '@/services/adminService';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Card, Loader, ScreenContainer, Typography } from '@/ui';

type AdminNavigation = NativeStackNavigationProp<RootStackParamList>;
type AdminUserDetailsRoute = RouteProp<RootStackParamList, 'AdminUserDetails'>;

export const AdminUserDetailsScreen = () => {
  const route = useRoute<AdminUserDetailsRoute>();
  const navigation = useNavigation<AdminNavigation>();
  // TODO: move theming to UI layer
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const { userId } = route.params;

  const [user, setUser] = useState<User | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [userData, offerData, bookingData] = await Promise.all([
        adminService.getUserById(userId),
        adminService.getUserOffers(userId),
        adminService.getBookingsByUser(userId),
      ]);
      setUser(userData);
      setOffers(offerData);
      setBookings(bookingData);
      setLoading(false);
    };
    load();
  }, [userId]);

  const formatStatus = (status: Booking['status']) => t(`bookings.status.${status}`);

  return (
    <ScreenContainer style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton />
        <Typography variant="h2" tone="primary">
          {user?.name ?? t('admin.users')}
        </Typography>
        <Card style={styles.userCard} padding="lg">
          <Typography variant="caption" tone="secondary">
            {t('profile.role')}
          </Typography>
          <Typography variant="body" tone="primary">
            {user?.role ?? '-'}
          </Typography>
          <Typography variant="caption" tone="secondary">
            {t('auth.email')}
          </Typography>
          <Typography variant="body" tone="primary">
            {user?.email ?? '-'}
          </Typography>
          {user?.phone && (
            <>
              <Typography variant="caption" tone="secondary">
                {t('owner.contact')}
              </Typography>
              <Typography variant="body" tone="primary">
                {user?.phone}
              </Typography>
            </>
          )}
          {user?.isBlocked && (
            <Typography variant="caption" tone="error">
              {t('admin.stats.blocked')}
            </Typography>
          )}
        </Card>

        <View style={styles.section}>
          <Typography variant="h2" tone="primary">
            {t('admin.offers')}
          </Typography>
          {loading ? (
            <View style={styles.empty}>
              <Loader variant="skeleton" height={90} />
            </View>
          ) : offers.length === 0 ? (
            <Typography variant="caption" tone="secondary" style={styles.emptyText}>
              {t('admin.empty')}
            </Typography>
          ) : (
            offers.map((offer) => (
              <View key={offer.id} style={styles.offerWrapper}>
                <OfferCard
                  offer={offer}
                  onPress={() => navigation.navigate('AdminOfferDetails', { offerId: offer.id })}
                />
              </View>
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
                  {formatStatus(booking.status)}
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
    userCard: {
      gap: spacing.xs,
    },
    section: {
      gap: spacing.sm,
    },
    empty: {
      padding: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    emptyText: {
      fontStyle: 'italic',
    },
    offerWrapper: {
      borderRadius: radius.lg,
      borderColor: colors.border,
      borderWidth: 1,
      overflow: 'hidden',
    },
    bookingRow: {
      gap: spacing.xs,
    },
  });
