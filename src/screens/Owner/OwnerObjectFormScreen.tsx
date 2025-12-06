import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '@/navigation/RootNavigator';
import { offerService } from '@/services/offerService';
import { paramService } from '@/services/paramService';
import { spacing } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FormContainer, FormField } from '@/components/Form';
import { ChipSelect } from '@/components/ChipSelect';
import { Skeleton } from '@/components/Skeleton';

type Route = RouteProp<RootStackParamList, 'OwnerObjectForm'>;

export const OwnerObjectFormScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { params } = useRoute<Route>();
  const offerId = params?.offerId;
  const { colors } = useThemeColors();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
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
      Alert.alert('Сохранено', 'Объект сохранён (моки).');
      navigation.goBack();
    },
    onError: (err: unknown) => {
      Alert.alert('Ошибка', String(err));
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

  const title = useMemo(() => (offerId ? 'Редактирование объекта' : 'Новый объект'), [offerId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{title}</Text>
      {loadingOffer && <Skeleton height={140} />}
      <FormContainer>
        <Field label="Название" styles={styles}>
          <FormField value={form.title} onChangeText={(v) => onChange('title', v)} label="" />
        </Field>
        <Field label="Описание" styles={styles}>
          <FormField
            value={form.description}
            onChangeText={(v) => onChange('description', v)}
            label=""
            multiline
            style={styles.multiline}
          />
        </Field>
        <Field label="Город" styles={styles}>
          <FormField value={form.cityName} onChangeText={(v) => onChange('cityName', v)} label="" />
        </Field>
        <Field label="Страна" styles={styles}>
          <FormField
            value={form.cityCountry}
            onChangeText={(v) => onChange('cityCountry', v)}
            label=""
          />
        </Field>
        <Field label="Адрес" styles={styles}>
          <FormField value={form.address} onChangeText={(v) => onChange('address', v)} label="" />
        </Field>
        <Field label="Цена за ночь" styles={styles}>
          <FormField
            value={form.pricePerNight}
            onChangeText={(v) => onChange('pricePerNight', v)}
            label=""
            keyboardType="numeric"
            helperText="Укажите стоимость за ночь"
          />
        </Field>
        <Field label="Гостей" styles={styles}>
          <FormField
            value={form.guests}
            onChangeText={(v) => onChange('guests', v)}
            label=""
            keyboardType="numeric"
          />
        </Field>
        <Field label="Спален" styles={styles}>
          <FormField
            value={form.bedrooms}
            onChangeText={(v) => onChange('bedrooms', v)}
            label=""
            keyboardType="numeric"
          />
        </Field>
        <Field label="Фото (URL)" styles={styles}>
          <FormField value={form.image} onChangeText={(v) => onChange('image', v)} label="" />
          <Button title="Выбрать из галереи" onPress={pickImage} />
        </Field>
        <Field label="Удобства" styles={styles}>
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
        </Field>
      </FormContainer>
      <Button
        title={mutation.isPending ? 'Сохраняем...' : 'Сохранить'}
        onPress={() => mutation.mutate()}
        disabled={mutation.isPending}
      />
    </ScrollView>
  );
};

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  styles: ReturnType<typeof getStyles>;
}> = ({ label, children, styles }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

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
    heading: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    field: {
      gap: spacing.xs,
    },
    label: {
      color: colors.muted,
    },
    multiline: {
      minHeight: 90,
      textAlignVertical: 'top',
    },
  });
