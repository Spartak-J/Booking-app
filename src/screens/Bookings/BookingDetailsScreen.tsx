import { RouteProp, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '@/navigation/RootNavigator';
import { bookingService } from '@/services/bookingService';
import { spacing, radius } from '@/theme';
import { formatDateRange } from '@/utils/date';
import { formatPrice } from '@/utils/price';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FormContainer } from '@/components/Form';
import { Skeleton } from '@/components/Skeleton';

type Route = RouteProp<RootStackParamList, 'BookingDetails'>;

export const BookingDetailsScreen = () => {
  const { params } = useRoute<Route>();
  const queryClient = useQueryClient();
  const { colors } = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { data } = useQuery({
    queryKey: ['booking', params.bookingId],
    queryFn: () => bookingService.getById(params.bookingId),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      Alert.alert('Отменено', 'Бронь отменена.');
    },
  });

  if (!data) {
    return (
      <View style={styles.container}>
        <Skeleton height={120} />
        <Text style={styles.muted}>Бронь не найдена</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Бронь {data.id}</Text>
      <FormContainer>
        <Text style={styles.label}>Объект</Text>
        <Text style={styles.value}>{data.offerId}</Text>
        <Text style={styles.label}>Даты</Text>
        <Text style={styles.value}>{formatDateRange(data.checkIn, data.checkOut)}</Text>
        <Text style={styles.label}>Гостей</Text>
        <Text style={styles.value}>{data.guests}</Text>
        <Text style={styles.label}>Сумма</Text>
        <Text style={styles.value}>{formatPrice(data.totalPrice)}</Text>
        <Text style={styles.label}>Статус</Text>
        <Text style={styles.value}>{data.status}</Text>
      </FormContainer>
      {data.status !== 'cancelled' && (
        <Button
          title={cancelMutation.isPending ? 'Отмена...' : 'Отменить'}
          color={colors.error ?? '#dc2626'}
          onPress={() =>
            Alert.alert('Отменить бронь?', 'Это действие нельзя отменить', [
              { text: 'Нет', style: 'cancel' },
              { text: 'Да', style: 'destructive', onPress: () => cancelMutation.mutate(data.id) },
            ])
          }
        />
      )}
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
      gap: spacing.md,
    },
    heading: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.xs,
    },
    label: {
      color: colors.muted,
    },
    value: {
      color: colors.text,
      fontWeight: '600',
    },
    muted: {
      color: colors.muted,
    },
  });
