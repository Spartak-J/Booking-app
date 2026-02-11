// Screen: ProfileScreen. Used in: RootNavigator.
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from '@/hooks/useAuth';
import ProfileScreenView from '@/components/Profile/ProfileScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '@/navigation/routes';
import { useTranslation } from '@/i18n';

export const ProfileScreen = () => {
  const { user, role, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const isOwner = role === 'owner';
  const isAdmin = role === 'admin';

  const commonOwnerUserItems: Array<{
    id: string;
    title: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    onPress?: () => void;
  }> = [
    {
      id: 'account',
      title: t('profile.menu.account'),
      icon: 'account-outline',
      onPress: () => navigation.navigate(Routes.EditProfile),
    },
    {
      id: 'payment',
      title: t('profile.menu.payment'),
      icon: 'credit-card-outline',
      onPress: () => navigation.navigate(Routes.PaymentInfo),
    },
    {
      id: isOwner ? 'my-home' : 'my-trips',
      title: isOwner ? t('profile.menu.myHome') : t('profile.menu.trips'),
      icon: isOwner ? 'home-variant-outline' : 'bookmark-outline',
      onPress: () =>
        isOwner
          ? navigation.navigate(Routes.OwnerHomes)
          : navigation.navigate(Routes.Main, {
              screen: Routes.Bookings,
            }),
    },
    {
      id: 'help',
      title: t('profile.menu.help'),
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate(Routes.HelpCenter),
    },
    {
      id: 'privacy',
      title: t('profile.menu.privacy'),
      icon: 'shield-outline',
      onPress: () => navigation.navigate(Routes.PrivacyCenter),
    },
    {
      id: 'logout',
      title: t('profile.logout'),
      icon: 'logout',
      onPress: logout,
    },
  ];

  const adminItems: Array<{
    id: string;
    title: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    onPress?: () => void;
  }> = [
    {
      id: 'users',
      title: t('profile.menu.users'),
      icon: 'account-multiple-outline',
      onPress: () => navigation.navigate(Routes.AdminUsers),
    },
    {
      id: 'offers',
      title: t('profile.menu.offers'),
      icon: 'home-city-outline',
      onPress: () => navigation.navigate(Routes.AdminOffers),
    },
    {
      id: 'tools',
      title: t('profile.menu.tools'),
      icon: 'toolbox-outline',
      onPress: () => navigation.navigate(Routes.AdminMenu),
    },
    {
      id: 'help',
      title: t('profile.menu.help'),
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate(Routes.HelpCenter),
    },
    {
      id: 'settings',
      title: t('profile.menu.settings'),
      icon: 'cog-outline',
      onPress: () => navigation.navigate(Routes.SettingsCenter),
    },
    {
      id: 'messages',
      title: t('profile.menu.messages'),
      icon: 'message-text-outline',
      onPress: () => navigation.navigate(Routes.Main, { screen: Routes.Notifications }),
    },
    {
      id: 'logout',
      title: t('profile.logout'),
      icon: 'logout',
      onPress: logout,
    },
  ];

  return (
    <AppLayout variant="tab" header={false}>
      <ProfileScreenView
        userName={user?.name}
        userInitial={user?.name ? user.name.charAt(0).toUpperCase() : ''}
        onBack={() => navigation.goBack()}
        menuItems={isAdmin ? adminItems : commonOwnerUserItems}
      />
    </AppLayout>
  );
};

export default ProfileScreen;
