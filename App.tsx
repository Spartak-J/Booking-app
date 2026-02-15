import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Шрифты
import CagliostroRegular from './assets/fonts/Cagliostro-Regular.ttf';
import MontserratAlternatesRegular from './assets/fonts/MontserratAlternates-Regular.ttf';
import MontserratAlternatesMedium from './assets/fonts/MontserratAlternates-Medium.ttf';
import MontserratAlternatesBold from './assets/fonts/MontserratAlternates-Bold.ttf';

// Провайдеры и навигация
import { QueryProvider } from '@/api/queryClient';
import { RootNavigator } from '@/navigation/RootNavigator';

// Хуки и сервисы
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { notificationService } from '@/services/notificationService';
import { useAuthStore } from '@/store/authStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useLanguageStore } from '@/store/languageStore';
import { ThemeProvider, useTheme } from '@/theme';

// Экран загрузки
import { SplashScreen } from '@/screens/SplashScreen';

const AppContent = () => {
  const { tokens } = useTheme();
  useCurrencyStore((state) => state.currency);

  // Загрузка шрифтов
  const [fontsLoaded] = useFonts({
    'Cagliostro-Regular': CagliostroRegular,
    'MontserratAlternates-Regular': MontserratAlternatesRegular,
    'MontserratAlternates-Medium': MontserratAlternatesMedium,
    'MontserratAlternates-Bold': MontserratAlternatesBold,
  });

  const [ready, setReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  const { token: pushToken } = usePushNotifications();

  // Регистрация push-уведомлений
  useEffect(() => {
    if (pushToken) {
      notificationService
        .registerDevice(pushToken)
        .catch((err) => console.warn('Push token register error', err));
    }
  }, [pushToken]);

  // Гидратация хранилищ (Auth, Language)
  useEffect(() => {
    Promise.all([
      useAuthStore.getState().hydrate(),
      useLanguageStore.getState().hydrate(),
      useCurrencyStore.getState().hydrate(),
    ]).finally(() => {
      setReady(true);
    });
  }, []);

  // Стабильная ссылка на функцию завершения (предотвращает ре-рендеры сплэша)
  const handleFinish = useCallback(() => {
    setSplashVisible(false);
  }, []);

  // Условие отображения: SplashScreen висит, пока не загружены ресурсы ИЛИ идет анимация
  if (!fontsLoaded || !ready || splashVisible) {
    return <SplashScreen onFinish={handleFinish} />;
  }

  // Основное приложение после 5 секунд анимации
  return (
    <QueryProvider>
      <StatusBar style="light" backgroundColor={tokens.accent} translucent={false} />
      <RootNavigator />
    </QueryProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
