import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AdminOfferDetailsScreenView from '@/components/Admin/AdminOfferDetailsScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { offersAdminService, type AdminOffer } from '@/services/admin';
import { useAuth } from '@/hooks/useAuth';

const AdminOfferDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AdminOfferDetails'>>();
  const [offer, setOffer] = useState<AdminOffer | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const item = await offersAdminService.getById(route.params.offerId);
      if (mounted) setOffer(item);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [route.params.offerId]);

  if (!offer) return null;

  return (
    <AppLayout variant="stack" header={false} edges={['top', 'left', 'right']}>
      <AdminOfferDetailsScreenView
        offer={offer}
        avatarInitial={(user?.name ?? 'A').charAt(0).toUpperCase()}
        onBack={() => navigation.goBack()}
        onWrite={() => navigation.navigate(Routes.Main, { screen: 'Notifications' })}
        onBlock={() => undefined}
      />
    </AppLayout>
  );
};

export default AdminOfferDetailsScreen;
