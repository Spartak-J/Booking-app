import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppLayout } from '@/layout/AppLayout';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SettingsScreenView from '@/components/Profile/SettingsScreenView';

export const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <AppLayout variant="stack">
      <SettingsScreenView
        onBack={() => navigation.goBack()}
        onOpenUsers={() => navigation.navigate(Routes.AdminUsers)}
        onOpenOffers={() => navigation.navigate(Routes.AdminOffers)}
        onOpenTools={() => navigation.navigate(Routes.AdminMenu)}
        onOpenMessages={() => navigation.navigate(Routes.Main, { screen: Routes.Notifications })}
      />
    </AppLayout>
  );
};

export default SettingsScreen;
