// Screen: ProfileScreen. Used in: RootNavigator.
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import ProfileScreenView from '@/components/Profile/ProfileScreenView';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '@/navigation/routes';
import { ScreenContainer } from '@/ui';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <ProfileScreenView
        userName={user?.name}
        userInitial={user?.name ? user.name.charAt(0).toUpperCase() : ''}
        onBack={() => navigation.goBack()}
        onOpenAccount={() => navigation.navigate(Routes.EditProfile)}
        onOpenPayment={() => navigation.navigate(Routes.PaymentInfo)}
        onOpenTrips={() => navigation.navigate(Routes.Main, { screen: Routes.Bookings })}
        onLogout={logout}
      />
    </ScreenContainer>
  );
};

export default ProfileScreen;
