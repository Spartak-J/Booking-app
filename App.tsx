import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { QueryProvider } from '@/api/queryClient';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { RootNavigator } from '@/navigation/RootNavigator';
import { notificationService } from '@/services/notificationService';
import { useAuthStore } from '@/store/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function App() {
  const [ready, setReady] = useState(false);
  const { token: pushToken } = usePushNotifications();
  const { colors } = useThemeColors();

  useEffect(() => {
    if (pushToken) {
      notificationService
        .registerDevice(pushToken)
        .catch((err) => console.warn('Push token register error', err));
    }
  }, [pushToken]);

  useEffect(() => {
    useAuthStore
      .getState()
      .hydrate()
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <StatusBar style="light" backgroundColor={colors.primary} />
        <RootNavigator />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6fa',
  },
});
