// Screen: AdminDashboardScreen. Used in: (no direct imports found).
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/BackButton';
import { ChipSelect } from '@/components/ChipSelect';
import { spacing, radius } from '@/theme';
import { Booking, Offer, Payment, User } from '@/types';
import { adminService } from '@/services/adminService';
import { formatPrice } from '@/utils/price';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Button, Card, Input, Loader, ScreenContainer, Typography } from '@/ui';

type SearchScope = 'all' | 'users' | 'offers';
type AdminNavigation = NativeStackNavigationProp<RootStackParamList, 'AdminPanel'>;

export const AdminDashboardScreen = () => {
  const navigation = useNavigation<AdminNavigation>();
  // TODO: move theming to UI layer
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();

  const [users, setUsers] = useState<User[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<SearchScope>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    const [usersData, offersData, bookingsData, paymentsData] = await Promise.all([
      adminService.getUsers(),
      adminService.getOffers(),
      adminService.getBookings(),
      adminService.getPayments(),
    ]);
    setUsers(usersData);
    setOffers(offersData);
    setBookings(bookingsData);
    setPayments(paymentsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    await loadData();
    Alert.alert(t('admin.refresh'), t('admin.refresh'));
  }, [loadData, t]);

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      activeOffers: offers.filter((o) => o.isActive).length,
      blockedUsers: users.filter((u) => u.isBlocked).length,
      revenue: payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    }),
    [users, offers, payments],
  );

  const queryText = searchQuery.trim().toLowerCase();
  const filteredUsers = useMemo(() => {
    if (!queryText) return users;
    return users.filter((user) => {
      const normalizedPhone = user.phone?.toLowerCase() ?? '';
      return (
        user.id.toLowerCase().includes(queryText) ||
        user.email.toLowerCase().includes(queryText) ||
        normalizedPhone.includes(queryText)
      );
    });
  }, [users, queryText]);

  const filteredOffers = useMemo(() => {
    if (!queryText) return offers;
    return offers.filter((offer) => {
      return (
        offer.id.toLowerCase().includes(queryText) || offer.title.toLowerCase().includes(queryText)
      );
    });
  }, [offers, queryText]);

  const displayedUsers = searchScope === 'offers' ? users : filteredUsers;
  const displayedOffers = searchScope === 'users' ? offers : filteredOffers;

  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const offerMap = useMemo(() => new Map(offers.map((offer) => [offer.id, offer])), [offers]);

  const toggleUser = (id: string) =>
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, isBlocked: !user.isBlocked } : user)),
    );

  const toggleOffer = (id: string) =>
    setOffers((prev) =>
      prev.map((offer) => (offer.id === id ? { ...offer, isActive: !offer.isActive } : offer)),
    );

  const searchOptions = [
    { id: 'all', label: t('bookings.filter.all') },
    { id: 'users', label: t('admin.users') },
    { id: 'offers', label: t('admin.offers') },
  ];

  const getBookingStatusLabel = (status: Booking['status']) => t(`bookings.status.${status}`);
  const getPaymentLabel = (status: Payment['status']) =>
    status === 'paid'
      ? t('admin.stats.revenue')
      : status === 'pending'
        ? t('bookings.status.pending')
        : t('admin.payment.failed');

  const getStatusStyle = (status: Payment['status'] | Booking['status']) => {
    if (status === 'paid' || status === 'active') return styles.statusPaid;
    if (status === 'pending') return styles.statusPending;
    if (status === 'completed') return styles.statusCompleted;
    if (status === 'cancelled') return styles.statusFailed;
    return styles.statusFailed;
  };

  return (
    <ScreenContainer style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <BackButton />
        <Typography variant="h2" tone="primary">
          {t('admin.title')}
        </Typography>
        <View style={styles.cards}>
          <StatCard label={t('admin.stats.users')} value={stats.totalUsers} />
          <StatCard label={t('admin.stats.offers')} value={stats.activeOffers} />
          <StatCard label={t('admin.stats.blocked')} value={stats.blockedUsers} />
          <StatCard label={t('admin.stats.revenue')} value={formatPrice(stats.revenue)} />
        </View>

        <View style={styles.section}>
          <Typography variant="caption" tone="secondary">
            {t('admin.search.heading')}
          </Typography>
          <Input
            label={t('admin.search.field')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('admin.search.placeholder')}
          />
          <ChipSelect
            options={searchOptions}
            selected={[searchScope]}
            onChange={(next) => {
              const nextScope = (next[0] as SearchScope) ?? 'all';
              setSearchScope(nextScope);
            }}
            multi={false}
            horizontal
          />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title={t('admin.users')}
            actionLabel={t('admin.refresh')}
            onAction={handleRefresh}
          />
          {loading ? (
            <Loader variant="skeleton" height={90} />
          ) : displayedUsers.length === 0 ? (
            <Typography variant="caption" tone="secondary" style={styles.emptyText}>
              {t('admin.empty')}
            </Typography>
          ) : (
            displayedUsers.map((user) => (
              <Card key={user.id} style={styles.item} padding="md">
                <Button
                  variant="ghost"
                  style={styles.itemLeft}
                  onPress={() => navigation.navigate('AdminUserDetails', { userId: user.id })}
                >
                  <View style={styles.itemText}>
                    <Typography variant="body" tone="primary">
                      {user.name}
                    </Typography>
                    <Typography variant="caption" tone="secondary">
                      {user.email}
                    </Typography>
                    {user.phone && (
                      <Typography variant="caption" tone="secondary">
                        {user.phone}
                      </Typography>
                    )}
                    <Typography variant="caption" tone="secondary">
                      {t('profile.role')}: {user.role}
                    </Typography>
                  </View>
                </Button>
                <Button
                  title={user.isBlocked ? t('admin.unblock') : t('admin.block')}
                  variant="ghost"
                  style={[styles.pill, user.isBlocked ? styles.pillDanger : styles.pillInfo]}
                  onPress={() => toggleUser(user.id)}
                />
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title={t('admin.offers')}
            actionLabel={t('admin.refresh')}
            onAction={handleRefresh}
          />
          {loading ? (
            <Loader variant="skeleton" height={90} />
          ) : displayedOffers.length === 0 ? (
            <Typography variant="caption" tone="secondary" style={styles.emptyText}>
              {t('admin.empty')}
            </Typography>
          ) : (
            displayedOffers.map((offer) => (
              <Card key={offer.id} style={styles.item} padding="md">
                <Button
                  variant="ghost"
                  style={styles.itemLeft}
                  onPress={() => navigation.navigate('AdminOfferDetails', { offerId: offer.id })}
                >
                  <View style={styles.itemText}>
                    <Typography variant="body" tone="primary">
                      {offer.title}
                    </Typography>
                    <Typography variant="caption" tone="secondary">
                      {offer.address}
                    </Typography>
                    <Typography variant="caption" tone="secondary">
                      {t('bookingDetails.status')}:{' '}
                      {offer.isActive ? t('owner.objects.status.active') : t('admin.block')}
                    </Typography>
                  </View>
                </Button>
                <Button
                  title={offer.isActive ? t('admin.blockOffer') : t('admin.unblockOffer')}
                  variant="ghost"
                  style={[styles.pill, offer.isActive ? styles.pillDanger : styles.pillInfo]}
                  onPress={() => toggleOffer(offer.id)}
                />
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title={t('admin.rentals')} />
          {loading ? (
            <Loader variant="skeleton" height={90} />
          ) : bookings.length === 0 ? (
            <Typography variant="caption" tone="secondary" style={styles.emptyText}>
              {t('admin.empty')}
            </Typography>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} style={styles.item} padding="md">
                <View style={styles.itemText}>
                  <Typography variant="body" tone="primary">
                    {userMap.get(booking.userId)?.name ?? booking.userId}
                  </Typography>
                  <Typography variant="caption" tone="secondary">
                    {offerMap.get(booking.offerId)?.title ?? booking.offerId}
                  </Typography>
                  <Typography variant="caption" tone="secondary">
                    {new Date(booking.checkIn).toLocaleDateString()} —{' '}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </Typography>
                </View>
                <View style={[styles.pill, getStatusStyle(booking.status)]}>
                  <Typography variant="caption" tone="primary">
                    {getBookingStatusLabel(booking.status)}
                  </Typography>
                </View>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title={t('admin.payments')} />
          {loading ? (
            <Loader variant="skeleton" height={90} />
          ) : payments.length === 0 ? (
            <Typography variant="caption" tone="secondary" style={styles.emptyText}>
              {t('admin.empty')}
            </Typography>
          ) : (
            payments.map((payment) => (
              <Card key={payment.id} style={styles.item} padding="md">
                <View style={styles.itemText}>
                  <Typography variant="body" tone="primary">
                    {userMap.get(payment.userId)?.name ?? payment.userId}
                  </Typography>
                  <Typography variant="caption" tone="secondary">
                    {formatPrice(payment.amount)} · {payment.method}
                  </Typography>
                  <Typography variant="caption" tone="secondary">
                    {t('admin.payment.date')}: {payment.date}
                  </Typography>
                </View>
                <View style={[styles.pill, getStatusStyle(payment.status)]}>
                  <Typography variant="caption" tone="primary">
                    {getPaymentLabel(payment.status)}
                  </Typography>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const SectionHeader = ({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) => {
  return (
    <View style={stylesHeader.container}>
      <Typography variant="h2" tone="primary">
        {title}
      </Typography>
      {actionLabel && onAction && (
        <Button title={actionLabel} variant="ghost" size="small" onPress={onAction} />
      )}
    </View>
  );
};

const StatCard = ({ label, value }: { label: string; value: number | string }) => {
  return (
    <Card style={stylesStat.card} padding="md">
      <Typography variant="caption" tone="secondary">
        {label}
      </Typography>
      <Typography variant="h2" tone="primary">
        {value}
      </Typography>
    </Card>
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
    cards: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    section: {
      gap: spacing.sm,
    },
    searchLabel: {},
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.sm,
    },
    itemLeft: {
      flex: 1,
      padding: 0,
    },
    itemText: {
      gap: spacing.xs,
      alignItems: 'flex-start',
    },
    pill: {
      borderRadius: radius.md,
    },
    pillDanger: {
      borderColor: colors.error,
      borderWidth: 1,
      backgroundColor: colors.surface,
    },
    pillInfo: {
      borderColor: colors.primary,
      borderWidth: 1,
      backgroundColor: colors.surface,
    },
    emptyText: {
      fontStyle: 'italic',
    },
    statusPaid: {
      backgroundColor: colors.surface,
      borderColor: colors.success,
    },
    statusPending: {
      backgroundColor: colors.surface,
      borderColor: colors.warning,
    },
    statusFailed: {
      backgroundColor: colors.surface,
      borderColor: colors.error,
    },
    statusCompleted: {
      backgroundColor: colors.surface,
      borderColor: colors.primary,
    },
  });

const stylesHeader = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const stylesStat = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
  },
});
