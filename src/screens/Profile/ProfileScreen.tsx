// Screen: ProfileScreen. Used in: RootNavigator.
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import ProfileScreenView from '@/components/Profile/ProfileScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '@/navigation/routes';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <AppLayout variant="tab" header={false}>
      <ProfileScreenView
        userName={user?.name}
        userInitial={user?.name ? user.name.charAt(0).toUpperCase() : ''}
        onBack={() => navigation.goBack()}
        onOpenAccount={() => navigation.navigate(Routes.EditProfile)}
        onOpenPayment={() => navigation.navigate(Routes.PaymentInfo)}
        onOpenTrips={() => navigation.navigate(Routes.Main, { screen: Routes.Bookings })}
        onLogout={logout}
      />
    </AppLayout>
  );
};

export default ProfileScreen;
