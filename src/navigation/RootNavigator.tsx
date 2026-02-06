// Navigation: RootNavigator and MainTabs. Used in: App root.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';

// Import your screens here
import { AuthTabsScreen } from '@/screens/Auth/AuthTabsScreen';
import { WelcomeScreen } from '@/screens/Auth/WelcomeScreen';
import { LoginScreen } from '@/screens/Auth/LoginScreen';
import { RegisterScreen } from '@/screens/Auth/RegisterScreen';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { BookingsScreen } from '@/screens/Bookings/BookingsScreen';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import { MessagesScreen } from '@/screens/Messages/MessagesScreen';

import { useAuthStore } from '@/store/authStore';
import { navigationRef } from '@/navigation/navigationRef';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { OfferDetailsScreen } from '@/screens/Offer/OfferDetailsScreen';
import { OfferGalleryScreen } from '@/screens/Offer/OfferGalleryScreen';
import { BookingScreen } from '@/screens/Bookings/BookingScreen';
import { BookingDetailsScreen } from '@/screens/Bookings/BookingDetailsScreen';
import { BookingSuccessScreen } from '@/screens/Bookings/BookingSuccessScreen';
import { PastBookingDetailsScreen } from '@/screens/Bookings/PastBookingDetailsScreen';
import { SearchResultsScreen } from '@/screens/Home/SearchResultsScreen';
import { LandmarksScreen } from '@/screens/Landmarks/LandmarksScreen';
import { LandmarksSearchResultsScreen } from '@/screens/Landmarks/LandmarksSearchResultsScreen';
import { EditProfileScreen } from '@/screens/Profile/EditProfileScreen';
import { PaymentInfoScreen } from '@/screens/Profile/PaymentInfoScreen';
import { AddCardScreen } from '@/screens/Profile/AddCardScreen';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';

export type MainTabParamList = {
  Home: undefined;
  Notifications: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  SearchResults: { filters?: any } | undefined;
  Landmarks: undefined;
  LandmarksSearchResults: undefined;
  OfferDetails: { offerId: string };
  OfferGallery: { offerId: string };
  Booking: { offerId: string };
  BookingDetails: { bookingId: string };
  BookingSuccess: { bookingId: string; offerId?: string; offerTitle?: string; totalPrice?: number };
  PastBookingDetails: {
    booking: {
      id: string;
      hotelId?: string;
      title: string;
      image: number;
      dates?: string;
      price?: string;
      location?: string;
      rating?: string;
      infoText?: string;
      amenities?: string[];
    };
  };
  AdminPanel: undefined;
  AdminUserDetails: { userId: string };
  AdminOfferDetails: { offerId: string };
  OwnerObjectForm: { offerId?: string };
  EditProfile: undefined;
  PaymentInfo: undefined;
  AddCard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const getFooterIdByRoute = (routeName: string) => {
  if (routeName === 'Home') return 'home';
  if (routeName === 'Notifications') return 'messages';
  if (routeName === 'Bookings') return 'bookings';
  if (routeName === 'Profile') return 'profile';
  return 'home';
};

const MainTabs = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={({ state, navigation }) => {
        const activeRoute = state.routes[state.index];
        const activeId = getFooterIdByRoute(activeRoute.name);
        const items = BOTTOM_NAV_ITEMS.map((item) => ({
          ...item,
          onPress: () =>
            navigation.navigate(
              item.id === 'home'
                ? 'Home'
                : item.id === 'messages'
                  ? 'Notifications'
                  : item.id === 'bookings'
                    ? 'Bookings'
                    : 'Profile',
            ),
        }));
        return <HomeFooter items={items} activeId={activeId} />;
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen
        name="Notifications"
        component={MessagesScreen}
        options={{ tabBarLabel: t('tabs.notifications') }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ tabBarLabel: t('tabs.bookings') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const token = useAuthStore((state) => state.token);
  const guestMode = useAuthStore((state) => state.guestMode);
  const { colors } = useTheme();

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.bgDark, // Use dark background
        card: colors.bgCard, // Use card background
        text: colors.surface, // Light text for dark theme
        border: colors.border,
      },
    }),
    [colors],
  );

  return (
    <NavigationContainer theme={navTheme} ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!token && !guestMode ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Auth" component={AuthTabsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="Landmarks" component={LandmarksScreen} />
            <Stack.Screen name="LandmarksSearchResults" component={LandmarksSearchResultsScreen} />
            <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} />
            <Stack.Screen name="OfferGallery" component={OfferGalleryScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
            <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
            <Stack.Screen name="PastBookingDetails" component={PastBookingDetailsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="PaymentInfo" component={PaymentInfoScreen} />
            <Stack.Screen name="AddCard" component={AddCardScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
