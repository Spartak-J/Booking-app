// Screen: SavedScreen. Used in: (no direct imports found).
import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SavedScreenView from '@/components/Saved/SavedScreenView';
import { useSavedStore } from '@/store/savedStore';
import { useAuthStore } from '@/store/authStore';
import { offerService } from '@/services/offerService';
import type { Offer } from '@/types';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { AppLayout } from '@/layout/AppLayout';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const SavedScreen = () => {
  const navigation = useNavigation<Navigation>();
  const savedIds = useSavedStore((s) => s.savedIds);
  const hydrateForUser = useSavedStore((s) => s.hydrateForUser);
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!userId) return;
    void hydrateForUser(userId);
  }, [hydrateForUser, userId]);

  const { data } = useQuery({
    queryKey: ['saved-offers'],
    queryFn: () => offerService.getAll({}),
  });

  const offers = useMemo(
    () => (data?.items ?? []).filter((o: Offer) => savedIds.includes(o.id)),
    [data?.items, savedIds],
  );

  return (
    <AppLayout variant="tab" header={false}>
      <SavedScreenView
        offers={offers}
        onBack={() => navigation.goBack()}
        onOpenOffer={(offerId) => navigation.navigate(Routes.OfferDetails, { offerId })}
      />
    </AppLayout>
  );
};
