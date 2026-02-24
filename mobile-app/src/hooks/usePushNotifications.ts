import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { navigate } from '@/navigation/navigationRef';
import { getAuthState } from '@/store/authStore';

type PushTokenResult = {
  token: string | null;
  error?: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<PushTokenResult> {
  if (!Device.isDevice) {
    return { token: null, error: 'Push notifications require physical device' };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const finalStatus =
    existingStatus === 'granted'
      ? existingStatus
      : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus !== 'granted') {
    return { token: null, error: 'Permission not granted for push notifications' };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const tokenResponse = await Notifications.getDevicePushTokenAsync();
  return { token: tokenResponse.data };
}

export const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((res) => {
        if (res.token) setToken(res.token);
        if (res.error) setError(res.error);
      })
      .catch((err) => setError(String(err)));

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      const targetOffer = data.offerId as string | undefined;
      const targetBooking = data.bookingId as string | undefined;
      const isAuthed = Boolean(getAuthState().token);
      if (!isAuthed) return;
      if (targetOffer) {
        navigate('OfferDetails', { offerId: targetOffer } as any);
      } else if (targetBooking) {
        navigate('BookingDetails', { bookingId: targetBooking } as any);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { token, error };
};
