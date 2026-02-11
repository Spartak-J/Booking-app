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
import { OwnerBookingsScreen } from '@/screens/Owner/OwnerBookingsScreen';

import { useAuthStore } from '@/store/authStore';
import { navigationRef } from '@/navigation/navigationRef';
import { AdminLightThemeProvider, getThemeColors, useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { OfferDetailsScreen } from '@/screens/Offer/OfferDetailsScreen';
import { OfferGalleryScreen } from '@/screens/Offer/OfferGalleryScreen';
import { BookingScreen } from '@/screens/Bookings/BookingScreen';
import { BookingDetailsScreen } from '@/screens/Bookings/BookingDetailsScreen';
import { BookingSuccessScreen } from '@/screens/Bookings/BookingSuccessScreen';
import { PastBookingDetailsScreen } from '@/screens/Bookings/PastBookingDetailsScreen';
import { SearchResultsScreen } from '@/screens/Home/SearchResultsScreen';
import { SavedScreen } from '@/screens/Saved/SavedScreen';
import { LandmarksScreen } from '@/screens/Landmarks/LandmarksScreen';
import { LandmarksSearchResultsScreen } from '@/screens/Landmarks/LandmarksSearchResultsScreen';
import { LandmarkDetailScreen } from '@/screens/Landmarks/LandmarkDetailScreen';
import { LandmarksCityScreen } from '@/screens/Landmarks/LandmarksCityScreen';
import { EditProfileScreen } from '@/screens/Profile/EditProfileScreen';
import { PaymentInfoScreen } from '@/screens/Profile/PaymentInfoScreen';
import { AddCardScreen } from '@/screens/Profile/AddCardScreen';
import { HelpScreen } from '@/screens/Profile/HelpScreen';
import { AboutScreen } from '@/screens/Profile/AboutScreen';
import { PrivacyScreen } from '@/screens/Profile/PrivacyScreen';
import { SettingsScreen } from '@/screens/Profile/SettingsScreen';
import { OwnerAddHomeScreen } from '@/screens/Owner/OwnerAddHomeScreen';
import { OwnerReviewsScreen } from '@/screens/Owner/OwnerReviewsScreen';
import AdminEntryScreen from '@/screens/Admin/AdminEntryScreen';
import AdminMenuScreen from '@/screens/Admin/AdminMenuScreen';
import AdminUsersScreen from '@/screens/Admin/AdminUsersScreen';
import AdminOffersScreen from '@/screens/Admin/AdminOffersScreen';
import AdminOfferDetailsScreen from '@/screens/Admin/AdminOfferDetailsScreen';
import { OwnerHomesScreen } from '@/screens/Owner/OwnerHomesScreen';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';

export type MainTabParamList = {
  Home: undefined;
  Notifications: undefined;
  Bookings: { offerId?: string } | undefined;
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
  LandmarksCity: { cityId?: string; cityName?: string } | undefined;
  LandmarksSearchResults: { cityId?: string; cityName?: string } | undefined;
  LandmarkDetail: { landmarkId: string } | undefined;
  Saved: undefined;
  OfferDetails: { offerId: string };
  OfferGallery: { offerId: string };
  Booking: { offerId: string };
  BookingDetails: { bookingId: string };
  BookingSuccess: { bookingId: string; offerId?: string; offerTitle?: string; totalPrice?: number };
  PastBookingDetails: {
    booking: {
      id: string;
      bookingId?: string;
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
  AdminEntry: undefined;
  AdminMenu: undefined;
  AdminUsers: undefined;
  AdminOffers: undefined;
  OwnerHomes: undefined;
  OwnerAddHome: { offerId?: string } | undefined;
  OwnerReviews: { offerId?: string } | undefined;
  EditProfile: undefined;
  PaymentInfo: undefined;
  AddCard: undefined;
  HelpCenter: undefined;
  AboutCenter: undefined;
  PrivacyCenter: undefined;
  SettingsCenter: undefined;
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
  const role = useAuthStore((state) => state.role);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={({ state, navigation, insets }) => {
        const activeRoute = state.routes[state.index];
        const activeId = getFooterIdByRoute(activeRoute.name);
        const items = BOTTOM_NAV_ITEMS.map((item) => ({
          ...item,
          label: item.id === 'bookings' && role === 'owner' ? t('owner.tabs.bookings') : item.label,
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
        return <HomeFooter items={items} activeId={activeId} bottomInset={insets.bottom} />;
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
        component={role === 'owner' ? OwnerBookingsScreen : BookingsScreen}
        options={{ tabBarLabel: role === 'owner' ? t('owner.tabs.bookings') : t('tabs.bookings') }}
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
  const role = useAuthStore((state) => state.role);
  const { colors } = useTheme();
  const isAdmin = role === 'admin';
  const navColors = isAdmin ? getThemeColors('light') : colors;

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: navColors.primary,
        background: navColors.background,
        card: navColors.surface,
        text: navColors.text,
        border: navColors.border,
      },
    }),
    [navColors],
  );

  const navigationTree = (
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
              {role === 'admin' ? (
                <Stack.Screen name="AdminMenu" component={AdminMenuScreen} />
              ) : (
                <Stack.Screen name="Main" component={MainTabs} />
              )}
              {role === 'admin' ? (
                <Stack.Screen name="Main" component={MainTabs} />
              ) : (
                <Stack.Screen name="AdminMenu" component={AdminMenuScreen} />
              )}
              <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
              <Stack.Screen name="Saved" component={SavedScreen} />
              <Stack.Screen name="Landmarks" component={LandmarksScreen} />
              <Stack.Screen name="LandmarksCity" component={LandmarksCityScreen} />
              <Stack.Screen name="LandmarksSearchResults" component={LandmarksSearchResultsScreen} />
              <Stack.Screen name="LandmarkDetail" component={LandmarkDetailScreen} />
              <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} />
              <Stack.Screen name="OfferGallery" component={OfferGalleryScreen} />
              <Stack.Screen name="Booking" component={BookingScreen} />
              <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
              <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
              <Stack.Screen name="PastBookingDetails" component={PastBookingDetailsScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="PaymentInfo" component={PaymentInfoScreen} />
              <Stack.Screen name="AddCard" component={AddCardScreen} />
              <Stack.Screen name="HelpCenter" component={HelpScreen} />
              <Stack.Screen name="AboutCenter" component={AboutScreen} />
              <Stack.Screen name="PrivacyCenter" component={PrivacyScreen} />
              <Stack.Screen name="SettingsCenter" component={SettingsScreen} />
              <Stack.Screen name="AdminEntry" component={AdminEntryScreen} />
              <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
              <Stack.Screen name="AdminOffers" component={AdminOffersScreen} />
              <Stack.Screen name="AdminOfferDetails" component={AdminOfferDetailsScreen} />
              <Stack.Screen name="OwnerHomes" component={OwnerHomesScreen} />
              <Stack.Screen name="OwnerAddHome" component={OwnerAddHomeScreen} />
              <Stack.Screen name="OwnerReviews" component={OwnerReviewsScreen} />
            </>
          )}
      </Stack.Navigator>
    </NavigationContainer>
  );

  if (isAdmin) {
    return <AdminLightThemeProvider>{navigationTree}</AdminLightThemeProvider>;
  }

  return navigationTree;
};
