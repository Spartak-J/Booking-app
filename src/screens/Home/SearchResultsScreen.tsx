// Screen: SearchResultsScreen. Used in: RootNavigator.
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import SearchResultsScreenView from '@/components/Home/SearchResultsScreenView';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { cityService } from '@/services/cityService';
import { offerService, OfferFilters } from '@/services/offerService';
import { AppLayout } from '@/layout/AppLayout';

type Route = RouteProp<RootStackParamList, Routes.SearchResults>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const SearchResultsScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const [filters, setFilters] = useState<OfferFilters>(params?.filters ?? { onlyActive: true });

  const queryKey = useMemo(() => ['search-results', filters], [filters]);
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: () => offerService.getAll(filters),
  });
  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: cityService.getAll });

  return (
    <AppLayout variant="stack">
      <SearchResultsScreenView
        filters={filters}
        setFilters={setFilters}
        cities={cities ?? []}
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        onRefresh={refetch}
        onBack={() => navigation.goBack()}
        onPressOffer={(offer) => navigation.navigate(Routes.OfferDetails, { offerId: offer.id })}
      />
    </AppLayout>
  );
};

export default SearchResultsScreen;
