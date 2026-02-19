// Screen: OwnerObjectFormScreen. Used in: (no direct imports found).
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '@/navigation/RootNavigator';
import { offerService } from '@/services/offerService';
import { paramService } from '@/services/paramService';
import { spacing, radius } from '@/theme';
import { useTheme } from '@/theme';
import { ChipSelect } from '@/components/ChipSelect';
import { useTranslation } from '@/i18n';
import { BackButton } from '@/components/BackButton';
import { formatDate } from '@/utils/date';
import { Button, Card, Input, Loader, ScreenContainer, Typography } from '@/ui';

type Route = RouteProp<RootStackParamList, 'OwnerObjectForm'>;

export const OwnerObjectFormScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { params } = useRoute<Route>();
  const offerId = params?.offerId;
// TODO: move theming to UI layer
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const { data: amenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: paramService.getAmenities,
  });
  const { isLoading: loadingOffer } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => offerService.getById(offerId ?? ''),
    enabled: Boolean(offerId),
  });

  const { data: existing } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => offerService.getById(offerId ?? ''),
    enabled: Boolean(offerId),
  });

  const [form, setForm] = useState({
    title: '',
    description: '',
    cityName: '',
    cityCountry: '',
    address: '',
    pricePerNight: '',
    guests: '',
    bedrooms: '',
    image: '',
    amenities: [] as string[],
  });

  React.useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        description: existing.description,
        cityName: existing.city.name,
        cityCountry: existing.city.country,
        address: existing.address,
        pricePerNight: String(existing.pricePerNight),
        guests: String(existing.guests),
        bedrooms: String(existing.bedrooms),
        image: existing.images[0] ?? '',
        amenities: existing.amenities ?? [],
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        city: {
          id: existing?.city.id ?? 'city-temp',
          name: form.cityName,
          country: form.cityCountry,
        },
        address: form.address.trim(),
        pricePerNight: Number(form.pricePerNight) || 0,
        guests: Number(form.guests) || 1,
        bedrooms: Number(form.bedrooms) || 1,
        images: form.image ? [form.image.trim()] : (existing?.images ?? []),
        amenities: form.amenities.length ? form.amenities : (existing?.amenities ?? []),
      };
      if (offerId) {
        return offerService.update(offerId, payload);
      }
      return offerService.create(payload);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['owner-offers'] });
      if (result?.id) {
        queryClient.setQueryData(['offer', result.id], result);
      }
      // TODO: replace mock success copy with API response copy/i18n when backend is ready.
      Alert.alert(t('owner.form.saved'), t('owner.form.savedMock'));
      navigation.goBack();
    },
    onError: (err: unknown) => {
      Alert.alert(t('booking.error'), String(err));
    },
  });

  const onChange = (key: keyof typeof form, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }) as typeof form);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      onChange('image', res.assets[0].uri);
    }
  };

  // TODO: replace mock replies with backend responses.
  const respondToReview = (id: string) =>
    Alert.alert(t('owner.reviews.reply'), `Mock reply for ${id}`);

  // TODO: replace mock disputes with backend responses.
  const disputeReview = (id: string) =>
    Alert.alert(t('owner.reviews.dispute'), `Mock dispute for ${id}`);

  const title = useMemo(
    () => (offerId ? t('owner.form.title.edit') : t('owner.form.title.new')),
    [offerId, t],
  );

  return (
    <ScreenContainer style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <BackButton />
        <Typography variant="h2" tone="primary">
          {title}
        </Typography>
        {loadingOffer && <Loader variant="skeleton" height={140} />}
        <Card style={styles.formCard} padding="lg">
          <Input
            label={t('owner.form.name')}
            value={form.title}
            onChangeText={(v) => onChange('title', v)}
          />
          <Input
            label={t('owner.form.description')}
            value={form.description}
            onChangeText={(v) => onChange('description', v)}
            multiline
            inputStyle={styles.multiline}
          />
          <Input
            label={t('owner.form.city')}
            value={form.cityName}
            onChangeText={(v) => onChange('cityName', v)}
          />
          <Input
            label={t('owner.form.country')}
            value={form.cityCountry}
            onChangeText={(v) => onChange('cityCountry', v)}
          />
          <Input
            label={t('owner.form.address')}
            value={form.address}
            onChangeText={(v) => onChange('address', v)}
          />
          <Input
            label={t('owner.form.price')}
            value={form.pricePerNight}
            onChangeText={(v) => onChange('pricePerNight', v)}
            keyboardType="numeric"
            helperText={t('owner.form.price.helper')}
          />
          <Input
            label={t('owner.form.guests')}
            value={form.guests}
            onChangeText={(v) => onChange('guests', v)}
            keyboardType="numeric"
          />
          <Input
            label={t('owner.form.bedrooms')}
            value={form.bedrooms}
            onChangeText={(v) => onChange('bedrooms', v)}
            keyboardType="numeric"
          />
          <Input
            label={t('owner.form.photo')}
            value={form.image}
            onChangeText={(v) => onChange('image', v)}
          />
          <Button title={t('owner.form.pickImage')} onPress={pickImage} variant="ghost" />
          <Typography variant="caption" tone="secondary">
            {t('owner.form.amenities')}
          </Typography>
          <ChipSelect
            options={(amenities ?? []).map((a) => ({ id: a.name, label: a.name }))}
            selected={form.amenities}
            onChange={(next) =>
              setForm((prev) => ({
                ...prev,
                amenities: next,
              }))
            }
            multi
            horizontal={false}
          />
        </Card>
        <Button
          title={mutation.isPending ? t('owner.form.saveProgress') : t('owner.form.save')}
          onPress={() => mutation.mutate()}
          disabled={mutation.isPending}
        />
        {existing && (
          <>
            <Typography variant="h2" tone="primary">
              {t('owner.reviews.title')}
            </Typography>
            {existing.reviews && existing.reviews.length ? (
              <View style={styles.reviews}>
                {existing.reviews.map((r) => (
                  <Card key={r.id} style={styles.reviewCard} padding="md">
                    <Typography variant="body" tone="primary">
                      {r.userName} · {r.rating}★
                    </Typography>
                    <Typography variant="caption" tone="primary">
                      {r.comment}
                    </Typography>
                    <Typography variant="caption" tone="secondary">
                      {formatDate(r.createdAt)}
                    </Typography>
                    <View style={styles.reviewActions}>
                      <Button
                        title={t('owner.reviews.reply')}
                        variant="ghost"
                        style={styles.secondary}
                        onPress={() => respondToReview(r.id)}
                      />
                      <Button
                        title={t('owner.reviews.dispute')}
                        variant="ghost"
                        style={styles.secondary}
                        onPress={() => disputeReview(r.id)}
                      />
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <Typography variant="caption" tone="secondary" style={styles.muted}>
                {t('owner.reviews.empty')}
              </Typography>
            )}
          </>
        )}
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
      gap: spacing.md,
    },
    formCard: {
      gap: spacing.sm,
    },
    multiline: {
      minHeight: 90,
      textAlignVertical: 'top',
    },
    reviews: {
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    reviewCard: {
      gap: spacing.xs,
    },
    reviewActions: {
      flexDirection: 'row',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
    secondary: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
    },
    muted: {
    },
  });
