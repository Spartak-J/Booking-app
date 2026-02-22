import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/layout/AppLayout';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HelpScreenView from '@/components/Profile/HelpScreenView';

export const HelpScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { role } = useAuth();

  return (
    <AppLayout variant="stack">
      <HelpScreenView
        role={role}
        onBack={() => navigation.goBack()}
        onOpenMessages={() => navigation.navigate(Routes.Main, { screen: Routes.Notifications })}
      />
    </AppLayout>
  );
};

export default HelpScreen;
