import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';

import { LoginScreen } from '@/screens/Auth/LoginScreen';
import { RegisterScreen } from '@/screens/Auth/RegisterScreen';
import { BookingsScreen } from '@/screens/Bookings/BookingsScreen';
import { BookingDetailsScreen } from '@/screens/Bookings/BookingDetailsScreen';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { OfferDetailsScreen } from '@/screens/Offer/OfferDetailsScreen';
import { OwnerBookingsScreen } from '@/screens/Owner/OwnerBookingsScreen';
import { OwnerObjectFormScreen } from '@/screens/Owner/OwnerObjectFormScreen';
import { OwnerObjectsScreen } from '@/screens/Owner/OwnerObjectsScreen';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import { useAuthStore } from '@/store/authStore';
import { navigationRef } from '@/navigation/navigationRef';
import { useThemeColors } from '@/hooks/useThemeColors';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  OfferDetails: { offerId: string };
  BookingDetails: { bookingId: string };
  OwnerObjectForm: { offerId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Auth = createNativeStackNavigator();

const UserTabs = ({ colors }: { colors: any }) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      tabBarLabelStyle: { fontWeight: '600' },
    }}
  >
    <Tab.Screen name="Поиск" component={HomeScreen} />
    <Tab.Screen name="Брони" component={BookingsScreen} />
    <Tab.Screen name="Профиль" component={ProfileScreen} />
  </Tab.Navigator>
);

const OwnerTabs = ({ colors }: { colors: any }) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      tabBarLabelStyle: { fontWeight: '600' },
    }}
  >
    <Tab.Screen name="Объекты" component={OwnerObjectsScreen} />
    <Tab.Screen name="Бронирования" component={OwnerBookingsScreen} />
    <Tab.Screen name="Профиль" component={ProfileScreen} />
  </Tab.Navigator>
);

const UserTabsScreen = () => {
  const { colors } = useThemeColors();
  return <UserTabs colors={colors} />;
};

const OwnerTabsScreen = () => {
  const { colors } = useThemeColors();
  return <OwnerTabs colors={colors} />;
};

export const RootNavigator = () => {
  const role = useAuthStore((state) => state.role);
  const token = useAuthStore((state) => state.token);
  const { colors } = useThemeColors();

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    }),
    [colors],
  );

  return (
    <NavigationContainer theme={navTheme} ref={navigationRef}>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false, animation: 'fade' }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={role === 'owner' ? OwnerTabsScreen : UserTabsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OfferDetails"
              component={OfferDetailsScreen}
              options={({ route }) => ({
                title: route.params.offerId ? 'Детали' : 'Объект',
              })}
            />
            <Stack.Screen
              name="BookingDetails"
              component={BookingDetailsScreen}
              options={{ title: 'Бронь' }}
            />
            <Stack.Screen
              name="OwnerObjectForm"
              component={OwnerObjectFormScreen}
              options={({ route }) => ({
                title: route.params?.offerId ? 'Редактирование' : 'Новый объект',
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthStack = () => (
  <Auth.Navigator screenOptions={{ headerShown: false }}>
    <Auth.Screen name="Login" component={LoginScreen} />
    <Auth.Screen name="Register" component={RegisterScreen} />
  </Auth.Navigator>
);
