// Screen: OwnerBookingsScreen. Used in: (no direct imports found).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { bookingService } from '@/services/bookingService';
import { adminService } from '@/services/adminService';
import { useAuthStore } from '@/store/authStore';
import { spacing, radius } from '@/theme';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { BackButton } from '@/components/BackButton';
import { formatDateRange } from '@/utils/date';
import { formatPrice } from '@/utils/price';
import { useNavigation } from '@react-navigation/native';
import { ChipSelect } from '@/components/ChipSelect';
import { Button, Card, Loader, ScreenContainer, Typography } from '@/ui';

export const OwnerBookingsScreen = () => {
  const owner = useAuthStore((state) => state.user);
// TODO: move theming to UI layer
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'cancelled' | 'completed' | 'pending'
  >('pending');

  const { data: ownerOffers = [] } = useQuery({
    queryKey: ['owner-offers', owner?.id],
    queryFn: () => adminService.getUserOffers(owner?.id ?? ''),
    enabled: Boolean(owner?.id),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['owner-bookings', owner?.id],
    queryFn: () => bookingService.getOwnerBookings(owner?.id ?? ''),
    enabled: Boolean(owner?.id),
  });

  const confirmMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.updateStatus(bookingId, 'active'),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['owner-bookings', owner?.id] }),
  });
  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.cancel(bookingId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['owner-bookings', owner?.id] }),
  });

  const items = useMemo(() => {
    const all = data?.items ?? [];
    if (statusFilter === 'all') return all;
    if (statusFilter === 'pending') return all.filter((b) => b.status === 'pending');
    return all.filter((b) => b.status === statusFilter);
  }, [data?.items, statusFilter]);

  return (
    <ScreenContainer style={styles.container} edges={['top', 'left', 'right']}>
      <BackButton />
      <Typography variant="h2" tone="primary" style={styles.heading}>
        {t('owner.bookings.new')}
      </Typography>
      <View style={styles.filters}>
        <ChipSelect
          options={(['pending', 'active', 'completed', 'cancelled', 'all'] as const).map((f) => ({
            id: f,
            label: t(`bookings.filter.${f}`),
          }))}
          selected={[statusFilter]}
          onChange={(next) => setStatusFilter((next[0] as typeof statusFilter) ?? 'pending')}
          multi={false}
          horizontal
        />
      </View>
      {isLoading ? (
        <View style={styles.list}>
          {[1, 2].map((i) => (
            <Loader key={i} variant="skeleton" height={140} />
          ))}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const offer = ownerOffers.find((o) => o.id === item.offerId);
            return (
              <Card style={styles.card} padding="lg">
                <Typography variant="body" tone="primary">
                  {offer?.title ?? item.offerId}
                </Typography>
                <Typography variant="caption" tone="secondary">
                  {formatDateRange(item.checkIn, item.checkOut)}
                </Typography>
                <Typography variant="caption" tone="secondary">
                  {t('bookings.guests')}: {item.guests}
                </Typography>
                <Typography variant="body" tone="accent">
                  {formatPrice(item.totalPrice)}
                </Typography>
                <View style={styles.actions}>
                  <Button
                    title={t('bookingDetails.status')}
                    variant="ghost"
                    style={styles.chip}
                    onPress={() =>
                      navigation.navigate('BookingDetails' as never, { bookingId: item.id } as never)
                    }
                  />
                  <Button
                    title={t('owner.contact')}
                    variant="ghost"
                    style={styles.chip}
                    onPress={() => alert('Связаться с гостем')}
                  />
                  <Button
                    title={t('owner.confirm')}
                    onPress={() => confirmMutation.mutate(item.id)}
                    disabled={item.status === 'active'}
                    style={styles.primary}
                  />
                  <Button
                    title={t('owner.objects.edit')}
                    variant="ghost"
                    style={styles.chip}
                    onPress={() => alert('Редактирование скоро будет доступно')}
                  />
                  <Button
                    title={t('bookings.cancel')}
                    variant="ghost"
                    style={styles.chip}
                    onPress={() => cancelMutation.mutate(item.id)}
                  />
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <Typography variant="caption" tone="secondary" style={styles.empty}>
              {isLoading ? t('bookings.loading') : t('owner.bookings.empty')}
            </Typography>
          }
          contentContainerStyle={styles.list}
        />
      )}
    </ScreenContainer>
  );
};

const getStyles = (colors: any) =>
// LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
    },
    heading: {
      marginBottom: spacing.md,
    },
    muted: {
      color: colors.muted,
    },
    list: {
      gap: spacing.md,
    },
    filters: {
      marginBottom: spacing.md,
    },
    card: {
      gap: spacing.xs,
    },
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    chip: {
      borderRadius: radius.md,
    },
    primary: {
      borderRadius: radius.md,
    },
    empty: {
      textAlign: 'center',
    },
  });
