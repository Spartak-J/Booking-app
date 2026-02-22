// Screen: OwnerObjectsScreen. Used in: (no direct imports found).
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { RootStackParamList } from '@/navigation/RootNavigator';
import { offerService } from '@/services/offerService';
import { useAuthStore } from '@/store/authStore';
import { spacing, radius } from '@/theme';
import { useTheme } from '@/theme';
import { CachedImage } from '@/components/CachedImage';
import { useTranslation } from '@/i18n';
import { BackButton } from '@/components/BackButton';
import { formatPrice } from '@/utils/price';
import { Button, Loader, ScreenContainer, Typography } from '@/ui';

export const OwnerObjectsScreen = () => {
  const owner = useAuthStore((state) => state.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  // TODO: move theming to UI layer
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const { data, isLoading } = useQuery({
    queryKey: ['owner-offers', owner?.id],
    queryFn: () => offerService.getAll({}),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => offerService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-offers'] });
      Alert.alert(t('admin.refresh'), t('owner.objects.delete'));
    },
  });

  const onDelete = (id: string) =>
    Alert.alert(t('owner.objects.delete'), t('owner.objects.delete'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('owner.objects.delete'),
        style: 'destructive',
        onPress: () => deleteMutation.mutate(id),
      },
    ]);

  const items = (data?.items ?? []).filter((item) => !owner?.id || item.ownerId === owner.id);

  return (
    <ScreenContainer style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <BackButton />
        <Typography variant="h2" tone="primary">
          {t('owner.objects.title')}
        </Typography>
      </View>
      <View style={styles.tabRow}>
        <Button
          title={t('owner.objects.title')}
          variant="ghost"
          style={styles.tabActive}
          onPress={() => {}}
        />
        <Button
          title={t('profile.menu.settings')}
          variant="ghost"
          style={styles.tabInactive}
          onPress={() => {}}
        />
      </View>
      {isLoading && (
        <View style={styles.list}>
          {[1, 2].map((i) => (
            <Loader key={i} variant="skeleton" height={120} />
          ))}
        </View>
      )}
      <Button
        title={t('owner.objects.create')}
        variant="ghost"
        style={styles.createButton}
        onPress={() => navigation.navigate('OwnerAddHome', { offerId: undefined })}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            variant="ghost"
            style={styles.card}
            onPress={() => navigation.navigate('OwnerAddHome', { offerId: item.id })}
          >
            <CachedImage uri={item.images?.[0]} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Typography variant="body" tone="primary">
                {item.title}
              </Typography>
              <Typography variant="caption" tone="secondary">
                {item.address}
              </Typography>
              <View style={styles.statusRow}>
                <Typography variant="caption" tone="accent">
                  {item.isActive
                    ? t('owner.objects.status.active')
                    : t('owner.objects.status.hidden')}
                </Typography>
                <Typography variant="body" tone="primary">
                  {formatPrice(item.pricePerNight)}
                </Typography>
              </View>
              <Button
                title={t('owner.objects.delete')}
                variant="ghost"
                style={styles.deleteButton}
                textStyle={styles.deleteText}
                onPress={() => onDelete(item.id)}
              />
            </View>
          </Button>
        )}
        ListEmptyComponent={
          <Typography variant="caption" tone="secondary" style={styles.empty}>
            {isLoading ? t('owner.objects.loading') : t('owner.objects.empty')}
          </Typography>
        }
        contentContainerStyle={styles.list}
      />
    </ScreenContainer>
  );
};

const getStyles = (colors: any) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surfaceLightDarker ?? colors.background,
      padding: spacing.lg,
      gap: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      color: colors.textPrimary ?? colors.text,
    },
    tabRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.md,
    },
    tabActive: {
      borderWidth: 1,
      borderColor: colors.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    tabInactive: {
      borderWidth: 1,
      borderColor: colors.textPrimary ?? colors.text,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    createButton: {
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: colors.textPrimary ?? colors.text,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
    },
    list: {
      gap: spacing.md,
      paddingVertical: spacing.md,
    },
    card: {
      backgroundColor: colors.surfaceLight ?? colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      gap: spacing.md,
    },
    cardImage: {
      height: 124,
      borderRadius: 10,
    },
    cardContent: {
      gap: spacing.xs,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    deleteButton: {
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: colors.error,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    deleteText: {
      color: colors.error,
    },
    empty: {
      textAlign: 'center',
    },
  });
