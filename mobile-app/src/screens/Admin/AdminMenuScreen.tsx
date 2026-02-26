import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';

import AdminMenuScreenView, { type AdminMenuItem } from '@/components/Admin/AdminMenuScreenView';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const AdminMenuScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const greeting = `${t('profile.greeting')} ${t('profile.role.admin').toLowerCase()}`;

  const items = useMemo<AdminMenuItem[]>(
    () => [
      {
        id: 'users',
        title: t('profile.menu.users'),
        icon: 'account-multiple',
        onPress: () => navigation.navigate(Routes.AdminUsers),
      },
      {
        id: 'offers',
        title: t('profile.menu.offers'),
        icon: 'badge-account-horizontal-outline',
        onPress: () => navigation.navigate(Routes.AdminOffers),
      },
      {
        id: 'tools',
        title: t('profile.menu.tools'),
        icon: 'wrench',
        onPress: () => navigation.navigate(Routes.SettingsCenter),
      },
      {
        id: 'help',
        title: t('profile.menu.help'),
        icon: 'help-circle',
        onPress: () => navigation.navigate(Routes.HelpCenter),
      },
      {
        id: 'settings',
        title: t('profile.menu.settings'),
        icon: 'cog',
        onPress: () => navigation.navigate(Routes.SettingsCenter),
      },
      {
        id: 'messages',
        title: t('profile.menu.messages'),
        icon: 'bell',
        onPress: () => navigation.navigate(Routes.Main, { screen: 'Notifications' }),
      },
      {
        id: 'logout',
        title: t('profile.logout'),
        icon: 'logout',
        onPress: () => {
          void logout();
        },
      },
    ],
    [logout, navigation, t],
  );

  return (
    <AdminMenuScreenView
      title={greeting}
      items={items}
    />
  );
};

export default AdminMenuScreen;
