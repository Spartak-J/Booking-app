import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Alert, Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '@/navigation/RootNavigator';
import { offerService } from '@/services/offerService';
import { useAuthStore } from '@/store/authStore';
import { spacing, radius } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Skeleton } from '@/components/Skeleton';

export const OwnerObjectsScreen = () => {
  const owner = useAuthStore((state) => state.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { colors } = useThemeColors();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const { data, isLoading } = useQuery({
    queryKey: ['owner-offers', owner?.id],
    queryFn: () => offerService.getAll({}),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => offerService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-offers'] });
      Alert.alert('Удалено', 'Объект удалён (моки).');
    },
  });

  const onDelete = (id: string) =>
    Alert.alert('Удалить объект?', 'Это действие необратимо (моки).', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);

  const items = (data?.items ?? []).filter((item) => !owner?.id || item.ownerId === owner.id);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Мои объекты</Text>
      {isLoading && (
        <View style={styles.list}>
          {[1, 2].map((i) => (
            <Skeleton key={i} height={120} />
          ))}
        </View>
      )}
      <Button
        title="Создать объект"
        onPress={() => navigation.navigate('OwnerObjectForm', { offerId: undefined })}
        color={colors.accent}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('OwnerObjectForm', { offerId: item.id })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.muted}>{item.address}</Text>
            <Text style={styles.status}>{item.isActive ? 'Активен' : 'Скрыт'}</Text>
            <Button
              title="Удалить"
              color={colors.error ?? '#dc2626'}
              onPress={() => onDelete(item.id)}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {isLoading ? 'Загрузка...' : 'Добавьте ваш первый объект'}
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
      gap: spacing.md,
    },
    heading: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    list: {
      gap: spacing.md,
      paddingVertical: spacing.md,
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
    status: {
      color: colors.primary,
      fontWeight: '600',
    },
    empty: {
      textAlign: 'center',
      color: colors.muted,
    },
  });
