// Screen: PaymentInfoScreen. Used in: RootNavigator via ProfileScreen -> payment.
import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import PaymentInfoScreenView from '@/components/Profile/PaymentInfoScreenView';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentRepository } from '@/data/payment';
import type { PaymentCard } from '@/data/payment/types';
import { Routes } from '@/navigation/routes';
import { AppLayout } from '@/layout/AppLayout';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';
import { useAuthStore } from '@/store/authStore';

export const PaymentInfoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const userId = useAuthStore((state) => state.user?.id);

  const loadCards = useCallback(async () => {
    const normalizedUserId = String(userId ?? '').trim() || 'guest';
    const data = await PaymentRepository.getCards(normalizedUserId);
    setCards(data);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards]),
  );

  return (
    <AppLayout
      variant="stack"
      footer={
        <HomeFooter
          items={BOTTOM_NAV_ITEMS.map((item) => ({
            ...item,
            onPress: () => {
              const target =
                item.id === 'home'
                  ? Routes.Home
                  : item.id === 'messages'
                    ? Routes.Notifications
                    : item.id === 'bookings'
                      ? Routes.Bookings
                      : Routes.Profile;
              navigation.navigate(Routes.Main, { screen: target });
            },
          }))}
          activeId="profile"
        />
      }
    >
      <PaymentInfoScreenView
        cards={cards}
        onBack={() => navigation.goBack()}
        onAddCard={() => navigation.navigate(Routes.AddCard)}
      />
    </AppLayout>
  );
};

export default PaymentInfoScreen;
