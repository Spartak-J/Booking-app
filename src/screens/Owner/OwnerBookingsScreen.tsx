import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View, Button } from 'react-native';

import { bookingService } from '@/services/bookingService';
import { useAuthStore } from '@/store/authStore';
import { spacing } from '@/theme';
import { mockOffers } from '@/utils/mockData';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Skeleton } from '@/components/Skeleton';
import { BookingCard } from '@/components/BookingCard';

export const OwnerBookingsScreen = () => {
  const owner = useAuthStore((state) => state.user);
  const [filterOfferId, setFilterOfferId] = useState<string | undefined>();
  const { colors } = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const ownerOffers = useMemo(() => mockOffers.filter((o) => o.ownerId === owner?.id), [owner?.id]);

  const { data, isLoading } = useQuery({
    queryKey: ['owner-bookings', owner?.id],
    queryFn: () => bookingService.getOwnerBookings(owner?.id ?? ''),
    enabled: Boolean(owner?.id),
  });

  const items = useMemo(() => {
    const bookings = data?.items ?? [];
    if (!filterOfferId) return bookings;
    return bookings.filter((b) => b.offerId === filterOfferId);
  }, [data?.items, filterOfferId]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Брони по моим объектам</Text>
      {isLoading && (
        <View style={styles.list}>
          {[1, 2].map((i) => (
            <Skeleton key={i} height={100} />
          ))}
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        <Button
          title="Все объекты"
          color={!filterOfferId ? colors.accent : colors.surface}
          onPress={() => setFilterOfferId(undefined)}
        />
        {ownerOffers.map((o) => (
          <Button
            key={o.id}
            title={o.title}
            color={filterOfferId === o.id ? colors.accent : colors.surface}
            onPress={() => setFilterOfferId(o.id)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {isLoading ? 'Загрузка...' : 'Пока нет бронирований на ваши объекты'}
          </Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
    },
    heading: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    muted: {
      color: colors.muted,
    },
    list: {
      gap: spacing.md,
    },
    empty: {
      textAlign: 'center',
      color: colors.muted,
    },
  });
