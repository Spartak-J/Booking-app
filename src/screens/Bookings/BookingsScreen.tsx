import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { bookingService } from '@/services/bookingService';
import { useAuthStore } from '@/store/authStore';
import { spacing, radius } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BookingCard } from '@/components/BookingCard';
import { Skeleton } from '@/components/Skeleton';
import { useCallback } from 'react';

export const BookingsScreen = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();
  const { colors } = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => bookingService.getUserBookings(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.cancel(bookingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const confirmCancel = useCallback(
    (id: string) =>
      Alert.alert('Отменить бронь?', 'Вы уверены, что хотите отменить бронь?', [
        { text: 'Нет', style: 'cancel' },
        { text: 'Да', style: 'destructive', onPress: () => cancelMutation.mutate(id) },
      ]),
    [cancelMutation],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Мои бронирования</Text>
      {isLoading && (
        <View style={styles.list}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={120} />
          ))}
        </View>
      )}
      <FlatList
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              navigation.navigate(
                'BookingDetails' as never,
                {
                  bookingId: item.id,
                } as never,
              )
            }
            onCancel={item.status !== 'cancelled' ? () => confirmCancel(item.id) : undefined}
            cancelLabel={cancelMutation.isPending ? 'Отмена...' : 'Отменить'}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {isLoading ? 'Загрузка...' : 'У вас пока нет бронирований'}
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
    list: {
      gap: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    muted: {
      color: colors.muted,
    },
    price: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
    status: {
      color: colors.text,
      fontWeight: '500',
    },
    empty: {
      textAlign: 'center',
      marginTop: spacing.xl,
      color: colors.muted,
    },
  });
