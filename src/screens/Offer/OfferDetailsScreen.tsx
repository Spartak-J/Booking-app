import { RouteProp, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CachedImage } from '@/components/CachedImage';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { bookingService } from '@/services/bookingService';
import { offerService } from '@/services/offerService';
import { spacing, radius } from '@/theme';
import { formatPrice } from '@/utils/price';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FormContainer, FormField } from '@/components/Form';
import { Skeleton } from '@/components/Skeleton';

type Route = RouteProp<RootStackParamList, 'OfferDetails'>;

export const OfferDetailsScreen = () => {
  const { params } = useRoute<Route>();
  const { colors } = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { data: offer, isLoading } = useQuery({
    queryKey: ['offer', params.offerId],
    queryFn: () => offerService.getById(params.offerId),
  });

  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(() =>
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [guests, setGuests] = useState('2');

  const nights = useMemo(() => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diff = end - start;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
  }, [checkIn, checkOut]);

  const bookingMutation = useMutation({
    mutationFn: () =>
      bookingService.create({
        offerId: params.offerId,
        checkIn,
        checkOut,
        guests: Number(guests) || 1,
      }),
    onSuccess: () => {
      Alert.alert('Бронь создана', 'Бронирование создано в моках.');
    },
    onError: (err: unknown) => {
      Alert.alert('Ошибка', String(err));
    },
  });

  if (isLoading || !offer) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Skeleton height={200} />
        <Skeleton height={24} style={{ marginTop: spacing.md, width: '70%' }} />
        <Skeleton height={18} style={{ width: '50%' }} />
        <Skeleton height={18} style={{ width: '40%' }} />
        <Skeleton height={80} style={{ marginTop: spacing.md }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
        {offer.images.map((img) => (
          <CachedImage key={img} uri={img} style={styles.image} />
        ))}
      </ScrollView>
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.city}>
        {offer.city.name}, {offer.city.country}
      </Text>
      <Text style={styles.price}>{formatPrice(offer.pricePerNight)} / ночь</Text>
      <Text style={styles.subtitle}>Описание</Text>
      <Text style={styles.text}>{offer.description}</Text>
      <Text style={styles.subtitle}>Удобства</Text>
      <View style={styles.tags}>
        {offer.amenities.map((item) => (
          <View key={item} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.booking}>
        <Text style={styles.subtitle}>Бронирование</Text>
        <FormContainer>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <FormField
                label="Заезд (YYYY-MM-DD)"
                value={checkIn}
                onChangeText={setCheckIn}
                autoCapitalize="none"
                helperText="Введите дату заезда"
              />
            </View>
            <View style={styles.inputGroup}>
              <FormField
                label="Выезд"
                value={checkOut}
                onChangeText={setCheckOut}
                autoCapitalize="none"
                helperText="Дата выезда"
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <FormField
                label="Гостей"
                value={guests}
                onChangeText={setGuests}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Итого</Text>
              <Text style={styles.total}>{formatPrice(offer.pricePerNight * nights)}</Text>
            </View>
          </View>
        </FormContainer>
        <Button
          title={bookingMutation.isPending ? 'Создаём...' : 'Забронировать'}
          onPress={() => bookingMutation.mutate()}
          color={colors.accent}
        />
      </View>
    </ScrollView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    gallery: {
      height: 220,
    },
    image: {
      width: 320,
      height: 200,
      marginRight: spacing.md,
      borderRadius: radius.md,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    city: {
      fontSize: 16,
      color: colors.muted,
    },
    price: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: spacing.md,
      color: colors.text,
    },
    label: {
      color: colors.muted,
      marginBottom: spacing.xs,
    },
    text: {
      fontSize: 16,
      color: colors.text,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    tag: {
      backgroundColor: colors.surface,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tagText: {
      color: colors.primary,
      fontWeight: '600',
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    muted: {
      color: colors.muted,
    },
    booking: {
      gap: spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    inputGroup: {
      flex: 1,
    },
    total: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
  });
