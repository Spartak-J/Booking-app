// Screen: AddCardScreen. Used in: RootNavigator via PaymentInfoScreen -> AddCard.
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, AppState, Linking } from 'react-native';
import axios from 'axios';

import AddCardScreenView from '@/components/Profile/AddCardScreenView';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppLayout } from '@/layout/AppLayout';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';
import { Routes } from '@/navigation/routes';
import { useAuthStore } from '@/store/authStore';
import { paymentService } from '@/services/payment';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const waitForAppReturn = (timeoutMs: number) =>
  new Promise<void>((resolve) => {
    if (AppState.currentState === 'active') {
      resolve();
      return;
    }

    let resolved = false;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !resolved) {
        resolved = true;
        sub.remove();
        resolve();
      }
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        sub.remove();
        resolve();
      }
    }, timeoutMs);
  });

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
    try {
      const normalizedUserId = String(userId ?? '').trim() || 'guest';
      const start = await paymentService.startTokenizeCard({
        userId: normalizedUserId,
        holderName: values.holderName,
        clientType: 'mobile',
      });

      if (start.redirectUrl) {
        await Linking.openURL(start.redirectUrl);
        await waitForAppReturn(180000);
      }

      let latestStatus = start.status;
      for (let attempt = 0; attempt < 90; attempt += 1) {
        await wait(2000);
        const statusResult = await paymentService.getTokenizeCardStatus(start.paymentId);
        latestStatus = statusResult.status;

        if (latestStatus === 'paid') {
          if (!statusResult.cardToken) {
            throw new Error('Токен картки не отримано від LiqPay.');
          }

          if (values.saveCard) {
            const card = statusResult.card;
            const expiryFromInput = values.expiry;
            const normalizedLast4 =
              card?.last4?.replace(/\D/g, '').slice(-4) ??
              values.cardNumber.replace(/\D/g, '').slice(-4);
            const normalizedExpiry = (card?.expiry ?? expiryFromInput ?? '').trim() || '--/--';
            const normalizedMasked =
              card?.numberMasked?.trim() ||
              `**** **** **** ${normalizedLast4 || values.cardNumber.replace(/\D/g, '').slice(-4)}`;

            if (!normalizedLast4 || normalizedLast4.length !== 4) {
              throw new Error('Не вдалося визначити останні 4 цифри картки.');
            }

            await paymentService.saveTokenizedCard({
              userId: normalizedUserId,
              holderName: values.holderName,
              cardToken: statusResult.cardToken,
              last4: normalizedLast4,
              numberMasked: normalizedMasked,
              brand: card?.brand ?? 'card',
              expiry: normalizedExpiry,
              saveCard: true,
            });
          }

          navigation.navigate(Routes.Main, { screen: Routes.Profile });
          return;
        }

        if (latestStatus === 'failed' || latestStatus === 'cancelled') {
          throw new Error('Не вдалося зберегти картку.');
        }
      }

      if (latestStatus !== 'paid') {
        throw new Error('Очікування токенізації перевищило таймаут.');
      }
    } catch (error) {
      let message = error instanceof Error ? error.message : 'Не вдалося зберегти картку.';
      if (axios.isAxiosError(error)) {
        const backendMessage =
          (error.response?.data as { message?: string; error?: string } | undefined)?.message ??
          (error.response?.data as { message?: string; error?: string } | undefined)?.error;
        message = backendMessage || error.message || message;
      }
      Alert.alert('Помилка', message);
    }
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
