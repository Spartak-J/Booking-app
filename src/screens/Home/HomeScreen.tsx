import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import {
  Button,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DateRangePicker } from '@/components/DateRangePicker';
import { GuestPicker } from '@/components/GuestPicker';
import { OfferCard } from '@/components/OfferCard';
import { ChipSelect } from '@/components/ChipSelect';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { cityService } from '@/services/cityService';
import { offerService, OfferFilters } from '@/services/offerService';
import { paramService } from '@/services/paramService';
import { spacing } from '@/theme';
import { Offer } from '@/types';
import { useThemeColors } from '@/hooks/useThemeColors';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const HomeScreen = () => {
  const navigation = useNavigation<Navigation>();
  const [filters, setFilters] = useState<OfferFilters>({});
  const { colors } = useThemeColors();
  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: cityService.getAll });
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: paramService.getCategories,
  });
  const { data: amenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: paramService.getAmenities,
  });

  const queryKey = useMemo(() => ['offers', filters], [filters]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: () => offerService.getAll(filters),
  });

  const onPressOffer = (offer: Offer) => {
    navigation.navigate('OfferDetails', { offerId: offer.id });
  };

  const renderItem = ({ item }: { item: Offer }) => (
    <OfferCard offer={item} onPress={() => onPressOffer(item)} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Поиск жилья</Text>
      {isLoading && <Text style={[styles.label, { color: colors.muted }]}>Загрузка...</Text>}
      <View style={styles.filters}>
        <Text style={styles.label}>Город</Text>
        <TextInput
          placeholder="Введите город"
          value={filters.cityName ?? ''}
          onChangeText={(text) => setFilters((prev) => ({ ...prev, cityName: text }))}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
          ]}
        />
        <ScrollRow>
          {(cities ?? [])
            .filter((c) =>
              filters.cityName
                ? c.name.toLowerCase().includes(filters.cityName.toLowerCase())
                : true,
            )
            .map((c) => (
              <Pill
                key={c.id}
                label={c.name}
                active={filters.cityName === c.name}
                onPress={() => setFilters((prev) => ({ ...prev, cityName: c.name }))}
              />
            ))}
        </ScrollRow>

        <Text style={styles.label}>Категории</Text>
        <ChipSelect
          options={(categories ?? []).map((c) => ({ id: c.id, label: c.name }))}
          selected={filters.categoryId ? [filters.categoryId] : []}
          onChange={(next) => setFilters((prev) => ({ ...prev, categoryId: next[0] ?? undefined }))}
          multi={false}
        />

        <Text style={styles.label}>Удобства</Text>
        <ChipSelect
          options={(amenities ?? []).map((a) => ({ id: a.name, label: a.name }))}
          selected={filters.amenities ?? []}
          onChange={(next) => setFilters((prev) => ({ ...prev, amenities: next }))}
          multi
          horizontal={false}
        />

        <DateRangePicker
          value={filters.dates}
          onChange={(dates) => setFilters((prev) => ({ ...prev, dates }))}
        />
        <GuestPicker
          value={filters.guests}
          onChange={(guests) => setFilters((prev) => ({ ...prev, guests }))}
        />

        <Text style={styles.label}>Сортировка</Text>
        <ScrollRow>
          {['price', 'rating'].map((s) => (
            <Pill
              key={s}
              label={s === 'price' ? 'Цена' : 'Рейтинг'}
              active={filters.sort === s}
              onPress={() =>
                setFilters((prev) => ({
                  ...prev,
                  sort: prev.sort === s ? undefined : (s as OfferFilters['sort']),
                }))
              }
            />
          ))}
        </ScrollRow>

        <Button title="Применить фильтры" onPress={() => refetch()} />
      </View>
      <FlatList
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>{isLoading ? 'Загрузка...' : 'Нет доступных объектов'}</Text>
        }
      />
    </View>
  );
};

const Pill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  const { colors } = useThemeColors();
  return <Button title={label} color={active ? colors.accent : colors.surface} onPress={onPress} />;
};

const ScrollRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
    <View style={styles.rowInner}>{children}</View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  filters: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  row: {
    marginVertical: spacing.xs,
  },
  rowInner: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  label: {
    color: '#6b7280',
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: '#6b7280',
  },
});
