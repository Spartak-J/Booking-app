// Screen: OwnerHomesScreen. Entry point for owner's listings ("Моє житло").
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import OwnerHomesScreenView, { OwnerHomeItem } from '@/components/Owner/OwnerHomesScreenView';
import { AppLayout } from '@/layout/AppLayout';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTranslation } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { ownerOffersService } from '@/services/owner';
import { formatPrice } from '@/utils/price';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const OwnerHomesScreen = () => {
  const navigation = useNavigation<Navigation>();
  const owner = useAuthStore((state) => state.user);
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['owner-homes', owner?.id],
    queryFn: () => ownerOffersService.getOwnerOffers(owner?.id, {}),
  });

  const homes: OwnerHomeItem[] = (data?.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    address: item.address,
    city: item.city?.name,
    price: item.pricePerNight ? formatPrice(item.pricePerNight) : undefined,
    isActive: item.isActive,
    image: item.images?.[0],
    rating: item.rating,
    reviewsCount: item.reviews?.length ?? 0,
  }));

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

  return (
    <AppLayout
      variant="stack"
      header={false}
      footer={<HomeFooter items={footerItems} activeId="profile" />}
    >
      <OwnerHomesScreenView
        homes={homes}
        isLoading={isLoading}
        onBack={() => navigation.goBack()}
        onAdd={() => navigation.navigate(Routes.OwnerAddHome)}
        onOpen={(id) => navigation.navigate(Routes.OwnerAddHome, { offerId: id })}
        onEdit={(id) => navigation.navigate(Routes.OwnerAddHome, { offerId: id })}
        onOpenReviews={(id) => navigation.navigate(Routes.OwnerReviews, { offerId: id })}
        onOpenBookings={(id) =>
          navigation.navigate(Routes.Main, {
            screen: Routes.Bookings,
            params: { offerId: id },
          })
        }
        title={t('owner.tabs.listings')}
        addLabel={t('owner.objects.create')}
        emptyText={t('owner.objects.empty')}
        stateActiveLabel={`● ${t('owner.objects.status.active')}`}
        stateHiddenLabel={`○ ${t('owner.objects.status.hidden')}`}
        editLabel={t('common.edit') ?? 'Edit'}
        reviewsLabel={t('owner.reviews.title')}
        bookingsLabel={t('owner.tabs.bookings')}
      />
    </AppLayout>
  );
};

export default OwnerHomesScreen;
