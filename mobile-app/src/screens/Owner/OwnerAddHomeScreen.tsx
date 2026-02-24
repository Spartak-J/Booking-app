// Screen: OwnerAddHomeScreen. Create new listing with mock amenities.
import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppLayout } from '@/layout/AppLayout';
import { ScreenShell, Button, Input, Typography, Loader, LineWithDots, IconButton } from '@/ui';
import { useTranslation } from '@/i18n';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { spacing, radius, typography } from '@/theme';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/store/authStore';
import { ownerOffersService } from '@/services/owner';
import { paramService } from '@/services/paramService';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';
import { Routes } from '@/navigation/routes';
import { s } from '@/utils/scale';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type ScreenRoute = RouteProp<RootStackParamList, Routes.OwnerAddHome>;

export const OwnerAddHomeScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ScreenRoute>();
  const { t } = useTranslation();
  const { tokens, colors, mode } = useTheme();
  const owner = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const offerId = route.params?.offerId;
  const isEditMode = Boolean(offerId);

  const { data: amenitiesData, isLoading: loadingAmenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: paramService.getAmenities,
  });

  const [titleDraft, setTitleDraft] = useState<string | null>(null);
  const [addressDraft, setAddressDraft] = useState<string | null>(null);
  const [descriptionDraft, setDescriptionDraft] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<string | null>(null);
  const [guestsDraft, setGuestsDraft] = useState<number | null>(null);
  const [roomsDraft, setRoomsDraft] = useState<number | null>(null);
  const [singleBedsDraft, setSingleBedsDraft] = useState<number | null>(null);
  const [doubleBedsDraft, setDoubleBedsDraft] = useState<number | null>(null);
  const [amenitiesDraft, setAmenitiesDraft] = useState<string[] | null>(null);
  const [photosDraft, setPhotosDraft] = useState<string[] | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const { data: existingOffer, isLoading: loadingOffer } = useQuery({
    queryKey: ['owner-offer', offerId],
    queryFn: () => ownerOffersService.getById(offerId as string),
    enabled: isEditMode && Boolean(offerId),
  });

  const title = titleDraft ?? existingOffer?.title ?? '';
  const address = addressDraft ?? existingOffer?.address ?? '';
  const description = descriptionDraft ?? existingOffer?.description ?? '';
  const price =
    priceDraft ?? (existingOffer?.pricePerNight ? String(existingOffer.pricePerNight) : '');
  const guests = guestsDraft ?? existingOffer?.guests ?? 2;
  const rooms = roomsDraft ?? existingOffer?.bedrooms ?? 1;
  const singleBeds = singleBedsDraft ?? 1;
  const doubleBeds = doubleBedsDraft ?? 1;
  const amenities = amenitiesDraft ?? existingOffer?.amenities ?? [];
  const photos = photosDraft ?? existingOffer?.images ?? [];

  const requiredErrors = useMemo(
    () => ({
      title: !title.trim(),
      address: !address.trim(),
      description: !description.trim(),
      photos: photos.length === 0,
    }),
    [address, description, photos.length, title],
  );

  const hasErrors =
    requiredErrors.title ||
    requiredErrors.address ||
    requiredErrors.description ||
    requiredErrors.photos;

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });
      if (result.canceled) return;
      const nextUris = result.assets.map((asset) => asset.uri).filter(Boolean);
      if (!nextUris.length) return;
      setPhotosDraft(Array.from(new Set([...photos, ...nextUris])));
    } catch (error) {
      Alert.alert(t('booking.error'), String(error));
    }
  };

  const removePhoto = (uri: string) => {
    setPhotosDraft(photos.filter((item) => item !== uri));
  };

  const toggleAmenity = (name: string) => {
    setAmenitiesDraft(
      amenities.includes(name) ? amenities.filter((item) => item !== name) : [...amenities, name],
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        pricePerNight: Number(price) || 0,
        guests,
        bedrooms: rooms,
        images: photos,
        amenities,
        ownerId: owner?.id ?? 'owner-1',
        type: 'apartment' as const,
        city: { id: 'city-temp', name: t('owner.form.city'), country: t('owner.form.country') },
        isActive: true,
      };
      if (isEditMode && offerId) {
        return ownerOffersService.update(offerId, payload);
      }
      return ownerOffersService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-homes', owner?.id] });
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      if (offerId) {
        queryClient.invalidateQueries({ queryKey: ['owner-offer', offerId] });
      }
      navigation.goBack();
    },
    onError: (error: unknown) => {
      Alert.alert(t('booking.error'), String(error));
    },
  });

  const footerItems = BOTTOM_NAV_ITEMS.map((item) => ({
    ...item,
    label: item.id === 'bookings' ? t('owner.tabs.bookings') : item.label,
    onPress: () => {
      if (item.id === 'home') {
        navigation.navigate(Routes.Main, { screen: Routes.Home });
        return;
      }
      if (item.id === 'messages') {
        navigation.navigate(Routes.Main, { screen: Routes.Notifications });
        return;
      }
      if (item.id === 'bookings') {
        navigation.navigate(Routes.Main, { screen: Routes.Bookings });
        return;
      }
      navigation.navigate(Routes.Main, { screen: Routes.Profile });
    },
  }));

  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const isLight = mode === 'light';

  const counter = (
    label: string,
    value: number,
    setValue: (v: number) => void,
    min = 0,
    max = 10,
  ) => (
    <View style={styles.counterRowItem}>
      <Typography variant="body" tone="primary" style={styles.counterLabel}>
        {label}
      </Typography>
      <View style={styles.counterRow}>
        <Button
          size="small"
          variant="ghost"
          title="-"
          onPress={() => setValue(Math.max(min, value - 1))}
          disabled={value <= min}
          style={styles.counterBtn}
          textStyle={styles.counterBtnText}
        />
        <Typography variant="subtitle" tone="primary">
          {value}
        </Typography>
        <Button
          size="small"
          variant="ghost"
          title="+"
          onPress={() => setValue(Math.min(max, value + 1))}
          style={styles.counterBtn}
          disabled={value >= max}
          textStyle={styles.counterBtnText}
        />
      </View>
    </View>
  );

  const submit = () => {
    setShowValidation(true);
    if (hasErrors || mutation.isPending) return;
    mutation.mutate();
  };

  return (
    <AppLayout
      variant="stack"
      header={false}
      footer={<HomeFooter items={footerItems} activeId="profile" />}
    >
      <ScreenShell
        title={isEditMode ? t('owner.form.title.edit') : t('owner.form.title.new')}
        onBack={() => navigation.goBack()}
        style={isLight ? { backgroundColor: colors.white } : undefined}
        contentStyle={[styles.content, isLight ? { backgroundColor: colors.white } : undefined]}
        showKeys={false}
      >
        {isEditMode && loadingOffer ? (
          <Loader variant="skeleton" height={180} />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <LineWithDots width={s(304)} color={tokens.textPrimary} style={styles.headerRule} />
            <Typography variant="caption" tone="accent">
              * Поля обов&apos;язкові для заповнення
            </Typography>

            <Typography variant="subtitle" tone="primary" style={styles.sectionTitle}>
              Іформація про житло
            </Typography>
            <Input
              label={`${t('owner.form.name')}*`}
              value={title}
              onChangeText={setTitleDraft}
              placeholder={t('owner.form.name')}
              error={showValidation && requiredErrors.title ? t('validation.required') : undefined}
            />
            <Input
              label={`${t('owner.form.address')}*`}
              value={address}
              onChangeText={setAddressDraft}
              placeholder={t('owner.form.address.helper')}
              error={
                showValidation && requiredErrors.address ? t('validation.required') : undefined
              }
            />
            <Input
              label={`${t('owner.form.description')}*`}
              value={description}
              onChangeText={setDescriptionDraft}
              placeholder={t('owner.form.description')}
              multiline
              numberOfLines={4}
              inputStyle={styles.textarea}
              error={
                showValidation && requiredErrors.description ? t('validation.required') : undefined
              }
            />

            <View style={styles.section}>
              <Typography variant="subtitle" tone="primary" style={styles.sectionTitle}>
                {`${t('owner.form.photo')}*`}
              </Typography>
              <View style={styles.photoFrame}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.photoScroller,
                    photos.length <= 4 ? styles.photoScrollerFill : undefined,
                  ]}
                >
                  {photos.length
                    ? photos.map((uri) => (
                        <View key={uri} style={styles.photoCellWrap}>
                          <Image source={{ uri }} style={styles.photoCell} />
                          <IconButton
                            onPress={() => removePhoto(uri)}
                            icon={<MaterialCommunityIcons name="close" size={s(14)} />}
                            size="sm"
                            variant="filled"
                            style={styles.removePhotoButton}
                          />
                        </View>
                      ))
                    : Array.from({ length: 4 }).map((_, idx) => (
                        <View key={`placeholder-${idx}`} style={styles.photoPlaceholder} />
                      ))}
                </ScrollView>
                <Button
                  title={t('profile.account.upload') || 'Завантажити'}
                  variant="secondary"
                  size="small"
                  onPress={pickImages}
                  style={styles.uploadButton}
                />
                {showValidation && requiredErrors.photos ? (
                  <Typography variant="caption" tone="error" style={styles.photoHint}>
                    {t('validation.required')}
                  </Typography>
                ) : null}
              </View>
            </View>

            <View style={styles.section}>
              <Typography variant="subtitle" tone="primary" style={styles.sectionTitle}>
                {t('owner.form.amenities')}
              </Typography>
              {loadingAmenities ? (
                <Loader variant="skeleton" height={48} />
              ) : (
                <View style={styles.amenitiesList}>
                  {(amenitiesData ?? []).map((item) => {
                    const isChecked = amenities.includes(item.name);
                    return (
                      <View key={item.name} style={styles.amenityRow}>
                        <Typography variant="body" tone="primary" style={styles.amenityText}>
                          {item.name}
                        </Typography>
                        <IconButton
                          onPress={() => toggleAmenity(item.name)}
                          icon={
                            <MaterialCommunityIcons
                              name="check"
                              size={s(14)}
                              color={isChecked ? tokens.textPrimary : tokens.bgField}
                            />
                          }
                          size="sm"
                          variant="outlined"
                          style={[styles.checkbox, isChecked ? styles.checkboxActive : null]}
                          preserveIconColor
                        />
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Typography variant="subtitle" tone="primary" style={styles.sectionTitle}>
                Данні житла
              </Typography>
              <View style={styles.countersGroup}>
                {counter(t('owner.form.guests'), guests, (value) => setGuestsDraft(value), 1, 12)}
                {counter('Кількість кімнат', rooms, (value) => setRoomsDraft(value), 1, 6)}
                {counter(
                  'Односпальне ліжко',
                  singleBeds,
                  (value) => setSingleBedsDraft(value),
                  0,
                  10,
                )}
                {counter(
                  'Двоспальне ліжко',
                  doubleBeds,
                  (value) => setDoubleBedsDraft(value),
                  0,
                  10,
                )}
              </View>
            </View>

            <View style={styles.priceRow}>
              <Typography variant="subtitle" tone="primary" style={styles.priceLabel}>
                Ціна/ніч
              </Typography>
              <Input
                value={price}
                onChangeText={setPriceDraft}
                keyboardType="numeric"
                placeholder="1345 UAH"
                containerStyle={styles.priceInput}
              />
            </View>

            <Button
              title={mutation.isPending ? t('owner.form.saveProgress') : t('owner.form.save')}
              onPress={submit}
              isLoading={mutation.isPending}
              disabled={mutation.isPending}
              style={styles.saveBtn}
            />
          </ScrollView>
        )}
      </ScreenShell>
    </AppLayout>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    scroll: {
      gap: spacing.md,
      paddingBottom: spacing.xxl,
    },
    headerRule: {
      marginTop: spacing.xs,
    },
    sectionTitle: {
      marginBottom: spacing.xs,
    },
    textarea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    section: {
      gap: spacing.md,
    },
    photoFrame: {
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.bgField,
      padding: spacing.sm,
      gap: spacing.sm,
    },
    photoScroller: {
      gap: spacing.sm,
      minHeight: s(54),
      paddingRight: spacing.xs,
    },
    photoScrollerFill: {
      minWidth: '100%',
      justifyContent: 'space-between',
    },
    photoCellWrap: {
      width: s(76),
      height: s(42),
      borderRadius: radius.sm,
      overflow: 'hidden',
      position: 'relative',
    },
    photoCell: {
      width: '100%',
      height: '100%',
      borderRadius: radius.sm,
      backgroundColor: tokens.bgPanel,
    },
    photoPlaceholder: {
      width: s(76),
      height: s(42),
      borderRadius: radius.sm,
      backgroundColor: tokens.bgSurfaceAlt,
      borderWidth: 1,
      borderColor: tokens.borderStrong,
    },
    removePhotoButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: s(18),
      height: s(18),
      minWidth: s(18),
      minHeight: s(18),
      padding: 0,
      borderRadius: radius.round,
    },
    uploadButton: {
      alignSelf: 'center',
      borderRadius: radius.round,
      minWidth: s(132),
    },
    photoHint: {
      textAlign: 'right',
    },
    amenitiesList: {
      gap: spacing.xs,
    },
    amenityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      justifyContent: 'space-between',
    },
    checkbox: {
      width: s(24),
      height: s(24),
      borderRadius: radius.sm,
      borderColor: tokens.border,
      backgroundColor: tokens.bgField,
    },
    checkboxActive: {
      backgroundColor: tokens.accentSoft,
      borderColor: tokens.accent,
    },
    amenityText: {
      ...(typography.body as object),
      flex: 1,
    },
    countersGroup: {
      gap: spacing.sm,
    },
    counterRowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    counterLabel: {
      flex: 1,
    },
    counterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      minWidth: s(142),
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: radius.round,
      backgroundColor: tokens.bgField,
    },
    counterBtn: {
      width: 35,
      height: 35,
      borderRadius: radius.round,
    },
    counterBtnText: {
      ...(typography.subtitle as object),
      lineHeight: 8,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    priceLabel: {
      flex: 1,
    },
    priceInput: {
      width: s(176),
    },
    saveBtn: {
      marginTop: spacing.sm,
      borderRadius: radius.round,
      alignSelf: 'flex-end',
      width: s(176),
    },
  });

export default OwnerAddHomeScreen;
