// Screen: AddCardScreen. Used in: RootNavigator via PaymentInfoScreen -> AddCard.
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import AddCardScreenView from '@/components/Profile/AddCardScreenView';
import { PaymentRepository } from '@/data/payment';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppLayout } from '@/layout/AppLayout';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';
import { Routes } from '@/navigation/routes';
import { useAuthStore } from '@/store/authStore';

export const AddCardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userId = useAuthStore((state) => state.user?.id);

  const handleSave = async (values: {
    holderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    saveCard: boolean;
  }) => {
    await PaymentRepository.addCard({
      userId: userId ?? 'guest',
      holderName: values.holderName,
      number: values.cardNumber,
      expiry: values.expiry,
      cvv: values.cvv,
      saveCard: values.saveCard,
    });
    navigation.goBack();
  };

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
      <AddCardScreenView onBack={() => navigation.goBack()} onSave={handleSave} />
    </AppLayout>
  );
};

export default AddCardScreen;
